import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Home, Building2, Store, Briefcase, Warehouse, Building, ArrowRight } from 'lucide-react';

interface SolutionsViewProps {
  onNavigate: (view: string) => void;
}

export function SolutionsView({ onNavigate }: SolutionsViewProps) {
  const { t, locale } = useI18n();

  const environments = [
    {
      id: 'house',
      icon: <Home className="w-6 h-6 text-[#E11D2A]" />,
      name: t('solutions.house'),
      need: locale === 'ar' ? 'حماية المحيط الخارجي والمداخل مع الحفاظ على خصوصية العائلة.' : 'Protection périmétrique, contrôle des accès extérieurs et préservation de l\'intimité.',
      risks: locale === 'ar' ? 'التسلل الليلي، السرقات أثناء السفر، وغياب المراقبة عند المداخل.' : 'Intrusions nocturnes, cambriolages en cas d\'absence et manque de visibilité aux accès.',
      solution: locale === 'ar' ? 'كاميرات خارجية مقاومة للطقس مع كشف ذكي + إنتركوم فيديو متصل بالهاتف + نظام إنذار périmétrique.' : 'Caméras extérieures étanches à détection intelligente, visiophone connecté et alarme périmétrique.',
    },
    {
      id: 'apartment',
      icon: <Building className="w-6 h-6 text-[#E11D2A]" />,
      name: t('solutions.apartment'),
      need: locale === 'ar' ? 'حماية باب الدخول الرئيسي ومراقبة الممرات المشتركة بدون تعقيد.' : 'Sécurisation de la porte palière et surveillance discrète sans contraintes lourdes.',
      risks: locale === 'ar' ? 'محاولات الخلع، غياب الرؤية للزائر قبل الفتح.' : 'Tentatives d\'effraction, manque de visibilité avant ouverture de la porte.',
      solution: locale === 'ar' ? 'جرس كاميرا ذكي أو عين سحرية إلكترونية + نظام إنذار لاسلكي بدون تمديد كابلات.' : 'Visiophone connecté ultra-compact et alarme sans fil sans travaux lourds.',
    },
    {
      id: 'retail',
      icon: <Store className="w-6 h-6 text-[#E11D2A]" />,
      name: t('solutions.retail'),
      need: locale === 'ar' ? 'مراقبة نقاط البيع، رفوف البضائع ومداخل المحل.' : 'Surveillance des caisses, des rayons et des zones d\'accès client/livraison.',
      risks: locale === 'ar' ? 'السرقات العابرة، النزاعات النقدية عند الصندوق، والسطو بعد أوقات العمل.' : 'Vols à l\'étalage, litiges d\'encaissement et intrusions après fermeture.',
      solution: locale === 'ar' ? 'كاميرات قبة داخلية بزوايا واسعة ودقة عالية + إنذار مع صفارات عالية + مراقبة مباشرة من هاتف المالك.' : 'Dômes haute définition grand angle sur les caisses, sirène dissuasive et vue en direct mobile.',
    },
    {
      id: 'office',
      icon: <Briefcase className="w-6 h-6 text-[#E11D2A]" />,
      name: t('solutions.office'),
      need: locale === 'ar' ? 'تنظيم دخول الموظفين والزوار وحماية المكاتب الإدارية ومعدات تكنولوجيا المعلومات.' : 'Régulation des accès collaborateurs/visiteurs et sécurisation des équipements informatiques.',
      risks: locale === 'ar' ? 'دخول أشخاص غير مصرح لهم، تسريب البيانات أو فقدان الأجهزة.' : 'Accès non autorisés aux zones sensibles, perte de matériel et de documents confidentiels.',
      solution: locale === 'ar' ? 'نظام تحكم في الدخول بالبطاقات الممغنطة + كاميرات في الممرات وغرفة الخوادم + تسجيل مركزي.' : 'Contrôle d\'accès par badges, caméras dans les couloirs/baie serveur et enregistrement sécurisé.',
    },
    {
      id: 'enterprise',
      icon: <Building2 className="w-6 h-6 text-[#E11D2A]" />,
      name: t('solutions.enterprise'),
      need: locale === 'ar' ? 'منظومة أمنية متكاملة تشمل عدة مبانٍ، بوابات سيارات ومستودعات.' : 'Système de sûreté globale unifiée multi-bâtiments, accès véhicules et zones logistiques.',
      risks: locale === 'ar' ? 'صعوبة السيطرة على حركة الدخول والخروج، حوادث عمل، وسرقات منظمة.' : 'Gestion complexe des flux, accidents matériels et risques industriels.',
      solution: locale === 'ar' ? 'كاميرات IP متقدمة مع تحليل الفيديو، بوابات تحكم آلية، وربط شبكي مركزي مع غرفة مراقبة.' : 'Caméras IP avec analyse vidéo, barrières levantes automatiques et centralisation en salle de contrôle.',
    },
    {
      id: 'warehouse',
      icon: <Warehouse className="w-6 h-6 text-[#E11D2A]" />,
      name: t('solutions.warehouse'),
      need: locale === 'ar' ? 'تغطية مساحات شاسعة، ساحات التحميل، والممرات المظلمة ليلاً.' : 'Couverture de vastes superficies, quais de chargement et zones de stockage nocturnes.',
      risks: locale === 'ar' ? 'التسلل عبر الأسوار الخارجية، سرقة المخزون الثمين، وصعوبة الرؤية في الإضاءة الضعيفة.' : 'Intrusions périphériques, vols de marchandises et visibilité réduite la nuit.',
      solution: locale === 'ar' ? 'كاميرات بمجال رؤية بعيد ومدى ليلي يصل إلى 80 متراً + كواشف حرارية + شبكة سلكية مقاومة.' : 'Caméras longue portée infrarouge puissant (jusqu\'à 80m), détection thermique et câblage blindé.',
    },
  ];

  return (
    <div className="space-y-10 py-6">
      <div className="max-w-3xl space-y-3">
        <Badge variant="accent">
          {locale === 'ar' ? 'تصميم مخصص حسب الموقع' : 'Architecture par Environnement'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
          {t('solutions.title')}
        </h1>
        <p className="text-[#9CA3AF] text-base leading-relaxed">
          {t('solutions.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {environments.map((env) => (
          <Card key={env.id} hoverable className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
                  {env.icon}
                </div>
                <h3 className="text-xl font-bold text-[#FFFFFF]">{env.name}</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-[#08090C]/80 border border-[#232934]">
                  <span className="font-semibold text-[#E11D2A] block mb-1">
                    {locale === 'ar' ? 'الاحتياج الأساسي:' : 'Besoin de sécurité :'}
                  </span>
                  <p className="text-[#9CA3AF]">{env.need}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#08090C]/80 border border-[#232934]">
                  <span className="font-semibold text-rose-400 block mb-1">
                    {locale === 'ar' ? 'المخاطر الشائعة:' : 'Risques typiques :'}
                  </span>
                  <p className="text-[#9CA3AF]">{env.risks}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#08090C]/80 border border-[#232934]">
                  <span className="font-semibold text-emerald-400 block mb-1">
                    {locale === 'ar' ? 'حلول SBS VISION المقترحة:' : 'Solution SBS VISION :'}
                  </span>
                  <p className="text-[#9CA3AF]">{env.solution}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#232934]/80">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('request-quote')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {locale === 'ar' ? 'طلب دراسة فنية لموقعي' : 'Demander une étude pour mon site'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
