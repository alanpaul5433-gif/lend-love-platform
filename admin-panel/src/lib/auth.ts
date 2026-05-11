'use client';

import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FbUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '@lendlove/shared';

export async function signInWithEmail(email: string, password: string): Promise<FbUser> {
  const cred = await signInWithEmailAndPassword(auth(), email, password);
  return cred.user;
}

/**
 * Demo admin sign-in. Creates an anonymous user with role=admin in Firestore.
 * Custom-claim-based admin will be used once Cloud Functions are deployed on Blaze.
 */
export async function signInAsDemoAdmin(): Promise<User> {
  const cred = await signInAnonymously(auth());
  const profile: User = {
    uid: cred.user.uid,
    email: 'demo.admin@lendlove.app',
    fullName: 'Demo Admin',
    rating: 0,
    reviewCount: 0,
    completedLoans: 0,
    overdueLoans: 0,
    totalLent: 0,
    totalBorrowed: 0,
    isVerified: true,
    kycStatus: 'approved',
    role: 'admin',
    adminTier: 'super',
    notificationsEnabled: false,
    biometricsEnabled: false,
    themePreference: 'dark',
    isDemo: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(doc(db(), 'users', cred.user.uid), profile, { merge: true });
  return profile;
}

export async function fetchProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db(), 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function signOut() {
  await fbSignOut(auth());
}

export function onAuthChange(cb: (uid: string | null) => void) {
  return onAuthStateChanged(auth(), (u) => cb(u?.uid ?? null));
}
