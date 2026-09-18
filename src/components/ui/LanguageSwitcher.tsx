import { useI18n } from '../../i18n/context';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn(
        'inline-flex items-center bg-[#101318] border border-[#232934] rounded-lg p-1 text-xs font-semibold',
        className
      )}
      role="group"
      aria-label="Language selection"
    >
      <div className="flex items-center px-1.5 text-[#6B7280] select-none">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLocale('fr')}
        className={cn(
          'px-2.5 py-1 rounded transition-all duration-150 cursor-pointer',
          locale === 'fr'
            ? 'bg-[#E11D2A] text-white font-bold shadow-sm'
            : 'text-[#9CA3AF] hover:text-[#FFFFFF]'
        )}
        aria-pressed={locale === 'fr'}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale('ar')}
        className={cn(
          'px-2.5 py-1 rounded transition-all duration-150 cursor-pointer',
          locale === 'ar'
            ? 'bg-[#E11D2A] text-white font-bold shadow-sm'
            : 'text-[#9CA3AF] hover:text-[#FFFFFF]'
        )}
        aria-pressed={locale === 'ar'}
      >
        العربية
      </button>
    </div>
  );
}
