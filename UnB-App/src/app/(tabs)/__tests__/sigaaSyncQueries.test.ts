import {
  buscarAlvosSincronizacaoSigaa,
  sincronizarDisciplinasComSigaa,
} from '../../../../database/queries/gradeQueries';
import { parseHorarioUnB } from '../../../../utils/horarioParser';

jest.mock('../../../../utils/horarioParser', () => ({
  parseHorarioUnB: jest.fn(),
}));

function createMockDb() {
  return {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
    withTransactionAsync: jest.fn(async (callback) => {
      await callback();
    }),
  };
}

describe('Sincronização de disciplinas com SIGAA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('monta alvos do SIGAA usando semestre ativo, docentes e assinatura de horários', async () => {
    const db = createMockDb();

    db.getFirstAsync
      .mockResolvedValueOnce({ value: '123456789' })
      .mockResolvedValueOnce({ value: '2026' })
      .mockResolvedValueOnce({ value: '1' });

    db.getAllAsync
      .mockResolvedValueOnce([
        {
          id_turma: 10,
          codigo_disciplina: 'FGA0173',
          codigo_turma: '01',
          docente_nome: 'SERGIO ANTONIO ANDRADE DE FREITAS',
        },
      ])
      .mockResolvedValueOnce([
        { dia_semana: 2, hora_inicio: '10:00', hora_fim: '10:55' },
        { dia_semana: 4, hora_inicio: '10:00', hora_fim: '10:55' },
      ]);

    const alvos = await buscarAlvosSincronizacaoSigaa(db as any);

    expect(alvos).toEqual([
      {
        codigo_disciplina: 'FGA0173',
        codigo_turma: '01',
        docente_nome: 'SERGIO ANTONIO ANDRADE DE FREITAS',
        ano: 2026,
        periodo: 1,
        horarios_assinatura: '2|10:00|10:55||4|10:00|10:55',
      },
    ]);
  });

  it('atualiza turma, docentes e aulas quando os dados extraídos do SIGAA diferem do banco', async () => {
    const db = createMockDb();

    db.getFirstAsync
      .mockResolvedValueOnce({ value: '123456789' })
      .mockResolvedValueOnce({ value: '2026' })
      .mockResolvedValueOnce({ value: '1' })
      .mockResolvedValueOnce({ id_turma: 10, numero_turma: '01' })
      .mockResolvedValueOnce({ id_docente: 7 });

    db.getAllAsync
      .mockResolvedValueOnce([{ nome_docente: 'SERGIO ANTONIO ANDRADE DE FREITAS' }])
      .mockResolvedValueOnce([
        {
          dia_semana: 2,
          local: 'FCTE - carro',
          hora_inicio: '10:00',
          hora_fim: '10:55',
        },
      ]);

    (parseHorarioUnB as jest.Mock).mockReturnValue([
      {
        diaSemana: 3,
        local: 'FCTE - I3 / S2',
        horaInicio: '10:00',
        horaFim: '10:55',
      },
    ]);

    const resultado = await sincronizarDisciplinasComSigaa(db as any, [
      {
        codigo_disciplina: 'FGA0173',
        turma: '02',
        docente_nome: 'ANDRE BARROS DE SALES (60h)',
        horario_sigaa: '35M12',
        local_sigaa: 'FCTE - I3 / S2',
        ano: 2026,
        periodo: 1,
      },
    ]);

    expect(resultado).toEqual({ atualizadas: 1, equivalentes: 0, naoEncontradas: 0 });
    expect(db.runAsync).toHaveBeenCalledWith(
      'UPDATE Turma SET numero_turma = ? WHERE id_turma = ?',
      ['02', 10]
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      'DELETE FROM Turma_Docente WHERE id_turma = ?',
      [10]
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      'INSERT OR IGNORE INTO Docente (nome_docente) VALUES (?)',
      ['ANDRE BARROS DE SALES']
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      'INSERT OR IGNORE INTO Aula (id_turma, dia_semana, local, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?)',
      [10, 3, 'FCTE - I3 / S2', '10:00', '10:55']
    );
  });

  it('ignora dados extraídos de outro semestre para evitar atualização incorreta', async () => {
    const db = createMockDb();

    db.getFirstAsync
      .mockResolvedValueOnce({ value: '123456789' })
      .mockResolvedValueOnce({ value: '2026' })
      .mockResolvedValueOnce({ value: '1' });

    const resultado = await sincronizarDisciplinasComSigaa(db as any, [
      {
        codigo_disciplina: 'FGA0173',
        turma: '01',
        docente_nome: 'SERGIO ANTONIO ANDRADE DE FREITAS',
        horario_sigaa: '24M34',
        local_sigaa: 'FCTE - I3',
        ano: 2026,
        periodo: 2,
      },
    ]);

    expect(resultado).toEqual({ atualizadas: 0, equivalentes: 0, naoEncontradas: 1 });
    expect(db.runAsync).not.toHaveBeenCalled();
  });
});

