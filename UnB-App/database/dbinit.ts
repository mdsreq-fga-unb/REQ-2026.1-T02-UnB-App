import { type SQLiteDatabase } from 'expo-sqlite';


export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
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
        situacao TEXT DEFAULT 'MATR',
        
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
      CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          meta TEXT,
          color TEXT NOT NULL,
          symbolName TEXT NOT NULL,
          uri TEXT,
          fileName TEXT,
          mimeType TEXT,
          size INTEGER
      );

      -- 10. Tabela de Configurações do App
      CREATE TABLE IF NOT EXISTS Configuracoes (
          chave TEXT PRIMARY KEY,
          valor TEXT NOT NULL
      );
    `);

    // Migration: Adiciona coluna situacao na tabela Turma_Aluno se não existir
    try {
      await db.execAsync(`ALTER TABLE Turma_Aluno ADD COLUMN situacao TEXT DEFAULT 'MATR';`);
    } catch (e) {
      // Ignora erro se a coluna já existir
    }

  } catch (error) {
    console.error('Falha ao inicializar banco de dados:', error);
  }

  // Ensure default documents exist
  try {
    const existingDocs = await db.getAllAsync('SELECT id FROM documents LIMIT 1');
    if (existingDocs.length === 0) {
      const DEFAULT_DOCS = [
        { title: "Carteirinha Estudantil", description: "Comprovante oficial de vínculo com a UnB", meta: "", color: "#b45309", symbolName: "person.text.rectangle.fill" },
        { title: "Histórico Escolar", description: "Todas as disciplinas cursadas", meta: "", color: "#7c3aed", symbolName: "books.vertical.fill" },
        { title: "Passe Livre Estudantil", description: "Solicitação de gratuidade no transporte", meta: "", color: "#be185d", symbolName: "bus.fill" },
        { title: "Boletim de Notas", description: "Notas das disciplinas do semestre 2026.1", meta: "", color: "#1d8d28", symbolName: "doc.text.fill" },
        { title: "Índice Acadêmico", description: "IRA, IECH e CR consolidados", meta: "", color: "#0e7490", symbolName: "chart.bar.doc.horizontal" }
      ];
      for (const doc of DEFAULT_DOCS) {
        await db.runAsync(
          'INSERT INTO documents (title, description, meta, color, symbolName, uri) VALUES (?, ?, ?, ?, ?, ?)',
          [doc.title, doc.description, doc.meta, doc.color, doc.symbolName, ""]
        );
      }
    }
  } catch (e) {
    console.error('Falha ao inserir documentos padrão:', e);
  }
}
