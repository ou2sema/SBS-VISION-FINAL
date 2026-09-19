import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../firebase/config';

export type InvoiceRequestStatus = 'PENDING' | 'PROCESSED';
export type InvoiceRequestType = 'COPY' | 'MODIFICATION' | 'ATTESTATION' | 'OTHER';

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
  const document = await addDoc(collection(getFirebaseFirestore(), 'invoiceRequests'), {
    ...request,
    status: 'PENDING',
    createdAt,
  });
  return document.id;
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
