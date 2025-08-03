

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UserPreferences, Recommendation, ChatMessage, AppChatSession, AppView, CookieConsentStatus, WeatherData } from './types';
import { APP_TITLE, GEMINI_MODEL_NAME, AD_CLIENT_ID, AD_SLOT_ID_BANNER_CONTENT, BLOG_TITLE, DEFAULT_APP_DESCRIPTION, BLOG_INDEX_DESCRIPTION, BASE_URL } from './constants';
import UserInputForm from './components/UserInputForm';
import RecommendationCard from './components/RecommendationCard';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import CookieConsentBanner from './components/CookieConsentBanner';
import AdSlot from './components/AdSlot'; 
import NotFoundPage from './components/NotFoundPage';
import BlogIndexPage from './src/components/BlogIndexPage';
import BlogPostPage from './src/components/BlogPostPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import AndroidCompatibilityAlert from './components/AndroidCompatibilityAlert';
import LoadingOverlay from './components/LoadingOverlay';
import LandingPage from './components/LandingPage';
import AppInstallBanner from './components/AppInstallBanner';
import AppInstallTab from './components/AppInstallTab';


import { generateBoatTripRecommendationStream, constructPrompt } from './services/geminiService';

import { getWeatherData } from './services/weatherService';
import { GoogleGenAI } from "@google/genai";
import { allBlogPosts } from './src/blogData';


interface LocationForWeather {
  cityName: string;
  countryCode: string;
  regionName?: string;
}

const loadingMessages = [
  "Consultando las estrellas para tu ruta... ✨",
  "Ajustanto las velas por ti... ⛵",
  "Navegando por un mar de ideas... 🌊",
  "Buscando tesoros de recomendación... 💎",
  "Zarpando hacia la creatividad... ⚓",
  "Cartografiando tu aventura perfecta... 🗺️",
  "Afinando los instrumentos de navegación... 🧭",
  "Descifrando los vientos del destino... 💨",
  "Pescando los mejores consejos para ti... 🎣",
  "Explorando horizontes digitales... 🌅"
];

const updateGtagConsent = (granted: boolean) => {
  if (typeof (window as any).gtag !== 'function') {
    // gtag might not be loaded yet, e.g., due to an ad blocker.
    // The default is already set to 'denied' in index.html, so this is safe.
    console.warn("gtag function not found. Consent update skipped.");
    return;
  }
  const consentState = granted ? 'granted' : 'denied';
  (window as any).gtag('consent', 'update', {
    'ad_storage': consentState,
    'ad_user_data': consentState,
    'ad_personalization': consentState,
    'analytics_storage': consentState
  });
};

const getViewAndSlugFromLocation = (): { view: AppView; slug: string | null } => {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view') as AppView | null;
  const slugParam = params.get('slug');



  switch (viewParam) {
    case AppView.BLOG_POST:
      if (slugParam) {
        const postExists = allBlogPosts.some(p => p.frontmatter.slug === slugParam);
        return postExists ? { view: AppView.BLOG_POST, slug: slugParam } : { view: AppView.NOT_FOUND, slug: null };
      }
      return { view: AppView.NOT_FOUND, slug: null }; 
    case AppView.BLOG_INDEX:
      return { view: AppView.BLOG_INDEX, slug: null };
    case AppView.MAIN_APP:
      return { view: AppView.MAIN_APP, slug: null };
    case AppView.NOT_FOUND:
      return { view: AppView.NOT_FOUND, slug: null};
    default:
      if (!viewParam) return { view: AppView.MAIN_APP, slug: null };
      return { view: AppView.NOT_FOUND, slug: null };
  }
};


const App: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recommendationRef = useRef<HTMLDivElement>(null);
  const [activeChatSession, setActiveChatSession] = useState<AppChatSession | null>(null);

  // Efecto para actualizar el favicon dinámicamente
  useEffect(() => {
    const updateFavicon = () => {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = '/favicon-96x96.png?v=2025';
      }
      
      // Actualizar también el shortcut icon
      const shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
      if (shortcutIcon) {
        shortcutIcon.href = '/favicon-96x96.png?v=2025';
      }
    };

    updateFavicon();
  }, []);
  
  const initialNavigationState = getViewAndSlugFromLocation();
  const [currentView, setCurrentView] = useState<AppView>(initialNavigationState.view);
  const [currentBlogPostSlug, setCurrentBlogPostSlug] = useState<string | null>(initialNavigationState.slug);
  
  // Solo mostrar landing page si estamos en MAIN_APP y no hay parámetros en la URL
  const [showLandingPage, setShowLandingPage] = useState(
    initialNavigationState.view === AppView.MAIN_APP && !window.location.search
  );

  // Función para limpiar el estado de la aplicación
  const clearAppState = useCallback(() => {
    setRecommendation(null);
    setError(null);
    setIsGenerating(false);
    setIsLoadingRecommendation(false);
    setActiveChatSession(null);
  }, []);



  const geminiApiKey = import.meta.env.VITE_API_KEY || "MISSING_API_KEY";
  const aiInstance = useRef(new GoogleGenAI({ apiKey: geminiApiKey }));

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentStatus>(CookieConsentStatus.PENDING);
  const [showAds, setShowAds] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [showAppInstallBanner, setShowAppInstallBanner] = useState(false);

  const handleReopenAppInstallBanner = useCallback(() => {
    setShowAppInstallBanner(true);
  }, []);

  const handleTabClose = useCallback(() => {
    // Cuando se cierra la pestaña, centrar el contenido
    // Esto se maneja automáticamente con las transiciones CSS existentes
    console.log('Pestaña de instalación cerrada - centrando contenido');
  }, []);

  // Manejar la lógica del banner de instalación
  useEffect(() => {
    // Función para verificar si la app está instalada
    const checkIfAppInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true ||
             localStorage.getItem('appInstalled') === 'true';
    };

    // Verificar si la app ya está instalada
    const isAppInstalled = checkIfAppInstalled();
    
    // Verificar si el usuario ya cerró el banner
    const hasUserClosedBanner = localStorage.getItem('appInstallBannerClosed') === 'true';
    
    // Mostrar el banner si no está instalada y no lo cerró
    if (!isAppInstalled && !hasUserClosedBanner) {
      setShowAppInstallBanner(true);
    } else if (isAppInstalled) {
      // Si está instalada, asegurar que el banner esté oculto
      setShowAppInstallBanner(false);
    }

    // Escuchar el evento appinstalled para ocultar el banner permanentemente
    const handleAppInstalled = () => {
      console.log('App instalada - ocultando banner permanentemente');
      setShowAppInstallBanner(false);
      localStorage.setItem('appInstalled', 'true');
      localStorage.removeItem('appInstallBannerClosed');
    };

    // Escuchar cambios en el display-mode
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log('Display mode cambiado a standalone - ocultando banner');
        setShowAppInstallBanner(false);
        localStorage.setItem('appInstalled', 'true');
        localStorage.removeItem('appInstallBannerClosed');
      }
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);


  const updateURL = useCallback((view: AppView, slug: string | null = null) => {
    let newPath = '/';
    const state = { view, slug };
    const params = new URLSearchParams();

    if (view === AppView.MAIN_APP) {
        // For main app, URL should be just '/'
    } else if (view === AppView.BLOG_INDEX) {
      params.set('view', AppView.BLOG_INDEX);
      newPath = `/?${params.toString()}`;
    } else if (view === AppView.BLOG_POST && slug) {
      params.set('view', AppView.BLOG_POST);
      params.set('slug', slug);
      newPath = `/?${params.toString()}`;
    } else if (view === AppView.NOT_FOUND) {
      params.set('view', AppView.NOT_FOUND);
      newPath = `/?${params.toString()}`;
    }
    
    const currentFullPath = window.location.pathname + window.location.search;
    if (currentFullPath !== newPath) {
      window.history.pushState(state, '', newPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        setCurrentBlogPostSlug(event.state.slug || null);
      } else {
        const { view: urlView, slug: urlSlug } = getViewAndSlugFromLocation();
        setCurrentView(urlView);
        setCurrentBlogPostSlug(urlSlug);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Limpiar estado de la aplicación cuando se navega a la vista principal
  useEffect(() => {
    if (currentView === AppView.MAIN_APP) {
      clearAppState();
    }
  }, [currentView, clearAppState]);

  // Detectar si la página se cargó desde caché - DESHABILITADO para mejor UX
  // useEffect(() => {
  //   const handlePageShow = (event: PageTransitionEvent) => {
  //     if (event.persisted) {
  //       console.log('Página cargada desde caché, recargando...');
  //       window.location.reload();
  //     }
  //   };

  //   window.addEventListener('pageshow', handlePageShow);
  //   return () => window.removeEventListener('pageshow', handlePageShow);
  // }, []); 

  // Service Worker update handling - Optimizado para mejor UX
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker actualizado - nueva versión disponible');
        // En lugar de recargar automáticamente, podrías mostrar una notificación
        // Para ahora solo loggeamos para evitar recargas innecesarias
      });
    }
  }, []);


  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent === CookieConsentStatus.ACCEPTED) {
      updateGtagConsent(true);
      setCookieConsent(CookieConsentStatus.ACCEPTED);
      setShowAds(true);
    } else if (storedConsent === CookieConsentStatus.DECLINED) {
      updateGtagConsent(false);
      setCookieConsent(CookieConsentStatus.DECLINED);
      setShowAds(false);
    }
     else {
      // Default consent is already set to denied in index.html, no need to call update
      setCookieConsent(CookieConsentStatus.PENDING);
      setShowAds(false);
    }
  }, []);

  const handleCookieConsent = useCallback(() => {
    localStorage.setItem('cookieConsent', CookieConsentStatus.ACCEPTED);
    updateGtagConsent(true);
    setCookieConsent(CookieConsentStatus.ACCEPTED);
    setShowAds(true);
  }, []);

  const handleCookieDecline = useCallback(() => {
    localStorage.setItem('cookieConsent', CookieConsentStatus.DECLINED);
    updateGtagConsent(false);
    setCookieConsent(CookieConsentStatus.DECLINED);
    setShowAds(false);
  }, []);

  const handleReconsiderCookies = useCallback(() => {
    setCookieConsent(CookieConsentStatus.PENDING); 
  }, []);


  useEffect(() => {
    if (showPrivacyModal || showTermsModal || cookieConsent === CookieConsentStatus.PENDING) {
      return;
    }
    const performScrollToTop = () => window.scrollTo(0, 0);

    if (currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST) {
      const timerId = setTimeout(performScrollToTop, 50); 
      return () => clearTimeout(timerId);
    } else if ( (currentView === AppView.MAIN_APP && !isGenerating && !recommendation?.text && !isLoadingRecommendation) ||
                currentView === AppView.NOT_FOUND ) {
      performScrollToTop();
    }
  }, [currentView, currentBlogPostSlug, isGenerating, isLoadingRecommendation, recommendation, showPrivacyModal, showTermsModal, cookieConsent]);


  useEffect(() => {
    let newTitle = APP_TITLE;
    let newDescription = DEFAULT_APP_DESCRIPTION;
    let canonicalPath = '/';
    let currentOgImage = `${BASE_URL}/og-image.png`;
    let isNotFoundState = false;
    
    const defaultPublisher = {
        "@type": "Organization",
        "name": APP_TITLE,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/apple-touch-icon.png`
        }
    };

    let structuredData: any = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": APP_TITLE,
        "description": DEFAULT_APP_DESCRIPTION,
        "applicationCategory": "TravelApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 support, JavaScript",
        "url": BASE_URL,
        "image": currentOgImage,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
        },
        "keywords": "planificador de barcos, alquiler de barcos, viajes en barco, IA, planificación de viajes, náutica, vacaciones en barco, itinerarios náuticos, blog de nautica, consejos de navegacion, destinos nauticos",
        "publisher": defaultPublisher
    };


    switch (currentView) {
        case AppView.BLOG_INDEX:
            newTitle = `${BLOG_TITLE} | ${APP_TITLE}`;
            newDescription = BLOG_INDEX_DESCRIPTION;
            canonicalPath = '/?view=blog_index';
            structuredData = {
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": BLOG_TITLE,
                "description": BLOG_INDEX_DESCRIPTION,
                "url": `${BASE_URL}${canonicalPath}`,
                "publisher": defaultPublisher,
                "image": currentOgImage,
            };
            break;
        case AppView.BLOG_POST:
            const post = currentBlogPostSlug ? allBlogPosts.find(p => p.frontmatter.slug === currentBlogPostSlug) : null;
            if (post) {
                newTitle = `${post.frontmatter.title} | ${BLOG_TITLE}`;
                newDescription = post.frontmatter.summary;
                canonicalPath = `/?view=blog_post&slug=${currentBlogPostSlug}`;
                currentOgImage = post.frontmatter.featuredImage ? `${BASE_URL}${post.frontmatter.featuredImage}` : currentOgImage;
                
                let authorData: any = defaultPublisher; 
                if (post.frontmatter.author && post.frontmatter.author !== 'El Equipo de BoatTrip Planner') {
                    authorData = {
                        "@type": "Person",
                        "name": post.frontmatter.author
                    };
                }

                structuredData = {
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `${BASE_URL}${canonicalPath}`
                    },
                    "headline": post.frontmatter.title,
                    "description": post.frontmatter.summary,
                    "image": {
                        "@type": "ImageObject",
                        "url": currentOgImage,
                    },
                    "author": authorData,
                    "publisher": defaultPublisher,
                    "datePublished": post.frontmatter.date,
                    "dateModified": post.frontmatter.date, 
                    "keywords": post.frontmatter.tags ? post.frontmatter.tags.join(', ') : undefined,
                    "url": `${BASE_URL}${canonicalPath}`
                };
            } else {
                 isNotFoundState = true; 
            }
            break;
        case AppView.NOT_FOUND:
            isNotFoundState = true;
            break;
        default: 
            break;
    }

    if (isNotFoundState) {
        newTitle = `Página No Encontrada | ${APP_TITLE}`;
        newDescription = "La página que buscas no existe en BoatTrip Planner.";
        canonicalPath = `/?view=${AppView.NOT_FOUND}`;
        currentOgImage = `${BASE_URL}/og-image.png`; 
        structuredData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": newTitle,
            "description": newDescription,
            "url": `${BASE_URL}${canonicalPath}`,
            "image": currentOgImage,
            "publisher": defaultPublisher
        };
    }

    document.title = newTitle;

    const updateMetaTag = (selector: string, attribute: string, content: string) => {
        let tag = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
        if (!tag && selector.startsWith('meta')) {
            tag = document.createElement('meta');
            const nameOrProperty = selector.match(/name="([^"]+)"|property="([^"]+)"/);
            if (nameOrProperty?.[1]) tag.setAttribute('name', nameOrProperty[1]);
            if (nameOrProperty?.[2]) (tag as HTMLMetaElement).setAttribute('property', nameOrProperty[2]);
            document.head.appendChild(tag);
        } else if (!tag && selector === 'link[rel="canonical"]') {
            tag = document.createElement('link');
            (tag as HTMLLinkElement).setAttribute('rel', 'canonical');
            document.head.appendChild(tag);
        }
        if (tag) tag.setAttribute(attribute, content);
    };
    
    updateMetaTag('meta[name="description"]', 'content', newDescription);
    updateMetaTag('meta[property="og:title"]', 'content', newTitle);
    updateMetaTag('meta[property="og:description"]', 'content', newDescription);
    updateMetaTag('meta[property="twitter:title"]', 'content', newTitle);
    updateMetaTag('meta[property="twitter:description"]', 'content', newDescription);
    updateMetaTag('meta[property="og:image"]', 'content', currentOgImage);
    updateMetaTag('meta[property="twitter:image"]', 'content', currentOgImage);
    
    const canonicalURL = `${BASE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    updateMetaTag('link[rel="canonical"]', 'href', canonicalURL);
    updateMetaTag('meta[property="og:url"]', 'content', canonicalURL);
    updateMetaTag('meta[property="twitter:url"]', 'content', canonicalURL);

    const structuredDataElement = document.getElementById('structured-data');
    if (structuredDataElement) {
        structuredDataElement.textContent = structuredData ? JSON.stringify(structuredData, null, 2) : '';
    }

  }, [currentView, currentBlogPostSlug]);


  useEffect(() => {
    if (isLoadingRecommendation) {
      const intervalId = setInterval(() => {
        setCurrentLoadingMessage(prevMessage => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000); 
      return () => clearInterval(intervalId);
    }
  }, [isLoadingRecommendation]);

  useEffect(() => {
    if (!isLoadingRecommendation && !isGenerating && recommendation?.text && !error && recommendationRef.current) {
      const timer = setTimeout(() => {
        recommendationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoadingRecommendation, isGenerating, recommendation, error]);


  const parseGeminiError = (err: any): string => {
    let errorMessage = 'Ocurrió un error desconocido al obtener las recomendaciones. Por favor, inténtalo de nuevo más tarde.';
    if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
        if (errorMessage.includes("got status: 502") && errorMessage.includes("Proxying failed")) {
            let details = "";
            try {
                const jsonErrorMatch = errorMessage.match(/{.*}/s);
                if (jsonErrorMatch && jsonErrorMatch[0]) {
                    const parsedJson = JSON.parse(jsonErrorMatch[0]);
                    if (parsedJson.details) {
                        details = ` Detalle técnico: ${parsedJson.details}.`;
                    } else if (parsedJson.error && parsedJson.proxiedUrl) {
                        details = ` Detalle técnico: ${parsedJson.error} al contactar ${new URL(parsedJson.proxiedUrl).hostname}.`;
                    }
                }
            } catch (e) { /* console.warn("Could not parse details from 502 error message:", e); */ }
            errorMessage = `Se encontró un problema de comunicación con un servicio intermediario (Error 502 Proxy).${details} Esto puede ser temporal. Por favor, inténtalo de nuevo en unos momentos. Si el problema persiste, verifica tu conexión a internet, o prueba desde otra red o navegador, ya que a veces configuraciones específicas pueden influir.`;
            return errorMessage;
        }
        // Do not suggest checking API_KEY for non-API_KEY related errors if not explicitly an API key error.
    } else if (typeof err === 'string') {
        errorMessage = err;
    } else if (err && typeof err.toString === 'function') {
        const errStr = err.toString();
        if (errStr !== '[object Object]') { 
            errorMessage = errStr;
        }
    }
    return errorMessage;
  };

  const extractLocationFromDestination = (destination: string): LocationForWeather | null => {
    // Mapeo de destinos comunes a ubicaciones para AccuWeather
    const destinationMap: { [key: string]: LocationForWeather } = {
      'palma de mallorca': { cityName: 'Palma de Mallorca', countryCode: 'ES' },
      'palma': { cityName: 'Palma de Mallorca', countryCode: 'ES' },
      'mallorca': { cityName: 'Palma de Mallorca', countryCode: 'ES' },
      'ibiza': { cityName: 'Ibiza', countryCode: 'ES' },
      'menorca': { cityName: 'Mahón', countryCode: 'ES' },
      'mahon': { cityName: 'Mahón', countryCode: 'ES' },
      'formentera': { cityName: 'Formentera', countryCode: 'ES' },
      'denia': { cityName: 'Denia', countryCode: 'ES' },
      'valencia': { cityName: 'Valencia', countryCode: 'ES' },
      'barcelona': { cityName: 'Barcelona', countryCode: 'ES' },
      'tarragona': { cityName: 'Tarragona', countryCode: 'ES' },
      'alicante': { cityName: 'Alicante', countryCode: 'ES' },
      'cartagena': { cityName: 'Cartagena', countryCode: 'ES' },
      'malaga': { cityName: 'Málaga', countryCode: 'ES' },
      'marbella': { cityName: 'Marbella', countryCode: 'ES' },
      'cadiz': { cityName: 'Cádiz', countryCode: 'ES' },
      'huelva': { cityName: 'Huelva', countryCode: 'ES' },
      'almeria': { cityName: 'Almería', countryCode: 'ES' },
      'gibraltar': { cityName: 'Gibraltar', countryCode: 'GI' },
      'portugal': { cityName: 'Lisboa', countryCode: 'PT' },
      'lisboa': { cityName: 'Lisboa', countryCode: 'PT' },
      'lisbon': { cityName: 'Lisboa', countryCode: 'PT' },
      'porto': { cityName: 'Porto', countryCode: 'PT' },
      'faro': { cityName: 'Faro', countryCode: 'PT' },
      'france': { cityName: 'Marseille', countryCode: 'FR' },
      'marseille': { cityName: 'Marseille', countryCode: 'FR' },
      'marseilles': { cityName: 'Marseille', countryCode: 'FR' },
      'nice': { cityName: 'Nice', countryCode: 'FR' },
      'cannes': { cityName: 'Cannes', countryCode: 'FR' },
      'monaco': { cityName: 'Monaco', countryCode: 'MC' },
      'italy': { cityName: 'Roma', countryCode: 'IT' },
      'roma': { cityName: 'Roma', countryCode: 'IT' },
      'rome': { cityName: 'Roma', countryCode: 'IT' },
      'napoli': { cityName: 'Napoli', countryCode: 'IT' },
      'naples': { cityName: 'Napoli', countryCode: 'IT' },
      'sicilia': { cityName: 'Palermo', countryCode: 'IT' },
      'sicily': { cityName: 'Palermo', countryCode: 'IT' },
      'palermo': { cityName: 'Palermo', countryCode: 'IT' },
      'sardegna': { cityName: 'Cagliari', countryCode: 'IT' },
      'sardinia': { cityName: 'Cagliari', countryCode: 'IT' },
      'cagliari': { cityName: 'Cagliari', countryCode: 'IT' },
      'greece': { cityName: 'Atenas', countryCode: 'GR' },
      'athens': { cityName: 'Atenas', countryCode: 'GR' },
      'atenas': { cityName: 'Atenas', countryCode: 'GR' },
      'crete': { cityName: 'Heraklion', countryCode: 'GR' },
      'creta': { cityName: 'Heraklion', countryCode: 'GR' },
      'heraklion': { cityName: 'Heraklion', countryCode: 'GR' },
      'rhodes': { cityName: 'Rhodes', countryCode: 'GR' },
      'rodas': { cityName: 'Rhodes', countryCode: 'GR' },
      'santorini': { cityName: 'Santorini', countryCode: 'GR' },
      'mykonos': { cityName: 'Mykonos', countryCode: 'GR' },
      'corfu': { cityName: 'Corfu', countryCode: 'GR' },
      'corfú': { cityName: 'Corfu', countryCode: 'GR' },
      'croatia': { cityName: 'Split', countryCode: 'HR' },
      'split': { cityName: 'Split', countryCode: 'HR' },
      'dubrovnik': { cityName: 'Dubrovnik', countryCode: 'HR' },
      'zadar': { cityName: 'Zadar', countryCode: 'HR' },
      'pula': { cityName: 'Pula', countryCode: 'HR' },
      'turkey': { cityName: 'Istanbul', countryCode: 'TR' },
      'turquia': { cityName: 'Istanbul', countryCode: 'TR' },
      'istanbul': { cityName: 'Istanbul', countryCode: 'TR' },
      'antalya': { cityName: 'Antalya', countryCode: 'TR' },
      'cyprus': { cityName: 'Nicosia', countryCode: 'CY' },
      'chipre': { cityName: 'Nicosia', countryCode: 'CY' },
      'nicosia': { cityName: 'Nicosia', countryCode: 'CY' },
      'limassol': { cityName: 'Limassol', countryCode: 'CY' },
      'malta': { cityName: 'Valletta', countryCode: 'MT' },
      'valletta': { cityName: 'Valletta', countryCode: 'MT' },
    };

    const normalizedDestination = destination.toLowerCase().trim();
    
    // Buscar coincidencias exactas primero
    for (const [key, location] of Object.entries(destinationMap)) {
      if (normalizedDestination.includes(key)) {
        console.log("Found location for destination:", { destination, location });
        return location;
      }
    }
    
    // Si no se encuentra, intentar extraer información del texto
    const cityMatch = normalizedDestination.match(/([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)*)/i);
    if (cityMatch) {
      const cityName = cityMatch[1];
      // Asumir España como país por defecto para destinos en español
      const location: LocationForWeather = {
        cityName: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        countryCode: 'ES'
      };
      console.log("Extracted location from destination:", { destination, location });
      return location;
    }
    
    console.warn("Could not extract location from destination:", destination);
    return null;
  };





  const handleNavigateToMainApp = useCallback(() => {
    setCurrentView(AppView.MAIN_APP);
    setCurrentBlogPostSlug(null);
    // Solo mostrar landing page si no hay parámetros en la URL
    setShowLandingPage(!window.location.search);
    updateURL(AppView.MAIN_APP);
  }, [updateURL]);
  
  const handleStartPlanning = useCallback(() => {
    setShowLandingPage(false);
    // Asegurar que estamos en la vista principal
    setCurrentView(AppView.MAIN_APP);
    setCurrentBlogPostSlug(null);
    updateURL(AppView.MAIN_APP);
    // Scroll to top when transitioning from landing page to planner
    window.scrollTo(0, 0);
  }, [updateURL]);
  
  const handleNavigateToBlogIndex = useCallback(() => {
    setCurrentView(AppView.BLOG_INDEX);
    setCurrentBlogPostSlug(null);
    updateURL(AppView.BLOG_INDEX);
  }, [updateURL]);

  const handleNavigateToBlogPost = useCallback((slug: string) => {
    const postExists = allBlogPosts.some(p => p.frontmatter.slug === slug);
    if (postExists) {
      setCurrentView(AppView.BLOG_POST);
      setCurrentBlogPostSlug(slug);
      updateURL(AppView.BLOG_POST, slug);
    } else {
      setCurrentView(AppView.NOT_FOUND);
      setCurrentBlogPostSlug(null);
      updateURL(AppView.NOT_FOUND);
    }
  }, [updateURL]);


  const handleGetRecommendations = useCallback(async (preferences: UserPreferences) => {
    setIsGenerating(true);
    setIsLoadingRecommendation(true);
    setError(null);
    setRecommendation({
        text: "",
        isFetchingWeather: false,
        weatherData: null,
        weatherError: null,
        isAwaitingLocationData: false
    });
    setActiveChatSession(null);
    // Solo cambiar la vista si no estamos ya en MAIN_APP
    if (currentView !== AppView.MAIN_APP) {
      setCurrentView(AppView.MAIN_APP); 
      setCurrentBlogPostSlug(null);
      updateURL(AppView.MAIN_APP);
    }

    try {
      // Primero, intentar obtener datos meteorológicos basados en el destino
      let weatherData: WeatherData[] | null = null;
      let weatherError: string | null = null;
      
      // Obtener datos meteorológicos reales de AccuWeather
      const destinationLocation = extractLocationFromDestination(preferences.destination);
      console.log('🎯 Destino extraído:', destinationLocation);
      
      if (destinationLocation) {
        try {
          console.log('🌤️ Iniciando obtención de datos meteorológicos...');
          setRecommendation(prev => prev ? { ...prev, isFetchingWeather: true } : null);
          
          // Usar el país por defecto ES (España) o extraer del destino si es posible
          const countryCode = destinationLocation.countryCode || 'ES';
          weatherData = await getWeatherData(destinationLocation.cityName, countryCode);
          console.log('📊 Datos meteorológicos obtenidos:', weatherData);
          setRecommendation(prev => prev ? { 
            ...prev, 
            weatherData: weatherData, 
            isFetchingWeather: false 
          } : null);
        } catch (err: any) {
          console.error("❌ Error fetching weather data:", err);
          weatherError = `Error al obtener datos meteorológicos: ${err.message || 'Error desconocido'}`;
          setRecommendation(prev => prev ? { 
            ...prev, 
            weatherError: weatherError, 
            isFetchingWeather: false 
          } : null);
        }
      } else {
        console.warn('⚠️ No se pudo extraer ubicación del destino:', preferences.destination);
      }

      // Generar el itinerario con datos meteorológicos integrados
      let accumulatedText = "";
      let streamHadContent = false;

      for await (const chunkText of generateBoatTripRecommendationStream(preferences, weatherData || undefined)) {
        accumulatedText += chunkText;
        setRecommendation(prevRec => ({
          ...(prevRec ?? { text: "", isFetchingWeather: false }),
          text: accumulatedText,
        }));
        if (chunkText.trim() !== "") {
            streamHadContent = true;
        }
      }

      if (!streamHadContent && accumulatedText.trim() === "") {
        setError("La IA no generó una recomendación. Inténtalo de nuevo o ajusta tus preferencias.");
        setRecommendation({
            text: "",
            isFetchingWeather: false,
            weatherData: null,
            weatherError: null,
            isAwaitingLocationData: false
        });
      } else {
        const finalAccumulatedText = accumulatedText;
        
        setRecommendation(prev => prev ? {
            ...prev,
            text: finalAccumulatedText,
            isAwaitingLocationData: false
        } : {
            text: finalAccumulatedText,
            isFetchingWeather: false,
            weatherData: weatherData,
            weatherError: weatherError,
            isAwaitingLocationData: false
        });

        const initialPromptForChat = constructPrompt(preferences, weatherData || undefined);
        const geminiChat = aiInstance.current.chats.create({
            model: GEMINI_MODEL_NAME,
            config: { systemInstruction: "Eres un asistente experto en la planificación de viajes en barco. Ya has proporcionado una recomendación inicial. Ahora, ayuda al usuario a refinarla o responder preguntas adicionales sobre ella. Sé conciso y mantén el contexto del viaje propuesto y las preferencias originales." },
            history: [
                { role: 'user', parts: [{text: initialPromptForChat}] },
                { role: 'model', parts: [{text: finalAccumulatedText}] }
            ]
        });
        setActiveChatSession({
            id: Date.now().toString(),
            geminiChat: geminiChat,
            history: [],
            isLoading: false
        });
      }

    } catch (err) {
      console.error("Error in handleGetRecommendations (main try-catch):", err);
      setError(parseGeminiError(err));
      setRecommendation({
          text: "",
          isFetchingWeather: false,
          weatherData: null,
          weatherError: null,
          isAwaitingLocationData: false
      });
    } finally {
      setIsLoadingRecommendation(false);
      setIsGenerating(false);
    }
  }, [aiInstance, updateURL, currentView]); 

  const handleSendChatMessage = useCallback(async (messageContent: string) => {
    if (!activeChatSession || !messageContent.trim()) return;

    // Detectar si el usuario quiere una nueva recomendación
    const wantsNewRecommendation = messageContent.toLowerCase().includes('nueva') ||
                                  messageContent.toLowerCase().includes('genera') ||
                                  messageContent.toLowerCase().includes('crea') ||
                                  messageContent.toLowerCase().includes('haz') ||
                                  messageContent.toLowerCase().includes('modifica') ||
                                  messageContent.toLowerCase().includes('cambia') ||
                                  messageContent.toLowerCase().includes('ajusta') ||
                                  messageContent.toLowerCase().includes('refina') ||
                                  messageContent.toLowerCase().includes('mejora') ||
                                  messageContent.toLowerCase().includes('actualiza') ||
                                  messageContent.toLowerCase().includes('regenera') ||
                                  messageContent.toLowerCase().includes('rehacer') ||
                                  messageContent.toLowerCase().includes('otra vez');

    if (wantsNewRecommendation) {
      // Generar una nueva recomendación basada en el mensaje del usuario
      console.log("🔄 Usuario solicitó nueva recomendación, generando...");
      
      // Extraer las preferencias originales del chat session
      const chatHistory = activeChatSession.geminiChat.getHistory();
      const originalPrompt = chatHistory?.[0]?.parts?.[0]?.text || "";
      
      // Crear un nuevo prompt que combine las preferencias originales con las nuevas solicitudes
      const enhancedPrompt = `${originalPrompt}\n\n**SOLICITUDES ADICIONALES DEL USUARIO:**\n${messageContent}\n\nPor favor, genera una nueva recomendación completa que incorpore estas solicitudes adicionales.`;
      
      try {
        // Generar nueva recomendación
        setIsGenerating(true);
        setIsLoadingRecommendation(true);
        setError(null);
        
        let accumulatedText = "";
        let streamHadContent = false;

        // Crear una nueva instancia de Gemini para la nueva recomendación
        const geminiApiKey = import.meta.env.VITE_API_KEY || "MISSING_API_KEY";
        if (geminiApiKey === "MISSING_API_KEY") {
          throw new Error("API_KEY no está configurada");
        }
        
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        
        const responseStream = await ai.models.generateContentStream({
          model: GEMINI_MODEL_NAME,
          contents: enhancedPrompt,
          config: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4000,
          },
        });

        for await (const chunk of responseStream) {
          const chunkText = chunk.text || "";
          accumulatedText += chunkText;
          setRecommendation(prevRec => ({
            ...(prevRec ?? { text: "", isAwaitingLocationData: true }),
            text: accumulatedText,
          }));
          if (chunkText.trim() !== "") {
            streamHadContent = true;
          }
        }

        if (!streamHadContent && accumulatedText.trim() === "") {
          throw new Error("La IA no generó una nueva recomendación.");
        }

        const finalAccumulatedText = accumulatedText;
        setRecommendation(prev => prev ? {
          ...prev,
          text: finalAccumulatedText,
          isAwaitingLocationData: false
        } : {
          text: finalAccumulatedText,
          isFetchingWeather: false,
          weatherData: null,
          weatherError: null,
          isAwaitingLocationData: false
        });



        // Actualizar el chat session con la nueva recomendación
        const newGeminiChat = ai.chats.create({
          model: GEMINI_MODEL_NAME,
          config: { 
            systemInstruction: "Eres un asistente experto en la planificación de viajes en barco. Ya has proporcionado una recomendación inicial. Ahora, ayuda al usuario a refinarla o responder preguntas adicionales sobre ella. Sé conciso y mantén el contexto del viaje propuesto y las preferencias originales." 
          },
          history: [
            { role: 'user', parts: [{text: enhancedPrompt}] },
            { role: 'model', parts: [{text: finalAccumulatedText}] }
          ]
        });

        setActiveChatSession(prev => prev ? {
          ...prev,
          geminiChat: newGeminiChat,
          history: [], // Limpiar el historial del chat
          isLoading: false
        } : null);

      } catch (err) {
        console.error("Error generating new recommendation:", err);
        const errorMessage = `Error al generar nueva recomendación: ${parseGeminiError(err)}`;
        setError(errorMessage);
      } finally {
        setIsLoadingRecommendation(false);
        setIsGenerating(false);
      }
      
      return;
    }

    // Si no es una solicitud de nueva recomendación, usar el chat normal
    const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
    };

    setActiveChatSession(prev => prev ? { ...prev, history: [...prev.history, userMessage], isLoading: true } : null);

    try {
        const stream = await activeChatSession.geminiChat.sendMessageStream({ message: messageContent });
        let accumulatedModelResponse = "";
        let modelMessageId = `msg-model-${Date.now()}`;
        let firstChunk = true;

        for await (const chunk of stream) {
            const textChunk = chunk.text;
            accumulatedModelResponse += textChunk;
            if (firstChunk) {
                 const modelMessagePreview: ChatMessage = {
                    id: modelMessageId,
                    role: 'model',
                    content: accumulatedModelResponse,
                    timestamp: new Date().toISOString()
                };
                setActiveChatSession(prev => {
                    if (!prev) return null;
                    const existingMsgIndex = prev.history.findIndex(m => m.id === modelMessageId);
                    if (existingMsgIndex > -1) {
                        const updatedHistory = [...prev.history];
                        updatedHistory[existingMsgIndex] = modelMessagePreview;
                        return { ...prev, history: updatedHistory };
                    }
                    return { ...prev, history: [...prev.history, modelMessagePreview] };
                });
                firstChunk = false;
            } else {
                 setActiveChatSession(prev => {
                    if (!prev) return null;
                    const updatedHistory = prev.history.map(m =>
                        m.id === modelMessageId ? { ...m, content: accumulatedModelResponse } : m
                    );
                    return { ...prev, history: updatedHistory };
                });
            }
        }
    } catch (err) {
        console.error("Error sending chat message:", err);
        const errorMessageContent = `Error al obtener respuesta: ${parseGeminiError(err)}`;
        const errorMessage: ChatMessage = {
            id: `err-${Date.now()}`,
            role: 'model',
            content: errorMessageContent,
            timestamp: new Date().toISOString()
        };
         setActiveChatSession(prev => {
            if (!prev) return null;
            const lastMessage = prev.history[prev.history.length -1];
            if(lastMessage.role === 'user'){
                 return { ...prev, history: [...prev.history, errorMessage], isLoading: false };
            }
            const updatedHistory = prev.history.map(m =>
                m.id === lastMessage.id ? { ...m, content: errorMessageContent, timestamp: new Date().toISOString() } : m
            );
            return { ...prev, history: updatedHistory, isLoading: false };
        });
    } finally {
        setActiveChatSession(prev => prev ? { ...prev, isLoading: false } : null);
    }
  }, [activeChatSession]);

  const handlePrintPlan = () => {
    const recommendationElement = recommendationRef.current;
    const recommendationContentElement = recommendationElement?.querySelector('#recommendation-content');
    recommendationElement?.classList.add('printable-area-wrapper');
    recommendationContentElement?.classList.add('printable-area');
    window.print();
    recommendationElement?.classList.remove('printable-area-wrapper');
    recommendationContentElement?.classList.remove('printable-area');
  };

  const renderContent = () => {
    if (showLandingPage) {
      return <LandingPage onStartPlanning={handleStartPlanning} showAppInstallBanner={showAppInstallBanner} />;
    }
    switch (currentView) {
      case AppView.MAIN_APP:
        return (
          <>
            <div className="w-full max-w-2xl no-print mb-4 sm:mb-6">
              <AndroidCompatibilityAlert />
            </div>
            <div
              className="w-full max-w-2xl no-print"
              style={{ position: 'relative', zIndex: 20 }}
            >
                              <UserInputForm
                  onSubmit={handleGetRecommendations}
                  isLoading={isGenerating}
                  cookieConsent={cookieConsent}
                  onReconsiderCookies={handleReconsiderCookies}
                  showAppInstallBanner={showAppInstallBanner}
                />
            </div>

            {showAds && AD_SLOT_ID_BANNER_CONTENT !== "YOUR_AD_SLOT_ID_BANNER_CONTENT" && (
              <div className="w-full max-w-3xl my-3 sm:my-4 no-print">
                <AdSlot slotId={AD_SLOT_ID_BANNER_CONTENT} adClientId={AD_CLIENT_ID} className="min-h-[100px] bg-slate-200 flex items-center justify-center text-slate-500" />
              </div>
            )}

            <div ref={recommendationRef} className="w-full max-w-3xl">
              <RecommendationCard
                recommendation={recommendation}
                isLoading={isLoadingRecommendation}
                error={error}
                onPrintPlan={handlePrintPlan}
              />
            </div>
          </>
        );
      case AppView.BLOG_INDEX:
        return <BlogIndexPage onNavigateToPost={handleNavigateToBlogPost} onNavigateHome={handleNavigateToMainApp} showAppInstallBanner={showAppInstallBanner} />;
      case AppView.BLOG_POST:
        return <BlogPostPage 
                  slug={currentBlogPostSlug} 
                  onNavigateToBlogIndex={handleNavigateToBlogIndex} 
                  onNavigateHome={handleNavigateToMainApp} 
                  onNavigateToPost={handleNavigateToBlogPost} 
                  showAppInstallBanner={showAppInstallBanner}
                />;

      case AppView.NOT_FOUND:
        return <NotFoundPage onNavigateHome={handleNavigateToMainApp} showAppInstallBanner={showAppInstallBanner} />;
      default:
        console.error("RenderContent: currentView is an unexpected value", currentView);
        return <NotFoundPage onNavigateHome={handleNavigateToMainApp} />;
    }
  };

  return (
    <div className={`min-h-screen ${showLandingPage ? '' : 'bg-slate-100'} flex flex-col ${cookieConsent === CookieConsentStatus.PENDING ? 'pb-36 sm:pb-24' : ''}`}>
      {showAppInstallBanner && (
        <AppInstallBanner onClose={() => {
          setShowAppInstallBanner(false);
          localStorage.setItem('appInstallBannerClosed', 'true');
        }} />
      )}
      {!showLandingPage && (
        <Header 
          title={APP_TITLE} 
          onNavigateHome={handleNavigateToMainApp}
          onNavigateToBlogIndex={handleNavigateToBlogIndex}
          currentView={currentView}
          showAppInstallBanner={showAppInstallBanner}
        />
      )}

      <main className={`flex-grow transition-all duration-300 ease-out ${showLandingPage ? '' : 'container mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8'} ${showAppInstallBanner && !showLandingPage ? 'pt-16 sm:pt-20' : ''}`}>
        <div className={`${showLandingPage ? '' : 'flex flex-col items-center gap-4 sm:gap-6 md:gap-8'}`}>
          {renderContent()}
        </div>
      </main>
      
      {!showLandingPage && (
        <Footer
          onShowPrivacyPolicy={() => setShowPrivacyModal(true)}
          onShowTermsOfService={() => setShowTermsModal(true)}
          onNavigateToMainApp={handleNavigateToMainApp} 
          onNavigateToBlogIndex={handleNavigateToBlogIndex}
          showAds={showAds}
          currentView={currentView}
        />
      )}

      {isLoadingRecommendation && <LoadingOverlay message={currentLoadingMessage} />}

      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsOfServiceModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {cookieConsent === CookieConsentStatus.PENDING && (
        <CookieConsentBanner
          onAccept={handleCookieConsent}
          onDecline={handleCookieDecline}
          onShowPrivacyPolicy={() => setShowPrivacyModal(true)}
          onShowTermsOfService={() => setShowTermsModal(true)}
        />
      )}
      {(currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST || currentView === AppView.MAIN_APP) && <ScrollToTopButton />}
      
      {/* Pestaña para reabrir el banner de instalación - solo mostrar si el banner está cerrado */}
      {!showAppInstallBanner && (
        <AppInstallTab onShowBanner={handleReopenAppInstallBanner} onTabClose={handleTabClose} />
      )}
    </div>
  );
};

export default App;