import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Creates a default user profile document when a new Firebase Auth user signs up.
 * For anonymous (demo) accounts the mobile client writes a richer profile after sign-in;
 * this trigger just ensures every account has a baseline record.
 *
 * Note: Auth blocking triggers use v1 SDK.
 */
export const onCreateUser = functions
  .region('us-central1')
  .auth.user()
  .onCreate(async (user) => {
    const ref = admin.firestore().doc(`users/${user.uid}`);
    const snap = await ref.get();
    if (snap.exists) return;

    await ref.set({
      uid: user.uid,
      email: user.email ?? '',
      fullName: user.displayName ?? '',
      rating: 0,
      reviewCount: 0,
      completedLoans: 0,
      overdueLoans: 0,
      totalLent: 0,
      totalBorrowed: 0,
      isVerified: false,
      kycStatus: 'none',
      role: 'user',
      notificationsEnabled: true,
      biometricsEnabled: false,
      themePreference: 'dark',
      isDemo: !user.email, // anonymous → demo
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
