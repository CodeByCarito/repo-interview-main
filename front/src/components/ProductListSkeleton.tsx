import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ITEM_COUNT = 6;
const isTestEnv = typeof global !== 'undefined' && (global as any).__TEST__ === true;

function SkeletonLine({ width, style }: { width: string; style?: object }): React.JSX.Element {
  const opacity = React.useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    if (isTestEnv) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  if (isTestEnv) {
    return <View style={[styles.skeletonLine, { width }, style]} />;
  }
  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        { width, opacity },
        style,
      ]}
    />
  );
}

function SkeletonCard(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <SkeletonLine width="60%" />
      <SkeletonLine width="40%" style={styles.secondLine} />
    </View>
  );
}

export function ProductListSkeleton(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.searchPlaceholder} />
      {Array.from({ length: ITEM_COUNT }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchPlaceholder: {
    height: 44,
    borderRadius: 4,
    backgroundColor: '#e8e8e8',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  secondLine: {
    marginTop: 8,
  },
});
