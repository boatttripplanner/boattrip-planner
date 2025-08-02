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
    console.warn('⚠️ No hay API key de AccuWeather configurada');
    return null;
  }

  const queryTextForAPI = locationInfo.cityName;
  const locationUrl = `${ACCUWEATHER_BASE_URL}/locations/v1/cities/${locationInfo.countryCode}/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(queryTextForAPI)}&language=es-es`;
  
  try {
    console.log('🌐 Haciendo petición a:', locationUrl);
    const response = await fetch(locationUrl);
    console.log('📡 Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Error ${response.status} fetching AccuWeather location key for query "${queryTextForAPI}" in country "${locationInfo.countryCode}": ${errorData.Message || response.statusText}`);
      console.error('📋 Detalles del error:', errorData);
      throw new Error(`Error al buscar ubicación en AccuWeather: ${errorData.Message || response.statusText}`);
    }
    
    const data: AccuWeatherLocationResponse[] = await response.json();
    console.log('✅ Datos recibidos:', data);
    
    if (data && data.length > 0) {
      const location = data[0];
      console.log('📍 Ubicación encontrada:', location.LocalizedName, 'Key:', location.Key);
      return location.Key;
    } else {
      console.warn('⚠️ No se encontraron ubicaciones para:', queryTextForAPI);
      return null;
    }
  } catch (error) {
    console.error('❌ Error in getLocationKey (AccuWeather):', error);
    throw error;
  }
}

// Función para obtener el pronóstico meteorológico de AccuWeather
export async function getWeatherForecast(locationKey: string, locationName?: string): Promise<WeatherData[]> {
  console.log('🌤️ Obteniendo pronóstico para locationKey:', locationKey);
  
  if (!ACCUWEATHER_API_KEY) {
    console.warn('⚠️ No hay API key de AccuWeather configurada');
    return generateMockWeatherData(locationName || 'Unknown');
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
      
      // Si la API falla, usar datos simulados
      if (locationName) {
        console.log('🔄 Usando datos meteorológicos simulados debido a error de API');
        return generateMockWeatherData(locationName);
      } else {
        throw new Error(`Error al obtener pronóstico de AccuWeather: ${errorData.Message || response.statusText}`);
      }
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
    
    // Si no hay datos, usar datos simulados
    if (locationName) {
      console.log('🔄 Usando datos meteorológicos simulados debido a falta de datos de API');
      return generateMockWeatherData(locationName);
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error in getWeatherForecast (AccuWeather):', error);
    
    // Si hay error, usar datos simulados
    if (locationName) {
      console.log('🔄 Usando datos meteorológicos simulados debido a error de API');
      return generateMockWeatherData(locationName);
    }
    
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
    // Intentar obtener datos reales de AccuWeather
    const locationKey = await getLocationKey({ cityName: locationName, countryCode });
    
    if (locationKey) {
      console.log('✅ Usando datos reales de AccuWeather');
      return await getWeatherForecast(locationKey, locationName);
    } else {
      console.log('🔄 No se encontró locationKey, usando datos simulados');
      return generateMockWeatherData(locationName);
    }
  } catch (error) {
    console.error('❌ Error obteniendo datos meteorológicos:', error);
    console.log('🔄 Usando datos simulados como fallback');
    return generateMockWeatherData(locationName);
  }
} 