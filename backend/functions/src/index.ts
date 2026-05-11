import * as admin from 'firebase-admin';
admin.initializeApp();

// Export grouped functions
export * from './auth/onCreateUser';
export * from './loans/createLoan';
export * from './users/deleteAccount';
export * from './admin/setRole';
