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
    );

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
});
