import React from 'react';
import { render, fireEvent, waitFor, screen, act, cleanup } from '@testing-library/react-native';
import WelcomeModalScreen from '../welcome-modal';

jest.mock('react-native-worklets', () => ({}));
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: (c: any) => c,
      View: ({ children, style }: any) => React.createElement('View', { style }, children),
      Text: ({ children, style }: any) => React.createElement('Text', { style }, children),
      ScrollView: ({ children, style }: any) => React.createElement('ScrollView', { style }, children),
    },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (cb: any) => ({}),
    withTiming: (toValue: any, config: any, cb: any) => {
      if (typeof cb === 'function') cb(true);
      return toValue;
    },
    Easing: {
      linear: (x: any) => x,
      ease: (x: any) => x,
      inOut: (x: any) => x,
    },
  };
});

jest.mock('@/components/ScalePressable', () => {
  const { Pressable } = require('react-native');
  return ({ children, onPress, style }: any) => (
    <Pressable onPress={onPress} style={style}>
      {children}
    </Pressable>
  );
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
    SafeAreaProvider: ({ children }: any) => <>{children}</>,
  };
});

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
}));

jest.mock('expo-symbols', () => ({
  SymbolView: ({ fallback }: any) => <>{fallback}</>,
}));

jest.mock('@/contexts/TextSizeContext', () => ({
  useTextSize: () => ({
    getFontSize: (size: number) => size,
  }),
}));

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      surface: '#ffffff',
      border: '#dee2e6',
      primary: '#0056b3',
      textPrimary: '#000000',
      textSecondary: '#6c757d',
      textPlaceholder: '#888888',
    },
  }),
}));

const mockUpdateUserProfile = jest.fn(() => Promise.resolve());
const mockSetAutoSyncPDFData = jest.fn(() => Promise.resolve());
jest.mock('../../contexts/UserProfileContext', () => {
  return {
    useUserProfile: () => {
      return {
        autoSyncPDFData: true,
        setAutoSyncPDFData: mockSetAutoSyncPDFData,
        updateUserProfile: mockUpdateUserProfile,
      };
    },
  };
});

describe('WelcomeModalScreen - Tela de Boas-Vindas (Onboarding)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Separate test cases to avoid overlapping act calls
  it('CT01: Deve renderizar a tela de boas-vindas', async () => {
    const { getByText, getByPlaceholderText } = await render(<WelcomeModalScreen />);

    expect(getByText('Bem-vindo ao UnB App!')).toBeTruthy();
    expect(getByPlaceholderText('Ex: José da Silva')).toBeTruthy();
    expect(getByPlaceholderText('Ex: 231012345')).toBeTruthy();
    expect(getByText('Sincronizar com Histórico')).toBeTruthy();
  });

  it('CT03: Deve permitir pular o onboarding', async () => {
    const { getByText } = await render(<WelcomeModalScreen />);

    const pularBtnText = getByText('Pular por enquanto', { exact: false });
    fireEvent.press(pularBtnText);

    await waitFor(() => {
      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
      expect(mockSetAutoSyncPDFData).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith('../tutoriais-modal');
    });
  });

  it('CT02: Deve salvar dados e continuar', async () => {
    const { getByText, getByPlaceholderText } = await render(<WelcomeModalScreen />);

    const nomeInput = getByPlaceholderText('Ex: José da Silva');
    const matriculaInput = getByPlaceholderText('Ex: 231012345');
    const salvarBtnText = getByText('Salvar e Continuar', { exact: false });

    fireEvent.changeText(nomeInput, 'Lourdes Ribeiro');
    fireEvent.changeText(matriculaInput, '123456789');

    // Wait for state updates to propagate
    await waitFor(() => {
      expect(nomeInput.props.value).toBe('Lourdes Ribeiro');
      expect(matriculaInput.props.value).toBe('123456789');
    });

    fireEvent.press(salvarBtnText);

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith('Lourdes Ribeiro', '123456789');
      expect(mockSetAutoSyncPDFData).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith('../tutoriais-modal');
    });
  });
});
