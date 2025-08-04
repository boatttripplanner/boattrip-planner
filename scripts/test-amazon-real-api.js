// scripts/test-amazon-real-api.js
// 🧪 Script para probar la API real de Amazon Product Advertising API

import crypto from 'crypto';
import fetch from 'node-fetch';

// Configuración de la API
const AMAZON_API_CONFIG = {
  accessKeyId: 'AKPAXD3F0H1753982397',
  secretAccessKey: 'UUY08lWjgs40wYKps1NGLx8RjA2zAXYoQ5e6fw33',
  associateTag: 'explorashop18-21',
  marketplace: 'amazon.es',
  region: 'eu-west-1',
      host: 'webservices.amazon.com',
  service: 'ProductAdvertisingAPI',
  version: '2013-08-01'
};

// Generar firma AWS Signature Version 4
function generateSignature(method, path, queryParams, headers, payload = '') {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().split('T')[0].replace(/-/g, '');
  
  // Headers requeridos
  const signedHeaders = {
    'host': AMAZON_API_CONFIG.host,
    'x-amz-date': new Date(timestamp * 1000).toISOString().replace(/[:-]|\.\d{3}/g, ''),
    'x-amz-target': `${AMAZON_API_CONFIG.service}.SearchItems`,
    'content-type': 'application/json; charset=utf-8'
  };

  // Canonical request
  const canonicalHeaders = Object.keys(signedHeaders)
    .sort()
    .map(key => `${key}:${signedHeaders[key]}`)
    .join('\n') + '\n';

  const signedHeadersString = Object.keys(signedHeaders).sort().join(';');
  
  const canonicalRequest = [
    method,
    path,
    queryParams,
    canonicalHeaders,
    signedHeadersString,
    crypto.createHash('sha256').update(payload).digest('hex')
  ].join('\n');

  // String to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${date}/${AMAZON_API_CONFIG.region}/${AMAZON_API_CONFIG.service}/aws4_request`;
  const stringToSign = [
    algorithm,
    signedHeaders['x-amz-date'],
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  // Calculate signature
  const dateKey = crypto.createHmac('sha256', `AWS4${AMAZON_API_CONFIG.secretAccessKey}`).update(date).digest();
  const dateRegionKey = crypto.createHmac('sha256', dateKey).update(AMAZON_API_CONFIG.region).digest();
  const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update(AMAZON_API_CONFIG.service).digest();
  const signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  // Authorization header
  const authorization = `${algorithm} Credential=${AMAZON_API_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersString}, Signature=${signature}`;

  return {
    ...signedHeaders,
    'authorization': authorization
  };
}

// Función para hacer búsqueda de productos
async function searchProducts(query, category = 'All', maxResults = 5) {
  try {
    console.log(`🔍 Buscando productos: "${query}" en categoría "${category}"`);
    
    const payload = {
      Keywords: query,
      SearchIndex: category,
      ItemCount: maxResults,
      ItemPage: 1,
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating',
        'Images.Primary.Large',
        'ItemInfo.Features',
        'ItemInfo.ByLineInfo'
      ],
      PartnerTag: AMAZON_API_CONFIG.associateTag,
      PartnerType: 'Associates',
      Marketplace: AMAZON_API_CONFIG.marketplace
    };

    const headers = generateSignature('POST', '/paapi5/searchitems', '', {}, JSON.stringify(payload));
    
    // URL corregida para la API de Amazon
    const response = await fetch(`https://${AMAZON_API_CONFIG.host}/paapi5/searchitems`, {
      method: 'POST',
      headers: {
        ...headers,
        'content-length': JSON.stringify(payload).length.toString()
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('📡 Error response body:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Respuesta recibida de Amazon API');
    console.log(`📊 Total de resultados: ${data.SearchResult?.TotalResultCount || 0}`);
    console.log(`📦 Productos encontrados: ${data.SearchResult?.Items?.length || 0}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error en búsqueda:', error.message);
    throw error;
  }
}

// Función para obtener detalles de un producto
async function getProductDetails(asin) {
  try {
    console.log(`🔍 Obteniendo detalles del producto: ${asin}`);
    
    const payload = {
      ItemIds: [asin],
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating',
        'Images.Primary.Large',
        'ItemInfo.Features',
        'ItemInfo.ByLineInfo'
      ],
      PartnerTag: AMAZON_API_CONFIG.associateTag,
      PartnerType: 'Associates',
      Marketplace: AMAZON_API_CONFIG.marketplace
    };

    const headers = generateSignature('POST', '/paapi5/getitems', '', {}, JSON.stringify(payload));
    
    const response = await fetch(`https://${AMAZON_API_CONFIG.host}/paapi5/getitems`, {
      method: 'POST',
      headers: {
        ...headers,
        'content-length': JSON.stringify(payload).length.toString()
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('📡 Error response body:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.ItemsResult?.Items || data.ItemsResult.Items.length === 0) {
      console.log('⚠️ Producto no encontrado');
      return null;
    }

    console.log('✅ Detalles del producto obtenidos');
    return data.ItemsResult.Items[0];
  } catch (error) {
    console.error('❌ Error obteniendo detalles:', error.message);
    throw error;
  }
}

// Función para procesar y mostrar resultados
function processSearchResults(data) {
  if (!data.SearchResult?.Items) {
    console.log('❌ No se encontraron productos');
    return;
  }

  console.log('\n📦 PRODUCTOS ENCONTRADOS:');
  console.log('='.repeat(80));
  
  data.SearchResult.Items.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.ItemInfo?.Title?.DisplayValue || 'Sin título'}`);
    console.log(`   ASIN: ${item.ASIN}`);
    console.log(`   Precio: ${item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'No disponible'}`);
    console.log(`   Rating: ⭐ ${item.CustomerReviews?.StarRating?.Value || 0}/5 (${item.CustomerReviews?.Count || 0} reseñas)`);
    console.log(`   Marca: ${item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Sin marca'}`);
    console.log(`   Prime: ${item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible ? '✅' : '❌'}`);
    
    if (item.Images?.Primary?.Large?.URL) {
      console.log(`   Imagen: ${item.Images.Primary.Large.URL}`);
    }
    
    if (item.ItemInfo?.Features?.DisplayValues) {
      console.log(`   Características: ${item.ItemInfo.Features.DisplayValues.slice(0, 2).join(', ')}`);
    }
  });
}

// Función para procesar detalles de producto
function processProductDetails(item) {
  if (!item) {
    console.log('❌ No hay detalles del producto');
    return;
  }

  console.log('\n📋 DETALLES DEL PRODUCTO:');
  console.log('='.repeat(80));
  console.log(`Título: ${item.ItemInfo?.Title?.DisplayValue || 'Sin título'}`);
  console.log(`ASIN: ${item.ASIN}`);
  console.log(`Precio: ${item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'No disponible'}`);
  console.log(`Rating: ⭐ ${item.CustomerReviews?.StarRating?.Value || 0}/5 (${item.CustomerReviews?.Count || 0} reseñas)`);
  console.log(`Marca: ${item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Sin marca'}`);
  console.log(`Prime: ${item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible ? '✅' : '❌'}`);
  
  if (item.Images?.Primary?.Large?.URL) {
    console.log(`Imagen: ${item.Images.Primary.Large.URL}`);
  }
  
  if (item.ItemInfo?.Features?.DisplayValues) {
    console.log('\nCaracterísticas:');
    item.ItemInfo.Features.DisplayValues.forEach((feature, index) => {
      console.log(`  ${index + 1}. ${feature}`);
    });
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🚀 INICIANDO PRUEBAS DE AMAZON PRODUCT ADVERTISING API');
  console.log('='.repeat(80));
  console.log(`🔑 Access Key ID: ${AMAZON_API_CONFIG.accessKeyId}`);
  console.log(`🏷️ Associate Tag: ${AMAZON_API_CONFIG.associateTag}`);
  console.log(`🌍 Marketplace: ${AMAZON_API_CONFIG.marketplace}`);
  console.log(`🔗 Host: ${AMAZON_API_CONFIG.host}`);
  console.log('='.repeat(80));

  try {
    // Prueba 1: Búsqueda de productos náuticos
    console.log('\n🧪 PRUEBA 1: Búsqueda de productos náuticos');
    const searchResults = await searchProducts('chaleco salvavidas náutico', 'SportsAndOutdoor', 3);
    processSearchResults(searchResults);

    // Prueba 2: Búsqueda de GPS
    console.log('\n🧪 PRUEBA 2: Búsqueda de GPS náutico');
    const gpsResults = await searchProducts('gps náutico', 'Electronics', 3);
    processSearchResults(gpsResults);

    // Prueba 3: Detalles de un producto específico
    if (searchResults.SearchResult?.Items?.length > 0) {
      console.log('\n🧪 PRUEBA 3: Detalles de producto específico');
      const firstProduct = searchResults.SearchResult.Items[0];
      const productDetails = await getProductDetails(firstProduct.ASIN);
      processProductDetails(productDetails);
    }

    // Prueba 4: Búsqueda de equipamiento de snorkel
    console.log('\n🧪 PRUEBA 4: Búsqueda de equipamiento de snorkel');
    const snorkelResults = await searchProducts('máscara snorkel cressi', 'SportsAndOutdoor', 3);
    processSearchResults(snorkelResults);

    console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('🎉 La API de Amazon está funcionando correctamente');

  } catch (error) {
    console.error('\n❌ ERROR EN LAS PRUEBAS:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.message.includes('401')) {
      console.error('🔑 Error de autenticación: Verifica las credenciales');
    } else if (error.message.includes('403')) {
      console.error('🚫 Error de autorización: Verifica los permisos de la API');
    } else if (error.message.includes('429')) {
      console.error('⏱️ Rate limit excedido: Espera antes de hacer más llamadas');
    } else if (error.message.includes('500')) {
      console.error('🔧 Error del servidor de Amazon: Intenta más tarde');
    } else if (error.message.includes('404')) {
      console.error('🔗 Error 404: Verifica la URL del endpoint');
    }
  }
}

// Ejecutar pruebas
runTests().catch(console.error); 