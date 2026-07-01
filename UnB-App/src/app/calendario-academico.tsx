import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import ScalePressable from '@/components/ScalePressable';
import { useTextSize } from '@/contexts/TextSizeContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  buscarEventosCalendarioAcademico,
  buscarResumoCalendarioAcademico,
  sincronizarCalendarioAcademico,
  type EventoCalendarioAcademico,
  type TipoEventoCalendario,
} from '../../database/queries/calendarioQueries';

const FONT = 'Inter';

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const TYPE_META: Record<TipoEventoCalendario, { label: string; icon: { ios: string; android: string; web: string } }> = {
  matricula: {
    label: 'Matrícula',
    icon: { ios: 'person.crop.rectangle.badge.plus', android: 'how_to_reg', web: 'how_to_reg' },
  },
  aulas: {
    label: 'Aulas',
    icon: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  },
  feriado: {
    label: 'Feriado',
    icon: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  },
  ponto_facultativo: {
    label: 'Ponto facultativo',
    icon: { ios: 'pause.circle.fill', android: 'pause_circle', web: 'pause_circle' },
  },
  marco: {
    label: 'Marco acadêmico',
    icon: { ios: 'chart.line.uptrend.xyaxis', android: 'timeline', web: 'timeline' },
  },
};

function parseLocalDate(dateIso: string) {
  const [year, month, day] = dateIso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(inicio: string, fim: string) {
  const dataInicio = parseLocalDate(inicio);
  const dataFim = parseLocalDate(fim);
  const inicioLabel = `${String(dataInicio.getDate()).padStart(2, '0')}/${String(dataInicio.getMonth() + 1).padStart(2, '0')}`;

  if (inicio === fim) {
    return inicioLabel;
  }

  return `${inicioLabel} a ${String(dataFim.getDate()).padStart(2, '0')}/${String(dataFim.getMonth() + 1).padStart(2, '0')}`;
}

function formatDateTime(value: string | null) {
  if (!value) return 'Ainda não sincronizado';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Ainda não sincronizado';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function groupByMonth(eventos: EventoCalendarioAcademico[]) {
  return eventos.reduce<{ month: string; data: EventoCalendarioAcademico[] }[]>((groups, evento) => {
    const date = parseLocalDate(evento.data_inicio);
    const month = MONTHS[date.getMonth()];
    const currentGroup = groups.find((group) => group.month === month);

    if (currentGroup) {
      currentGroup.data.push(evento);
    } else {
      groups.push({ month, data: [evento] });
    }

    return groups;
  }, []);
}

export default function CalendarioAcademicoScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();
  const [eventos, setEventos] = useState<EventoCalendarioAcademico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resumo, setResumo] = useState<{
    ano: number;
    periodo: number;
    ultimaSync: string | null;
    fonte: string;
  } | null>(null);

  const carregarCalendario = useCallback(async () => {
    try {
      setIsLoading(true);
      await sincronizarCalendarioAcademico(db);
      const [eventosData, resumoData] = await Promise.all([
        buscarEventosCalendarioAcademico(db),
        buscarResumoCalendarioAcademico(db),
      ]);

      setEventos(eventosData);
      setResumo(resumoData);
    } catch (error) {
      console.error('Erro ao carregar calendario academico:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    carregarCalendario();
  }, [carregarCalendario]);

  const eventosPorMes = useMemo(() => groupByMonth(eventos), [eventos]);
  const sourceUrl = resumo?.fonte || eventos[0]?.fonte || '';

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScalePressable style={styles.closeButton} onPress={() => router.back()}>
          <SymbolView
            name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' } as any}
            size={28}
            tintColor={colors.inactiveText}
          />
        </ScalePressable>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { fontSize: getFontSize(20), color: colors.textPrimary }]}>
            Calendário Acadêmico
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: getFontSize(13), color: colors.textSecondary }]}>
            {resumo ? `${resumo.ano}.${resumo.periodo}` : 'Graduação'}
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.iconBackground }]}>
              <SymbolView
                name={{ ios: 'calendar.badge.clock', android: 'event_available', web: 'event_available' } as any}
                size={28}
                tintColor={colors.primary}
              />
            </View>
            <View style={styles.summaryText}>
              <Text style={[styles.summaryTitle, { fontSize: getFontSize(18), color: colors.textPrimary }]}>
                Graduação {resumo?.ano}.{resumo?.periodo}
              </Text>
              <Text style={[styles.summaryMeta, { fontSize: getFontSize(14), color: colors.textSecondary }]}>
                Atualizado semanalmente ao abrir o app
              </Text>
            </View>
          </View>

          <View style={styles.legendRow}>
            {(['matricula', 'aulas', 'feriado', 'ponto_facultativo', 'marco'] as TipoEventoCalendario[]).map((tipo) => (
              <View key={tipo} style={[styles.legendPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#eef4f1', borderColor: colors.border }]}>
                <View style={[styles.legendDot, { backgroundColor: getTypeColor(tipo, colors.primary) }]} />
                <Text style={[styles.legendText, { fontSize: getFontSize(12), color: colors.textSecondary }]} numberOfLines={1}>
                  {TYPE_META[tipo].label}
                </Text>
              </View>
            ))}
          </View>

          {eventosPorMes.map((group) => (
            <View key={group.month} style={styles.monthSection}>
              <Text style={[styles.monthTitle, { fontSize: getFontSize(18), color: colors.textPrimary }]}>
                {group.month}
              </Text>
              <View style={styles.timeline}>
                <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                {group.data.map((evento) => (
                  <View key={evento.id_calendario} style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: getTypeColor(evento.tipo, colors.primary),
                          borderColor: colors.background,
                        },
                      ]}
                    />
                    <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <View style={styles.eventHeader}>
                        <View style={[styles.eventIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }]}>
                          <SymbolView
                            name={TYPE_META[evento.tipo].icon as any}
                            size={16}
                            tintColor={getTypeColor(evento.tipo, colors.primary)}
                          />
                        </View>
                        <Text style={[styles.eventDate, { fontSize: getFontSize(14), color: colors.textSecondary }]}>
                          {formatDateLabel(evento.data_inicio, evento.data_fim)}
                        </Text>
                      </View>
                      <Text selectable style={[styles.eventTitle, { fontSize: getFontSize(16), color: colors.textPrimary }]}>
                        {evento.titulo}
                      </Text>
                      <Text style={[styles.eventType, { fontSize: getFontSize(13), color: colors.textSecondary }]}>
                        {TYPE_META[evento.tipo].label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={[styles.sourceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sourceTitle, { fontSize: getFontSize(15), color: colors.textPrimary }]}>
              Fonte oficial
            </Text>
            <Text selectable style={[styles.sourceMeta, { fontSize: getFontSize(13), color: colors.textSecondary }]}>
              Última sincronização: {formatDateTime(resumo?.ultimaSync || null)}
            </Text>
            <ScalePressable
              onPress={() => {
                if (sourceUrl) {
                  Linking.openURL(sourceUrl);
                }
              }}
              style={({ pressed }) => [
                styles.sourceButton,
                { borderColor: colors.primary },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.sourceButtonText, { fontSize: getFontSize(15), color: colors.primary }]}>
                Abrir PDF da SAA
              </Text>
              <SymbolView
                name={{ ios: 'arrow.up.right.square', android: 'open_in_new', web: 'open_in_new' } as any}
                size={18}
                tintColor={colors.primary}
              />
            </ScalePressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function getTypeColor(tipo: TipoEventoCalendario, fallback: string) {
  const colorsByType: Record<TipoEventoCalendario, string> = {
    matricula: '#2563eb',
    aulas: fallback,
    feriado: '#dc2626',
    ponto_facultativo: '#f59e0b',
    marco: '#7c3aed',
  };

  return colorsByType[tipo];
}

const styles = StyleSheet.create({
  safeArea: {
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
  closeButton: {
    padding: 4,
  },
  headerText: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONT,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: FONT,
    fontWeight: '500',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 44,
    gap: 20,
  },
  summaryCard: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 0.8,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    flex: 1,
    gap: 3,
  },
  summaryTitle: {
    fontFamily: FONT,
    fontWeight: '700',
  },
  summaryMeta: {
    fontFamily: FONT,
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendPill: {
    minHeight: 32,
    borderRadius: 16,
    borderWidth: 0.8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: FONT,
    fontWeight: '600',
  },
  monthSection: {
    gap: 12,
  },
  monthTitle: {
    fontFamily: FONT,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  timeline: {
    paddingLeft: 16,
    gap: 14,
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: 10,
    bottom: 4,
    width: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 18,
    marginLeft: -2,
    zIndex: 1,
    borderWidth: 2,
  },
  eventCard: {
    flex: 1,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 0.8,
    padding: 16,
    gap: 7,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDate: {
    fontFamily: FONT,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  eventTitle: {
    fontFamily: FONT,
    fontWeight: '700',
    lineHeight: 23,
  },
  eventType: {
    fontFamily: FONT,
    fontWeight: '500',
  },
  sourceCard: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 0.8,
    padding: 16,
    gap: 10,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  sourceTitle: {
    fontFamily: FONT,
    fontWeight: '700',
  },
  sourceMeta: {
    fontFamily: FONT,
    fontWeight: '500',
  },
  sourceButton: {
    minHeight: 46,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.4,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sourceButtonText: {
    fontFamily: FONT,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
