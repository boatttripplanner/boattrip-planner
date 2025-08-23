// scripts/test-product-verifier.js
const { amazonProductVerifier } = require('../services/amazonProductVerifier');

async function testProductVerifier() {
  console.log('🧪 Probando sistema de verificación de productos...\n');

  try {
    // Test 1: Verificar productos clave
    console.log('1️⃣ Verificando productos clave...');
    const keyProducts = [
      'protector solar spf50+',
      'equipo snorkel completo',
      'chaleco salvavidas homologado',
      'gps navegación náutica',
      'cámara acción gopro',
      'nevera portátil barco'
    ];

    for (const query of keyProducts) {
      console.log(`\n🔍 Probando: "${query}"`);
      const alternatives = await amazonProductVerifier.findAlternativeProducts(query, 'nautical', 2);
      
      if (alternatives.bestAlternative) {
        console.log(`✅ Encontrado: ${alternatives.bestAlternative.title}`);
        console.log(`   ASIN: ${alternatives.bestAlternative.asin}`);
        console.log(`   Precio: €${alternatives.bestAlternative.price}`);
        console.log(`   Rating: ${alternatives.bestAlternative.rating}/5`);
        console.log(`   Enlace: ${alternatives.bestAlternative.affiliateUrl}`);
      } else {
        console.log(`❌ No se encontraron alternativas`);
      }
    }

    // Test 2: Verificar base de datos completa
    console.log('\n\n2️⃣ Verificando base de datos completa...');
    const verifiedProducts = await amazonProductVerifier.verifyRecommendedProducts();
    
    console.log(`\n📊 Resumen de verificación:`);
    console.log(`   Total de productos verificados: ${verifiedProducts.size}`);
    
    for (const [category, product] of verifiedProducts.entries()) {
      console.log(`   ${category}: ${product.title} (${product.asin})`);
    }

    // Test 3: Limpiar cache
    console.log('\n\n3️⃣ Limpiando cache...');
    amazonProductVerifier.cleanExpiredCache();
    console.log('✅ Cache limpiado');

    console.log('\n🎉 ¡Pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  testProductVerifier();
}

module.exports = { testProductVerifier };
