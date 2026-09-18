import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Shield, Cpu, Lock, Phone, Layers, FileCheck2, ArrowRight } from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (view: string) => void;
}

export function ServicesView({ onNavigate }: ServicesViewProps) {
  const { t, locale } = useI18n();

  const services = [
    {
      id: 'cctv',
      icon: <Shield className="w-6 h-6 text-[#E11D2A]" />,
      title: t('services.cctv.title'),
      desc: t('services.cctv.description'),
      features: locale === 'ar' ? [
        'كاميرات مراقبة نهارية وليلية عالية الدقة (IP & HD)',
        'أجهزة تسجيل رقمية NVR / DVR مع حماية التخزين',
        'متابعة حية عبر تطبيقات الهواتف الذكية وأجهزة الحاسوب',
        'كشف الحركة والتنبيهات الذكية الفورية'
      ] : [
        'Caméras haute définition IP & analogiques professionnelles',
        'Enregistreurs NVR / DVR avec redondance de stockage',
        'Accès et visualisation à distance sur smartphones et PC',
        'Détection intelligente de mouvement et alertes instantanées'
      ]
    },
    {
      id: 'alarm',
      icon: <Cpu className="w-6 h-6 text-[#E11D2A]" />,
      title: t('services.alarm.title'),
      desc: t('services.alarm.description'),
      features: locale === 'ar' ? [
        'كواشف حركة وكواشف فتح الأبواب والنوافذ',
        'صفارات إنذار داخلية وخارجية ذات قدرة صوتية عالية',
        'لوحات تحكم ذكية مع بطاريات طوارئ تدوم طويلاً',
        'إرسال إشعارات فورية عبر الرسائل أو الاتصال الهاتفي'
      ] : [
        'Détecteurs volumétriques et contacts magnétiques périmétriques',
        'Sirènes intérieures et extérieures haute puissance',
        'Centrales certifiées avec autonomie sur batterie de secours',
        'Transmetteurs GSM / IP pour notification immédiate'
      ]
    },
    {
      id: 'access_control',
      icon: <Lock className="w-6 h-6 text-[#E11D2A]" />,
      title: t('services.access_control.title'),
      desc: t('services.access_control.description'),
      features: locale === 'ar' ? [
        'قارئات البطاقات الذكية، البصمة والتعرف على الوجه',
        'أقفال مغناطيسية وأذرع إلكترونية للأبواب والبوابات',
        'برمجيات متطورة لإدارة الصلاحيات ومتابعة الحضور',
        'ربط آمن مع أنظمة الطوارئ ومكافحة الحرائق'
      ] : [
        'Lecteurs badges RFID, biométrie digitale et faciale',
        'Ventouses électromagnétiques, gâches et barrières levantes',
        'Gestion centralisée des accès, plages horaires et historiques',
        'Asservissement aux systèmes de sécurité incendie'
      ]
    },
    {
      id: 'intercom',
      icon: <Phone className="w-6 h-6 text-[#E11D2A]" />,
      title: t('services.intercom.title'),
      desc: t('services.intercom.description'),
      features: locale === 'ar' ? [
        'شاشات لمس داخلية ملونة عالية الوضوح',
        'وحدات خارجية مضادة للعوامل الجوية والتخريب',
        'إمكانية الرد على المكالمات وفتح الباب عن بُعد من الهاتف',
        'تسجيل صور وفيديوهات للزوار تلقائياً'
      ] : [
        'Moniteurs intérieurs tactiles haute définition',
        'Platines de rue anti-vandalisme et étanches',
        'Renvoi d\'appel sur smartphone et ouverture à distance',
        'Enregistrement automatique des passages et visiteurs'
      ]
    },
    {
      id: 'networking',
      icon: <Layers className="w-6 h-6 text-[#E11D2A]" />,
      title: t('services.networking.title'),
      desc: t('services.networking.description'),
      features: locale === 'ar' ? [
        'تمديد كابلات الشبكات المعتمدة (Cat 6 / Cat 6A / الياف بصرية)',
        'محولات شبكة متخصصة PoE لتغذية الكاميرات',
        'تنظيم كبائن الخوادم والاتصالات (Rack & Patch Panels)',
        'تأمين الاتصال والتشفير لحماية بث الفيديو'
      ] : [
        'Câblage structuré certifié (Cat 6, Cat 6A, fibre optique)',
        'Switches industriels PoE adaptés à la vidéosurveillance',
        'Baies de brassage, onduleurs et organisation soignée',
        'Segmentation réseau et sécurité des flux vidéo'
      ]
    },
    {
      id: 'installation_maintenance',
      icon: <FileCheck2 className="w-6 h-6 text-[#E11D2A]" />,
      title: t('services.installation_maintenance.title'),
      desc: t('services.installation_maintenance.description'),
      features: locale === 'ar' ? [
        'تركيب هندسي دقيق ونظيف يراعي جمالية المكان',
        'ضبط الإعدادات وتدريب المستخدم على الأنظمة',
        'عقود صيانة وقائية وعلاجية دورية للمؤسسات',
        'دعم فني وتدخل سريع عند الأعطال'
      ] : [
        'Installation soignée respectant les normes esthétiques et techniques',
        'Paramétrage complet et formation des utilisateurs',
        'Contrats de maintenance préventive et curative sur mesure',
        'Support technique dédié et réactivité d\'intervention'
      ]
    }
  ];

  return (
    <div className="space-y-10 py-6">
      <div className="max-w-3xl space-y-3">
        <Badge variant="accent">
          {locale === 'ar' ? 'مجالات الخبرة الفنية' : 'Expertise & Solutions'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
          {t('services.title')}
        </h1>
        <p className="text-[#9CA3AF] text-base leading-relaxed">
          {t('services.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} hoverable className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#08090C] border border-[#232934] flex items-center justify-center">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#FFFFFF]">{service.title}</h3>
                <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">{service.desc}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#232934]/80">
                {service.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#9CA3AF]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A] mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#232934]/80">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('request-quote')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {t('nav.requestQuote')}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
