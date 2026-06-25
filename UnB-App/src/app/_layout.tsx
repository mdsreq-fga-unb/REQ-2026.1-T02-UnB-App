import { Stack } from "expo-router";
import { Pressable, View, Text, StyleSheet, useWindowDimensions } from "react-native";
import ScalePressable from "@/components/ScalePressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { useState } from "react";
import Animated, { FadeIn, FadeOut, Easing, withTiming } from 'react-native-reanimated';
import { TextSizeProvider, useTextSize } from "@/contexts/TextSizeContext";
import CustomSplashScreen from "@/components/SplashScreen";
import * as SplashScreenNative from 'expo-splash-screen';
import { ToastProvider } from 'react-native-pretty-toast';

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

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <>
      <ToastProvider>
        <SQLiteProvider databaseName="documents.db" onInit={initializeDatabase}>
          <TextSizeProvider>
            <View style={styles.container}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="grade-modal" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0], headerShown: false }} />
              </Stack>
              <AccessibilityButton />
            </View>
          </TextSizeProvider>
        </SQLiteProvider>
      </ToastProvider>
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
            { top: buttonTop }
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
              { top: buttonTop }
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
              }
            ]}
          >
            <Text style={[styles.textSizeTitle, { fontSize: getFontSize(15) }]}>Tamanho do texto</Text>

            <View style={styles.textSizeOptions}>
              {options.map((option) => {
                const isSelected = textSize === option.value;

                return (
                  <ScalePressable
                    key={option.value}
                    style={[
                      styles.textSizeOption,
                      isSelected ? styles.textSizeOptionSelected : styles.textSizeOptionDefault,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setTextSize(option.value);
                      setIsDialogVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.textSizePreview,
                        {
                          color: isSelected ? "#1d8d28" : "#475569",
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
                          color: isSelected ? "#1d8d28" : "#334155",
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
  accessibilityButton: {
    position: "absolute",
    right: ACCESSIBILITY_BUTTON_RIGHT,
    backgroundColor: "#1d8d28",
    width: ACCESSIBILITY_BUTTON_SIZE,
    height: ACCESSIBILITY_BUTTON_SIZE,
    borderRadius: ACCESSIBILITY_BUTTON_SIZE / 2,
    borderWidth: 1.6,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7.5,
    elevation: 5,
  },
  accessibilityButtonInModal: {
    zIndex: 1001,
    elevation: 13,
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
    backgroundColor: "rgba(15, 23, 43, 0.08)",
  },
  textSizeDialog: {
    position: "absolute",
    zIndex: 1000,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16.8,
    paddingTop: 16.8,
    paddingBottom: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
  textSizeTitle: {
    color: "#0f172b",
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
  },
  textSizeOptionSelected: {
    backgroundColor: "#e8f5ea",
    borderColor: "#1d8d28",
  },
  textSizeOptionDefault: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
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
