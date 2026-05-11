import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, spacing, radius, typography } from '../theme/ThemeProvider';

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  activeColor?: string;
}

export function TypeToggle({ options, value, onChange, activeColor }: Props) {
  const { theme } = useTheme();
  const active = activeColor ?? theme.secondary;
  return (
    <View style={styles.row}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={({ pressed }) => [
              styles.opt,
              {
                backgroundColor: selected ? active : 'transparent',
                borderColor: selected ? active : theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: selected ? '#0D0D0D' : theme.textPrimary,
                  fontWeight: selected ? '700' : '500',
                },
              ]}
            >
              {selected ? '✓ ' : ''}
              {o.label} {o.emoji ?? ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  opt: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  label: { ...typography.body },
});
