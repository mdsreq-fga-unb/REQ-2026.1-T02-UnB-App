import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useSQLiteContext } from 'expo-sqlite';
import { useUserProfile } from '../contexts/UserProfileContext';
import { buscarGradePorDia, temGradeCadastrada, popularGradePorDados, type AulaCard } from '../../database/queries/gradeQueries';
import { extrairDadosDoPDF } from '../../utils/pdfParser';
import * as DocumentPicker from 'expo-document-picker';
import { extractTextWithInfo } from 'expo-pdf-text-extract';
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

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
         alert('Falha ao extrair texto do PDF. Tente novamente ou use outro arquivo.');
         setIsProcessing(false);
         return;
      }

      const data = extrairDadosDoPDF(extractResult.text);
      if (data.disciplinas.length === 0) {
         alert('Não foi possível encontrar disciplinas válidas neste PDF.');
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
              `Este documento pertence a ${data.aluno.nome} (${data.aluno.matricula}), que é diferente do seu perfil. Deseja realmente importar esta grade?`,
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

      alert('Grade importada com sucesso!');
      await carregarAulas();
    } catch (error: any) {
       alert(`Erro ao processar o arquivo: ${error.message}`);
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
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { fontSize: getFontSize(16) }]}>{item.hora_inicio}</Text>
        <Text style={[styles.timeSubtext, { fontSize: getFontSize(12) }]}>às {item.hora_fim}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.courseName, { fontSize: getFontSize(15) }]}>{item.nome_disciplina}</Text>
        <Text style={[styles.courseCode, { fontSize: getFontSize(13) }]}>{item.codigo_disciplina} - Turma {item.codigo_turma}</Text>
        <View style={[styles.infoRow, { marginBottom: 4 }]}>
          <SymbolView name={{ ios: "mappin.and.ellipse", android: "location_on", web: "location_on" } as any} size={14} tintColor="#334155" fallback={<Text style={{ fontSize: 12 }}>📍</Text>} />
          <Text style={[styles.location, { fontSize: getFontSize(13) }]}>{item.local}</Text>
        </View>
        <View style={styles.infoRow}>
          <SymbolView name={{ ios: "person.fill", android: "person", web: "person" } as any} size={14} tintColor="#64748b" fallback={<Text style={{ fontSize: 12 }}>👨‍🏫</Text>} />
          <Text style={[styles.docente, { fontSize: getFontSize(13) }]}>{item.docente_nome}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor="#0f172b" fallback={<Text style={{fontSize: 20}}>X</Text>} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20) }]}>Grade Horária</Text>
          <View style={{ width: 24 }} />
      </View>

      {hasGrade === false ? (
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
      ) : (
          <View style={{ flex: 1 }}>
              <View style={styles.daysContainer}>
                  {DIAS_SEMANA.map((dia) => (
                  <ScalePressable
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
                  </ScalePressable>
                  ))}
              </View>

              {!isReady ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#1d8d28" />
                </View>
              ) : (
                <FlatList
                    data={aulas}
                    keyExtractor={(item) => item.id_horario.toString()}
                    renderItem={renderCard}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <SymbolView name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" } as any} size={28} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 24 }}>✨</Text>} />
                      <Text style={[styles.emptyText, { fontSize: getFontSize(16) }]}>Nenhuma aula neste dia. Aproveite o descanso!</Text>
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
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  title: { fontWeight: 'bold', color: '#0f172b' },
  daysContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  dayButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#e2e8f0' },
  dayButtonSelected: { backgroundColor: '#1d8d28' },
  dayText: { fontWeight: '600', color: '#475569' },
  dayTextSelected: { color: '#ffffff' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  timeContainer: { borderRightWidth: 1, borderRightColor: '#e2e8f0', paddingRight: 16, marginRight: 16, justifyContent: 'center', alignItems: 'center', minWidth: 70 },
  timeText: { fontWeight: 'bold', color: '#1d8d28' },
  timeSubtext: { color: '#64748b', marginTop: 4 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  courseName: { fontWeight: 'bold', color: '#0f172b', marginBottom: 4 },
  courseCode: { color: '#475569', marginBottom: 8 },
  location: { color: '#334155', fontWeight: '500' },
  docente: { color: '#64748b' },
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 12 },
  emptyText: { textAlign: 'center', color: '#64748b' },
  emptyGlobalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 60 },
  emptyGlobalTitle: { fontWeight: 'bold', color: '#0f172b', marginBottom: 12, textAlign: 'center' },
  emptyGlobalDesc: { color: '#64748b', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  uploadButton: { backgroundColor: '#1d8d28', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, elevation: 2, shadowColor: '#1d8d28', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  uploadButtonText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
});
