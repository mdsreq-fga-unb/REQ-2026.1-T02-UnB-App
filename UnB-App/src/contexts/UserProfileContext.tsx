import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

export type ThemePreference = 'light' | 'dark' | 'automatic';

type UserProfileContextType = {
  userName: string | null;
  userMatricula: string | null;
  autoSyncPDFData: boolean;
  appLockEnabled: boolean;
  themePreference: ThemePreference;
  isProfileLoaded: boolean;
  updateUserProfile: (nome: string, matricula: string) => Promise<void>;
  setAutoSyncPDFData: (value: boolean) => Promise<void>;
  setAppLockEnabled: (value: boolean) => Promise<void>;
  setThemePreference: (value: ThemePreference) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearAllData: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState<string | null>(null);
  const [userMatricula, setUserMatricula] = useState<string | null>(null);
  const [autoSyncPDFData, setAutoSyncPDFState] = useState<boolean>(true);
  const [appLockEnabled, setAppLockState] = useState<boolean>(false);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('light');
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);

  const refreshProfile = useCallback(async () => {
    try {
      // Carregar perfil
      const alunoRow = await db.getFirstAsync<{ nome: string; matricula: string }>(
        `SELECT nome, matricula FROM Aluno LIMIT 1`
      );
      if (alunoRow) {
        setUserName(alunoRow.nome);
        setUserMatricula(alunoRow.matricula);
      } else {
        setUserName(null);
        setUserMatricula(null);
      }

      // Carregar configuração
      const configRow = await db.getFirstAsync<{ valor: string }>(
        `SELECT valor FROM Configuracoes WHERE chave = 'autoSyncPDFData'`
      );
      if (configRow) {
        setAutoSyncPDFState(configRow.valor === 'true');
      } else {
        setAutoSyncPDFState(true); // default true
      }

      const lockConfig = await db.getFirstAsync<{ valor: string }>(
        `SELECT valor FROM Configuracoes WHERE chave = 'appLockEnabled'`
      );
      if (lockConfig) {
        setAppLockState(lockConfig.valor === 'true');
      } else {
        setAppLockState(false); // default false
      }

      const themeConfig = await db.getFirstAsync<{ valor: string }>(
        `SELECT valor FROM Configuracoes WHERE chave = 'themePreference'`
      );
      if (themeConfig && (themeConfig.valor === 'light' || themeConfig.valor === 'dark' || themeConfig.valor === 'automatic')) {
        setThemePreferenceState(themeConfig.valor as ThemePreference);
      } else {
        setThemePreferenceState('light'); // default light
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsProfileLoaded(true);
    }
  }, [db]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const updateUserProfile = async (nome: string, matricula: string) => {
    try {
      const alunoAtual = await db.getFirstAsync<{ matricula: string }>(`SELECT matricula FROM Aluno LIMIT 1`);

      if (alunoAtual) {
        if (alunoAtual.matricula === matricula) {
          // Apenas mudou o nome (ou nada)
          await db.runAsync(`UPDATE Aluno SET nome = ? WHERE matricula = ?`, [nome, matricula]);
        } else {
          // Mudou a matrícula. Criamos o novo, transferimos dependências e excluímos o antigo.
          await db.withTransactionAsync(async () => {
            // 1. Cria o novo aluno copiando o curso do atual
            await db.runAsync(
              `INSERT INTO Aluno (matricula, nome, curso) SELECT ?, ?, curso FROM Aluno WHERE matricula = ?`,
              [matricula, nome, alunoAtual.matricula]
            );
            // 2. Transfere as turmas para a nova matrícula
            await db.runAsync(
              `UPDATE Turma_Aluno SET matricula_aluno = ? WHERE matricula_aluno = ?`,
              [matricula, alunoAtual.matricula]
            );
            // 3. Remove o aluno antigo
            await db.runAsync(`DELETE FROM Aluno WHERE matricula = ?`, [alunoAtual.matricula]);
          });
        }
      } else {
        // Não há aluno cadastrado
        await db.runAsync(
          `INSERT INTO Aluno (matricula, nome, curso) VALUES (?, ?, 'Curso não informado')`,
          [matricula, nome]
        );
      }

      setUserName(nome);
      setUserMatricula(matricula);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  const setAutoSyncPDFData = async (value: boolean) => {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('autoSyncPDFData', ?)`,
        [value ? 'true' : 'false']
      );
      setAutoSyncPDFState(value);
    } catch (error) {
      console.error('Failed to update autoSyncPDFData config:', error);
      throw error;
    }
  };

  const setAppLockEnabled = async (value: boolean) => {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('appLockEnabled', ?)`,
        [value ? 'true' : 'false']
      );
      setAppLockState(value);
    } catch (error) {
      console.error('Failed to update appLockEnabled config:', error);
      throw error;
    }
  };

  const setThemePreference = async (value: ThemePreference) => {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('themePreference', ?)`,
        [value]
      );
      setThemePreferenceState(value);
    } catch (error) {
      console.error('Failed to update themePreference config:', error);
      throw error;
    }
  };

  const clearAllData = async () => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(`DELETE FROM Aluno`);
        await db.runAsync(`DELETE FROM Periodo_Letivo`);
        await db.runAsync(`DELETE FROM Disciplina`);
        await db.runAsync(`DELETE FROM Docente`);
        await db.runAsync(`DELETE FROM Turma`);
        await db.runAsync(`DELETE FROM Turma_Docente`);
        await db.runAsync(`DELETE FROM Turma_Aluno`);
        await db.runAsync(`DELETE FROM Aula`);
        await db.runAsync(`DELETE FROM documents`);
        await db.runAsync(`DELETE FROM Configuracoes`);
      });

      setUserName(null);
      setUserMatricula(null);
      setAutoSyncPDFState(true);
      setAppLockState(false);
      setThemePreferenceState('light');
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userName,
        userMatricula,
        autoSyncPDFData,
        appLockEnabled,
        themePreference,
        isProfileLoaded,
        updateUserProfile,
        setAutoSyncPDFData,
        setAppLockEnabled,
        setThemePreference,
        refreshProfile,
        clearAllData,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
