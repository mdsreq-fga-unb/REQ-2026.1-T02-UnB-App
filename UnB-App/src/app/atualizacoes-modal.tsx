import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator , Platform} from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, type DisciplinaInfo } from '../../database/queries/gradeQueries';
import { useTextSize } from "@/contexts/TextSizeContext";
import { useTheme } from '@/contexts/ThemeContext';
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const MOCK_UPDATES = [
  "A turma desta disciplina foi alterada no sistema.",
  "O local das aulas foi atualizado. Verifique a nova sala.",
  "Houve uma mudança no quadro de professores desta disciplina.",
];

export default function AtualizacoesModalScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();
  
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
    const date1 = new Date();
    date1.setDate(date1.getDate() - (index * 2));
    const date1Str = `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const date2 = new Date();
    date2.setDate(date2.getDate() - (index * 2 + 1));
    const date2Str = `${date2.getDate().toString().padStart(2, '0')}/${(date2.getMonth() + 1).toString().padStart(2, '0')}`;

    return (
      <View style={styles.subjectContainer}>
        <View style={[styles.subjectHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.subjectIconWrapper, { backgroundColor: colors.primary }]}>
            <SymbolView name={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }} size={16} tintColor="#ffffff" />
          </View>
          <Text style={[styles.subjectTitle, { fontSize: getFontSize(17), color: colors.textPrimary }]}>
            {item.nome_disciplina}
          </Text>
        </View>

        <View style={styles.timeline}>
          <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary, borderColor: colors.background }]} />
            <View style={[styles.updateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.updateHeader}>
                <SymbolView name={{ ios: "info.circle.fill", android: "info", web: "info" }} size={16} tintColor={colors.primary} />
                <Text style={[styles.updateDate, { fontSize: getFontSize(13), color: colors.textSecondary }]}>{date1Str}</Text>
              </View>
              <Text style={[styles.updateBody, { fontSize: getFontSize(15), color: colors.textPrimary }]}>
                {MOCK_UPDATES[index % MOCK_UPDATES.length]}
              </Text>
            </View>
          </View>
          
          {index % 2 === 0 && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.textPlaceholder, borderColor: colors.background }]} />
              <View style={[styles.updateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.updateHeader}>
                  <SymbolView name={{ ios: "clock.fill", android: "schedule", web: "schedule" }} size={16} tintColor={colors.inactiveText} />
                  <Text style={[styles.updateDate, { fontSize: getFontSize(13), color: colors.textSecondary }]}>{date2Str}</Text>
                </View>
                <Text style={[styles.updateBody, { fontSize: getFontSize(15), color: colors.textSecondary }]}>
                  {MOCK_UPDATES[(index + 1) % MOCK_UPDATES.length]}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScalePressable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <SymbolView name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }} size={28} tintColor={colors.inactiveText} />
        </ScalePressable>
        <View style={{alignItems: 'center'}}>
            <Text style={[styles.headerTitle, { fontSize: getFontSize(20), color: colors.textPrimary }]}>
            Painel de Notificações
            </Text>
            <Text style={[styles.headerSubtitle, { fontSize: getFontSize(13), color: colors.textSecondary }]}>
            Atualizações por matéria
            </Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {!isReady ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : disciplinas.length > 0 ? (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id_turma.toString()}
          renderItem={renderSubjectUpdates}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
        />
      ) : (
        <View style={styles.centerContainer}>
          <SymbolView name={{ ios: "bell.slash", android: "notifications_off", web: "notifications_off" }} size={48} tintColor={colors.inactiveText} />
          <Text style={[styles.emptyText, { fontSize: getFontSize(16), color: colors.textSecondary }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
  },
  headerSubtitle: {
    fontFamily: "Inter-Medium",
    marginTop: 2,
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
    textAlign: 'center',
    marginTop: 16,
  },
  listContent: {
    padding: 20,
    gap: 32,
    paddingBottom: 40,
  },
  subjectContainer: {
    gap: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectTitle: {
    fontFamily: "Inter-Bold",
    flex: 1,
  },
  timeline: {
    paddingLeft: 16,
    gap: 16,
  },
  timelineLine: {
    position: 'absolute',
    left: 19.5,
    top: 8,
    bottom: -16,
    width: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 16,
    marginLeft: -1,
    zIndex: 1,
    borderWidth: 2,
  },
  updateCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updateDate: {
    fontFamily: "Inter-SemiBold",
  },
  updateBody: {
    fontFamily: "Inter",
    lineHeight: 22,
  },
});
