import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import { useTheme, spacing, radius, typography } from '../theme/ThemeProvider';
import { Button } from './Button';
import { formatDate } from '../utils/format';

interface Props {
  label?: string;
  value?: number; // ms timestamp
  onChange: (ms: number) => void;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Minimal cross-platform date picker.
 * Web: native <input type="date" />
 * Mobile: simple 3-column scroll picker (day / month / year) in a modal.
 */
export function DateField({ label, value, onChange, minDate, maxDate }: Props) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  // ---- Web path ----
  if (Platform.OS === 'web') {
    const v = value ? new Date(value).toISOString().slice(0, 10) : '';
    return (
      <View style={{ width: '100%' }}>
        {label ? (
          <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        ) : null}
        <View
          style={[
            styles.field,
            { backgroundColor: theme.bgElevated, borderColor: theme.border },
          ]}
        >
          {React.createElement('input', {
            type: 'date',
            value: v,
            min: minDate?.toISOString().slice(0, 10),
            max: maxDate?.toISOString().slice(0, 10),
            onChange: (e: { target: { value: string } }) => {
              const d = new Date(e.target.value);
              if (!isNaN(d.getTime())) onChange(d.getTime());
            },
            style: {
              width: '100%',
              height: 32,
              padding: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: theme.textPrimary,
              fontSize: 15,
            },
          })}
        </View>
      </View>
    );
  }

  // ---- Mobile path ----
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
        <Text style={[styles.value, { color: value ? theme.textPrimary : theme.textMuted }]}>
          {value ? formatDate(value) : 'Select a date'}
        </Text>
        <Text style={{ color: theme.textSecondary }}>📅</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={[styles.modal, { backgroundColor: theme.bgSurface }]}>
            <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.md }]}>
              {label ?? 'Pick a date'}
            </Text>
            <PickerColumns
              value={value ?? Date.now() + 90 * 24 * 60 * 60 * 1000}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
            />
            <View style={{ height: spacing.md }} />
            <Button label="Done" fullWidth onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PickerColumns({
  value,
  onChange,
  minDate,
  maxDate,
}: {
  value: number;
  onChange: (ms: number) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const { theme } = useTheme();
  const d = new Date(value);

  const adjust = (kind: 'day' | 'month' | 'year', delta: number) => {
    const next = new Date(d);
    if (kind === 'day') next.setDate(next.getDate() + delta);
    if (kind === 'month') next.setMonth(next.getMonth() + delta);
    if (kind === 'year') next.setFullYear(next.getFullYear() + delta);
    if (minDate && next < minDate) return;
    if (maxDate && next > maxDate) return;
    onChange(next.getTime());
  };

  const Col = ({
    kind,
    label,
    value: v,
  }: {
    kind: 'day' | 'month' | 'year';
    label: string;
    value: string;
  }) => (
    <View style={pickerStyles.col}>
      <Text style={[pickerStyles.colLabel, { color: theme.textMuted }]}>{label}</Text>
      <Pressable onPress={() => adjust(kind, 1)} style={pickerStyles.btn}>
        <Text style={[pickerStyles.btnText, { color: theme.primary }]}>▲</Text>
      </Pressable>
      <Text style={[pickerStyles.value, { color: theme.textPrimary }]}>{v}</Text>
      <Pressable onPress={() => adjust(kind, -1)} style={pickerStyles.btn}>
        <Text style={[pickerStyles.btnText, { color: theme.primary }]}>▼</Text>
      </Pressable>
    </View>
  );

  const monthName = d.toLocaleString('en-US', { month: 'short' });

  return (
    <View style={pickerStyles.row}>
      <Col kind="month" label="Month" value={monthName} />
      <Col kind="day" label="Day" value={String(d.getDate())} />
      <Col kind="year" label="Year" value={String(d.getFullYear())} />
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
    padding: spacing.xl,
  },
});

const pickerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  col: {
    alignItems: 'center',
    gap: 6,
  },
  colLabel: { ...typography.label },
  btn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  btnText: { fontSize: 18, fontWeight: '700' },
  value: { ...typography.h2, marginVertical: 4 },
});
