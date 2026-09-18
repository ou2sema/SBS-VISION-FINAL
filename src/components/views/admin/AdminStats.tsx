import { Card } from '../../ui/Card';
import { QuoteRequest } from '../../../types';
import { Inbox, PhoneCall, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminStatsProps {
  quotes: QuoteRequest[];
  locale: string;
}

export function AdminStats({ quotes, locale }: AdminStatsProps) {
  const total = quotes.length;
  const newCount = quotes.filter((q) => q.status === 'NEW').length;
  const inProgressCount = quotes.filter((q) =>
    ['CONTACTED', 'ASSESSMENT', 'QUOTATION_PREPARATION'].includes(q.status)
  ).length;
  const wonCount = quotes.filter((q) => q.status === 'WON').length;
  const quotedCount = quotes.filter((q) => q.status === 'QUOTED').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-[#101318] border border-[#232934] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9CA3AF]">
            {locale === 'ar' ? 'إجمالي الطلبات' : 'Total Demandes'}
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
            <Inbox className="w-4 h-4 text-[#FFFFFF]" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#FFFFFF]">{total}</span>
          <span className="text-[11px] text-[#9CA3AF]">
            {locale === 'ar' ? 'مشروع مسجل' : 'dossiers'}
          </span>
        </div>
      </Card>

      <Card className="p-4 bg-[#101318] border border-[#E11D2A]/30 relative overflow-hidden shadow-[0_0_20px_rgba(225,29,42,0.06)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#E11D2A] flex items-center gap-1.5">
            {newCount > 0 && <span className="w-2 h-2 rounded-full bg-[#E11D2A] animate-ping" />}
            {locale === 'ar' ? 'طلبات جديدة بحاجة لاتصال' : 'Nouveaux à Contacter'}
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#E11D2A]/10 border border-[#E11D2A]/30 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-[#E11D2A]" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#E11D2A]">{newCount}</span>
          <span className="text-[11px] text-[#9CA3AF]">
            {locale === 'ar' ? 'أولوية قصوى' : 'à traiter'}
          </span>
        </div>
      </Card>

      <Card className="p-4 bg-[#101318] border border-[#232934] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9CA3AF]">
            {locale === 'ar' ? 'قيد الدراسة والمُعاينة' : 'Étude & Devis en Cours'}
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#08090C] border border-[#232934] flex items-center justify-center">
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#FFFFFF]">{inProgressCount + quotedCount}</span>
          <span className="text-[11px] text-[#9CA3AF]">
            {quotedCount} {locale === 'ar' ? 'عروض مرسلة' : 'devis envoyés'}
          </span>
        </div>
      </Card>

      <Card className="p-4 bg-[#101318] border border-[#232934] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9CA3AF]">
            {locale === 'ar' ? 'مشاريع مُنجزة ومثبتة' : 'Projets Concrétisés'}
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-emerald-400">{wonCount}</span>
          <span className="text-[11px] text-[#9CA3AF]">
            {total > 0 ? Math.round((wonCount / total) * 100) : 0}% {locale === 'ar' ? 'نسبة النجاح' : 'taux transfo'}
          </span>
        </div>
      </Card>
    </div>
  );
}
