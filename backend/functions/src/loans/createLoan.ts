import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { CreateLoanSchema } from '@lendlove/shared';
import { requireAuth, badRequest } from '../lib/errors';

/**
 * Creates a loan (money or item). Enforces:
 * - Auth required
 * - Loaner must be the calling user
 * - Zod validation including APR cap + term floor (store compliance)
 */
export const createLoan = onCall({ region: 'us-central1' }, async (req) => {
  const uid = requireAuth(req.auth);

  const parsed = CreateLoanSchema.safeParse(req.data);
  if (!parsed.success) {
    badRequest(parsed.error.errors.map((e) => e.message).join('; '));
  }

  const db = admin.firestore();
  const loanRef = db.collection('loans').doc();
  const now = Date.now();

  await loanRef.set({
    id: loanRef.id,
    ...parsed.data,
    loanerId: uid,
    status: 'published',
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  return { success: true, loanId: loanRef.id };
});
