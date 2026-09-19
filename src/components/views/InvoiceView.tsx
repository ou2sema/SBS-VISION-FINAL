import React, { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { FileText, CheckCircle2 } from 'lucide-react';
import {
  checkQuoteEligibility,
  createInvoiceRequest,
  type InvoiceRequestType,
} from '../../lib/services/invoiceRequestsService';

export function InvoiceView() {
  const { t, locale } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    invoiceNumber: '',
    requestType: 'copy',
    message: '',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteStatusMessage, setQuoteStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setQuoteStatusMessage(null);
    try {
      if (!formData.invoiceNumber.trim()) {
        setQuoteStatusMessage(
          locale === 'ar'
            ? 'رقم عرض السعر مطلوب لإرسال طلب الفاتورة.'
            : 'Le numéro du devis est obligatoire pour demander une facture.'
        );
        return;
      }

      const quoteEligibility = await checkQuoteEligibility(formData.invoiceNumber);
      if (quoteEligibility !== 'VALID') {
        setQuoteStatusMessage(
          quoteEligibility === 'CANCELLED'
            ? locale === 'ar'
              ? 'هذا العرض ملغى ولا يمكن إصدار فاتورة له.'
              : 'Ce devis est annulé. Une facture ne peut pas être demandée.'
            : quoteEligibility === 'IN_PROGRESS'
              ? locale === 'ar'
                ? 'هذا العرض مازال قيد المعالجة. انتظر إرساله أو إغلاقه قبل طلب الفاتورة.'
                : 'Ce devis est encore en cours de traitement. Attendez sa transmission ou sa clôture avant de demander la facture.'
              : locale === 'ar'
                ? 'رقم عرض السعر غير موجود. تحقق من المرجع indiqué sur votre devis.'
                : 'Numéro de devis introuvable. Vérifiez la référence indiquée sur votre devis.'
        );
        return;
      }

      await createInvoiceRequest({
        name: formData.name.trim(),
        company: formData.company.trim() || undefined,
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        quoteNumber: formData.invoiceNumber.trim(),
        requestType: {
          copy: 'COPY',
          correction: 'MODIFICATION',
          statement: 'ATTESTATION',
          other: 'OTHER',
        }[formData.requestType] as InvoiceRequestType,
        notes: formData.message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Could not submit invoice request:', error);
      setSubmitError(
        locale === 'ar'
          ? 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.'
          : 'Impossible d’envoyer la demande. Vérifiez votre connexion puis réessayez.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-2xl mx-auto">
      <div className="space-y-3 text-center sm:text-start">
        <Badge variant="neutral">
          <FileText className="w-3.5 h-3.5 text-[#E11D2A]" />
          {t('nav.requestInvoice')}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
          {locale === 'ar' ? 'طلب نسخة فاتورة أو تسوية حساب' : 'Demande de Facture ou Régularisation'}
        </h1>
        <p className="text-[#9CA3AF] text-sm leading-relaxed">
          {locale === 'ar'
            ? 'للحصول على نسخة من فاتورة سابقة أو تعديل بيانات التفوير لشركتكم، يرجى ملء النموذج أدناه.'
            : 'Pour obtenir un duplicata de facture, une attestation ou modifier vos coordonnées de facturation, renseignez les informations ci-dessous.'}
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">
              {locale === 'ar' ? 'تم استلام طلبكم بنجاح' : 'Demande administrative enregistrée'}
            </h3>
            <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
              {locale === 'ar'
                ? 'سيقوم القسم الإداري بمعالجة طلبكم وإرسال الوثيقة عبر البريد الإلكتروني أو التواصل معكم هاتفياً.'
                : 'Notre service administratif traite votre demande et vous transmettra le document par email ou prendra contact par téléphone.'}
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                {locale === 'ar' ? 'طلب جديد' : 'Nouvelle demande'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {quoteStatusMessage && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                {quoteStatusMessage}
              </div>
            )}
            {submitError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={locale === 'ar' ? 'الاسم واللقب *' : 'Nom du contact *'}
                placeholder={locale === 'ar' ? 'أحمد التونسي' : 'Nom Prénom'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label={locale === 'ar' ? 'اسم الشركة / المؤسسة' : 'Raison sociale / Société'}
                placeholder="Société XYZ"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />

              <Input
                label={locale === 'ar' ? 'رقم الهاتف للتواصل *' : 'Téléphone *'}
                placeholder="+216 XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                dir="ltr"
              />

              <Input
                label={locale === 'ar' ? 'البريد الإلكتروني' : 'Email de réception'}
                placeholder="compta@entreprise.tn"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={locale === 'ar' ? 'رقم الفاتورة أو مرجع المشروع' : 'Numéro de facture ou référence devis'}
                placeholder={locale === 'ar' ? 'مثال: SBS-2026-5434' : 'Ex : SBS-2026-5434'}
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
                dir="ltr"
              />

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-[#FFFFFF]/90">
                  {locale === 'ar' ? 'نوع الطلب' : 'Objet de la demande'}
                </label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="w-full bg-[#08090C] text-[#FFFFFF] border border-[#232934] rounded-lg px-3.5 py-2.5 text-sm focus:border-[#E11D2A] focus:ring-1 focus:ring-[#E11D2A] focus:outline-none"
                >
                  <option value="copy">{locale === 'ar' ? 'طلب نسخة من الفاتورة' : 'Duplicata de facture'}</option>
                  <option value="correction">{locale === 'ar' ? 'تعديل بيانات الشركة أو المعرف الجبائي' : 'Rectification coordonnées / Matricule fiscal'}</option>
                  <option value="statement">{locale === 'ar' ? 'كشف حساب أو إبراء ذمة' : 'Relevé de compte / Quittance'}</option>
                  <option value="other">{locale === 'ar' ? 'طلب إداري آخر' : 'Autre demande'}</option>
                </select>
              </div>
            </div>

            <Textarea
              label={locale === 'ar' ? 'توضيحات إضافية' : 'Précisions supplémentaires'}
              placeholder={locale === 'ar' ? 'توضيح تاريخ العملية أو أية تفاصيل أخرى...' : 'Précisez la date approximative ou les détails utiles...'}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />

            <Button variant="primary" size="md" className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Envoi en cours...') : t('common.submit')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
