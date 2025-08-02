#!/usr/bin/env node

/**
 * Script de testing para la integración con Amazon
 * Ejecutar: node scripts/test-amazon-integration.js
 */

import { amazonApi } from '../services/amazonApi.js';
import { affiliateTracking } from '../services/affiliateTracking.js';

async function testAmazonIntegration() {
  console.log('🧪 Probando integración con Amazon...\n');
  
  try {
    // Test 1: Búsqueda de productos
    console.log('1️⃣ Probando búsqueda de productos...');
    const searchResult = await amazonApi.searchProducts({
      query: 'snorkel',
      category: 'snorkel_gear',
      maxProducts: 3
    });
    
    console.log(`   ✅ Encontrados ${searchResult.products.length} productos`);
    console.log(`   📊 Total de resultados: ${searchResult.totalResults}`);
    
    // Test 2: Productos trending
    console.log('\n2️⃣ Probando productos trending...');
    const trendingProducts = await amazonApi.getTrendingProducts('nautical');
    console.log(`   ✅ Encontrados ${trendingProducts.length} productos trending`);
    
    // Test 3: Tracking de afiliados
    console.log('\n3️⃣ Probando tracking de afiliados...');
    affiliateTracking.trackClick(
      'B08N5WRWNW',
      'Producto de Test',
      'test_category',
      'test_source'
    );
    
    const stats = affiliateTracking.getStats();
    console.log(`   ✅ Clicks registrados: ${stats.totalClicks}`);
    console.log(`   📈 Tasa de conversión: ${stats.conversionRate.toFixed(2)}%`);
    
    // Test 4: URLs de afiliado
    console.log('\n4️⃣ Probando generación de URLs de afiliado...');
    const affiliateUrl = amazonApi.createAffiliateUrl('B08N5WRWNW', 'test', 'test-campaign');
    console.log(`   ✅ URL generada: ${affiliateUrl.substring(0, 50)}...`);
    
    console.log('\n🎉 ¡Todos los tests pasaron correctamente!');
    console.log('\n💡 La integración con Amazon está funcionando perfectamente.');
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    process.exit(1);
  }
}

testAmazonIntegration();
