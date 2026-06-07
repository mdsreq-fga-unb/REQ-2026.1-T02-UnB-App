import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, type DisciplinaInfo } from '../../../database/queries/gradeQueries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";

export default function DisciplinasScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { getFontSize } = useTextSize();
  const router = useRouter();
  
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
          <SymbolView name="book.pages.fill" size={24} tintColor="#1d8d28" fallback={<Text style={{fontSize: 20}}>📖</Text>} />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={[styles.cardTitle, { fontSize: getFontSize(18) }]} numberOfLines={1}>{item.nome_disciplina}</Text>
          <Text style={[styles.cardSubtitle, { fontSize: getFontSize(14) }]}>{item.codigo_disciplina} · 2026.1</Text>
        </View>
        <SymbolView name="chevron.right" size={20} tintColor="#90a1b9" fallback={<Text style={{fontSize: 16}}>›</Text>} />
      </View>
      
      <View style={styles.cardInfoRow}>
        <View style={styles.infoItem}>
          <SymbolView name="clock.fill" size={16} tintColor="#1d8d28" fallback={<Text style={{fontSize: 14}}>🕒</Text>} />
          <Text style={[styles.infoText, { fontSize: getFontSize(15) }]}>{item.horarios_formatados}</Text>
        </View>
        {item.local ? (
          <View style={styles.infoItem}>
            <SymbolView name="mappin.and.ellipse" size={16} tintColor="#1d8d28" fallback={<Text style={{fontSize: 14}}>📍</Text>} />
            <Text style={[styles.infoText, { fontSize: getFontSize(15) }]}>{item.local}</Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={[styles.footerLabel, { fontSize: getFontSize(14) }]}>Professor(es):</Text>
        <Text style={[styles.footerValue, { fontSize: getFontSize(14) }]} numberOfLines={1}>{item.docente_nome}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.subtitle, { fontSize: getFontSize(15) }]}>Semestre 2026.1</Text>
          <Text style={[styles.title, { fontSize: getFontSize(28) }]}>Minhas Disciplinas</Text>
        </View>
        <TouchableOpacity style={styles.gradeButton} onPress={() => router.push('/grade-modal')}>
          <SymbolView name="calendar" size={20} tintColor="#1d8d28" fallback={<Text style={{fontSize: 16}}>📅</Text>} />
          <Text style={[styles.gradeButtonText, { fontSize: getFontSize(14) }]}>Grade</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SymbolView name="magnifyingglass" size={20} tintColor="#90a1b9" fallback={<Text style={{fontSize: 16}}>🔍</Text>} />
          <TextInput
            style={[styles.searchInput, { fontSize: getFontSize(16) }]}
            placeholder="Buscar disciplina..."
            placeholderTextColor="#90a1b9"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredDisciplinas}
        keyExtractor={(item) => item.id_turma.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { fontSize: getFontSize(16) }]}>Nenhuma disciplina encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  gradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5ea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  gradeButtonText: {
    color: '#1d8d28',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 0.8,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#0f172b',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.8,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
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
