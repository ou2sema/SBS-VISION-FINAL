import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n/context';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { ServicesView } from './components/views/ServicesView';
import { SolutionsView } from './components/views/SolutionsView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { QuoteView } from './components/views/QuoteView';
import { InvoiceView } from './components/views/InvoiceView';
import { PrivacyView } from './components/views/PrivacyView';
import { AdminView } from './components/views/AdminView';
import { initFirebaseEmulators } from './lib/firebase/emulators';
import { getFirebaseAnalytics } from './lib/firebase/config';

function MainApp() {
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.replace(/\/$/, '') === '/admin') {
      return 'admin';
    }
    return 'home';
  });

  useEffect(() => {
    // Check if emulator flag is set
    initFirebaseEmulators();
    // Initialize Google Analytics if supported
    getFirebaseAnalytics();
  }, []);

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-[#FFFFFF] selection:bg-[#E11D2A]/25 selection:text-[#FF4D5A]">
      {/* Global Header */}
      <Header onNavigate={handleNavigate} activeView={activeView} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'home' && <HomeView onNavigate={handleNavigate} />}
        {activeView === 'services' && <ServicesView onNavigate={handleNavigate} />}
        {activeView === 'solutions' && <SolutionsView onNavigate={handleNavigate} />}
        {activeView === 'about' && <AboutView onNavigate={handleNavigate} />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'request-quote' && <QuoteView onNavigate={handleNavigate} />}
        {activeView === 'request-invoice' && <InvoiceView />}
        {activeView === 'privacy' && <PrivacyView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}
