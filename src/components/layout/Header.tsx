import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Phone, Menu, X, ChevronRight, FileText, Shield } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface HeaderProps {
  onNavigate?: (view: string) => void;
  activeView?: string;
}

export function Header({ onNavigate, activeView = 'home' }: HeaderProps) {
  const { t, locale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [invoiceHelpOpen, setInvoiceHelpOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'solutions', label: t('nav.solutions') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') },
    { id: 'admin', label: t('nav.admin'), isAdmin: true },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate?.(viewId);
    setMobileMenuOpen(false);
  };

  const openInvoiceHelp = () => {
    setInvoiceHelpOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#232934] bg-[#08090C]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official SBS VISION Vector Logo */}
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => handleNavClick('home')}
          >
            <Logo
              variant="horizontal"
              size="md"
              showTagline
              theme="dark"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer inline-flex items-center gap-1.5 ${
                  activeView === item.id
                    ? 'text-[#E11D2A] bg-[#101318] border border-[#232934] font-semibold'
                    : item.isAdmin
                    ? 'text-[#FFFFFF] bg-[#161A22] border border-[#232934] hover:border-[#E11D2A]/60 font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#101318]'
                }`}
              >
                {item.isAdmin && <Shield className="w-3.5 h-3.5 text-[#E11D2A]" />}
                <span>{item.label}</span>
                {item.isAdmin && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A] animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Header Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Business Phone CTA */}
            <a
              href="tel:+21654306506"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#101318] border border-[#232934] text-[#FFFFFF] text-sm font-semibold hover:border-[#E11D2A]/60 transition-all group"
              dir="ltr"
            >
              <Phone className="w-4 h-4 text-[#E11D2A] group-hover:scale-110 transition-transform" />
              <span className="font-mono tracking-tight text-xs lg:text-sm">+216 54 306 506</span>
            </a>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Primary Quote CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick('request-quote')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {t('nav.requestQuote')}
            </Button>
            <button
              type="button"
              onClick={openInvoiceHelp}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#FFFFFF] bg-[#101318] border border-[#232934] hover:border-[#E11D2A]/60 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-[#E11D2A]" />
              {t('nav.requestInvoice')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#101318] border border-[#232934]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#232934] bg-[#08090C] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-start px-3.5 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                  activeView === item.id
                    ? 'text-[#E11D2A] bg-[#101318] font-semibold border border-[#232934]'
                    : item.isAdmin
                    ? 'text-[#FFFFFF] bg-[#161A22] border border-[#232934]'
                    : 'text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#101318]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isAdmin && <Shield className="w-4 h-4 text-[#E11D2A]" />}
                  <span>{item.label}</span>
                </div>
                {item.isAdmin && (
                  <span className="text-[10px] uppercase font-bold text-[#E11D2A] bg-[#E11D2A]/10 px-2 py-0.5 rounded border border-[#E11D2A]/20">
                    Staff
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#232934] flex flex-col gap-2.5">
            <a
              href="tel:+21654306506"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#101318] border border-[#232934] text-[#FFFFFF] text-sm font-semibold"
              dir="ltr"
            >
              <Phone className="w-4 h-4 text-[#E11D2A]" />
              <span className="font-mono">+216 54 306 506</span>
            </a>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => handleNavClick('request-quote')}
            >
              {t('nav.requestQuote')}
            </Button>

            <button
              type="button"
              onClick={openInvoiceHelp}
              className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF] hover:text-[#FFFFFF] py-2"
            >
              <FileText className="w-3.5 h-3.5 text-[#E11D2A]" />
              <span>{t('nav.requestInvoice')}</span>
            </button>
          </div>
        </div>
      )}

      {invoiceHelpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#101318] border border-[#232934] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#E11D2A] text-xs font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  {locale === 'ar' ? 'طلب فاتورة' : 'Demande de facture'}
                </div>
                <h2 className="mt-2 text-xl font-bold text-white">
                  {locale === 'ar' ? 'أين تجد رقم الفاتورة؟' : 'Préparez votre référence de devis'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceHelpOpen(false)}
                className="p-2 rounded-lg border border-[#232934] text-[#9CA3AF] hover:text-white"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[#9CA3AF]">
              {locale === 'ar'
                ? 'أدخل رقم المرجع الموجود في عرض السعر أو المثال أدناه.'
                : 'Le numéro demandé se trouve sur votre devis, dans la zone de référence du document.'}
            </p>

            <div className="rounded-xl border border-[#232934] bg-[#08090C] p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#6B7280]">
                <span>SBS VISION</span>
                <span>Exemple de devis</span>
              </div>
              <div className="border-t border-[#232934] pt-3 flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-white">Devis / Offre commerciale</span>
                <span className="rounded-md bg-[#E11D2A] px-3 py-1.5 font-mono text-sm font-bold text-white ring-4 ring-[#E11D2A]/20">
                  SBS-2026-5434
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF]">
                {locale === 'ar' ? 'هذا الرقم هو المرجع الذي يجب إدخاله في النموذج.' : 'C’est cette référence qu’il faut saisir dans le formulaire.'}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setInvoiceHelpOpen(false)}>
                {locale === 'ar' ? 'إلغاء' : 'Fermer'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setInvoiceHelpOpen(false);
                  handleNavClick('request-invoice');
                }}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {locale === 'ar' ? 'متابعة الطلب' : 'Continuer la demande'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
