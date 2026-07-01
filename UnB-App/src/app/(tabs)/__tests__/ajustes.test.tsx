import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import AjustesScreen from '../ajustes';

// Mocks de navegação nativos
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), navigate: jest.fn() })),
  Link: ({ children }: any) => <>{children}</>,
  useFocusEffect: (callback: any) => require('react').useEffect(callback, []),
}));

jest.mock('expo-symbols', () => ({
  SymbolView: ({ fallback }: any) => <>{fallback}</>,
}));

jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: (c: any) => c,
    },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (cb: any) => ({}),
    withTiming: (toValue: any, config: any, cb: any) => toValue,
    Easing: {
      linear: (x: any) => x,
      ease: (x: any) => x,
      inOut: (x: any) => x,
    },
  };
});

jest.mock('react-native-worklets', () => ({}));

// Context Mocks
const mockSetTextSize = jest.fn();
jest.mock('@/contexts/TextSizeContext', () => ({
  useTextSize: () => ({
    textSize: 'normal',
    setTextSize: mockSetTextSize,
    getFontSize: (size: number) => size,
  }),
}));

const mockSetThemePreference = jest.fn();
const mockClearAllData = jest.fn();
const mockSetAutoSyncPDFData = jest.fn();
jest.mock('@/contexts/UserProfileContext', () => ({
  useUserProfile: () => ({
    userName: "Lourdes Ribeiro",
    userMatricula: "123456789",
    autoSyncPDFData: true,
    setAutoSyncPDFData: mockSetAutoSyncPDFData,
    clearAllData: mockClearAllData,
    themePreference: "light",
    setThemePreference: mockSetThemePreference,
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

describe('AjustesScreen - Tela de Configurações', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CT01: Deve renderizar a tela de Ajustes e permitir modificar preferências de tema e tamanho de texto', async () => {
    const { getByText, getByTestId } = await render(<AjustesScreen />);

    // 1. Verificações de renderização inicial
    await waitFor(() => {
      expect(getByText('Ajustes')).toBeTruthy();
      expect(getByText('Sua conta e preferências')).toBeTruthy();
      expect(getByText('Lourdes Ribeiro')).toBeTruthy();
      expect(getByText('123456789')).toBeTruthy();
    });

    // 2. Alternar preferências de tema
    const escuroBtn = getByText('Escuro');
    fireEvent.press(escuroBtn);
    expect(mockSetThemePreference).toHaveBeenCalledWith('dark');

    const autoBtn = getByText('Auto');
    fireEvent.press(autoBtn);
    expect(mockSetThemePreference).toHaveBeenCalledWith('automatic');

    // 3. Ajustar o tamanho do texto
    const btnLarge = getByTestId('txt-text-size-large');
    const btnLarger = getByTestId('txt-text-size-larger');

    expect(btnLarge).toBeTruthy();
    expect(btnLarger).toBeTruthy();

    fireEvent.press(btnLarge);
    expect(mockSetTextSize).toHaveBeenCalledWith('large');

    fireEvent.press(btnLarger);
    expect(mockSetTextSize).toHaveBeenCalledWith('larger');
  });
});
