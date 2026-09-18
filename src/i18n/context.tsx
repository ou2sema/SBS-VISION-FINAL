import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Locale } from '../types';
import frData from './fr.json';
import arData from './ar.json';

type Translations = typeof frData;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: 'ltr' | 'rtl';
  t: (keyPath: string, fallback?: string) => string;
}

const translations: Record<Locale, Translations> = {
  fr: frData,
  ar: arData as unknown as Translations,
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sbs_locale');
      if (saved === 'ar' || saved === 'fr') return saved;
      if (typeof navigator !== 'undefined' && typeof navigator.language === 'string' && navigator.language.startsWith('ar')) {
        return 'ar';
      }
    }
    return 'fr';
  });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sbs_locale', newLocale);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
      if (locale === 'ar') {
        document.documentElement.classList.add('font-arabic');
        document.documentElement.classList.remove('font-sans');
      } else {
        document.documentElement.classList.add('font-sans');
        document.documentElement.classList.remove('font-arabic');
      }
    }
  }, [locale, dir]);

  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let current: unknown = translations[locale];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to French if translation is missing in the current locale
        let fbCurrent: unknown = translations.fr;
        for (const fbKey of keys) {
          if (fbCurrent && typeof fbCurrent === 'object' && fbKey in (fbCurrent as Record<string, unknown>)) {
            fbCurrent = (fbCurrent as Record<string, unknown>)[fbKey];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof fbCurrent === 'string' ? fbCurrent : (fallback || keyPath);
      }
    }

    return typeof current === 'string' ? current : (fallback || keyPath);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
