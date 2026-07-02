import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function WelcomeModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();
  const { updateUserProfile, setAutoSyncPDFData, autoSyncPDFData } = useUserProfile();

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [syncData, setSyncData] = useState(autoSyncPDFData);

  const handleSave = async () => {
    if (nome.trim() && matricula.trim()) {
      await updateUserProfile(nome.trim(), matricula.trim());
    }
    await setAutoSyncPDFData(syncData);
    router.replace('../tutoriais-modal');
  };

  const handleSkip = async () => {
    await setAutoSyncPDFData(syncData);
    router.replace('../tutoriais-modal');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <SymbolView name={{ ios: "person.crop.circle.badge.plus", android: "person_add", web: "person_add" } as any} size={64} tintColor={colors.primary} />
            <Text style={[styles.title, { fontSize: getFontSize(24), color: colors.textPrimary }]}>Bem-vindo ao UnB App!</Text>
            <Text style={[styles.subtitle, { fontSize: getFontSize(15), color: colors.textSecondary }]}>
              Para personalizar sua experiência, adicione seu nome e matrícula. Você também pode fazer isso depois em Ajustes.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getFontSize(15), color: colors.textPrimary }]}>Nome Completo</Text>
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Ex: José da Silva"
                placeholderTextColor={colors.textPlaceholder}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getFontSize(15), color: colors.textPrimary }]}>Matrícula</Text>
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Ex: 231012345"
                placeholderTextColor={colors.textPlaceholder}
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={[styles.toggleGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.toggleTextContainer}>
                <Text style={[styles.toggleTitle, { fontSize: getFontSize(16), color: colors.textPrimary }]}>Sincronizar com Histórico</Text>
                <Text style={[styles.toggleDesc, { fontSize: getFontSize(13), color: colors.textSecondary }]}>Atualizar automaticamente meus dados ao importar grade por PDF.</Text>
              </View>
              <Switch
                value={syncData}
                onValueChange={setSyncData}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <ScalePressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
              <Text style={[styles.primaryButtonText, { fontSize: getFontSize(16) }]}>
                Salvar e Continuar
              </Text>
            </ScalePressable>
            <ScalePressable style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize(16), color: colors.textSecondary }]}>
                Pular por enquanto
              </Text>
            </ScalePressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  toggleTextContainer: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontWeight: '600',
  },
  toggleDesc: {
  },
  footer: {
    gap: 12,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});
