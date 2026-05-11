'use client';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { audit } from './audit';
import { COMPLIANCE, PLATFORM_DEFAULTS } from '@lendlove/shared';
import type { PlatformConfig } from '@lendlove/shared';

const CONFIG_DOC = 'platform';

export const DEFAULT_FEATURE_FLAGS: Record<string, boolean> = {
  // Mobile feature toggles
  'mobile.itemLoans': true,
  'mobile.borrowerRequests': true,
  'mobile.biometricLogin': true,
  'mobile.chatAttachments': true,
  // Compliance toggles
  'compliance.requireKycForBorrowing': false,
  'compliance.requireKycForLending': false,
  'compliance.amlScreeningEnforced': true,
  // Integrations (production)
  'integrations.paykings.enabled': false,
  'integrations.idAnalyzer.enabled': false,
  'integrations.streamChat.enabled': false,
  // Maintenance
  'maintenance.readOnlyMode': false,
};

function defaultConfig(): PlatformConfig {
  return {
    feePercent: PLATFORM_DEFAULTS.PLATFORM_FEE_PERCENT,
    maxAPR: COMPLIANCE.MAX_APR_PERCENT,
    minLoanAmount: PLATFORM_DEFAULTS.MIN_LOAN_AMOUNT,
    maxLoanAmount: PLATFORM_DEFAULTS.MAX_LOAN_AMOUNT,
    minLoanTermDays: COMPLIANCE.MIN_LOAN_TERM_DAYS,
    minBorrowerAge: COMPLIANCE.MIN_AGE,
    featureFlags: DEFAULT_FEATURE_FLAGS,
    updatedAt: Date.now(),
  };
}

export async function fetchPlatformConfig(): Promise<PlatformConfig> {
  const ref = doc(db(), 'config', CONFIG_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const seed = defaultConfig();
    try {
      await setDoc(ref, seed);
    } catch {
      // ignore — admin may not be signed in yet
    }
    return seed;
  }
  const data = snap.data() as PlatformConfig;
  return {
    ...defaultConfig(),
    ...data,
    featureFlags: { ...DEFAULT_FEATURE_FLAGS, ...(data.featureFlags ?? {}) },
  };
}

export async function updatePlatformConfig(
  next: Partial<PlatformConfig>,
  current: PlatformConfig
): Promise<void> {
  const adminUid = auth().currentUser?.uid;
  if (!adminUid) throw new Error('Not signed in');

  const ref = doc(db(), 'config', CONFIG_DOC);
  const merged = {
    ...current,
    ...next,
    featureFlags: { ...current.featureFlags, ...(next.featureFlags ?? {}) },
    lastUpdatedBy: adminUid,
    updatedAt: Date.now(),
  };
  await setDoc(ref, merged, { merge: true });

  // Audit only the diff
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  for (const key of Object.keys(next) as (keyof PlatformConfig)[]) {
    before[key] = current[key];
    after[key] = next[key];
  }
  await audit('config.update', { collection: 'config', id: CONFIG_DOC }, { before, after });
}
