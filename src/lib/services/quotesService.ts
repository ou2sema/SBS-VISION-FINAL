import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/error';
import { QuoteRequest, QuoteStatus } from '../../types';

const STORAGE_KEY = 'sbs_quotes_history';

// Sample seed quotes for first-time admin launch
const DEMO_SEED_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-seed-1',
    customer: {
      name: 'Boutique Mode Élégance (M. Karim Ben Salah)',
      phone: '+216 98 420 115',
      email: 'contact@mode-elegance.tn',
      company: 'SARL Mode Élégance',
      city: 'Tunis (Lac 2)',
    },
    project: {
      environment: 'retail',
      services: ['cctv', 'alarm'],
      description: 'Sécurisation magasin de prêt-à-porter de 180m². Besoin de 4 caméras dômes sur les caisses et rayons + système d\'alarme avec notification smartphone.',
      indoorOutdoor: 'indoor',
      remoteViewing: true,
      accessControl: false,
      alarm: true,
      cameraCount: '4-6',
    },
    services: ['cctv', 'alarm'],
    selectedProducts: [
      {
        productId: 'prod-ds-2cd2347g2-lu',
        nameSnapshot: 'Hikvision ColorVu 4MP Tourelle IP (DS-2CD2347G2-LU)',
        quantity: 4,
        selectionType: 'ADMIN_SELECTED',
      },
      {
        productId: 'prod-ds-7608nxi-k2-8p',
        nameSnapshot: 'NVR 8 Voies PoE 4K AcuSense Hikvision',
        quantity: 1,
        selectionType: 'ADMIN_SELECTED',
      },
      {
        productId: 'prod-wd-purple-4tb',
        nameSnapshot: 'Disque Dur Western Digital Purple 4TB',
        quantity: 1,
        selectionType: 'ADMIN_SELECTED',
      },
    ],
    notes: 'Installation demandée avant la réouverture prévue fin de mois.',
    internalNotes: 'Client contacté par téléphone le 18/03. Visite technique planifiée demain à 10h pour métrage câbles.',
    language: 'fr',
    status: 'CONTACTED',
    assignedTo: 'Ing. Mohamed (Tech 1)',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-seed-2',
    customer: {
      name: 'Dépôt Logistique Maghreb Frigo',
      phone: '+216 22 550 890',
      email: 'direction@maghreb-frigo.com',
      company: 'Maghreb Frigo Logistique',
      city: 'Sfax (Zone Industrielle Thyna)',
    },
    project: {
      environment: 'warehouse',
      services: ['cctv', 'access_control', 'networking'],
      description: 'Grand entrepôt logistique frigorifique (2500m²) et cour extérieure pour camions. Besoin de surveillance périmétrique extérieure longue portée et contrôle d\'accès pointeuse pour 40 ouvriers.',
      indoorOutdoor: 'both',
      remoteViewing: true,
      accessControl: true,
      alarm: false,
      cameraCount: '8-12',
    },
    services: ['cctv', 'access_control', 'networking'],
    selectedProducts: [],
    notes: 'Priorité absolue sur la vision nocturne dans la cour de chargement.',
    internalNotes: 'Nouveau devis reçu via le site web. À appeler d\'urgence.',
    language: 'fr',
    status: 'NEW',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-seed-3',
    customer: {
      name: 'Cabinet Médical Dr. Amine Trabelsi',
      phone: '+216 50 112 334',
      email: 'dr.trabelsi@gmail.com',
      city: 'Sousse (Kantaoui)',
    },
    project: {
      environment: 'office',
      services: ['intercom', 'access_control', 'cctv'],
      description: 'Cabinet de 4 praticiens. Contrôle de porte d\'entrée avec visiophone IP et ouverture à distance par les secrétaires. 2 caméras d\'accueil.',
      indoorOutdoor: 'indoor',
      remoteViewing: true,
      accessControl: true,
      alarm: false,
    },
    services: ['intercom', 'access_control', 'cctv'],
    selectedProducts: [],
    notes: 'Cherche du matériel sobre et silencieux.',
    internalNotes: 'Devis envoyé par email (Réf: DEV-2026-088). En attente de signature.',
    language: 'fr',
    status: 'QUOTED',
    assignedTo: 'Amira (Commercial)',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getLocalQuotes(): QuoteRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SEED_QUOTES));
      return DEMO_SEED_QUOTES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SEED_QUOTES));
      return DEMO_SEED_QUOTES;
    }
    return parsed;
  } catch {
    return DEMO_SEED_QUOTES;
  }
}

export function saveLocalQuotes(quotes: QuoteRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save quotes locally', err);
  }
}

export async function fetchAllQuotes(): Promise<QuoteRequest[]> {
  try {
    const db = getFirebaseFirestore();
    const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const firestoreQuotes = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as QuoteRequest[];

      // Merge with local fallback without duplicates
      const local = getLocalQuotes();
      const firestoreIds = new Set(firestoreQuotes.map((q) => q.id));
      const merged = [...firestoreQuotes, ...local.filter((l) => !firestoreIds.has(l.id))];
      saveLocalQuotes(merged);
      return merged;
    }
  } catch {
    // Firestore in locked mode or network offline, using persistent local fallback
  }
  return getLocalQuotes();
}

export async function updateQuoteStatus(
  quoteId: string,
  newStatus: QuoteStatus,
  internalNotes?: string,
  assignedTo?: string
): Promise<void> {
  const localQuotes = getLocalQuotes();
  const updated = localQuotes.map((q) => {
    if (q.id === quoteId) {
      return {
        ...q,
        status: newStatus,
        internalNotes: internalNotes !== undefined ? internalNotes : q.internalNotes,
        assignedTo: assignedTo !== undefined ? assignedTo : q.assignedTo,
        updatedAt: new Date().toISOString(),
      };
    }
    return q;
  });
  saveLocalQuotes(updated);

  try {
    const db = getFirebaseFirestore();
    const ref = doc(db, 'quoteRequests', quoteId);
    const payload: Record<string, unknown> = {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    if (internalNotes !== undefined) payload.internalNotes = internalNotes;
    if (assignedTo !== undefined) payload.assignedTo = assignedTo;

    await updateDoc(ref, payload);
  } catch (err) {
    // Local update is already preserved
    console.warn('Could not update Firestore document directly (check rules/offline):', err);
  }
}

export function listenToQuotes(
  onUpdate: (quotes: QuoteRequest[]) => void
): () => void {
  try {
    const db = getFirebaseFirestore();
    const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const quotes = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as QuoteRequest[];
          
          const local = getLocalQuotes();
          const firestoreIds = new Set(quotes.map((q) => q.id));
          const merged = [...quotes, ...local.filter((l) => !firestoreIds.has(l.id))];
          saveLocalQuotes(merged);
          onUpdate(merged);
        } else {
          onUpdate(getLocalQuotes());
        }
      },
      () => {
        // Fallback to local on rules denial or error
        onUpdate(getLocalQuotes());
      }
    );

    return unsubscribe;
  } catch {
    onUpdate(getLocalQuotes());
    return () => {};
  }
}
