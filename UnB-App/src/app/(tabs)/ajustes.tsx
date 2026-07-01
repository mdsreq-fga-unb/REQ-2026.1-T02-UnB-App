import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTextSize } from "@/contexts/TextSizeContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ScalePressable from "@/components/ScalePressable";
import { SymbolView } from "expo-symbols";

type SymbolName = { ios: string; android: string; web?: string };

export default function AjustesScreen() {
  const router = useRouter();
  const { getFontSize, textSize, setTextSize } = useTextSize();
  const { userName, userMatricula, autoSyncPDFData, setAutoSyncPDFData } = useUserProfile();

  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [vibrateNotif, setVibrateNotif] = useState(true);

  // Helper function to render an icon
  const renderIcon = (name: SymbolName, color: string = "#1d8d28") => (
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
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.iconContainer}>
        {renderIcon(iconName)}
      </View>
      <View style={styles.rowTextContainer}>
        <Text style={[styles.rowTitle, { fontSize: getFontSize(17) }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14) }]}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#cbd5e1", true: "#1d8d28" }}
        thumbColor="#ffffff"
      />
    </View>
  );

  // Helper function to render a setting row that acts as a button (with a forward arrow)
  const renderNavRow = (title: string, subtitle: string | null, isLast = false, iconName: SymbolName, onPress?: () => void) => (
    <ScalePressable style={[styles.row, !isLast && styles.rowBorder]} onPress={onPress}>
      <View style={styles.iconContainer}>
        {renderIcon(iconName)}
      </View>
      <View style={styles.rowTextContainer}>
        <Text style={[styles.rowTitle, { fontSize: getFontSize(17) }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14) }]}>{subtitle}</Text>}
      </View>
      <SymbolView 
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any} 
        tintColor="#cbd5e1" 
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
          onPress: () => router.push('/welcome-modal') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerSubtitle, { fontSize: getFontSize(15) }]}>Sua conta e preferências</Text>
          <Text style={[styles.headerTitle, { fontSize: getFontSize(28) }]}>Ajustes</Text>
        </View>

        {/* Profile Card */}
        <ScalePressable style={styles.card} onPress={() => router.push('/edit-profile-modal')}>
          <View style={styles.profileRow}>
            <View style={[styles.iconContainer, { width: 64, height: 64, borderRadius: 32 }]}>
              <SymbolView 
                name={{ ios: "person.fill", android: "person", web: "person" } as any} 
                tintColor="#1d8d28" 
                size={32} 
              />
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={[styles.profileName, { fontSize: getFontSize(20) }]}>{userName || "Usuário"}</Text>
              <Text style={[styles.profileMatricula, { fontSize: getFontSize(15) }]}>{userMatricula || "Não informada"}</Text>
            </View>
            <SymbolView 
              name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" } as any} 
              tintColor="#cbd5e1" 
              size={20} 
              weight="semibold" 
            />
          </View>
        </ScalePressable>

        {/* Acessibilidade */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14) }]}>ACESSIBILIDADE</Text>
          <View style={styles.card}>
            {/* Text Size Inline */}
            <View style={[styles.row, styles.rowBorder, { flexDirection: "column", alignItems: "flex-start", paddingVertical: 16 }]}>
              <Text style={[styles.rowTitle, { fontSize: getFontSize(17), marginBottom: 4 }]}>Tamanho do texto</Text>
              <Text style={[styles.rowSubtitle, { fontSize: getFontSize(14), marginBottom: 16 }]}>Ajuste em todas as telas do app</Text>
              <View style={styles.textSizeButtonsContainer}>
                <ScalePressable 
                  style={[styles.textSizeButton, textSize === "normal" && styles.textSizeButtonActive]}
                  onPress={() => setTextSize("normal")}
                >
                  <Text style={[styles.textSizeButtonText, textSize === "normal" && styles.textSizeButtonTextActive, { fontSize: 14 }]}>Aa</Text>
                </ScalePressable>
                <ScalePressable 
                  style={[styles.textSizeButton, textSize === "large" && styles.textSizeButtonActive]}
                  onPress={() => setTextSize("large")}
                >
                  <Text style={[styles.textSizeButtonText, textSize === "large" && styles.textSizeButtonTextActive, { fontSize: 17 }]}>Aa</Text>
                </ScalePressable>
                <ScalePressable 
                  style={[styles.textSizeButton, textSize === "larger" && styles.textSizeButtonActive]}
                  onPress={() => setTextSize("larger")}
                >
                  <Text style={[styles.textSizeButtonText, textSize === "larger" && styles.textSizeButtonTextActive, { fontSize: 20 }]}>Aa</Text>
                </ScalePressable>
              </View>
            </View>

            {renderToggleRow("Alto contraste", "Aumenta a legibilidade das cores", highContrast, setHighContrast, false, { ios: "circle.lefthalf.filled", android: "contrast", web: "contrast" })}
            {renderToggleRow("Modo escuro", "Reduz o brilho da tela", darkMode, setDarkMode, true, { ios: "moon.fill", android: "dark_mode", web: "dark_mode" })}
          </View>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14) }]}>NOTIFICAÇÕES</Text>
          <View style={styles.card}>
            {renderToggleRow("Notificações push", "Avisos sobre aulas e mensagens", pushNotif, setPushNotif, false, { ios: "bell.fill", android: "notifications", web: "notifications" })}
            {renderToggleRow("Notificações por e-mail", "Resumo diário das atualizações", emailNotif, setEmailNotif, false, { ios: "envelope.fill", android: "email", web: "email" })}
            {renderToggleRow("Vibrar ao receber", null, vibrateNotif, setVibrateNotif, true, { ios: "iphone.radiowaves.left.and.right", android: "vibration", web: "vibration" })}
          </View>
        </View>

        {/* Extração de Dados */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14) }]}>EXTRAÇÃO DE DADOS</Text>
          <View style={styles.card}>
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
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14) }]}>CONTA E SEGURANÇA</Text>
          <View style={styles.card}>
            {renderNavRow("Senha e privacidade", "Altere sua senha de acesso", false, { ios: "lock.fill", android: "lock", web: "lock" }, () => router.push('/em-breve-modal'))}
            {renderNavRow("Idioma", "Português (Brasil)", true, { ios: "globe", android: "language", web: "language" }, () => router.push('/em-breve-modal'))}
          </View>
        </View>

        {/* Suporte */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: getFontSize(14) }]}>SUPORTE</Text>
          <View style={styles.card}>
            {renderNavRow("Central de ajuda", "Tire suas dúvidas", false, { ios: "questionmark.circle.fill", android: "help", web: "help" }, () => router.push('/em-breve-modal'))}
            {renderNavRow("Sobre o UnB App", "Versão 1.0.0", true, { ios: "info.circle.fill", android: "info", web: "info" }, () => router.push('/em-breve-modal'))}
          </View>
        </View>

        {/* Sair Button */}
        <ScalePressable style={styles.logoutButton} onPress={handleLogout}>
          <SymbolView 
            name={{ ios: "rectangle.portrait.and.arrow.right", android: "logout", web: "logout" } as any} 
            tintColor="#b91c1c" 
            size={20} 
            style={{ marginRight: 8 }} 
          />
          <Text style={[styles.logoutButtonText, { fontSize: getFontSize(17) }]}>Sair da conta</Text>
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
    color: "#62748e",
    fontWeight: "400",
    marginBottom: 4,
  },
  headerTitle: {
    color: "#0f172b",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
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
    color: "#0f172b",
    fontWeight: "600",
    marginBottom: 4,
  },
  profileMatricula: {
    color: "#45556c",
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: "#62748e",
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
  rowBorder: {
    borderBottomWidth: 0.8,
    borderBottomColor: "#f1f5f9",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e8f5ea",
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
    color: "#0f172b",
    fontWeight: "600",
    marginBottom: 2,
  },
  rowSubtitle: {
    color: "#45556c",
  },
  textSizeButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  textSizeButton: {
    width: 80,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.6,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  textSizeButtonActive: {
    borderColor: "#1d8d28",
    backgroundColor: "#e8f5ea",
  },
  textSizeButtonText: {
    color: "#475569",
    fontWeight: "bold",
  },
  textSizeButtonTextActive: {
    color: "#1d8d28",
  },
  logoutButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1.6,
    borderColor: "#fca5a5",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  logoutButtonText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
});
