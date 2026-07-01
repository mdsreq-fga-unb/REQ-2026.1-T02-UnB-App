import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserProfile } from '../contexts/UserProfileContext';

export default function WelcomeModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const { updateUserProfile, setAutoSyncPDFData, autoSyncPDFData } = useUserProfile();

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [syncData, setSyncData] = useState(autoSyncPDFData);

  const handleSave = async () => {
    if (nome.trim() && matricula.trim()) {
      await updateUserProfile(nome.trim(), matricula.trim());
    }
    await setAutoSyncPDFData(syncData);
    router.back();
  };

  const handleSkip = async () => {
    await setAutoSyncPDFData(syncData);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <SymbolView name={{ ios: "person.crop.circle.badge.plus", android: "person_add", web: "person_add" } as any} size={64} tintColor="#1d8d28" />
            <Text style={[styles.title, { fontSize: getFontSize(24) }]}>Bem-vindo ao UnB App!</Text>
            <Text style={[styles.subtitle, { fontSize: getFontSize(15) }]}>
              Para personalizar sua experiência, adicione seu nome e matrícula. Você também pode fazer isso depois em Ajustes.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getFontSize(15) }]}>Nome Completo</Text>
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16) }]}
                placeholder="Ex: Rivadalvio Joaquim"
                placeholderTextColor="#94a3b8"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getFontSize(15) }]}>Matrícula</Text>
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16) }]}
                placeholder="Ex: 23/0012345"
                placeholderTextColor="#94a3b8"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={styles.toggleGroup}>
              <View style={styles.toggleTextContainer}>
                <Text style={[styles.toggleTitle, { fontSize: getFontSize(16) }]}>Sincronizar com Histórico</Text>
                <Text style={[styles.toggleDesc, { fontSize: getFontSize(13) }]}>Atualizar automaticamente meus dados ao importar grade por PDF.</Text>
              </View>
              <Switch
                value={syncData}
                onValueChange={setSyncData}
                trackColor={{ false: '#cbd5e1', true: '#1d8d28' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <ScalePressable style={styles.primaryButton} onPress={handleSave}>
              <Text style={[styles.primaryButtonText, { fontSize: getFontSize(16) }]}>
                Salvar e Continuar
              </Text>
            </ScalePressable>
            <ScalePressable style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize(16) }]}>
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
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
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
    color: '#0f172b',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
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
    color: '#0f172b',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    color: '#0f172b',
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  toggleTextContainer: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontWeight: '600',
    color: '#0f172b',
  },
  toggleDesc: {
    color: '#64748b',
  },
  footer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1d8d28',
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
    color: '#64748b',
    fontWeight: '600',
  },
});
