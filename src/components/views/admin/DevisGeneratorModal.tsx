import React, { useState, useMemo } from 'react';
import { QuoteRequest, DevisData, DevisItem } from '../../../types';
import { INITIAL_INTERNAL_PRODUCTS } from '../../../lib/data/internalProducts';
import {
  downloadDevisPDF,
  uploadDevisPDF,
  buildDevisWhatsAppUrl,
  buildDevisMailtoUrl,
} from '../../../lib/services/pdfService';
import { Button } from '../../ui/Button';
import {
  FileText,
  Download,
  Send,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Building,
  User,
  Phone,
  MapPin,
  Calendar,
  Percent,
  Calculator,
  Eye,
  Sparkles,
} from 'lucide-react';

interface DevisGeneratorModalProps {
  quote?: QuoteRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsQuoted?: (quoteId: string) => Promise<void>;
  locale: string;
}

export function DevisGeneratorModal({
  quote,
  isOpen,
  onClose,
  onMarkAsQuoted,
  locale,
}: DevisGeneratorModalProps) {
  if (!isOpen) return null;

  // Initialize quote number
  const defaultQuoteNum = useMemo(() => {
    if (quote?.id) {
      const clean = quote.id.replace('quote-', '').toUpperCase();
      return `DEV-2026-${clean.slice(0, 5)}`;
    }
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `DEV-2026-${rand}`;
  }, [quote?.id]);

  // Client Metadata
  const [quoteNumber, setQuoteNumber] = useState(defaultQuoteNum);
  const [customerName, setCustomerName] = useState(quote?.customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(quote?.customer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(quote?.customer?.email || '');
  const [customerCompany, setCustomerCompany] = useState(quote?.customer?.company || '');
  const [customerAddress, setCustomerAddress] = useState(quote?.customer?.city || 'Tunis, Tunisie');
  const [projectType, setProjectType] = useState(
    quote?.project?.environment
      ? `Système de Sécurité & Vidéosurveillance (${quote.project.environment})`
      : 'Fourniture & Installation Vidéosurveillance Dahua / Hikvision'
  );
  const [validityDays, setValidityDays] = useState(30);
  const [paymentTerms, setPaymentTerms] = useState('50% à la commande, solde à la mise en service');
  const [notes, setNotes] = useState(
    quote?.project?.description ? `Spécifications client : ${quote.project.description}` : ''
  );

  // Initial Line Items derived from quote or default Dahua / Hikvision kit
  const [items, setItems] = useState<DevisItem[]>(() => {
    if (quote?.selectedProducts && quote.selectedProducts.length > 0) {
      return quote.selectedProducts.map((p, idx) => {
        const catalogMatch = INITIAL_INTERNAL_PRODUCTS.find((cp) => cp.id === p.productId);
        const price = catalogMatch?.internalSellingPrice || 350;
        return {
          id: `item-${idx + 1}`,
          reference: p.modelSnapshot || catalogMatch?.model || `REF-${idx + 1}`,
          designation: p.nameSnapshot || catalogMatch?.name || 'Équipement de sécurité',
          brand: p.brandSnapshot || catalogMatch?.brand || 'Dahua',
          quantity: p.quantity || 1,
          unitPriceHT: price,
          totalHT: (p.quantity || 1) * price,
        };
      });
    }

    // Default attractive Dahua 4K kit proposal
    return [
      {
        id: 'item-1',
        reference: 'DH-IPC-HFW3549T1-AS-PV',
        designation: 'Caméra Dahua TiOC 2.0 5MP Dissuasion Active (Flash & Sirène 110dB + Full-Color)',
        brand: 'Dahua',
        quantity: 4,
        unitPriceHT: 470,
        totalHT: 1880,
      },
      {
        id: 'item-2',
        reference: 'DHI-NVR4216-16P-4KS2/I',
        designation: 'Enregistreur NVR Dahua WizSense 16 Canaux 4K avec 16 Ports PoE Plug & Play',
        brand: 'Dahua',
        quantity: 1,
        unitPriceHT: 1250,
        totalHT: 1250,
      },
      {
        id: 'item-3',
        reference: 'WD43PURZ-4TB',
        designation: 'Disque Dur Western Digital Purple 4TB Surveillance Spécial 24/7 AllFrame',
        brand: 'Western Digital',
        quantity: 1,
        unitPriceHT: 380,
        totalHT: 380,
      },
      {
        id: 'item-4',
        reference: 'CAT6-CU-305M',
        designation: 'Câblage Réseau 100% Cuivre Pur Cat6 UTP + Connecteurs RJ45 blindés',
        brand: 'SBS Certified',
        quantity: 1,
        unitPriceHT: 260,
        totalHT: 260,
      },
      {
        id: 'item-5',
        reference: 'MO-INST-CFG',
        designation: 'Main d\'œuvre spécialisée : Pose, tirage de câbles, orientation & paramétrage DMSS Mobile',
        brand: 'SBS VISION',
        quantity: 1,
        unitPriceHT: 350,
        totalHT: 350,
      },
    ];
  });

  // Selected catalog item for quick add
  const [selectedCatalogId, setSelectedCatalogId] = useState('');

  // Commercial discounts & taxes
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [tvaRate, setTvaRate] = useState<number>(19);
  const [timbreFiscal] = useState<number>(1.0); // 1.000 DT in Tunisia

  // Toast status
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSavingPdf, setIsSavingPdf] = useState(false);

  // Financial calculations
  const subtotalHT = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.totalHT || 0), 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return 0;
    return (subtotalHT * discountPercent) / 100;
  }, [subtotalHT, discountPercent]);

  const netHT = useMemo(() => {
    return Math.max(0, subtotalHT - discountAmount);
  }, [subtotalHT, discountAmount]);

  const tvaAmount = useMemo(() => {
    return (netHT * tvaRate) / 100;
  }, [netHT, tvaRate]);

  const totalTTC = useMemo(() => {
    return netHT + tvaAmount + timbreFiscal;
  }, [netHT, tvaAmount, timbreFiscal]);

  // Assembled devis object
  const currentDevisData: DevisData = useMemo(() => {
    return {
      quoteNumber,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      validityDays,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCompany,
      projectType,
      items,
      subtotalHT,
      discountPercent,
      discountAmount,
      netHT,
      tvaRate,
      tvaAmount,
      timbreFiscal,
      totalTTC,
      paymentTerms,
      notes,
    };
  }, [
    quoteNumber,
    validityDays,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    customerCompany,
    projectType,
    items,
    subtotalHT,
    discountPercent,
    discountAmount,
    netHT,
    tvaRate,
    tvaAmount,
    timbreFiscal,
    totalTTC,
    paymentTerms,
    notes,
  ]);

  // Handlers for item modifications
  const handleItemChange = (id: string, field: keyof DevisItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === 'quantity' || field === 'unitPriceHT') {
          const qty = field === 'quantity' ? Number(value) : it.quantity;
          const price = field === 'unitPriceHT' ? Number(value) : it.unitPriceHT;
          updated.totalHT = qty * price;
        }
        return updated;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleAddCustomLine = () => {
    const newItem: DevisItem = {
      id: `item-${Date.now()}`,
      reference: 'ACC-SPEC',
      designation: 'Équipement ou prestation personnalisée',
      brand: 'SBS',
      quantity: 1,
      unitPriceHT: 100,
      totalHT: 100,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleAddCatalogProduct = () => {
    if (!selectedCatalogId) return;
    const prod = INITIAL_INTERNAL_PRODUCTS.find((p) => p.id === selectedCatalogId);
    if (!prod) return;

    const newItem: DevisItem = {
      id: `item-${Date.now()}`,
      reference: prod.model || prod.id,
      designation: prod.name,
      brand: prod.brand || 'Dahua',
      quantity: 1,
      unitPriceHT: prod.internalSellingPrice || 250,
      totalHT: prod.internalSellingPrice || 250,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedCatalogId('');
  };

  const handleAddStandardService = (serviceName: string, price: number) => {
    const newItem: DevisItem = {
      id: `item-${Date.now()}`,
      reference: 'SERV-SBS',
      designation: serviceName,
      brand: 'SBS VISION',
      quantity: 1,
      unitPriceHT: price,
      totalHT: price,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Export Actions
  const handleDownloadPDF = async () => {
    if (!quote?.id) {
      setIsSavingPdf(true);
      try {
        downloadDevisPDF(currentDevisData);
        setStatusMessage('Le PDF a été généré et téléchargé localement : aucun devis source n’est associé.');
      } catch (error) {
        console.error('Could not generate PDF locally:', error);
        setStatusMessage('Échec du téléchargement local du PDF. Réessayez.');
      } finally {
        setIsSavingPdf(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
      return;
    }

    setIsSavingPdf(true);
    try {
      const uploadResult = await uploadDevisPDF(quote.id, currentDevisData);
      downloadDevisPDF(currentDevisData);
      setStatusMessage(
        uploadResult.metadataSynced
          ? 'Le PDF a été enregistré dans le stockage cloud et téléchargé avec succès !'
          : 'Le PDF a été enregistré et téléchargé. La fiche Firestore n’a pas pu être mise à jour.'
      );
    } catch (error) {
      console.error('Could not save quote PDF to cloud storage:', error);
      setStatusMessage('Échec de l’enregistrement cloud du PDF. Vérifiez la configuration Supabase et réessayez.');
    } finally {
      setIsSavingPdf(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleSendWhatsApp = () => {
    const url = buildDevisWhatsAppUrl(currentDevisData);
    window.open(url, '_blank');
    if (quote?.id && onMarkAsQuoted) {
      onMarkAsQuoted(quote.id);
    }
  };

  const handleSendEmail = () => {
    const url = buildDevisMailtoUrl(currentDevisData);
    window.location.href = url;
    if (quote?.id && onMarkAsQuoted) {
      onMarkAsQuoted(quote.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#101318] border border-[#232934] rounded-2xl p-5 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232934] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E11D2A]/15 border border-[#E11D2A]/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#FF4D5A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#FFFFFF]">
                  {locale === 'ar' ? 'إنشاء وتوليد عرض أسعار رسمي (PDF)' : 'Création & Génération de Devis PDF'}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E11D2A]/20 text-[#FF4D5A] border border-[#E11D2A]/30 font-bold">
                  SBS VISION
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                {locale === 'ar'
                  ? 'قم بإعداد التسعير، حساب الأداءات، وتنزيل الوثيقة الرسمية بختم وشعار الشركة'
                  : 'Chiffrage détaillé, calcul de la TVA tunisienne et export avec logo officiel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#08090C] border border-[#232934] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Alert Notification */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Form Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Client Details & Quote Parameters */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-3">
              <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#E11D2A]" />
                {locale === 'ar' ? 'بيانات العميل والمشروع' : 'Coordonnées du Client & Objet du Devis'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'رقم عرض الأسعار' : 'N° Devis'}
                  </label>
                  <input
                    type="text"
                    value={quoteNumber}
                    onChange={(e) => setQuoteNumber(e.target.value)}
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] font-mono focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'اسم العميل / المستفيد' : 'Nom complet du Client'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: M. Karim Ben Salem"
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+216 ..."
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] font-mono focus:border-[#E11D2A] focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email (optionnel)'}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="client@domaine.tn"
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'الشركة / المؤسسة' : 'Entreprise / Société'}
                  </label>
                  <input
                    type="text"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="Ex: Société Alpha Sarl"
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'المدينة / العنوان' : 'Ville / Localité du site'}
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Ex: La Marsa, Tunis / Sousse"
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                  {locale === 'ar' ? 'موضوع ومجال المشروع' : 'Objet / Description du Projet'}
                </label>
                <input
                  type="text"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Col 3: Parameters & Quick Add Service */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-3">
              <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-3.5 h-3.5 text-[#E11D2A]" />
                {locale === 'ar' ? 'إعدادات الصلاحية والأداءات' : 'Validité & Conditions'}
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'مدة صلاحية العرض' : 'Validité de l\'offre'}
                  </label>
                  <select
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  >
                    <option value={15}>15 jours</option>
                    <option value={30}>30 jours (Standard)</option>
                    <option value={60}>60 jours</option>
                    <option value={90}>90 jours</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'نسبة الأداء على القيمة المضافة' : 'Taux de TVA (Tunisie)'}
                  </label>
                  <select
                    value={tvaRate}
                    onChange={(e) => setTvaRate(Number(e.target.value))}
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  >
                    <option value={19}>19% (Standard Matériel & Services)</option>
                    <option value={7}>7% (Taux Réduit)</option>
                    <option value={0}>0% (Exonération / Export)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'تخفيض تجاري (%)' : 'Remise Commerciale (%)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#9CA3AF] block mb-1">
                    {locale === 'ar' ? 'شروط الدفع' : 'Conditions de paiement'}
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-[#101318] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table & Add Tools */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E11D2A]" />
              {locale === 'ar' ? 'المعدات والخدمات المندرجة في التسعير' : 'Équipements & Prestations Incluses'}
            </h3>

            {/* Quick Catalog Inserter */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
                className="bg-[#08090C] border border-[#232934] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none max-w-xs"
              >
                <option value="">-- Insérer un produit Dahua / Hikvision --</option>
                {INITIAL_INTERNAL_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.brand}] {p.name} ({p.internalSellingPrice} DT)
                  </option>
                ))}
              </select>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddCatalogProduct}
                disabled={!selectedCatalogId}
              >
                <Plus className="w-3.5 h-3.5" />
                {locale === 'ar' ? 'إضافة من الكتالوج' : 'Ajouter'}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleAddCustomLine}>
                <Plus className="w-3.5 h-3.5 text-[#E11D2A]" />
                {locale === 'ar' ? 'سطر مخصص' : 'Ligne libre'}
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-[#232934] bg-[#08090C]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#161A22] text-[#9CA3AF] uppercase font-bold border-b border-[#232934] text-[10px]">
                <tr>
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3 w-32">Réf. / Modèle</th>
                  <th className="p-3 min-w-[240px]">Désignation & Détails</th>
                  <th className="p-3 w-28">Marque</th>
                  <th className="p-3 w-20 text-center">Qté</th>
                  <th className="p-3 w-28 text-right">P.U. HT (DT)</th>
                  <th className="p-3 w-28 text-right">Total HT (DT)</th>
                  <th className="p-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232934]">
                {items.map((it, idx) => (
                  <tr key={it.id} className="hover:bg-[#101318]/60 transition-colors">
                    <td className="p-3 text-center text-[#9CA3AF] font-mono">{idx + 1}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.reference}
                        onChange={(e) => handleItemChange(it.id, 'reference', e.target.value)}
                        className="w-full bg-[#101318] border border-[#232934] rounded px-2 py-1 text-xs text-[#FFFFFF] font-mono focus:border-[#E11D2A] focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.designation}
                        onChange={(e) => handleItemChange(it.id, 'designation', e.target.value)}
                        className="w-full bg-[#101318] border border-[#232934] rounded px-2 py-1 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.brand}
                        onChange={(e) => handleItemChange(it.id, 'brand', e.target.value)}
                        className="w-full bg-[#101318] border border-[#232934] rounded px-2 py-1 text-xs text-[#E11D2A] font-semibold focus:border-[#E11D2A] focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => handleItemChange(it.id, 'quantity', Math.max(1, Number(e.target.value)))}
                        className="w-full bg-[#101318] border border-[#232934] rounded px-2 py-1 text-xs text-[#FFFFFF] text-center font-bold focus:border-[#E11D2A] focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.5"
                        min={0}
                        value={it.unitPriceHT}
                        onChange={(e) => handleItemChange(it.id, 'unitPriceHT', Number(e.target.value))}
                        className="w-full bg-[#101318] border border-[#232934] rounded px-2 py-1 text-xs text-[#FFFFFF] text-right font-mono focus:border-[#E11D2A] focus:outline-none"
                      />
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#FFFFFF]">
                      {it.totalHT.toFixed(3)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-[#9CA3AF] hover:text-[#FF4D5A] p-1 rounded transition-colors"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#9CA3AF]">
            <span className="font-semibold text-[#FFFFFF] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D2A]" />
              {locale === 'ar' ? 'خدمات سريعة شائعة:' : 'Prestations recommandées :'}
            </span>
            <button
              type="button"
              onClick={() => handleAddStandardService('Câblage structuré & goulottes PVC haute résistance', 180)}
              className="px-2.5 py-1 rounded-full bg-[#101318] border border-[#232934] hover:border-[#E11D2A] text-[#FFFFFF] transition-colors"
            >
              + Goulottes & Câblage (180 DT)
            </button>
            <button
              type="button"
              onClick={() => handleAddStandardService('Configuration NVR 4K, switch PoE et DMSS smartphone', 120)}
              className="px-2.5 py-1 rounded-full bg-[#101318] border border-[#232934] hover:border-[#E11D2A] text-[#FFFFFF] transition-colors"
            >
              + Paramétrage Mobile DMSS (120 DT)
            </button>
            <button
              type="button"
              onClick={() => handleAddStandardService('Onduleur Line Interactive 1000VA protection anti-foudre', 290)}
              className="px-2.5 py-1 rounded-full bg-[#101318] border border-[#232934] hover:border-[#E11D2A] text-[#FFFFFF] transition-colors"
            >
              + Onduleur 1000VA (290 DT)
            </button>
          </div>
        </div>

        {/* Financial Summary & Total Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-2">
          <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-2 text-xs">
            <h4 className="font-bold text-[#FFFFFF] uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {locale === 'ar' ? 'الضمانات الرسمية المتضمنة بالـ PDF' : 'Garanties & Engagements Inclus'}
            </h4>
            <ul className="space-y-1 text-[#9CA3AF] text-[11px]">
              <li>• Garantie constructeur 2 ans (Dahua / Hikvision certifié).</li>
              <li>• Câblage certifié 100% cuivre désoxygéné (norme CCTV).</li>
              <li>• Support d'assistance prioritaire 7j/7 assuré par les techniciens SBS.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#161A22] border border-[#232934] space-y-2 text-xs">
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Sous-total Brut HT :</span>
              <span className="font-mono text-[#FFFFFF]">{subtotalHT.toFixed(3)} DT</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Remise commerciale ({discountPercent}%) :</span>
                <span className="font-mono">-{discountAmount.toFixed(3)} DT</span>
              </div>
            )}

            <div className="flex justify-between text-[#9CA3AF] border-t border-[#232934] pt-1">
              <span>Total Net HT :</span>
              <span className="font-mono text-[#FFFFFF]">{netHT.toFixed(3)} DT</span>
            </div>

            <div className="flex justify-between text-[#9CA3AF]">
              <span>T.V.A. ({tvaRate}%) :</span>
              <span className="font-mono text-[#FFFFFF]">{tvaAmount.toFixed(3)} DT</span>
            </div>

            <div className="flex justify-between text-[#9CA3AF]">
              <span>Timbre Fiscal :</span>
              <span className="font-mono text-[#FFFFFF]">{timbreFiscal.toFixed(3)} DT</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-[#FFFFFF] bg-[#08090C] p-2.5 rounded-lg border border-[#E11D2A]/40 mt-1">
              <span className="text-[#FF4D5A]">TOTAL TTC NET À PAYER :</span>
              <span className="font-mono text-base text-[#FFFFFF]">{totalTTC.toFixed(3)} TND</span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#232934]">
          <div className="text-xs text-[#9CA3AF]">
            {locale === 'ar' ? 'الوثيقة جاهزة للتوليد مع الشعار والختم' : 'PDF prêt avec logo haute définition SBS VISION'}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadPDF}
              disabled={isSavingPdf}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {isSavingPdf
                ? (locale === 'ar' ? 'جارٍ الحفظ...' : 'Enregistrement...')
                : (locale === 'ar' ? 'تحميل ملف PDF' : 'Enregistrer & télécharger le PDF')}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleSendWhatsApp}
              leftIcon={<Send className="w-4 h-4 text-emerald-400" />}
              className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
            >
              {locale === 'ar' ? 'إرسال عبر واتساب' : 'Envoyer par WhatsApp'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleSendEmail}
              leftIcon={<Mail className="w-4 h-4 text-sky-400" />}
            >
              {locale === 'ar' ? 'إرسال بالبريد' : 'Envoyer par Email'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
