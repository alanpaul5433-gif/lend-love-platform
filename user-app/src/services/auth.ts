/**
 * Authentication service.
 *
 * In DEMO_MODE we sign users in anonymously and write a demo profile.
 * Real flow uses email/password + custom claims for KYC + admin roles.
 */
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FbUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { DEMO_MODE } from '../config/env';
import { DEMO } from '@lendlove/shared';
import type { User } from '@lendlove/shared';

export async function signInAsGuestLoaner(): Promise<User> {
  return signInAsGuest('loaner');
}

export async function signInAsGuestBorrower(): Promise<User> {
  return signInAsGuest('borrower');
}

async function signInAsGuest(role: 'loaner' | 'borrower'): Promise<User> {
  const cred = await signInAnonymously(auth);
  const isLoaner = role === 'loaner';

  const profile: User = {
    uid: cred.user.uid,
    email: isLoaner ? DEMO.LOANER_EMAIL : DEMO.BORROWER_EMAIL,
    fullName: isLoaner ? 'Guest Loaner' : 'Guest Borrower',
    phone: isLoaner ? '+1 555-7777' : '+1 555-8888',
    address: isLoaner ? 'Demo Street 10, Sample City' : 'Demo Avenue 22, Sample City',
    birthday: isLoaner ? '1990-01-01' : '1991-02-02',
    occupation: 'Demo User',
    rating: isLoaner ? 4.9 : 4.7,
    reviewCount: isLoaner ? 3 : 2,
    completedLoans: isLoaner ? 2 : 1,
    overdueLoans: 0,
    totalLent: isLoaner ? 0 : 1500,
    totalBorrowed: 0,
    isVerified: true,
    kycStatus: 'approved',
    role: 'user',
    notificationsEnabled: true,
    biometricsEnabled: false,
    themePreference: 'dark',
    isDemo: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(doc(db, 'users', cred.user.uid), profile, { merge: true });
  return profile;
}

export async function signIn(email: string, password: string): Promise<FbUser> {
  if (DEMO_MODE) {
    // In demo mode any login becomes a guest loaner.
    await signInAsGuestLoaner();
  } else {
    await signInWithEmailAndPassword(auth, email, password);
  }
  if (!auth.currentUser) throw new Error('Sign-in failed');
  return auth.currentUser;
}

export async function signUp(
  email: string,
  password: string,
  profile: Partial<User>
): Promise<FbUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const baseProfile: User = {
    uid: cred.user.uid,
    email,
    fullName: profile.fullName ?? '',
    phone: profile.phone,
    address: profile.address,
    birthday: profile.birthday,
    occupation: profile.occupation,
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
    isDemo: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(doc(db, 'users', cred.user.uid), baseProfile);
  return cred.user;
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export async function getProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export function onAuthChange(cb: (uid: string | null) => void) {
  return onAuthStateChanged(auth, (u) => cb(u?.uid ?? null));
}
