'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { AdminAction, User } from '@lendlove/shared';

export interface AuditRow extends AdminAction {
  admin?: User | null;
}

export async function fetchAuditLog(): Promise<AuditRow[]> {
  const _db = db();
  const snap = await getDocs(
    query(collection(_db, 'adminActions'), orderBy('timestamp', 'desc'), limit(500))
  );
  const rows = snap.docs.map((d) => d.data() as AdminAction);

  // Hydrate admin user info
  const adminIds = Array.from(new Set(rows.map((r) => r.adminId)));
  const users = new Map<string, User | null>();
  await Promise.all(
    adminIds.map(async (uid) => {
      try {
        const s = await getDoc(doc(_db, 'users', uid));
        users.set(uid, s.exists() ? (s.data() as User) : null);
      } catch {
        users.set(uid, null);
      }
    })
  );

  return rows.map((r) => ({ ...r, admin: users.get(r.adminId) ?? null }));
}
