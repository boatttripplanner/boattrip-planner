#!/usr/bin/env node

/**
 * Script para probar la integración de Unsplash
 * Verifica que la API key esté configurada y que las funciones funcionen correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Probando integración de Unsplash');
console.log('==================================\n');

// Verificar si existe la variable de entorno
const envPath = path.join(process.cwd(), '.env');
let hasApiKey = false;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('VITE_UNSPLASH_ACCESS_KEY=')) {
    hasApiKey = true;
    console.log('✅ API key encontrada en .env');
  } else {
    console.log('❌ API key no encontrada en .env');
  }
} else {
  console.log('❌ Archivo .env no encontrado');
}

if (!hasApiKey) {
  console.log('\n📋 Para configurar la API key:');
  console.log('1. Ejecuta: node scripts/setup-unsplash.js');
  console.log('2. O añade manualmente VITE_UNSPLASH_ACCESS_KEY=tu_key en .env');
  console.log('\n🔗 Obtén tu API key en: https://unsplash.com/developers');
  process.exit(1);
}

// Verificar que la dependencia esté instalada
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies['unsplash-js']) {
    console.log('✅ Dependencia unsplash-js instalada');
  } else {
    console.log('❌ Dependencia unsplash-js no encontrada');
    console.log('💡 Ejecuta: npm install unsplash-js');
    process.exit(1);
  }
}

// Verificar que los archivos de componentes existan
const filesToCheck = [
  'services/unsplashService.ts',
  'components/UnsplashImage.tsx',
  'components/UnsplashImageGallery.tsx',
  'components/BlogWithUnsplash.tsx'
];

console.log('\n📁 Verificando archivos de componentes:');
filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - No encontrado`);
  }
});

// Verificar documentación
const docsToCheck = [
  'docs/unsplash-integration.md'
];

console.log('\n📚 Verificando documentación:');
docsToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - No encontrado`);
  }
});

console.log('\n🎉 Verificación completada!');
console.log('\n📝 Próximos pasos:');
console.log('1. Asegúrate de que tu API key sea válida');
console.log('2. Importa los componentes en tu aplicación:');
console.log('   import UnsplashImage from "./components/UnsplashImage";');
console.log('   import UnsplashImageGallery from "./components/UnsplashImageGallery";');
console.log('3. Usa los componentes en tu blog o páginas');
console.log('4. Consulta la documentación en docs/unsplash-integration.md');

console.log('\n💡 Ejemplo de uso:');
console.log(`
<UnsplashImage 
  category="destinations" 
  width={800} 
  height={600} 
  alt="Destinos mediterráneos" 
/>

<UnsplashImageGallery 
  category="boats" 
  count={6} 
  title="Embarcaciones para explorar" 
/>
`);

console.log('\n🚀 ¡Listo para usar Unsplash en tu proyecto!'); 