import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import * as SplashScreenNative from 'expo-splash-screen';

const LOGO_IMG = require('../../assets/images/icon.png');

interface Props {
  onFinish?: () => void;
}

const Dot = ({ color, delay }: { color: string, delay: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-8, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      true
    ));
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View style={[{
      width: 8, height: 8, borderRadius: 4, backgroundColor: color
    }, animatedStyle]} />
  );
};

export default function CustomSplashScreen({ onFinish }: Props) {
  const [isHiding, setIsHiding] = useState(false);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Hide the native splash screen immediately so we can show our custom one
    SplashScreenNative.hideAsync().catch(() => {});

    // Ensure the splash screen stays visible for at least 2.5 seconds
    const timer = setTimeout(() => {
      setIsHiding(true);
      opacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onFinish) {
          runOnJS(onFinish)();
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents={isHiding ? 'none' : 'auto'}>
      <LinearGradient
        colors={['#E8F5EA', '#FFFFFF', '#E0F2E4']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Background glow effect */}
      <View style={styles.glow} />

      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Image 
          source={LOGO_IMG} 
          style={styles.logo} 
          contentFit="cover"
        />
      </View>

      {/* Text Container */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          UnB <Text style={styles.titleHighlight}>App</Text>
        </Text>
        <Text style={styles.subtitle}>
          A universidade no seu ritmo
        </Text>
      </View>

      {/* Loader */}
      <View style={styles.loaderContainer}>
        <Dot color="#5ee9b5" delay={0} />
        <Dot color="#00d492" delay={150} />
        <Dot color="#009966" delay={300} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#1d8d28',
    opacity: 0.18,
    top: '30%',
  },
  logoContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(29, 141, 40, 0.4)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 10,
    marginBottom: 40,
  },
  logo: {
    width: 159,
    height: 159,
    borderRadius: 24,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -0.85,
  },
  titleHighlight: {
    color: '#1d8d28',
  },
  subtitle: {
    fontSize: 16,
    color: '#45556c',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 8,
    opacity: 0.8,
  }
});
