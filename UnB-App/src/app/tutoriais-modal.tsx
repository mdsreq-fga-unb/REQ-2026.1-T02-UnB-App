import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions , Platform, Image} from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing, FadeInDown, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import ScalePressable from '@/components/ScalePressable';
import { useTextSize } from '@/contexts/TextSizeContext';
import { useTheme } from '@/contexts/ThemeContext';

const TUTORIAL_PAGES = [
  {
    title: 'Acesso ao SIGAA',
    description: 'O SIGAA é o sistema principal da UnB. Ao abrir o site pela primeira vez, esta é a tela que você verá.',
    image: require('../../assets/images/sigaa.jpg'),
    color: '#1d8d28'
  },
  {
    title: 'Onde clicar?',
    description: 'No celular, você precisará dar um pequeno zoom. Localize a barra amarela na parte superior esquerda. O primeiro botão é o menu "Ensino".',
    image: require('../../assets/images/lupa.jpg'),
    color: '#d97706'
  },
  {
    title: 'Emitir Documentos',
    description: 'Ao clicar em "Ensino", um menu se abrirá com as opções para emitir sua Carteirinha Estudantil, Histórico Escolar e Declaração de Passe Livre.',
    image: require('../../assets/images/opcoes.jpg'),
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

function PaginationDot({ isActive, color }: { isActive: boolean, color: string }) {
  const { colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? 24 : 8, { duration: 250, easing: Easing.bezier(0.77, 0, 0.175, 1) }),
      backgroundColor: withTiming(isActive ? color : colors.border, { duration: 250, easing: Easing.linear }),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function TutoriaisModalScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const [layoutWidth, setLayoutWidth] = useState(windowWidth);
  const router = useRouter();
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / layoutWidth);
    setCurrentIndex(index);
  };

  const goToNextPage = () => {
    if (currentIndex < TUTORIAL_PAGES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * layoutWidth, animated: true });
    } else {
      router.dismissAll();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']} onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScalePressable onPress={() => router.dismissAll()} style={styles.closeBtn}>
          <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor={colors.textPrimary} fallback={<Text style={{fontSize: 20}}>X</Text>} />
        </ScalePressable>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(17), color: colors.textPrimary }]}>Guia das Plataformas</Text>
        <View style={{ width: 24 }} />
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
          <View key={index} style={[styles.pageContainer, { width: layoutWidth }]}>
            {page.image ? (
              <Animated.View entering={FadeInDown.delay(100).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.imageContainer, { backgroundColor: `${page.color}15` }]}>
                <Image source={page.image} style={styles.tutorialImage} resizeMode="contain" />
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown.delay(100).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.iconContainer, { backgroundColor: `${page.color}15` }]}>
                <SymbolView name={page.icon as any} size={80} tintColor={page.color} />
              </Animated.View>
            )}
            <Animated.Text entering={FadeInDown.delay(150).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.pageTitle, { fontSize: getFontSize(24), color: page.color }]}>
              {page.title}
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(200).duration(400).easing(Easing.bezier(0.23, 1, 0.32, 1))} style={[styles.pageDescription, { fontSize: getFontSize(16), color: colors.textSecondary }]}>
              {page.description}
            </Animated.Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {TUTORIAL_PAGES.map((_, index) => (
            <PaginationDot key={index} isActive={currentIndex === index} color={colors.primary} />
          ))}
        </View>

        <ScalePressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={goToNextPage}>
          <Text style={[styles.primaryButtonText, { fontSize: getFontSize(16) }]}>
            {currentIndex === TUTORIAL_PAGES.length - 1 ? 'Concluir' : 'Próximo'}
          </Text>
        </ScalePressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
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
  imageContainer: {
    width: 220,
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    padding: 16,
  },
  tutorialImage: {
    width: '100%',
    height: '100%',
  },
  pageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageDescription: {
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
  },
  activeDot: {
    width: 24,
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
});
