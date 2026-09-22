export type Locale = 'fr' | 'ar';

declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options?: any) => any;
        Animation: {
          DROP: any;
          BOUNCE: any;
        };
        LatLng: new (lat: number, lng: number) => any;
      };
    };
  }
}

export type QuoteStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'ASSESSMENT'
  | 'QUOTATION_PREPARATION'
  | 'QUOTED'
  | 'WON'
  | 'LOST';

export type InvoiceRequestStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'NEEDS_INFORMATION'
  | 'PROCESSED'
  | 'CLOSED';

export type ProductLifecycleStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ARCHIVED';

export type ProductSelectionType =
  | 'CUSTOMER_SELECTED'
  | 'SYSTEM_RECOMMENDED'
  | 'ADMIN_SELECTED';

export type ServiceType =
  | 'cctv'
  | 'alarm'
  | 'access_control'
  | 'intercom'
  | 'networking'
  | 'installation_maintenance'
  | 'complete_solution'
  | 'need_advice';

export type PropertyEnvironment =
  | 'house'
  | 'apartment'
  | 'retail'
  | 'office'
  | 'enterprise'
  | 'warehouse'
  | 'building'
  | 'other';

export interface ProductSnapshot {
  productId: string;
  nameSnapshot: string;
  brandSnapshot?: string;
  modelSnapshot?: string;
  quantity: number;
  selectionType: ProductSelectionType;
}

export interface QuoteCustomer {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
}

export interface ProjectRequirements {
  environment: PropertyEnvironment;
  services: ServiceType[];
  description?: string;
  cameraCount?: string;
  indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
  remoteViewing?: boolean;
  accessControl?: boolean;
  alarm?: boolean;
  networkingNeeded?: boolean;
  propertySize?: string;
  preferences?: string;
}

export interface QuoteRequest {
  id: string;
  customer: QuoteCustomer;
  project: ProjectRequirements;
  services: ServiceType[];
  selectedProducts: ProductSnapshot[];
  attachments?: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  notes?: string;
  language: Locale;
  source?: string;
  status: QuoteStatus;
  assignedTo?: string;
  internalNotes?: string;
  quoteNumber?: string;
  devis?: DevisData;
  pdf?: QuotePdf;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProductSuggestion {
  productId: string;
  name: string;
  brand?: string;
  model?: string;
  category: string;
  technicalHighlights?: string[];
  imageUrl?: string;
}

export interface InternalProduct {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category: string;
  subcategory?: string;
  technicalSpecifications?: Record<string, string>;
  images?: string[];
  source?: string;
  sourceProductId?: string;
  internalPurchasePrice?: number;
  internalSellingPrice?: number;
  availability?: 'IN_STOCK' | 'ON_ORDER' | 'OUT_OF_STOCK';
  stockStatus?: string;
  active: boolean;
  lifecycleStatus: ProductLifecycleStatus;
  serviceTags?: string[];
  searchKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ImportStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED';

export interface ProductImport {
  id: string;
  source: string;
  startedAt: string;
  completedAt?: string;
  status: ImportStatus;
  totalRecords: number;
  created: number;
  updated: number;
  duplicates: number;
  errors: number;
  adminUserId?: string;
  errorLog?: string[];
}

export interface AdminActivity {
  id: string;
  userId: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  previousValue?: unknown;
  newValue?: unknown;
}

export interface AdminProfile {
  id: string;
  uid: string;
  email: string;
  role: 'admin' | 'staff';
  displayName?: string;
  provider?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DevisItem {
  id: string;
  reference: string;
  designation: string;
  brand: string;
  quantity: number;
  unitPriceHT: number;
  totalHT: number;
}

export interface DevisData {
  quoteNumber: string;
  date: string;
  validityDays: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCompany?: string;
  projectType?: string;
  items: DevisItem[];
  subtotalHT: number;
  discountPercent?: number;
  discountAmount?: number;
  netHT: number;
  tvaRate: number; // e.g. 19
  tvaAmount: number;
  timbreFiscal: number; // e.g. 1.000 DT
  totalTTC: number;
  paymentTerms?: string;
  notes?: string;
}

export interface QuotePdf {
  storagePath: string;
  downloadUrl: string;
  generatedAt: Timestamp;
}
import type { Timestamp } from 'firebase/firestore';

