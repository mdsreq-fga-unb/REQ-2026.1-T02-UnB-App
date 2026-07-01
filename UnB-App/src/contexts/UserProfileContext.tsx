import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

type UserProfileContextType = {
  userName: string | null;
  userMatricula: string | null;
  autoSyncPDFData: boolean;
  isProfileLoaded: boolean;
  updateUserProfile: (nome: string, matricula: string) => Promise<void>;
  setAutoSyncPDFData: (value: boolean) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState<string | null>(null);
  const [userMatricula, setUserMatricula] = useState<string | null>(null);
  const [autoSyncPDFData, setAutoSyncPDFState] = useState<boolean>(true);
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
      await db.runAsync(
        `INSERT OR REPLACE INTO Aluno (matricula, nome, curso) VALUES (?, ?, COALESCE((SELECT curso FROM Aluno WHERE matricula = ? LIMIT 1), 'Curso não informado'))`,
        [matricula, nome, matricula]
      );
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

  return (
    <UserProfileContext.Provider
      value={{
        userName,
        userMatricula,
        autoSyncPDFData,
        isProfileLoaded,
        updateUserProfile,
        setAutoSyncPDFData,
        refreshProfile,
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
