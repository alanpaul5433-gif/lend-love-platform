'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { audit } from './audit';
import type {
  Loan,
  LoanStatus,
  MoneyLoan,
  ItemLoan,
  User,
  Agreement,
} from '@lendlove/shared';

type Extras = { loaner?: User | null; borrower?: User | null; adminNote?: string };
export type LoanRow = (MoneyLoan & Extras) | (ItemLoan & Extras);

export async function fetchAllLoans(): Promise<LoanRow[]> {
  const _db = db();
  const snap = await getDocs(
    query(collection(_db, 'loans'), orderBy('createdAt', 'desc'), limit(500))
  );
  const loans = snap.docs.map((d) => d.data() as Loan);

  // Hydrate participant info
  const uids = new Set<string>();
  loans.forEach((l) => {
    if (l.loanerId) uids.add(l.loanerId);
    if (l.borrowerId) uids.add(l.borrowerId);
  });

  const users = new Map<string, User | null>();
  await Promise.all(
    Array.from(uids).map(async (uid) => {
      try {
        const s = await getDoc(doc(_db, 'users', uid));
        users.set(uid, s.exists() ? (s.data() as User) : null);
      } catch {
        users.set(uid, null);
      }
    })
  );

  return loans.map((l) => ({
    ...l,
    loaner: users.get(l.loanerId) ?? null,
    borrower: l.borrowerId ? users.get(l.borrowerId) ?? null : null,
  }));
}

export async function fetchLoanAgreement(loanId: string): Promise<Agreement | null> {
  const loanSnap = await getDoc(doc(db(), 'loans', loanId));
  const loan = loanSnap.data() as Loan | undefined;
  if (!loan?.agreementId) return null;
  const aSnap = await getDoc(doc(db(), 'agreements', loan.agreementId));
  return aSnap.exists() ? (aSnap.data() as Agreement) : null;
}

export async function setLoanStatus(loanId: string, status: LoanStatus): Promise<void> {
  const before = await getDoc(doc(db(), 'loans', loanId));
  await updateDoc(doc(db(), 'loans', loanId), {
    status,
    updatedAt: Date.now(),
  });
  await audit(
    `loan.${status}`,
    { collection: 'loans', id: loanId },
    {
      before: { status: (before.data() as Loan | undefined)?.status },
      after: { status },
    }
  );
}

export async function setAdminNote(loanId: string, note: string): Promise<void> {
  await updateDoc(doc(db(), 'loans', loanId), {
    adminNote: note,
    updatedAt: Date.now(),
  });
  await audit(
    'loan.note',
    { collection: 'loans', id: loanId },
    { after: { adminNote: note } }
  );
}
