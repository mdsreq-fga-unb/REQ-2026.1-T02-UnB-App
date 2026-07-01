import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import ScalePressable from '@/components/ScalePressable';
import { useTextSize } from '@/contexts/TextSizeContext';
import { useRouter } from 'expo-router';
import { useUserProfile } from '../contexts/UserProfileContext';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SenhaEPrivacidadeScreen() {
  const insets = useSafeAreaInsets();
  const { getFontSize } = useTextSize();
  const router = useRouter();
  const { appLockEnabled, setAppLockEnabled } = useUserProfile();

  const handleToggle = async (newValue: boolean) => {
    if (newValue) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometria indisponível',
          'Seu dispositivo não suporta biometria ou você não tem nenhuma cadastrada.'
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua biometria para ativar',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await setAppLockEnabled(true);
      }
    } else {
      await setAppLockEnabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(13) }]}>BLOQUEIO DE APLICATIVO</Text>
        </View>

        <View style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <SymbolView name={{ ios: 'faceid', android: 'fingerprint', web: 'fingerprint' } as any} size={24} tintColor="#64748b" />
              <View style={styles.menuItemTexts}>
                <Text style={[styles.menuItemTitle, { fontSize: getFontSize(16) }]}>Desbloqueio com Biometria</Text>
                <Text style={[styles.menuItemDesc, { fontSize: getFontSize(13) }]}>Exigir biometria ou senha do dispositivo para acessar o aplicativo.</Text>
              </View>
            </View>
            <Switch
              value={appLockEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#cbd5e1', true: '#1d8d28' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
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
});
