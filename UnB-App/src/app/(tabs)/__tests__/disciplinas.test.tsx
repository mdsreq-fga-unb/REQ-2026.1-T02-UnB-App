import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';

// Mocks para Reanimated e Worklets para evitar erro de inicialização nativa no Jest
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
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

import DisciplinasScreen from '../disciplinas';

import * as gradeQueries from '../../../../database/queries/gradeQueries';

// Mocs de navegação nativos
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
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

// Mocs de contexto/negócio
jest.mock('@/contexts/TextSizeContext', () => ({
  useTextSize: () => ({
    getFontSize: (size: number) => size,
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