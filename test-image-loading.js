// test-image-loading.js
// Script para probar la carga de imágenes de Amazon

const { getProductImagesByTitle } = require('./services/amazonImageUrls.ts');

// Productos de prueba
const testProducts = [
  'Cressi Palau Short Fin - Aletas de Snorkel Profesionales',
  'Cressi F1 - Máscara de Snorkel con Visibilidad Panorámica',
  'Garmin Striker 4 - GPS Náutico con Sonda de Profundidad',
  'Crewsaver Crewfit 150N - Chaleco Salvavidas Homologado',
  'Coleman 50L - Nevera Portátil para Barco',
  'GoPro HERO11 Black - Cámara Sumergible 5.3K'
];

console.log('🧪 Probando carga de imágenes de Amazon...\n');

testProducts.forEach((productTitle, index) => {
  console.log(`📦 Producto ${index + 1}: ${productTitle}`);
  
  try {
    const images = getProductImagesByTitle(productTitle);
    console.log(`   ✅ URLs encontradas: ${images.length}`);
    
    images.forEach((url, urlIndex) => {
      console.log(`   📸 URL ${urlIndex + 1}: ${url}`);
      
      // Test de carga de imagen
      const img = new Image();
      img.onload = () => {
        console.log(`      ✅ Imagen ${urlIndex + 1} cargada correctamente`);
      };
      img.onerror = () => {
        console.log(`      ❌ Error al cargar imagen ${urlIndex + 1}`);
      };
      img.src = url;
    });
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
});

console.log('🎯 Prueba completada. Revisa la consola para ver los resultados.'); 