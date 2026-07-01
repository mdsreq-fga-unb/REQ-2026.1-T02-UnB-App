import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import ScalePressable from '@/components/ScalePressable';
import { useTextSize } from '@/contexts/TextSizeContext';
import { useRouter } from 'expo-router';
import { useUserProfile } from '../contexts/UserProfileContext';

export default function AjustesScreen() {
  const insets = useSafeAreaInsets();
  const { getFontSize } = useTextSize();
  const router = useRouter();
  const { userName, userMatricula, autoSyncPDFData, updateUserProfile, setAutoSyncPDFData } = useUserProfile();

  const [nome, setNome] = useState(userName || '');
  const [matricula, setMatricula] = useState(userMatricula || '');
  const [syncData, setSyncData] = useState(autoSyncPDFData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNome(userName || '');
    setMatricula(userMatricula || '');
    setSyncData(autoSyncPDFData);
  }, [userName, userMatricula, autoSyncPDFData]);

  const handleSave = async () => {
    setIsSaving(true);
    if (nome.trim() && matricula.trim()) {
      await updateUserProfile(nome.trim(), matricula.trim());
    }
    await setAutoSyncPDFData(syncData);
    setIsSaving(false);
  };

  const showEmBreve = () => {
    router.push('../em-breve-modal');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <ScalePressable style={styles.backButton} onPress={() => router.back()}>
          <SymbolView name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' } as any} size={24} tintColor="#1d8d28" />
          <Text style={[styles.backText, { fontSize: getFontSize(17) }]}>Voltar</Text>
        </ScalePressable>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(17) }]}>Ajustes</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { fontSize: getFontSize(32) }]}>{getInitials(userName || '')}</Text>
          </View>
          <Text style={[styles.profileName, { fontSize: getFontSize(22) }]}>{userName || 'Nome não definido'}</Text>
          <Text style={[styles.profileMeta, { fontSize: getFontSize(15) }]}>{userMatricula ? `Matrícula: ${userMatricula}` : 'Matrícula não definida'}</Text>
          <ScalePressable style={styles.photoButton} onPress={showEmBreve}>
            <Text style={[styles.photoButtonText, { fontSize: getFontSize(15) }]}>Mudar foto</Text>
          </ScalePressable>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: getFontSize(15) }]}>Nome preferencial</Text>
            <TextInput
              style={[styles.input, { fontSize: getFontSize(16) }]}
              placeholder="Ex: Rivadalvio Joaquim"
              placeholderTextColor="#94a3b8"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.separator} />

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

          <View style={styles.cardFooter}>
            <ScalePressable style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
              <Text style={[styles.saveButtonText, { fontSize: getFontSize(16) }]}>{isSaving ? 'Salvando...' : 'Atualizar perfil'}</Text>
            </ScalePressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(13) }]}>CONFIGURAÇÕES</Text>
        </View>

        <View style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <SymbolView name={{ ios: 'doc.text.viewfinder', android: 'document_scanner', web: 'document_scanner' } as any} size={24} tintColor="#64748b" />
              <View style={styles.menuItemTexts}>
                <Text style={[styles.menuItemTitle, { fontSize: getFontSize(16) }]}>Atualizar dados via Histórico Escolar</Text>
                <Text style={[styles.menuItemDesc, { fontSize: getFontSize(13) }]}>Usa as informações do seu documento em PDF para preencher seu perfil.</Text>
              </View>
            </View>
            <Switch
              value={syncData}
              onValueChange={(val) => {
                setSyncData(val);
                setAutoSyncPDFData(val);
              }}
              trackColor={{ false: '#cbd5e1', true: '#1d8d28' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(13) }]}>PREFERÊNCIAS</Text>
        </View>

        <View style={styles.menuCard}>
          <MenuLink icon={{ ios: 'lock', android: 'lock', web: 'lock' }} title="Senha e privacidade" onPress={() => router.push('../senha-e-privacidade' as any)} getFontSize={getFontSize} />
          <View style={styles.separator} />
          <MenuLink icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }} title="Central de ajuda (Tutoriais)" onPress={() => router.push('../tutoriais-modal' as any)} getFontSize={getFontSize} />
          <View style={styles.separator} />
          <MenuLink icon={{ ios: 'doc.plaintext', android: 'description', web: 'description' }} title="Termos e condições" onPress={showEmBreve} getFontSize={getFontSize} />
          <View style={styles.separator} />
          <MenuLink icon={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }} title="Sobre o aplicativo" onPress={showEmBreve} getFontSize={getFontSize} />
        </View>

        <ScalePressable style={[styles.menuCard, styles.logoutCard]} onPress={showEmBreve}>
          <Text style={[styles.logoutText, { fontSize: getFontSize(16) }]}>Sair do aplicativo</Text>
        </ScalePressable>
      </ScrollView>
    </View>
  );
}

function MenuLink({ icon, title, onPress, getFontSize }: { icon: any, title: string, onPress: () => void, getFontSize: (s: number) => number }) {
  return (
    <ScalePressable style={styles.menuLink} onPress={onPress}>
      <SymbolView name={icon} size={24} tintColor="#64748b" />
      <Text style={[styles.menuLinkTitle, { fontSize: getFontSize(16) }]}>{title}</Text>
      <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' } as any} size={20} tintColor="#cbd5e1" />
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: 70,
  },
  backText: {
    color: '#1d8d28',
    marginLeft: 4,
  },
  headerTitle: {
    fontWeight: '600',
    color: '#0f172b',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  profileSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#1d8d28',
    fontWeight: 'bold',
  },
  profileName: {
    fontWeight: 'bold',
    color: '#0f172b',
  },
  profileMeta: {
    color: '#64748b',
  },
  photoButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  photoButtonText: {
    color: '#1d8d28',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  inputGroup: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontWeight: '500',
    color: '#64748b',
  },
  input: {
    color: '#0f172b',
    padding: 0,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginLeft: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  saveButton: {
    backgroundColor: '#1d8d28',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  menuItemTexts: {
    flex: 1,
    gap: 4,
  },
  menuItemTitle: {
    fontWeight: '500',
    color: '#0f172b',
  },
  menuItemDesc: {
    color: '#64748b',
  },
  menuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuLinkTitle: {
    flex: 1,
    color: '#0f172b',
    fontWeight: '500',
  },
  logoutCard: {
    marginTop: 8,
  },
  logoutText: {
    color: '#ef4444',
    padding: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
