import { initializeApp, getApps, getApp } from 'firebase/app';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const authModule = require('firebase/auth') as typeof import('firebase/auth') & {
  getReactNativePersistence?: (storage: unknown) => unknown;
  initializeAuth?: (app: ReturnType<typeof initializeApp>, opts?: { persistence: unknown }) => ReturnType<typeof import('firebase/auth').getAuth>;
};
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_CONFIG } from '../config/env';

const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);

export const auth = (() => {
  try {
    if (authModule.initializeAuth && authModule.getReactNativePersistence) {
      return authModule.initializeAuth(app, {
        persistence: authModule.getReactNativePersistence(AsyncStorage),
      });
    }
    return authModule.getAuth(app);
  } catch {
    return authModule.getAuth(app);
  }
})();

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
