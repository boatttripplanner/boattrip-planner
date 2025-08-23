#!/usr/bin/env node

/**
 * Script de prueba para la API de AccuWeather
 * Uso: node scripts/test-weather-api.js
 */

// Cargar variables de entorno
require('dotenv').config();

const ACCUWEATHER_API_KEY = process.env.VITE_ACCUWEATHER_API_KEY;
const ACCUWEATHER_BASE_URL = "https://dataservice.accuweather.com";

async function testLocationSearch(cityName, countryCode = 'ES') {
  console.log(`\n🔍 Probando búsqueda para: ${cityName} (${countryCode})`);
  
  if (!ACCUWEATHER_API_KEY) {
    console.error('❌ No hay API key configurada');
    return;
  }

  try {
    // 1. Búsqueda específica por país
    console.log('📡 1. Búsqueda específica por país...');
    let url = `${ACCUWEATHER_BASE_URL}/locations/v1/cities/${countryCode}/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(cityName)}&language=es-es`;
    
    let response = await fetch(url);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Encontradas ${data.length} ubicaciones`);
      if (data.length > 0) {
        console.log(`   📍 Primera: ${data[0].LocalizedName}, ${data[0].Country.ID} (Key: ${data[0].Key})`);
        return data[0].Key;
      }
    } else {
      console.log(`   ❌ Error: ${response.statusText}`);
    }

    // 2. Búsqueda global
    console.log('📡 2. Búsqueda global...');
    url = `${ACCUWEATHER_BASE_URL}/locations/v1/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(cityName)}&language=es-es`;
    
    response = await fetch(url);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Encontradas ${data.length} ubicaciones`);
      if (data.length > 0) {
        // Filtrar por país
        const countryMatch = data.find(loc => loc.Country.ID === countryCode);
        if (countryMatch) {
          console.log(`   📍 Coincidencia de país: ${countryMatch.LocalizedName}, ${countryMatch.Country.ID} (Key: ${countryMatch.Key})`);
          return countryMatch.Key;
        } else {
          console.log(`   📍 Primera global: ${data[0].LocalizedName}, ${data[0].Country.ID} (Key: ${data[0].Key})`);
          return data[0].Key;
        }
      }
    } else {
      console.log(`   ❌ Error: ${response.statusText}`);
    }

    console.log('   ⚠️ No se encontró ubicación');
    return null;

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function testWeatherForecast(locationKey, cityName) {
  console.log(`\n🌤️ Probando pronóstico para: ${cityName} (Key: ${locationKey})`);
  
  if (!locationKey) {
    console.log('   ⚠️ No hay locationKey para probar');
    return;
  }

  try {
    const url = `${ACCUWEATHER_BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=es-es&details=true&metric=true`;
    
    const response = await fetch(url);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Pronóstico obtenido: ${data.DailyForecasts?.length || 0} días`);
      
      if (data.DailyForecasts && data.DailyForecasts.length > 0) {
        const firstDay = data.DailyForecasts[0];
        console.log(`   📅 Primer día: ${firstDay.Date}`);
        console.log(`   🌡️ Temperatura: ${firstDay.Temperature.Minimum.Value}°${firstDay.Temperature.Minimum.Unit} - ${firstDay.Temperature.Maximum.Value}°${firstDay.Temperature.Maximum.Unit}`);
        console.log(`   🌤️ Día: ${firstDay.Day.IconPhrase}`);
        console.log(`   🌙 Noche: ${firstDay.Night.IconPhrase}`);
        console.log(`   💨 Viento: ${firstDay.Day.Wind.Speed.Value} ${firstDay.Day.Wind.Speed.Unit} ${firstDay.Day.Wind.Direction.Localized}`);
      }
    } else {
      console.log(`   ❌ Error: ${response.statusText}`);
    }

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 INICIANDO PRUEBAS DE LA API DE ACCUWEATHER');
  console.log('=' .repeat(60));
  
  if (!ACCUWEATHER_API_KEY) {
    console.error('❌ VITE_ACCUWEATHER_API_KEY no está configurada');
    console.log('💡 Crea un archivo .env con: VITE_ACCUWEATHER_API_KEY=tu_api_key');
    return;
  }

  console.log(`✅ API Key configurada: ${ACCUWEATHER_API_KEY.substring(0, 10)}...`);
  
  // Casos de prueba
  const testCases = [
    { city: 'Marina del Este', country: 'ES', expected: 'Granada' },
    { city: 'Granada', country: 'ES', expected: 'Granada' },
    { city: 'Almuñécar', country: 'ES', expected: 'Almuñécar' },
    { city: 'Barcelona', country: 'ES', expected: 'Barcelona' },
    { city: 'Mallorca', country: 'ES', expected: 'Palma de Mallorca' },
    { city: 'Ibiza', country: 'ES', expected: 'Ibiza' },
  ];

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(40)}`);
    console.log(`🎯 CASO DE PRUEBA: ${testCase.city}`);
    console.log(`📍 País: ${testCase.country}`);
    console.log(`🎯 Esperado: ${testCase.expected}`);
    
    const locationKey = await testLocationSearch(testCase.city, testCase.country);
    await testWeatherForecast(locationKey, testCase.city);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('🏁 PRUEBAS COMPLETADAS');
}

// Ejecutar pruebas
runTests().catch(console.error);

