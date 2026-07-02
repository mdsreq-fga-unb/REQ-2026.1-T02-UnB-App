import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';

// Mocks para Reanimated e Worklets para evitar erro de inicializacao nativa no Jest
jest.mock('react-native-worklets', () => ({
  createSerializable: (x: any) => x,
  isSerializableRef: () => false,
  makeShareable: (x: any) => x,
  makeShareableCloneOnUIRecursive: (x: any) => x,
  makeShareableCloneRecursive: (x: any) => x,
  serializableMappingCache: new Map(),
  shareableMappingCache: new Map(),
  RuntimeKind: {
    ReactNative: 0,
    Web: 1,
    Worklet: 2,
  },
  Worklets: {
    createRunInJS: (fn: any) => fn,
    createRunInWorklet: (fn: any) => fn,
  },
  runOnJS: (fn: any) => fn,
  runOnUI: (fn: any) => fn,
  runOnUISync: (fn: any) => fn,
  scheduleOnUI: (fn: any) => fn,
}));

jest.mock('react-native-pretty-toast', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}), { virtual: true });

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

import DisciplinasScreen from '../disciplinas';
import * as gradeQueries from '../../../../database/queries/gradeQueries';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: ({ children }: any) => <>{children}</>,
  useFocusEffect: (callback: any) => require('react').useEffect(callback, []),
}));

jest.mock('expo-symbols', () => ({
  SymbolView: ({ fallback }: any) => <>{fallback}</>,
}));

const mockDb = {};
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(() => mockDb),
}));

jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
jest.mock('expo-pdf-text-extract', () => ({ extractTextWithInfo: jest.fn() }));

jest.mock('@/contexts/TextSizeContext', () => ({
  useTextSize: () => ({
    getFontSize: (size: number) => size,
  }),
}));

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    colors: {
      primary: '#1D8D28',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      success: '#35A92E',
      danger: '#dc3545',
      iconBackground: '#f8f9fa',
      inactiveText: '#888888',
      textPlaceholder: '#94a3b8',
    },
  }),
}));

jest.mock('@/contexts/UserProfileContext', () => ({
  useUserProfile: () => ({
    userName: 'Lourdes Ribeiro',
    userMatricula: '123456789',
    autoSyncPDFData: true,
    setAutoSyncPDFData: jest.fn(),
    clearAllData: jest.fn(),
    themePreference: 'light',
    setThemePreference: jest.fn(),
    updateUserProfile: jest.fn(),
  }),
}));

jest.mock('../../../../database/queries/gradeQueries');

describe('RF16F07 - Feature 7: Grade Horaria e Ensalamento (Modo Offline)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CT01: Deve renderizar a grade horaria consumindo cache local do SQLite', async () => {
    jest.spyOn(gradeQueries, 'buscarTodasDisciplinas').mockResolvedValue([
      {
        id_turma: 1,
        codigo_disciplina: 'FGA0138',
        nome_disciplina: 'Requisitos de Software',
        codigo_turma: 'A',
        local: 'FGA - Sala I3',
        docente_nome: 'Prof. Georgin Marisca',
        horarios_formatados: 'Seg/Qua · 14:00–15:50'
      }
    ]);

    await render(<DisciplinasScreen />);

    await waitFor(() => {
      expect(screen.getByText('Requisitos de Software')).toBeTruthy();
      expect(screen.getByText('Seg/Qua · 14:00–15:50')).toBeTruthy();
      expect(screen.getByText('FGA - Sala I3')).toBeTruthy();
      expect(screen.getByText('Prof. Georgin Marisca')).toBeTruthy();
    });
  });

  it('CT02: Deve tratar a lista vazia garantindo confiabilidade visual (RNF01)', async () => {
    jest.spyOn(gradeQueries, 'buscarTodasDisciplinas').mockResolvedValue([]);

    await render(<DisciplinasScreen />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma disciplina encontrada')).toBeTruthy();
      expect(screen.getByText('FAZER UPLOAD DA MATRÍCULA')).toBeTruthy();
    });
  });
});
