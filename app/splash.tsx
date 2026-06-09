import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  
  // Animation shared values
  const opacityLogo = useSharedValue(0);
  const scaleLogo = useSharedValue(0.7);
  const opacityText = useSharedValue(0);
  const translateYText = useSharedValue(20);

  useEffect(() => {
    // Start animations
    opacityLogo.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });
    scaleLogo.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    
    opacityText.value = withDelay(400, withTiming(1, { duration: 800 }));
    translateYText.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) }));

    // Redirect to home screen after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityLogo.value,
      transform: [{ scale: scaleLogo.value }]
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityText.value,
      transform: [{ translateY: translateYText.value }]
    };
  });

  return (
    <View style={styles.container}>
      {/* Background neon glows */}
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Text style={styles.logoSymbol}>✦</Text>
        </Animated.View>

        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.title}>Gauth AI</Text>
          <Text style={styles.subtitle}>AI Homework & Study Companion</Text>
          
          <View style={styles.loadingTrack}>
            <View style={styles.loadingFill} />
          </View>
        </Animated.View>
      </View>

      <Text style={styles.footer}>8x Engineer Challenge Submission</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a0f',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  glowTop: {
    backgroundColor: '#8b5cf6',
    top: -50,
    left: -50,
  },
  glowBottom: {
    backgroundColor: '#3b82f6',
    bottom: -50,
    right: -50,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#16121e',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoSymbol: {
    fontSize: 50,
    color: '#a78bfa',
    fontWeight: 'bold'
  },
  textContainer: {
    marginTop: 24,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 6,
  },
  loadingTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    marginTop: 32,
    overflow: 'hidden'
  },
  loadingFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.25)',
    letterSpacing: 0.5,
  }
});
