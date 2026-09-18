import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from './config';

let emulatorsConnected = false;

export function initFirebaseEmulators() {
  if (emulatorsConnected) return;

  const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';
  if (!useEmulator) return;

  const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';
  const authPort = Number(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || 9099);
  const firestorePort = Number(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT || 8080);
  const storagePort = Number(import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_PORT || 9199);

  try {
    const auth = getFirebaseAuth();
    connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });

    const firestore = getFirebaseFirestore();
    connectFirestoreEmulator(firestore, host, firestorePort);

    const storage = getFirebaseStorage();
    connectStorageEmulator(storage, host, storagePort);

    emulatorsConnected = true;
    console.info('Connected to Firebase Local Emulator Suite');
  } catch (error) {
    console.warn('Firebase Emulator connection skipped or already initialized:', error);
  }
}
