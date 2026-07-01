import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, type DisciplinaInfo } from '../../database/queries/gradeQueries';
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const COLORS = {
  background: "#f8fafc",
  surface: "#ffffff",
  primary: "#1d4ed8",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
};

const MOCK_UPDATES = [
  "A turma desta disciplina foi alterada no sistema.",
  "O local das aulas foi atualizado. Verifique a nova sala.",
  "Houve uma mudança no quadro de professores desta disciplina.",
];

export default function AtualizacoesModalScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
  
  const [disciplinas, setDisciplinas] = useState<DisciplinaInfo[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 250);
    return () => clearTimeout(timeout);
  }, []);

  const carregarDisciplinas = useCallback(async () => {
    try {
      const data = await buscarTodasDisciplinas(db);
      setDisciplinas(data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  }, [db]);

  useEffect(() => {
    if (isReady) {
      carregarDisciplinas();
    }
  }, [carregarDisciplinas, isReady]);

  const renderSubjectUpdates = ({ item, index }: { item: DisciplinaInfo; index: number }) => {
    // Generate some mock dates
    const date1 = new Date();
    date1.setDate(date1.getDate() - (index * 2));
    const date1Str = `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()}`;
    
    const date2 = new Date();
    date2.setDate(date2.getDate() - (index * 2 + 1));
    const date2Str = `${date2.getDate().toString().padStart(2, '0')}/${(date2.getMonth() + 1).toString().padStart(2, '0')}/${date2.getFullYear()}`;

    return (
      <View style={styles.subjectContainer}>
        <View style={styles.subjectHeader}>
          <SymbolView
            name={{ ios: "book.fill", android: "book", web: "book" }}
            size={20}
            tintColor={COLORS.primary}
          />
          <Text style={[styles.subjectTitle, { fontSize: getFontSize(18) }]}>
            {item.nome_disciplina}
          </Text>
        </View>

        <View style={styles.updateCard}>
          <Text style={[styles.updateDate, { fontSize: getFontSize(14) }]}>{date1Str}</Text>
          <Text style={[styles.updateBody, { fontSize: getFontSize(16) }]}>
            {MOCK_UPDATES[index % MOCK_UPDATES.length]}
          </Text>
        </View>
        
        {index % 2 === 0 && (
          <View style={styles.updateCard}>
            <Text style={[styles.updateDate, { fontSize: getFontSize(14) }]}>{date2Str}</Text>
            <Text style={[styles.updateBody, { fontSize: getFontSize(16) }]}>
              {MOCK_UPDATES[(index + 1) % MOCK_UPDATES.length]}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <ScalePressable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <SymbolView name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }} size={28} tintColor={COLORS.textMuted} />
        </ScalePressable>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(22) }]}>
          Atualizações Anteriores
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {!isReady ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : disciplinas.length > 0 ? (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id_turma.toString()}
          renderItem={renderSubjectUpdates}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <SymbolView name={{ ios: "bell.slash", android: "notifications_off", web: "notifications_off" }} size={48} tintColor={COLORS.textMuted} />
          <Text style={[styles.emptyText, { fontSize: getFontSize(16) }]}>
            Nenhuma atualização encontrada.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: "Inter",
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  listContent: {
    padding: 20,
    gap: 24,
  },
  subjectContainer: {
    gap: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  subjectTitle: {
    fontFamily: "Inter-SemiBold",
    color: COLORS.textPrimary,
    flex: 1,
  },
  updateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  updateDate: {
    fontFamily: "Inter-Medium",
    color: COLORS.textMuted,
  },
  updateBody: {
    fontFamily: "Inter",
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
