import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useTheme, spacing, radius, typography } from '../src/theme/ThemeProvider';
import { useAuthStore } from '../src/store/auth';
import { useMyLending, useMyBorrowing } from '../src/hooks/useMarketplace';
import { formatMoney } from '../src/utils/format';

export default function Analytics() {
  const router = useRouter();
  const { theme } = useTheme();
  const { uid, profile } = useAuthStore();
  const lending = useMyLending(uid);
  const borrowing = useMyBorrowing(uid);

  const totalLent = profile?.totalLent ?? 0;
  const totalBorrowed = profile?.totalBorrowed ?? 0;
  const activeCount =
    (lending.data?.filter((l) => l.status === 'active' || l.status === 'published').length ?? 0) +
    (borrowing.data?.filter((l) => l.status === 'active').length ?? 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgBase }} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text onPress={() => router.back()} style={[styles.back, { color: theme.textPrimary }]}>
          ←
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Analytics</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        <View style={styles.row}>
          <Stat tint={theme.successTint} color={theme.primary} icon="🐖" label="Total Lent" value={formatMoney(totalLent)} />
          <Stat tint={theme.warningTint} color={theme.secondary} icon="📄" label="Total Borrowed" value={formatMoney(totalBorrowed)} />
        </View>
        <View style={styles.row}>
          <Stat tint={theme.successTint} color={theme.primary} icon="✓" label="Active Loans" value={String(activeCount)} />
          <Stat tint={theme.dangerTint} color={theme.danger} icon="⚠" label="Overdue" value={String(profile?.overdueLoans ?? 0)} />
        </View>

        <Text style={[typography.h2, { color: theme.textPrimary, marginTop: spacing.xl }]}>
          Cashflow (last 6 entries)
        </Text>
        <View style={[styles.placeholder, { borderColor: theme.border }]}>
          <Text style={{ color: theme.textMuted }}>
            Charts will be wired up next (Victory Native).
          </Text>
        </View>

        <Text style={[typography.h2, { color: theme.textPrimary, marginTop: spacing.xl }]}>
          Loan Types
        </Text>
        <View style={[styles.placeholder, { borderColor: theme.border, minHeight: 160 }]}>
          <Text style={{ color: theme.textMuted }}>Money vs Items donut chart — soon.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  tint,
  color,
  icon,
  label,
  value,
}: {
  tint: string;
  color: string;
  icon: string;
  label: string;
  value: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: tint, borderColor: color }]}>
      <Text style={{ color, fontSize: 20 }}>{icon}</Text>
      <Text style={[typography.caption, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[typography.numeric, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  back: { fontSize: 24 },
  title: { ...typography.h2 },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  stat: { flex: 1, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: 4 },
  placeholder: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    marginTop: spacing.md,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
