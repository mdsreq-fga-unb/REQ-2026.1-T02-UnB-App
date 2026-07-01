import { View, Text, StyleSheet, FlatList, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';

import ScalePressable from "@/components/ScalePressable";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, popularGradePorDados, type DisciplinaInfo } from '../../../database/queries/gradeQueries';
import { extrairDadosDoPDF } from '../../../utils/pdfParser';
import * as DocumentPicker from 'expo-document-picker';
import { extractTextWithInfo } from 'expo-pdf-text-extract';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTextSize } from "@/contexts/TextSizeContext";
import { useTheme } from '@/contexts/ThemeContext';
import { SymbolView } from "expo-symbols";
import { useUserProfile } from '../../contexts/UserProfileContext';
import * as FileSystem from 'expo-file-system/legacy';

export default function DisciplinasScreen() {
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();
  const { autoSyncPDFData, userMatricula, updateUserProfile } = useUserProfile();
  const { expand, scrollTo } = useLocalSearchParams<{ expand?: string; scrollTo?: string }>();
  const flatListRef = useRef<FlatList>(null);
  const hasScrolledRef = useRef(false);

  const [disciplinas, setDisciplinas] = useState<DisciplinaInfo[]>([]);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  // Efeito para expandir e focar a disciplina vinda por parâmetro de navegação
  useEffect(() => {
    const targetId = expand || scrollTo;
    if (targetId && disciplinas.length > 0) {
      const id = Number(targetId);
      if (expand) {
        setExpandedId(id);
      }
      hasScrolledRef.current = false;

      const index = disciplinas.findIndex(d => d.id_turma === id);
      if (index !== -1 && flatListRef.current) {
        // Fallback garantido caso o card demore para renderizar
        setTimeout(() => {
          if (!hasScrolledRef.current) {
            hasScrolledRef.current = true;
            flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0, viewOffset: 20 });
          }
        }, 800);
      }
    }
  }, [expand, scrollTo, disciplinas]);

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
      const { processAndSaveDocument } = await import('../../../utils/documentProcessor');

      const res = await processAndSaveDocument(
        db,
        fileUri,
        result.assets[0].name,
        result.assets[0].mimeType,
        result.assets[0].size,
        undefined,
        {
          onConfirmProfileSync: async (aluno) => {
            let proceed = true;
            let shouldSync = autoSyncPDFData;

            if (aluno && userMatricula && userMatricula !== aluno.matricula) {
               proceed = await new Promise((resolve) => {
                  Alert.alert(
                    "Documento Inconsistente",
                    `Este documento pertence a ${aluno.nome} (${aluno.matricula}), que é diferente do seu perfil. Deseja realmente importar esta grade?`,
                    [
                      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
                      { text: "Importar", style: "destructive", onPress: () => resolve(true) }
                    ]
                  );
               });

               if (proceed) {
                  shouldSync = await new Promise((resolve) => {
                     Alert.alert(
                       "Atualizar Perfil",
                       "Deseja atualizar seu perfil para usar os dados deste documento?",
                       [
                         { text: "Não alterar", style: "cancel", onPress: () => resolve(false) },
                         { text: "Atualizar", onPress: () => resolve(true) }
                       ]
                     );
                  });
               }
            } else if (!userMatricula && aluno) {
               shouldSync = true;
            }

            return { proceed, shouldSync };
          },
          updateUserProfile
        }
      );

      alert(res.message);

      if (res.success) {
        await carregarDisciplinas();
      }
    } catch (error: any) {
       alert(`Erro ao processar o arquivo: ${error.message}`);
    } finally {
       setIsProcessing(false);
    }
  };

  // NOTE: removed useFocusEffect from expo-router, using useEffect or fallback
  useEffect(() => {
    carregarDisciplinas();
  }, [carregarDisciplinas]);

  const filteredDisciplinas = disciplinas.filter(d =>
    d.nome_disciplina.toLowerCase().includes(search.toLowerCase()) ||
    d.codigo_disciplina.toLowerCase().includes(search.toLowerCase())
  );

  const renderCard = ({ item, index }: { item: DisciplinaInfo; index: number }) => {
    const isExpanded = expandedId === item.id_turma;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLayout={(e) => {
          const targetId = expand || scrollTo;
          if (targetId && Number(targetId) === item.id_turma && !hasScrolledRef.current && flatListRef.current) {
            hasScrolledRef.current = true;
            flatListRef.current.scrollToOffset({
              offset: Math.max(0, e.nativeEvent.layout.y - 20),
              animated: true
            });
          }
        }}
        onPress={() => {
          setExpandedId(isExpanded ? null : item.id_turma);
        }}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.2)' : '#e8f5ea' }]}>
            <SymbolView name={{ ios: "book.pages.fill", android: "menu_book", web: "menu_book" } as any} size={24} tintColor={colors.primary} fallback={<Text style={{ fontSize: 20 }}>📖</Text>} />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardTitle, { fontSize: getFontSize(18), color: colors.textPrimary }]} selectable>{item.nome_disciplina}</Text>
            <Text style={[styles.cardSubtitle, { fontSize: getFontSize(14), color: colors.textSecondary }]} selectable>{item.codigo_disciplina} · 2026.1</Text>
          </View>
          <SymbolView
            name={isExpanded ? { ios: "chevron.up", android: "expand_less", web: "expand_less" } as any : { ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any}
            size={24}
            tintColor={colors.inactiveText}
            fallback={<Text style={{ fontSize: 16 }}>{isExpanded ? '↑' : '›'}</Text>}
          />
        </View>

        <View style={styles.cardInfoRow}>
          <View style={styles.infoItem}>
            <SymbolView name={{ ios: "clock.fill", android: "schedule", web: "schedule" } as any} size={16} tintColor={colors.primary} fallback={<Text style={{ fontSize: 14 }}>🕒</Text>} />
            <Text style={[styles.infoText, { fontSize: getFontSize(15), color: colors.textPrimary }]} selectable>{item.horarios_formatados}</Text>
          </View>
          {item.local ? (
            <View style={styles.infoItem}>
              <SymbolView name={{ ios: "mappin.and.ellipse", android: "location_on", web: "location_on" } as any} size={16} tintColor={colors.primary} fallback={<Text style={{ fontSize: 14 }}>📍</Text>} />
              <Text style={[styles.infoText, { fontSize: getFontSize(15), color: colors.textPrimary }]} selectable>{item.local}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerLabel, { fontSize: getFontSize(14), marginTop: 2, color: colors.textSecondary }]}>Professor(es):</Text>
          <Text style={[styles.footerValue, { fontSize: getFontSize(14), color: colors.primary }]} selectable>{item.docente_nome}</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={[styles.expandedDivider, { backgroundColor: colors.border }]} />

            <Text style={[styles.expandedSectionTitle, { fontSize: getFontSize(16), color: colors.textPrimary }]}>Detalhes da Turma</Text>
            <View style={[styles.detailRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.detailLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>Turma:</Text>
              <Text style={[styles.detailValue, { fontSize: getFontSize(14), color: colors.textPrimary }]}>{item.codigo_turma || 'Não informada'}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.detailLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>Local:</Text>
              <Text style={[styles.detailValue, { fontSize: getFontSize(14), color: colors.textPrimary }]}>{item.local || 'Não informado'}</Text>
            </View>

            <Text style={[styles.expandedSectionTitle, { fontSize: getFontSize(16), marginTop: 16, color: colors.textPrimary }]}>Últimas Atualizações</Text>
            <View style={styles.updateItem}>
              <View style={[styles.updateDot, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.updateDate, { fontSize: getFontSize(13), color: colors.textSecondary }]}>Há 2 dias</Text>
                <Text style={[styles.updateText, { fontSize: getFontSize(14), color: colors.textPrimary }]}>Local da aula atualizado pelo sistema.</Text>
              </View>
            </View>
            <View style={styles.updateItem}>
              <View style={[styles.updateDot, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.updateDate, { fontSize: getFontSize(13), color: colors.textSecondary }]}>Há 5 dias</Text>
                <Text style={[styles.updateText, { fontSize: getFontSize(14), color: colors.textPrimary }]}>Professor(a) atribuído(a) à turma.</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        ref={flatListRef}
        data={filteredDisciplinas}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: info.index, animated: true, viewPosition: 0, viewOffset: 20 });
            }
          });
        }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id_turma.toString()}
        renderItem={renderCard}
        ListHeaderComponent={
          <>
            <View style={[styles.header, { paddingRight: 70 }]}>
              <View>
                <Text style={[styles.subtitle, { fontSize: getFontSize(15), color: colors.textSecondary }]}>Semestre 2026.1</Text>
                <Text style={[styles.title, { fontSize: getFontSize(28), color: colors.textPrimary }]}>Minhas Disciplinas</Text>
              </View>
              <ScalePressable
                style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.2)' : '#e8f5ea' }]}
                onPress={handleUpload}
                disabled={isProcessing}
                accessibilityRole="button"
                accessibilityLabel="Atualizar disciplinas"
              >
                <SymbolView
                  name={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" } as any}
                  size={20}
                  tintColor={colors.primary}
                  fallback={<Text style={{ fontSize: 16 }}>🔄</Text>}
                />
              </ScalePressable>
            </View>

            <View style={styles.searchContainer}>
              <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <SymbolView name={{ ios: "magnifyingglass", android: "search", web: "search" } as any} size={20} tintColor={colors.inactiveText} fallback={<Text style={{ fontSize: 16 }}>🔍</Text>} />
                <TextInput
                  style={[styles.searchInput, { fontSize: getFontSize(16), color: colors.textPrimary }]}
                  placeholder="Buscar disciplina..."
                  placeholderTextColor={colors.textPlaceholder}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            <View style={{ paddingBottom: 16 }}>
              {/* Added View wrapper instead of Link to avoid navigation issues while keeping design */}
              <TouchableOpacity onPress={() => {/* Handle navigate */}}>
                <ScalePressable>
                  {({ pressed }) => (
                    <View style={[styles.gradeCard, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.1)' : '#f0fdf4', borderColor: isDark ? 'rgba(29, 141, 40, 0.3)' : '#a4f4cf' }, pressed && { opacity: 0.72 }]}>
                      <View style={[styles.gradeIconContainer, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.2)' : '#ffffff' }]}>
                        <SymbolView name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" } as any} size={24} tintColor={colors.primary} fallback={<Text style={{ fontSize: 20 }}>📅</Text>} />
                      </View>
                      <View style={styles.gradeTextContainer}>
                        <Text style={[styles.gradeTitle, { fontSize: getFontSize(17), color: colors.textPrimary }]}>Grade Horária</Text>
                        <Text style={[styles.gradeSubtitle, { fontSize: getFontSize(14), color: colors.textSecondary }]}>Visualizar sua semana</Text>
                      </View>
                      <SymbolView name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any} size={20} tintColor={colors.primary} fallback={<Text style={{ fontSize: 16, color: colors.primary }}>›</Text>} />
                    </View>
                  )}
                </ScalePressable>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyGlobalContainer}>
              <Text style={[styles.emptyGlobalTitle, { fontSize: getFontSize(18), color: colors.textPrimary }]}>Nenhuma disciplina encontrada</Text>
              <Text style={[styles.emptyGlobalDesc, { fontSize: getFontSize(14), color: colors.textSecondary }]}>
                  Para carregar sua grade, por favor faça o upload da declaração ou histórico escolar. Se você não tiver disciplinas no semestre, tudo bem também.
              </Text>
              <ScalePressable style={[styles.uploadButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleUpload} disabled={isProcessing}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  gradeCard: {
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  gradeIconContainer: {
    width: 48,
    height: 48,
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
  },
  gradeSubtitle: {
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 0.8,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    borderWidth: 0.8,
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
    marginBottom: 2,
  },
  cardSubtitle: {
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
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerLabel: {
    fontWeight: '500',
  },
  footerValue: {
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
  emptyGlobalTitle: { fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  emptyGlobalDesc: { textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  uploadButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, elevation: 2, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  uploadButtonText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
  expandedContent: {
    marginTop: 16,
    overflow: 'hidden',
  },
  expandedDivider: {
    height: 1,
    marginBottom: 16,
    marginHorizontal: -20,
  },
  expandedSectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '600',
  },
  updateItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingRight: 8,
  },
  updateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  updateDate: {
    fontWeight: '500',
    marginBottom: 2,
  },
  updateText: {
    lineHeight: 20,
  },
});
