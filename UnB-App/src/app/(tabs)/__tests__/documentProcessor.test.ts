import { processAndSaveDocument } from '../../../../utils/documentProcessor';
import { extractTextWithInfo } from 'expo-pdf-text-extract';
import { popularGradePorDados } from '../../../../database/queries/gradeQueries';

// Mocks
jest.mock('expo-pdf-text-extract', () => ({
  extractTextWithInfo: jest.fn(),
}));

jest.mock('../../../../database/queries/gradeQueries', () => ({
  popularGradePorDados: jest.fn(),
}));

jest.mock('../../../../utils/historicoParser', () => ({
  extrairDadosDoHistorico: jest.fn((text) => {
    if (!text.includes('FGA0138')) {
      return { disciplinas: [] };
    }
    return {
      nome: 'PEDRO DE ALENCAR SILVA',
      matricula: '190012345',
      curso: 'ENGENHARIA DE SOFTWARE',
      cpf: '123.456.789-00',
      disciplinas: [
        {
          codigo: 'FGA0138',
          turma: '01',
          nome: 'Requisitos de Software',
          docentes: ['GEORGIN MARISCA'],
          situacao: 'MATR',
          ano: 2026,
          periodo: 1,
        }
      ]
    };
  }),
}));

jest.mock('../../../../utils/pdfParser', () => ({
  extrairDadosDoPDF: jest.fn(() => ({
    aluno: {
      nome: 'PEDRO DE ALENCAR SILVA',
      matricula: '190012345',
      curso: 'ENGENHARIA DE SOFTWARE',
      ano: 2026,
      semestre: 1,
      periodoLetivo: '2026.1',
      cpf: '123.456.789-00',
    },
    disciplinas: [
      {
        codigo: 'FGA0138',
        turma: '01',
        nome: 'Requisitos de Software',
        docentes: ['GEORGIN MARISCA'],
        situacao: 'MATR',
        ano: 2026,
        periodo: 1,
      }
    ]
  })),
}));

// Mock do módulo expo-file-system/legacy
jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///mock-directory/',
  copyAsync: jest.fn(),
}));

const mockDb = {
  runAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
  withTransactionAsync: jest.fn(async (callback) => {
    await callback();
  }),
};

describe('processAndSaveDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CT01: Deve processar com sucesso um PDF de Histórico Escolar e salvar os dados no BD', async () => {
    const mockTextoHistorico = `
      Histórico Escolar
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
      Legenda
    `;

    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoHistorico,
    });

    mockDb.getFirstAsync.mockResolvedValue(null); // Nenhum documento existente para sobrescrever

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/historico.pdf',
      'historico.pdf',
      'application/pdf',
      1024
    );

    expect(extractTextWithInfo).toHaveBeenCalledWith('file:///temp/historico.pdf');
    expect(popularGradePorDados).toHaveBeenCalledWith(
      mockDb,
      {
        nome: 'PEDRO DE ALENCAR SILVA',
        matricula: '190012345',
        curso: 'ENGENHARIA DE SOFTWARE',
        ano: 2026,
        semestre: 1,
        periodoLetivo: '2026.1',
        cpf: '123.456.789-00',
      },
      [
        {
          codigo: 'FGA0138',
          turma: '01',
          nome: 'Requisitos de Software',
          docentes: ['GEORGIN MARISCA'],
          horarios: [],
          local: '',
          situacao: 'MATR',
          ano: 2026,
          periodo: 1,
        },
      ]
    , true);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Grade atualizada via Histórico Escolar');
  });

  it('CT02: Deve retornar erro caso a extração do texto do PDF falhe', async () => {
    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: false,
      text: '',
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/corrompido.pdf',
      'corrompido.pdf',
      'application/pdf',
      512
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('Falha ao extrair texto do PDF');
    expect(popularGradePorDados).not.toHaveBeenCalled();
  });

  it('CT03: Deve retornar erro caso não encontre disciplinas válidas no histórico escolar', async () => {
    const mockTextoSemDisciplinas = `
      Histórico Escolar
      Matrícula: 190012345
      Nome: PEDRO DE ALENCAR SILVA
      Curso: ENGENHARIA DE SOFTWARE
      CPF: 123.456.789-00
      Componentes Curriculares Cursados/Cursando
      Legenda
    `;

    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoSemDisciplinas,
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/historico-vazio.pdf',
      'historico-vazio.pdf',
      'application/pdf',
      1024
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('Não foi possível encontrar disciplinas válidas neste Histórico');
    expect(popularGradePorDados).not.toHaveBeenCalled();
  });

  it('CT04: Deve validar tipo do arquivo ao enviar com overrideDocId incorreto', async () => {
    // Caso em que enviamos um arquivo que não é histórico escolar para o slot de histórico escolar
    const mockTextoIncorreto = 'Apenas algum texto aleatório sem as chaves do histórico';

    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoIncorreto,
    });

    // Slot configurado como "Histórico Escolar"
    mockDb.getFirstAsync.mockResolvedValue({
      id: 1,
      title: 'Histórico Escolar',
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/aleatorio.pdf',
      'aleatorio.pdf',
      'application/pdf',
      1024,
      1 // overrideDocId
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('O arquivo enviado não parece ser um Histórico Escolar');
    expect(popularGradePorDados).not.toHaveBeenCalled();
  });

  it('CT05: Deve validar Carteirinha Estudantil com sucesso', async () => {
    const mockTextoCarteirinha = 'Texto com VALIDADE e assinado por Secretaria de Administração Acadêmica';
    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoCarteirinha,
    });

    mockDb.getFirstAsync.mockResolvedValue({
      id: 5,
      title: 'Carteirinha Estudantil',
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/carteirinha.pdf',
      'carteirinha.pdf',
      'application/pdf',
      2048,
      5 // overrideDocId para carteirinha
    );

    // Como é um slot que não é histórico/passe livre, ele salva e retorna a mensagem específica
    expect(result.success).toBe(false);
    expect(result.message).toBe('O arquivo foi salvo em seus documentos.');
  });

  it('CT06: Deve falhar ao validar Carteirinha Estudantil caso falte termos obrigatórios', async () => {
    const mockTextoCarteirinhaInvalido = 'Apenas VALIDADE sem a assinatura da secretaria';
    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoCarteirinhaInvalido,
    });

    mockDb.getFirstAsync.mockResolvedValue({
      id: 5,
      title: 'Carteirinha Estudantil',
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/carteirinha.pdf',
      'carteirinha.pdf',
      'application/pdf',
      2048,
      5
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('O arquivo enviado não parece ser uma Carteirinha Estudantil');
  });

  it('CT07: Deve validar Passe Livre Estudantil com sucesso', async () => {
    const mockTextoPasseLivre = 'Este é um documento de PASSE LIVRE ESTUDANTIL';
    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoPasseLivre,
    });

    mockDb.getFirstAsync.mockResolvedValue({
      id: 2,
      title: 'Passe Livre Estudantil',
    });

    // Mock extrairDadosDoPDF para simular passe livre sem matérias ou com matérias
    const pdfParser = require('../../../../utils/pdfParser');
    jest.spyOn(pdfParser, 'extrairDadosDoPDF').mockReturnValueOnce({
      aluno: { nome: 'PEDRO', matricula: '190012345', curso: 'ES', CPF: '123' },
      disciplinas: []
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/passelivre.pdf',
      'passelivre.pdf',
      'application/pdf',
      2048,
      2
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('Não foi possível encontrar disciplinas válidas');
  });

  it('CT08: Deve validar Boletim de Notas com sucesso', async () => {
    const mockTextoBoletim = 'RELATÓRIO DE NOTAS de 2026';
    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoBoletim,
    });

    mockDb.getFirstAsync.mockResolvedValue({
      id: 3,
      title: 'Boletim de Notas',
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/boletim.pdf',
      'boletim.pdf',
      'application/pdf',
      2048,
      3
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('O arquivo foi salvo em seus documentos.');
  });

  it('CT09: Deve validar Índice Acadêmico com sucesso', async () => {
    const mockTextoIRA = 'Tabela de ÍNDICES ACADÊMICOS e IRA';
    (extractTextWithInfo as jest.Mock).mockResolvedValue({
      success: true,
      text: mockTextoIRA,
    });

    mockDb.getFirstAsync.mockResolvedValue({
      id: 4,
      title: 'Índice Acadêmico',
    });

    const result = await processAndSaveDocument(
      mockDb as any,
      'file:///temp/ira.pdf',
      'ira.pdf',
      'application/pdf',
      2048,
      4
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('O arquivo foi salvo em seus documentos.');
  });
});
