import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing, FadeInDown, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import ScalePressable from '@/components/ScalePressable';
import { useTextSize } from '@/contexts/TextSizeContext';

const TUTORIAL_PAGES = [
  {
    title: 'Conheça o SIGAA',
    description: 'O SIGAA é o sistema principal da UnB. Você usará para realizar matrículas em disciplinas, acompanhar seu histórico, ver suas notas (menções) finais e emitir declarações oficiais.',
    icon: { ios: 'graduationcap.fill', android: 'school', web: 'school' },
    color: '#1d8d28'
  },
  {
    title: 'Aprender 3 (Moodle)',
    description: 'O Aprender 3 é o ambiente virtual de aprendizagem. É aqui que os professores disponibilizam os materiais das aulas, slides, fóruns e onde você envia seus trabalhos e listas de exercícios.',
    icon: { ios: 'laptopcomputer.and.ipad', android: 'computer', web: 'computer' },
    color: '#2563eb'
  },
  {
    title: 'Tudo pronto!',
    description: 'Sempre que tiver dúvidas, você pode rever este tutorial na seção de Ajustes. Agora você já sabe para que serve cada plataforma oficial da UnB.',
    icon: { ios: 'checkmark.seal.fill', android: 'check_circle', web: 'check_circle' },
    color: '#1d8d28'
  }
];

function PaginationDot({ isActive }: { isActive: boolean }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? 24 : 8, { duration: 250, easing: Easing.bezier(0.77, 0, 0.175, 1) }),
      backgroundColor: withTiming(isActive ? '#1d8d28' : '#cbd5e1', { duration: 250, easing: Easing.linear }),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function TutoriaisModalScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const goToNextPage = () => {
    if (currentIndex < TUTORIAL_PAGES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      router.dismissAll();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(17) }]}>Guia das Plataformas</Text>
        <ScalePressable onPress={() => router.dismissAll()} style={styles.closeButton}>
          <Text style={[styles.closeText, { fontSize: getFontSize(16) }]}>Fechar</Text>
        </ScalePressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {TUTORIAL_PAGES.map((page, index) => (
          <View key={index} style={[styles.pageContainer, { width }]}>
            <Animated.View entering={FadeInDown.delay(100).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.iconContainer, { backgroundColor: `${page.color}15` }]}>
              <SymbolView name={page.icon as any} size={80} tintColor={page.color} />
            </Animated.View>
            <Animated.Text entering={FadeInDown.delay(150).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.pageTitle, { fontSize: getFontSize(24), color: page.color }]}>
              {page.title}
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(200).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.pageDescription, { fontSize: getFontSize(16) }]}>
              {page.description}
            </Animated.Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {TUTORIAL_PAGES.map((_, index) => (
            <PaginationDot key={index} isActive={currentIndex === index} />
          ))}
        </View>

        <ScalePressable style={styles.primaryButton} onPress={goToNextPage}>
          <Text style={[styles.primaryButtonText, { fontSize: getFontSize(16) }]}>
            {currentIndex === TUTORIAL_PAGES.length - 1 ? 'Concluir' : 'Próximo'}
          </Text>
        </ScalePressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontWeight: '600',
    color: '#0f172b',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  closeText: {
    color: '#64748b',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageDescription: {
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#1d8d28',
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
});
