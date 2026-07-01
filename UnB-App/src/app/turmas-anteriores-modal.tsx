import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function TurmasAnterioresModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor={colors.textPrimary} fallback={<Text style={{fontSize: 20}}>X</Text>} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20), color: colors.textPrimary }]}>Turmas Anteriores</Text>
          <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <SymbolView name={{ ios: "clock.arrow.circlepath", android: "history", web: "history" } as any} size={48} tintColor={colors.primary} fallback={<Text style={{ fontSize: 40 }}>⏳</Text>} />
        <Text style={[styles.message, { fontSize: getFontSize(22), color: colors.textPrimary }]}>Histórico em breve</Text>
        <Text style={[styles.submessage, { fontSize: getFontSize(16), color: colors.textSecondary }]}>Em atualizações futuras você poderá ver aqui todas as disciplinas que já cursou.</Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  message: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submessage: {
    textAlign: 'center',
    lineHeight: 22,
  }
});
