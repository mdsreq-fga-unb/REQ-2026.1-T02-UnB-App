import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScalePressable from "@/components/ScalePressable";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useTextSize } from "@/contexts/TextSizeContext";
import { useRouter, useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, type DisciplinaInfo } from '../../../database/queries/gradeQueries';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useTheme } from '@/contexts/ThemeContext';

// Tipo local para ícones multiplataforma
type SymbolName = { ios: string; android: string; web?: string };

type ActionTileProps = {
  title: string;
  icon: SymbolName;
  badge?: string;
  onPress?: () => void;
  index: number;
};

type CourseRowProps = {
  name: string;
  meta: string;
  onPress?: () => void;
  index?: number;
};

type FooterShortcutProps = {
  title: string;
  icon: SymbolName;
  onPress?: () => void;
};
const FONT = "Inter";

function ActionTile({ title, icon, badge, onPress, index }: ActionTileProps) {
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();

  return (
    <Animated.View
      style={{ flexBasis: "48%", flexGrow: 1 }}
    >
      <ScalePressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.tile,
          { flexBasis: 'auto', flexGrow: 0, backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.tilePressed,
        ]}
      >
        <View style={[styles.tileIconWrapper, { backgroundColor: colors.iconBackground }]}>
          {/* name recebe o objeto diretamente — iOS usa SF Symbol, Android usa Material Symbol */}
          <SymbolView
            name={icon as any}
            tintColor={colors.primary}
            size={28}
          />
        </View>
        <Text
          style={[
            styles.tileTitle,
            { fontSize: getFontSize(18), lineHeight: getFontSize(22.5), color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
            <Text style={[styles.badgeText, { fontSize: getFontSize(14), color: "#ffffff" }]}>
              {badge}
            </Text>
          </View>
        ) : null}
      </ScalePressable>
    </Animated.View>
  );
}

function CourseRow({ name, meta, onPress, index = 0 }: CourseRowProps) {
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();

  return (
    <Animated.View>
      <ScalePressable
        onPress={onPress}
        style={({ pressed }) => [styles.courseRow, pressed && styles.rowPressed]}
      >
        <View style={styles.courseText}>
          <Text
            style={[
              styles.courseName,
              { fontSize: getFontSize(17), lineHeight: getFontSize(25.5), color: colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            style={[
              styles.courseMeta,
              { fontSize: getFontSize(14), lineHeight: getFontSize(21), color: colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {meta}
          </Text>
        </View>

        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
          size={22}
          tintColor={colors.inactiveText}
        />
      </ScalePressable>
    </Animated.View>
  );
}

function FooterShortcut({ title, icon, onPress }: FooterShortcutProps) {
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();

  return (
    <ScalePressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.shortcut,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.tilePressed,
      ]}
    >

      <SymbolView name={icon as any} size={26} tintColor={colors.textPrimary} />

      <Text
        style={[
          styles.shortcutTitle,
          { fontSize: getFontSize(17), lineHeight: getFontSize(25.5), color: colors.textPrimary },
        ]}
      >
        {title}
      </Text>
    </ScalePressable>
  );
}

export default function Index() {
  const { getFontSize } = useTextSize();
  const router = useRouter();
  const isFocused = useIsFocused();
  const db = useSQLiteContext();
  const { colors, isDark } = useTheme();
  const [disciplinas, setDisciplinas] = useState<DisciplinaInfo[]>([]);
  const [unseenUpdates, setUnseenUpdates] = useState<number>(0);
  const [totalUpdates, setTotalUpdates] = useState<number>(0);
  const { userName, userMatricula, isProfileLoaded } = useUserProfile();
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    if (isProfileLoaded && !userName && !hasPrompted) {
      setHasPrompted(true);
      setTimeout(() => {
        router.push('../welcome-modal');
      }, 500);
    }
  }, [isProfileLoaded, userName, hasPrompted, router]);

  useEffect(() => {
    if (userName) {
      setHasPrompted(false);
    }
  }, [userName]);

  const carregarDisciplinas = useCallback(async () => {
    try {
      const data = await buscarTodasDisciplinas(db);
      setDisciplinas(data);

      let total = 0;
      data.forEach((_, index) => {
        total += (index % 2 === 0) ? 2 : 1;
      });
      setTotalUpdates(total);

      try {
        const configRow = await db.getFirstAsync<{ valor: string }>(
          `SELECT valor FROM Configuracoes WHERE chave = 'seenUpdatesCount'`
        );
        const seen = configRow ? parseInt(configRow.valor, 10) : 0;
        setUnseenUpdates(Math.max(0, total - seen));
      } catch (err) {
        setUnseenUpdates(total);
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => {
        carregarDisciplinas();
      }, 200); // 200ms para aguardar a transição da aba
      return () => clearTimeout(timeoutId);
    }, [carregarDisciplinas])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        scrollsToTop={isFocused}
      >
        {/* AppBar */}
        <View style={[styles.appBar, { backgroundColor: isDark ? 'rgba(15,23,43,0.8)' : 'rgba(248, 250, 252, 0.8)', borderBottomColor: isDark ? 'rgba(49,65,88,0.6)' : 'rgba(226, 232, 240, 0.6)' }]}>
          <View style={[styles.logoBadge, { backgroundColor: colors.surface, shadowColor: colors.primary }]}>
            <Image
              source={require("@/../assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.appBarText}>
            <Text
              style={[
                styles.appBarTitle,
                { fontSize: getFontSize(18), lineHeight: getFontSize(22.5) },
              ]}
            >
              <Text style={{ color: colors.textPrimary }}>UnB </Text>
              <Text style={{ color: colors.primary }}>App</Text>
            </Text>
            <Text
              style={[
                styles.appBarSubtitle,
                { fontSize: getFontSize(12), lineHeight: getFontSize(15), color: colors.textSecondary },
              ]}
            >
              Universidade de Brasília
            </Text>
          </View>
        </View>

        {/* Header greeting */}
        <View style={styles.header}>
          <Text
            style={[
              styles.greeting,
              { fontSize: getFontSize(15), lineHeight: getFontSize(22.5), color: colors.textSecondary },
            ]}
          >
            Bom dia,
          </Text>
          <Text
            style={[
              styles.userName,
              { fontSize: getFontSize(28), lineHeight: getFontSize(35), color: colors.textPrimary },
            ]}
          >
            Olá, {userName ? userName.split(' ')[0] : 'Aluno(a)'}!
          </Text>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Profile header card */}
          <ScalePressable
            onPress={() => router.navigate("/ajustes")}
            style={({ pressed }) => [
              styles.profileCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.7 }
            ]}
          >
            <View style={[styles.profileAvatar, { backgroundColor: colors.iconBackground }]}>
              <SymbolView
                name={{ ios: "person.fill", android: "person", web: "person" } as any}
                size={32}
                tintColor={colors.primary}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text
                style={[
                  styles.profileName,
                  { fontSize: getFontSize(20), lineHeight: getFontSize(25), color: colors.textPrimary },
                ]}
              >
                {userName || 'Usuário'}
              </Text>
              <Text
                style={[
                  styles.profileMeta,
                  { fontSize: getFontSize(15), lineHeight: getFontSize(20.625), color: colors.textSecondary },
                ]}
              >
                {userMatricula ? `Matrícula: ${userMatricula}` : 'Não informada'}
              </Text>
            </View>
            <SymbolView
              name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any}
              tintColor={colors.inactiveText}
              size={20}
              weight="semibold"
            />
          </ScalePressable>

          {/* Quick action tiles */}
          <View style={styles.tilesGrid}>
            <ActionTile
              index={0}
              title="Minhas Disciplinas"
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              onPress={() => router.push("/disciplinas")}
            />
            <ActionTile
              index={1}
              title="Meu Acesso"
              icon={{ ios: "person.text.rectangle.fill", android: "badge", web: "badge" }}
              onPress={() => router.push("../em-breve-modal")}
            />
            <ActionTile
              index={2}
              title="Meus Documentos"
              icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
              onPress={() => router.push("/documents")}
            />
            <ActionTile
              index={3}
              title="Atualizações"
              icon={{ ios: "bell.badge.fill", android: "notifications_active", web: "notifications_active" }}
              badge={unseenUpdates > 0 ? unseenUpdates.toString() : undefined}
              onPress={async () => {
                setUnseenUpdates(0);
                try {
                  await db.runAsync(
                    `INSERT OR REPLACE INTO Configuracoes (chave, valor) VALUES ('seenUpdatesCount', ?);`,
                    [totalUpdates.toString()]
                  );
                } catch (e) {
                  console.error('Error saving seen updates:', e);
                }
                router.push("/atualizacoes-modal");
              }}
            />
          </View>

          {/* Latest updates */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SymbolView
                name={{ ios: "megaphone.fill", android: "campaign", web: "campaign" }}
                size={22}
                tintColor={colors.textPrimary}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { fontSize: getFontSize(20), lineHeight: getFontSize(30), color: colors.textPrimary },
                ]}
              >
                Últimas Atualizações
              </Text>
            </View>

            {disciplinas.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 16, paddingHorizontal: 20 }}
                decelerationRate="fast"
                snapToInterval={316} // width (300) + gap (16)
              >
                {disciplinas.slice(0, 3).map((disciplina, index) => {
                  const MOCK_UPDATES = [
                    "A turma desta disciplina foi alterada no sistema.",
                    "O local das aulas foi atualizado. Verifique a nova sala.",
                    "Houve uma mudança no quadro de professores desta disciplina.",
                  ];
                  const updateText = MOCK_UPDATES[index % MOCK_UPDATES.length];

                  // Generate a dynamic date (e.g. today or yesterday)
                  const date = new Date();
                  date.setDate(date.getDate() - index);
                  const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                  return (
                    <View key={disciplina.id_turma.toString()} style={[styles.updateCard, { width: 300, backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Text
                        style={[
                          styles.updateEyebrow,
                          { fontSize: getFontSize(14), lineHeight: getFontSize(21), color: colors.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {dateStr} · {disciplina.nome_disciplina.toUpperCase()}
                      </Text>
                      <Text
                        style={[
                          styles.updateBody,
                          { fontSize: getFontSize(17), lineHeight: getFontSize(23.375), color: colors.textPrimary },
                        ]}
                        numberOfLines={3}
                      >
                        {updateText}
                      </Text>
                      <ScalePressable
                        onPress={() => router.push({ pathname: "/disciplinas", params: { expand: disciplina.id_turma } })}
                        style={({ pressed }) => [
                          styles.primaryButton,
                          { backgroundColor: colors.primary },
                          pressed && styles.primaryButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.primaryButtonText,
                            { fontSize: getFontSize(16), lineHeight: getFontSize(24) },
                          ]}
                        >
                          Ver Turma
                        </Text>
                      </ScalePressable>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={[styles.updateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text
                  style={[
                    styles.updateBody,
                    { fontSize: getFontSize(16), color: colors.textSecondary, textAlign: 'center' },
                  ]}
                >
                  Suas atualizações aparecerão aqui após importar suas disciplinas.
                </Text>
              </View>
            )}
          </View>

          {/* Courses */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>

              <SymbolView
                name={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
                size={22}
                tintColor={colors.textPrimary}
              />

              <Text
                style={[
                  styles.sectionTitle,
                  { fontSize: getFontSize(20), lineHeight: getFontSize(30), color: colors.textPrimary },
                ]}
              >
                Minhas Disciplinas
              </Text>
            </View>

            <View style={[styles.coursesCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {disciplinas.slice(0, 4).map((disciplina, index) => (
                <View key={disciplina.id_turma.toString()}>
                  <CourseRow
                    index={index}
                    name={disciplina.nome_disciplina}
                    meta={`2026.1 · ${disciplina.codigo_disciplina}${disciplina.horarios_formatados ? ` · ${disciplina.horarios_formatados}` : ''}`}
                    onPress={() => router.push({ pathname: "/disciplinas", params: { scrollTo: disciplina.id_turma } })}
                  />
                  {index < Math.min(disciplinas.length, 4) - 1 && <View style={[styles.courseDivider, { backgroundColor: colors.border }]} />}
                </View>
              ))}
              {disciplinas.length === 0 && (
                <Text style={{ padding: 16, color: colors.textSecondary, textAlign: 'center', fontFamily: FONT }}>
                  Nenhuma disciplina encontrada.
                </Text>
              )}
            </View>

            <ScalePressable
              onPress={() => router.push("/disciplinas")}
              style={({ pressed }) => [
                styles.outlineButton,
                { borderColor: colors.primary },
                pressed && styles.outlineButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.outlineButtonText,
                  { fontSize: getFontSize(16), lineHeight: getFontSize(24), color: colors.primary },
                ]}
              >
                Ver todas as disciplinas
              </Text>
            </ScalePressable>
          </View>

          {/* Footer shortcuts */}
          <View style={styles.shortcutsRow}>

            <FooterShortcut
              title="Turmas Anteriores"
              icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
              onPress={() => router.push('../turmas-anteriores-modal')}
            />
            <FooterShortcut
              title="Grade Horária"
              icon={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
              onPress={() => router.push('/grade-modal')}
            />
            <FooterShortcut
              title="Calendário Acadêmico"
              icon={{ ios: "calendar.badge.clock", android: "event_available", web: "event_available" }}
              onPress={() => router.push('/calendario-academico')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // AppBar
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12.8,
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    borderBottomWidth: 0.8,
    borderBottomColor: "rgba(226, 232, 240, 0.6)",
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  logoImage: {
    width: 52,
    height: 52,
    marginLeft: -2,
    marginTop: -2,
  },
  appBarText: {
    flex: 1,
  },
  appBarTitle: {
    fontFamily: FONT,
    fontWeight: "700",
    letterSpacing: -0.45,
  },
  appBarSubtitle: {
    fontFamily: FONT,
    fontWeight: "400",
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingRight: 80,
    paddingTop: 8,
  },
  greeting: {
    fontFamily: FONT,
    fontWeight: "400",
  },
  userName: {
    fontFamily: FONT,
    fontWeight: "700",
  },

  // Main content
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },

  // Profile card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    padding: 20.8,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONT,
    fontWeight: "600",
  },
  profileMeta: {
    fontFamily: FONT,
    fontWeight: "400",
  },

  // Tiles grid
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
    rowGap: 12,
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    padding: 20.8,
    gap: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    position: "relative",
  },
  tilePressed: {
    opacity: 0.7,
  },
  tileIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: {
    fontFamily: FONT,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: FONT,
    fontWeight: "700",
    lineHeight: 21,
  },

  // Section
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontWeight: "600",
  },

  // Update card
  updateCard: {
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    padding: 20,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  updateEyebrow: {
    fontFamily: FONT,
    fontWeight: "600",
    letterSpacing: 0.35,
  },
  updateBody: {
    fontFamily: FONT,
    fontWeight: "400",
    marginTop: 8,
  },
  primaryButton: {
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    fontFamily: FONT,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },

  // Courses
  coursesCard: {
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    paddingHorizontal: 20,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  courseDivider: {
    height: 0.8,
  },
  rowPressed: {
    opacity: 0.7,
  },
  courseText: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
  },
  courseName: {
    fontFamily: FONT,
    fontWeight: "600",
  },
  courseMeta: {
    fontFamily: FONT,
    fontWeight: "500",
  },

  outlineButton: {
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: 1.6,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonPressed: {
    opacity: 0.7,
  },
  outlineButtonText: {
    fontFamily: FONT,
    fontWeight: "600",
    textAlign: "center",
  },

  // Shortcuts
  shortcutsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  shortcut: {
    flexBasis: "48%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    padding: 20.8,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  shortcutTitle: {
    fontFamily: FONT,
    fontWeight: "600",
    flex: 1,
  },

});
