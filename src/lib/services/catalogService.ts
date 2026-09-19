import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { InternalProduct } from '../../types';
import { INITIAL_INTERNAL_PRODUCTS } from '../data/internalProducts';
import { SSC_INITIAL_PRODUCTS } from '../data/sscProducts';
import { getFirebaseFirestore } from '../firebase/config';

const STORAGE_KEY = 'sbs_internal_products';

export function getLocalInternalProducts(): InternalProduct[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Use the built-in catalog when local storage is unavailable.
  }
  return INITIAL_INTERNAL_PRODUCTS;
}

export function saveLocalInternalProducts(products: InternalProduct[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // The Firestore copy remains the durable source when local storage fails.
  }
}

export function subscribeToInternalProducts(
  onUpdate: (products: InternalProduct[]) => void
): () => void {
  const fallback = getLocalInternalProducts();
  try {
    const productsQuery = query(collection(getFirebaseFirestore(), 'products'), orderBy('updatedAt', 'desc'));
    return onSnapshot(
      productsQuery,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(fallback);
          return;
        }
        const productsById = new Map<string, InternalProduct>();
        [...INITIAL_INTERNAL_PRODUCTS, ...fallback].forEach((product) => {
          productsById.set(product.id, product);
        });
        snapshot.docs.forEach((item) => {
          const product = item.data() as InternalProduct;
          productsById.set(product.id, product);
        });
        const products = Array.from(productsById.values());
        saveLocalInternalProducts(products);
        onUpdate(products);
      },
      () => onUpdate(fallback)
    );
  } catch {
    onUpdate(fallback);
    return () => undefined;
  }
}

export async function saveInternalProduct(product: InternalProduct): Promise<void> {
  const products = getLocalInternalProducts().filter((item) => item.id !== product.id);
  saveLocalInternalProducts([product, ...products]);

  try {
    await setDoc(doc(getFirebaseFirestore(), 'products', product.id), product, { merge: true });
  } catch (error) {
    console.warn('Product saved locally; Firestore sync failed:', error);
  }
}

export async function importSscProducts(): Promise<number> {
  const existing = getLocalInternalProducts();
  const existingIds = new Set(existing.map((product) => product.id));
  const imported = SSC_INITIAL_PRODUCTS.filter((product) => !existingIds.has(product.id));
  saveLocalInternalProducts([...imported, ...existing]);

  try {
    const database = getFirebaseFirestore();
    await Promise.all(
      imported.map((product) =>
        setDoc(doc(database, 'products', product.id), product, { merge: true })
      )
    );
  } catch (error) {
    console.warn('SSC products saved locally; Firestore import failed:', error);
  }

  return imported.length;
}
