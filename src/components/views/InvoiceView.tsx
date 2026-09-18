import React, { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { FileText, CheckCircle2 } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
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
                placeholder={locale === 'ar' ? 'مثال: FAC-2026-0123' : 'Ex : FAC-2026-0123'}
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
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

            <Button variant="primary" size="md" className="w-full" type="submit">
              {t('common.submit')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
