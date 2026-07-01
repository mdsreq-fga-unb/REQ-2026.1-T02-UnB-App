import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Network from 'expo-network';
import { useSQLiteContext } from 'expo-sqlite';
import {
  buscarAlvosSincronizacaoSigaa,
  sincronizarDisciplinasComSigaa,
  type AlvoSincronizacaoSigaa,
  type TurmaSigaaExtraida,
} from '../../database/queries/gradeQueries';

function parseSigaaPayload(payload: unknown): TurmaSigaaExtraida[] {
  try {
    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log('Payload do SIGAA Sync invalido:', error);
    return [];
  }
}

export function SigaaSync() {
  const db = useSQLiteContext();
  const [isNetworkOk, setIsNetworkOk] = useState(false);
  const [targets, setTargets] = useState<AlvoSincronizacaoSigaa[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    async function init() {
      const networkState = await Network.getNetworkStateAsync();
      
      if (networkState.isConnected && networkState.isInternetReachable !== false) {
         const alvosValidos = await buscarAlvosSincronizacaoSigaa(db);
         
         if (alvosValidos.length > 0) {
             console.log("🎯 Alvos Carregados para o Robô (Sniper):", alvosValidos.length, "disciplinas.");
             setTargets(alvosValidos);
             setIsNetworkOk(true);
         } else {
             setIsFinished(true); 
         }
      }
    }
    init();
  }, [db]);

  const GHOST_ROBOT_SCRIPT = `
    (function() {
      try {
        const TARGETS = ${JSON.stringify(targets)};
        const PERIODO_ALVO = TARGETS.length > 0 ? (TARGETS[0].ano + '.' + TARGETS[0].periodo) : '';
        const MAPA_HORARIOS = {
          M: {
            1: ['08:00', '08:55'],
            2: ['08:55', '09:50'],
            3: ['10:00', '10:55'],
            4: ['10:55', '11:50'],
            5: ['12:00', '12:55']
          },
          T: {
            1: ['12:55', '13:50'],
            2: ['14:00', '14:55'],
            3: ['14:55', '15:50'],
            4: ['16:00', '16:55'],
            5: ['16:55', '17:50'],
            6: ['18:00', '18:55']
          },
          N: {
            1: ['19:00', '19:50'],
            2: ['19:50', '20:40'],
            3: ['20:50', '21:40'],
            4: ['21:40', '22:30']
          }
        };

        function normalizarTexto(value) {
          return (value || '')
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .replace(/\\s*\\(\\d+\\s*h\\)\\s*/gi, '')
            .replace(/\\s+/g, ' ')
            .trim()
            .toUpperCase();
        }

        function docentesCorrespondem(alvo, textoSigaa) {
          const sigaa = normalizarTexto(textoSigaa);
          if (!sigaa) return false;
          return (alvo || '')
            .split(/\\s*[\\/;\\n,]+\\s*/)
            .map(normalizarTexto)
            .filter(Boolean)
            .some(docente => sigaa.includes(docente) || docente.includes(sigaa));
        }

        function assinaturaHorarioSigaa(horarioTexto) {
          const codigos = (horarioTexto || '').split('(')[0].match(/\\d+[MTN]\\d+/gi) || [];
          const partes = [];

          codigos.forEach(codigo => {
            const match = codigo.match(/^(\\d+)([MTN])(\\d+)$/i);
            if (!match) return;

            const dias = match[1].split('').map(Number);
            const turno = match[2].toUpperCase();
            const blocos = match[3].split('').map(Number);

            dias.forEach(dia => {
              blocos.forEach(bloco => {
                const faixa = MAPA_HORARIOS[turno] && MAPA_HORARIOS[turno][bloco];
                if (faixa) {
                  partes.push([dia, faixa[0], faixa[1]].join('|'));
                }
              });
            });
          });

          return partes.sort().join('||');
        }
        
        // Dicionário de Mapeamento UnB (Prefixo e ID do Departamento)
        const MAPA_UNIDADES = {
          'FGA': '673', // CAMPUS UNB GAMA
          'DSC': '420', // DEPTO SAUDE COLETIVA
          'MAT': '518', // DEPTO MATEMATICA
          'IFD': '524', // INSTITUTO DE FISICA
          'EST': '514', // DEPTO ESTATISTICA
          'CIC': '508', // DEPTO CIENCIAS DA COMPUTACAO
          'IQ':  '610'  // INSTITUTO DE QUIMICA
        };

        // Descobre exatamente quais unidades precisamos pesquisar (Remove duplicatas)
        let unidadesParaPesquisar = [];
        TARGETS.forEach(t => {
           // Pega apenas as letras do código (Ex: "FGA0170" -> "FGA")
           const prefixo = t.codigo_disciplina.replace(/[0-9]/g, ''); 
           const idUnidade = MAPA_UNIDADES[prefixo];
           
           if (idUnidade && !unidadesParaPesquisar.includes(idUnidade)) {
               unidadesParaPesquisar.push(idUnidade);
           }
        });

        let found = JSON.parse(sessionStorage.getItem('unb_found') || '{}');
        let foundScores = JSON.parse(sessionStorage.getItem('unb_found_scores') || '{}');
        let currentIndex = parseInt(sessionStorage.getItem('unb_index') || '0');
        
        const allFound = TARGETS.every(t => found[t.codigo_disciplina]);
        if (allFound || unidadesParaPesquisar.length === 0) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SYNC_SUCCESS', payload: Object.values(found) }));
           sessionStorage.clear();
           return;
        }

        // Tabela de Resultados
        const divResultados = document.getElementById('turmasAbertas');
        if (divResultados) {
           const linhas = divResultados.querySelectorAll('tbody tr');
           let currentCode = '';

           linhas.forEach(linha => {
              if (linha.classList.contains('agrupador')) {
                 const titulo = linha.querySelector('.tituloDisciplina');
                 if (titulo) {
                     currentCode = titulo.innerText.split(' - ')[0].trim();
                 }
              } 
              else if (linha.classList.contains('linhaPar') || linha.classList.contains('linhaImpar')) {
                 const targetObj = TARGETS.find(t => t.codigo_disciplina === currentCode);
                 
                 if (targetObj) {
                    const tdTurma = linha.querySelector('.turma');
                    const tds = linha.querySelectorAll('td');
                    const anoPeriodoTxt = (linha.querySelector('.anoPeriodo') || tds[1])?.innerText.trim();
                    
                    if (tdTurma && tds.length >= 4 && anoPeriodoTxt === PERIODO_ALVO) {
                       const turmaNum = tdTurma.innerText.trim();
                       const docenteTxt = tds[2].innerText.trim();
                       const horarioTxt = tds[3].innerText.trim();
                       const horarioLimpo = horarioTxt.split('(')[0].trim();
                       const localTxt = tds.length > 0 ? tds[tds.length - 1].innerText.trim() : 'A designar';
                       const assinaturaHorario = assinaturaHorarioSigaa(horarioTxt);

                       const turmaConfere = normalizarTexto(turmaNum) === normalizarTexto(targetObj.codigo_turma);
                       const docenteConfere = docentesCorrespondem(targetObj.docente_nome, docenteTxt);
                       const horarioConfere = !!targetObj.horarios_assinatura && targetObj.horarios_assinatura === assinaturaHorario;

                       let score = 0;
                       if (turmaConfere) score += 3;
                       if (docenteConfere) score += 2;
                       if (horarioConfere) score += 2;

                       const matchConfiavel =
                         (turmaConfere && (docenteConfere || horarioConfere)) ||
                         (docenteConfere && horarioConfere);

                       if (matchConfiavel && score > (foundScores[currentCode] || 0)) {
                          foundScores[currentCode] = score;
                          found[currentCode] = {
                             codigo_disciplina: currentCode,
                             turma: turmaNum,
                             docente_nome: docenteTxt,
                             horario_sigaa: horarioLimpo,
                             local_sigaa: localTxt,
                             ano: targetObj.ano,
                             periodo: targetObj.periodo
                          };
                       }
                    }
                 }
              }
           });
           
           sessionStorage.setItem('unb_found', JSON.stringify(found));
           sessionStorage.setItem('unb_found_scores', JSON.stringify(foundScores));
           window.location.href = 'https://sigaa.unb.br/sigaa/public/turmas/listar.jsf';
           return;
        }

        // A Pesquisa nos Departamentos
        const form = document.getElementById('formTurma');
        const selectDepto = document.getElementById('formTurma:inputDepto');
        const inputAno = document.getElementById('formTurma:inputAno');
        const inputPeriodo = document.getElementById('formTurma:inputPeriodo');
        const inputNivel = document.getElementById('formTurma:inputNivel');
        
        if (form && selectDepto) {
           if (currentIndex < unidadesParaPesquisar.length) {
              selectDepto.value = unidadesParaPesquisar[currentIndex]; // Insere o ID exato!
              if (inputAno && TARGETS[0]?.ano) inputAno.value = String(TARGETS[0].ano);
              if (inputPeriodo && TARGETS[0]?.periodo) inputPeriodo.value = String(TARGETS[0].periodo);
              if (inputNivel) inputNivel.value = 'G';
              sessionStorage.setItem('unb_index', currentIndex + 1);
              
              const botoes = document.querySelectorAll('input[type="submit"]');
              let btnSubmit = null;
              for (let i = 0; i < botoes.length; i++) {
                 if (botoes[i].value && botoes[i].value.toUpperCase().includes('BUSCAR')) {
                    btnSubmit = botoes[i];
                    break;
                 }
              }

              if (btnSubmit) {
                 btnSubmit.click();
              } else {
                 window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: 'Botão Buscar não encontrado.' }));
              }
           } else {
              // Ja pesquisamos os departamentos-alvo
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SYNC_SUCCESS', payload: Object.values(found) }));
              sessionStorage.clear();
           }
        }
      } catch(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: e.message }));
      }
    })();
    true;
  `;

  const handleWebViewMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'SYNC_SUCCESS') {
      console.log('✅ Extração Sniper Concluída com Sucesso:');
      console.log(JSON.stringify(data.payload, null, 2));
      const resultado = await sincronizarDisciplinasComSigaa(
        db,
        parseSigaaPayload(data.payload)
      );

      if (resultado.atualizadas > 0) {
        console.log('Grade atualizada com dados do SIGAA:', resultado);
      } else {
        console.log('Grade ja equivalente ao SIGAA:', resultado);
      }
      setIsFinished(true);
    }

    if (data.type === 'ERROR') {
      console.log('❌ Falha na sincronização:', data.error);
      setIsFinished(true);
    }
  };

  if (!isNetworkOk || targets.length === 0 || isFinished) return null;

  return (
    <View style={{ width: 0, height: 0, opacity: 0 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://sigaa.unb.br/sigaa/public/turmas/listar.jsf' }}
        injectedJavaScript={GHOST_ROBOT_SCRIPT}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
      />
    </View>
  );
}
