// Verificar variables de entorno
require('dotenv').config();

console.log('🔍 VERIFICANDO VARIABLES DE ENTORNO');
console.log('=' .repeat(40));

console.log('VITE_ACCUWEATHER_API_KEY:', process.env.VITE_ACCUWEATHER_API_KEY ? '✅ Configurada' : '❌ No configurada');
console.log('VITE_GEMINI_API_KEY:', process.env.VITE_GEMINI_API_KEY ? '✅ Configurada' : '❌ No configurada');

if (process.env.VITE_ACCUWEATHER_API_KEY) {
  console.log('📝 API Key (primeros 10 caracteres):', process.env.VITE_ACCUWEATHER_API_KEY.substring(0, 10) + '...');
}

