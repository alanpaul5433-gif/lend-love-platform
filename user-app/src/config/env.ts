import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

/**
 * Demo mode = mock all paid integrations (Paykings, ID Analyzer, etc.)
 * so the app is fully demoable on the Firebase Spark (free) plan.
 *
 * Flip to `false` once Blaze is enabled and client has approved go-live.
 */
export const DEMO_MODE = extra.demoMode !== false;

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCP7tBukcECV5wJjyIN0ws4WUv9JJEJBJQ',
  authDomain: 'lend-love.firebaseapp.com',
  projectId: 'lend-love',
  storageBucket: 'lend-love.firebasestorage.app',
  messagingSenderId: '523440774704',
  appId: '1:523440774704:web:91b5bf75348ec84e5e97f5',
  measurementId: 'G-33CPMMF8Z6',
};
