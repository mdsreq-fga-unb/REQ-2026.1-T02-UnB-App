export type DisciplinaExtraida = {
  codigo: string;
  nome: string;
  turma: string;
  docentes: string[];
  local: string;
  horarios: string[];
};

export type InfoAluno = {
  matricula: string;
  nome: string;
  curso: string;
  periodoLetivo: string;
  ano: number;
  semestre: number;
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
    
    // Identifica todos os códigos de disciplina
    const regexCodigo = /([A-Z]{3}\d{4})/g;
    let match;
    const blocosIniciais: { index: number; codigo: string }[] = [];
    
    while ((match = regexCodigo.exec(texto)) !== null) {
      blocosIniciais.push({ index: match.index, codigo: match[1] });
    }

    // Processa os blocos a partir da posição de cada código
    for (let i = 0; i < blocosIniciais.length; i++) {
      const start = blocosIniciais[i].index;
      // O bloco vai até o início da próxima disciplina, ou até o fim de "Tabela de Horários:" ou fim do texto.
      let end = i + 1 < blocosIniciais.length ? blocosIniciais[i + 1].index : texto.length;
      
      const textoTabelaHorarios = texto.indexOf("TABELA DE HORÁRIOS");
      if (textoTabelaHorarios > start && textoTabelaHorarios < end) {
         end = textoTabelaHorarios;
      }

      const bloco = texto.substring(start, end).trim();
      const linhas = bloco.split('\n').map(l => l.trim()).filter(Boolean);

      // Linhas[0] normalmente é o código (ex: "FGA0003")
      const codigo = linhas[0];
      
      // O nome da disciplina deve estar nas próximas linhas
      let nome = '';
      let turma = '01'; // Default
      let docentes: string[] = [];
      let local = 'A designar';
      let horarios: string[] = [];
      
      // Procurando local
      const localMatch = bloco.match(/Local:\s*(.+?)(?=\n|$|\s{2,})/);
      if (localMatch) {
        local = localMatch[1].trim();
      }

      // Procurando Turma
      // A turma costuma ser um número de 2 dígitos isolado ou perto do status. Ex: "01 MATRICULADO(A)"
      const turmaMatch = bloco.match(/\b(\d{2})\b\s*MATRICULADO/i) || bloco.match(/\b(\d{2})\b/);
      if (turmaMatch) {
         turma = turmaMatch[1];
      }

      // Procurando Horários (ex: 24T23, 35M34)
      const horarioRegex = /\b(\d+[MTN]\d+)\b/gi;
      let horMatch;
      while ((horMatch = horarioRegex.exec(bloco)) !== null) {
         if (!horarios.includes(horMatch[1].toUpperCase())) {
             horarios.push(horMatch[1].toUpperCase());
         }
      }

      // Procurando Docentes e Nome da Disciplina
      // Geralmente, as linhas após o código são Nome e Docentes, até chegar em "Tipo:" ou "Turma"
      let nomeEncontrado = false;
      for (let j = 1; j < Math.min(linhas.length, 5); j++) {
        const linha = linhas[j];
        if (linha.includes('Tipo:') || linha.includes('Local:') || linha.includes('MATRICULADO')) continue;
        if (/^\d{2}$/.test(linha)) continue; // É a turma
        if (/^\d+[MTN]\d+/.test(linha)) continue; // É o horário

        if (!nomeEncontrado) {
          nome = linha;
          nomeEncontrado = true;
        } else {
           // Provável nome de docente
           // Verifica se não parece uma data, etc.
           if (!/^\d{2}\/\d{2}\/\d{4}/.test(linha)) {
             // Separa múltiplos docentes que possam estar na mesma linha com ' e '
             const separar = linha.split(/\s+e\s+/i);
             docentes.push(...separar.map(d => d.trim()));
           }
        }
      }

      if (codigo && nome) {
         disciplinas.push({
           codigo,
           nome,
           turma,
           docentes: docentes.length > 0 ? docentes : ['A definir'],
           local,
           horarios
         });
      }
    }
  } catch (err) {
    console.error("Erro ao analisar texto do PDF:", err);
  }

  return { aluno, disciplinas };
}
