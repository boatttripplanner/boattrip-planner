

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
import { generateBoatTripRecommendationStream, constructPrompt, constructWeatherAdaptationPrompt } from './services/geminiService';
import { getLocationKey as getAccuWeatherLocationKey, getWeatherForecast as getAccuWeatherForecast } from './services/accuweatherService';
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

  // Detectar si la página se cargó desde caché y forzar recarga
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('Página cargada desde caché, recargando...');
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []); 

  // Service Worker update handling
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker actualizado, recargando página...');
        window.location.reload();
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
    } else if ( (currentView === AppView.MAIN_APP && !isGenerating && !recommendation?.text) ||
                currentView === AppView.NOT_FOUND ) {
      performScrollToTop();
    }
  }, [currentView, currentBlogPostSlug, isGenerating, recommendation, showPrivacyModal, showTermsModal, cookieConsent]);


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

  const extractLocationForWeather = (text: string): LocationForWeather | null => {
    const match = text.match(/---\s*\n\s*\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*\s*\n\s*\*\s*CiudadPrincipal:\s*(.*?)\s*\n\s*\*\s*CodigoPais:\s*(.*?)\s*\n\s*\*\s*RegionOpcional:\s*(.*?)\s*\n\s*---/ms);

    if (match) {
        const cityName = match[1].trim();
        const countryCode = match[2].trim();
        const regionName = match[3].trim();
        if (cityName && countryCode) {
            console.log("Extracted for weather:", { cityName, countryCode, regionName: regionName || undefined });
            return { cityName, countryCode, regionName: regionName || undefined };
        }
    }
    console.warn("Could not extract location for weather from text:", text.slice(-500));
    return null;
  };

  const adaptItineraryToWeather = async (originalText: string, weatherData: WeatherData) => {
    console.log("🌤️ Aplicando adaptaciones meteorológicas...");
    
    try {
      // Verificar que no exista ya una sección de adaptaciones meteorológicas
      const hasExistingWeatherSection = originalText.toLowerCase().includes("adaptaciones meteorológicas") ||
                                       originalText.toLowerCase().includes("adaptación meteorológica");
      
      // Verificar si el texto ya tiene estructura de itinerario (días, secciones, etc.)
      const hasStructuredItinerary = originalText.toLowerCase().includes("día 1") ||
                                    originalText.toLowerCase().includes("dia 1") ||
                                    originalText.toLowerCase().includes("day 1") ||
                                    originalText.toLowerCase().includes("#### ") ||
                                    originalText.toLowerCase().includes("### ") ||
                                    originalText.toLowerCase().includes("## ");
      
      if (hasExistingWeatherSection) {
        console.warn("⚠️ Ya existe una sección de adaptaciones meteorológicas, no añadiendo duplicado");
        setRecommendation(prev => prev ? { 
          ...prev, 
          weatherAdaptations: "Adaptaciones meteorológicas ya aplicadas"
        } : null);
        return;
      }
      
      // Si ya hay un itinerario estructurado, solo añadir un mensaje simple
      if (hasStructuredItinerary) {
        console.log("ℹ️ Detectado itinerario estructurado, añadiendo mensaje simple de adaptación");
        const simpleAdaptation = `\n\n---\n\n**🌤️ ADAPTACIONES METEOROLÓGICAS APLICADAS**\n\n> ✅ **Itinerario Optimizado:** El plan ha sido adaptado automáticamente para las condiciones meteorológicas actuales (${weatherData.dayWindSpeed} km/h desde ${weatherData.dayWindDirection || 'No especificada'}, ${weatherData.temperatureMax}°C).`;
        
        setRecommendation(prev => prev ? { 
          ...prev, 
          text: originalText + simpleAdaptation,
          weatherAdaptations: "Adaptaciones meteorológicas aplicadas automáticamente"
        } : null);
        return;
      }
      
      // Crear un mensaje de adaptación meteorológica simple y directo
      const windSpeed = weatherData.dayWindSpeed;
      const windDirection = weatherData.dayWindDirection || 'No especificada';
      const temperature = weatherData.temperatureMax;
      const conditions = weatherData.dayIconPhrase;
      
      let windCategory = '';
      if (windSpeed < 10) windCategory = 'Condiciones ideales';
      else if (windSpeed < 20) windCategory = 'Condiciones buenas';
      else if (windSpeed < 30) windCategory = 'Condiciones moderadas';
      else if (windSpeed < 40) windCategory = 'Condiciones difíciles';
      else windCategory = 'Condiciones peligrosas';
      
      let tempCategory = '';
      if (temperature < 15) tempCategory = 'Frío';
      else if (temperature < 25) tempCategory = 'Ideal';
      else tempCategory = 'Calor';
      
      const adaptedText = `> 🌤️ **Adaptación Meteorológica Aplicada:**
> 
> 💨 **Condiciones de Viento:** ${windSpeed} km/h desde ${windDirection} (${windCategory})
> 🌡️ **Temperatura:** ${temperature}°C (${tempCategory})
> ☁️ **Condiciones:** ${conditions}
> 
> ⚠️ **Recomendaciones de Seguridad:**
> - Se han ajustado las rutas para buscar protección según la dirección del viento
> - Los horarios de navegación se han optimizado para las condiciones actuales
> - Las actividades acuáticas se han adaptado a la temperatura y viento
> 
> ✅ **Itinerario Optimizado:** El plan ha sido adaptado automáticamente para maximizar la seguridad y el disfrute según las condiciones meteorológicas actuales.`;
      
      // Añadir las adaptaciones como una sección adicional
      const adaptedTextWithHeader = `\n\n---\n\n**🌤️ ADAPTACIONES METEOROLÓGICAS APLICADAS**\n\n${adaptedText}`;
      
      setRecommendation(prev => prev ? { 
        ...prev, 
        text: originalText + adaptedTextWithHeader,
        weatherAdaptations: adaptedText 
      } : null);
      
      console.log("✅ Adaptaciones meteorológicas aplicadas exitosamente");
      
    } catch (error) {
      console.error("Error aplicando adaptaciones meteorológicas:", error);
      // Si falla, mantener el itinerario original sin adaptaciones
    }
  };

  const fetchAndSetWeatherData = async (location: LocationForWeather) => {
    setRecommendation(prev => prev ? { ...prev, isFetchingWeather: true, weatherError: null, isAwaitingLocationData: false } : null);

    try {
        const locationKey = await getAccuWeatherLocationKey(location);
        if (locationKey) {
            const weather = await getAccuWeatherForecast(locationKey);
            setRecommendation(prev => {
              if (prev && weather) {
                // Adaptar el itinerario según el clima
                adaptItineraryToWeather(prev.text, weather);
                return { ...prev, weatherData: weather, isFetchingWeather: false };
              }
              return prev ? { ...prev, weatherData: weather, isFetchingWeather: false } : null;
            });
        } else {
            setRecommendation(prev => prev ? { ...prev, weatherError: "No se pudo encontrar la clave de ubicación para el pronóstico del tiempo.", isFetchingWeather: false } : null);
        }
    } catch (err: any) {
        console.error("Error fetching weather data from AccuWeather:", err);
        let displayErrorMessage = `Error al obtener datos de AccuWeather: ${err.message || 'Error desconocido'}`;
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
            displayErrorMessage = "No se pudo conectar con el servicio meteorológico (AccuWeather). Esto podría deberse a un problema de red, un bloqueo por parte de tu navegador/antivirus, o a una interrupción temporal del servicio. Por favor, verifica tu conexión a internet e inténtalo de nuevo más tarde.";
        }
        setRecommendation(prev => prev ? { ...prev, weatherError: displayErrorMessage, isFetchingWeather: false } : null);
    }
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
        isAwaitingLocationData: true
    });
    setActiveChatSession(null);
    if (currentView !== AppView.MAIN_APP) {
      setCurrentView(AppView.MAIN_APP); 
      setCurrentBlogPostSlug(null);
      updateURL(AppView.MAIN_APP);    
    }


    try {
      let accumulatedText = "";
      let streamHadContent = false;

      for await (const chunkText of generateBoatTripRecommendationStream(preferences)) {
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
            isAwaitingLocationData: false // Mark as not awaiting even if location extraction fails
        } : {
            text: finalAccumulatedText,
            isFetchingWeather: false,
            weatherData: null,
            weatherError: null,
            isAwaitingLocationData: false
        });

        const locationForWeather = extractLocationForWeather(finalAccumulatedText);
        if (locationForWeather) {
            await fetchAndSetWeatherData(locationForWeather);
        } else {
            // Set error directly if location extraction fails, ensure isAwaitingLocationData is false.
            setRecommendation(prev => prev ? {
              ...prev,
              weatherError: "No se pudo determinar la ubicación para el pronóstico del clima a partir de la recomendación. Por favor, verifica los detalles de la ubicación principal proporcionada.",
              isFetchingWeather: false,
              isAwaitingLocationData: false 
            } : null);
        }

        const initialPromptForChat = constructPrompt(preferences);
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

        // Extraer ubicación y obtener datos meteorológicos
        const locationForWeather = extractLocationForWeather(finalAccumulatedText);
        if (locationForWeather) {
          await fetchAndSetWeatherData(locationForWeather);
        } else {
          setRecommendation(prev => prev ? {
            ...prev,
            weatherError: "No se pudo determinar la ubicación para el pronóstico del clima.",
            isFetchingWeather: false,
            isAwaitingLocationData: false 
          } : null);
        }

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
      return <LandingPage onStartPlanning={handleStartPlanning} />;
    }
    switch (currentView) {
      case AppView.MAIN_APP:
        return (
          <>
            <div className="w-full max-w-2xl no-print mb-6">
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
              />
            </div>

            {showAds && AD_SLOT_ID_BANNER_CONTENT !== "YOUR_AD_SLOT_ID_BANNER_CONTENT" && (
              <div className="w-full max-w-3xl my-4 no-print">
                <AdSlot slotId={AD_SLOT_ID_BANNER_CONTENT} adClientId={AD_CLIENT_ID} className="min-h-[100px] bg-slate-200 flex items-center justify-center text-slate-500" />
              </div>
            )}

            <div ref={recommendationRef} className="w-full max-w-3xl">
              <RecommendationCard
                recommendation={recommendation}
                isLoading={isLoadingRecommendation}
                error={error}
                chatSession={activeChatSession}
                onSendChatMessage={handleSendChatMessage}
                onPrintPlan={handlePrintPlan}
              />
            </div>
          </>
        );
      case AppView.BLOG_INDEX:
        return <BlogIndexPage onNavigateToPost={handleNavigateToBlogPost} onNavigateHome={handleNavigateToMainApp} />;
      case AppView.BLOG_POST:
        return <BlogPostPage 
                  slug={currentBlogPostSlug} 
                  onNavigateToBlogIndex={handleNavigateToBlogIndex} 
                  onNavigateHome={handleNavigateToMainApp} 
                  onNavigateToPost={handleNavigateToBlogPost} 
                />;
      case AppView.NOT_FOUND:
        return <NotFoundPage onNavigateHome={handleNavigateToMainApp} />;
      default:
        console.error("RenderContent: currentView is an unexpected value", currentView);
        return <NotFoundPage onNavigateHome={handleNavigateToMainApp} />;
    }
  };

  return (
    <div className={`min-h-screen ${showLandingPage ? '' : 'bg-slate-100'} flex flex-col ${cookieConsent === CookieConsentStatus.PENDING ? 'pb-36 sm:pb-24' : ''}`}>
      {!showLandingPage && (
        <Header 
          title={APP_TITLE} 
          onNavigateHome={handleNavigateToMainApp}
          onNavigateToBlogIndex={handleNavigateToBlogIndex}
          currentView={currentView}
        />
      )}

      <main className={`flex-grow ${showLandingPage ? '' : 'container mx-auto p-4 md:p-8'}`}>
        <div className={`${showLandingPage ? '' : 'flex flex-col items-center gap-8'}`}>
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

      {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsOfServiceModal onClose={() => setShowTermsModal(false)} />}

      {cookieConsent === CookieConsentStatus.PENDING && (
        <CookieConsentBanner
          onAccept={handleCookieConsent}
          onDecline={handleCookieDecline}
          onShowPrivacyPolicy={() => setShowPrivacyModal(true)}
          onShowTermsOfService={() => setShowTermsModal(true)}
        />
      )}
      {(currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST || currentView === AppView.MAIN_APP) && <ScrollToTopButton />}
    </div>
  );
};

export default App;