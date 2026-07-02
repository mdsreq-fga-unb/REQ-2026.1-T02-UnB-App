

export type DisciplinaExtraida = {
  codigo: string;
  nome: string;
  turma: string;
  docentes: string[];
  local: string;
  horarios: string[];
  situacao?: string;
  ano?: number;
  periodo?: number;
};

export type InfoAluno = {
  matricula: string;
  nome: string;
  curso: string;
  periodoLetivo: string;
  ano: number;
  semestre: number;
  cpf?: string;
};

export function extrairDadosDoPDF(texto: string): { aluno: InfoAluno | null; disciplinas: DisciplinaExtraida[] } {
  const disciplinas: DisciplinaExtraida[] = [];
  let aluno: InfoAluno | null = null;

  try {
    // 1. Extração das Informações Básicas do Aluno
    const matriculaMatch = texto.match(/Matrícula:\s*(\d+)/i) || texto.match(/(\d{9})/);
    const matricula = matriculaMatch ? matriculaMatch[1] : '000000000';

    const nomeMatch = texto.match(/Nome:\s*(.+)/i);
    let nome = nomeMatch ? nomeMatch[1].trim() : 'ALUNO NÃO IDENTIFICADO';
    if (nome.toLowerCase().includes('matrícula')) {
        nome = nome.substring(0, nome.toLowerCase().indexOf('matrícula')).trim();
    }

    const cursoMatch = texto.match(/Curso:\s*(.+)/i);
    let curso = cursoMatch ? cursoMatch[1].trim() : 'CURSO NÃO IDENTIFICADO';
    if (curso.toLowerCase().includes('status:')) {
        curso = curso.substring(0, curso.toLowerCase().indexOf('status:')).trim();
    }

    const periodoMatch = texto.match(/Período Letivo:\s*(\d{4})\.(\d)/i);
    const anoDefault = periodoMatch ? parseInt(periodoMatch[1], 10) : new Date().getFullYear();
    const semestreDefault = periodoMatch ? parseInt(periodoMatch[2], 10) : 1;
    const periodoLetivo = `${anoDefault}.${semestreDefault}`;

    aluno = { matricula, nome, curso, periodoLetivo, ano: anoDefault, semestre: semestreDefault };

    const isHistorico = texto.toUpperCase().includes('HISTÓRICO ESCOLAR') || texto.toUpperCase().includes('COMPONENTES CURRICULARES CURSADOS');

    if (isHistorico) {
        // --- PARSER DE HISTÓRICO ESCOLAR ---
        let endOfHistorico = texto.toUpperCase().indexOf("LEGENDA");
        if (endOfHistorico === -1) endOfHistorico = texto.toUpperCase().indexOf("COMPONENTES CURRICULARES OBRIGATÓRIOS PENDENTES");
        if (endOfHistorico === -1) endOfHistorico = texto.length;

        const textoHistorico = texto.substring(0, endOfHistorico);
        const regexCodigo = /([A-Z]{3}\d{4})/g;
        let match;
        const blocosIniciais: { index: number; codigo: string }[] = [];
        
        while ((match = regexCodigo.exec(textoHistorico)) !== null) {
            blocosIniciais.push({ index: match.index, codigo: match[1] });
        }
        
        for (let i = 0; i < blocosIniciais.length; i++) {
            const start = blocosIniciais[i].index;
            const end = i + 1 < blocosIniciais.length ? blocosIniciais[i + 1].index : textoHistorico.length;
            const textBefore = textoHistorico.substring(0, start);
            
            let ano = anoDefault;
            let periodo = semestreDefault;
            const anoPeriodoMatches = textBefore.match(/([12]\d{3})\.([12])/g);
            if (anoPeriodoMatches) {
                const lastMatch = anoPeriodoMatches[anoPeriodoMatches.length - 1];
                const parts = lastMatch.match(/([12]\d{3})\.([12])/);
                if (parts) {
                    ano = parseInt(parts[1], 10);
                    periodo = parseInt(parts[2], 10);
                }
            }
            
            const codigo = blocosIniciais[i].codigo;
            const bloco = textoHistorico.substring(start, end).trim();
            const textAfterCode = bloco.substring(codigo.length).trim();
            
            const colunasRegex = /(?:^|\s)(\d{1,3})\s+([A-Z0-9-]{1,3})\s+([\d,-]{1,5})\s+([A-Z-]{1,2})\s+([A-Z]{3,5})(?:\s|$)/i;
            const matchColunas = textAfterCode.match(colunasRegex);
            
            let nomeDisciplina = textAfterCode;
            let turma = '01';
            let situacao = 'MATR';
            let docentes: string[] = [];
            
            if (matchColunas) {
                nomeDisciplina = textAfterCode.substring(0, matchColunas.index).trim();
                turma = matchColunas[2] !== '-' ? matchColunas[2] : '01';
                situacao = matchColunas[5].toUpperCase();
                
                const restOfBlock = textAfterCode.substring(matchColunas.index! + matchColunas[0].length).trim();
                if (restOfBlock) {
                    const docSplit = restOfBlock.replace(/\(\d+h\)/gi, '').split(/,\s*|\n/);
                    docentes = docSplit.map(d => d.trim()).filter(d => d.length > 3 && !d.match(/^[12]\d{3}\.[12]/) && !['*', 'o', '#', '-'].includes(d));
                }
            } else {
                const tokens = textAfterCode.split(/\s+/);
                const validSituacoes = ['APR', 'REP', 'TRANC', 'MATR', 'CUMP', 'CANC', 'DISP', 'REPF', 'REPMF', 'SR', 'MM', 'SS', 'MS', 'MI', 'II'];
                for (let k = tokens.length - 1; k >= Math.max(0, tokens.length - 8); k--) {
                    const t = tokens[k].toUpperCase();
                    if (validSituacoes.includes(t)) {
                        situacao = t;
                        nomeDisciplina = tokens.slice(0, k).join(' ').replace(/\d{1,3}\s+[A-Z0-9-]{1,3}\s+[\d,-]{1,5}\s+[A-Z-]{1,2}$/i, '').trim();
                        const restOfBlock = tokens.slice(k + 1).join(' ').trim();
                        if (restOfBlock) {
                            const docSplit = restOfBlock.replace(/\(\d+h\)/gi, '').split(/,\s*|\n/);
                            docentes = docSplit.map(d => d.trim()).filter(d => d.length > 3 && !d.match(/^[12]\d{3}\.[12]/) && !['*', 'o', '#', '-'].includes(d));
                        }
                        break;
                    }
                }
            }
            
            if (docentes.length === 0) docentes = ['A definir'];
            
            nomeDisciplina = nomeDisciplina.replace(/\s*\n\s*/g, ' ');
            
            if (nomeDisciplina.length > 2) {
                const existingIndex = disciplinas.findIndex(d => d.codigo === codigo && d.ano === ano && d.periodo === periodo);
                if (existingIndex === -1) {
                    disciplinas.push({
                        codigo,
                        nome: nomeDisciplina,
                        turma,
                        docentes,
                        local: 'A designar',
                        horarios: [],
                        situacao,
                        ano,
                        periodo
                    });
                }
            }
        }

        if (disciplinas.length > 0) {
            let highestAno = 0;
            let highestPeriodo = 0;
            for (const d of disciplinas) {
                if (d.ano && d.ano > highestAno) {
                    highestAno = d.ano;
                    highestPeriodo = d.periodo || 1;
                } else if (d.ano === highestAno && d.periodo && d.periodo > highestPeriodo) {
                    highestPeriodo = d.periodo;
                }
            }
            if (aluno) {
                aluno.ano = highestAno;
                aluno.semestre = highestPeriodo;
                aluno.periodoLetivo = `${highestAno}.${highestPeriodo}`;
            }
        }
    } else {
        // --- PARSER DE COMPROVANTE DE MATRÍCULA (Código original) ---
        const textoTabelaHorariosIndex = texto.toUpperCase().indexOf("TABELA DE HORÁRIOS");
        const textoParaBusca = textoTabelaHorariosIndex !== -1 ? texto.substring(0, textoTabelaHorariosIndex) : texto;

        const regexCodigo = /([A-Z]{3}\d{4})/g;
        let match;
        const blocosIniciais: { index: number; codigo: string }[] = [];
        
        while ((match = regexCodigo.exec(textoParaBusca)) !== null) {
          blocosIniciais.push({ index: match.index, codigo: match[1] });
        }

        for (let i = 0; i < blocosIniciais.length; i++) {
          const start = blocosIniciais[i].index;
          let end = i + 1 < blocosIniciais.length ? blocosIniciais[i + 1].index : texto.length;
          
          if (textoTabelaHorariosIndex !== -1 && textoTabelaHorariosIndex > start && textoTabelaHorariosIndex < end) {
             end = textoTabelaHorariosIndex;
          }

          const bloco = texto.substring(start, end).trim();
          const linhas = bloco.split('\n').map(l => l.trim()).filter(Boolean);

          const codigo = blocosIniciais[i].codigo;
          let nomeDisciplina = '';
          let turma = '01';
          let docentes: string[] = [];
          let local = 'A designar';
          let horarios: string[] = [];

          const firstLine = linhas[0];
          const nameRegex = new RegExp(`^${codigo}\\s+(.*?)(?:\\s+([A-Z0-9]{1,3})\\s+MATRICULADO|\\s+\\d+[MTN]\\d+|$)`, 'i');
          const matchName = firstLine.match(nameRegex);
          if (matchName && matchName[1]) {
              nomeDisciplina = matchName[1].trim();
              nomeDisciplina = nomeDisciplina.replace(/\s*\(\d{2}\/\d{2}\/\d{4}.*$/, '').trim();
              if (matchName[2]) turma = matchName[2].toUpperCase();
          }
          
          const localMatch = bloco.match(/Local:\s*(.+?)(?=\n|$|\s{2,})/);
          if (localMatch) local = localMatch[1].trim();

          if (turma === '01') {
              const turmaMatch = bloco.match(/\b([A-Z0-9]{1,3})\b\s*MATRICULADO/i) || bloco.match(/\b(T\d{2}|\d{2})\b/i);
              if (turmaMatch) turma = turmaMatch[1].toUpperCase();
          }

          const horarioRegex = /\b(\d+[MTN]\d+)\b/gi;
          let horMatch;
          while ((horMatch = horarioRegex.exec(bloco)) !== null) {
             const h = horMatch[1].toUpperCase();
             if (!horarios.includes(h)) horarios.push(h);
          }

          let extraTextBeforeLocal: string[] = [];
          let extraTextAfterLocal: string[] = [];
          let passedLocal = false;

          for (let j = 1; j < Math.min(linhas.length, 10); j++) {
              let linha = linhas[j];
              if (linha.startsWith('Local:')) {
                  passedLocal = true;
                  continue;
              }
              if (linha.includes('Tipo:') || linha.includes('MATRICULADO')) continue;
              
              let cleanLinha = linha.replace(/\s*\(\d{2}\/\d{2}\/\d{4}.*$/, '')
                                    .replace(/\s*\d{2}\/\d{2}\/\d{4}\)?$/, '')
                                    .replace(/\s*-\s*$/, '')
                                    .trim();
              
              if (!cleanLinha || /^\d{2}$/.test(cleanLinha) || /^\d+[MTN]\d+/.test(cleanLinha)) continue;

              if (passedLocal) {
                  extraTextAfterLocal.push(cleanLinha);
              } else {
                  extraTextBeforeLocal.push(cleanLinha);
              }
          }

          if (extraTextAfterLocal.length > 0) {
              if (extraTextBeforeLocal.length > 0) {
                  nomeDisciplina += ' ' + extraTextBeforeLocal.join(' ');
              }
              const joinedDocentes = extraTextAfterLocal.join(' ');
              const separar = joinedDocentes.split(/\s+e\s+|\s*\/\s*/i);
              docentes.push(...separar.map(x => x.trim()));
          } else {
              let splitIdx = extraTextBeforeLocal.length;
              const preposicoes = ['DE', 'DO', 'DA', 'DOS', 'DAS', 'E', 'EM', 'COM', 'PARA', 'A', 'O', 'OS', 'AS', 'NO', 'NA', 'NOS', 'NAS'];
              
              if (extraTextBeforeLocal.length === 1) {
                  const str = extraTextBeforeLocal[0];
                  const words = str.split(' ').length;
                  const lastWordOfNome = nomeDisciplina.trim().split(' ').pop()?.toUpperCase() || '';
                  
                  if (words >= 3 || str.includes(' e ') || str.includes(' / ') || str.toUpperCase().includes('A DEFINIR') || str.toUpperCase().includes('A DESIGNAR')) {
                      splitIdx = 0;
                  } else if (!preposicoes.includes(lastWordOfNome) && words >= 2) {
                      splitIdx = 0;
                  }
              } else if (extraTextBeforeLocal.length > 1) {
                  for (let k = 0; k < extraTextBeforeLocal.length; k++) {
                      const str = extraTextBeforeLocal[k];
                      const words = str.split(' ').length;
                      
                      if (str.includes(' e ') || str.includes(' / ') || str.toUpperCase().includes('A DEFINIR') || str.toUpperCase().includes('A DESIGNAR')) {
                          splitIdx = k;
                          break;
                      }
                      
                      if (k === extraTextBeforeLocal.length - 1) {
                          const lastWordOfNome = (k > 0 ? extraTextBeforeLocal[k-1] : nomeDisciplina).trim().split(' ').pop()?.toUpperCase() || '';
                          if (words >= 3) {
                              splitIdx = k;
                              break;
                          } else if (!preposicoes.includes(lastWordOfNome) && words >= 2) {
                              splitIdx = k;
                              break;
                          }
                      }
                  }
                  
                  if (splitIdx === extraTextBeforeLocal.length) {
                      const lastStr = extraTextBeforeLocal[extraTextBeforeLocal.length - 1];
                      const prevStr = extraTextBeforeLocal[extraTextBeforeLocal.length - 2];
                      if (lastStr.split(' ').length < 3 && prevStr.split(' ').length >= 3) {
                          if (!lastStr.toUpperCase().includes('A DEFINIR') && !lastStr.toUpperCase().includes('A DESIGNAR')) {
                              splitIdx = extraTextBeforeLocal.length - 2;
                          } else {
                              splitIdx = extraTextBeforeLocal.length - 1;
                          }
                      }
                  }
              }

              const nameLines = extraTextBeforeLocal.slice(0, splitIdx);
              const docenteLines = extraTextBeforeLocal.slice(splitIdx);
              
              if (nameLines.length > 0) {
                  nomeDisciplina += ' ' + nameLines.join(' ');
              }
              if (docenteLines.length > 0) {
                  const joinedDocentes = docenteLines.join(' ');
                  const separar = joinedDocentes.split(/\s+e\s+|\s*\/\s*/);
                  docentes.push(...separar.map(x => x.trim()));
              }
          }

          if (docentes.length === 0) docentes = ['A definir'];

          if (codigo && nomeDisciplina) {
             const existingIndex = disciplinas.findIndex(d => d.codigo === codigo);
             if (existingIndex === -1) {
                disciplinas.push({
                  codigo,
                  nome: nomeDisciplina,
                  turma,
                  docentes,
                  local,
                  horarios,
                  situacao: 'MATR'
                });
             }
          }
        }
    }
  } catch (err) {
    console.error("Erro ao analisar texto do PDF:", err);
  }

  return { aluno, disciplinas };
}
