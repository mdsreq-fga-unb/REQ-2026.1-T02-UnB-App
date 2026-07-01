import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import DisciplinasScreen from '../disciplinas';

import * as gradeQueries from '../../../../database/queries/gradeQueries';

// Mocs de navegação nativos
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: ({ children }: any) => <>{children}</>,
  useFocusEffect: (callback: any) => require('react').useEffect(callback, []),
}));

jest.mock('expo-symbols', () => ({
  SymbolView: ({ fallback }: any) => <>{fallback}</>,
}));

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const fadeInDown: { duration: jest.Mock } = { duration: jest.fn() };
  fadeInDown.duration.mockReturnValue(fadeInDown);

  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value) => value),
    Easing: {
      out: jest.fn((value) => value),
      bezier: jest.fn(() => jest.fn()),
    },
    FadeInDown: fadeInDown,
  };
});

const mockDb = {};
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(() => mockDb),
}));

jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
jest.mock('expo-pdf-text-extract', () => ({ extractTextWithInfo: jest.fn() }));

// Mocs de contexto/negócio
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
      background: '#f8fafc',
      surface: '#ffffff',
      textPrimary: '#0f172b',
      textSecondary: '#64748b',
      border: '#d6dfec',
      success: '#35A92E',
      danger: '#D4183D',
      iconBackground: '#e8f5ea',
      inactiveText: '#64748b',
      textPlaceholder: '#94a3b8',
    },
  }),
}));

jest.mock('@/contexts/UserProfileContext', () => ({
  useUserProfile: () => ({
    userName: 'Aluno Teste',
    userMatricula: '123456789',
    autoSyncPDFData: false,
    updateUserProfile: jest.fn(),
  }),
}));

jest.mock('../../../../database/queries/gradeQueries');

describe('RF16F07 - Feature 7: Grade Horária e Ensalamento (Modo Offline)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CT01: Deve renderizar a grade horária consumindo cache local do SQLite', async () => {
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
