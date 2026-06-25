import { View, Text, StyleSheet, FlatList, TextInput, Platform, TouchableOpacity } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, popularGradePorDados, type DisciplinaInfo } from '../../../database/queries/gradeQueries';
import { extrairDadosDoPDF } from '../../../utils/pdfParser';
import * as DocumentPicker from 'expo-document-picker';
import { extractTextWithInfo } from 'expo-pdf-text-extract';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, Link } from 'expo-router';
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";

export default function DisciplinasScreen() {
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();

  const [disciplinas, setDisciplinas] = useState<DisciplinaInfo[]>([]);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const carregarDisciplinas = useCallback(async () => {
    try {
      const data = await buscarTodasDisciplinas(db);
      setDisciplinas(data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  }, [db]);

  const handleUpload = async () => {
    try {
      setIsProcessing(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsProcessing(false);
        return;
      }

      const fileUri = result.assets[0].uri;
      const extractResult = await extractTextWithInfo(fileUri);
      
      if (!extractResult.success) {
         alert('Falha ao extrair texto do PDF. Tente novamente ou use outro arquivo.');
         setIsProcessing(false);
         return;
      }

      const { aluno, disciplinas: parsedDisciplinas } = extrairDadosDoPDF(extractResult.text);
      if (parsedDisciplinas.length === 0) {
         alert('Não foi possível encontrar disciplinas válidas neste PDF.');
         setIsProcessing(false);
         return;
      }

      await popularGradePorDados(db, aluno, parsedDisciplinas);
      
      alert('Grade importada com sucesso!');
      await carregarDisciplinas();
    } catch (error: any) {
       alert(`Erro ao processar o arquivo: ${error.message}`);
    } finally {
       setIsProcessing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDisciplinas();
    }, [carregarDisciplinas])
  );

  const filteredDisciplinas = disciplinas.filter(d =>
    d.nome_disciplina.toLowerCase().includes(search.toLowerCase()) ||
    d.codigo_disciplina.toLowerCase().includes(search.toLowerCase())
  );

  const renderCard = ({ item, index }: { item: DisciplinaInfo; index: number }) => (
    <Animated.View 
      style={styles.card}
      entering={FadeInDown.delay(index * 40).duration(400).springify()}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <SymbolView name={{ ios: "book.pages.fill", android: "menu_book", web: "menu_book" } as any} size={24} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 20 }}>📖</Text>} />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={[styles.cardTitle, { fontSize: getFontSize(18) }]} numberOfLines={1} selectable>{item.nome_disciplina}</Text>
          <Text style={[styles.cardSubtitle, { fontSize: getFontSize(14) }]} selectable>{item.codigo_disciplina} · 2026.1</Text>
        </View>
        <SymbolView name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any} size={20} tintColor="#90a1b9" fallback={<Text style={{ fontSize: 16 }}>›</Text>} />
      </View>

      <View style={styles.cardInfoRow}>
        <View style={styles.infoItem}>
          <SymbolView name={{ ios: "clock.fill", android: "schedule", web: "schedule" } as any} size={16} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 14 }}>🕒</Text>} />
          <Text style={[styles.infoText, { fontSize: getFontSize(15) }]} selectable>{item.horarios_formatados}</Text>
        </View>
        {item.local ? (
          <View style={styles.infoItem}>
            <SymbolView name={{ ios: "mappin.and.ellipse", android: "location_on", web: "location_on" } as any} size={16} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 14 }}>📍</Text>} />
            <Text style={[styles.infoText, { fontSize: getFontSize(15) }]} selectable>{item.local}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.footerLabel, { fontSize: getFontSize(14) }]}>Professor(es):</Text>
        <Text style={[styles.footerValue, { fontSize: getFontSize(14) }]} numberOfLines={1} selectable>{item.docente_nome}</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
              <ScalePressable 
                style={styles.headerButton}
                onPress={handleUpload} 
                disabled={isProcessing}
                accessibilityRole="button"
                accessibilityLabel="Atualizar disciplinas"
              >
                <SymbolView 
                  name={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" } as any} 
                  size={20} 
                  tintColor="#1d8d28" 
                  fallback={<Text style={{ fontSize: 16 }}>🔄</Text>} 
                />
              </ScalePressable>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <SymbolView name={{ ios: "magnifyingglass", android: "search", web: "search" } as any} size={20} tintColor="#90a1b9" fallback={<Text style={{ fontSize: 16 }}>🔍</Text>} />
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
                <ScalePressable>
                  {({ pressed }) => (
                    <View style={[styles.gradeCard, pressed && { opacity: 0.72 }]}>
                      <View style={styles.gradeIconContainer}>
                        <SymbolView name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" } as any} size={24} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 20 }}>📅</Text>} />
                      </View>
                      <View style={styles.gradeTextContainer}>
                        <Text style={[styles.gradeTitle, { fontSize: getFontSize(17) }]}>Grade Horária</Text>
                        <Text style={[styles.gradeSubtitle, { fontSize: getFontSize(14) }]}>Visualizar sua semana</Text>
                      </View>
                      <SymbolView name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any} size={20} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 16, color: '#1d8d28' }}>›</Text>} />
                    </View>
                  )}
                </ScalePressable>
              </Link>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyGlobalContainer}>
              <Text style={[styles.emptyGlobalTitle, { fontSize: getFontSize(18) }]}>Nenhuma disciplina encontrada</Text>
              <Text style={[styles.emptyGlobalDesc, { fontSize: getFontSize(14) }]}>
                  Para carregar sua grade, por favor faça o upload da declaração ou histórico escolar. Se você não tiver disciplinas no semestre, tudo bem também.
              </Text>
              <ScalePressable style={styles.uploadButton} onPress={handleUpload} disabled={isProcessing}>
                  <Text style={[styles.uploadButtonText, { fontSize: getFontSize(15) }]}>
                    {isProcessing ? 'PROCESSANDO...' : 'FAZER UPLOAD DA MATRÍCULA'}
                  </Text>
              </ScalePressable>
          </View>
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f5ea',
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyGlobalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 60, marginTop: 40 },
  emptyGlobalTitle: { fontWeight: 'bold', color: '#0f172b', marginBottom: 12, textAlign: 'center' },
  emptyGlobalDesc: { color: '#64748b', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  uploadButton: { backgroundColor: '#1d8d28', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, elevation: 2, shadowColor: '#1d8d28', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  uploadButtonText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
});
