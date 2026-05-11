/**
 * Demo seed — populates a guest account's Firestore data so the
 * client can demo every feature without paid integrations.
 *
 * Idempotent: safe to call on every sign-in.
 */
import {
  collection,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Loan, LoanRequest, Conversation, Transaction } from '@lendlove/shared';

const ONE_DAY = 24 * 60 * 60 * 1000;

export async function seedDemoDataForUser(uid: string, role: 'loaner' | 'borrower') {
  // Idempotency: skip if we already seeded for this UID
  const existing = await getDocs(
    query(collection(db, 'loans'), where('loanerId', '==', uid), limit(1))
  );
  if (!existing.empty) return;

  const batch = writeBatch(db);
  const now = Date.now();

  if (role === 'loaner') {
    seedLoanerData(batch, uid, now);
  } else {
    seedBorrowerData(batch, uid, now);
  }

  // Shared marketplace listings (visible to both)
  seedMarketplace(batch, uid, now);

  await batch.commit();
}

function seedLoanerData(batch: ReturnType<typeof writeBatch>, uid: string, now: number) {
  // Active Money Loan
  const moneyLoanRef = doc(collection(db, 'loans'));
  batch.set(moneyLoanRef, {
    id: moneyLoanRef.id,
    type: 'money',
    loanerId: uid,
    borrowerId: 'demo-borrower-partner',
    status: 'active',
    amount: 1200,
    currency: 'USD',
    interestRate: 2.5,
    installments: 6,
    installmentFrequency: 'monthly',
    lateFeePerDay: 0,
    dueDate: now + 30 * ONE_DAY,
    balance: 1000,
    description: 'Flexible small loan for short-term needs',
    createdAt: now - 30 * ONE_DAY,
    updatedAt: now,
    publishedAt: now - 30 * ONE_DAY,
  });

  // Active Item Loan
  const itemLoanRef = doc(collection(db, 'loans'));
  batch.set(itemLoanRef, {
    id: itemLoanRef.id,
    type: 'item',
    loanerId: uid,
    borrowerId: 'demo-borrower-partner',
    status: 'active',
    itemTitle: 'Cordless Drill Kit',
    description: '18V brushless drill with 2 batteries and charger',
    condition: 'Good',
    deposit: 50,
    replacementValue: 200,
    returnDate: now + 10 * ONE_DAY,
    notes: 'Please return fully charged 🔋',
    createdAt: now - 5 * ONE_DAY,
    updatedAt: now,
    publishedAt: now - 5 * ONE_DAY,
  });
}

function seedBorrowerData(batch: ReturnType<typeof writeBatch>, uid: string, now: number) {
  const borrowedRef = doc(collection(db, 'loans'));
  batch.set(borrowedRef, {
    id: borrowedRef.id,
    type: 'money',
    loanerId: 'demo-loaner-partner',
    borrowerId: uid,
    status: 'active',
    amount: 1500,
    currency: 'USD',
    interestRate: 3,
    installments: 3,
    installmentFrequency: 'monthly',
    lateFeePerDay: 0,
    dueDate: now + 90 * ONE_DAY,
    balance: 1500,
    description: 'Approved by Guest Loaner',
    createdAt: now - 10 * ONE_DAY,
    updatedAt: now,
    publishedAt: now - 10 * ONE_DAY,
  });

  // Transaction record
  const txRef = doc(collection(db, 'transactions'));
  batch.set(txRef, {
    id: txRef.id,
    loanId: borrowedRef.id,
    userId: uid,
    type: 'disbursement',
    direction: 'credit',
    amount: 1500,
    currency: 'USD',
    status: 'completed',
    description: 'Loan Disbursed',
    processedAt: now - 10 * ONE_DAY,
    createdAt: now - 10 * ONE_DAY,
  });

  // Conversation with the demo loaner — deterministic ID
  const partnerId = 'demo-loaner-partner';
  const convId = [uid, partnerId].sort().join('_') + '__' + borrowedRef.id;
  const convRef = doc(db, 'conversations', convId);
  batch.set(convRef, {
    id: convId,
    participantIds: [uid, partnerId].sort(),
    loanId: borrowedRef.id,
    lastMessage: 'Hello! It is due in 30 days. I will share the PDF now.',
    lastMessageAt: now - 6 * 60 * 1000,
    lastSenderId: partnerId,
    createdAt: now - 10 * ONE_DAY,
  });

  // Seed a few prior messages so the conversation is "alive"
  const msgs = [
    { sender: partnerId, text: 'Hi! Saw your request — happy to lend.', at: now - 20 * 60 * 1000 },
    { sender: uid, text: 'Thank you so much. Can we proceed?', at: now - 15 * 60 * 1000 },
    { sender: partnerId, text: 'Yes, drafting the agreement now.', at: now - 10 * 60 * 1000 },
    {
      sender: partnerId,
      text: 'Hello! It is due in 30 days. I will share the PDF now.',
      at: now - 6 * 60 * 1000,
    },
  ];
  msgs.forEach((m) => {
    const mRef = doc(collection(db, 'conversations', convId, 'messages'));
    batch.set(mRef, {
      id: mRef.id,
      conversationId: convId,
      senderId: m.sender,
      text: m.text,
      sentAt: m.at,
      readBy: [m.sender],
    });
  });
}

function seedMarketplace(batch: ReturnType<typeof writeBatch>, uid: string, now: number) {
  const listings = [
    // Money offers
    {
      type: 'money',
      loanerId: 'demo-marketplace-1',
      status: 'published',
      amount: 5000,
      currency: 'USD',
      interestRate: 5,
      installments: 6,
      installmentFrequency: 'monthly',
      lateFeePerDay: 0,
      dueDate: now + 180 * ONE_DAY,
      description: 'Quick loan for emergency expenses. Low interest rate.',
    },
    {
      type: 'money',
      loanerId: 'demo-marketplace-2',
      status: 'published',
      amount: 10000,
      currency: 'USD',
      interestRate: 0,
      installments: 12,
      installmentFrequency: 'monthly',
      lateFeePerDay: 0,
      dueDate: now + 90 * ONE_DAY,
      description: 'Interest-free loan. Must repay in full by due date.',
    },
    // Item offers
    {
      type: 'item',
      loanerId: 'demo-marketplace-3',
      status: 'published',
      itemTitle: 'Canon EOS R6 Camera',
      description:
        'Professional mirrorless camera with 2 lenses (24-70mm and 70-200mm). Perfect for photography.',
      condition: 'Excellent',
      replacementValue: 3500,
      returnDate: now + 14 * ONE_DAY,
      notes: 'Must handle with care. Includes camera bag and accessories.',
    },
    {
      type: 'item',
      loanerId: 'demo-marketplace-4',
      status: 'published',
      itemTitle: 'Mountain Bike',
      description: 'Trek X-Caliber 9 mountain bike. 29" wheels, full suspension, great for trails.',
      condition: 'Good',
      replacementValue: 1200,
      returnDate: now + 7 * ONE_DAY,
    },
  ];

  for (const l of listings) {
    const ref = doc(collection(db, 'loans'));
    batch.set(ref, {
      id: ref.id,
      ...l,
      createdAt: now - 7 * ONE_DAY,
      updatedAt: now,
      publishedAt: now - 7 * ONE_DAY,
    });
  }

  // Loan requests from borrowers
  const requests = [
    {
      borrowerId: 'demo-request-1',
      amount: 3000,
      currency: 'USD',
      purpose: 'Medical expenses for family member',
      neededByDate: now + 4 * ONE_DAY,
      repaymentTermMonths: 3,
      status: 'open',
    },
    {
      borrowerId: 'demo-request-2',
      amount: 1500,
      currency: 'USD',
      purpose: 'Car repair',
      neededByDate: now + 5 * ONE_DAY,
      repaymentTermMonths: 2,
      collateral: 'Vehicle title as collateral',
      status: 'open',
    },
    {
      borrowerId: 'demo-request-3',
      amount: 800,
      currency: 'USD',
      purpose: 'Emergency car repair',
      neededByDate: now + 3 * ONE_DAY,
      repaymentTermMonths: 2,
      status: 'open',
    },
  ];

  for (const r of requests) {
    const ref = doc(collection(db, 'loanRequests'));
    batch.set(ref, { id: ref.id, ...r, createdAt: now - 2 * ONE_DAY, updatedAt: now });
  }
}
