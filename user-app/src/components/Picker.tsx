import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, FlatList } from 'react-native';
import { useTheme, spacing, radius, typography } from '../theme/ThemeProvider';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function Picker<T extends string>({ label, options, value, onChange }: Props<T>) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          { backgroundColor: theme.bgElevated, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.value, { color: theme.textPrimary }]}>
          {current?.label ?? '—'}
        </Text>
        <Text style={{ color: theme.textSecondary }}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.modal, { backgroundColor: theme.bgSurface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    {
                      backgroundColor: pressed ? theme.bgElevated : 'transparent',
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.body,
                      {
                        color: item.value === value ? theme.primary : theme.textPrimary,
                        fontWeight: item.value === value ? '700' : '400',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  field: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: { ...typography.body },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modal: {
    borderRadius: radius.lg,
    maxHeight: '60%',
    overflow: 'hidden',
  },
  item: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
  },
});
