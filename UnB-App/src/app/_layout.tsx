import { Stack } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

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
  return (
    <SQLiteProvider databaseName="documents.db" onInit={initializeDatabase}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <AccessibilityButton />
      </View>
    </SQLiteProvider>
  );
}

function AccessibilityButton() {
  const insets = useSafeAreaInsets();
  
  return (
    <TouchableOpacity 
      style={[
        styles.accessibilityButton, 
        { top: Math.max(insets.top + 20, 60) }
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.accessibilityButtonText}>Aa</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accessibilityButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#1d8d28",
    width: 56,
    height: 56,
    borderRadius: 28,
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
  accessibilityButtonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
