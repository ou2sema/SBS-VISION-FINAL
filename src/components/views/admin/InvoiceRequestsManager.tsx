import { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { FileText, Calendar, Phone, Mail, CheckCircle2, Clock, Search } from 'lucide-react';

interface InvoiceRequest {
  id: string;
  name: string;
  email?: string;
  phone: string;
  invoiceNumber?: string;
  requestType: 'COPY' | 'MODIFICATION' | 'ATTESTATION' | 'OTHER';
  notes?: string;
  status: 'PENDING' | 'PROCESSED';
  createdAt: string;
}

const DEMO_INVOICE_REQUESTS: InvoiceRequest[] = [
  {
    id: 'inv-req-1',
    name: 'Société Carthage Distribution',
    email: 'compta@carthage-distrib.tn',
    phone: '+216 71 889 001',
    invoiceNumber: 'FAC-2026-0042',
    requestType: 'COPY',
    notes: 'Besoin d\'un duplicata tamponné pour la clôture du bilan comptable.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'inv-req-2',
    name: 'Clinique Internationale El Manar',
    email: 'admin@clinique-elmanar.tn',
    phone: '+216 71 500 220',
    invoiceNumber: 'FAC-2025-0198',
    requestType: 'ATTESTATION',
    notes: 'Attestation de garantie décennale et conformité des caméras dômes.',
    status: 'PROCESSED',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

interface InvoiceRequestsManagerProps {
  locale: string;
}

export function InvoiceRequestsManager({ locale }: InvoiceRequestsManagerProps) {
  const [requests, setRequests] = useState<InvoiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_invoice_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEMO_INVOICE_REQUESTS;
  });

  const [search, setSearch] = useState('');

  const toggleStatus = (id: string) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === 'PENDING' ? ('PROCESSED' as const) : ('PENDING' as const),
        };
      }
      return r;
    });
    setRequests(updated);
    try {
      localStorage.setItem('sbs_invoice_requests', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filtered = requests.filter((r) => {
    if (!r) return false;
    const s = (search || '').toLowerCase().trim();
    if (!s) return true;
    return (
      String(r.name || '').toLowerCase().includes(s) ||
      String(r.phone || '').includes(s) ||
      (Boolean(r.invoiceNumber) && String(r.invoiceNumber).toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'بحث باسم العميل أو رقم الفاتورة...' : 'Recherche nom, téléphone ou numéro de facture...'}
            className="w-full pl-9 pr-4 py-2 bg-[#101318] border border-[#232934] rounded-lg text-xs sm:text-sm text-[#FFFFFF] placeholder-[#6B7280] focus:border-[#E11D2A] focus:outline-none"
          />
        </div>

        <Badge variant="neutral" className="text-xs">
          {requests.filter((r) => r.status === 'PENDING').length} {locale === 'ar' ? 'طلبات قيد المعالجة' : 'en attente de traitement'}
        </Badge>
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <Card key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#E11D2A] bg-[#E11D2A]/10 px-2 py-0.5 rounded border border-[#E11D2A]/20">
                  {req.invoiceNumber || 'Facture non spécifiée'}
                </span>
                <h4 className="text-sm font-bold text-[#FFFFFF]">{req.name}</h4>
                <Badge variant={req.status === 'PROCESSED' ? 'neutral' : 'accent'} className="text-[10px]">
                  {req.status === 'PROCESSED'
                    ? (locale === 'ar' ? 'تمت المعالجة' : 'Traitée')
                    : (locale === 'ar' ? 'قيد الانتظار' : 'À traiter')}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#9CA3AF]">
                <a href={`tel:${req.phone}`} className="hover:text-[#FFFFFF] flex items-center gap-1 font-medium" dir="ltr">
                  <Phone className="w-3 h-3 text-[#E11D2A]" />
                  {req.phone}
                </a>
                {req.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {req.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>

              {req.notes && (
                <p className="text-xs text-[#9CA3AF] bg-[#08090C] p-2.5 rounded border border-[#232934] italic">
                  "{req.notes}"
                </p>
              )}
            </div>

            <Button
              variant={req.status === 'PROCESSED' ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => toggleStatus(req.id)}
              className="shrink-0 text-xs"
            >
              {req.status === 'PROCESSED'
                ? (locale === 'ar' ? 'وضع كقيد المعالجة' : 'Marquer non traitée')
                : (locale === 'ar' ? 'تأكيد المعالجة والإرسال' : 'Marquer comme traitée')}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
