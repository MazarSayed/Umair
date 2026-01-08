import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ style }) => {
  const { theme, isDark } = useTheme();
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.skeleton, { backgroundColor: theme.surface }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const CourseCardSkeleton = () => {
  return (
    <View style={styles.cardSkeleton}>
      <SkeletonItem style={styles.posterSkeleton} />
      <View style={styles.contentSkeleton}>
        <SkeletonItem style={styles.titleSkeleton} />
        <SkeletonItem style={styles.textSkeleton} />
        <SkeletonItem style={styles.badgeSkeleton} />
      </View>
    </View>
  );
};

export const HeroSkeleton = () => (
  <SkeletonItem style={styles.heroSkeleton} />
);

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  cardSkeleton: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  posterSkeleton: {
    width: 70,
    height: 105,
    borderRadius: 20,
  },
  contentSkeleton: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  titleSkeleton: {
    height: 20,
    width: '80%',
    marginBottom: 8,
  },
  textSkeleton: {
    height: 14,
    width: '40%',
    marginBottom: 12,
  },
  badgeSkeleton: {
    height: 24,
    width: 60,
    borderRadius: 12,
  },
  heroSkeleton: {
    height: 200,
    width: '100%',
    borderRadius: 30,
    marginBottom: 24,
  }
});
