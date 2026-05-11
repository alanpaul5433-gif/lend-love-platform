import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, radius, typography } from '../theme/ThemeProvider';

type Variant = 'success' | 'warning' | 'danger' | 'neutral';

export function Badge({ label, variant = 'neutral' }: { label: string; variant?: Variant }) {
  const { theme } = useTheme();

  const colors: Record<Variant, { bg: string; fg: string; border: string }> = {
    success: { bg: theme.successTint, fg: theme.primary, border: theme.primary },
    warning: { bg: theme.warningTint, fg: theme.secondary, border: theme.secondary },
    danger: { bg: theme.dangerTint, fg: theme.danger, border: theme.danger },
    neutral: { bg: theme.bgElevated, fg: theme.textSecondary, border: theme.border },
  };
  const c = colors[variant];

  return (
    <View style={[styles.box, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.label, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.label,
    fontWeight: '600',
  },
});
