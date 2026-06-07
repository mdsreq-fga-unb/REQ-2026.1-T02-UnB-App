import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { buscarGradePorDia, type AulaCard } from '../../../database/queries/gradeQueries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useTextSize } from "@/contexts/TextSizeContext";

const DIAS_SEMANA = [
  { id: 2, nome: 'Seg' },
  { id: 3, nome: 'Ter' },
  { id: 4, nome: 'Qua' },
  { id: 5, nome: 'Qui' },
  { id: 6, nome: 'Sex' },
  { id: 7, nome: 'Sáb' },
];

export default function DisciplinasScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { getFontSize } = useTextSize();
  
  const [diaSelecionado, setDiaSelecionado] = useState(() => {
    const hoje = new Date().getDay();
    // Se for domingo (0) ou sábado (6) sem aula, foca na segunda (2)
    return hoje >= 2 && hoje <= 7 ? hoje : 2;
  });
  
  const [aulas, setAulas] = useState<AulaCard[]>([]);

  const carregarAulas = useCallback(async () => {
    try {
      const data = await buscarGradePorDia(db, diaSelecionado);
      setAulas(data);
    } catch (error) {
      console.error('Erro ao buscar grade:', error);
    }
  }, [db, diaSelecionado]);

  useFocusEffect(
    useCallback(() => {
      carregarAulas();
    }, [carregarAulas])
  );

  const renderCard = ({ item }: { item: AulaCard }) => (
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { fontSize: getFontSize(16) }]}>{item.hora_inicio}</Text>
        <Text style={[styles.timeSubtext, { fontSize: getFontSize(12) }]}>às {item.hora_fim}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.courseName, { fontSize: getFontSize(15) }]}>{item.nome_disciplina}</Text>
        <Text style={[styles.courseCode, { fontSize: getFontSize(13) }]}>{item.codigo_disciplina} - Turma {item.codigo_turma}</Text>
        <Text style={[styles.location, { fontSize: getFontSize(13) }]}>📍 {item.local}</Text>
        <Text style={[styles.docente, { fontSize: getFontSize(13) }]}>👨‍🏫 {item.docente_nome}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <Text style={[styles.title, { fontSize: getFontSize(24) }]}>Grade Horária</Text>
      
      <View style={styles.daysContainer}>
        {DIAS_SEMANA.map((dia) => (
          <TouchableOpacity
            key={dia.id}
            style={[
              styles.dayButton,
              diaSelecionado === dia.id && styles.dayButtonSelected
            ]}
            onPress={() => setDiaSelecionado(dia.id)}
          >
            <Text style={[
              styles.dayText,
              { fontSize: getFontSize(14) },
              diaSelecionado === dia.id && styles.dayTextSelected
            ]}>
              {dia.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={aulas}
        keyExtractor={(item) => item.id_horario.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { fontSize: getFontSize(16) }]}>Nenhuma aula neste dia. Aproveite o descanso! 🎉</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontWeight: 'bold', color: '#0f172b', paddingHorizontal: 20, marginBottom: 16 },
  daysContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  dayButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#e2e8f0' },
  dayButtonSelected: { backgroundColor: '#1d8d28' },
  dayText: { fontWeight: '600', color: '#475569' },
  dayTextSelected: { color: '#ffffff' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  timeContainer: { borderRightWidth: 1, borderRightColor: '#e2e8f0', paddingRight: 16, marginRight: 16, justifyContent: 'center', alignItems: 'center', minWidth: 70 },
  timeText: { fontWeight: 'bold', color: '#1d8d28' },
  timeSubtext: { color: '#64748b', marginTop: 4 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  courseName: { fontWeight: 'bold', color: '#0f172b', marginBottom: 4 },
  courseCode: { color: '#475569', marginBottom: 8 },
  location: { color: '#334155', fontWeight: '500', marginBottom: 4 },
  docente: { color: '#64748b' },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 40 },
});
