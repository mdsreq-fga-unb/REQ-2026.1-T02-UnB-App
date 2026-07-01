import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert , Platform} from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useSQLiteContext } from 'expo-sqlite';
import { useUserProfile } from '../contexts/UserProfileContext';
import { buscarGradePorDia, temGradeCadastrada, popularGradePorDados, type AulaCard } from '../../database/queries/gradeQueries';
import { extrairDadosDoPDF } from '../../utils/pdfParser';
import * as DocumentPicker from 'expo-document-picker';
import { extractTextWithInfo } from 'expo-pdf-text-extract';
import { useTextSize } from "@/contexts/TextSizeContext";
import { useTheme } from '@/contexts/ThemeContext';
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { toast } from 'react-native-pretty-toast';

const DIAS_SEMANA = [
  { id: 2, nome: 'Seg' },
  { id: 3, nome: 'Ter' },
  { id: 4, nome: 'Qua' },
  { id: 5, nome: 'Qui' },
  { id: 6, nome: 'Sex' },
  { id: 7, nome: 'Sáb' },
];

export default function GradeHorariaModalScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();
  const { userName, userMatricula, autoSyncPDFData, updateUserProfile } = useUserProfile();
  
  const [diaSelecionado, setDiaSelecionado] = useState(() => {
    const hoje = new Date().getDay();
    return hoje >= 2 && hoje <= 7 ? hoje : 2;
  });
  
  const [aulas, setAulas] = useState<AulaCard[]>([]);
  const [hasGrade, setHasGrade] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 250);
    return () => clearTimeout(timeout);
  }, []);

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
         toast.error('Falha na Extração', { message: 'Tente novamente ou use outro arquivo.' });
         setIsProcessing(false);
         return;
      }

      const data = extrairDadosDoPDF(extractResult.text);
      if (data.disciplinas.length === 0) {
         toast.error('PDF Inválido', { message: 'Não foi possível encontrar disciplinas válidas neste PDF.' });
         setIsProcessing(false);
         return;
      }

      let shouldSync = autoSyncPDFData;
      let proceed = true;

      if (data.aluno) {
        if (userMatricula && userMatricula !== data.aluno.matricula) {
          proceed = await new Promise((resolve) => {
            Alert.alert(
              "Documento Inconsistente",
              `Este documento pertence a ${data.aluno!.nome} (${data.aluno!.matricula}), que é diferente do seu perfil. Deseja realmente importar esta grade?`,
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
        } else if (!userMatricula) {
          shouldSync = true;
        }
      }

      if (!proceed) {
        setIsProcessing(false);
        return;
      }

      await popularGradePorDados(db, data.aluno, data.disciplinas, shouldSync);
      
      if (shouldSync && data.aluno) {
         await updateUserProfile(data.aluno.nome, data.aluno.matricula);
      }

      toast.success('Grade importada com sucesso!');
      await carregarAulas();
    } catch (error: any) {
       toast.error('Erro ao processar', { message: error.message });
    } finally {
       setIsProcessing(false);
    }
  };

  const carregarAulas = useCallback(async () => {
    try {
      const gradeExiste = await temGradeCadastrada(db);
      setHasGrade(gradeExiste);
      if (gradeExiste) {
        const data = await buscarGradePorDia(db, diaSelecionado);
        setAulas(data);
      } else {
        setAulas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar grade:', error);
    }
  }, [db, diaSelecionado]);

  useEffect(() => {
    if (isReady) {
      carregarAulas();
    }
  }, [carregarAulas, isReady]);

  const renderCard = ({ item }: { item: AulaCard }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.timeContainer, { borderRightColor: colors.border }]}>
        <Text style={[styles.timeText, { fontSize: getFontSize(16), color: colors.primary }]}>{item.hora_inicio}</Text>
        <Text style={[styles.timeSubtext, { fontSize: getFontSize(12), color: colors.textSecondary }]}>às {item.hora_fim}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.courseName, { fontSize: getFontSize(15), color: colors.textPrimary }]}>{item.nome_disciplina}</Text>
        <Text style={[styles.courseCode, { fontSize: getFontSize(13), color: colors.textSecondary }]}>{item.codigo_disciplina} - Turma {item.codigo_turma}</Text>
        <View style={[styles.infoRow, { marginBottom: 4 }]}>
          <SymbolView name={{ ios: "mappin.and.ellipse", android: "location_on", web: "location_on" } as any} size={14} tintColor={colors.inactiveText} fallback={<Text style={{ fontSize: 12 }}>📍</Text>} />
          <Text style={[styles.location, { fontSize: getFontSize(13), color: colors.textPrimary }]}>{item.local}</Text>
        </View>
        <View style={styles.infoRow}>
          <SymbolView name={{ ios: "person.fill", android: "person", web: "person" } as any} size={14} tintColor={colors.inactiveText} fallback={<Text style={{ fontSize: 12 }}>👨‍🏫</Text>} />
          <Text style={[styles.docente, { fontSize: getFontSize(13), color: colors.textSecondary }]}>{item.docente_nome}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor={colors.textPrimary} fallback={<Text style={{fontSize: 20}}>X</Text>} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20), color: colors.textPrimary }]}>Grade Horária</Text>
          <View style={{ width: 24 }} />
      </View>

      {hasGrade === false ? (
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
      ) : (
          <View style={{ flex: 1 }}>
              <View style={styles.daysContainer}>
                  {DIAS_SEMANA.map((dia) => (
                  <ScalePressable
                      key={dia.id}
                      style={[
                      styles.dayButton,
                      { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.2)' : '#e2e8f0' },
                      diaSelecionado === dia.id && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => setDiaSelecionado(dia.id)}
                  >
                      <Text style={[
                      styles.dayText,
                      { fontSize: getFontSize(14), color: colors.textSecondary },
                      diaSelecionado === dia.id && styles.dayTextSelected
                      ]}>
                      {dia.nome}
                      </Text>
                  </ScalePressable>
                  ))}
              </View>

              {!isReady ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : (
                <FlatList
                    data={aulas}
                    keyExtractor={(item) => item.id_horario.toString()}
                    renderItem={renderCard}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <SymbolView name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" } as any} size={28} tintColor={colors.primary} fallback={<Text style={{ fontSize: 24 }}>✨</Text>} />
                      <Text style={[styles.emptyText, { fontSize: getFontSize(16), color: colors.textSecondary }]}>Nenhuma aula neste dia. Aproveite o descanso!</Text>
                    </View>
                    }
                />
              )}
          </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  title: { fontWeight: 'bold' },
  daysContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  dayButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  dayButtonSelected: {},
  dayText: { fontWeight: '600' },
  dayTextSelected: { color: '#ffffff' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { flexDirection: 'row', borderRadius: 16, padding: 16, marginBottom: 16, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1 },
  timeContainer: { borderRightWidth: 1, paddingRight: 16, marginRight: 16, justifyContent: 'center', alignItems: 'center', minWidth: 70 },
  timeText: { fontWeight: 'bold' },
  timeSubtext: { marginTop: 4 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  courseName: { fontWeight: 'bold', marginBottom: 4 },
  courseCode: { marginBottom: 8 },
  location: { fontWeight: '500' },
  docente: {},
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 12 },
  emptyText: { textAlign: 'center' },
  emptyGlobalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 60 },
  emptyGlobalTitle: { fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  emptyGlobalDesc: { textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  uploadButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, elevation: 2, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  uploadButtonText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
});
