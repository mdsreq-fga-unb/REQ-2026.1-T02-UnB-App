import {
  deveSincronizarCalendarioAcademico,
  extrairEventosCalendarioDeTexto,
  sincronizarCalendarioAcademicoComEventos,
} from '../../../../database/queries/calendarioQueries';

function createMockDb() {
  return {
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
    withTransactionAsync: jest.fn(async (callback) => {
      await callback();
    }),
  };
}

describe('Sincronização do calendário acadêmico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('extrai eventos do texto final do PDF de atividades da graduação', () => {
    const eventos = extrairEventosCalendarioDeTexto(
      `
      C A L E N D Á R I O D E A T I V I D A D E S D A G R A D U A Ç Ã O - 2026.1
      23/02 a 26/02 - Período de Matrícula
      16/03 - Início do período de aulas
      03/04 - Sexta-feira Santa
      04/04 - Ponto Facultativo
      15/04 - 25% do período de aulas
      `,
      2026,
      1,
      'https://saa.unb.br/calendario.pdf'
    );

    expect(eventos).toEqual([
      {
        ano: 2026,
        periodo: 1,
        data_inicio: '2026-02-23',
        data_fim: '2026-02-26',
        titulo: 'Período de Matrícula',
        tipo: 'matricula',
        fonte: 'https://saa.unb.br/calendario.pdf',
      },
      {
        ano: 2026,
        periodo: 1,
        data_inicio: '2026-03-16',
        data_fim: '2026-03-16',
        titulo: 'Início do período de aulas',
        tipo: 'aulas',
        fonte: 'https://saa.unb.br/calendario.pdf',
      },
      {
        ano: 2026,
        periodo: 1,
        data_inicio: '2026-04-03',
        data_fim: '2026-04-03',
        titulo: 'Sexta-feira Santa',
        tipo: 'feriado',
        fonte: 'https://saa.unb.br/calendario.pdf',
      },
      {
        ano: 2026,
        periodo: 1,
        data_inicio: '2026-04-04',
        data_fim: '2026-04-04',
        titulo: 'Ponto Facultativo',
        tipo: 'ponto_facultativo',
        fonte: 'https://saa.unb.br/calendario.pdf',
      },
      {
        ano: 2026,
        periodo: 1,
        data_inicio: '2026-04-15',
        data_fim: '2026-04-15',
        titulo: '25% do período de aulas',
        tipo: 'marco',
        fonte: 'https://saa.unb.br/calendario.pdf',
      },
    ]);
  });

  it('considera o calendário atualizado quando já sincronizou há menos de 7 dias', async () => {
    const db = createMockDb();

    db.getFirstAsync
      .mockResolvedValueOnce({ value: '2026' })
      .mockResolvedValueOnce({ value: '1' })
      .mockResolvedValueOnce({ total: 16 })
      .mockResolvedValueOnce({ valor: new Date().toISOString() });

    const resultado = await deveSincronizarCalendarioAcademico(db as any);

    expect(resultado.ano).toBe(2026);
    expect(resultado.periodo).toBe(1);
    expect(resultado.shouldSync).toBe(false);
  });

  it('grava eventos extraídos do PDF e atualiza metadados de sincronização', async () => {
    const db = createMockDb();
    const eventos = [
      {
        ano: 2026,
        periodo: 1,
        data_inicio: '2026-03-16',
        data_fim: '2026-03-16',
        titulo: 'Início do período de aulas',
        tipo: 'aulas' as const,
        fonte: 'https://saa.unb.br/calendario.pdf',
      },
    ];

    const resultado = await sincronizarCalendarioAcademicoComEventos(
      db as any,
      eventos,
      'https://saa.unb.br/calendario.pdf',
      2026,
      1
    );

    expect(resultado.sincronizado).toBe(true);
    expect(resultado.inseridos).toBe(1);
    expect(db.withTransactionAsync).toHaveBeenCalledTimes(1);
    expect(db.runAsync).toHaveBeenCalledWith(
      'DELETE FROM Calendario_Academico WHERE ano = ? AND periodo = ?',
      [2026, 1]
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Calendario_Academico'),
      [
        2026,
        1,
        '2026-03-16',
        '2026-03-16',
        'Início do período de aulas',
        'aulas',
        'https://saa.unb.br/calendario.pdf',
        expect.any(String),
      ]
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      "INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('lastCalendarSourceUrl', ?)",
      ['https://saa.unb.br/calendario.pdf']
    );
  });
});

