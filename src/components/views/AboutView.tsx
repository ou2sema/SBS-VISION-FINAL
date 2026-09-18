import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Target, Wrench, PhoneCall, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      <div className="space-y-3 text-center sm:text-start">
        <Badge variant="accent">
          {locale === 'ar' ? 'عن الشركة ورؤيتنا' : 'À Propos de SBS VISION'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
          {locale === 'ar' ? 'هندسة الأمان وحلول الحماية المتقدمة' : 'Expertise & Ingénierie en Sécurité Électronique'}
        </h1>
        <p className="text-[#9CA3AF] text-base leading-relaxed">
          {t('brand.subheadline')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
            <Target className="w-5 h-5 text-[#E11D2A]" />
          </div>
          <h3 className="text-base font-bold text-[#FFFFFF]">
            {locale === 'ar' ? 'حلول مصممة حسب الحاجة' : 'Solutions Sur Mesure'}
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {locale === 'ar'
              ? 'نحن لا نبيع أجهزة عشوائية بل نصمم بنية تحتية أمنية متكاملة تتلاءم تماماً مع خصوصيات موقعكم واحتياجاتكم الواقعية.'
              : 'Nous ne vendons pas de simples boîtes, mais concevons des architectures complètes adaptées aux contraintes de votre site.'}
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#E11D2A]" />
          </div>
          <h3 className="text-base font-bold text-[#FFFFFF]">
            {locale === 'ar' ? 'تركيب احترافي مطابق للمعايير' : 'Installation Professionnelle'}
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {locale === 'ar'
              ? 'فرق فنية متخصصة تضمن تمديدات كابلات نظيفة، ضبط زوايا الرؤية بدقة، وتهيئة متقدمة للتسجيل والربط عن بُعد.'
              : 'Équipes techniques formées assurant un câblage propre, un cadrage optique précis et un paramétrage réseau sécurisé.'}
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
            <PhoneCall className="w-5 h-5 text-[#E11D2A]" />
          </div>
          <h3 className="text-base font-bold text-[#FFFFFF]">
            {locale === 'ar' ? 'متابعة ودعم فني مستمر' : 'Support & Maintenance'}
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {locale === 'ar'
              ? 'صيانة دورية وقائية وعلاجية، استجابة سريعة للاستفسارات، وتحديثات مستمرة للأنظمة الأمنية.'
              : 'Accompagnement après installation, assistance réactive et maintenance continue pour garantir la continuité de service.'}
          </p>
        </Card>
      </div>

      <Card className="p-8 bg-[#101318]/90 border border-[#232934] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-start">
          <h3 className="text-lg font-bold text-[#FFFFFF]">
            {locale === 'ar' ? 'هل تود دراسة مشروعك مع خبرائنا؟' : 'Vous avez un projet de sécurisation ?'}
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            {locale === 'ar'
              ? 'تواصل معنا مباشرة عبر الهاتف أو اطلب دراسة فنية وعرض أسعار مفصل مجاناً.'
              : 'Contactez notre équipe directement par téléphone ou déposez votre demande de devis personnalisée.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('request-quote')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t('nav.requestQuote')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
