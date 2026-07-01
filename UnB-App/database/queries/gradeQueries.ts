import { SQLiteDatabase } from 'expo-sqlite';
import { parseHorarioUnB } from '../../utils/horarioParser';
import { type InfoAluno, type DisciplinaExtraida } from '../../utils/pdfParser';

export async function temGradeCadastrada(db: SQLiteDatabase): Promise<boolean> {
  const result = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM Aula');
  return !!result && result.count > 0;
}

export async function popularGradePorDados(
    db: SQLiteDatabase, 
    aluno: InfoAluno | null, 
    disciplinas: DisciplinaExtraida[],
    shouldSyncAluno: boolean = true
) {
  await db.withTransactionAsync(async () => {
    // 1. Limpar dados anteriores (ou de uma vez só se for o único usuário)
    
    // Insere o aluno
    if (aluno && shouldSyncAluno) {
       await db.runAsync(`INSERT OR REPLACE INTO Aluno (matricula, nome, curso, CPF) VALUES (?, ?, ?, ?)`, [aluno.matricula, aluno.nome, aluno.curso, '']);
    }

    await db.runAsync('DELETE FROM Aula');
    await db.runAsync('DELETE FROM Turma_Docente');
    await db.runAsync('DELETE FROM Turma_Aluno');
    await db.runAsync('DELETE FROM Turma');
    await db.runAsync('DELETE FROM Periodo_Letivo');
    await db.runAsync('DELETE FROM Aluno');

    // 2. Inserir Aluno
    const matricula = aluno?.matricula || '000000000';
    const ano = aluno?.ano || new Date().getFullYear();
    const periodo = aluno?.semestre || 1;

    await db.runAsync(
      'INSERT OR IGNORE INTO Aluno (matricula, nome, curso, CPF) VALUES (?, ?, ?, ?)',
      [matricula, aluno?.nome || 'ALUNO NÃO IDENTIFICADO', aluno?.curso || 'CURSO NÃO IDENTIFICADO', '']
    );

    // 3. Inserir Período Letivo
    await db.runAsync(
      'INSERT OR IGNORE INTO Periodo_Letivo (ano, periodo, data_inicio, data_fim) VALUES (?, ?, ?, ?)',
      [ano, periodo, '', '']
    );

    // 4. Inserir Disciplinas, Turmas, Docentes e Aulas
    for (const item of disciplinas) {
      await db.runAsync(
        'INSERT OR IGNORE INTO Disciplina (codigo_disciplina, nome_disciplina) VALUES (?, ?)',
        [item.codigo, item.nome]
      );

      await db.runAsync(
        'INSERT INTO Turma (codigo_disciplina, numero_turma, ano, periodo) VALUES (?, ?, ?, ?)',
        [item.codigo, item.turma, ano, periodo]
      );
      
      const turmaResult = await db.getFirstAsync<{ id_turma: number }>('SELECT last_insert_rowid() as id_turma');
      const idTurma = turmaResult?.id_turma;

      if (idTurma) {
        await db.runAsync(
          'INSERT OR IGNORE INTO Turma_Aluno (id_turma, matricula_aluno) VALUES (?, ?)',
          [idTurma, matricula]
        );

        for (const professorNome of item.docentes) {
          await db.runAsync(
            'INSERT OR IGNORE INTO Docente (nome_docente) VALUES (?)',
            [professorNome]
          );
          const docenteResult = await db.getFirstAsync<{ id_docente: number }>('SELECT id_docente FROM Docente WHERE nome_docente = ?', [professorNome]);
          
          if (docenteResult?.id_docente) {
            await db.runAsync(
              'INSERT OR IGNORE INTO Turma_Docente (id_turma, id_docente) VALUES (?, ?)',
              [idTurma, docenteResult.id_docente]
            );
          }
        }

        const horariosStr = item.horarios.join(' ');
        const horariosParsados = parseHorarioUnB(horariosStr, item.local);
        
        for (const h of horariosParsados) {
          await db.runAsync(
            'INSERT INTO Aula (id_turma, dia_semana, local, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?)',
            [idTurma, h.diaSemana, h.local, h.horaInicio, h.horaFim]
          );
        }
      }
    }
  });
}

export type AulaCard = {
  id_horario: string;
  codigo_disciplina: string;
  nome_disciplina: string;
  codigo_turma: string;
  local: string;
  docente_nome: string;
  hora_inicio: string;
  hora_fim: string;
};

export type DisciplinaInfo = {
  id_turma: number;
  codigo_disciplina: string;
  nome_disciplina: string;
  codigo_turma: string;
  local: string;
  docente_nome: string;
  horarios_formatados: string; 
};

async function getDefaultParams(db: SQLiteDatabase) {
  const aluno = await db.getFirstAsync<{matricula: string}>('SELECT matricula FROM Aluno LIMIT 1');
  const periodoLetivo = await db.getFirstAsync<{ano: number, periodo: number}>('SELECT ano, periodo FROM Periodo_Letivo LIMIT 1');
  
  return {
    matricula: aluno?.matricula || '000000000',
    ano: periodoLetivo?.ano || new Date().getFullYear(),
    periodo: periodoLetivo?.periodo || 1
  };
}

export async function buscarGradePorDia(db: SQLiteDatabase, diaSemana: number): Promise<AulaCard[]> {
  const { matricula, ano, periodo } = await getDefaultParams(db);

  const rows = await db.getAllAsync<AulaCard>(
    `
    SELECT 
      a.id_turma || a.dia_semana || a.hora_inicio as id_horario,
      t.codigo_disciplina,
      d.nome_disciplina,
      t.numero_turma as codigo_turma,
      a.local,
      GROUP_CONCAT(doc.nome_docente, ' / ') as docente_nome,
      a.hora_inicio,
      a.hora_fim
    FROM Aula a
    INNER JOIN Turma t ON a.id_turma = t.id_turma
    INNER JOIN Disciplina d ON t.codigo_disciplina = d.codigo_disciplina
    INNER JOIN Turma_Aluno ta ON t.id_turma = ta.id_turma
    LEFT JOIN Turma_Docente td ON t.id_turma = td.id_turma
    LEFT JOIN Docente doc ON td.id_docente = doc.id_docente
    WHERE a.dia_semana = ? AND ta.matricula_aluno = ? AND t.ano = ? AND t.periodo = ?
    GROUP BY 
      a.id_turma, 
      a.dia_semana, 
      a.hora_inicio
    ORDER BY a.hora_inicio ASC
    `,
    [diaSemana, matricula, ano, periodo]
  );

  const agruparAulas = (aulas: AulaCard[]) => {
    const agrupado: AulaCard[] = [];
    
    for (const aula of aulas) {
      if (agrupado.length === 0) {
        agrupado.push({ ...aula });
        continue;
      }
      
      const ultima = agrupado[agrupado.length - 1];
      
      const timeToMins = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
      };

      const diferencaMinutos = timeToMins(aula.hora_inicio) - timeToMins(ultima.hora_fim);

      if (
        ultima.codigo_disciplina === aula.codigo_disciplina &&
        ultima.codigo_turma === aula.codigo_turma &&
        ultima.local === aula.local &&
        diferencaMinutos <= 15 &&
        diferencaMinutos >= 0
      ) {
        ultima.hora_fim = aula.hora_fim;
      } else {
        agrupado.push({ ...aula });
      }
    }
    
    return agrupado;
  };

  return agruparAulas(rows);
}

export async function buscarTodasDisciplinas(db: SQLiteDatabase): Promise<DisciplinaInfo[]> {
  const { matricula, ano, periodo } = await getDefaultParams(db);

  const turmas = await db.getAllAsync<{
    id_turma: number;
    codigo_disciplina: string;
    nome_disciplina: string;
    codigo_turma: string;
    docente_nome: string;
  }>(
    `
    SELECT 
      t.id_turma,
      t.codigo_disciplina,
      d.nome_disciplina,
      t.numero_turma as codigo_turma,
      GROUP_CONCAT(DISTINCT doc.nome_docente) as docente_nome
    FROM Turma t
    INNER JOIN Disciplina d ON t.codigo_disciplina = d.codigo_disciplina
    INNER JOIN Turma_Aluno ta ON t.id_turma = ta.id_turma
    LEFT JOIN Turma_Docente td ON t.id_turma = td.id_turma
    LEFT JOIN Docente doc ON td.id_docente = doc.id_docente
    WHERE ta.matricula_aluno = ? AND t.ano = ? AND t.periodo = ?
    GROUP BY t.id_turma
    ORDER BY d.nome_disciplina ASC
    `,
    [matricula, ano, periodo]
  );

  const diasMap: Record<number, string> = {
    2: 'Seg', 3: 'Ter', 4: 'Qua', 5: 'Qui', 6: 'Sex', 7: 'Sáb'
  };

  const resultado: DisciplinaInfo[] = [];

  for (const turma of turmas) {
    const aulas = await db.getAllAsync<{
      dia_semana: number;
      local: string;
      hora_inicio: string;
      hora_fim: string;
    }>(
      'SELECT dia_semana, local, hora_inicio, hora_fim FROM Aula WHERE id_turma = ? ORDER BY dia_semana ASC, hora_inicio ASC',
      [turma.id_turma]
    );

    let local = '';
    if (aulas.length > 0) {
      local = aulas[0].local;
    }

    const horariosAgrupados: Record<string, string[]> = {};
    for (const aula of aulas) {
      const key = `${aula.hora_inicio}–${aula.hora_fim}`;
      if (!horariosAgrupados[key]) horariosAgrupados[key] = [];
      const diaNome = diasMap[aula.dia_semana] || String(aula.dia_semana);
      if (!horariosAgrupados[key].includes(diaNome)) {
        horariosAgrupados[key].push(diaNome);
      }
    }

    const horariosStrs = Object.entries(horariosAgrupados).map(([horario, dias]) => {
      return `${dias.join('/')} · ${horario}`;
    });

    resultado.push({
      id_turma: turma.id_turma,
      codigo_disciplina: turma.codigo_disciplina,
      nome_disciplina: turma.nome_disciplina,
      codigo_turma: turma.codigo_turma,
      local: local,
      docente_nome: turma.docente_nome ? turma.docente_nome.replace(/,/g, ' / ') : 'A definir',
      horarios_formatados: horariosStrs.join(', ') || 'Sem horário'
    });
  }

  return resultado;
}
