import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, spacing, radius, typography } from '../src/theme/ThemeProvider';
import { Button } from '../src/components/Button';
import { StepIndicator } from '../src/components/StepIndicator';
import { useAuthStore } from '../src/store/auth';
import { uploadKycDocument, submitKyc, type KycDocType } from '../src/services/kyc';
import { getProfile } from '../src/services/auth';

type Step = 'intro' | 'id' | 'selfie' | 'address' | 'processing' | 'success';

const STEP_LABELS = ['Gov ID', 'Selfie', 'Address'];

export default function KycVerification() {
  const router = useRouter();
  const { theme } = useTheme();
  const { uid, profile, setProfile } = useAuthStore();

  const [step, setStep] = useState<Step>(profile?.isVerified ? 'success' : 'intro');
  const [idUri, setIdUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [addressUri, setAddressUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pickImage = async (source: 'camera' | 'gallery', front = false) => {
    try {
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission denied', 'Camera permission is required.');
          return null;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: front ? [1, 1] : [4, 3],
          quality: 0.7,
          cameraType: front ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
        });
        return result.canceled ? null : result.assets[0].uri;
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission denied', 'Photo library permission is required.');
          return null;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.7,
        });
        return result.canceled ? null : result.assets[0].uri;
      }
    } catch (e: any) {
      Alert.alert('Could not access camera/photos', e?.message ?? 'Try again.');
      return null;
    }
  };

  const setForStep = (s: Step, uri: string | null) => {
    if (!uri) return;
    if (s === 'id') setIdUri(uri);
    else if (s === 'selfie') setSelfieUri(uri);
    else if (s === 'address') setAddressUri(uri);
  };

  const submit = async () => {
    if (!uid || !idUri || !selfieUri || !addressUri) return;
    setStep('processing');
    setBusy(true);
    try {
      const [idUrl, selfieUrl, addressUrl] = await Promise.all([
        uploadKycDocument(uid, 'id', idUri),
        uploadKycDocument(uid, 'selfie', selfieUri),
        uploadKycDocument(uid, 'address', addressUri),
      ]);
      await submitKyc(uid, { idUrl, selfieUrl, addressUrl });
      const fresh = await getProfile(uid);
      setProfile(fresh);
      setStep('success');
    } catch (e: any) {
      Alert.alert('Verification failed', e?.message ?? 'Try again.');
      setStep('address');
    } finally {
      setBusy(false);
    }
  };

  // ---- Intro ----
  if (step === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgBase }} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header back="welcome" />
        <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
          <Text style={[typography.h1, { color: theme.textPrimary }]}>Verify your identity</Text>
          <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.md }]}>
            To keep the marketplace safe, we verify your identity in three quick steps.
            Documents are encrypted and used only for verification.
          </Text>

          <View style={{ height: spacing.xl }} />
          <StepRow icon="💳" title="Government ID" description="Driver license or passport" theme={theme} />
          <StepRow icon="🙂" title="Selfie" description="Make sure your face is clear" theme={theme} />
          <StepRow icon="🏠" title="Proof of address" description="Utility bill or bank statement" theme={theme} />

          <View style={{ height: spacing.xl }} />
          <View
            style={[
              styles.disclosure,
              { backgroundColor: theme.bgElevated, borderColor: theme.border },
            ]}
          >
            <Text style={[typography.caption, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: '700' }}>AML / Privacy disclosure: </Text>
              We share these documents with our identity-verification provider (ID Analyzer) to
              confirm your identity and run AML screening per federal law. They are stored
              encrypted and never shared with other users.
            </Text>
          </View>

          <View style={{ height: spacing.xl }} />
          <Button label="→ Start Verification" fullWidth onPress={() => setStep('id')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Success ----
  if (step === 'success' || profile?.isVerified) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgBase }} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header back="back" />
        <View style={[styles.center, { flex: 1, padding: spacing.xxl }]}>
          <View
            style={[
              styles.successCircle,
              { backgroundColor: theme.successTint, borderColor: theme.primary },
            ]}
          >
            <Text style={[styles.successCheck, { color: theme.primary }]}>✓</Text>
          </View>
          <Text style={[typography.h1, { color: theme.textPrimary, marginTop: spacing.xl }]}>
            You're verified
          </Text>
          <Text
            style={[
              typography.body,
              { color: theme.textSecondary, textAlign: 'center', marginTop: spacing.md },
            ]}
          >
            Your identity has been confirmed. You now have access to all Lend Love features and
            display a Verified badge on your profile.
          </Text>
          <View style={{ height: spacing.xl }} />
          <Button label="Back to Profile" variant="primary" fullWidth onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  // ---- Processing ----
  if (step === 'processing') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgBase }} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.center, { flex: 1, padding: spacing.xxl }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[typography.h2, { color: theme.textPrimary, marginTop: spacing.xl }]}>
            Verifying your identity…
          </Text>
          <Text
            style={[
              typography.body,
              { color: theme.textSecondary, textAlign: 'center', marginTop: spacing.md },
            ]}
          >
            Running AML screening and document checks. This usually takes a few seconds.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Document capture steps ----
  const currentStepNum = step === 'id' ? 1 : step === 'selfie' ? 2 : 3;
  const currentUri = step === 'id' ? idUri : step === 'selfie' ? selfieUri : addressUri;
  const currentTitle =
    step === 'id'
      ? 'Government ID'
      : step === 'selfie'
        ? 'Take a selfie'
        : 'Proof of address';
  const currentDesc =
    step === 'id'
      ? 'Driver license or passport. Hold steady — all 4 corners must be visible.'
      : step === 'selfie'
        ? 'Center your face in the frame. Avoid sunglasses and hats.'
        : 'Utility bill or bank statement from the last 90 days.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgBase }} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header back="cancel" onBack={() => setStep('intro')} />
      <StepIndicator total={3} current={currentStepNum} labels={STEP_LABELS} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, flexGrow: 1 }}>
        <Text style={[typography.h2, { color: theme.textPrimary }]}>{currentTitle}</Text>
        <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.xs }]}>
          {currentDesc}
        </Text>

        <View style={{ height: spacing.lg }} />

        {currentUri ? (
          <View
            style={[
              styles.preview,
              { borderColor: theme.primary, backgroundColor: theme.bgSurface },
            ]}
          >
            <Image source={{ uri: currentUri }} style={styles.previewImg} resizeMode="cover" />
          </View>
        ) : (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: theme.bgSurface, borderColor: theme.border },
            ]}
          >
            <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.sm }]}>
              No photo yet
            </Text>
          </View>
        )}

        <View style={{ height: spacing.lg }} />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Button
              label="📷 Take Photo"
              variant="primary"
              fullWidth
              onPress={async () => {
                const uri = await pickImage('camera', step === 'selfie');
                setForStep(step, uri);
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="🖼 From Gallery"
              variant="outline"
              fullWidth
              onPress={async () => {
                const uri = await pickImage('gallery');
                setForStep(step, uri);
              }}
            />
          </View>
        </View>

        <View style={{ height: spacing.md }} />

        <Pressable
          onPress={() => {
            // Demo-only: provide a sample for client demos without real photos
            const sample = sampleAssetFor(step);
            setForStep(step, sample);
          }}
        >
          <Text style={[typography.caption, { color: theme.textMuted, textAlign: 'center' }]}>
            Demo only: use a sample document instead →
          </Text>
        </Pressable>

        <View style={{ flex: 1 }} />
        <View style={{ height: spacing.xl }} />

        <Button
          label={step === 'address' ? '✓ Submit for Review' : 'Continue →'}
          variant="primary"
          fullWidth
          disabled={!currentUri || busy}
          loading={busy}
          onPress={() => {
            if (step === 'id') setStep('selfie');
            else if (step === 'selfie') setStep('address');
            else submit();
          }}
        />
        <View style={{ height: spacing.sm }} />
        <Button
          label="Back"
          variant="ghost"
          fullWidth
          onPress={() => {
            if (step === 'selfie') setStep('id');
            else if (step === 'address') setStep('selfie');
            else setStep('intro');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );

  function Header({
    back,
    onBack,
  }: {
    back: 'back' | 'cancel' | 'welcome';
    onBack?: () => void;
  }) {
    return (
      <View style={styles.header}>
        <Pressable onPress={onBack ?? (() => router.back())} hitSlop={10}>
          <Text style={[styles.back, { color: theme.textPrimary }]}>
            {back === 'cancel' ? '✕' : '←'}
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>KYC Verification</Text>
        <View style={{ width: 24 }} />
      </View>
    );
  }
}

function StepRow({
  theme,
  icon,
  title,
  description,
}: {
  theme: ReturnType<typeof useTheme>['theme'];
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.stepRow}>
      <View
        style={[
          styles.stepIcon,
          { backgroundColor: theme.successTint, borderColor: theme.primary },
        ]}
      >
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>{title}</Text>
        <Text style={[typography.caption, { color: theme.textSecondary }]}>{description}</Text>
      </View>
    </View>
  );
}

/** Returns a tiny inline SVG data URI as a placeholder document for demo. */
function sampleAssetFor(s: Step): string {
  const labels: Record<string, string> = {
    id: 'SAMPLE GOVERNMENT ID',
    selfie: 'SAMPLE SELFIE',
    address: 'SAMPLE PROOF OF ADDRESS',
  };
  const label = labels[s] ?? 'SAMPLE';
  if (Platform.OS === 'web') {
    // Use a data URL on web
    const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1A1A1A"/><rect x="10" y="10" width="380" height="230" fill="none" stroke="#3D9A2E" stroke-width="2"/><text x="200" y="130" text-anchor="middle" fill="#5DBF3F" font-family="sans-serif" font-size="20" font-weight="700">${label}</text><text x="200" y="160" text-anchor="middle" fill="#A0A0A0" font-family="sans-serif" font-size="12">Lend Love Demo Mode</text></svg>`;
    return `data:image/svg+xml;base64,${typeof btoa !== 'undefined' ? btoa(svg) : Buffer.from(svg).toString('base64')}`;
  }
  // On native, return a base64 PNG-like data URL (tiny 1x1 gray pixel as placeholder)
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  disclosure: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  preview: {
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
  },
  previewImg: { width: '100%', height: '100%' },
  placeholder: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheck: { fontSize: 56, fontWeight: '700' },
});
