import React from 'react';
import { useI18n } from '../../i18n/context';
import { Phone, ArrowUpRight, Lock } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Logo } from '../ui/Logo';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t, locale } = useI18n();

  return (
    <footer className="w-full border-t border-[#232934] bg-[#050608] text-[#9CA3AF] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="space-y-4">
            <div
              className="cursor-pointer select-none"
              onClick={() => onNavigate?.('home')}
            >
              <Logo variant="horizontal" size="sm" showTagline theme="dark" />
            </div>
            <p className="text-sm leading-relaxed text-[#9CA3AF]">
              {t('brand.subheadline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Lock className="w-3.5 h-3.5 text-[#E11D2A]" />
              <span>{t('footer.bilingualNote')}</span>
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FFFFFF]">
              {t('nav.services')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('services')}
                  className="hover:text-[#E11D2A] transition-colors text-start"
                >
                  {t('services.cctv.title')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('services')}
                  className="hover:text-[#E11D2A] transition-colors text-start"
                >
                  {t('services.alarm.title')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('services')}
                  className="hover:text-[#E11D2A] transition-colors text-start"
                >
                  {t('services.access_control.title')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('services')}
                  className="hover:text-[#E11D2A] transition-colors text-start"
                >
                  {t('services.intercom.title')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('services')}
                  className="hover:text-[#E11D2A] transition-colors text-start"
                >
                  {t('services.networking.title')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('services')}
                  className="hover:text-[#E11D2A] transition-colors text-start"
                >
                  {t('services.installation_maintenance.title')}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Solutions & Demands */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FFFFFF]">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('request-quote')}
                  className="text-[#E11D2A] font-medium hover:underline flex items-center gap-1"
                >
                  <span>{t('nav.requestQuote')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('solutions')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  {t('nav.solutions')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('request-invoice')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  {t('nav.requestInvoice')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('privacy')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  {t('footer.privacy')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct Phone */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FFFFFF]">
              {t('nav.contact')}
            </h4>
            <p className="text-sm text-[#9CA3AF]">
              {locale === 'ar'
                ? 'لأي استفسار أو طلب دراسة فنية مباشرة، يمكنكم الاتصال بالرقم:'
                : 'Pour toute demande d’étude ou d’intervention rapide, contactez directement nos experts :'}
            </p>
            <a
              href="tel:+21654306506"
              className="inline-flex items-center gap-2 text-base font-bold text-[#E11D2A] bg-[#101318] border border-[#232934] px-4 py-2.5 rounded-lg hover:border-[#E11D2A] transition-all"
              dir="ltr"
            >
              <Phone className="w-4 h-4" />
              <span>+216 54 306 506</span>
            </a>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#232934]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} SBS VISION. {t('footer.rights')}</p>
          <p>{locale === 'ar' ? 'تونس — حلول أمنية وتجهيزات احترافية' : 'Tunisie — Solutions de sécurité & intégration technologique'}</p>
        </div>
      </div>
    </footer>
  );
}
