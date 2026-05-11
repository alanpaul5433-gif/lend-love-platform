import { HttpsError } from 'firebase-functions/v2/https';

export function requireAuth(auth: { uid?: string } | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in to perform this action.');
  }
  return auth.uid;
}

export function badRequest(message: string): never {
  throw new HttpsError('invalid-argument', message);
}

export function notFound(message = 'Not found.'): never {
  throw new HttpsError('not-found', message);
}

export function permissionDenied(message = 'Permission denied.'): never {
  throw new HttpsError('permission-denied', message);
}

export function internal(message = 'Internal error.'): never {
  throw new HttpsError('internal', message);
}
