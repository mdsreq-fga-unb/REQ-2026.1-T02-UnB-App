import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTextSize } from "@/contexts/TextSizeContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import ScalePressable from "@/components/ScalePressable";
import { SymbolView } from "expo-symbols";

type SymbolName = { ios: string; android: string; web?: string };

export default function AjustesScreen() {
  const router = useRouter();
  const { getFontSize, textSize, setTextSize } = useTextSize();
  const { userName, userMatricula, autoSyncPDFData, setAutoSyncPDFData, clearAllData, themePreference, setThemePreference } = useUserProfile();
  const { colors } = useTheme();

  const [highContrast, setHighContrast] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [vibrateNotif, setVibrateNotif] = useState(true);

  // Helper function to render an icon
  const renderIcon = (name: SymbolName, color: string = colors.primary) => (
    <SymbolView
      name={name as any}
      tintColor={color}
      resizeMode="scaleAspectFit"
      size={22}
      weight="medium"
    />
  );

  // Helper function to render a setting row with a toggle
  const renderToggleRow = (title: string, subtitle: string | null, value: boolean, onValueChange: (v: boolean) => void, isLast = false, iconName: SymbolName) => (
    <View style={[styles.row, !isLast && { borderBottomWidth: 0.8, borderBottomColor: colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
        {renderIcon(iconName)}
      </View>
      <View style={styles.rowTextContainer}>
        <Text style={[styles.rowTitle, { fontSize: getFontSize(17), color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14), color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#ffffff"
      />
    </View>
  );

  // Helper function to render a setting row that acts as a button (with a forward arrow)
  const renderNavRow = (title: string, subtitle: string | null, isLast = false, iconName: SymbolName, onPress?: () => void) => (
    <ScalePressable style={[styles.row, !isLast && { borderBottomWidth: 0.8, borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
        {renderIcon(iconName)}
      </View>
      <View style={styles.rowTextContainer}>
        <Text style={[styles.rowTitle, { fontSize: getFontSize(17), color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14), color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any}
        tintColor={colors.inactiveText}
        size={20}
        weight="semibold"
      />
    </ScalePressable>
  );

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            router.navigate('/');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerSubtitle, { fontSize: getFontSize(15), color: colors.textSecondary }]}>Sua conta e preferências</Text>
          <Text style={[styles.headerTitle, { fontSize: getFontSize(28), color: colors.textPrimary }]}>Ajustes</Text>
        </View>

        {/* Profile Card */}
        <ScalePressable style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/edit-profile-modal')}>
          <View style={styles.profileRow}>
            <View style={[styles.iconContainer, { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.iconBackground }]}>
              <SymbolView
                name={{ ios: "person.fill", android: "person", web: "person" } as any}
                tintColor={colors.primary}
                size={32}
              />
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={[styles.profileName, { fontSize: getFontSize(20), color: colors.textPrimary }]}>{userName || "Usuário"}</Text>
              <Text style={[styles.profileMatricula, { fontSize: getFontSize(15), color: colors.textSecondary }]}>{userMatricula || "Não informada"}</Text>
            </View>
            <SymbolView
              name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any}
              tintColor={colors.inactiveText}
              size={20}
              weight="semibold"
            />
          </View>
        </ScalePressable>

        {/* Acessibilidade e Tema */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>ACESSIBILIDADE E TEMA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Tema Inline */}
            <View style={[styles.row, { borderBottomWidth: 0.8, borderBottomColor: colors.border, flexDirection: "column", alignItems: "flex-start", paddingVertical: 16 }]}>
              <Text style={[styles.rowTitle, { fontSize: getFontSize(17), marginBottom: 4, color: colors.textPrimary }]}>Tema</Text>
              <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14), marginBottom: 16, color: colors.textSecondary }]}>Escolha o modo de exibição do app</Text>
              <View style={styles.textSizeButtonsContainer}>
                <ScalePressable
                  style={[styles.textSizeButton, { backgroundColor: colors.background, borderColor: colors.border }, themePreference === "light" && { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}
                  onPress={() => setThemePreference("light")}
                >
                  <Text style={[styles.textSizeButtonText, { color: colors.textSecondary }, themePreference === "light" && { color: colors.primary }, { fontSize: 14 }]}>Claro</Text>
                </ScalePressable>
                <ScalePressable
                  style={[styles.textSizeButton, { backgroundColor: colors.background, borderColor: colors.border }, themePreference === "dark" && { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}
                  onPress={() => setThemePreference("dark")}
                >
                  <Text style={[styles.textSizeButtonText, { color: colors.textSecondary }, themePreference === "dark" && { color: colors.primary }, { fontSize: 14 }]}>Escuro</Text>
                </ScalePressable>
                <ScalePressable
                  style={[styles.textSizeButton, { backgroundColor: colors.background, borderColor: colors.border }, themePreference === "automatic" && { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}
                  onPress={() => setThemePreference("automatic")}
                >
                  <Text style={[styles.textSizeButtonText, { color: colors.textSecondary }, themePreference === "automatic" && { color: colors.primary }, { fontSize: 14 }]}>Auto</Text>
                </ScalePressable>
              </View>
            </View>

            {/* Text Size Inline */}
            <View style={[styles.row, { borderBottomWidth: 0.8, borderBottomColor: colors.border, flexDirection: "column", alignItems: "flex-start", paddingVertical: 16 }]}>
              <Text style={[styles.rowTitle, { fontSize: getFontSize(17), marginBottom: 4, color: colors.textPrimary }]}>Tamanho do texto</Text>
              <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14), marginBottom: 16, color: colors.textSecondary }]}>Ajuste em todas as telas do app</Text>
              <View style={styles.textSizeButtonsContainer}>
                <ScalePressable
                  style={[styles.textSizeButton, { backgroundColor: colors.background, borderColor: colors.border }, textSize === "normal" && { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}
                  onPress={() => setTextSize("normal")}
                >
                  <Text style={[styles.textSizeButtonText, { color: colors.textSecondary }, textSize === "normal" && { color: colors.primary }, { fontSize: 14 }]}>Aa</Text>
                </ScalePressable>
                <ScalePressable
                  style={[styles.textSizeButton, { backgroundColor: colors.background, borderColor: colors.border }, textSize === "large" && { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}
                  onPress={() => setTextSize("large")}
                >
                  <Text style={[styles.textSizeButtonText, { color: colors.textSecondary }, textSize === "large" && { color: colors.primary }, { fontSize: 17 }]}>Aa</Text>
                </ScalePressable>
                <ScalePressable
                  style={[styles.textSizeButton, { backgroundColor: colors.background, borderColor: colors.border }, textSize === "larger" && { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}
                  onPress={() => setTextSize("larger")}
                >
                  <Text style={[styles.textSizeButtonText, { color: colors.textSecondary }, textSize === "larger" && { color: colors.primary }, { fontSize: 20 }]}>Aa</Text>
                </ScalePressable>
              </View>
            </View>

            {renderToggleRow("Alto contraste", "Aumenta a legibilidade das cores", highContrast, setHighContrast, true, { ios: "circle.lefthalf.filled", android: "contrast", web: "contrast" })}
          </View>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>NOTIFICAÇÕES</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderToggleRow("Notificações push", "Avisos sobre aulas e mensagens", pushNotif, setPushNotif, false, { ios: "bell.fill", android: "notifications", web: "notifications" })}
            {renderToggleRow("Notificações por e-mail", "Resumo diário das atualizações", emailNotif, setEmailNotif, false, { ios: "envelope.fill", android: "email", web: "email" })}
            {renderToggleRow("Vibrar ao receber", null, vibrateNotif, setVibrateNotif, true, { ios: "iphone.radiowaves.left.and.right", android: "vibration", web: "vibration" })}
          </View>
        </View>

        {/* Extração de Dados */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>EXTRAÇÃO DE DADOS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderToggleRow(
              "Extração automática",
              "Extrair dados toda vez que fizer upload do PDF",
              autoSyncPDFData,
              (v) => setAutoSyncPDFData(v),
              true,
              { ios: "doc.text.fill", android: "description", web: "description" }
            )}
          </View>
        </View>

        {/* Conta e segurança */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>CONTA E SEGURANÇA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderNavRow("Senha e privacidade", "Altere sua senha de acesso", false, { ios: "lock.fill", android: "lock", web: "lock" }, () => router.push('../senha-e-privacidade' as any))}
            {renderNavRow("Idioma", "Português (Brasil)", true, { ios: "globe", android: "language", web: "language" }, () => router.push('/em-breve-modal'))}
          </View>
        </View>

        {/* Suporte */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14), color: colors.textSecondary }]}>SUPORTE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderNavRow("Central de ajuda", "Tire suas dúvidas", false, { ios: "questionmark.circle.fill", android: "help", web: "help" }, () => router.push('/tutoriais-modal'))}
            {renderNavRow("Sobre o UnB App", "Versão 1.0.0", true, { ios: "info.circle.fill", android: "info", web: "info" }, () => router.push('/sobre-modal'))}
          </View>
        </View>

        {/* Sair Button */}
        <ScalePressable style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
          <SymbolView
            name={{ ios: "rectangle.portrait.and.arrow.right", android: "logout", web: "logout" } as any}
            tintColor={colors.danger}
            size={20}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.logoutButtonText, { fontSize: getFontSize(17), color: colors.danger }]}>Sair da conta</Text>
        </ScalePressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    marginBottom: 8,
  },
  headerSubtitle: {
    fontWeight: "400",
    marginBottom: 4,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  card: {
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 0.8,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    flexDirection: "column",
    overflow: "hidden",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  profileName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  profileMatricula: {
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontWeight: "600",
    letterSpacing: 0.35,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 76,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  rowTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: "center",
  },
  rowTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  rowSubtitle: {
  },
  textSizeButtonsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
    marginTop: 8,
  },
  textSizeButton: {
    width: 80,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: 1.6,
    justifyContent: "center",
    alignItems: "center",
  },
  textSizeButtonText: {
    fontWeight: "bold",
  },
  logoutButton: {
    borderWidth: 1.6,
    borderColor: "#fca5a5",
    borderRadius: 16,
    borderCurve: "continuous",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  logoutButtonText: {
    fontWeight: "600",
  },
});
