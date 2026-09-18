import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/error';
import { AdminProfile, QuoteRequest } from '../../types';
import { getLocalQuotes, saveLocalQuotes } from './quotesService';

export const BOOTSTRAP_ADMIN_EMAILS = [
  'ou2sema@gmail.com',
  'admin@sbsvision.tn',
];

/**
 * Checks if given email is an authorized administrator email
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return (
    BOOTSTRAP_ADMIN_EMAILS.includes(lower) ||
    lower.endsWith('@sbsvision.tn')
  );
}

/**
 * Ensures administrator document exists in Firestore 'admins' collection
 */
export async function syncAdminProfileToFirestore(user: User): Promise<AdminProfile> {
  const db = getFirebaseFirestore();
  const adminDocRef = doc(db, 'admins', user.uid);
  const now = new Date().toISOString();

  let existingData: Partial<AdminProfile> | null = null;
  try {
    const snap = await getDoc(adminDocRef);
    if (snap.exists()) {
      existingData = snap.data() as AdminProfile;
    }
  } catch {
    // If not readable yet or collection not initiated
  }

  const role: 'admin' | 'staff' = isAuthorizedAdminEmail(user.email) ? 'admin' : 'staff';

  const profile: AdminProfile = {
    id: user.uid,
    uid: user.uid,
    email: user.email || 'unknown@sbsvision.tn',
    role: existingData?.role || role,
    displayName: user.displayName || user.email?.split('@')[0] || 'Administrateur SBS',
    provider: user.providerData?.[0]?.providerId || 'password',
    lastLogin: now,
    createdAt: existingData?.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(adminDocRef, profile, { merge: true });
  } catch (err) {
    console.warn('Notice: Could not write admin doc directly (check rules if non-admin email):', err);
  }

  return profile;
}

/**
 * Fetches admin profile from Firestore
 */
export async function fetchAdminProfile(uid: string): Promise<AdminProfile | null> {
  try {
    const db = getFirebaseFirestore();
    const snap = await getDoc(doc(db, 'admins', uid));
    if (snap.exists()) {
      return snap.data() as AdminProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `admins/${uid}`);
  }
  return null;
}

/**
 * Real Firebase Auth state listener
 */
export function subscribeToAdminAuth(
  callback: (user: User | null, profile: AdminProfile | null) => void
): () => void {
  try {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        callback(null, null);
        return;
      }

      // Check / Create admin document in Firestore
      try {
        const profile = await syncAdminProfileToFirestore(user);
        callback(user, profile);
      } catch {
        // Fallback profile if Firestore permission fails
        const fallbackProfile: AdminProfile = {
          id: user.uid,
          uid: user.uid,
          email: user.email || '',
          role: isAuthorizedAdminEmail(user.email) ? 'admin' : 'staff',
          displayName: user.displayName || user.email?.split('@')[0] || 'Staff SBS',
          provider: user.providerData?.[0]?.providerId || 'password',
          lastLogin: new Date().toISOString(),
        };
        callback(user, fallbackProfile);
      }
    });
  } catch {
    return () => {};
  }
}

/**
 * Sign in admin with Email & Password
 */
export async function signInAdminWithEmail(email: string, pass: string): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  await syncAdminProfileToFirestore(cred.user);
  return cred.user;
}

/**
 * Create new admin account with Email & Password
 */
export async function registerAdminWithEmail(email: string, pass: string): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  await syncAdminProfileToFirestore(cred.user);
  return cred.user;
}

/**
 * Sign in admin with Google Popup
 */
export async function signInAdminWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  await syncAdminProfileToFirestore(cred.user);
  return cred.user;
}

/**
 * Sign out admin
 */
export async function signOutAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sbs_admin_auth');
    localStorage.removeItem('sbs_admin_user');
  }
}

/**
 * Syncs local quotes to Firestore collection 'quoteRequests'
 * This ensures the user can immediately see real records in their Firebase Console!
 */
export async function pushQuotesToFirestore(): Promise<{
  pushedCount: number;
  totalQuotes: number;
}> {
  const db = getFirebaseFirestore();
  const localQuotes = getLocalQuotes();

  if (localQuotes.length === 0) {
    return { pushedCount: 0, totalQuotes: 0 };
  }

  const batch = writeBatch(db);
  let pushedCount = 0;

  for (const q of localQuotes) {
    const docId = q.id;
    const docRef = doc(db, 'quoteRequests', docId);
    batch.set(docRef, {
      ...q,
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    pushedCount++;
  }

  await batch.commit();

  // Refresh and verify count from Firestore
  try {
    const snap = await getDocs(collection(db, 'quoteRequests'));
    const firestoreQuotes = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as QuoteRequest[];
    saveLocalQuotes(firestoreQuotes);
  } catch {
    // Keep local quotes
  }

  return { pushedCount, totalQuotes: localQuotes.length };
}
