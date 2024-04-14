import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { theme } from '~/constants/theme';
import { hp, wp } from '~/helpers/common';

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image style={styles.bgImage} source={require('../assets/welcome.png')} />
      <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'white', 'white']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0.8 }}
        />
        <View style={styles.contentContainer}>
          <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>
            Pixels
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}>
            Every Pixel Tells a Story
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable onPress={() => router.push('/home/')} style={styles.startButton}>
              <Text style={styles.startText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: 'absolute',
    elevation: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    fontWeight: '700',
    color: theme.colors.neutral(0.9),
  },
  punchline: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '500',
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(2.5),
    fontWeight: '500',
    letterSpacing: 1,
  },
});
