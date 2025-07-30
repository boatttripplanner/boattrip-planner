import React, { useState, useRef, Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPreferences, CookieConsentStatus, Recommendation } from '../types';
import { generateBoatTripRecommendation, constructWeatherAdaptationPrompt } from '../services/geminiService';
import { getLocationKey, getWeatherForecast } from '../services/accuweatherService';

// Lazy load components for better performance
const UserInputForm = lazy(() => import('./UserInputForm'));
const RecommendationCard = lazy(() => import('./RecommendationCard'));
const RecommendationLoadingScreen = lazy(() => import('./RecommendationLoadingScreen'));

// Loading fallback for wizard components
const WizardLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
      <p className="text-slate-600">Preparando el planificador...</p>
    </div>
  </div>
);

const PlanningWizardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [isAwaitingLocationData, setIsAwaitingLocationData] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  // Scroll hacia arriba cuando se carga el componente
  useEffect(() => {
    // Scroll inmediato hacia arriba para mejor UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    
    // Hacer scroll hacia arriba para centrar la pantalla de carga
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Cancelar cualquier generación anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      // Generar recomendación completa de una vez (sin streaming)
      const fullText = await generateBoatTripRecommendation(preferences);
      
      if (!abortControllerRef.current?.signal.aborted) {
        const aiRecommendation: Recommendation = {
          text: fullText,
          chatHistory: [],
          weatherData: null,
          weatherError: null,
          isFetchingWeather: false,
          isAwaitingLocationData: false,
          weatherAdaptations: "Condiciones meteorológicas favorables para navegación costera."
        };
        
        setRecommendation(aiRecommendation);
        setShowRecommendation(true);
        
        // Extraer datos de ubicación y obtener clima
        const locationData = extractLocationData(fullText);
        if (locationData) {
          setIsAwaitingLocationData(true);
          await fetchWeatherData(locationData);
          setIsAwaitingLocationData(false);
        }
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al generar la recomendación. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleReconsiderCookies = () => {
    // Implementar lógica para reconsiderar cookies
    console.log('Reconsidering cookies...');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleStartNewPlanning = () => {
    setShowRecommendation(false);
    setRecommendation(null);
    setError(null);
    setWeatherData(null);
    setWeatherError(null);
    setIsFetchingWeather(false);
    setIsAwaitingLocationData(false);
    
    // Scroll hacia arriba cuando se reinicia el wizard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setError(null);
  };

  const extractLocationData = (text: string) => {
    // Buscar el bloque de datos meteorológicos en el texto
    const weatherDataMatch = text.match(/\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*[\s\S]*?---/);
    
    if (weatherDataMatch) {
      const weatherDataText = weatherDataMatch[0];
      
      // Extraer CiudadPrincipal
      const cityMatch = weatherDataText.match(/CiudadPrincipal:\s*([^\n\r]+)/);
      const cityName = cityMatch ? cityMatch[1].trim() : null;
      
      // Extraer CodigoPais
      const countryMatch = weatherDataText.match(/CodigoPais:\s*([^\n\r]+)/);
      const countryCode = countryMatch ? countryMatch[1].trim() : null;
      
      // Extraer RegionOpcional
      const regionMatch = weatherDataText.match(/RegionOpcional:\s*([^\n\r]+)/);
      const regionName = regionMatch ? regionMatch[1].trim() : null;
      
      if (cityName && countryCode) {
        return { cityName, countryCode, regionName: regionName || undefined };
      }
    }
    
    return null;
  };

  const fetchWeatherData = async (locationInfo: { cityName: string; countryCode: string; regionName?: string }) => {
    setIsFetchingWeather(true);
    setWeatherError(null);
    
    try {
      const locationKey = await getLocationKey(locationInfo);
      if (locationKey) {
        const weather = await getWeatherForecast(locationKey);
        setWeatherData(weather);
        
        // Generar adaptaciones meteorológicas reales
        if (weather && recommendation) {
          await generateWeatherAdaptations(weather, recommendation.text);
        }
      } else {
        setWeatherError('No se pudo encontrar la ubicación para el pronóstico del tiempo');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError(error instanceof Error ? error.message : 'Error al obtener datos meteorológicos');
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const generateWeatherAdaptations = async (weatherData: any, originalRecommendation: string) => {
    try {
      // Generar adaptaciones meteorológicas basadas en datos reales
      const windSpeed = weatherData.dayWindSpeed;
      const windDirection = weatherData.dayWindDirection || '';
      const temperature = weatherData.temperatureMax;
      const conditions = weatherData.dayIconPhrase;
      
      let weatherAdaptations = '';
      
      // Análisis de viento
      if (windSpeed < 10) {
        weatherAdaptations += `> 💨 **Condiciones ideales:** Con viento de ${windSpeed} km/h desde ${windDirection}, las condiciones son perfectas para navegación y actividades acuáticas.\n\n`;
      } else if (windSpeed < 20) {
        weatherAdaptations += `> 💨 **Condiciones buenas:** Con viento de ${windSpeed} km/h desde ${windDirection}, mantén las actividades planificadas pero considera calas más protegidas.\n\n`;
      } else if (windSpeed < 30) {
        weatherAdaptations += `> ⚠️ **Condiciones moderadas:** Con viento de ${windSpeed} km/h desde ${windDirection}, busca calas protegidas y evita navegación a vela si no eres experto.\n\n`;
      } else if (windSpeed < 40) {
        weatherAdaptations += `> ⚠️ **Condiciones difíciles:** Con viento de ${windSpeed} km/h desde ${windDirection}, prioriza calas muy protegidas y considera puertos como alternativa.\n\n`;
      } else {
        weatherAdaptations += `> 🚨 **Condiciones peligrosas:** Con viento de ${windSpeed} km/h desde ${windDirection}, considera cancelar o reprogramar el viaje.\n\n`;
      }
      
      // Análisis de temperatura
      if (temperature < 15) {
        weatherAdaptations += `> ❄️ **Temperatura fría:** Con ${temperature}°C, enfócate en actividades a bordo y considera puertos con restaurantes.\n\n`;
      } else if (temperature > 25) {
        weatherAdaptations += `> ☀️ **Temperatura alta:** Con ${temperature}°C, prioriza calas con sombra y horarios tempranos/tardíos.\n\n`;
      }
      
      // Análisis de dirección del viento
      if (windDirection.includes('Oeste') || windDirection.includes('West')) {
        weatherAdaptations += `> 🌊 **Protección del viento:** Con viento del oeste, busca calas protegidas al este.\n\n`;
      } else if (windDirection.includes('Este') || windDirection.includes('East')) {
        weatherAdaptations += `> 🌊 **Protección del viento:** Con viento del este, busca calas protegidas al oeste.\n\n`;
      }
      
      // Actualizar la recomendación con las adaptaciones meteorológicas reales
      if (recommendation) {
        setRecommendation({
          ...recommendation,
          weatherAdaptations: weatherAdaptations
        });
      }
    } catch (error) {
      console.error('Error generating weather adaptations:', error);
      // Si falla la generación de adaptaciones, mantener la recomendación original
    }
  };

  // Obtener el estado de consentimiento de cookies
  const cookieConsent = localStorage.getItem('cookie-consent') as CookieConsentStatus || CookieConsentStatus.PENDING;

  // Mostrar pantalla de carga durante la generación
  if (isLoading) {
    return <RecommendationLoadingScreen onCancel={handleCancelGeneration} />;
  }

  if (showRecommendation && recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Tu Plan Náutico
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Personalizado
              </span>
            </h1>
            <p className="text-lg text-slate-600">
              Aquí tienes tu recomendación personalizada basada en tus preferencias.
            </p>
          </div>
          
          <Suspense fallback={<WizardLoadingFallback />}>
            <RecommendationCard 
              recommendation={{
                ...recommendation,
                weatherData: weatherData,
                weatherError: weatherError,
                isFetchingWeather: isFetchingWeather,
                isAwaitingLocationData: isAwaitingLocationData
              }}
              isLoading={isLoading}
              error={error}
              chatSession={null}
              onSendChatMessage={(message) => console.log('Chat message:', message)}
              onPrintPlan={() => window.print()}
            />
          </Suspense>
          
                     <div className="text-center mt-8">
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <button
                 onClick={handleNavigateHome}
                 className="w-full sm:w-auto bg-slate-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base font-medium"
               >
                 Volver al Inicio
               </button>
               <button
                 onClick={handleStartNewPlanning}
                 className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base font-medium"
               >
                 Crear Nuevo Plan
               </button>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Planificador de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Viajes Náuticos
            </span>
          </h1>
          <p className="text-lg text-slate-600">
            Completa este formulario para recibir tu plan personalizado con IA.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al generar recomendación</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}



        <Suspense fallback={<WizardLoadingFallback />}>
          <UserInputForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            cookieConsent={cookieConsent}
            onReconsiderCookies={handleReconsiderCookies}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PlanningWizardPage; 