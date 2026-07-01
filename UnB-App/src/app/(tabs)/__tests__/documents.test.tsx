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
  getContentUriAsync: jest.fn(),
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

  it('CT04: Deve permitir remover um documento existente', async () => {
    const FileSystem = require('expo-file-system/legacy');
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    FileSystem.deleteAsync.mockResolvedValue(undefined);

    mockDb.getAllAsync.mockResolvedValue([
      { id: 1, title: 'Carteirinha Estudantil', description: 'oficial da UnB', meta: 'Importado em 01/07/2026', color: '', symbolName: 'person.text.rectangle.fill', uri: 'file:///mock-directory/1_carteirinha.pdf', size: 1024, fileName: 'carteirinha.pdf', mimeType: 'application/pdf' }
    ]);

    await render(<Documentos />);

    // Esperar renderizar com o botão Remover
    let btnRemover: any;
    await waitFor(() => {
      btnRemover = screen.getByText('Remover');
      expect(btnRemover).toBeTruthy();
    });

    fireEvent.press(btnRemover);

    await waitFor(() => {
      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('file:///mock-directory/1_carteirinha.pdf');
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith('file:///mock-directory/1_carteirinha.pdf');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE documents SET uri = ?, fileName = ?, mimeType = ?, size = ?, meta = ? WHERE id = ?',
        ['', null, null, null, '', 1]
      );
    });
  });

  it('CT05: Deve abrir documento no Android ao clicar em Ver', async () => {
    const { Platform } = require('react-native');
    const FileSystem = require('expo-file-system/legacy');
    const IntentLauncher = require('expo-intent-launcher');

    const originalOS = Platform.OS;
    Platform.OS = 'android';

    FileSystem.getContentUriAsync.mockResolvedValue('content://mock-uri');

    mockDb.getAllAsync.mockResolvedValue([
      { id: 1, title: 'Carteirinha Estudantil', description: 'oficial da UnB', meta: 'Importado', color: '', symbolName: 'person.text.rectangle.fill', uri: 'file:///mock-directory/1_carteirinha.pdf', size: 1024, fileName: 'carteirinha.pdf', mimeType: 'application/pdf' }
    ]);

    await render(<Documentos />);

    let btnVer: any;
    await waitFor(() => {
      btnVer = screen.getByText('Ver');
      expect(btnVer).toBeTruthy();
    });

    fireEvent.press(btnVer);

    await waitFor(() => {
      expect(FileSystem.getContentUriAsync).toHaveBeenCalledWith('file:///mock-directory/1_carteirinha.pdf');
      expect(IntentLauncher.startActivityAsync).toHaveBeenCalledWith('android.intent.action.VIEW', {
        data: 'content://mock-uri',
        flags: 1,
        type: 'application/pdf'
      });
    });

    Platform.OS = originalOS;
  });

  it('CT06: Deve abrir/compartilhar documento no iOS ao clicar em Ver', async () => {
    const { Platform } = require('react-native');
    const Sharing = require('expo-sharing');

    const originalOS = Platform.OS;
    Platform.OS = 'ios';

    Sharing.isAvailableAsync.mockResolvedValue(true);

    mockDb.getAllAsync.mockResolvedValue([
      { id: 1, title: 'Carteirinha Estudantil', description: 'oficial da UnB', meta: 'Importado', color: '', symbolName: 'person.text.rectangle.fill', uri: 'file:///mock-directory/1_carteirinha.pdf', size: 1024, fileName: 'carteirinha.pdf', mimeType: 'application/pdf' }
    ]);

    await render(<Documentos />);

    let btnVer: any;
    await waitFor(() => {
      btnVer = screen.getByText('Ver');
      expect(btnVer).toBeTruthy();
    });

    fireEvent.press(btnVer);

    await waitFor(() => {
      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith('file:///mock-directory/1_carteirinha.pdf');
    });

    Platform.OS = originalOS;
  });

  it('CT07: Deve permitir compartilhar o documento através da gaveta de documentos salvos', async () => {
    const Sharing = require('expo-sharing');
    Sharing.isAvailableAsync.mockResolvedValue(true);

    mockDb.getAllAsync.mockResolvedValue([
      { id: 1, title: 'Carteirinha Estudantil', description: 'oficial da UnB', meta: 'Importado', color: '', symbolName: 'person.text.rectangle.fill', uri: 'file:///mock-directory/1_carteirinha.pdf', size: 1024, fileName: 'carteirinha.pdf', mimeType: 'application/pdf' }
    ]);

    await render(<Documentos />);

    // Expandir painel de salvos
    const storageCard = screen.getByLabelText('Ver documentos salvos');
    fireEvent.press(storageCard);

    let btnCompartilhar: any;
    await waitFor(() => {
      btnCompartilhar = screen.getByLabelText('Compartilhar Carteirinha Estudantil');
      expect(btnCompartilhar).toBeTruthy();
    });

    fireEvent.press(btnCompartilhar);

    await waitFor(() => {
      expect(Sharing.shareAsync).toHaveBeenCalledWith('file:///mock-directory/1_carteirinha.pdf', {
        mimeType: 'application/pdf',
        dialogTitle: 'Carteirinha Estudantil',
        UTI: 'application/pdf',
      });
    });
  });
});

