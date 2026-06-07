import { type SQLiteDatabase } from 'expo-sqlite';
import { popularGradeHorariaMock } from './queries/gradeQueries';

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS Horario_Turma;
      DROP TABLE IF EXISTS Turma_Docente;
      DROP TABLE IF EXISTS Turma_Aluno;
      DROP TABLE IF EXISTS Turma;
      DROP TABLE IF EXISTS Aula;
      DROP TABLE IF EXISTS Docente;
      DROP TABLE IF EXISTS Disciplina;
      DROP TABLE IF EXISTS Periodo_Letivo;
      DROP TABLE IF EXISTS Aluno;
      DROP TABLE IF EXISTS Documento;
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;

      -- 1. Entidade Aluno
      CREATE TABLE IF NOT EXISTS Aluno (
          matricula TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          curso TEXT NOT NULL,
          CPF TEXT
      );

      -- 2. Controle de Períodos Calendários
      CREATE TABLE IF NOT EXISTS Periodo_Letivo (
          ano INTEGER NOT NULL,
          periodo INTEGER NOT NULL,
          data_inicio TEXT NOT NULL,
          data_fim TEXT NOT NULL,
          PRIMARY KEY (ano, periodo)
      );

      -- 3. Entidade Disciplina
      CREATE TABLE IF NOT EXISTS Disciplina (
          codigo_disciplina TEXT PRIMARY KEY,
          nome_disciplina TEXT NOT NULL
      );

      -- 4. Entidade Docente
      CREATE TABLE IF NOT EXISTS Docente (
          id_docente INTEGER PRIMARY KEY AUTOINCREMENT,
          nome_docente TEXT NOT NULL UNIQUE
      );

      -- 5. Entidade Turma
      CREATE TABLE IF NOT EXISTS Turma (
          id_turma INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_disciplina TEXT NOT NULL,
          numero_turma TEXT NOT NULL,
          ano INTEGER NOT NULL,
          periodo INTEGER NOT NULL,
          
          FOREIGN KEY (codigo_disciplina) REFERENCES Disciplina (codigo_disciplina) ON DELETE CASCADE,
          FOREIGN KEY (ano, periodo) REFERENCES Periodo_Letivo (ano, periodo) ON DELETE CASCADE
      );

      -- 6. Associação entre Turma e Docente
      CREATE TABLE IF NOT EXISTS Turma_Docente (
          id_turma INTEGER,
          id_docente INTEGER NOT NULL,
          
          PRIMARY KEY (id_turma, id_docente),
          FOREIGN KEY (id_turma) REFERENCES Turma (id_turma) ON DELETE CASCADE,
          FOREIGN KEY (id_docente) REFERENCES Docente (id_docente) ON DELETE CASCADE
      );

     -- 7. Turma e Aluno
     CREATE TABLE IF NOT EXISTS Turma_Aluno (
        id_turma INTEGER,
        matricula_aluno TEXT NOT NULL,
        
        PRIMARY KEY (id_turma, matricula_aluno),
        FOREIGN KEY (id_turma) REFERENCES Turma (id_turma) ON DELETE CASCADE,
        FOREIGN KEY (matricula_aluno) REFERENCES Aluno (matricula) ON DELETE CASCADE
     );

      -- 8. Aula
      CREATE TABLE IF NOT EXISTS Aula (
          id_turma INTEGER,
          dia_semana INTEGER,
          local TEXT,
          hora_inicio TEXT NOT NULL,
          hora_fim TEXT NOT NULL,
          PRIMARY KEY(id_turma, dia_semana, hora_inicio),
          FOREIGN KEY (id_turma) REFERENCES Turma (id_turma) ON DELETE CASCADE
      );

      -- 9. Tabela do Módulo de Documentos
      CREATE TABLE IF NOT EXISTS Documento (
          id_documento INTEGER PRIMARY KEY AUTOINCREMENT,
          matricula_aluno TEXT NOT NULL,
          tipo TEXT NOT NULL,
          uri_arquivo TEXT NOT NULL,
          data_atualizacao TEXT NOT NULL,
          
          FOREIGN KEY (matricula_aluno) REFERENCES Aluno (matricula) ON DELETE CASCADE
      );
    `);



    await popularGradeHorariaMock(db);

  } catch (error) {
    console.error('Falha ao inicializar banco de dados:', error);
  }
}
