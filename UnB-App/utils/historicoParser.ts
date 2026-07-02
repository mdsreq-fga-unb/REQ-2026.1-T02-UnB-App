export type DisciplinaHistorico = {
  ano: number;
  periodo: number;
  codigo: string;
  nome: string;
  turma: string;
  situacao: string;
  docentes: string[]; // Lista de nomes de professores
};

export type InfoHistorico = {
  nome: string;
  matricula: string;
  curso: string;
  cpf: string;
  disciplinas: DisciplinaHistorico[];
};

export function extrairDadosDoHistorico(texto: string): InfoHistorico | null {
  try {
    // 1. Informações Básicas do Aluno
    const nomeMatch = texto.match(/Nome:\s*(.+?)\n/i);
    const nome = nomeMatch ? nomeMatch[1].trim() : '';

    const matriculaMatch = texto.match(/Matrícula:\s*([X\d]+)/i);
    const matricula = matriculaMatch ? matriculaMatch[1].trim() : '';

    const cursoMatch = texto.match(/Curso:\s*\n(.+?)\n/i) || texto.match(/Curso:\s*(.+?)\n/i);
    const curso = cursoMatch ? cursoMatch[1].trim() : '';
    
    // O CPF aparece mascarado no exemplo, mas podemos pegar o padrão se existir
    const cpfMatch = texto.match(/CPF:\s*([\dX\.\-]+)/i);
    const cpf = cpfMatch ? cpfMatch[1].trim() : '';

    // 2. Disciplinas, Turmas e Docentes
    const disciplinas: DisciplinaHistorico[] = [];
    
    // Pega apenas a seção de componentes curriculares
    const inicioComponentes = texto.indexOf("Componentes Curriculares Cursados/Cursando");
    const fimComponentes = texto.indexOf("Legenda");
    
    if (inicioComponentes !== -1 && fimComponentes !== -1) {
      let blocoDisciplinas = texto.substring(inicioComponentes, fimComponentes);
      
      // Removemos as menções ao ENADE
      blocoDisciplinas = blocoDisciplinas.replace(/.*ENADE.*\n?/g, '');

      const periodos = [...blocoDisciplinas.matchAll(/\b(20\d{2})\.([12])\b/g)].map(m => ({
        ano: parseInt(m[1], 10),
        periodo: parseInt(m[2], 10)
      }));
      
      const codigosMatches = [...blocoDisciplinas.matchAll(/\b([A-Z]{3}\d{4})\b/g)];
      const codigosENomes = codigosMatches.map((m, index) => {
        const codigo = m[1];
        const startIndex = m.index! + codigo.length;
        const nextNewline = blocoDisciplinas.indexOf('\n', startIndex);
        let endIndex = nextNewline !== -1 ? nextNewline : blocoDisciplinas.length;
        
        let possivelNome = blocoDisciplinas.substring(startIndex, endIndex).trim();
        const outroCodigo = possivelNome.search(/\b[A-Z]{3}\d{4}\b/);
        if (outroCodigo !== -1) {
          possivelNome = possivelNome.substring(0, outroCodigo).trim();
        }
        
        // No Android, se não houver quebra de linha, o nome puxa os dados do professor ou as notas junto.
        // Cortamos no primeiro indicativo de docente ou de início dos dados da nota (ex: "60 02 100,0").
        const matchLixo = possivelNome.search(/(?:\bDr\.|Dra\.|Esp\.|MSc\.|Prof\.)|\b\d{2,3}\s+(?:[A-Za-z0-9]{2}|--)\s+(?:[\d,]+|--)/);
        if (matchLixo !== -1) {
          possivelNome = possivelNome.substring(0, matchLixo).trim();
        }

        if (possivelNome === '*' || possivelNome === '#' || possivelNome === '') {
          possivelNome = '';
        }

        // Extração de docentes: procuramos todos os nomes de professores (Dr., Dra., Esp., MSc.)
        // que aparecem no bloco de texto entre o início desta disciplina e o início da próxima
        const nextMatchIndex = index < codigosMatches.length - 1 ? codigosMatches[index + 1].index! : blocoDisciplinas.length;
        const textBlockForTeachers = blocoDisciplinas.substring(m.index!, nextMatchIndex);
        
        const docentesMatches = [...textBlockForTeachers.matchAll(/(?:Dr\.|Dra\.|Esp\.|MSc\.|Prof\.)\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+?)(?=\s*\(\d+h\))/g)];
        const docentes = docentesMatches.map(dm => dm[1].trim());

        return { codigo, nome: possivelNome, docentes };
      });
      
      // Capturamos os resultados (turma, situação, etc) pela regex estrita da UnB
      // Flexibilizamos \s*\n\s* para \s+ para suportar a extração no Android que pode não ter quebra de linha
      const regexResultado = /\b(\d{2,3})\s+([A-Za-z0-9]{2}|--)\s+([\d,]+|--)\s+([A-Z]{2}|-|---)\s+(APR|REP|REPF|REPMF|MATR|TRANC|CANC|DISP|CUMP)\b/g;
      const resultados = [...blocoDisciplinas.matchAll(regexResultado)];

      // Zipamos os arrays
      const tamanho = Math.min(periodos.length, codigosENomes.length, resultados.length);
      
      for (let i = 0; i < tamanho; i++) {
        disciplinas.push({
          ano: periodos[i].ano,
          periodo: periodos[i].periodo,
          codigo: codigosENomes[i].codigo,
          nome: codigosENomes[i].nome, 
          turma: resultados[i][2] === '--' ? '00' : resultados[i][2], // normalizamos turmas vazias para 00
          situacao: resultados[i][5],
          docentes: codigosENomes[i].docentes
        });
      }
    }

    return {
      nome,
      matricula,
      curso,
      cpf,
      disciplinas
    };
  } catch (error) {
    console.error("Erro ao analisar texto do Histórico:", error);
    return null;
  }
}
