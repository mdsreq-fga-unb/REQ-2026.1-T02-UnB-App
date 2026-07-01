import React from 'react';
import { View, Text, StyleSheet , Platform} from 'react-native';
import ScalePressable from "@/components/ScalePressable";
import { useTextSize } from "@/contexts/TextSizeContext";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function EmBreveModalScreen() {
  const router = useRouter();
  const { getFontSize } = useTextSize();

  return (
    <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
      <View style={styles.header}>
          <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
              <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor="#0f172b" fallback={<Text style={{fontSize: 20}}>X</Text>} />
          </ScalePressable>
          <Text style={[styles.title, { fontSize: getFontSize(20) }]}>Meu Acesso</Text>
          <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <SymbolView name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" } as any} size={48} tintColor="#1d8d28" fallback={<Text style={{ fontSize: 40 }}>✨</Text>} />
        <Text style={[styles.message, { fontSize: getFontSize(24) }]}>Em breve! :)</Text>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  message: {
    fontWeight: 'bold',
    color: '#0f172b',
    textAlign: 'center',
  }
});
