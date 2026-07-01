import { extrairDadosDoHistorico } from '../../../../utils/historicoParser';

describe('extrairDadosDoHistorico', () => {
  it('CT01: Deve extrair informações básicas do aluno corretamente', () => {
    const mockTexto = `
      Matrícula: 190012345
      Nome: PEDRO DE ALENCAR SILVA
      Curso: 
      ENGENHARIA DE SOFTWARE
      CPF: 123.456.789-00
      Componentes Curriculares Cursados/Cursando
      Legenda
    `;

    const resultado = extrairDadosDoHistorico(mockTexto);

    expect(resultado).not.toBeNull();
    expect(resultado?.nome).toBe('PEDRO DE ALENCAR SILVA');
    expect(resultado?.matricula).toBe('190012345');
    expect(resultado?.curso).toBe('ENGENHARIA DE SOFTWARE');
    expect(resultado?.cpf).toBe('123.456.789-00');
    expect(resultado?.disciplinas).toEqual([]);
  });

  it('CT02: Deve extrair disciplinas cursadas e matriculadas com sucesso', () => {
    const mockTexto = `
      Matrícula: 190012345
      Nome: PEDRO DE ALENCAR SILVA
      Curso: ENGENHARIA DE SOFTWARE
      CPF: 123.456.789-00
      Componentes Curriculares Cursados/Cursando
      2026.1
      FGA0138 Requisitos de Software
      Prof. GEORGIN MARISCA (60h)
      60 01 -- -
      MATR
      2025.2
      FGA0003 Algoritmos e Programação de Computadores
      Dra. MARIA SILVA (60h)
      60 02 9,5 SS
      APR
      Legenda
    `;

    const resultado = extrairDadosDoHistorico(mockTexto);

    expect(resultado).not.toBeNull();
    expect(resultado?.disciplinas).toHaveLength(2);

    // Primeira disciplina (MATR)
    expect(resultado?.disciplinas[0]).toEqual({
      ano: 2026,
      periodo: 1,
      codigo: 'FGA0138',
      nome: 'Requisitos de Software',
      turma: '01',
      situacao: 'MATR',
      docentes: ['GEORGIN MARISCA'],
    });

    // Segunda disciplina (APR)
    expect(resultado?.disciplinas[1]).toEqual({
      ano: 2025,
      periodo: 2,
      codigo: 'FGA0003',
      nome: 'Algoritmos e Programação de Computadores',
      turma: '02',
      situacao: 'APR',
      docentes: ['MARIA SILVA'],
    });
  });

  it('CT03: Deve extrair docentes com múltiplos títulos e múltiplos docentes por disciplina', () => {
    const mockTexto = `
      Componentes Curriculares Cursados/Cursando
      2026.1
      FGA0244 Programação para Sistemas Paralelos e Distribuídos
      MSc. JOAO DA SILVA (60h)
      Esp. MARIA DE SOUZA (60h)
      60 01 -- -
      MATR
      Legenda
    `;

    const resultado = extrairDadosDoHistorico(mockTexto);

    expect(resultado).not.toBeNull();
    expect(resultado?.disciplinas).toHaveLength(1);
    expect(resultado?.disciplinas[0].docentes).toEqual(['JOAO DA SILVA', 'MARIA DE SOUZA']);
  });

  it('CT04: Deve ignorar linhas do ENADE e realizar limpeza no bloco de disciplinas', () => {
    const mockTexto = `
      Componentes Curriculares Cursados/Cursando
      2026.1
      FGA0138 Requisitos de Software
      Prof. GEORGIN MARISCA (60h)
      60 01 -- -
      MATR
      Este texto do ENADE deve ser ignorado completamente
      2025.2
      FGA0003 Algoritmos e Programação de Computadores
      60 02 9,5 SS
      APR
      Legenda
    `;

    // Nota: A segunda disciplina não tem docentes identificados por regex.
    const resultado = extrairDadosDoHistorico(mockTexto);

    expect(resultado).not.toBeNull();
    expect(resultado?.disciplinas).toHaveLength(2);
    expect(resultado?.disciplinas[0].codigo).toBe('FGA0138');
    expect(resultado?.disciplinas[1].codigo).toBe('FGA0003');
  });

  it('CT05: Deve lidar com históricos mal formatados retornando null ou objeto vazio em caso de falha', () => {
    // Sem início de componentes
    const textoInvalido = `
      Matrícula: 190012345
      Nome: PEDRO DE ALENCAR SILVA
    `;

    const resultado = extrairDadosDoHistorico(textoInvalido);
    expect(resultado).not.toBeNull();
    expect(resultado?.nome).toBe('PEDRO DE ALENCAR SILVA');
    expect(resultado?.disciplinas).toEqual([]);
  });

  it('CT06: Deve normalizar turmas vazias para 00', () => {
    const mockTexto = `
      Componentes Curriculares Cursados/Cursando
      2026.1
      FGA0138 Requisitos de Software
      Prof. GEORGIN MARISCA (60h)
      60 -- -- -
      MATR
      Legenda
    `;

    const resultado = extrairDadosDoHistorico(mockTexto);
    expect(resultado).not.toBeNull();
    expect(resultado?.disciplinas).toHaveLength(1);
    expect(resultado?.disciplinas[0].turma).toBe('00');
  });
});
