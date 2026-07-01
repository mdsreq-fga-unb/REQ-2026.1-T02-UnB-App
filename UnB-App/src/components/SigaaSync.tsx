import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Network from 'expo-network';
import { useSQLiteContext } from 'expo-sqlite';
import {
  buscarTodasDisciplinas,
  sincronizarDisciplinasComSigaa,
  type TurmaSigaaExtraida,
} from '../../database/queries/gradeQueries';

interface TargetDisciplina {
  codigo_disciplina: string;
  codigo_turma: string;
  docente_nome: string;
}

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
  const [targets, setTargets] = useState<TargetDisciplina[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    async function init() {
      const networkState = await Network.getNetworkStateAsync();
      
      if (networkState.isConnected && networkState.isInternetReachable !== false) {
         const disciplinas = await buscarTodasDisciplinas(db);
         const alvosValidos: TargetDisciplina[] = disciplinas
          .filter(d => d.codigo_disciplina && d.codigo_turma)
          .map(d => ({
            codigo_disciplina: d.codigo_disciplina,
            codigo_turma: d.codigo_turma,
            docente_nome: d.docente_nome || ''
          }));
         
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
                 
                 if (targetObj && !found[currentCode]) {
                    const tdTurma = linha.querySelector('.turma');
                    const tds = linha.querySelectorAll('td');
                    
                    if (tdTurma && tds.length >= 4) {
                       const turmaNum = tdTurma.innerText.trim();
                       const profTexto = tds[2].innerText.toUpperCase();
                       const profAlvo = targetObj.docente_nome ? targetObj.docente_nome.toUpperCase().split(' ')[0] : '';
                       
                       const isExactMatch = (turmaNum === targetObj.codigo_turma) || (profAlvo && profTexto.includes(profAlvo));
                       
                       if (isExactMatch) {
                          const horarioTxt = tds[3].innerText.trim();
                          const horarioLimpo = horarioTxt.split('(')[0].trim(); 
                          const localTxt = tds.length > 0 ? tds[tds.length - 1].innerText.trim() : 'A designar';

                          found[currentCode] = {
                             codigo_disciplina: currentCode,
                             turma: turmaNum,
                             docente_nome: tds[2].innerText.trim(),
                             horario_sigaa: horarioLimpo,
                             local_sigaa: localTxt
                          };
                       }
                    }
                 }
              }
           });
           
           sessionStorage.setItem('unb_found', JSON.stringify(found));
           window.location.href = 'https://sigaa.unb.br/sigaa/public/turmas/listar.jsf';
           return;
        }

        // A Pesquisa nos Departamentos
        const form = document.getElementById('formTurma');
        const selectDepto = document.getElementById('formTurma:inputDepto');
        
        if (form && selectDepto) {
           if (currentIndex < unidadesParaPesquisar.length) {
              selectDepto.value = unidadesParaPesquisar[currentIndex]; // Insere o ID exato!
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
