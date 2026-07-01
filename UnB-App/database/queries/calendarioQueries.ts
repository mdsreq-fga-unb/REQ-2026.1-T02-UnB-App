import { SQLiteDatabase } from 'expo-sqlite';

export type TipoEventoCalendario =
  | 'matricula'
  | 'aulas'
  | 'feriado'
  | 'ponto_facultativo'
  | 'marco';

export type EventoCalendarioAcademico = {
  id_calendario: number;
  ano: number;
  periodo: number;
  data_inicio: string;
  data_fim: string;
  titulo: string;
  tipo: TipoEventoCalendario;
  fonte: string | null;
  atualizado_em: string;
};

export type ResultadoSincronizacaoCalendario = {
  sincronizado: boolean;
  inseridos: number;
  ano: number;
  periodo: number;
  fonte: string;
  atualizadoEm: string;
};

type EventoCalendarioInput = Omit<EventoCalendarioAcademico, 'id_calendario' | 'atualizado_em'>;

const CALENDARIO_2026_1_FONTE =
  'https://saa.unb.br/wp-content/uploads/2026/06/2026_1_Calend_Ativ_Grad_22_06_2026.pdf';

const CALENDARIO_2026_1_EVENTOS: EventoCalendarioInput[] = [
  { ano: 2026, periodo: 1, data_inicio: '2026-02-23', data_fim: '2026-02-26', titulo: 'Período de Matrícula', tipo: 'matricula', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-03-03', data_fim: '2026-03-05', titulo: 'Período de Rematrícula', tipo: 'matricula', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-03-10', data_fim: '2026-03-13', titulo: 'Matrícula Extraordinária', tipo: 'matricula', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-03-16', data_fim: '2026-03-16', titulo: 'Início do período de aulas', tipo: 'aulas', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-04-03', data_fim: '2026-04-03', titulo: 'Sexta-feira Santa', tipo: 'feriado', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-04-04', data_fim: '2026-04-04', titulo: 'Ponto Facultativo', tipo: 'ponto_facultativo', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-04-15', data_fim: '2026-04-15', titulo: '25% do período de aulas', tipo: 'marco', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-04-20', data_fim: '2026-04-20', titulo: 'Ponto Facultativo (Circ. 1/2026/MRT)', tipo: 'ponto_facultativo', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-04-21', data_fim: '2026-04-21', titulo: 'Tiradentes', tipo: 'feriado', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-05-01', data_fim: '2026-05-01', titulo: 'Dia do Trabalho', tipo: 'feriado', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-05-18', data_fim: '2026-05-18', titulo: '50% do período de aulas', tipo: 'marco', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-06-04', data_fim: '2026-06-04', titulo: 'Corpus Christi', tipo: 'feriado', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-06-05', data_fim: '2026-06-05', titulo: 'Ponto Facultativo (Circ. 1/2026/MRT)', tipo: 'ponto_facultativo', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-06-06', data_fim: '2026-06-06', titulo: 'Ponto Facultativo', tipo: 'ponto_facultativo', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-06-19', data_fim: '2026-06-19', titulo: '75% do período de aulas', tipo: 'marco', fonte: CALENDARIO_2026_1_FONTE },
  { ano: 2026, periodo: 1, data_inicio: '2026-07-18', data_fim: '2026-07-18', titulo: 'Término do período de aulas', tipo: 'aulas', fonte: CALENDARIO_2026_1_FONTE },
];

function diferencaEmDias(dataIso: string, agora = new Date()) {
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((agora.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
}

async function buscarPeriodoAtivo(db: SQLiteDatabase) {
  try {
    const anoSetting = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM AppSettings WHERE key = 'active_ano'"
    );
    const periodoSetting = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM AppSettings WHERE key = 'active_periodo'"
    );

    if (anoSetting?.value && periodoSetting?.value) {
      return {
        ano: parseInt(anoSetting.value, 10),
        periodo: parseInt(periodoSetting.value, 10),
      };
    }
  } catch (error) {
    // AppSettings pode não existir em bancos antigos.
  }

  const periodoLetivo = await db.getFirstAsync<{ ano: number; periodo: number }>(
    'SELECT ano, periodo FROM Periodo_Letivo ORDER BY ano DESC, periodo DESC LIMIT 1'
  );

  return {
    ano: periodoLetivo?.ano || 2026,
    periodo: periodoLetivo?.periodo || 1,
  };
}

function eventosDoPeriodo(ano: number, periodo: number) {
  return CALENDARIO_2026_1_EVENTOS.filter(
    (evento) => evento.ano === ano && evento.periodo === periodo
  );
}

export async function sincronizarCalendarioAcademico(
  db: SQLiteDatabase,
  force = false
): Promise<ResultadoSincronizacaoCalendario> {
  const { ano, periodo } = await buscarPeriodoAtivo(db);
  const eventos = eventosDoPeriodo(ano, periodo);
  const fonte = eventos[0]?.fonte || CALENDARIO_2026_1_FONTE;
  const agoraIso = new Date().toISOString();

  if (eventos.length === 0) {
    return { sincronizado: false, inseridos: 0, ano, periodo, fonte, atualizadoEm: agoraIso };
  }

  const eventosExistentes = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) as total FROM Calendario_Academico WHERE ano = ? AND periodo = ?',
    [ano, periodo]
  );
  const ultimaSync = await db.getFirstAsync<{ valor: string }>(
    "SELECT valor FROM Configuracoes WHERE chave = 'lastCalendarSyncAt'"
  );

  if (
    !force &&
    (eventosExistentes?.total || 0) > 0 &&
    ultimaSync?.valor &&
    diferencaEmDias(ultimaSync.valor) < 7
  ) {
    return { sincronizado: false, inseridos: 0, ano, periodo, fonte, atualizadoEm: ultimaSync.valor };
  }

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM Calendario_Academico WHERE ano = ? AND periodo = ?',
      [ano, periodo]
    );

    for (const evento of eventos) {
      await db.runAsync(
        `INSERT INTO Calendario_Academico
          (ano, periodo, data_inicio, data_fim, titulo, tipo, fonte, atualizado_em)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          evento.ano,
          evento.periodo,
          evento.data_inicio,
          evento.data_fim,
          evento.titulo,
          evento.tipo,
          evento.fonte,
          agoraIso,
        ]
      );
    }

    await db.runAsync(
      "INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('lastCalendarSyncAt', ?)",
      [agoraIso]
    );
    await db.runAsync(
      "INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('lastCalendarSourceUrl', ?)",
      [fonte]
    );
  });

  return {
    sincronizado: true,
    inseridos: eventos.length,
    ano,
    periodo,
    fonte,
    atualizadoEm: agoraIso,
  };
}

export async function buscarEventosCalendarioAcademico(
  db: SQLiteDatabase,
  ano?: number,
  periodo?: number
): Promise<EventoCalendarioAcademico[]> {
  const periodoAtivo = ano && periodo ? { ano, periodo } : await buscarPeriodoAtivo(db);

  return db.getAllAsync<EventoCalendarioAcademico>(
    `SELECT *
     FROM Calendario_Academico
     WHERE ano = ? AND periodo = ?
     ORDER BY data_inicio ASC, data_fim ASC, id_calendario ASC`,
    [periodoAtivo.ano, periodoAtivo.periodo]
  );
}

export async function buscarResumoCalendarioAcademico(db: SQLiteDatabase) {
  const { ano, periodo } = await buscarPeriodoAtivo(db);
  const ultimaSync = await db.getFirstAsync<{ valor: string }>(
    "SELECT valor FROM Configuracoes WHERE chave = 'lastCalendarSyncAt'"
  );
  const fonte = await db.getFirstAsync<{ valor: string }>(
    "SELECT valor FROM Configuracoes WHERE chave = 'lastCalendarSourceUrl'"
  );

  return {
    ano,
    periodo,
    ultimaSync: ultimaSync?.valor || null,
    fonte: fonte?.valor || CALENDARIO_2026_1_FONTE,
  };
}

