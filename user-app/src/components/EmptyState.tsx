import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme/ThemeProvider';

interface Props {
  icon?: string;
  title: string;
  message?: string;
}

export function EmptyState({ icon = '▢', title, message }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.box}>
      <Text style={[styles.icon, { color: theme.textMuted }]}>{icon}</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 1.5,
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
  },
});
