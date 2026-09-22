import React, { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Phone, CheckCircle2, MapPin } from 'lucide-react';
import { GoogleMap } from '../ui/GoogleMap';

export function ContactView() {
  const { t, locale } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div className="space-y-3 text-center sm:text-start">
        <Badge variant="accent">{t('nav.contact')}</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
          {locale === 'ar' ? 'تواصل مع فريق SBS VISION' : 'Contactez SBS VISION'}
        </h1>
        <p className="text-[#9CA3AF] text-sm leading-relaxed">
          {locale === 'ar'
            ? 'لأي استشارة فنية، طلب دراسة موقع أو معلومات إضافية، نحن في خدمتكم مباشرة.'
            : 'Pour toute étude sur site, conseil technique ou demande de renseignement, contactez directement nos spécialistes.'}
        </p>
      </div>

      {/* Contact Info & Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Direct Phone Card */}
        <Card className="p-6 md:col-span-1 space-y-4 bg-[#101318] border border-[#232934] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#E11D2A]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'الاتصال المباشر' : 'Ligne Directe'}
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {locale === 'ar'
                  ? 'متاح للمكالمات والاستفسارات الفنية'
                  : 'Assistance et conseil téléphonique'}
              </p>
            </div>
            <a
              href="tel:+21654306506"
              className="inline-flex items-center gap-2 text-base font-bold text-[#E11D2A] hover:underline"
              dir="ltr"
            >
              +216 54 306 506
            </a>
          </div>

          <div className="p-3 rounded-lg bg-[#08090C] border border-[#232934] text-[11px] text-[#9CA3AF]">
            <p>{locale === 'ar' ? 'تونس — خدمات لكافة المدن والمناطق' : 'Tunisie — Interventions professionnelles'}</p>
          </div>
        </Card>

        {/* Contact Form */}
        <Card className="p-6 md:col-span-2">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'تم استلام رسالتكم بنجاح' : 'Message reçu avec succès'}
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
                {locale === 'ar'
                  ? 'شكراً لتواصلكم مع SBS VISION. سيتصل بكم أحد خبرائنا قريباً.'
                  : 'Merci d\'avoir contacté SBS VISION. Notre équipe reviendra vers vous rapidement.'}
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                {locale === 'ar' ? 'إرسال رسالة أخرى' : 'Envoyer un autre message'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={locale === 'ar' ? 'الاسم الكامل أو اسم المؤسسة *' : 'Nom complet ou Société *'}
                placeholder={locale === 'ar' ? 'محمد بن سالم' : 'Ex: Société ABC'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label={locale === 'ar' ? 'رقم الهاتف للتواصل *' : 'Téléphone *'}
                placeholder="+216 XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                dir="ltr"
              />

              <Textarea
                label={locale === 'ar' ? 'رسالتكم أو تفاصيل المشروع' : 'Votre message ou besoin'}
                placeholder={locale === 'ar' ? 'أود الاستفسار حول...' : 'Détaillez votre projet de sécurité...'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />

              <Button variant="primary" size="md" className="w-full" type="submit">
                {t('common.submit')}
              </Button>
            </form>
          )}
        </Card>
      </div>

      {/* Google Maps Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#E11D2A]" />
          <h2 className="text-xl font-bold text-[#FFFFFF]">
            {locale === 'ar' ? 'موقعنا على الخريطة' : 'Notre Localisation'}
          </h2>
        </div>
        <Card className="p-4 bg-[#101318] border border-[#232934] overflow-hidden">
          <GoogleMap 
            latitude={36.8065}
            longitude={10.1815}
            zoom={14}
            markerTitle={locale === 'ar' ? 'مقر شركة SBS VISION - تونس' : 'Siège SBS VISION - Tunis'}
          />
        </Card>
        <p className="text-xs text-[#9CA3AF] text-center">
          {locale === 'ar'
            ? 'توجد مكاتبنا في العاصمة تونس. نتدخل في جميع الولايات التونسية.'
            : 'Nos bureaux sont situés à Tunis. Nous intervenons dans tous les gouvernorats de Tunisie.'}
        </p>
      </div>
    </div>
  );
}
