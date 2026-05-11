'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { audit } from './audit';
import type { KycSubmission, KycStatus, User } from '@lendlove/shared';

export interface KycRow extends KycSubmission {
  user?: User | null;
}

export async function fetchKycSubmissions(filter?: KycStatus | 'all'): Promise<KycRow[]> {
  const _db = db();
  const constraints = [orderBy('createdAt', 'desc'), limit(200)];
  const q =
    !filter || filter === 'all'
      ? query(collection(_db, 'kycSubmissions'), ...constraints)
      : query(collection(_db, 'kycSubmissions'), where('status', '==', filter), ...constraints);

  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => d.data() as KycSubmission);

  // Hydrate user info
  const usersByUid = new Map<string, User | null>();
  await Promise.all(
    Array.from(new Set(rows.map((r) => r.userId))).map(async (uid) => {
      const u = await getDoc(doc(_db, 'users', uid));
      usersByUid.set(uid, u.exists() ? (u.data() as User) : null);
    })
  );

  return rows.map((r) => ({ ...r, user: usersByUid.get(r.userId) ?? null }));
}

export async function approveKyc(submission: KycSubmission, note?: string): Promise<void> {
  const _db = db();
  const before = { status: submission.status, isVerified: false };
  const after = { status: 'approved' as KycStatus, isVerified: true };

  await updateDoc(doc(_db, 'kycSubmissions', submission.id), {
    status: 'approved',
    reviewedAt: Date.now(),
    rejectionReason: null,
    confidenceScore: submission.confidenceScore ?? 1,
  });
  await updateDoc(doc(_db, 'users', submission.userId), {
    isVerified: true,
    kycStatus: 'approved',
    updatedAt: Date.now(),
  });
  await audit('kyc.approve', { collection: 'kycSubmissions', id: submission.id }, {
    before,
    after: { ...after, note },
  });
}

export async function rejectKyc(submission: KycSubmission, reason: string): Promise<void> {
  const _db = db();
  const before = { status: submission.status };
  const after = { status: 'rejected' as KycStatus, rejectionReason: reason };

  await updateDoc(doc(_db, 'kycSubmissions', submission.id), {
    status: 'rejected',
    reviewedAt: Date.now(),
    rejectionReason: reason,
  });
  await updateDoc(doc(_db, 'users', submission.userId), {
    isVerified: false,
    kycStatus: 'rejected',
    updatedAt: Date.now(),
  });
  await audit('kyc.reject', { collection: 'kycSubmissions', id: submission.id }, {
    before,
    after,
  });
}

export async function flagForManualReview(submission: KycSubmission): Promise<void> {
  await updateDoc(doc(db(), 'kycSubmissions', submission.id), {
    status: 'manual_review',
    updatedAt: Date.now(),
  });
  await audit('kyc.flag_manual', { collection: 'kycSubmissions', id: submission.id });
}
