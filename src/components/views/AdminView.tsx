import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/context';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AdminStats } from './admin/AdminStats';
import { QuotesManager } from './admin/QuotesManager';
import { InternalCatalogManager } from './admin/InternalCatalogManager';
import { InvoiceRequestsManager } from './admin/InvoiceRequestsManager';
import { QuoteRequest, QuoteStatus, AdminProfile } from '../../types';
import {
  fetchAllQuotes,
  updateQuoteStatus,
  listenToQuotes,
} from '../../lib/services/quotesService';
import {
  subscribeToAdminAuth,
  signInAdminWithEmail,
  registerAdminWithEmail,
  signInAdminWithGoogle,
  signOutAdmin,
  pushQuotesToFirestore,
} from '../../lib/services/adminAuthService';
import type { User } from 'firebase/auth';
import {
  Lock,
  Shield,
  LogOut,
  Package,
  FileText,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  KeyRound,
  Inbox,
  RefreshCw,
  Database,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function AdminView() {
  const { locale } = useI18n();

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLocalSession, setIsLocalSession] = useState(() => {
    return localStorage.getItem('sbs_admin_auth') === 'true';
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'quotes' | 'catalog' | 'invoices' | 'security'>('quotes');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('ou2sema@gmail.com');
  const [loginPass, setLoginPass] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Firestore Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Firestore Rules copy state
  const [copied, setCopied] = useState(false);

  const isAuthenticated = Boolean(currentUser || isLocalSession);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user, profile) => {
      setCurrentUser(user);
      setAdminProfile(profile);
      setIsAuthLoading(false);
      if (user) {
        setIsLocalSession(false);
        localStorage.setItem('sbs_admin_auth', 'true');
        localStorage.setItem('sbs_admin_user', user.email || '');
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Quotes
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial fetch
    fetchAllQuotes().then((res) => {
      setQuotes(res);
    });

    // Real-time listener
    const unsubscribe = listenToQuotes((updated) => {
      setQuotes(updated);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      setAuthError(
        locale === 'ar'
          ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
          : 'Veuillez saisir votre email et mot de passe.'
      );
      return;
    }

    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      if (authMode === 'login') {
        await signInAdminWithEmail(loginEmail, loginPass);
      } else {
        await registerAdminWithEmail(loginEmail, loginPass);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        setAuthError(
          locale === 'ar'
            ? 'بيانات تسجيل الدخول غير صحيحة. يمكنك إنشاء حساب جديد أو استخدام حساب Google.'
            : 'Identifiants invalides. Si ce compte n\'existe pas encore dans Firebase, cliquez sur "Créer le compte".'
        );
      } else if (msg.includes('auth/weak-password')) {
        setAuthError(
          locale === 'ar'
            ? 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.'
            : 'Le mot de passe doit contenir au moins 6 caractères.'
        );
      } else if (msg.includes('auth/email-already-in-use')) {
        setAuthError(
          locale === 'ar'
            ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول مباشرة.'
            : 'Cet email est déjà enregistré. Veuillez vous connecter.'
        );
      } else {
        setAuthError(msg);
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setIsSubmittingAuth(true);
    try {
      await signInAdminWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('auth/popup-closed-by-user')) {
        setAuthError(
          locale === 'ar'
            ? `خطأ في تسجيل الدخول بواسطة Google: ${msg}`
            : `Erreur de connexion Google: ${msg}. Assurez-vous d'avoir activé le fournisseur Google dans la console Firebase.`
        );
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLocalDemoLogin = () => {
    setIsLocalSession(true);
    localStorage.setItem('sbs_admin_auth', 'true');
    localStorage.setItem('sbs_admin_user', 'admin@sbsvision.tn');
    setAuthError(null);
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch {
      // Signout error fallback
    }
    setCurrentUser(null);
    setAdminProfile(null);
    setIsLocalSession(false);
    localStorage.removeItem('sbs_admin_auth');
    localStorage.removeItem('sbs_admin_user');
  };

  const handlePushQuotesToFirestore = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    try {
      const res = await pushQuotesToFirestore();
      setSyncNotice(
        locale === 'ar'
          ? `تم بنجاح مزامنة ${res.pushedCount} طلب في مجموعة Firestore 'quoteRequests' !`
          : `Succès : ${res.pushedCount} devis enregistrés dans la collection Firestore 'quoteRequests' !`
      );
      const updated = await fetchAllQuotes();
      setQuotes(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncNotice(
        locale === 'ar'
          ? `تنبيه عند المزامنة: ${msg}`
          : `Note de synchronisation Firestore : ${msg}`
      );
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const handleUpdateQuote = async (
    quoteId: string,
    status: QuoteStatus,
    internalNotes?: string,
    assignedTo?: string
  ) => {
    await updateQuoteStatus(quoteId, status, internalNotes, assignedTo);
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              status,
              internalNotes: internalNotes !== undefined ? internalNotes : q.internalNotes,
              assignedTo: assignedTo !== undefined ? assignedTo : q.assignedTo,
              updatedAt: new Date().toISOString(),
            }
          : q
      )
    );
  };

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isBootstrappedAdmin() {
      return isAuthenticated() && (
        request.auth.token.email == 'ou2sema@gmail.com' ||
        request.auth.token.email == 'admin@sbsvision.tn'
      );
    }

    function isAdmin() {
      return isAuthenticated() && (
        isBootstrappedAdmin() ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) ||
        request.auth.token.role == 'admin'
      );
    }

    function isStaff() {
      return isAuthenticated() && (
        isAdmin() ||
        exists(/databases/$(database)/documents/staff/$(request.auth.uid)) ||
        request.auth.token.role == 'staff'
      );
    }

    // Profils Admins dans Firestore
    match /admins/{adminId} {
      allow read: if isAuthenticated() && (isAdmin() || request.auth.uid == adminId);
      allow create, update: if isAuthenticated() && (
        isAdmin() ||
        (request.auth.uid == adminId && isBootstrappedAdmin())
      );
      allow delete: if isAdmin();
    }

    // Demandes de devis clients
    match /quoteRequests/{quoteId} {
      allow create: if request.resource.data.customer.name is string &&
                       request.resource.data.customer.phone is string;
      allow read: if isStaff() || (isAuthenticated() && resource.data.customer.userId == request.auth.uid);
      allow update: if isStaff();
      allow delete: if isAdmin();
    }

    // Demandes de factures
    match /invoiceRequests/{requestId} {
      allow create: if request.resource.data.name is string &&
                       request.resource.data.phone is string;
      allow read, update: if isStaff();
      allow delete: if isAdmin();
    }

    // Catalogue Interne : Strictement réservé au staff
    match /products/{productId} {
      allow read: if isStaff();
      allow write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#E11D2A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#9CA3AF] font-mono">
          {locale === 'ar' ? 'جاري التحقق من هوية المسؤول في Firebase...' : 'Vérification de la session Firebase Auth...'}
        </p>
      </div>
    );
  }

  // LOGIN SCREEN FOR UNAUTHENTICATED USERS
  if (!isAuthenticated) {
    return (
      <div className="py-10 max-w-md mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#101318] border border-[#232934] mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(225,29,42,0.15)]">
            <Lock className="w-8 h-8 text-[#E11D2A]" />
          </div>

          <Badge variant="accent">
            {locale === 'ar' ? 'بوابة إدارة مؤمنة' : 'Authentification Firebase Sécurisée'}
          </Badge>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF]">
            {locale === 'ar' ? 'بوابة إدارة SBS VISION' : 'Espace Administration SBS VISION'}
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            {locale === 'ar'
              ? 'تسجيل الدخول يربط حسابك مباشرة بـ Firebase Auth وقاعدة بيانات Firestore (المجموعة admins).'
              : 'Connexion directe avec Firebase Authentication et synchronisation du profil dans Firestore (collection admins).'}
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 bg-[#101318] border border-[#232934]">
          {/* Google One-Click Login */}
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-center bg-[#151921] hover:bg-[#1C222D] border-[#2A313E] text-white py-2.5"
            onClick={handleGoogleAuth}
            disabled={isSubmittingAuth}
            leftIcon={
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            }
          >
            {locale === 'ar' ? 'تسجيل الدخول باستخدام Google' : 'Continuer avec Google (Admin)'}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#232934]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#101318] px-2 text-[#9CA3AF]">
                {locale === 'ar' ? 'أو عبر البريد المهني' : 'Ou par identifiant Firebase'}
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#FFFFFF]">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ou2sema@gmail.com"
                  className="w-full bg-[#08090C] border border-[#232934] rounded-lg px-3.5 py-2.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none pl-9"
                />
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#FFFFFF]">
                  {locale === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                <span className="text-[10px] text-[#9CA3AF]">
                  {authMode === 'register' ? 'Min. 6 caractères' : ''}
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#08090C] border border-[#232934] rounded-lg px-3.5 py-2.5 text-xs text-[#FFFFFF] focus:border-[#E11D2A] focus:outline-none pl-9"
                />
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              disabled={isSubmittingAuth}
            >
              {isSubmittingAuth ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{locale === 'ar' ? 'جاري التحقق...' : 'Vérification en cours...'}</span>
                </div>
              ) : authMode === 'login' ? (
                locale === 'ar' ? 'تسجيل الدخول إلى الإدارة' : 'Se connecter à l\'Espace Admin'
              ) : (
                locale === 'ar' ? 'إنشاء حساب المسؤول الجديد' : 'Créer le compte Administrateur'
              )}
            </Button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError(null);
                }}
                className="text-[#E11D2A] hover:underline"
              >
                {authMode === 'login'
                  ? (locale === 'ar' ? 'إنشاء حساب جديد في Firebase؟' : 'Créer un nouveau compte Firebase ?')
                  : (locale === 'ar' ? 'الرجوع إلى تسجيل الدخول' : 'Déjà un compte ? Se connecter')}
              </button>
            </div>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#232934]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#101318] px-2 text-[#9CA3AF]">
                {locale === 'ar' ? 'بيئة الاختبار المحلية' : 'Accès Rapide Démo'}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs text-[#9CA3AF] hover:text-[#FFFFFF] border border-[#232934]"
            onClick={handleLocalDemoLogin}
            leftIcon={<KeyRound className="w-4 h-4 text-emerald-400" />}
          >
            {locale === 'ar' ? 'دخول مباشر كمسؤول تجريبي (وضع محلي)' : 'Accéder en Session Démo Locale'}
          </Button>
        </Card>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="py-6 space-y-6">
      {/* Top Banner & Staff Info Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#101318] border border-[#232934]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E11D2A]/10 border border-[#E11D2A]/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#E11D2A]" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-[#FFFFFF]">
                {locale === 'ar' ? 'لوحة تحكم SBS VISION' : 'Espace Administration SBS VISION'}
              </h1>

              {currentUser ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase Auth : {currentUser.email}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {locale === 'ar' ? 'جلسة تجريبية محلية' : 'Session Démo Locale'}
                </span>
              )}

              {adminProfile && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  <Database className="w-3 h-3" />
                  Firestore: admins/{adminProfile.uid.slice(0, 6)}...
                </span>
              )}
            </div>

            <p className="text-xs text-[#9CA3AF]">
              {currentUser
                ? `Connecté en tant que ${adminProfile?.role || 'Admin'} • Fournisseur : ${adminProfile?.provider || 'Firebase'}`
                : "Mode session staff locale. Connectez-vous avec Firebase pour persister les rôles dans Firestore."}
            </p>
          </div>
        </div>

        {/* Sync & Logout Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePushQuotesToFirestore}
            disabled={isSyncing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />}
            className="text-xs border-[#2A313E] hover:border-blue-500/50"
          >
            {isSyncing
              ? (locale === 'ar' ? 'جاري المزامنة...' : 'Synchronisation...')
              : (locale === 'ar' ? 'مزامنة مع Firestore' : 'Synchroniser avec Firestore')}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4 text-[#E11D2A]" />}
            className="text-xs"
          >
            {locale === 'ar' ? 'خروج' : 'Déconnexion'}
          </Button>
        </div>
      </div>

      {/* Sync feedback notification */}
      {syncNotice && (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center justify-between gap-2 transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
          <a
            href="https://console.firebase.google.com/project/sbs-vision-fc4d6/firestore/databases/-default-/data"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 underline font-medium"
          >
            <span>Voir dans Firebase Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* High-Level KPIs */}
      <AdminStats quotes={quotes} locale={locale} />

      {/* Main Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232934] overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
            activeTab === 'quotes'
              ? 'border-[#E11D2A] text-[#FFFFFF] bg-[#101318]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#FFFFFF]'
          }`}
        >
          <Inbox className="w-4 h-4 text-[#E11D2A]" />
          <span>{locale === 'ar' ? 'متابعة عروض الأسعار' : 'Gestion des Devis'}</span>
          <span className="px-1.5 py-0.5 rounded bg-[#08090C] text-[10px] font-mono border border-[#232934]">
            {quotes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
            activeTab === 'catalog'
              ? 'border-[#E11D2A] text-[#FFFFFF] bg-[#101318]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#FFFFFF]'
          }`}
        >
          <Package className="w-4 h-4 text-[#E11D2A]" />
          <span>{locale === 'ar' ? 'الكتالوج الداخلي المشفر' : 'Catalogue Équipements Interne'}</span>
          <span className="px-1.5 py-0.5 rounded bg-[#E11D2A]/15 text-[#FF4D5A] text-[10px] font-bold border border-[#E11D2A]/30">
            {locale === 'ar' ? 'سري' : 'Staff Only'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
            activeTab === 'invoices'
              ? 'border-[#E11D2A] text-[#FFFFFF] bg-[#101318]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#FFFFFF]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#E11D2A]" />
          <span>{locale === 'ar' ? 'طلبات الفواتير' : 'Demandes de Factures'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
            activeTab === 'security'
              ? 'border-[#E11D2A] text-[#FFFFFF] bg-[#101318]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#FFFFFF]'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>{locale === 'ar' ? 'أذونات وقواعد Firestore' : 'Règles Firestore & Config'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'quotes' && (
        <QuotesManager
          quotes={quotes}
          onUpdateQuote={handleUpdateQuote}
          locale={locale}
        />
      )}

      {activeTab === 'catalog' && (
        <InternalCatalogManager locale={locale} />
      )}

      {activeTab === 'invoices' && (
        <InvoiceRequestsManager locale={locale} />
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-[#101318] border border-[#232934]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232934] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF]">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>
                  {locale === 'ar' ? 'إعداد أذونات وقواعد أمان Firestore' : 'Règles de Sécurité Firestore (Permission Check)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://console.firebase.google.com/project/sbs-vision-fc4d6/firestore/rules"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E11D2A] hover:underline font-medium"
                >
                  <span>{locale === 'ar' ? 'فتح Firebase Console' : 'Ouvrir Firebase Console'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Button variant="secondary" size="sm" onClick={copyRules} className="text-xs">
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{locale === 'ar' ? 'تم النسخ' : 'Copié !'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{locale === 'ar' ? 'نسخ القواعد' : 'Copier les règles'}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              {locale === 'ar'
                ? 'لحماية الكتالوج الداخلي والبيانات الحساسة مع السماح للعملاء بإرسال طلبات عروض الأسعار وحفظ المسؤولين في مجموعة admins، تأكد من تحديث القواعد في وحدة تحكم Firebase.'
                : 'Pour autoriser la synchronisation des profils administrateurs dans la collection admins tout en protégeant le catalogue interne, publiez ces règles dans l\'onglet "Rules" de votre console Firebase.'}
            </p>

            <pre className="p-4 rounded-xl bg-[#08090C] text-xs font-mono text-[#FF4D5A] overflow-x-auto border border-[#232934] leading-relaxed">
              {firestoreRulesText}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}

