import React, { useCallback, useState } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ScalePressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  scaleTo?: number;
}

export default function ScalePressable({ 
  style, 
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  ...props 
}: ScalePressableProps) {
  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback((e: any) => {
    setIsPressed(true);
    scale.value = withTiming(scaleTo, { duration: 160, easing: Easing.bezier(0.23, 1, 0.32, 1) });
    if (typeof onPressIn === 'function') {
      onPressIn(e);
    }
  }, [onPressIn, scale, scaleTo]);

  const handlePressOut = useCallback((e: any) => {
    setIsPressed(false);
    scale.value = withTiming(1, { duration: 100, easing: Easing.bezier(0.23, 1, 0.32, 1) });
    if (typeof onPressOut === 'function') {
      onPressOut(e);
    }
  }, [onPressOut, scale]);

  const passedStyle = typeof style === 'function' ? style({ pressed: isPressed }) : style;

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[passedStyle, animatedStyle]}
    />
  );
}
