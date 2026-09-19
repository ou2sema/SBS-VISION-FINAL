import { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { FileText, Calendar, Phone, Mail, CheckCircle2, Clock, Search, Copy } from 'lucide-react';
import {
  getQuoteForInvoice,
  subscribeToInvoiceRequests,
  updateInvoiceRequestStatus,
  type InvoiceRequest,
} from '../../../lib/services/invoiceRequestsService';
import { uploadFacturePDF } from '../../../lib/services/pdfService';

interface InvoiceRequestsManagerProps {
  locale: string;
}

export function InvoiceRequestsManager({ locale }: InvoiceRequestsManagerProps) {
  const [requests, setRequests] = useState<InvoiceRequest[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToInvoiceRequests(
      setRequests,
      (error) => {
        const permissionDenied = error.message.includes('permission-denied');
        setLoadError(
          permissionDenied
            ? locale === 'ar'
              ? 'الوصول مرفوض. سجّل الدخول بحساب Firebase مسؤول أو موظف، وليس بحساب العرض المحلي.'
              : 'Accès refusé. Connectez-vous avec un compte Firebase admin/staff, pas avec la session démo locale.'
            : locale === 'ar'
              ? 'تعذر تحميل الطلبات. تحقق من اتصال Firebase.'
              : 'Impossible de charger les demandes. Vérifiez la connexion Firebase.'
        );
      }
    );
  }, [locale]);

  const [search, setSearch] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const toggleStatus = async (id: string) => {
    const request = requests.find((item) => item.id === id);
    if (!request) return;
    const status = request.status === 'PENDING' ? 'PROCESSED' : 'PENDING';
    try {
      await updateInvoiceRequestStatus(id, status);
    } catch (error) {
      console.error('Could not update invoice request:', error);
      setLoadError(locale === 'ar' ? 'تعذر تحديث الطلب' : 'Impossible de mettre à jour la demande.');
    }
  };

  const handleGenerateInvoice = async (request: InvoiceRequest) => {
    setGeneratingId(request.id);
    setLoadError(null);
    try {
      if (request.invoice?.downloadUrl) {
        window.open(request.invoice.downloadUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      const quoteNumber = request.quoteNumber || request.invoiceNumber || '';
      const quote = await getQuoteForInvoice(quoteNumber);
      if (!quote?.devis) {
        throw new Error('Le devis doit être généré avant de créer la facture.');
      }

      const result = await uploadFacturePDF(request.id, quote.devis);
      window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Could not generate invoice:', error);
      setLoadError(error instanceof Error ? error.message : 'Impossible de générer la facture.');
    } finally {
      setGeneratingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (!r) return false;
    const s = (search || '').toLowerCase().trim();
    if (!s) return true;
    return (
      String(r.name || '').toLowerCase().includes(s) ||
      String(r.phone || '').includes(s) ||
      (Boolean(r.quoteNumber || r.invoiceNumber) &&
        String(r.quoteNumber || r.invoiceNumber).toLowerCase().includes(s))
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
        {loadError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {loadError}
          </div>
        )}
        {filtered.map((req) => (
          <Card key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#E11D2A] bg-[#E11D2A]/10 px-2 py-0.5 rounded border border-[#E11D2A]/20">
                  {req.quoteNumber || req.invoiceNumber || 'Référence devis non spécifiée'}
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
              variant="secondary"
              size="sm"
              onClick={() => handleGenerateInvoice(req)}
              disabled={generatingId === req.id}
              className="shrink-0 text-xs"
              leftIcon={req.invoice?.downloadUrl ? <Copy className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            >
              {generatingId === req.id
                ? 'Génération...'
                : req.invoice?.downloadUrl
                  ? 'Générer un duplicata'
                  : 'Générer une facture'}
            </Button>

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
        {!loadError && filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-[#9CA3AF]">
            {locale === 'ar'
              ? 'لا توجد طلبات فواتير بعد. أرسل طلباً من نموذج الفواتير لاختبار المسار.'
              : 'Aucune demande de facture. Envoyez-en une depuis le formulaire public pour tester le parcours.'}
          </Card>
        )}
      </div>
    </div>
  );
}
