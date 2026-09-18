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
              onClick={() => handleNavClick('request-invoice')}
              className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF] hover:text-[#FFFFFF] py-2"
            >
              <FileText className="w-3.5 h-3.5 text-[#E11D2A]" />
              <span>{t('nav.requestInvoice')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
