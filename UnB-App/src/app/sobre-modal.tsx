import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SobreModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor="#0f172b" fallback={<Text style={{fontSize: 20}}>X</Text>} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20) }]}>Sobre o UnB App</Text>
          <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <SymbolView name={{ ios: "info.circle.fill", android: "info", web: "info" } as any} size={48} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 40 }}>ℹ️</Text>} />
        </View>
        
        <Text style={[styles.heading, { fontSize: getFontSize(22) }]}>O que é o UnB App?</Text>
        
        <Text style={[styles.paragraph, { fontSize: getFontSize(16) }]}>
          O UnB App é um aplicativo desenvolvido no âmbito da disciplina de Requisitos de Software (Turma 02, Semestre 2026.1) da Universidade de Brasília (UnB). 
        </Text>
        
        <Text style={[styles.paragraph, { fontSize: getFontSize(16) }]}>
          Nosso objetivo principal é modernizar e facilitar a experiência acadêmica dos estudantes, consolidando o acompanhamento de disciplinas, o acesso a informações importantes e a gestão da grade horária em um ambiente unificado, moderno e acessível.
        </Text>

        <Text style={[styles.paragraph, { fontSize: getFontSize(16) }]}>
          Com o app, você pode importar seu histórico ou declaração de vínculo em PDF para extrair automaticamente suas matérias, visualizar sua grade de forma intuitiva, além de personalizar sua experiência com recursos de acessibilidade como tamanhos de fonte ajustáveis e modo noturno.
        </Text>

        <Text style={[styles.footerText, { fontSize: getFontSize(14) }]}>
          Versão 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  closeBtn: {
    padding: 4,
  },
  title: { fontWeight: 'bold', color: '#0f172b' },
  content: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#e8f5ea',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontWeight: 'bold',
    color: '#0f172b',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    color: '#45556c',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  footerText: {
    marginTop: 32,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  }
});
