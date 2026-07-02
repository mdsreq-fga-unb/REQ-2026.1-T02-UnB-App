import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, SectionList, ActivityIndicator } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useSQLiteContext } from 'expo-sqlite';
import { buscarHistoricoEscolar, type HistoricoInfo } from '../../database/queries/gradeQueries';

type GroupedHistorico = {
  title: string;
  data: HistoricoInfo[];
};

export default function TurmasAnterioresModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();
  const db = useSQLiteContext();
  
  const [historico, setHistorico] = useState<GroupedHistorico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await buscarHistoricoEscolar(db);
      
      const groups: Record<string, HistoricoInfo[]> = {};
      data.forEach(item => {
        const key = `${item.ano}.${item.periodo}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
      });
      
      const sections = Object.keys(groups).map(key => ({
        title: key,
        data: groups[key]
      }));
      
      setHistorico(sections);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'AP': return colors.primary; // Aprovado
      case 'RM': 
      case 'RR': 
      case 'SR': 
      case 'MI': return colors.danger; // Reprovados
      case 'TR': return colors.inactiveText; // Trancado
      case 'CC': return colors.textSecondary; // Cancelado
      default: return colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: HistoricoInfo }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.codigoText, { fontSize: getFontSize(13), color: colors.textSecondary }]}>{item.codigo_disciplina}</Text>
        <View style={[styles.badge, { backgroundColor: getSituacaoColor(item.situacao) + '20' }]}>
           <Text style={[styles.badgeText, { fontSize: getFontSize(12), color: getSituacaoColor(item.situacao) }]}>{item.situacao}</Text>
        </View>
      </View>
      <Text style={[styles.nomeText, { fontSize: getFontSize(16), color: colors.textPrimary }]} numberOfLines={2}>
        {item.nome_disciplina}
      </Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), color: colors.textPrimary }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" } as any} size={28} tintColor={colors.inactiveText} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20), color: colors.textPrimary }]}>Turmas Anteriores</Text>
          <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : historico.length === 0 ? (
        <View style={styles.centerContainer}>
          <SymbolView name={{ ios: "doc.text.magnifyingglass", android: "search", web: "search" } as any} size={48} tintColor={colors.inactiveText} fallback={<Text style={{ fontSize: 40 }}>🔍</Text>} />
          <Text style={[styles.emptyMessage, { fontSize: getFontSize(18), color: colors.textPrimary }]}>Nenhuma disciplina anterior encontrada</Text>
          <Text style={[styles.emptySubmessage, { fontSize: getFontSize(15), color: colors.textSecondary }]}>Atualize seus dados na aba "Minhas Disciplinas" com o seu Histórico Escolar para ver suas matérias anteriores aqui.</Text>
        </View>
      ) : (
        <SectionList
          sections={historico}
          keyExtractor={(item, index) => item.codigo_disciplina + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
          stickySectionHeadersEnabled={false}
        />
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
  },
  closeBtn: {
    padding: 4,
  },
  title: { fontWeight: 'bold' },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codigoText: {
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  badgeText: {
    fontWeight: 'bold',
  },
  nomeText: {
    fontWeight: '600',
    lineHeight: 22,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyMessage: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubmessage: {
    textAlign: 'center',
    lineHeight: 22,
  }
});
