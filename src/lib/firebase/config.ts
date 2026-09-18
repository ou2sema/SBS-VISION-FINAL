import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// SBS VISION Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7PKJK0b6AWtyWKd-ee2Cmky5SWvT09CE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sbs-vision-fc4d6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sbs-vision-fc4d6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sbs-vision-fc4d6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "184915416224",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:184915416224:web:3f61d51660ae828feba5c5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6FSFHKPNM3",
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let analyticsInstance: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }
  return firestoreInstance;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp());
  }
  return storageInstance;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (!analyticsInstance) {
    try {
      const supported = await isSupported();
      if (supported) {
        analyticsInstance = getAnalytics(getFirebaseApp());
      }
    } catch {
      // Analytics not supported in this environment
    }
  }
  return analyticsInstance;
}

export const isConfigured = true;
