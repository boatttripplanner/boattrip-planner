// Script simple para probar la API de AccuWeather
require('dotenv').config();

const ACCUWEATHER_API_KEY = process.env.VITE_ACCUWEATHER_API_KEY;
const ACCUWEATHER_BASE_URL = "https://dataservice.accuweather.com";

console.log('🧪 PROBANDO API DE ACCUWEATHER');
console.log('=' .repeat(50));

if (!ACCUWEATHER_API_KEY) {
  console.error('❌ No hay API key configurada');
  process.exit(1);
}

console.log(`✅ API Key: ${ACCUWEATHER_API_KEY.substring(0, 10)}...`);

async function testAPI() {
  try {
    // Probar búsqueda de Granada
    console.log('\n🔍 Probando búsqueda de Granada...');
    const url = `${ACCUWEATHER_BASE_URL}/locations/v1/search?apikey=${ACCUWEATHER_API_KEY}&q=Granada&language=es-es`;
    
    console.log('📡 URL:', url);
    const response = await fetch(url);
    console.log('📡 Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta recibida');
      console.log('📊 Ubicaciones encontradas:', data.length);
      
      if (data.length > 0) {
        const location = data[0];
        console.log('📍 Primera ubicación:');
        console.log('   Nombre:', location.LocalizedName);
        console.log('   País:', location.Country.ID);
        console.log('   Key:', location.Key);
        
        // Probar pronóstico
        console.log('\n🌤️ Probando pronóstico...');
        const forecastUrl = `${ACCUWEATHER_BASE_URL}/forecasts/v1/daily/5day/${location.Key}?apikey=${ACCUWEATHER_API_KEY}&language=es-es&details=true&metric=true`;
        
        const forecastResponse = await fetch(forecastUrl);
        console.log('📡 Status pronóstico:', forecastResponse.status, forecastResponse.statusText);
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          console.log('✅ Pronóstico recibido');
          console.log('📊 Días:', forecastData.DailyForecasts?.length || 0);
          
          if (forecastData.DailyForecasts && forecastData.DailyForecasts.length > 0) {
            const firstDay = forecastData.DailyForecasts[0];
            console.log('📅 Primer día:', firstDay.Date);
            console.log('🌡️ Temperatura:', firstDay.Temperature.Minimum.Value + '°' + firstDay.Temperature.Minimum.Unit, '-', firstDay.Temperature.Maximum.Value + '°' + firstDay.Temperature.Maximum.Unit);
            console.log('🌤️ Día:', firstDay.Day.IconPhrase);
            console.log('💨 Viento:', firstDay.Day.Wind.Speed.Value, firstDay.Day.Wind.Speed.Unit, firstDay.Day.Wind.Direction.Localized);
          }
        } else {
          console.error('❌ Error en pronóstico:', forecastResponse.statusText);
        }
      }
    } else {
      console.error('❌ Error en búsqueda:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testAPI();

