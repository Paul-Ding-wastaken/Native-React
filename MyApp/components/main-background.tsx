import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

type MainBackgroundProps = {
  /** Colors for the main background */
  backgroundColors?: string[];
  /** Colors for the circle gradient */
  circleColors?: string[];
  /** Circle base size */
  circleSize?: number;

  isExtended?: boolean;
};

export default function MainBackground({
  backgroundColors = ['#770c0cff', '#000'],
  circleColors = ['rgba(243, 8, 8, 0)', 'rgba(0,0,0,1)'],
  circleSize = 200,
  isExtended = false,
}: MainBackgroundProps) {
  const [prevColors, setPrevColors] = useState(circleColors);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // When circleColors change → fade + pulse
    opacity.value = 0;
    scale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
    );

    // Swap colors after fade-out
      setPrevColors(circleColors);
      opacity.value = withTiming(1, { duration: 500, easing: Easing.linear });

  }, [circleColors]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
    <View style={styles.containerMainBackground}>
      {/* Main background */}
      <LinearGradient
        colors={backgroundColors as [string, string]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
    <View style={[styles.containerButton, {height: isExtended? '50%' : '100%'}]}>
      <Animated.View style={[{}, fadeStyle]}>
        <LinearGradient
          colors={prevColors as [string, string]}
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
          }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
    
    </>
  );
}

const styles = StyleSheet.create({
  containerMainBackground: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -10
  },
  containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '50%',
    zIndex: -10
  }
});
