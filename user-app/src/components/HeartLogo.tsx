import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Simple text-based heart for splash + welcome screens.
 * Will be replaced with the real SVG/PNG logo from `assets/` before submission.
 */
export function HeartLogo({ size = 64 }: { size?: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          backgroundColor: theme.primary,
          borderRadius: size / 4,
        },
      ]}
    >
      <Text style={[styles.heart, { fontSize: size * 0.55 }]}>♥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    color: '#0D0D0D',
    fontWeight: '700',
  },
});
