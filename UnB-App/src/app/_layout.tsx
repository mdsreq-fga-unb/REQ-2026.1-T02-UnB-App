import { Stack } from "expo-router";
import { Pressable, View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { useState } from "react";
import { TextSizeProvider, useTextSize } from "@/contexts/TextSizeContext";
import CustomSplashScreen from "@/components/SplashScreen";
import * as SplashScreenNative from 'expo-splash-screen';

SplashScreenNative.preventAutoHideAsync();

const ACCESSIBILITY_BUTTON_SIZE = 64;
const ACCESSIBILITY_BUTTON_RIGHT = 22;
const TEXT_SIZE_DIALOG_WIDTH = 302;
const TEXT_SIZE_DIALOG_TOP_OFFSET = ACCESSIBILITY_BUTTON_SIZE + 8;

async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        meta TEXT,
        color TEXT,
        symbolName TEXT,
        uri TEXT NOT NULL,
        fileName TEXT,
        mimeType TEXT,
        size INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const knownTitles = new Set([
      'Boletim de Notas',
      'Índice Acadêmico',
      'Histórico Escolar',
      'Atestado de Matrícula',
      'Passe Livre Estudantil'
    ]);
    const existing = await db.getAllAsync<{ title: string }>('SELECT title FROM documents');
    const existingTitles = new Set(existing.map((r) => r.title));
    const staleTitles = [...existingTitles].filter((t) => !knownTitles.has(t));
    for (const stale of staleTitles) {
      await db.runAsync('DELETE FROM documents WHERE title = ?', [stale]);
    }
  } catch (error) {
    console.error('Falha ao inicializar banco de dados:', error);
  }
}

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <>
      <SQLiteProvider databaseName="documents.db" onInit={initializeDatabase}>
        <TextSizeProvider>
          <View style={styles.container}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <AccessibilityButton />
          </View>
        </TextSizeProvider>
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
        <TouchableOpacity
          style={[
            styles.accessibilityButton,
            { top: buttonTop }
          ]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Alterar tamanho do texto"
          onPress={() => setIsDialogVisible(true)}
        >
          <Text style={styles.accessibilityButtonText}>Aa</Text>
        </TouchableOpacity>
      ) : null}

      {isDialogVisible ? (
        <View style={styles.textSizeOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsDialogVisible(false)} />
          <TouchableOpacity
            style={[
              styles.accessibilityButton,
              styles.accessibilityButtonInModal,
              { top: buttonTop }
            ]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Fechar opções de tamanho do texto"
            onPress={() => setIsDialogVisible(false)}
          >
            <Text style={styles.accessibilityButtonCloseText}>×</Text>
          </TouchableOpacity>
          <View
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
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.textSizeOption,
                      isSelected ? styles.textSizeOptionSelected : styles.textSizeOptionDefault,
                    ]}
                    activeOpacity={0.8}
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
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
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
