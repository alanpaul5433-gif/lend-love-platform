import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { DeleteAccountSchema } from '@lendlove/shared';
import { requireAuth, badRequest } from '../lib/errors';

/**
 * Apple & Google REQUIRE in-app account deletion.
 * This function:
 *  1. Validates the user typed DELETE
 *  2. Deletes user profile + cascades through known collections
 *  3. Deletes Auth account last (so we can still read uid for cascade)
 *
 * Note: In demo mode there are no real KYC/payment vaults; the integrations
 * engineer will extend this once Blaze is enabled.
 */
export const deleteAccount = onCall({ region: 'us-central1' }, async (req) => {
  const uid = requireAuth(req.auth);

  const parsed = DeleteAccountSchema.safeParse(req.data);
  if (!parsed.success) badRequest(parsed.error.errors[0]?.message ?? 'Invalid input');

  const db = admin.firestore();
  const batch = db.batch();

  // 1. Delete user profile
  batch.delete(db.doc(`users/${uid}`));

  // 2. Delete user's notifications
  const notifs = await db.collection('notifications').where('userId', '==', uid).get();
  notifs.forEach((doc) => batch.delete(doc.ref));

  // 3. Delete KYC submissions
  const kyc = await db.collection('kycSubmissions').where('userId', '==', uid).get();
  kyc.forEach((doc) => batch.delete(doc.ref));

  // 4. Anonymize loans (legal retention — never delete loan history)
  const loansAsLoaner = await db.collection('loans').where('loanerId', '==', uid).get();
  loansAsLoaner.forEach((doc) =>
    batch.update(doc.ref, {
      loanerId: 'deleted-user',
      loanerName: 'Deleted User',
    })
  );
  const loansAsBorrower = await db.collection('loans').where('borrowerId', '==', uid).get();
  loansAsBorrower.forEach((doc) =>
    batch.update(doc.ref, {
      borrowerId: 'deleted-user',
      borrowerName: 'Deleted User',
    })
  );

  await batch.commit();

  // 5. Delete Auth user
  await admin.auth().deleteUser(uid);

  return { success: true };
});
