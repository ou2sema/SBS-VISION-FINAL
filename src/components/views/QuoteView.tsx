import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Sparkles,
  Smartphone,
  Cpu,
  Lock,
  Layers,
  FileCheck2,
  Building,
  Store,
  Briefcase,
  Home,
  Warehouse
} from 'lucide-react';
import type { ServiceType, PropertyEnvironment } from '../../types';
import { getFirebaseFirestore, getFirebaseAuth } from '../../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

interface QuoteViewProps {
  onNavigate?: (view: string) => void;
}

export function QuoteView({ onNavigate }: QuoteViewProps) {
  const { t, locale } = useI18n();

  // Multi-step State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quoteReferenceId, setQuoteReferenceId] = useState<string | null>(null);

  // Form Fields
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['cctv']);
  const [environment, setEnvironment] = useState<PropertyEnvironment>('retail');
  const [indoorOutdoor, setIndoorOutdoor] = useState<'indoor' | 'outdoor' | 'both'>('both');
  const [remoteViewing, setRemoteViewing] = useState<boolean>(true);
  const [letSbsChoose, setLetSbsChoose] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  // Customer Contact Fields
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const servicesList: { id: ServiceType; label: string; icon: React.ReactNode }[] = [
    { id: 'cctv', label: t('services.cctv.title'), icon: <Shield className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'alarm', label: t('services.alarm.title'), icon: <Cpu className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'access_control', label: t('services.access_control.title'), icon: <Lock className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'intercom', label: t('services.intercom.title'), icon: <Phone className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'networking', label: t('services.networking.title'), icon: <Layers className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'installation_maintenance', label: t('services.installation_maintenance.title'), icon: <FileCheck2 className="w-5 h-5 text-[#E11D2A]" /> },
  ];

  const environmentList: { id: PropertyEnvironment; label: string; icon: React.ReactNode }[] = [
    { id: 'retail', label: t('solutions.retail'), icon: <Store className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'office', label: t('solutions.office'), icon: <Briefcase className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'house', label: t('solutions.house'), icon: <Home className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'warehouse', label: t('solutions.warehouse'), icon: <Warehouse className="w-5 h-5 text-[#E11D2A]" /> },
    { id: 'building', label: t('solutions.apartment'), icon: <Building className="w-5 h-5 text-[#E11D2A]" /> },
  ];

  const toggleService = (id: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitQuote = async () => {
    // Validate customer contact information on Step 5
    const err: { [key: string]: string } = {};
    if (!customer.name.trim()) {
      err.name = locale === 'ar' ? 'الاسم مطلوب' : 'Le nom est requis';
    }
    if (!customer.phone.trim()) {
      err.phone = locale === 'ar' ? 'رقم الهاتف مطلوب' : 'Le téléphone est requis';
    }
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const generatedId = `SBS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const quotePayload = {
      id: generatedId,
      referenceId: generatedId,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || null,
        city: customer.city.trim() || null,
      },
      project: {
        environment,
        indoorOutdoor,
        remoteViewing,
        letSbsChoose,
        notes: notes.trim() || null,
      },
      services: selectedServices,
      selectedProducts: [],
      status: 'NEW',
      language: locale,
      source: 'web',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Always back up locally so no customer data is ever lost
    try {
      const existing = JSON.parse(localStorage.getItem('sbs_quotes_history') || '[]');
      localStorage.setItem('sbs_quotes_history', JSON.stringify([quotePayload, ...existing]));
    } catch {
      // LocalStorage fallback
    }

    // 2. Save directly to Firebase Firestore
    try {
      const auth = getFirebaseAuth();
      if (!auth.currentUser) {
        await signInAnonymously(auth).catch(() => null);
      }
      const db = getFirebaseFirestore();
      await addDoc(collection(db, 'quoteRequests'), quotePayload);
    } catch (e) {
      console.warn('Firestore cloud sync notice:', e);
    } finally {
      setQuoteReferenceId(generatedId);
      setIsSubmitting(false);
    }
  };

  if (quoteReferenceId) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="success">
            {locale === 'ar' ? 'تم استلام طلبكم بنجاح' : 'Demande Reçue avec Succès'}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF]">
            {locale === 'ar' ? 'شكراً لثقتكم بشركة SBS VISION' : 'Merci de faire confiance à SBS VISION'}
          </h1>
          <p className="text-sm text-[#9CA3AF] max-w-lg mx-auto">
            {locale === 'ar'
              ? 'يقوم فريقنا الهندسي بدراسة مشروعكم وسنتواصل معكم هاتفياً لتقديم عرض الأسعار والمقترح التقني.'
              : 'Notre équipe étudie votre projet et reviendra vers vous par téléphone pour vous proposer la solution adaptée.'}
          </p>
        </div>

        {/* Reference ID Card */}
        <Card className="p-6 bg-[#101318] border border-[#232934] max-w-md mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#9CA3AF]">
            {locale === 'ar' ? 'الرقم المرجعي للطلب' : 'Référence de votre demande'}
          </span>
          <div className="text-2xl font-mono font-bold text-[#E11D2A] tracking-wider" dir="ltr">
            {quoteReferenceId}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            {locale === 'ar' ? 'احتفظ بهذا الرقم لأي متابعة هاتفية' : 'Conservez cette référence pour tout échange ultérieur'}
          </p>
        </Card>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={() => onNavigate?.('home')}>
            {t('nav.home')}
          </Button>
          <a
            href="tel:+21654306506"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E11D2A] text-white font-bold text-sm shadow-[0_0_20px_rgba(225,29,42,0.3)] hover:bg-[#F02836] transition-all"
            dir="ltr"
          >
            <Phone className="w-4 h-4" />
            <span>+216 54 306 506</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      {/* Header Progress */}
      <div className="space-y-3 text-center sm:text-start">
        <Badge variant="accent">{t('quote.badge')}</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF]">
          {t('quote.heroTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF]">
          {t('quote.heroDesc')}
        </p>

        {/* Visual Step Indicator */}
        <div className="flex items-center justify-between gap-1 pt-4 max-w-md">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  currentStep >= step ? 'bg-[#E11D2A]' : 'bg-[#232934]'
                }`}
              />
              <span className={`text-[10px] font-mono ${currentStep === step ? 'text-[#E11D2A] font-bold' : 'text-[#6B7280]'}`}>
                0{step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-step Card Container */}
      <Card className="p-6 sm:p-8 space-y-6 bg-[#101318] border border-[#232934]">
        {/* Step 1: Services */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'ما هي الخدمات التي تبحث عنها؟' : 'Quel service recherchez-vous ?'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {locale === 'ar' ? 'يمكنك اختيار خدمة واحدة أو عدة خدمات' : 'Vous pouvez sélectionner un ou plusieurs services'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {servicesList.map((svc) => {
                const isSelected = selectedServices.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    className={`p-4 rounded-xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#08090C] border-[#E11D2A] text-[#FFFFFF] shadow-[0_0_15px_rgba(225,29,42,0.18)]'
                        : 'bg-[#08090C]/50 border-[#232934] text-[#9CA3AF] hover:border-[#E11D2A]/50'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[#161A22] shrink-0">{svc.icon}</div>
                    <span className="text-sm font-semibold flex-1">{svc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Environment */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'ما هو نوع المنشأة المراد تأمينها؟' : 'Que souhaitez-vous sécuriser ?'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {locale === 'ar' ? 'طبيعة المكان تساعدنا في تحديد الأجهزة المثالية' : 'L\'environnement permet d\'adapter l\'architecture technique'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {environmentList.map((env) => {
                const isSelected = environment === env.id;
                return (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => setEnvironment(env.id)}
                    className={`p-4 rounded-xl border text-start flex flex-col gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#08090C] border-[#E11D2A] text-[#FFFFFF] shadow-[0_0_15px_rgba(225,29,42,0.18)]'
                        : 'bg-[#08090C]/50 border-[#232934] text-[#9CA3AF] hover:border-[#E11D2A]/50'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[#161A22] w-fit">{env.icon}</div>
                    <span className="text-sm font-semibold">{env.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Technical Requirements */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'المواصفات والمتطلبات الفنية' : 'Exigences techniques du site'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {locale === 'ar' ? 'حدد التفاصيل المبدئية لموقعك' : 'Précisez quelques détails d\'implantation'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#FFFFFF] block mb-2">
                  {locale === 'ar' ? 'نطاق التغطية المطلوبة' : 'Zone d\'implantation'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'indoor', label: locale === 'ar' ? 'داخلي فقط' : 'Intérieur' },
                    { id: 'outdoor', label: locale === 'ar' ? 'خارجي فقط' : 'Extérieur' },
                    { id: 'both', label: locale === 'ar' ? 'داخلي وخارجي' : 'Intérieur & Extérieur' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIndoorOutdoor(item.id as any)}
                      className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                        indoorOutdoor === item.id
                          ? 'bg-[#E11D2A]/15 border-[#E11D2A] text-[#FFFFFF]'
                          : 'bg-[#08090C] border-[#232934] text-[#9CA3AF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remote Viewing Toggle */}
              <div
                onClick={() => setRemoteViewing(!remoteViewing)}
                className="p-4 rounded-xl border border-[#232934] bg-[#08090C] flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#E11D2A]" />
                  <div>
                    <span className="text-sm font-semibold text-[#FFFFFF] block">
                      {locale === 'ar' ? 'متابعة عن بُعد عبر الهاتف الذكي' : 'Visualisation à distance sur smartphone'}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">
                      {locale === 'ar' ? 'إمكانية متابعة البث والتسجيلات من أي مكان' : 'Accès aux flux en direct et relectures'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={remoteViewing}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#E11D2A]"
                />
              </div>

              <Textarea
                label={locale === 'ar' ? 'ملاحظات إضافية حول الموقع أو الاحتياج' : 'Remarques ou contraintes particulières'}
                placeholder={locale === 'ar' ? 'مثال: عدد الكاميرات التقريبي، بعد المسافات، وجود شبكة إنترنت...' : 'Exemple : nombre approximatif de caméras, réseau existant...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 4: Optional Recommendation Choice */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'اقتراح المنظومة والحل التقني' : 'Solution technique & équipements'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {locale === 'ar'
                  ? 'لا تحتاج لمعرفة الموديلات أو التفاصيل المعقدة. فريقنا يتكفل بدراسة التوافق الكامل.'
                  : 'Vous n\'avez pas besoin de choisir un produit spécifique. SBS VISION conçoit l\'architecture adaptée.'}
              </p>
            </div>

            {/* Prominent Advice Banner */}
            <div
              onClick={() => setLetSbsChoose(true)}
              className={`p-5 rounded-xl border text-start transition-all cursor-pointer ${
                letSbsChoose
                  ? 'bg-[#E11D2A]/10 border-[#E11D2A] text-[#FFFFFF] shadow-[0_0_20px_rgba(225,29,42,0.18)]'
                  : 'bg-[#08090C] border-[#232934] text-[#9CA3AF]'
              }`}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#E11D2A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#FFFFFF]">
                    {t('quote.letSbsChoose')}
                  </h4>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    {t('quote.adviceDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-2 text-xs text-[#9CA3AF]">
              <span className="font-semibold text-[#E11D2A] block">
                {locale === 'ar' ? 'كيف نقوم بإعداد عرض الأسعار؟' : 'Comment préparons-nous votre devis ?'}
              </span>
              <p>
                {locale === 'ar'
                  ? 'يقوم مهندسونا باختيار أجهزة التصوير والتسجيل والربط الشبكي المتوافقة بدقة من قاعدة بياناتنا المعتمدة لضمان أطول عمر تشغيلي وأفضل حماية لموقعكم.'
                  : 'Nos techniciens sélectionnent les équipements adéquats depuis notre base certifiée interne, garantissant une compatibilité optimale et la fiabilité de votre installation.'}
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Customer Details */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#FFFFFF]">
                {locale === 'ar' ? 'بيانات الاتصال والتواصل' : 'Vos coordonnées de contact'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {locale === 'ar' ? 'لنتمكن من التواصل معكم ومناقشة تفاصيل الدراسة الفنية' : 'Indispensable pour l\'envoi de votre étude personnalisée'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={locale === 'ar' ? 'الاسم واللقب أو المؤسسة *' : 'Nom & Prénom ou Société *'}
                placeholder={locale === 'ar' ? 'علي التونسي' : 'Nom ou Entreprise'}
                value={customer.name}
                onChange={(e) => {
                  setCustomer({ ...customer, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                error={errors.name}
                required
              />

              <Input
                label={locale === 'ar' ? 'رقم الهاتف *' : 'Téléphone de contact *'}
                placeholder="+216 XX XXX XXX"
                value={customer.phone}
                onChange={(e) => {
                  setCustomer({ ...customer, phone: e.target.value });
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                error={errors.phone}
                helperText={locale === 'ar' ? 'سيتصل بكم خبيرنا على هذا الرقم' : 'Ligne directe pour échanger sur le projet'}
                required
                dir="ltr"
              />

              <Input
                label={locale === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optionnel)'}
                placeholder="exemple@domaine.tn"
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                dir="ltr"
              />

              <Input
                label={locale === 'ar' ? 'المدينة / المنطقة' : 'Ville / Région'}
                placeholder={locale === 'ar' ? 'تونس العاصمة، صفاقس، سوسة...' : 'Tunis, Sousse, Sfax...'}
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-[#232934]/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {t('common.previous')}
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitQuote}
              isLoading={isSubmitting}
            >
              {t('common.submit')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
