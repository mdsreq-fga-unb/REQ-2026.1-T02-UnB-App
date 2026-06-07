import { View, Text, StyleSheet, FlatList, TextInput, Platform, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, type DisciplinaInfo } from '../../../database/queries/gradeQueries';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, Link } from 'expo-router';
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";

export default function DisciplinasScreen() {
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();

  const [disciplinas, setDisciplinas] = useState<DisciplinaInfo[]>([]);
  const [search, setSearch] = useState('');

  const carregarDisciplinas = useCallback(async () => {
    try {
      const data = await buscarTodasDisciplinas(db);
      setDisciplinas(data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      carregarDisciplinas();
    }, [carregarDisciplinas])
  );

  const filteredDisciplinas = disciplinas.filter(d =>
    d.nome_disciplina.toLowerCase().includes(search.toLowerCase()) ||
    d.codigo_disciplina.toLowerCase().includes(search.toLowerCase())
  );

  const renderCard = ({ item }: { item: DisciplinaInfo }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <SymbolView name="book.pages.fill" size={24} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 20 }}>📖</Text>} />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={[styles.cardTitle, { fontSize: getFontSize(18) }]} numberOfLines={1} selectable>{item.nome_disciplina}</Text>
          <Text style={[styles.cardSubtitle, { fontSize: getFontSize(14) }]} selectable>{item.codigo_disciplina} · 2026.1</Text>
        </View>
        <SymbolView name="chevron.right" size={20} tintColor="#90a1b9" fallback={<Text style={{ fontSize: 16 }}>›</Text>} />
      </View>

      <View style={styles.cardInfoRow}>
        <View style={styles.infoItem}>
          <SymbolView name="clock.fill" size={16} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 14 }}>🕒</Text>} />
          <Text style={[styles.infoText, { fontSize: getFontSize(15) }]} selectable>{item.horarios_formatados}</Text>
        </View>
        {item.local ? (
          <View style={styles.infoItem}>
            <SymbolView name="mappin.and.ellipse" size={16} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 14 }}>📍</Text>} />
            <Text style={[styles.infoText, { fontSize: getFontSize(15) }]} selectable>{item.local}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.footerLabel, { fontSize: getFontSize(14) }]}>Professor(es):</Text>
        <Text style={[styles.footerValue, { fontSize: getFontSize(14) }]} numberOfLines={1} selectable>{item.docente_nome}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredDisciplinas}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id_turma.toString()}
        renderItem={renderCard}
        ListHeaderComponent={
          <>
            <View style={[styles.header, { paddingRight: 70 }]}>
              <View>
                <Text style={[styles.subtitle, { fontSize: getFontSize(15) }]}>Semestre 2026.1</Text>
                <Text style={[styles.title, { fontSize: getFontSize(28) }]}>Minhas Disciplinas</Text>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <SymbolView name="magnifyingglass" size={20} tintColor="#90a1b9" fallback={<Text style={{ fontSize: 16 }}>🔍</Text>} />
                <TextInput
                  style={[styles.searchInput, { fontSize: getFontSize(16) }]}
                  placeholder="Buscar disciplina..."
                  placeholderTextColor="#90a1b9"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            <View style={{ paddingBottom: 16 }}>
              <Link href="/grade-modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View style={[styles.gradeCard, pressed && { opacity: 0.72 }]}>
                      <View style={styles.gradeIconContainer}>
                        <SymbolView name="calendar" size={24} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 20 }}>📅</Text>} />
                      </View>
                      <View style={styles.gradeTextContainer}>
                        <Text style={[styles.gradeTitle, { fontSize: getFontSize(17) }]}>Grade Horária</Text>
                        <Text style={[styles.gradeSubtitle, { fontSize: getFontSize(14) }]}>Visualizar sua semana</Text>
                      </View>
                      <SymbolView name="chevron.right" size={20} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 16, color: '#1d8d28' }}>›</Text>} />
                    </View>
                  )}
                </Pressable>
              </Link>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { fontSize: getFontSize(16) }]}>Nenhuma disciplina encontrada.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 40,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    color: '#62748e',
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    color: '#0f172b',
  },
  gradeCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    borderWidth: 0.8,
    borderColor: "#a4f4cf",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  gradeIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  gradeTextContainer: {
    flex: 1,
    gap: 2,
  },
  gradeTitle: {
    fontWeight: "600",
    color: "#0f172b",
  },
  gradeSubtitle: {
    color: "#314158",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 56,
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 0.8,
    borderColor: '#e2e8f0',
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  searchInput: {
    flex: 1,
    color: '#0f172b',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    borderWidth: 0.8,
    borderColor: '#e2e8f0',
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#e8f5ea',
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#0f172b',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#62748e',
    fontWeight: '500',
  },
  cardInfoRow: {
    gap: 8,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#314158',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerLabel: {
    color: '#45556c',
    fontWeight: '500',
  },
  footerValue: {
    color: '#1d8d28',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
  },
});
