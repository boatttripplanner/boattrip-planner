import { WeatherData } from '../types';

// Configuración de APIs meteorológicas (variables de entorno de Vercel)
const ACCUWEATHER_API_KEY = import.meta.env.VITE_ACCUWEATHER_API_KEY;
const ACCUWEATHER_BASE_URL = "https://dataservice.accuweather.com";

// Interfaces para las respuestas de AccuWeather
interface AccuWeatherLocationResponse {
  Key: string;
  LocalizedName: string;
  Country: { ID: string };
  AdministrativeArea: { ID: string; LocalizedName: string };
}

interface AccuWeatherForecastResponse {
  DailyForecasts: {
    Date: string;
    Temperature: {
      Minimum: { Value: number; Unit: string };
      Maximum: { Value: number; Unit: string };
    };
    Day: {
      Icon: number;
      IconPhrase: string;
      Wind: { Speed: { Value: number; Unit: string }; Direction: { Degrees: number; Localized: string } };
    };
    Night: {
      Icon: number;
      IconPhrase: string;
      Wind: { Speed: { Value: number; Unit: string }; Direction: { Degrees: number; Localized: string } };
    };
    Link: string;
  }[];
}

// Función para obtener la clave de ubicación de AccuWeather
export async function getLocationKey(locationInfo: { cityName: string; countryCode: string }): Promise<string | null> {
  console.log('🔍 Buscando ubicación para:', locationInfo);
  
  if (!ACCUWEATHER_API_KEY) {
    console.error('❌ No hay API key de AccuWeather configurada');
    throw new Error('API key de AccuWeather no configurada');
  }

  const queryTextForAPI = locationInfo.cityName;
  
  try {
    // 1. Intentar búsqueda específica por país
    let locationUrl = `${ACCUWEATHER_BASE_URL}/locations/v1/cities/${locationInfo.countryCode}/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(queryTextForAPI)}&language=es-es`;
    console.log('🌐 Intentando búsqueda específica por país:', locationUrl);
    
    let response = await fetch(locationUrl);
    console.log('📡 Respuesta del servidor (específica):', response.status, response.statusText);
    
    if (response.ok) {
      const data: AccuWeatherLocationResponse[] = await response.json();
      console.log('✅ Datos recibidos (específica):', data);
      
      if (data && data.length > 0) {
        const location = data[0];
        console.log('📍 Ubicación encontrada (específica):', location.LocalizedName, 'Key:', location.Key);
        return location.Key;
      }
    }
    
    // 2. Si no se encuentra, intentar búsqueda global
    console.log('🔄 No se encontró en búsqueda específica, intentando búsqueda global...');
    locationUrl = `${ACCUWEATHER_BASE_URL}/locations/v1/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(queryTextForAPI)}&language=es-es`;
    console.log('🌐 Intentando búsqueda global:', locationUrl);
    
    response = await fetch(locationUrl);
    console.log('📡 Respuesta del servidor (global):', response.status, response.statusText);
    
    if (response.ok) {
      const data: AccuWeatherLocationResponse[] = await response.json();
      console.log('✅ Datos recibidos (global):', data);
      
      if (data && data.length > 0) {
        // Filtrar por país si es posible
        let bestMatch = data[0];
        
        // Buscar coincidencia exacta de país
        const exactCountryMatch = data.find(loc => loc.Country.ID === locationInfo.countryCode);
        if (exactCountryMatch) {
          bestMatch = exactCountryMatch;
          console.log('📍 Coincidencia exacta de país encontrada:', bestMatch.LocalizedName, 'Key:', bestMatch.Key);
        } else {
          // Buscar cualquier ubicación en el mismo país o similar
          const similarCountryMatch = data.find(loc => 
            loc.Country.ID === locationInfo.countryCode || 
            loc.Country.ID === 'ES' || // España como fallback para destinos en español
            loc.AdministrativeArea?.ID === locationInfo.countryCode
          );
          if (similarCountryMatch) {
            bestMatch = similarCountryMatch;
            console.log('📍 Coincidencia similar de país encontrada:', bestMatch.LocalizedName, 'Key:', bestMatch.Key);
          }
        }
        
        return bestMatch.Key;
      }
    }
    
    // 3. Si aún no se encuentra, intentar con nombres alternativos
    console.log('🔄 No se encontró en búsqueda global, intentando con nombres alternativos...');
    
    const alternativeNames = getAlternativeNames(queryTextForAPI);
    for (const altName of alternativeNames) {
      console.log('🔄 Probando nombre alternativo:', altName);
      
      locationUrl = `${ACCUWEATHER_BASE_URL}/locations/v1/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(altName)}&language=es-es`;
      response = await fetch(locationUrl);
      
      if (response.ok) {
        const data: AccuWeatherLocationResponse[] = await response.json();
        if (data && data.length > 0) {
          const location = data[0];
          console.log('📍 Ubicación encontrada con nombre alternativo:', altName, '->', location.LocalizedName, 'Key:', location.Key);
          return location.Key;
        }
      }
      
      // Esperar un poco entre peticiones para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.warn('⚠️ No se encontraron ubicaciones para:', queryTextForAPI);
    return null;
    
  } catch (error) {
    console.error('❌ Error in getLocationKey (AccuWeather):', error);
    throw error;
  }
}

// Función para obtener nombres alternativos de ciudades
function getAlternativeNames(cityName: string): string[] {
  const alternatives: string[] = [];
  
  // Mapeo de nombres alternativos
  const nameMap: { [key: string]: string[] } = {
    'granada': ['Granada', 'Granada Spain', 'Granada Andalucia'],
    'almuñécar': ['Almuñécar', 'Almunecar', 'Almuñécar Granada'],
    'almuñecar': ['Almuñécar', 'Almunecar', 'Almuñécar Granada'],
    'motril': ['Motril', 'Motril Granada', 'Motril Spain'],
    'salobreña': ['Salobreña', 'Salobrena', 'Salobreña Granada'],
    'málaga': ['Málaga', 'Malaga', 'Málaga Spain', 'Malaga Spain'],
    'malaga': ['Málaga', 'Malaga', 'Málaga Spain', 'Malaga Spain'],
    'barcelona': ['Barcelona', 'Barcelona Spain', 'Barcelona Catalonia'],
    'valencia': ['Valencia', 'Valencia Spain', 'Valencia Comunidad Valenciana'],
    'palma de mallorca': ['Palma de Mallorca', 'Palma Mallorca', 'Palma', 'Mallorca'],
    'mallorca': ['Mallorca', 'Palma de Mallorca', 'Palma Mallorca'],
    'ibiza': ['Ibiza', 'Ibiza Spain', 'Eivissa'],
    'menorca': ['Menorca', 'Mahón', 'Mahon', 'Menorca Spain'],
    'mahón': ['Mahón', 'Mahon', 'Menorca', 'Menorca Spain'],
  };
  
  const normalizedCityName = cityName.toLowerCase().trim();
  
  // Buscar en el mapeo
  for (const [key, altNames] of Object.entries(nameMap)) {
    if (normalizedCityName.includes(key) || key.includes(normalizedCityName)) {
      alternatives.push(...altNames);
    }
  }
  
  // Agregar variaciones comunes
  if (normalizedCityName.includes('marina')) {
    alternatives.push(cityName.replace('marina', '').trim());
    alternatives.push(cityName.replace('marina del', '').trim());
    alternatives.push(cityName.replace('marina de', '').trim());
  }
  
  // Eliminar duplicados y el nombre original
  const uniqueAlternatives = [...new Set(alternatives)].filter(alt => 
    alt.toLowerCase() !== cityName.toLowerCase()
  );
  
  console.log('🔄 Nombres alternativos generados para', cityName, ':', uniqueAlternatives);
  return uniqueAlternatives;
}

// Función para obtener el pronóstico meteorológico de AccuWeather
export async function getWeatherForecast(locationKey: string, locationName?: string): Promise<WeatherData[]> {
  console.log('🌤️ Obteniendo pronóstico para locationKey:', locationKey);
  
  if (!ACCUWEATHER_API_KEY) {
    console.error('❌ No hay API key de AccuWeather configurada');
    throw new Error('API key de AccuWeather no configurada');
  }

  const forecastUrl = `${ACCUWEATHER_BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=es-es&details=true&metric=true`;
  console.log('🌐 URL del pronóstico:', forecastUrl);
  
  try {
    console.log('🌐 Haciendo petición de pronóstico...');
    const response = await fetch(forecastUrl);
    console.log('📡 Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Error ${response.status} fetching AccuWeather forecast for key "${locationKey}": ${errorData.Message || response.statusText}`);
      console.error('📋 Detalles del error:', errorData);
      
      // Lanzar error en lugar de usar datos simulados
      throw new Error(`Error al obtener pronóstico de AccuWeather: ${errorData.Message || response.statusText}`);
    }
    
    const data: AccuWeatherForecastResponse = await response.json();
    console.log('✅ Datos de pronóstico recibidos:', data);
    
    if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
      console.log(`📊 Obtenidos ${data.DailyForecasts.length} días de pronóstico meteorológico para análisis completo`);
      
      const weatherDataArray: WeatherData[] = data.DailyForecasts.map((forecast, index) => {
        const date = new Date(forecast.Date);
        console.log(`📅 Procesando día ${index + 1}:`, date.toLocaleDateString('es-ES'));
        
        return {
          date: date.toISOString(),
          temperatureMin: Math.round(forecast.Temperature.Minimum.Value),
          temperatureMax: Math.round(forecast.Temperature.Maximum.Value),
          temperatureUnit: forecast.Temperature.Maximum.Unit,
          dayIconPhrase: forecast.Day.IconPhrase,
          dayWindSpeed: Math.round(forecast.Day.Wind.Speed.Value),
          dayWindUnit: forecast.Day.Wind.Speed.Unit,
          dayWindDirection: forecast.Day.Wind.Direction.Localized,
          nightIconPhrase: forecast.Night.IconPhrase,
          nightWindSpeed: Math.round(forecast.Night.Wind.Speed.Value),
          nightWindUnit: forecast.Night.Wind.Speed.Unit,
          nightWindDirection: forecast.Night.Wind.Direction.Localized,
          link: forecast.Link,
          accuWeatherDayIcon: forecast.Day.Icon,
          accuWeatherNightIcon: forecast.Night.Icon
        };
      });
      
      return weatherDataArray;
    }
    
    // Si no hay datos, lanzar error
    throw new Error('No se recibieron datos de pronóstico válidos de AccuWeather');
    
  } catch (error) {
    console.error('❌ Error in getWeatherForecast (AccuWeather):', error);
    
    // Lanzar el error en lugar de usar datos simulados
    throw error;
  }
}

// Función para generar datos meteorológicos simulados (fallback)
export function generateMockWeatherData(locationName: string): WeatherData[] {
  console.log('🌤️ Generando datos meteorológicos simulados para:', locationName);
  
  const mockData: WeatherData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Generar datos realistas basados en la ubicación
    const isMediterranean = locationName.toLowerCase().includes('mallorca') || 
                           locationName.toLowerCase().includes('ibiza') || 
                           locationName.toLowerCase().includes('valencia') || 
                           locationName.toLowerCase().includes('barcelona') ||
                           locationName.toLowerCase().includes('alicante') ||
                           locationName.toLowerCase().includes('palma') ||
                           locationName.toLowerCase().includes('menorca') ||
                           locationName.toLowerCase().includes('formentera') ||
                           locationName.toLowerCase().includes('denia') ||
                           locationName.toLowerCase().includes('tarragona') ||
                           locationName.toLowerCase().includes('cartagena') ||
                           locationName.toLowerCase().includes('malaga') ||
                           locationName.toLowerCase().includes('marbella') ||
                           locationName.toLowerCase().includes('cadiz') ||
                           locationName.toLowerCase().includes('huelva') ||
                           locationName.toLowerCase().includes('almeria') ||
                           locationName.toLowerCase().includes('gibraltar') ||
                           locationName.toLowerCase().includes('portugal') ||
                           locationName.toLowerCase().includes('lisboa') ||
                           locationName.toLowerCase().includes('porto') ||
                           locationName.toLowerCase().includes('faro') ||
                           locationName.toLowerCase().includes('france') ||
                           locationName.toLowerCase().includes('marseille') ||
                           locationName.toLowerCase().includes('nice') ||
                           locationName.toLowerCase().includes('cannes') ||
                           locationName.toLowerCase().includes('monaco') ||
                           locationName.toLowerCase().includes('italy') ||
                           locationName.toLowerCase().includes('roma') ||
                           locationName.toLowerCase().includes('napoli') ||
                           locationName.toLowerCase().includes('sicilia') ||
                           locationName.toLowerCase().includes('palermo') ||
                           locationName.toLowerCase().includes('sardegna') ||
                           locationName.toLowerCase().includes('cagliari') ||
                           locationName.toLowerCase().includes('greece') ||
                           locationName.toLowerCase().includes('athens') ||
                           locationName.toLowerCase().includes('crete') ||
                           locationName.toLowerCase().includes('heraklion') ||
                           locationName.toLowerCase().includes('rhodes') ||
                           locationName.toLowerCase().includes('santorini') ||
                           locationName.toLowerCase().includes('mykonos') ||
                           locationName.toLowerCase().includes('corfu') ||
                           locationName.toLowerCase().includes('croatia') ||
                           locationName.toLowerCase().includes('split') ||
                           locationName.toLowerCase().includes('dubrovnik') ||
                           locationName.toLowerCase().includes('zadar') ||
                           locationName.toLowerCase().includes('pula') ||
                           locationName.toLowerCase().includes('turkey') ||
                           locationName.toLowerCase().includes('istanbul') ||
                           locationName.toLowerCase().includes('antalya') ||
                           locationName.toLowerCase().includes('cyprus') ||
                           locationName.toLowerCase().includes('nicosia') ||
                           locationName.toLowerCase().includes('limassol') ||
                           locationName.toLowerCase().includes('malta') ||
                           locationName.toLowerCase().includes('valletta');
    
    const baseTemp = isMediterranean ? 25 : 20;
    const tempVariation = Math.random() * 8 - 4; // ±4 grados
    const windSpeed = Math.random() * 15 + 5; // 5-20 km/h
    
    const weatherConditions = isMediterranean ? 
      ['Soleado', 'Parcialmente nublado', 'Despejado', 'Algunas nubes', 'Cielo despejado'] :
      ['Soleado', 'Nublado', 'Parcialmente nublado', 'Despejado', 'Algunas nubes'];
    
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    mockData.push({
      date: date.toISOString(),
      temperatureMin: Math.round(baseTemp + tempVariation - 3),
      temperatureMax: Math.round(baseTemp + tempVariation + 3),
      temperatureUnit: 'C',
      dayIconPhrase: randomCondition,
      dayWindSpeed: Math.round(windSpeed),
      dayWindUnit: 'km/h',
      dayWindDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      nightIconPhrase: 'Despejado',
      nightWindSpeed: Math.round(windSpeed * 0.7),
      nightWindUnit: 'km/h',
      nightWindDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      link: '#',
      accuWeatherDayIcon: 1,
      accuWeatherNightIcon: 33
    });
  }
  
  console.log('✅ Datos meteorológicos simulados generados:', mockData);
  return mockData;
}

// Función principal para obtener datos meteorológicos
export async function getWeatherData(locationName: string, countryCode: string = 'ES'): Promise<WeatherData[]> {
  console.log('🌤️ Obteniendo datos meteorológicos para:', locationName, 'en', countryCode);
  
  try {
    // Verificar que la API key esté configurada
    if (!ACCUWEATHER_API_KEY || ACCUWEATHER_API_KEY === 'MISSING_API_KEY') {
      console.error('❌ API key de AccuWeather no configurada');
      throw new Error('API key de AccuWeather no configurada. Los datos meteorológicos no están disponibles.');
    }

    // Intentar obtener datos reales de AccuWeather
    const locationKey = await getLocationKey({ cityName: locationName, countryCode });
    
    if (locationKey) {
      console.log('✅ Usando datos reales de AccuWeather');
      const weatherData = await getWeatherForecast(locationKey, locationName);
      
      // Verificar que los datos sean válidos
      if (weatherData && weatherData.length > 0) {
        console.log('✅ Datos meteorológicos reales obtenidos correctamente');
        return weatherData;
      } else {
        throw new Error('No se pudieron obtener datos meteorológicos válidos de AccuWeather');
      }
    } else {
      console.error('❌ No se encontró locationKey para:', locationName);
      throw new Error(`No se pudo encontrar la ubicación "${locationName}" en AccuWeather`);
    }
  } catch (error) {
    console.error('❌ Error obteniendo datos meteorológicos:', error);
    
    // En lugar de usar datos simulados, lanzar el error
    throw new Error(`Error al obtener datos meteorológicos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
} 