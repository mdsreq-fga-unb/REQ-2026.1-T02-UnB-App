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
    // 1. Extração das Informações do Aluno
    const matriculaMatch = texto.match(/Matrícula:\s*(\d+)/i) || texto.match(/(\d{9})/);
    const matricula = matriculaMatch ? matriculaMatch[1] : '000000000';

    const nomeMatch = texto.match(/Nome:\s*(.+)/i);
    const nome = nomeMatch ? nomeMatch[1].trim() : 'ALUNO NÃO IDENTIFICADO';

    const cursoMatch = texto.match(/Curso:\s*(.+)/i);
    const curso = cursoMatch ? cursoMatch[1].trim() : 'CURSO NÃO IDENTIFICADO';

    const periodoMatch = texto.match(/Período Letivo:\s*(\d{4})\.(\d)/i);
    const ano = periodoMatch ? parseInt(periodoMatch[1], 10) : new Date().getFullYear();
    const semestre = periodoMatch ? parseInt(periodoMatch[2], 10) : 1;
    const periodoLetivo = `${ano}.${semestre}`;

    aluno = { matricula, nome, curso, periodoLetivo, ano, semestre };

    // 2. Extração das Turmas Matriculadas
    // Procuramos o padrão: Código da Disciplina (ex: FGA0003 ou CIC0004), seguido do Nome, Docente, Tipo, Local, Turma, Status, Horários.
    // Como a ordem no texto pode variar dependendo do PDFBox/PDFKit, vamos usar blocos baseados no código.
    
    // Identifica todos os códigos de disciplina apenas ANTES da Tabela de Horários
    const textoTabelaHorariosIndex = texto.toUpperCase().indexOf("TABELA DE HORÁRIOS");
    const textoParaBusca = textoTabelaHorariosIndex !== -1 ? texto.substring(0, textoTabelaHorariosIndex) : texto;

    const regexCodigo = /([A-Z]{3}\d{4})/g;
    let match;
    const blocosIniciais: { index: number; codigo: string }[] = [];
    
    while ((match = regexCodigo.exec(textoParaBusca)) !== null) {
      blocosIniciais.push({ index: match.index, codigo: match[1] });
    }

    // Processa os blocos a partir da posição de cada código
    for (let i = 0; i < blocosIniciais.length; i++) {
      const start = blocosIniciais[i].index;
      // O bloco vai até o início da próxima disciplina, ou até o fim de "Tabela de Horários:" ou fim do texto.
      let end = i + 1 < blocosIniciais.length ? blocosIniciais[i + 1].index : texto.length;
      
      if (textoTabelaHorariosIndex !== -1 && textoTabelaHorariosIndex > start && textoTabelaHorariosIndex < end) {
         end = textoTabelaHorariosIndex;
      }

      const bloco = texto.substring(start, end).trim();
      const linhas = bloco.split('\n').map(l => l.trim()).filter(Boolean);

      // 1. Extração do código
      const codigo = blocosIniciais[i].codigo;
      
      let nome = '';
      let turma = '01'; // Default
      let docentes: string[] = [];
      let local = 'A designar';
      let horarios: string[] = [];

      // 2. Extração do Nome (primeira parte) a partir da primeira linha
      const firstLine = linhas[0];
      const nameRegex = new RegExp(`^${codigo}\\s+(.*?)(?:\\s+([A-Z0-9]{1,3})\\s+MATRICULADO|\\s+\\d+[MTN]\\d+|$)`, 'i');
      const matchName = firstLine.match(nameRegex);
      if (matchName && matchName[1]) {
          nome = matchName[1].trim();
          // Remove datas perdidas no final do nome
          nome = nome.replace(/\s*\(\d{2}\/\d{2}\/\d{4}.*$/, '').trim();
          
          if (matchName[2]) {
              turma = matchName[2].toUpperCase();
          }
      }
      
      // Procurando local
      const localMatch = bloco.match(/Local:\s*(.+?)(?=\n|$|\s{2,})/);
      if (localMatch) {
        local = localMatch[1].trim();
      }

      // Procurando Turma (fallback se não foi extraído da primeira linha)
      if (turma === '01') {
          const turmaMatch = bloco.match(/\b([A-Z0-9]{1,3})\b\s*MATRICULADO/i) || bloco.match(/\b(T\d{2}|\d{2})\b/i);
          if (turmaMatch) {
             turma = turmaMatch[1].toUpperCase();
          }
      }

      // Procurando Horários (ex: 24T23, 35M34)
      const horarioRegex = /\b(\d+[MTN]\d+)\b/gi;
      let horMatch;
      while ((horMatch = horarioRegex.exec(bloco)) !== null) {
         const h = horMatch[1].toUpperCase();
         if (!horarios.includes(h)) {
             horarios.push(h);
         }
      }

      // 3. Processando o restante das linhas para Nome restante e Docentes
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
          
          // Limpeza de datas e traços que costumam ficar soltos
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

      // 4. Heurística para atribuir os textos extras ao Nome ou ao Docente
      if (extraTextAfterLocal.length > 0) {
          if (extraTextBeforeLocal.length > 0) {
              nome += ' ' + extraTextBeforeLocal.join(' ');
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
              const lastWordOfNome = nome.trim().split(' ').pop()?.toUpperCase() || '';
              
              if (words >= 3 || str.includes(' e ') || str.includes(' / ') || str.toUpperCase().includes('A DEFINIR') || str.toUpperCase().includes('A DESIGNAR')) {
                  splitIdx = 0;
              } else if (!preposicoes.includes(lastWordOfNome) && words >= 2) {
                  // Se tem 2 palavras (ex: ELAINE VENSON) e a disciplina já parece completa, assumimos Docente
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
                      const lastWordOfNome = (k > 0 ? extraTextBeforeLocal[k-1] : nome).trim().split(' ').pop()?.toUpperCase() || '';
                      if (words >= 3) {
                          splitIdx = k;
                          break;
                      } else if (!preposicoes.includes(lastWordOfNome) && words >= 2) {
                          splitIdx = k;
                          break;
                      }
                  }
              }
              
              // Se a última for curta (ex: GARDENGHI) e a penúltima for longa, assumimos que as duas são do Docente
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
              nome += ' ' + nameLines.join(' ');
          }
          if (docenteLines.length > 0) {
              const joinedDocentes = docenteLines.join(' ');
              const separar = joinedDocentes.split(/\s+e\s+|\s*\/\s*/);
              docentes.push(...separar.map(x => x.trim()));
          }
      }

      if (docentes.length === 0) docentes = ['A definir'];

      if (codigo && nome) {
         const existingIndex = disciplinas.findIndex(d => d.codigo === codigo);
         if (existingIndex === -1) {
            disciplinas.push({
              codigo,
              nome,
              turma,
              docentes,
              local,
              horarios
            });
         }
      }
    }
  } catch (err) {
    console.error("Erro ao analisar texto do PDF:", err);
  }

  return { aluno, disciplinas };
}
