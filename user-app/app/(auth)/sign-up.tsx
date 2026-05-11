import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme, spacing, typography } from '../../src/theme/ThemeProvider';
import { Button } from '../../src/components/Button';

export default function SignUp() {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bgBase }]}>
      <View style={styles.box}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Full sign-up flow (with age verification, KYC trigger, and ToS acceptance) is coming next.
        </Text>
        <Button label="Back" variant="outline" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  box: { flex: 1, padding: spacing.xl, justifyContent: 'center', gap: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body },
});
