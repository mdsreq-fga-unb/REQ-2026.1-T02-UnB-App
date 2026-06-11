import { buscarTodasDisciplinas, popularGradePorDados } from '../../../../database/queries/gradeQueries';


// Mock do parser de horários para isolar
jest.mock('../../../../utils/horarioParser', () => ({
  parseHorarioUnB: jest.fn(() => [
    { diaSemana: 2, local: 'Sala I8', horaInicio: '14:00', horaFim: '15:50' }
  ])
}));

const mockDb = {
  getAllAsync: jest.fn(),
  runAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  withTransactionAsync: jest.fn(async (callback) => {
    await callback();
  }),
};

describe('Integração com Banco de Dados: gradeQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarTodasDisciplinas', () => {
    it('CT01: Deve consultar parâmetros, turmas, aulas e formatar o retorno', async () => {
      // retornos da função auxiliar getDefaultParams()
      mockDb.getFirstAsync.mockResolvedValueOnce({ matricula: '123456789' }); // Aluno
      mockDb.getFirstAsync.mockResolvedValueOnce({ ano: 2026, periodo: 1 });  // Periodo Letivo
      
      // Eetorno da query principal de Turmas
      mockDb.getAllAsync.mockResolvedValueOnce([{
        id_turma: 1,
        codigo_disciplina: 'FGA0138',
        nome_disciplina: 'Requisitos de Software',
        codigo_turma: 'A',
        docente_nome: 'Prof. Georgin Marisca'
      }]);

      // Retorno da query secundária de Aulas
      mockDb.getAllAsync.mockResolvedValueOnce([{ 
        dia_semana: 2, 
        local: 'FGA - Sala I8', 
        hora_inicio: '14:00', 
        hora_fim: '15:50' 
      }]);

      const resultado = await buscarTodasDisciplinas(mockDb as any);

      // Validações
      expect(mockDb.getAllAsync).toHaveBeenCalledTimes(2); // 1 pra turma, 1 pra aula
      expect(resultado).toHaveLength(1);
      expect(resultado[0].nome_disciplina).toBe('Requisitos de Software');
      expect(resultado[0].horarios_formatados).toContain('Seg'); // O dia 2 é mapeado para 'Seg'
    });

    it('CT02: Deve repassar exceções do banco de dados (SQLite Error)', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({ matricula: '123456789' });
      mockDb.getFirstAsync.mockResolvedValueOnce({ ano: 2026, periodo: 1 });

      mockDb.getAllAsync.mockRejectedValueOnce(new Error('SQLite Constraint Error'));

      await expect(buscarTodasDisciplinas(mockDb as any)).rejects.toThrow('SQLite Constraint Error');
    });
  });

  describe('popularGradePorDados', () => {
    it('CT03: Deve limpar banco e realizar INSERTs encadeados em transação', async () => {
      // Mockamos os parâmetros com base nas tipagens reais 
      const alunoMock = { matricula: '123456789', nome: 'Marco', curso: 'Eng. de Software', ano: 2026, semestre: 1 };
      const disciplinasMock = [{
        codigo: 'FGA0138',
        nome: 'Requisitos de Software',
        turma: 'A',
        docentes: ['Prof. Georgin Marisca'],
        horarios: ['24T23'], 
        local: 'Sala I8'
      }];

      mockDb.getFirstAsync.mockImplementation(async (query: string) => {
        if (query.includes('last_insert_rowid()')) return { id_turma: 10 };
        if (query.includes('FROM Docente')) return { id_docente: 5 };
        return null;
      });

      // Passamos a assinatura correta (db, aluno, disciplinas)
      await popularGradePorDados(mockDb as any, alunoMock as any, disciplinasMock as any);

      // Valida se a transação atômica foi iniciada
      expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
      
      // Valida se os deletes/inserts ocorreram
      expect(mockDb.runAsync).toHaveBeenCalled();
      
      // Capturam os comandos executados para atestar as exclusões 
      const queriesExecutadas = mockDb.runAsync.mock.calls.map(call => call[0]);
      expect(queriesExecutadas).toContain('DELETE FROM Aula');
      expect(queriesExecutadas).toContain('INSERT OR IGNORE INTO Aluno (matricula, nome, curso, CPF) VALUES (?, ?, ?, ?)');
    });
  });
});