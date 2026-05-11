import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme/ThemeProvider';

interface Props {
  total: number;
  current: number; // 1-based
  labels?: string[];
}

export function StepIndicator({ total, current, labels }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        const color = done || active ? theme.primary : theme.border;
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.line}>
              {i > 0 ? (
                <View
                  style={[
                    styles.leftBar,
                    { backgroundColor: step <= current ? theme.primary : theme.border },
                  ]}
                />
              ) : null}
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done ? theme.primary : active ? theme.bgSurface : theme.bgElevated,
                    borderColor: color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dotText,
                    { color: done ? '#0D0D0D' : active ? theme.primary : theme.textMuted },
                  ]}
                >
                  {done ? '✓' : String(step)}
                </Text>
              </View>
              {i < total - 1 ? (
                <View
                  style={[
                    styles.rightBar,
                    { backgroundColor: step < current ? theme.primary : theme.border },
                  ]}
                />
              ) : null}
            </View>
            {labels?.[i] ? (
              <Text
                style={[
                  styles.label,
                  { color: active ? theme.textPrimary : theme.textMuted },
                ]}
                numberOfLines={1}
              >
                {labels[i]}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.lg,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  leftBar: { flex: 1, height: 2 },
  rightBar: { flex: 1, height: 2 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { ...typography.label, fontWeight: '700' },
  label: { ...typography.label, marginTop: spacing.xs, fontSize: 10 },
});
