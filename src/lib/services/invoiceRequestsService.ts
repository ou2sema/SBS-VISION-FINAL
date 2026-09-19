import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../firebase/config';

export type InvoiceRequestStatus = 'PENDING' | 'PROCESSED';
export type InvoiceRequestType = 'COPY' | 'MODIFICATION' | 'ATTESTATION' | 'OTHER';
export type QuoteEligibility = 'VALID' | 'IN_PROGRESS' | 'CANCELLED' | 'NOT_FOUND';

export interface InvoiceRequest {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  invoiceNumber?: string;
  requestType: InvoiceRequestType;
  notes?: string;
  status: InvoiceRequestStatus;
  createdAt: string;
}

export interface NewInvoiceRequest {
  name: string;
  company?: string;
  email?: string;
  phone: string;
  invoiceNumber?: string;
  requestType: InvoiceRequestType;
  notes?: string;
}

export async function createInvoiceRequest(request: NewInvoiceRequest): Promise<string> {
  const createdAt = new Date().toISOString();
  const payload = Object.fromEntries(
    Object.entries(request).filter(([, value]) => value !== undefined && value !== '')
  );
  const document = await addDoc(collection(getFirebaseFirestore(), 'invoiceRequests'), {
    ...payload,
    status: 'PENDING',
    createdAt,
  });
  return document.id;
}

export async function checkQuoteEligibility(quoteNumber: string): Promise<QuoteEligibility> {
  const normalized = quoteNumber.trim().toUpperCase();
  if (!normalized) return 'NOT_FOUND';

  try {
    const snapshot = await getDoc(doc(getFirebaseFirestore(), 'quoteRequests', normalized));
    if (!snapshot.exists()) return 'NOT_FOUND';
    const status = snapshot.data().status;
    if (status === 'LOST') return 'CANCELLED';
    if (status === 'QUOTED' || status === 'WON') return 'VALID';
    return 'IN_PROGRESS';
  } catch (error) {
    console.warn('Could not validate quote reference:', error);
    return 'NOT_FOUND';
  }
}

export function subscribeToInvoiceRequests(
  onUpdate: (requests: InvoiceRequest[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const requestsQuery = query(
      collection(getFirebaseFirestore(), 'invoiceRequests'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(
      requestsQuery,
      (snapshot) => {
        onUpdate(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          })) as InvoiceRequest[]
        );
      },
      (error) => onError?.(error)
    );
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
    return () => undefined;
  }
}

export async function updateInvoiceRequestStatus(
  requestId: string,
  status: InvoiceRequestStatus
): Promise<void> {
  await updateDoc(doc(getFirebaseFirestore(), 'invoiceRequests', requestId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}
