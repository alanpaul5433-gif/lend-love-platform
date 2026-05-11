import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCP7tBukcECV5wJjyIN0ws4WUv9JJEJBJQ',
  authDomain: 'lend-love.firebaseapp.com',
  projectId: 'lend-love',
  storageBucket: 'lend-love.firebasestorage.app',
  messagingSenderId: '523440774704',
  appId: '1:523440774704:web:91b5bf75348ec84e5e97f5',
  measurementId: 'G-33CPMMF8Z6',
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getApp_() {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
  return _app;
}

export function auth() {
  if (!_auth) _auth = getAuth(getApp_());
  return _auth;
}

export function db() {
  if (!_db) _db = getFirestore(getApp_());
  return _db;
}

export function storage() {
  if (!_storage) _storage = getStorage(getApp_());
  return _storage;
}
