import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';
import {
  Shield,
  Phone,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  ArrowRight,
  FileCheck2,
  Store,
  Briefcase,
  Home as HomeIcon,
  Warehouse,
  Eye,
  Settings,
  Headphones,
  Award,
  ChevronRight,
  Camera,
  HardDrive,
  Bell,
  Sparkles,
  Zap,
  Activity,
  Sliders,
  SlidersHorizontal,
} from 'lucide-react';

import cctvHeroImg from '../../assets/images/cctv_hero_banner_1789744840079.jpg';
import dahuaTiocImg from '../../assets/images/dahua_tioc_cam_1789744855069.jpg';
import hikvisionDomeImg from '../../assets/images/hikvision_dome_1789744869316.jpg';
import nvrSystemImg from '../../assets/images/nvr_ai_system_1789744884125.jpg';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { t, locale } = useI18n();

  const trustPillars = [
    {
      icon: <Shield className="w-5 h-5 text-[#E11D2A]" />,
      title: locale === 'ar' ? 'دراسة موقع مجانية ومخصصة' : 'Étude & Audit Personnalisé',
      desc: locale === 'ar'
        ? 'تحليل دقيق لنقاط الضعف والمداخل واقتراح التموضع الأمثل للكاميرات وأجهزة الإنذار.'
        : 'Analyse des vulnérabilités et dimensionnement précis selon la configuration de votre site.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#E11D2A]" />,
      title: locale === 'ar' ? 'معدات أمنية عالية الدقة' : 'Matériel Certifié Haute Qualité',
      desc: locale === 'ar'
        ? 'أجهزة مطابقة لأعلى المعايير (رؤية ليلية متقدمة، كشف الحركة الذكي، ودقة 4K / HD).'
        : 'Technologies de pointe avec vision nocturne infrarouge, détection intelligente et ultra HD.',
    },
    {
      icon: <Settings className="w-5 h-5 text-[#E11D2A]" />,
      title: locale === 'ar' ? 'تركيب احترافي وتمديد نظيف' : 'Installation & Câblage Conforme',
      desc: locale === 'ar'
        ? 'فنيون مؤهلون يضمنون تمديد كابلات مخفي ومحمي، وزوايا تغطية شاملة بدون نقاط عمياء.'
        : 'Mise en œuvre soignée, intégration discrète des câbles et paramétrage réseau sécurisé.',
    },
    {
      icon: <Eye className="w-5 h-5 text-[#E11D2A]" />,
      title: locale === 'ar' ? 'متابعة عبر الهاتف 24/7' : 'Surveillance Mobile 24/7',
      desc: locale === 'ar'
        ? 'مشاهدة البث المباشر والإشعارات الفورية على هاتفك الذكي أينما كنت في العالم.'
        : 'Accès distant direct sur smartphone et PC avec notifications d\'intrusion instantanées.',
    },
  ];

  const mainServices = [
    {
      key: 'cctv',
      icon: <Shield className="w-5 h-5 text-[#E11D2A]" />,
      badge: locale === 'ar' ? 'الأكثر طلباً' : 'Populaire',
    },
    {
      key: 'alarm',
      icon: <Cpu className="w-5 h-5 text-[#E11D2A]" />,
      badge: locale === 'ar' ? 'حماية فورية' : 'Anti-intrusion',
    },
    {
      key: 'access_control',
      icon: <Lock className="w-5 h-5 text-[#E11D2A]" />,
      badge: locale === 'ar' ? 'إدارة الدخول' : 'Biométrie & Badges',
    },
    {
      key: 'intercom',
      icon: <Phone className="w-5 h-5 text-[#E11D2A]" />,
      badge: locale === 'ar' ? 'اتصال مرئي' : 'Visiophonie IP',
    },
    {
      key: 'networking',
      icon: <Layers className="w-5 h-5 text-[#E11D2A]" />,
      badge: locale === 'ar' ? 'بنية تحتية' : 'Câblage & Baies',
    },
    {
      key: 'installation_maintenance',
      icon: <FileCheck2 className="w-5 h-5 text-[#E11D2A]" />,
      badge: locale === 'ar' ? 'خدمة مستمرة' : 'Contrats SAV',
    },
  ];

  const targetEnvironments = [
    {
      id: 'retail',
      icon: <Store className="w-6 h-6 text-[#E11D2A]" />,
      title: t('solutions.retail'),
      desc: locale === 'ar'
        ? 'حماية الصناديق والمخزون، مراقبة الممرات وردع السرقات.'
        : 'Surveillance des caisses, détection de vols et vue d\'ensemble des rayons.',
    },
    {
      id: 'office',
      icon: <Briefcase className="w-6 h-6 text-[#E11D2A]" />,
      title: t('solutions.office'),
      desc: locale === 'ar'
        ? 'تنظيم دخول الموظفين والزوار وحماية المكاتب ومعدات العمل.'
        : 'Contrôle d\'accès par badges, sécurisation des serveurs et traçabilité.',
    },
    {
      id: 'house',
      icon: <HomeIcon className="w-6 h-6 text-[#E11D2A]" />,
      title: t('solutions.house'),
      desc: locale === 'ar'
        ? 'حماية محيط الفيلا، إنتركوم مرئي متصل وإنذار ذكي.'
        : 'Sécurisation du périmètre, alarme connectée et visiophone sur smartphone.',
    },
    {
      id: 'warehouse',
      icon: <Warehouse className="w-6 h-6 text-[#E11D2A]" />,
      title: t('solutions.warehouse'),
      desc: locale === 'ar'
        ? 'كاميرات بعيدة المدى، كواشف حرارية وتغطية للمساحات الكبرى.'
        : 'Caméras infrarouge longue portée, détection thermique et zones de fret.',
    },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: locale === 'ar' ? 'طلب دراسة أو عرض أسعار' : 'Demande & Prise de Contact',
      desc: locale === 'ar' ? 'أرسل تفاصيل موقعك أو اتصل بنا مباشرة.' : 'Décrivez vos besoins en ligne ou appelez notre équipe.',
    },
    {
      num: '02',
      title: locale === 'ar' ? 'معاينة الموقع واقتراح الحل' : 'Audit & Devis Chiffré',
      desc: locale === 'ar' ? 'اقتراح المنظومة المثالية الملائمة لميزانيتكم.' : 'Proposition technique sur mesure au tarif le plus juste.',
    },
    {
      num: '03',
      title: locale === 'ar' ? 'التركيب والتشغيل الفني' : 'Installation & Configuration',
      desc: locale === 'ar' ? 'تمديد الكابلات، تثبيت الكاميرات وضبط التطبيق.' : 'Mise en place soignée, tests réels et connexion mobile.',
    },
    {
      num: '04',
      title: locale === 'ar' ? 'التسليم والضمان والصيانة' : 'Garantie & Support Continu',
      desc: locale === 'ar' ? 'تدريب الحريف على الاستخدام ودعم فني دائم.' : 'Prise en main guidée, garantie matériel et assistance SAV.',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dahua' | 'hikvision' | 'nvr'>('all');
  const [comparisonMode, setComparisonMode] = useState<'colorvu' | 'standard'>('colorvu');

  const featuredProducts = [
    {
      id: 'prod-dh-tioc-5mp',
      name: 'Dahua TiOC 2.0 5MP Dissuasion Active',
      brand: 'Dahua Technology',
      model: 'DH-IPC-HFW3549T1-AS-PV',
      category: 'dahua' as const,
      badge: locale === 'ar' ? 'ردع نشط مع صفارة إنذار' : 'Dissuasion Active 110dB',
      image: dahuaTiocImg,
      tagline: locale === 'ar' ? 'كاميرا ذكية تطرد الدخيل فوراً' : 'Alerte stroboscopique & Sirène avant effraction',
      price: '470 DT',
      specs: [
        locale === 'ar' ? 'دقة 5 ميغابكسل فائقة الوضوح' : 'Capteur 5MP Ultra Net (2592 × 1944)',
        locale === 'ar' ? 'إضاءة ليلية ملونة 24/7 Full-Color' : 'Vision Full-Color 24/7 avec LED chaude',
        locale === 'ar' ? 'فلاش أحمر/أزرق مع صفارة 110 ديسيبل' : 'Flash rouge/bleu stroboscopique + sirène',
        locale === 'ar' ? 'ذكاء اصطناعي لتمييز الأشخاص والسيارات' : 'WizSense IA : classification humaine/véhicule',
      ],
    },
    {
      id: 'prod-hk-colorvu-4mp',
      name: 'Hikvision ColorVu 4MP Tourelle IP F1.0',
      brand: 'Hikvision',
      model: 'DS-2CD2347G2-LU',
      category: 'hikvision' as const,
      badge: locale === 'ar' ? 'ألوان ساطعة في الظلام الدامس' : 'Vision Nocturne F1.0',
      image: hikvisionDomeImg,
      tagline: locale === 'ar' ? 'صورة نهارية ملونة حتى في منتصف الليل' : 'Couleur vive 24/7 sans perte de détail',
      price: '385 DT',
      specs: [
        locale === 'ar' ? 'عدسة F1.0 فائقة استقبال الضوء' : 'Super-ouverture F1.0 (0.0005 Lux)',
        locale === 'ar' ? 'دقة 4MP مع ذكاء اصطناعي AcuSense' : 'Résolution 4MP avec IA AcuSense',
        locale === 'ar' ? 'تصفية 98% من الإنذارات الكاذبة' : 'Filtrage à 98% des fausses alertes',
        locale === 'ar' ? 'ميكروفون مدمج نقي مع عزل الضوضاء' : 'Microphone haute fidélité intégré',
      ],
    },
    {
      id: 'prod-pack-nvr-wd',
      name: 'Pack NVR 16 Voies 4K PoE + WD Purple 4TB',
      brand: 'Dahua & WD Purple',
      model: 'DHI-NVR4216-16P + WD43PURZ',
      category: 'nvr' as const,
      badge: locale === 'ar' ? 'مركز تسجيل احترافي متكامل' : 'Centrale 4K + Disque 24/7',
      image: nvrSystemImg,
      tagline: locale === 'ar' ? 'تسجيل دائم واسترجاع فوري للأحداث' : 'Enregistrement continu garanti sans coupure',
      price: '1 630 DT',
      specs: [
        locale === 'ar' ? '16 منفذ PoE Plug & Play مستقل' : '16 Ports PoE intégrés Plug & Play',
        locale === 'ar' ? 'دعم شاشات 4K Ultra HD وتطبيق DMSS' : 'Sortie HDMI 4K + App Mobile DMSS / PC',
        locale === 'ar' ? 'قرص صلب وسترن ديجيتال بربل 4 تيرا' : 'Disque Western Digital Purple 4TB AllFrame',
        locale === 'ar' ? 'بحث ذكي وسريع بالوجوه واللوحات' : 'Reconnaissance faciale et recherche rapide',
      ],
    },
    {
      id: 'prod-dh-ptz-25x',
      name: 'Caméra Dahua PTZ 25x Zoom Optique Auto-Tracking',
      brand: 'Dahua Technology',
      model: 'SD49225XA-HNR',
      category: 'dahua' as const,
      badge: locale === 'ar' ? 'دوران 360° وتتبع تلقائي' : 'Zoom 25x Auto-Tracking',
      image: dahuaTiocImg,
      tagline: locale === 'ar' ? 'تغطية للمستودعات والساحات الكبرى' : 'Surveillance panoramique de grands espaces',
      price: '1 580 DT',
      specs: [
        locale === 'ar' ? 'تكبير بصري حقيقي 25 مرة لمسافة 100م' : 'Zoom optique 25x puissant (4.8 à 120mm)',
        locale === 'ar' ? 'تتبع آلي ذاتي لأي جسم مشبوه' : 'Auto-tracking autonome des intrus',
        locale === 'ar' ? 'رؤية ليلية بالأشعة تحت الحمراء 100 متر' : 'Portée Infrarouge IR jusqu\'à 100 mètres',
        locale === 'ar' ? 'هيكل معدني مصفح ضد الصواعق 6kV' : 'Protection extrême IP66 & foudre 6kV',
      ],
    },
    {
      id: 'prod-alarm-axpro',
      name: 'Kit Alarme Sans Fil Hikvision AX PRO & PIRCAM',
      brand: 'Hikvision AX PRO',
      model: 'DS-PWA96-M-WE',
      category: 'hikvision' as const,
      badge: locale === 'ar' ? 'إنذار لاسلكي ذكي مع صور فورية' : 'Anti-Intrusion Connectée',
      image: hikvisionDomeImg,
      tagline: locale === 'ar' ? 'تأكيد بصري فوري لمحاولات الاقتحام' : 'Levée de doute photo immédiate sur smartphone',
      price: '980 DT',
      specs: [
        locale === 'ar' ? 'اتصال لاسلكي Tri-X يصل إلى 2000 متر' : 'Protocole radio Tri-X portée jusqu\'à 2km',
        locale === 'ar' ? 'كاشف حركة مع كاميرا ترسل الصور فوراً' : 'Détecteur PIRCAM capture d\'images instantanée',
        locale === 'ar' ? 'شريحة اتصال 4G + Wi-Fi لضمان الاتصال' : 'Double connectivité 4G SIM & Wi-Fi',
        locale === 'ar' ? 'صفارة إنذار خارجية قوية 110dB' : 'Sirène extérieure 110dB avec flash flash',
      ],
    },
    {
      id: 'prod-dh-vto-villa',
      name: 'Portier Vidéo IP Villa Dahua 2MP & Contrôle d\'accès',
      brand: 'Dahua Technology',
      model: 'DHI-VTO2202F-P',
      category: 'dahua' as const,
      badge: locale === 'ar' ? 'إنتركوم فيلا متطور مع شارة' : 'Visiophonie IP & Badge',
      image: dahuaTiocImg,
      tagline: locale === 'ar' ? 'استقبل زوارك وافتح الباب من هاتفك' : 'Répondez et ouvrez le portail depuis votre smartphone',
      price: '490 DT',
      specs: [
        locale === 'ar' ? 'كاميرا عين السمكة 160° عالية الدقة' : 'Caméra 2MP Fisheye vision large 160°',
        locale === 'ar' ? 'فتح الباب بشارات RFID أو تطبيق DMSS' : 'Lecteur de badge RFID + commande gâche',
        locale === 'ar' ? 'واجهة ألومنيوم فاخرة ومقاومة للكسر' : 'Boîtier aluminium anodisé IK07 & IP65',
        locale === 'ar' ? 'شاشة لمس داخلية 7 بوصات اختيارية' : 'Écran tactile 7" intérieur haute résolution',
      ],
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? featuredProducts
    : featuredProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section with CCTV Surveillance Showcase */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#101318] via-[#0D1015] to-[#08090C] border border-[#232934] p-6 sm:p-10 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#E11D2A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#E11D2A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-6 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="accent">
                <span className="w-2 h-2 rounded-full bg-[#E11D2A] animate-ping" />
                {locale === 'ar' ? 'أنظمة الحماية والمراقبة الاحترافية' : 'Installateur Officiel Dahua & Hikvision'}
              </Badge>
              <Badge variant="neutral">
                {locale === 'ar' ? 'تغطية كامل التراب التونسي' : 'Intervention Rapide Toute la Tunisie'}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.15]">
              {locale === 'ar' ? (
                <>
                  أمان بلا ثغرات مع منظومات <span className="text-[#E11D2A]">داهوا وهيكفيجن</span> الذكية
                </>
              ) : (
                <>
                  Sécurité Sans Faille avec les Systèmes <span className="text-[#E11D2A]">Dahua & Hikvision</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed max-w-xl">
              {locale === 'ar'
                ? 'معدات أصلية معتمدة 100%: كاميرات 4K بألوان ليلية كاملة، أجهزة تسجيل NVR، وأنظمة إنذار ذكية لطرد المتسللين قبل حدوث السرقة.'
                : 'Vidéosurveillance 4K Full-Color, caméras à dissuasion active avec flash et sirène, NVR intelligents et contrôle d\'accès par des techniciens certifiés.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('request-quote')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-[0_0_25px_rgba(225,29,42,0.4)]"
              >
                {t('nav.requestQuote')}
              </Button>

              <a
                href="tel:+21654306506"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-lg bg-[#161A22] border border-[#232934] hover:border-[#E11D2A] text-[#FFFFFF] font-semibold text-sm transition-all shadow-sm group"
                dir="ltr"
              >
                <Phone className="w-4 h-4 text-[#E11D2A] group-hover:scale-110 transition-transform" />
                <span className="font-mono text-sm">+216 54 306 506</span>
              </a>
            </div>

            {/* Quick Micro-Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs text-[#9CA3AF]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A]" />
                {locale === 'ar' ? 'عرض أسعار مفصل ومجاني' : 'Devis gratuit & étude technique'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A]" />
                {locale === 'ar' ? 'ضمان رسمي من المصنع' : 'Garantie constructeur 24/7'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A]" />
                {locale === 'ar' ? 'متابعة مباشرة عبر الهاتف' : 'Accès smartphone DMSS / Hik-Connect'}
              </span>
            </div>
          </div>

          {/* Cinematic CCTV Showcase Card */}
          <div className="shrink-0 w-full max-w-md lg:max-w-lg">
            <div className="relative rounded-2xl overflow-hidden border border-[#232934] bg-[#101318] shadow-[0_0_50px_rgba(225,29,42,0.15)] group">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#08090C]">
                <img
                  src={cctvHeroImg}
                  alt="Installation Caméra CCTV Dahua Hikvision SBS VISION"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101318] via-transparent to-black/60" />

                {/* Live Camera Telemetry HUD Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[#FFFFFF] border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#E11D2A] animate-pulse" />
                    REC • LIVE CAM-01
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-emerald-400 font-bold border border-white/10">
                    4K UHD • 30 FPS
                  </span>
                </div>

                {/* Bottom Overlay Info inside photo */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <div className="px-2.5 py-1 rounded-md bg-[#101318]/90 backdrop-blur-md border border-[#232934] text-[#FFFFFF] font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#E11D2A]" />
                    <span>Dahua TiOC & ColorVu 24/7</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
                    IA WizSense Active
                  </div>
                </div>
              </div>

              {/* Card Footer Bar with Logo */}
              <div className="p-4 bg-[#101318] border-t border-[#232934] flex items-center justify-between">
                <Logo variant="horizontal" size="sm" theme="dark" />
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
                    {locale === 'ar' ? 'تجهيزات أصلية معتمدة' : 'Systèmes Certifiés'}
                  </span>
                  <span className="text-xs font-bold text-[#E11D2A]">
                    Dahua & Hikvision
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners Ecosystem Strip */}
      <section className="p-4 sm:p-6 rounded-2xl bg-[#08090C] border border-[#232934] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
          <Award className="w-4 h-4 text-[#E11D2A]" />
          <span>{locale === 'ar' ? 'شراكات وتجهيزات أصلية معتمدة :' : 'Écosystème & Marques Certifiées :'}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-xs font-mono font-bold text-[#FFFFFF]">
          <span className="px-2.5 py-1 rounded bg-[#101318] border border-[#232934] hover:border-[#E11D2A] transition-colors">
            DAHUA TECHNOLOGY
          </span>
          <span className="px-2.5 py-1 rounded bg-[#101318] border border-[#232934] hover:border-[#E11D2A] transition-colors">
            HIKVISION
          </span>
          <span className="px-2.5 py-1 rounded bg-[#101318] border border-[#232934] hover:border-[#E11D2A] transition-colors text-purple-400">
            WD PURPLE 24/7
          </span>
          <span className="px-2.5 py-1 rounded bg-[#101318] border border-[#232934] hover:border-[#E11D2A] transition-colors text-emerald-400">
            SEAGATE SKYHAWK
          </span>
          <span className="px-2.5 py-1 rounded bg-[#101318] border border-[#232934] hover:border-[#E11D2A] transition-colors">
            AJAX SYSTEMS
          </span>
        </div>
      </section>

      {/* 2. Key Trust Pillars for Clients */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPillars.map((pillar, idx) => (
            <Card key={idx} hoverable className="p-5 flex flex-col justify-between space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
                {pillar.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#FFFFFF]">{pillar.title}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{pillar.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Featured Products & Systems Showcase (Dahua & Hikvision) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232934] pb-4">
          <div>
            <Badge variant="accent" className="mb-2">
              <Camera className="w-3.5 h-3.5" />
              {locale === 'ar' ? 'المعدات والأنظمة المعتمدة' : 'Catalogue & Matériel de Référence'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
              {locale === 'ar' ? 'منظومات داهوا وهيكفيجن الأكثر طلباً' : 'Équipements Phares Dahua & Hikvision'}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {locale === 'ar'
                ? 'كاميرات بدقة 4K مع ألوان ليلية كاملة، صفارات إنذار رادعة، ومراكز تسجيل NVR عالية السعة.'
                : 'Sélection d\'équipements haute performance garantissant une protection active et une reconnaissance nette jour et nuit.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                selectedCategory === 'all'
                  ? 'bg-[#E11D2A] text-white border-[#E11D2A]'
                  : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'الكل' : 'Tous'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('dahua')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                selectedCategory === 'dahua'
                  ? 'bg-[#E11D2A] text-white border-[#E11D2A]'
                  : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-white'
              }`}
            >
              Dahua Technology
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('hikvision')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                selectedCategory === 'hikvision'
                  ? 'bg-[#E11D2A] text-white border-[#E11D2A]'
                  : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-white'
              }`}
            >
              Hikvision ColorVu
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('nvr')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                selectedCategory === 'nvr'
                  ? 'bg-[#E11D2A] text-white border-[#E11D2A]'
                  : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'مراكز NVR' : 'NVR & Stockage'}
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <Card
              key={prod.id}
              hoverable
              className="flex flex-col justify-between overflow-hidden border-[#232934] group bg-[#101318]"
            >
              <div>
                {/* Product Image Showcase */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#08090C]">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101318] via-transparent to-black/40" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E11D2A] text-white shadow-md">
                      {prod.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-sm text-[#FFFFFF] border border-white/15">
                      {prod.brand}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded text-[#9CA3AF]">
                      {prod.model}
                    </span>
                    <span className="font-bold text-sm text-[#FF4D5A]">
                      {prod.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#FF4D5A] transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {prod.tagline}
                    </p>
                  </div>

                  {/* Bullet Specs */}
                  <ul className="space-y-1.5 pt-1 text-xs text-[#CBD5E1]">
                    {prod.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Action */}
              <div className="p-5 pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-semibold group-hover:border-[#E11D2A] group-hover:text-white transition-colors"
                  onClick={() => onNavigate('request-quote')}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5 text-[#E11D2A]" />}
                >
                  {locale === 'ar' ? 'طلب عرض أسعار لهذا المنتج' : 'Inclure dans mon devis gratuit'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Interactive Technology Comparison: Standard vs ColorVu / Full-Color */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101318] via-[#161A22] to-[#101318] border border-[#232934] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <Badge variant="accent">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === 'ar' ? 'الفارق التكنولوجي لـ SBS VISION' : 'Technologie de Pointe'}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFF]">
              {locale === 'ar'
                ? 'لماذا كاميرات ColorVu و TiOC Full-Color تحدث الفارق في الحماية؟'
                : 'La Différence SBS VISION : Vision Nocturne Standard vs ColorVu / Full-Color'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF]">
              {locale === 'ar'
                ? 'الكاميرات العادية تقدم صوراً ضبابية بالأبيض والأسود في الليل. أنظمتنا تمنحك تفاصيل دقيقة وألواناً حقيقية لطرد السارقين وتقديم أدلة قاطعة.'
                : 'Les caméras infrarouges basiques fournissent des images floues en noir et blanc. Nos systèmes Dahua & Hikvision capturent des preuves exploitables 24h/24.'}
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#08090C] border border-[#232934] self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setComparisonMode('colorvu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                comparisonMode === 'colorvu'
                  ? 'bg-[#E11D2A] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'SBS VISION Full-Color' : 'SBS VISION Full-Color 4K'}
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                comparisonMode === 'standard'
                  ? 'bg-zinc-700 text-white'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'كاميرات الأشعة العادية' : 'Caméra Standard IR (Noir & Blanc)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'وضوح الصورة ليلاً' : 'Clarté & Couleur Nocturne'}
              </span>
              <Eye className="w-4 h-4 text-[#E11D2A]" />
            </div>
            {comparisonMode === 'colorvu' ? (
              <p className="text-xs text-emerald-400 font-medium">
                {locale === 'ar'
                  ? '✓ ألوان كاملة وساطعة 24/7 حتى في الظلام الدامس (0.0005 Lux). وضوح لوحات السيارات ولون الملابس.'
                  : '✓ Image couleur vive 24/7 en pleine obscurité (F1.0). Reconnaissance immédiate des visages et des immatriculations.'}
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                {locale === 'ar'
                  ? '✗ صورة مظلمة باللونين الرمادي والأسود. تشويش وضياع معالم الوجه وألوان الملابس.'
                  : '✗ Image granuleuse noir et blanc. Perte des détails de couleur (vêtements, véhicules) inexploitable pour la police.'}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'ردع السارقين الفوري' : 'Dissuasion Active Anti-Intrusion'}
              </span>
              <Bell className="w-4 h-4 text-[#E11D2A]" />
            </div>
            {comparisonMode === 'colorvu' ? (
              <p className="text-xs text-emerald-400 font-medium">
                {locale === 'ar'
                  ? '✓ فلاش أزرق/أحمر فوري وصفارة 110 ديسيبل تطرد المتسلل قبل أن يقتحم المكان.'
                  : '✓ Déclenchement d\'un flash stroboscopique rouge/bleu et d\'une sirène 110dB dès le franchissement de la ligne.'}
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                {locale === 'ar'
                  ? '✗ تسجيل سلبي فقط دون أي ردع، وتكتشف السرقة بعد مغادرة السارق.'
                  : '✗ Aucun dispositif de dissuasion. Enregistrement passif constatant le préjudice après le départ des voleurs.'}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'الذكاء الاصطناعي وتصفية الإنذارات' : 'Filtrage IA Fausses Alertes'}
              </span>
              <Cpu className="w-4 h-4 text-[#E11D2A]" />
            </div>
            {comparisonMode === 'colorvu' ? (
              <p className="text-xs text-emerald-400 font-medium">
                {locale === 'ar'
                  ? '✓ دقة 98% في تمييز الإنسان والمركبات. لا إشعارات مزعجة بسبب القطط أو الرياح أو الأمطار.'
                  : '✓ Détection ciblée humains & véhicules (WizSense/AcuSense). Réduction de 98% des fausses alertes sur smartphone.'}
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                {locale === 'ar'
                  ? '✗ إشعارات كاذبة مستمرة في كل مرة تتحرك فيها شجرة أو يمر حيوان أليف.'
                  : '✗ Détection de mouvement pixel basique générant des dizaines de fausses alertes à cause du vent, pluie ou animaux.'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Core Security Services Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#232934] pb-4">
          <div>
            <Badge variant="accent" className="mb-2">
              {locale === 'ar' ? 'مجالات اختصاصنا' : 'Nos Domaines d\'Intervention'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
              {t('services.title')}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1">{t('services.subtitle')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('services')}>
            {locale === 'ar' ? 'عرض جميع الخدمات' : 'Voir tous les services'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mainServices.map(({ key, icon, badge }) => (
            <Card key={key} hoverable className="p-5 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center group-hover:border-[#E11D2A] transition-colors">
                    {icon}
                  </div>
                  <Badge variant="neutral" className="text-[10px]">
                    {badge}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#FF4D5A] transition-colors">
                  {t(`services.${key}.title`)}
                </h3>

                <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-3">
                  {t(`services.${key}.description`)}
                </p>
              </div>

              <div className="pt-3 border-t border-[#232934]/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('request-quote')}
                  className="text-xs font-semibold text-[#E11D2A] hover:text-[#FF4D5A] inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t('nav.requestQuote')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Solutions by Sector */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#232934] pb-4">
          <div>
            <Badge variant="accent" className="mb-2">
              {locale === 'ar' ? 'حلول حسب النشاط' : 'Solutions Adaptées'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
              {t('solutions.title')}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1">{t('solutions.subtitle')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('solutions')}>
            {locale === 'ar' ? 'استعراض كل البيئات' : 'Consulter les solutions'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {targetEnvironments.map((env) => (
            <Card key={env.id} hoverable className="p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
                  {env.icon}
                </div>
                <h3 className="text-base font-bold text-[#FFFFFF]">{env.title}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{env.desc}</p>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onNavigate('request-quote')}
                >
                  {locale === 'ar' ? 'طلب دراسة' : 'Étude sur mesure'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="p-8 rounded-2xl bg-[#101318] border border-[#232934] space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="accent">
            {locale === 'ar' ? 'منهجيتنا الاحترافية' : 'Notre Méthodologie'}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
            {locale === 'ar' ? 'كيف تبدأ مشروعك الأمني معنا؟' : 'Comment se déroule votre projet ?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            {locale === 'ar'
              ? 'خطوات واضحة وسريعة من دراسة الاحتياج حتى التشغيل الكامل والتسليم.'
              : 'Un processus transparent de l\'analyse initiale à la mise en service complète.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#08090C] border border-[#232934] space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-extrabold text-[#E11D2A]">
                  {step.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E11D2A]/60" />
              </div>
              <h3 className="text-sm font-bold text-[#FFFFFF]">{step.title}</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#161A22] via-[#101318] to-[#161A22] border border-[#E11D2A]/30 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(225,29,42,0.1)]">
        <div className="space-y-2 text-center lg:text-start max-w-2xl">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <Headphones className="w-5 h-5 text-[#E11D2A]" />
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFF]">
              {locale === 'ar'
                ? 'هل ترغب في تأمين موقعك أو مؤسستك؟'
                : 'Prêt à sécuriser votre établissement ou votre résidence ?'}
            </h3>
          </div>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            {locale === 'ar'
              ? 'مهندسونا وفنيونا جاهزون للإجابة على استفساراتكم وإعداد عرض أسعار مفصل ومناسب لميزانيتكم مجاناً.'
              : 'Nos techniciens experts vous conseillent gratuitement pour concevoir une installation conforme, fiable et pérenne.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('request-quote')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t('nav.requestQuote')}
          </Button>

          <a
            href="tel:+21654306506"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08090C] border border-[#232934] hover:border-[#E11D2A] text-[#FFFFFF] text-sm font-semibold transition-colors"
            dir="ltr"
          >
            <Phone className="w-4 h-4 text-[#E11D2A]" />
            <span className="font-mono text-xs">+216 54 306 506</span>
          </a>
        </div>
      </section>
    </div>
  );
}
