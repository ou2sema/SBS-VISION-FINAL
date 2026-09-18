import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export function PrivacyView() {
  const { locale } = useI18n();

  return (
    <div className="space-y-8 py-6 max-w-3xl mx-auto">
      <div className="space-y-3">
        <Badge variant="neutral">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E11D2A]" />
          {locale === 'ar' ? 'الخصوصية وحماية المعطيات' : 'Confidentialité & Données'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
          {locale === 'ar' ? 'سياسة حماية البيانات الشخصية' : 'Politique de Confidentialité'}
        </h1>
        <p className="text-xs text-[#9CA3AF]">
          {locale === 'ar' ? 'آخر تحديث: 2026' : 'Dernière mise à jour : 2026'}
        </p>
      </div>

      <Card className="p-6 space-y-6 text-sm text-[#9CA3AF] leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#FFFFFF] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E11D2A]" />
            {locale === 'ar' ? '1. جمع البيانات واستخدامها' : '1. Collecte et finalité des données'}
          </h3>
          <p>
            {locale === 'ar'
              ? 'تجمع SBS VISION فقط البيانات الضرورية لدراسة طلبات عروض الأسعار والتواصل التقني بخصوص المشروعات الأمنية (الاسم، رقم الهاتف، طبيعة المنشأة والموقع). لا نقوم ببيع أو مشاركة بياناتكم مع أي طرف ثالث لأغراض دعائية.'
              : 'SBS VISION collecte uniquement les informations nécessaires au traitement de vos demandes de devis et à la réalisation des études techniques (nom, numéro de téléphone, type de site). Ces données ne sont ni vendues ni cédées à des tiers à des fins publicitaires.'}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#FFFFFF] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E11D2A]" />
            {locale === 'ar' ? '2. سرية المخططات والمواقع الأمنية' : '2. Confidentialité des plans et implantations'}
          </h3>
          <p>
            {locale === 'ar'
              ? 'تُعامل كافة المخططات، الصور، وتفاصيل المواقع المرفقة بطلب عرض الأسعار بسرية أمنية تامة ومقصورة حصراً على المهندسين والتقنيين المكلفين بدراسة المنظومة.'
              : 'Tous les plans, photographies et détails techniques transmis dans le cadre d\'une demande de devis sont traités avec la plus stricte confidentialité et réservés exclusivement aux ingénieurs et techniciens habilités.'}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#FFFFFF] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E11D2A]" />
            {locale === 'ar' ? '3. حقوق المعنيين بالبيانات في تونس' : '3. Droits d\'accès et réglementation tunisienne'}
          </h3>
          <p>
            {locale === 'ar'
              ? 'يحق لكل حريف أو صاحب طلب مراجعة بياناته أو طلب تعديلها أو حذفها عبر التواصل معنا مباشرة عبر الهاتف +216 54 306 506.'
              : 'Conformément aux principes de protection des données personnelles applicables en Tunisie, vous disposez d\'un droit d\'accès, de modification ou de suppression de vos données sur simple demande téléphonique au +216 54 306 506.'}
          </p>
        </div>
      </Card>
    </div>
  );
}
