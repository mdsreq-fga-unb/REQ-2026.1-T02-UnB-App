import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScalePressable from "@/components/ScalePressable";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useTextSize } from "@/contexts/TextSizeContext";
import { useRouter, useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { buscarTodasDisciplinas, type DisciplinaInfo } from '../../../database/queries/gradeQueries';

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

const COLORS = {
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  divider: "#f1f5f9",
  primary: "#1d8d28",
  primarySoft: "#e8f5ea",
  textPrimary: "#0f172b",
  textSecondary: "#45556c",
  textMuted: "#62748e",
  textPlaceholder: "#64748b",
  danger: "#d4183d",
} as const;

const FONT = "Inter";

function ActionTile({ title, icon, badge, onPress, index }: ActionTileProps) {
  const { getFontSize } = useTextSize();

  return (
    <Animated.View 
      style={{ flexBasis: "48%", flexGrow: 1 }}
    >
      <ScalePressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.tile,
          { flexBasis: 'auto', flexGrow: 0 },
          pressed && styles.tilePressed,
        ]}
      >
      <View style={styles.tileIconWrapper}>
        {/* name recebe o objeto diretamente — iOS usa SF Symbol, Android usa Material Symbol */}
        <SymbolView
          name={icon as any}
          tintColor={COLORS.primary}
          size={28}
        />
      </View>
      <Text
        style={[
          styles.tileTitle,
          { fontSize: getFontSize(18), lineHeight: getFontSize(22.5) },
        ]}
      >
        {title}
      </Text>
      {badge ? (
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { fontSize: getFontSize(14) }]}>
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
            { fontSize: getFontSize(17), lineHeight: getFontSize(25.5) },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={[
            styles.courseMeta,
            { fontSize: getFontSize(14), lineHeight: getFontSize(21) },
          ]}
          numberOfLines={1}
        >
          {meta}
        </Text>
      </View>

      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={22}
        tintColor={COLORS.textPlaceholder}
      />
      </ScalePressable>
    </Animated.View>
  );
}

function FooterShortcut({ title, icon, onPress }: FooterShortcutProps) {
  const { getFontSize } = useTextSize();

  return (
    <ScalePressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.shortcut,
        pressed && styles.tilePressed,
      ]}
    >

      <SymbolView name={icon as any} size={26} tintColor={COLORS.textPrimary} />

      <Text
        style={[
          styles.shortcutTitle,
          { fontSize: getFontSize(17), lineHeight: getFontSize(25.5) },
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
  const db = useSQLiteContext();
  const [disciplinas, setDisciplinas] = useState<DisciplinaInfo[]>([]);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
        >
          {/* AppBar */}
          <View style={styles.appBar}>
            <View style={styles.logoBadge}>
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
                <Text style={{ color: COLORS.textPrimary }}>UnB </Text>
                <Text style={{ color: COLORS.primary }}>App</Text>
              </Text>
              <Text
                style={[
                  styles.appBarSubtitle,
                  { fontSize: getFontSize(12), lineHeight: getFontSize(15) },
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
                { fontSize: getFontSize(15), lineHeight: getFontSize(22.5) },
              ]}
            >
              Bom dia,
            </Text>
            <Text
              style={[
                styles.userName,
                { fontSize: getFontSize(28), lineHeight: getFontSize(35) },
              ]}
            >
              Olá, Rivadalvio!
            </Text>
          </View>

          {/* Main content */}
          <View style={styles.mainContent}>
            {/* Profile header card */}
            <ScalePressable
              onPress={() => router.navigate("/ajustes")}
              style={({ pressed }) => [
                styles.profileCard,
                pressed && { opacity: 0.7 }
              ]}
            >
              <View style={styles.profileAvatar}>

                <SymbolView
                  name={{ ios: "person.fill", android: "person", web: "person" }}
                  size={32}
                  tintColor={COLORS.primary}
                />

              </View>
              <View style={styles.profileInfo}>
                <Text
                  style={[
                    styles.profileName,
                    { fontSize: getFontSize(22), lineHeight: getFontSize(27.5) },
                  ]}
                  numberOfLines={1}
                >
                  Rivadalvio Joaquim
                </Text>
                <Text
                  style={[
                    styles.profileMeta,
                    { fontSize: getFontSize(15), lineHeight: getFontSize(20.625) },
                  ]}
                  numberOfLines={1}
                >
                  Faculdade de Ciências e Tecnologias
                </Text>
                <Text
                  style={[
                    styles.profileMeta,
                    { fontSize: getFontSize(15), lineHeight: getFontSize(20.625) },
                  ]}
                  numberOfLines={1}
                >
                  Campus UnB Gama
                </Text>
              </View>
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
                title="Minhas Atividades"
                icon={{ ios: "person.text.rectangle.fill", android: "badge", web: "badge" }}
              />
              <ActionTile
                index={2}
                title="Meus Documentos"
                icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
                onPress={() => router.push("/documents")}
              />
              <ActionTile
                index={3}
                title="Fórum do Curso"
                icon={{ ios: "bubble.left.and.bubble.right.fill", android: "forum", web: "forum" }}
                badge="2"
              />
            </View>

            {/* Latest updates */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>

                <SymbolView
                  name={{ ios: "megaphone.fill", android: "campaign", web: "campaign" }}
                  size={22}
                  tintColor={COLORS.textPrimary}
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    { fontSize: getFontSize(20), lineHeight: getFontSize(30) },
                  ]}
                >
                  Últimas Atualizações
                </Text>
              </View>

              <View style={styles.updateCard}>
                <Text
                  style={[
                    styles.updateEyebrow,
                    { fontSize: getFontSize(14), lineHeight: getFontSize(21) },
                  ]}
                >
                  16/03/2026 · QUALIDADE DE SOFTWARE 1
                </Text>
                <Text
                  style={[
                    styles.updateBody,
                    { fontSize: getFontSize(17), lineHeight: getFontSize(23.375) },
                  ]}
                >
                  Novo tópico no Aula: Apresentação do plano de ensino e formação das equipes de desenvolvimento.
                </Text>
                <ScalePressable
                  onPress={() => router.push("/disciplinas")}
                  style={({ pressed }) => [
                    styles.primaryButton,
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
            </View>

            {/* Courses */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>

                <SymbolView
                  name={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
                  size={22}
                  tintColor={COLORS.textPrimary}
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    { fontSize: getFontSize(20), lineHeight: getFontSize(30) },
                  ]}
                >
                  Minhas Disciplinas
                </Text>
              </View>

              <View style={styles.coursesCard}>
                {disciplinas.slice(0, 4).map((disciplina, index) => (
                  <View key={disciplina.id_turma.toString()}>
                    <CourseRow
                      index={index}
                      name={disciplina.nome_disciplina}
                      meta={`2026.1 · ${disciplina.codigo_disciplina}${disciplina.horarios_formatados ? ` · ${disciplina.horarios_formatados}` : ''}`}
                      onPress={() => router.push("/disciplinas")}
                    />
                    {index < Math.min(disciplinas.length, 4) - 1 && <View style={styles.courseDivider} />}
                  </View>
                ))}
                {disciplinas.length === 0 && (
                  <Text style={{ padding: 16, color: COLORS.textMuted, textAlign: 'center', fontFamily: FONT }}>
                    Nenhuma disciplina encontrada.
                  </Text>
                )}
              </View>

              <ScalePressable
                onPress={() => router.push("/disciplinas")}
                style={({ pressed }) => [
                  styles.outlineButton,
                  pressed && styles.outlineButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.outlineButtonText,
                    { fontSize: getFontSize(16), lineHeight: getFontSize(24) },
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
              />
              <FooterShortcut
                title="Grade Horária"
                icon={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
                onPress={() => router.push('/grade-modal')}
              />
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
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
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
  },
  userName: {
    fontFamily: FONT,
    fontWeight: "700",
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: COLORS.border,
    padding: 20.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 26843500,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONT,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  profileMeta: {
    fontFamily: FONT,
    fontWeight: "400",
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: COLORS.border,
    padding: 20.8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
    position: "relative",
  },
  tilePressed: {
    opacity: 0.7,
  },
  tileIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: {
    fontFamily: FONT,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    minWidth: 28,
    height: 28,
    borderRadius: 26843500,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: FONT,
    fontWeight: "700",
    color: COLORS.surface,
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
    color: COLORS.textPrimary,
  },

  // Update card
  updateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: COLORS.border,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
  },
  updateEyebrow: {
    fontFamily: FONT,
    fontWeight: "600",
    color: COLORS.textMuted,
    letterSpacing: 0.35,
  },
  updateBody: {
    fontFamily: FONT,
    fontWeight: "400",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  primaryButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
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
    color: COLORS.surface,
    textAlign: "center",
  },

  // Courses
  coursesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  courseDivider: {
    height: 0.8,
    backgroundColor: COLORS.divider,
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
    color: COLORS.textPrimary,
  },
  courseMeta: {
    fontFamily: FONT,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },

  // Outline button
  outlineButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.6,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonPressed: {
    opacity: 0.7,
  },
  outlineButtonText: {
    fontFamily: FONT,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
  },

  // Shortcuts
  shortcutsRow: {
    flexDirection: "row",
    gap: 12,
  },
  shortcut: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: COLORS.border,
    padding: 20.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
  },
  shortcutTitle: {
    fontFamily: FONT,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },

});