import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { requireAuth, badRequest, permissionDenied } from '../lib/errors';

const SetRoleSchema = z.object({
  targetUid: z.string().min(1),
  role: z.enum(['user', 'admin']),
  adminTier: z.enum(['super', 'operations', 'finance', 'support']).optional(),
});

/**
 * Promote/demote a user. Only an existing super-admin may invoke.
 * The first super-admin must be set manually via the Firebase Admin SDK or CLI.
 */
export const setRole = onCall({ region: 'us-central1' }, async (req) => {
  const callerUid = requireAuth(req.auth);
  const caller = await admin.auth().getUser(callerUid);
  if (caller.customClaims?.role !== 'admin' || caller.customClaims?.adminTier !== 'super') {
    permissionDenied('Only super admins can change roles.');
  }

  const parsed = SetRoleSchema.safeParse(req.data);
  if (!parsed.success) badRequest('Invalid input.');

  await admin.auth().setCustomUserClaims(parsed.data.targetUid, {
    role: parsed.data.role,
    adminTier: parsed.data.adminTier,
  });

  await admin.firestore().doc(`users/${parsed.data.targetUid}`).update({
    role: parsed.data.role,
    adminTier: parsed.data.adminTier ?? null,
    updatedAt: Date.now(),
  });

  return { success: true };
});
