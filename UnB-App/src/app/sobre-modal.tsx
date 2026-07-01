import React from 'react';
import { View, Text, StyleSheet, ScrollView , Platform} from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function SobreModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor={colors.textPrimary} fallback={<Text style={{fontSize: 20}}>X</Text>} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20), color: colors.textPrimary }]}>Sobre o UnB App</Text>
          <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.2)' : '#e8f5ea' }]}>
          <SymbolView name={{ ios: "info.circle.fill", android: "info", web: "info" } as any} size={48} tintColor={colors.primary} fallback={<Text style={{ fontSize: 40 }}>ℹ️</Text>} />
        </View>
        
        <Text style={[styles.heading, { fontSize: getFontSize(22), color: colors.textPrimary }]}>O que é o UnB App?</Text>
        
        <Text style={[styles.paragraph, { fontSize: getFontSize(16), color: colors.textSecondary }]}>
          O UnB App é um aplicativo desenvolvido no âmbito da disciplina de Requisitos de Software (Turma 02, Semestre 2026.1) da Universidade de Brasília (UnB). 
        </Text>
        
        <Text style={[styles.paragraph, { fontSize: getFontSize(16), color: colors.textSecondary }]}>
          Nosso objetivo principal é modernizar e facilitar a experiência acadêmica dos estudantes, consolidando o acompanhamento de disciplinas, o acesso a informações importantes e a gestão da grade horária em um ambiente unificado, moderno e acessível.
        </Text>

        <Text style={[styles.paragraph, { fontSize: getFontSize(16), color: colors.textSecondary }]}>
          Com o app, você pode importar seu histórico ou declaração de vínculo em PDF para extrair automaticamente suas matérias, visualizar sua grade de forma intuitiva, além de personalizar sua experiência com recursos de acessibilidade como tamanhos de fonte ajustáveis e modo noturno.
        </Text>

        <Text style={[styles.footerText, { fontSize: getFontSize(14), color: colors.inactiveText }]}>
          Versão 1.0.0
        </Text>
      </ScrollView>
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
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  footerText: {
    marginTop: 32,
    fontWeight: '600',
    textAlign: 'center',
  }
});
