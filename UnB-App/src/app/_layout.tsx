import { Stack } from "expo-router";
import { Pressable, View, Text, StyleSheet, useWindowDimensions } from "react-native";
import ScalePressable from "@/components/ScalePressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { useState, useEffect } from "react";
import Animated, { FadeIn, FadeOut, Easing, withTiming } from 'react-native-reanimated';
import { TextSizeProvider, useTextSize } from "@/contexts/TextSizeContext";
import { UserProfileProvider, useUserProfile } from "@/contexts/UserProfileContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { SymbolView } from "expo-symbols";
import * as LocalAuthentication from "expo-local-authentication";
import CustomSplashScreen from "@/components/SplashScreen";
import * as SplashScreenNative from 'expo-splash-screen';
import { ToastProvider } from 'react-native-pretty-toast';
import { StatusBar } from 'expo-status-bar';

SplashScreenNative.preventAutoHideAsync();

import { initializeDatabase } from "../../database/dbinit";

const ACCESSIBILITY_BUTTON_SIZE = 64;
const ACCESSIBILITY_BUTTON_RIGHT = 22;
const TEXT_SIZE_DIALOG_WIDTH = 302;
const TEXT_SIZE_DIALOG_TOP_OFFSET = ACCESSIBILITY_BUTTON_SIZE + 8;

const customEnter = () => {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ scale: 0.95 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 200, easing: Easing.bezier(0.23, 1, 0.32, 1) }),
      transform: [{ scale: withTiming(1, { duration: 200, easing: Easing.bezier(0.23, 1, 0.32, 1) }) }],
    },
  };
};

function AppLockWrapper({ children }: { children: React.ReactNode }) {
  const { appLockEnabled } = useUserProfile();
  const [unlocked, setUnlocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const insets = useSafeAreaInsets();
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();

  useEffect(() => {
    if (appLockEnabled && !unlocked && !isAuthenticating) {
      handleAuth();
    }
  }, [appLockEnabled, unlocked]);

  const handleAuth = async () => {
    setIsAuthenticating(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        setUnlocked(true);
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloqueie o UnB-App',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setUnlocked(true);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (appLockEnabled && !unlocked) {
    return (
      <View style={[styles.lockContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.lockContent}>
          <SymbolView name={{ ios: 'lock.fill', android: 'lock', web: 'lock' } as any} size={64} tintColor={colors.primary} />
          <Text style={[styles.lockTitle, { fontSize: getFontSize(24), color: colors.textPrimary }]}>App Bloqueado</Text>
          <Text style={[styles.lockSubtitle, { fontSize: getFontSize(16), color: colors.textSecondary }]}>Use a biometria para acessar seus dados.</Text>
          
          <ScalePressable style={[styles.unlockButton, { backgroundColor: colors.primary }]} onPress={handleAuth} disabled={isAuthenticating}>
            <Text style={[styles.unlockButtonText, { fontSize: getFontSize(16) }]}>Tentar novamente</Text>
          </ScalePressable>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

function ThemeAwareStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <>
      <SQLiteProvider databaseName="documents.db" onInit={initializeDatabase}>
        <UserProfileProvider>
          <ThemeProvider>
            <ThemeAwareStatusBar />
            <TextSizeProvider>
              <ToastProvider>
                <AppLockWrapper>
                  <View style={[styles.container, { backgroundColor: '#0A0A0A' }]}>
                <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="grade-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
                <Stack.Screen name="calendario-academico" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.85, 1.0], headerShown: false }} />
                <Stack.Screen name="atualizacoes-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
                <Stack.Screen name="em-breve-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
                <Stack.Screen name="sobre-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
                <Stack.Screen name="welcome-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [1.0], headerShown: false }} />
                <Stack.Screen name="tutoriais-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [1.0], headerShown: false }} />
                <Stack.Screen name="turmas-anteriores-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
                <Stack.Screen name="edit-profile-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
                <Stack.Screen name="ajustes" options={{ headerShown: false }} />
                <Stack.Screen name="senha-e-privacidade" options={{ title: 'Senha e Privacidade', headerBackTitle: 'Ajustes' }} />
              </Stack>
                <AccessibilityButton />
              </View>
                </AppLockWrapper>
              </ToastProvider>
            </TextSizeProvider>
          </ThemeProvider>
        </UserProfileProvider>
      </SQLiteProvider>
      {isSplashVisible && (
        <CustomSplashScreen onFinish={() => setIsSplashVisible(false)} />
      )}
    </>
  );
}

function AccessibilityButton() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { textSize, setTextSize, getFontSize } = useTextSize();
  const { colors } = useTheme();
  const buttonTop = Math.max(insets.top + 16, 56);
  const dialogWidth = Math.min(TEXT_SIZE_DIALOG_WIDTH, width - ACCESSIBILITY_BUTTON_RIGHT * 2);
  const dialogTop = buttonTop + TEXT_SIZE_DIALOG_TOP_OFFSET;

  const options = [
    { value: "normal" as const, label: "Normal", previewSize: 14 },
    { value: "large" as const, label: "Grande", previewSize: 17 },
    { value: "larger" as const, label: "Maior", previewSize: 20 },
  ];

  return (
    <>
      {!isDialogVisible ? (
        <ScalePressable
          style={[
            styles.accessibilityButton,
            { top: buttonTop, backgroundColor: colors.primary, borderColor: colors.surface }
          ]}
          accessibilityRole="button"
          accessibilityLabel="Alterar tamanho do texto"
          onPress={() => setIsDialogVisible(true)}
        >
          <Text style={styles.accessibilityButtonText}>Aa</Text>
        </ScalePressable>
      ) : null}

      {isDialogVisible ? (
        <Animated.View
          style={styles.textSizeOverlay}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsDialogVisible(false)} />
          <ScalePressable
            style={[
              styles.accessibilityButton,
              styles.accessibilityButtonInModal,
              { top: buttonTop, backgroundColor: colors.primary, borderColor: colors.surface }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Fechar opções de tamanho do texto"
            onPress={() => setIsDialogVisible(false)}
          >
            <Text style={styles.accessibilityButtonCloseText}>×</Text>
          </ScalePressable>
          <Animated.View
            entering={customEnter}
            exiting={FadeOut.duration(150)}
            style={[
              styles.textSizeDialog,
              {
                top: dialogTop,
                width: dialogWidth,
                right: ACCESSIBILITY_BUTTON_RIGHT,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            ]}
          >
            <Text style={[styles.textSizeTitle, { fontSize: getFontSize(15), color: colors.textPrimary }]}>Tamanho do texto</Text>

            <View style={styles.textSizeOptions}>
              {options.map((option) => {
                const isSelected = textSize === option.value;

                return (
                  <ScalePressable
                    key={option.value}
                    style={[
                      styles.textSizeOption,
                      isSelected ? { backgroundColor: colors.iconBackground, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setIsDialogVisible(false);
                      setTimeout(() => {
                        setTextSize(option.value);
                      }, 160);
                    }}
                  >
                    <Text
                      style={[
                        styles.textSizePreview,
                        {
                          color: isSelected ? colors.primary : colors.textSecondary,
                          fontSize: option.previewSize,
                        },
                      ]}
                    >
                      A
                    </Text>
                    <Text
                      style={[
                        styles.textSizeOptionLabel,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontSize: getFontSize(15),
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </ScalePressable>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockContainer: {
    flex: 1,
  },
  lockContent: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  lockTitle: {
    fontWeight: "bold",
    marginTop: 16,
  },
  lockSubtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  unlockButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderCurve: "continuous",
  },
  unlockButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  accessibilityButton: {
    position: "absolute",
    right: ACCESSIBILITY_BUTTON_RIGHT,
    width: ACCESSIBILITY_BUTTON_SIZE,
    height: ACCESSIBILITY_BUTTON_SIZE,
    borderRadius: ACCESSIBILITY_BUTTON_SIZE / 2,
    borderWidth: 1.6,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  accessibilityButtonInModal: {
    zIndex: 1001,
  },
  accessibilityButtonText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  accessibilityButtonCloseText: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "300",
    lineHeight: 44,
    marginTop: -2,
  },
  textSizeOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: "rgba(15, 23, 43, 0.4)",
  },
  textSizeDialog: {
    position: "absolute",
    zIndex: 1000,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    paddingHorizontal: 16.8,
    paddingTop: 16.8,
    paddingBottom: 16,
    gap: 12,
    boxShadow: "0 20px 30px rgba(0,0,0,0.25)",
  },
  textSizeTitle: {
    fontWeight: "600",
    lineHeight: 22.5,
  },
  textSizeOptions: {
    gap: 8,
  },
  textSizeOption: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1.6,
    paddingHorizontal: 17.6,
    paddingVertical: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderCurve: "continuous",
  },
  textSizePreview: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textSizeOptionLabel: {
    fontWeight: "600",
    lineHeight: 22.5,
    textAlign: "center",
  },
});
