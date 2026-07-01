import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import Documentos from '../documents';

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

// Mocks de navegação nativos
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  Link: ({ children }: any) => <>{children}</>,
  useFocusEffect: (callback: any) => require('react').useEffect(callback, []),
}));

jest.mock('expo-symbols', () => ({
  SymbolView: ({ fallback }: any) => <>{fallback}</>,
}));

const mockDb = {
  getAllAsync: jest.fn(() => Promise.resolve([])),
  runAsync: jest.fn(() => Promise.resolve()),
};

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(() => mockDb),
}));

jest.mock('expo-file-system/legacy', () => ({
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
jest.mock('expo-sharing', () => ({ isAvailableAsync: jest.fn(), shareAsync: jest.fn() }));
jest.mock('expo-intent-launcher', () => ({ startActivityAsync: jest.fn() }));
jest.mock('react-native-pretty-toast', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}), { virtual: true });

// Mocs de contexto/negócio
jest.mock('@/contexts/TextSizeContext', () => ({
  useTextSize: () => ({
    getFontSize: (size: number) => size,
  }),
}));

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0056b3',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      iconBackground: '#f8f9fa',
      inactiveText: '#888888',
      danger: '#dc3545',
    },
    isDark: false,
  }),
}));

jest.mock('@/contexts/UserProfileContext', () => ({
  useUserProfile: () => ({
    userName: "Lourdes Ribeiro",
    userMatricula: "123456789",
    autoSyncPDFData: true,
    updateUserProfile: jest.fn(),
  }),
}));

describe('Documentos Screen - Centralização de Documentos (RF20 e RF21)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.getAllAsync.mockResolvedValue([]);
  });

  it('CT01: Deve renderizar a tela de documentos com seus cabeçalhos e a lista padrão', async () => {
    await render(<Documentos />);

    await waitFor(() => {
      expect(screen.getByText('Documentos')).toBeTruthy();
      expect(screen.getByText('Seus arquivos acadêmicos')).toBeTruthy();
      expect(screen.getByText('Meus Documentos')).toBeTruthy();
    });
  });

  it('CT02: Deve permitir abrir e fechar o painel de documentos salvos ao clicar no card de armazenamento', async () => {
    await render(<Documentos />);

    await waitFor(() => {
      expect(screen.getByText('Meus Documentos')).toBeTruthy();
    });

    const storageCard = screen.getByLabelText('Ver documentos salvos');
    
    // Clica para expandir
    fireEvent.press(storageCard);
    await waitFor(() => {
      expect(screen.getByText('Nenhum documento salvo ainda.')).toBeTruthy();
    });

    // Clica para colapsar
    fireEvent.press(storageCard);
    await waitFor(() => {
      expect(screen.queryByText('Nenhum documento salvo ainda.')).toBeNull();
    });
  });

  it('CT03: Deve filtrar a lista de documentos ao digitar na barra de pesquisa', async () => {
    // Simulamos os documentos padrão no banco
    mockDb.getAllAsync.mockResolvedValue([
      { id: 1, title: 'Carteirinha Estudantil', description: 'oficial da UnB', meta: '', color: '', symbolName: '', uri: '' },
      { id: 2, title: 'Passe Livre Estudantil', description: 'transporte', meta: '', color: '', symbolName: '', uri: '' }
    ]);

    await render(<Documentos />);

    await waitFor(() => {
      expect(screen.getByText('Carteirinha Estudantil')).toBeTruthy();
      expect(screen.getByText('Passe Livre Estudantil')).toBeTruthy();
    });

    const searchInput = screen.getByPlaceholderText('Buscar documento...');
    
    // Digita "Passe" na busca
    fireEvent.changeText(searchInput, 'Passe');

    await waitFor(() => {
      expect(screen.getByText('Passe Livre Estudantil')).toBeTruthy();
      expect(screen.queryByText('Carteirinha Estudantil')).toBeNull();
    });
  });
});
