

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TenantProvider } from './contexts/TenantContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import HowItWorksPage from './components/HowItWorksPage';
import NotFoundPage from './components/NotFoundPage';
import BlogIndexPage from './src/components/BlogIndexPage';
import BlogPostPage from './src/components/BlogPostPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import ScrollToTopButton from './components/ScrollToTopButton';
import LoadingOverlay from './components/LoadingOverlay';
import OfflineStatus from './components/OfflineStatus';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import SafariCompatibilityFix from './components/SafariCompatibilityFix';
import PlanningWizardPage from './components/PlanningWizardPage';
import WizardPreloader from './components/WizardPreloader';
import analyticsService from './services/analyticsService';
import safariErrorHandlingService from './services/safariErrorHandlingService';
import './src/index.css';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar Safari
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  useEffect(() => {
    // Safari-specific loading timing
    const loadingTime = isSafari ? 1200 : 800;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    // Verificar consentimiento de cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    }

    // Initialize Safari error handling if needed
    if (safariErrorHandlingService.isSafariBrowser()) {
      console.log('Safari detected - error handling initialized');
    }

    return () => clearTimeout(timer);
  }, [isSafari]);

  // Analytics: Track page views - CON RETRASO EN SAFARI
  useEffect(() => {
    const trackPageView = async () => {
      // Retrasar analytics en Safari para evitar bloqueos
      if (isSafari) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const title = document.title || 'BoatTrip Planner';
      const path = location.pathname;
      const referrer = document.referrer;
      
      await analyticsService.trackPageView(path, title, referrer);
    };

    // Solo trackear si no está cargando
    if (!isLoading) {
      trackPageView();
    }
  }, [location.pathname, isLoading, isSafari]);

  // Analytics: Track app events - CON RETRASO EN SAFARI
  useEffect(() => {
    const trackAppEvents = async () => {
      // Retrasar analytics en Safari
      if (isSafari) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Track app load
      await analyticsService.trackEvent('app_load', 'engagement', 'app_loaded', 'BoatTrip Planner');
      
      // Track navigation
      if (location.pathname !== '/') {
        await analyticsService.trackNavigation('/', location.pathname);
      }
    };

    if (!isLoading) {
      trackAppEvents();
    }
  }, [isLoading, location.pathname, isSafari]);

  const handleCookieConsent = async () => {
    // Track cookie consent
    await analyticsService.trackEvent('cookie_consent', 'privacy', 'cookies_accepted', 'user_consent');
    localStorage.setItem('cookie-consent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleCookieDecline = async () => {
    // Track cookie decline
    await analyticsService.trackEvent('cookie_consent', 'privacy', 'cookies_declined', 'user_decline');
    localStorage.setItem('cookie-consent', 'declined');
    setShowCookieConsent(false);
  };

  const handleStartPlanning = async () => {
    // Navigate immediately for better UX
    navigate('/planning');
    
    // Track planning start after navigation (non-blocking)
    analyticsService.trackButtonClick('start_planning', 'homepage').catch(console.warn);
  };

  const handleNavigateHome = async () => {
    // Track home navigation
    await analyticsService.trackNavigation(location.pathname, '/');
    // Navigate to home
    navigate('/');
  };

  const handleNavigateToPost = async (slug: string) => {
    // Track blog post navigation
    await analyticsService.trackNavigation(location.pathname, `/blog/${slug}`);
    // Navigate to specific blog post
    navigate(`/blog/${slug}`);
  };

  const handleNavigateToBlogIndex = async () => {
    // Track blog index navigation
    await analyticsService.trackNavigation(location.pathname, '/blog');
    // Navigate to blog index
    navigate('/blog');
  };

  if (isLoading) {
    return <LoadingOverlay message="Cargando BoatTrip Planner..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage onStartPlanning={handleStartPlanning} />} />
          <Route path="/planning" element={<PlanningWizardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/blog" element={<BlogIndexPage onNavigateToPost={handleNavigateToPost} onNavigateHome={handleNavigateHome} />} />
          <Route path="/blog/:slug" element={<BlogPostPage slug={null} onNavigateToBlogIndex={handleNavigateToBlogIndex} onNavigateHome={handleNavigateHome} onNavigateToPost={handleNavigateToPost} />} />
          <Route path="*" element={<NotFoundPage onNavigateHome={handleNavigateHome} />} />
        </Routes>
      </main>
      
      <Footer />
      
      {/* Componentes PWA - CONDICIONALES EN SAFARI */}
      {!isSafari && <OfflineStatus className="fixed top-20 right-4 z-40 hidden md:block" />}
      {!isSafari && <PWAInstallPrompt />}
      
      {/* Componentes de UI */}
      <ScrollToTopButton />
      
      {/* Preloader para componentes del wizard */}
      <WizardPreloader />
      
      {showCookieConsent && (
        <CookieConsentBanner 
          onAccept={handleCookieConsent}
          onDecline={handleCookieDecline}
          onShowPrivacyPolicy={() => setShowPrivacyPolicy(true)}
          onShowTermsOfService={() => setShowTermsOfService(true)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <TenantProvider>
      <SafariCompatibilityFix>
        <PerformanceOptimizer>
          <Router>
            <AppContent />
          </Router>
        </PerformanceOptimizer>
      </SafariCompatibilityFix>
    </TenantProvider>
  );
}

export default App;