import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { QuoteRequest, QuoteStatus } from '../../../types';
import { INITIAL_INTERNAL_PRODUCTS } from '../../../lib/data/internalProducts';
import { DevisGeneratorModal } from './DevisGeneratorModal';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Shield,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  X,
  FileText,
  Download,
} from 'lucide-react';

interface QuotesManagerProps {
  quotes: QuoteRequest[];
  onUpdateQuote: (quoteId: string, status: QuoteStatus, internalNotes?: string, assignedTo?: string) => Promise<void>;
  locale: string;
}

export function QuotesManager({ quotes, onUpdateQuote, locale }: QuotesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'ALL'>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  
  // Devis PDF Generator States
  const [devisModalOpen, setDevisModalOpen] = useState(false);
  const [devisTargetQuote, setDevisTargetQuote] = useState<QuoteRequest | null>(null);

  const handleOpenDevis = (q?: QuoteRequest | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDevisTargetQuote(q || null);
    setDevisModalOpen(true);
  };

  const handleMarkAsQuoted = async (quoteId: string) => {
    try {
      await onUpdateQuote(quoteId, 'QUOTED', 'Devis officiel PDF généré et transmis au client');
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote({
          ...selectedQuote,
          status: 'QUOTED',
          internalNotes: 'Devis officiel PDF généré et transmis au client',
          updatedAt: new Date().toISOString(),
        });
        setEditStatus('QUOTED');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Modal Edit States
  const [editStatus, setEditStatus] = useState<QuoteStatus>('NEW');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const statusOptions: { value: QuoteStatus; labelFr: string; labelAr: string; color: string }[] = [
    { value: 'NEW', labelFr: 'Nouveau Devis', labelAr: 'طلب جديد', color: 'bg-[#E11D2A]/15 text-[#FF4D5A] border-[#E11D2A]/30' },
    { value: 'CONTACTED', labelFr: 'Contact Établi', labelAr: 'تم الاتصال', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { value: 'ASSESSMENT', labelFr: 'Visite / Audit sur Site', labelAr: 'معاينة الموقع', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { value: 'QUOTATION_PREPARATION', labelFr: 'Chiffrage en cours', labelAr: 'إعداد التسعير', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { value: 'QUOTED', labelFr: 'Devis Transmis au Client', labelAr: 'تم إرسال العرض', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
    { value: 'WON', labelFr: 'Projet Validé & Installé', labelAr: 'مشروع منجز بنجاح', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    { value: 'LOST', labelFr: 'Sans Suite / Annulé', labelAr: 'ملغى أو مؤجل', color: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30' },
  ];

  const getStatusBadge = (status: QuoteStatus) => {
    const opt = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${opt.color}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {locale === 'ar' ? opt.labelAr : opt.labelFr}
      </span>
    );
  };

  const formatQuoteId = (id?: string | null) => {
    if (!id) return 'SBS-REF';
    const str = String(id);
    return str.startsWith('quote-') ? str.replace('quote-', 'SBS-') : str;
  };

  const filteredQuotes = quotes.filter((q) => {
    if (!q) return false;
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const searchLower = (searchQuery || '').toLowerCase().trim();
    if (!searchLower) return matchesStatus;

    const idStr = String(q.id || '').toLowerCase();
    const nameStr = String(q.customer?.name || '').toLowerCase();
    const phoneStr = String(q.customer?.phone || '');
    const cityStr = String(q.customer?.city || '').toLowerCase();
    const companyStr = String(q.customer?.company || '').toLowerCase();

    const matchesSearch =
      idStr.includes(searchLower) ||
      nameStr.includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      cityStr.includes(searchLower) ||
      companyStr.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setEditStatus(quote.status);
    setEditAssignedTo(quote.assignedTo || '');
    setEditInternalNotes(quote.internalNotes || '');
    setSaveSuccess(false);
  };

  const handleSaveModal = async () => {
    if (!selectedQuote) return;
    setIsSaving(true);
    try {
      await onUpdateQuote(selectedQuote.id, editStatus, editInternalNotes, editAssignedTo);
      // update local selected
      setSelectedQuote({
        ...selectedQuote,
        status: editStatus,
        assignedTo: editAssignedTo,
        internalNotes: editInternalNotes,
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'ar' ? 'بحث بالاسم، رقم الهاتف، أو المدينة...' : 'Recherche par nom, tél, référence, ville...'}
              className="w-full pl-9 pr-4 py-2 bg-[#101318] border border-[#232934] rounded-lg text-xs sm:text-sm text-[#FFFFFF] placeholder-[#6B7280] focus:border-[#E11D2A] focus:outline-none"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenDevis(null)}
            leftIcon={<FileText className="w-4 h-4" />}
            className="whitespace-nowrap shrink-0"
          >
            {locale === 'ar' ? 'إنشاء عرض أسعار (PDF)' : 'Créer un Devis PDF'}
          </Button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border ${
              statusFilter === 'ALL'
                ? 'bg-[#E11D2A] text-white border-[#E11D2A]'
                : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-[#FFFFFF]'
            }`}
          >
            {locale === 'ar' ? 'الكل' : 'Tous'} ({quotes.length})
          </button>
          {statusOptions.slice(0, 5).map((opt) => {
            const count = quotes.filter((q) => q.status === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                  statusFilter === opt.value
                    ? 'bg-[#161A22] text-[#FFFFFF] border-[#E11D2A]'
                    : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-[#FFFFFF]'
                }`}
              >
                {locale === 'ar' ? opt.labelAr : opt.labelFr} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quotes Cards / Table */}
      {filteredQuotes.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#101318] border border-[#232934] mx-auto flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-[#6B7280]" />
          </div>
          <p className="text-sm font-semibold text-[#FFFFFF]">
            {locale === 'ar' ? 'لم يتم العثور على أية طلبات مطابقة' : 'Aucun devis ne correspond aux critères'}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            {locale === 'ar' ? 'جرّب تعديل كلمات البحث أو تصفية الحالة.' : 'Modifiez vos filtres ou effectuez une nouvelle recherche.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((q, idx) => (
            <div
              key={q.id || `quote-${idx}`}
              onClick={() => handleOpenDetail(q)}
              className="p-4 sm:p-5 rounded-xl bg-[#101318] border border-[#232934] hover:border-[#E11D2A]/60 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 group shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#FF4D5A] bg-[#E11D2A]/15 px-2.5 py-0.5 rounded border border-[#E11D2A]/25">
                    {formatQuoteId(q.id)}
                  </span>
                  <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#FF4D5A] transition-colors">
                    {q.customer?.name || (locale === 'ar' ? 'طلب بدون اسم' : 'Client')}
                  </h3>
                  {q.customer?.company && (
                    <span className="text-xs text-[#9CA3AF] bg-[#08090C] px-2 py-0.5 rounded border border-[#232934]">
                      {q.customer.company}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#9CA3AF]">
                  <a
                    href={`tel:${q.customer?.phone || ''}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-[#FFFFFF] hover:text-[#FF4D5A] font-medium"
                    dir="ltr"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E11D2A]" />
                    {q.customer?.phone || '-'}
                  </a>

                  {q.customer?.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                      {q.customer.city}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                    {new Date(q.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-TN' : 'fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {q.assignedTo && (
                    <span className="inline-flex items-center gap-1 text-amber-400/90 font-medium">
                      <User className="w-3.5 h-3.5" />
                      {q.assignedTo}
                    </span>
                  )}
                </div>

                {q.project?.description && (
                  <p className="text-xs text-[#9CA3AF] line-clamp-1 italic">
                    "{q.project.description}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#232934]">
                {getStatusBadge(q.status)}

                <button
                  type="button"
                  onClick={(e) => handleOpenDevis(q, e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161A22] border border-[#232934] hover:border-[#E11D2A] text-xs font-semibold text-[#FFFFFF] hover:text-[#FF4D5A] transition-colors"
                  title={locale === 'ar' ? 'توليد عرض أسعار رسمي للعميل' : 'Générer le devis PDF'}
                >
                  <FileText className="w-3.5 h-3.5 text-[#E11D2A]" />
                  <span>{locale === 'ar' ? 'عرض PDF' : 'Devis PDF'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#E11D2A] group-hover:translate-x-1 transition-transform">
                  <span>{locale === 'ar' ? 'فتح الملف' : 'Gérer'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Detail Modal / Drawer */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#101318] border border-[#232934] rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#232934] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#FF4D5A] bg-[#E11D2A]/15 px-2.5 py-0.5 rounded border border-[#E11D2A]/25">
                    {formatQuoteId(selectedQuote.id)}
                  </span>
                  {getStatusBadge(editStatus)}
                </div>
                <h2 className="text-xl font-bold text-[#FFFFFF] mt-1.5">
                  {selectedQuote.customer?.name || (locale === 'ar' ? 'طلب بدون اسم' : 'Client')}
                </h2>
                <p className="text-xs text-[#9CA3AF]">
                  {locale === 'ar' ? 'تاريخ الاستلام:' : 'Reçu le :'} {new Date(selectedQuote.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="p-1.5 rounded-lg bg-[#08090C] border border-[#232934] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: Generate Official PDF Devis */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#E11D2A]/15 via-[#161A22] to-[#101318] border border-[#E11D2A]/35 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E11D2A] text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(225,29,42,0.4)]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FFFFFF]">
                    {locale === 'ar' ? 'توليد وتحرير عرض أسعار رسمي (PDF) لهذا العميل' : 'Éditer & Générer le Devis PDF Officiel'}
                  </h4>
                  <p className="text-xs text-[#9CA3AF]">
                    {locale === 'ar' ? 'إضافة معدات داهوا أو هيكفيجن، حساب الأداءات، وإرسال الوثيقة للعميل' : 'Chiffrage équipements Dahua / Hikvision, calcul TVA tunisienne et export PDF'}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenDevis(selectedQuote)}
                leftIcon={<FileText className="w-4 h-4" />}
                className="whitespace-nowrap shrink-0"
              >
                {locale === 'ar' ? 'فتح مُنشئ عرض الأسعار' : 'Créer / Générer Devis PDF'}
              </Button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#08090C] border border-[#232934] space-y-1">
                <span className="text-[11px] text-[#9CA3AF] uppercase font-semibold block">
                  {locale === 'ar' ? 'الهاتف' : 'Téléphone'}
                </span>
                <a
                  href={`tel:${selectedQuote.customer?.phone || ''}`}
                  className="text-sm font-bold text-[#E11D2A] hover:underline flex items-center gap-1.5"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {selectedQuote.customer?.phone || '-'}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[#08090C] border border-[#232934] space-y-1">
                <span className="text-[11px] text-[#9CA3AF] uppercase font-semibold block">
                  {locale === 'ar' ? 'المدينة / الموقع' : 'Ville / Localité'}
                </span>
                <span className="text-sm font-semibold text-[#FFFFFF] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                  {selectedQuote.customer?.city || 'Non renseignée'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#08090C] border border-[#232934] space-y-1">
                <span className="text-[11px] text-[#9CA3AF] uppercase font-semibold block">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </span>
                <span className="text-xs text-[#FFFFFF] truncate block" title={selectedQuote.customer?.email || '-'}>
                  {selectedQuote.customer?.email || 'Non renseigné'}
                </span>
              </div>
            </div>

            {/* Project Needs & Technical Requirements */}
            <div className="p-4 rounded-xl bg-[#08090C] border border-[#232934] space-y-3">
              <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
                {locale === 'ar' ? 'تفاصيل الاحتياج والمواصفات المطلوبة' : 'Cahier des charges & Besoins exprimés'}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-[#101318] border border-[#232934]">
                  <span className="text-[#9CA3AF] block text-[10px]">{locale === 'ar' ? 'نوع المنشأة' : 'Environnement'}</span>
                  <span className="font-semibold text-[#FFFFFF] uppercase">{selectedQuote.project?.environment || '-'}</span>
                </div>
                <div className="p-2 rounded bg-[#101318] border border-[#232934]">
                  <span className="text-[#9CA3AF] block text-[10px]">{locale === 'ar' ? 'الموقع' : 'Emplacement'}</span>
                  <span className="font-semibold text-[#FFFFFF]">{selectedQuote.project?.indoorOutdoor || '-'}</span>
                </div>
                <div className="p-2 rounded bg-[#101318] border border-[#232934]">
                  <span className="text-[#9CA3AF] block text-[10px]">{locale === 'ar' ? 'المراقبة عن بُعد' : 'Vision Mobile'}</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedQuote.project?.remoteViewing ? (locale === 'ar' ? 'مطلوبة' : 'Oui (Inclus)') : 'Non'}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#101318] border border-[#232934]">
                  <span className="text-[#9CA3AF] block text-[10px]">{locale === 'ar' ? 'تقدير الكاميرات' : 'Nb Caméras'}</span>
                  <span className="font-semibold text-[#FFFFFF]">{selectedQuote.project?.cameraCount || 'À étudier'}</span>
                </div>
              </div>

              {selectedQuote.project?.description && (
                <div className="p-3 rounded-lg bg-[#101318] border border-[#232934] text-xs text-[#9CA3AF] leading-relaxed">
                  <span className="font-bold text-[#FFFFFF] block mb-1">
                    {locale === 'ar' ? 'وصف العميل للموقع:' : 'Note du client :'}
                  </span>
                  {selectedQuote.project.description}
                </div>
              )}
            </div>

            {/* Status & Technician Management Controls */}
            <div className="p-5 rounded-xl bg-[#161A22] border border-[#232934] space-y-4">
              <h4 className="text-xs font-bold text-[#E11D2A] uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {locale === 'ar' ? 'إدارة حالة الملف والتكليف الداخلي' : 'Suivi Opérationnel & Affectation'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#FFFFFF]">
                    {locale === 'ar' ? 'تغيير مرحلة الطلب' : 'Statut du devis'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as QuoteStatus)}
                    className="w-full bg-[#08090C] text-[#FFFFFF] border border-[#232934] rounded-lg px-3 py-2 text-xs focus:border-[#E11D2A] focus:outline-none font-semibold"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {locale === 'ar' ? opt.labelAr : opt.labelFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#FFFFFF]">
                    {locale === 'ar' ? 'التقني / التجاري المسؤول' : 'Responsable / Technicien affecté'}
                  </label>
                  <input
                    type="text"
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    placeholder="Ex: Ing. Mohamed (Tech 1) / Amira"
                    className="w-full bg-[#08090C] text-[#FFFFFF] border border-[#232934] rounded-lg px-3 py-2 text-xs focus:border-[#E11D2A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#FFFFFF]">
                  {locale === 'ar' ? 'ملاحظات داخلية لفريق SBS VISION' : 'Notes internes de suivi (Technique & Commercial)'}
                </label>
                <textarea
                  rows={3}
                  value={editInternalNotes}
                  onChange={(e) => setEditInternalNotes(e.target.value)}
                  placeholder={locale === 'ar' ? 'سجل تفاصيل المكالمة، موعد المعاينة أو المعدات المقترحة...' : 'Détaillez le compte-rendu d\'appel, la date de visite sur site ou les spécificités d\'installation...'}
                  className="w-full bg-[#08090C] text-[#FFFFFF] border border-[#232934] rounded-lg p-3 text-xs focus:border-[#E11D2A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {locale === 'ar' ? 'تم الحفظ والتحديث بنجاح' : 'Modifications enregistrées !'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedQuote(null)}>
                    {locale === 'ar' ? 'إغلاق' : 'Fermer'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveModal}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? (locale === 'ar' ? 'جارٍ الحفظ...' : 'Enregistrement...')
                      : (locale === 'ar' ? 'حفظ التحديثات' : 'Sauvegarder les modifications')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Devis PDF Generator Modal */}
      <DevisGeneratorModal
        quote={devisTargetQuote}
        isOpen={devisModalOpen}
        onClose={() => setDevisModalOpen(false)}
        onMarkAsQuoted={handleMarkAsQuoted}
        locale={locale}
      />
    </div>
  );
}
