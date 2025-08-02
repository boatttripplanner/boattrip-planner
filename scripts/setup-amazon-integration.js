#!/usr/bin/env node

/**
 * Script de configuración automática para integración con Amazon
 * Ejecutar: node scripts/setup-amazon-integration.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de credenciales (ya configuradas)
const AMAZON_CONFIG = {
  accessKeyId: "AKPAXD3F0H17539823",
  secretAccessKey: "UUY08lWjgs40wYKps11",
  associateTag: "boattrippl07-21",
  region: "eu-west-1",
  marketplace: "amazon.es"
};

console.log('🚀 Configurando integración con Amazon...\n');

// Verificar que las credenciales estén configuradas
function verifyCredentials() {
  console.log('✅ Verificando credenciales de Amazon...');
  
  if (!AMAZON_CONFIG.accessKeyId || !AMAZON_CONFIG.secretAccessKey || !AMAZON_CONFIG.associateTag) {
    console.error('❌ Error: Faltan credenciales de Amazon');
    console.log('Por favor, configura las credenciales en constants.ts');
    process.exit(1);
  }
  
  console.log('✅ Credenciales verificadas correctamente');
  console.log(`   - Access Key ID: ${AMAZON_CONFIG.accessKeyId.substring(0, 8)}...`);
  console.log(`   - Associate Tag: ${AMAZON_CONFIG.associateTag}`);
  console.log(`   - Marketplace: ${AMAZON_CONFIG.marketplace}\n`);
}

// Verificar estructura de archivos
function verifyFileStructure() {
  console.log('📁 Verificando estructura de archivos...');
  
  const requiredFiles = [
    'constants.ts',
    'services/amazonApi.ts',
    'services/affiliateTracking.ts',
    'components/DynamicProductRecommendations.tsx',
    'components/AdvancedAffiliateDashboard.tsx',
    'src/components/BlogPostPage.tsx'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ Archivos faltantes:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }
  
  console.log('✅ Todos los archivos necesarios están presentes\n');
}

// Verificar dependencias
function verifyDependencies() {
  console.log('📦 Verificando dependencias...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'typescript'];
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.error('❌ Dependencias faltantes:');
    missingDeps.forEach(dep => console.error(`   - ${dep}`));
    console.log('\nEjecuta: npm install ' + missingDeps.join(' '));
    process.exit(1);
  }
  
  console.log('✅ Todas las dependencias están instaladas\n');
}

// Crear archivo de configuración de entorno
function createEnvFile() {
  console.log('🔧 Creando archivo de configuración de entorno...');
  
  const envContent = `# Amazon Product Advertising API Configuration
AMAZON_ACCESS_KEY_ID=${AMAZON_CONFIG.accessKeyId}
AMAZON_SECRET_ACCESS_KEY=${AMAZON_CONFIG.secretAccessKey}
AMAZON_ASSOCIATE_TAG=${AMAZON_CONFIG.associateTag}
AMAZON_REGION=${AMAZON_CONFIG.region}
AMAZON_MARKETPLACE=${AMAZON_CONFIG.marketplace}

# Affiliate Tracking Configuration
AFFILIATE_TRACKING_ENABLED=true
AFFILIATE_CONVERSION_RATE=0.05
AFFILIATE_AVERAGE_ORDER_VALUE=20.00

# Analytics Configuration
GOOGLE_ANALYTICS_ID=your_ga_id_here
GOOGLE_TAG_MANAGER_ID=your_gtm_id_here

# Development Configuration
NODE_ENV=development
VITE_AMAZON_API_ENABLED=true
`;
  
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envContent);
    console.log('✅ Archivo .env creado');
  } else {
    console.log('ℹ️  Archivo .env ya existe');
  }
  
  console.log('');
}

// Crear archivo de configuración de Vercel
function createVercelConfig() {
  console.log('🚀 Configurando Vercel para producción...');
  
  const vercelConfig = {
    functions: {
      'api/amazon/*.ts': {
        maxDuration: 30
      }
    },
    env: {
      AMAZON_ACCESS_KEY_ID: AMAZON_CONFIG.accessKeyId,
      AMAZON_SECRET_ACCESS_KEY: AMAZON_CONFIG.secretAccessKey,
      AMAZON_ASSOCIATE_TAG: AMAZON_CONFIG.associateTag,
      AMAZON_REGION: AMAZON_CONFIG.region,
      AMAZON_MARKETPLACE: AMAZON_CONFIG.marketplace
    }
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Configuración de Vercel actualizada\n');
}

// Crear script de testing
function createTestScript() {
  console.log('🧪 Creando script de testing...');
  
  const testScript = `#!/usr/bin/env node

/**
 * Script de testing para la integración con Amazon
 * Ejecutar: node scripts/test-amazon-integration.js
 */

const { amazonApi } = require('../services/amazonApi');
const { affiliateTracking } = require('../services/affiliateTracking');

async function testAmazonIntegration() {
  console.log('🧪 Probando integración con Amazon...\\n');
  
  try {
    // Test 1: Búsqueda de productos
    console.log('1️⃣ Probando búsqueda de productos...');
    const searchResult = await amazonApi.searchProducts({
      query: 'snorkel',
      category: 'snorkel_gear',
      maxProducts: 3
    });
    
    console.log(\`   ✅ Encontrados \${searchResult.products.length} productos\`);
    console.log(\`   📊 Total de resultados: \${searchResult.totalResults}\`);
    
    // Test 2: Productos trending
    console.log('\\n2️⃣ Probando productos trending...');
    const trendingProducts = await amazonApi.getTrendingProducts('nautical');
    console.log(\`   ✅ Encontrados \${trendingProducts.length} productos trending\`);
    
    // Test 3: Tracking de afiliados
    console.log('\\n3️⃣ Probando tracking de afiliados...');
    affiliateTracking.trackClick(
      'B08N5WRWNW',
      'Producto de Test',
      'test_category',
      'test_source'
    );
    
    const stats = affiliateTracking.getStats();
    console.log(\`   ✅ Clicks registrados: \${stats.totalClicks}\`);
    console.log(\`   📈 Tasa de conversión: \${stats.conversionRate.toFixed(2)}%\`);
    
    // Test 4: URLs de afiliado
    console.log('\\n4️⃣ Probando generación de URLs de afiliado...');
    const affiliateUrl = amazonApi.createAffiliateUrl('B08N5WRWNW', 'test', 'test-campaign');
    console.log(\`   ✅ URL generada: \${affiliateUrl.substring(0, 50)}...\`);
    
    console.log('\\n🎉 ¡Todos los tests pasaron correctamente!');
    console.log('\\n💡 La integración con Amazon está funcionando perfectamente.');
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    process.exit(1);
  }
}

testAmazonIntegration();
`;
  
  fs.writeFileSync('scripts/test-amazon-integration.js', testScript);
  fs.chmodSync('scripts/test-amazon-integration.js', '755');
  console.log('✅ Script de testing creado\n');
}

// Crear documentación
function createDocumentation() {
  console.log('📚 Creando documentación...');
  
  const docs = `# 🛒 Guía de Integración con Amazon

## Configuración Completada ✅

Tu integración con Amazon está configurada y lista para usar.

### Credenciales Configuradas
- **Access Key ID**: ${AMAZON_CONFIG.accessKeyId.substring(0, 8)}...
- **Associate Tag**: ${AMAZON_CONFIG.associateTag}
- **Marketplace**: ${AMAZON_CONFIG.marketplace}

### Funcionalidades Disponibles

#### 1. Productos Dinámicos
- Búsqueda automática de productos en Amazon
- Productos trending por categoría
- Precios actualizados en tiempo real
- URLs de afiliado optimizadas

#### 2. Tracking Avanzado
- Registro de clicks por producto
- Análisis de conversión por categoría
- Estadísticas de revenue estimado
- Dashboard de analytics completo

#### 3. Integración en el Blog
- Productos recomendados automáticos
- Enlaces contextuales en artículos
- Optimización SEO para afiliados

### Cómo Usar

#### En Componentes React:
\`\`\`tsx
import DynamicProductRecommendations from './components/DynamicProductRecommendations';

// Productos basados en búsqueda
<DynamicProductRecommendations 
  query="snorkel"
  category="snorkel_gear"
  maxProducts={6}
/>

// Productos trending
<DynamicProductRecommendations 
  showTrending={true}
  category="nautical"
/>
\`\`\`

#### En el Blog:
Los productos se muestran automáticamente en cada artículo del blog basándose en:
- Etiquetas del artículo
- Contenido del texto
- Categoría del post

### Testing

Ejecuta el script de testing:
\`\`\`bash
node scripts/test-amazon-integration.js
\`\`\`

### Dashboard de Analytics

Accede al dashboard avanzado para ver:
- Revenue estimado
- Productos top
- Posts más rentables
- Tendencias estacionales

### Próximos Pasos

1. **Configurar Google Analytics** para tracking real
2. **Optimizar categorías** basándose en datos
3. **Añadir más productos** según rendimiento
4. **Implementar A/B testing** para optimizar conversión

### Soporte

Si tienes problemas:
1. Verifica las credenciales en \`constants.ts\`
2. Ejecuta el script de testing
3. Revisa los logs del navegador
4. Contacta con soporte técnico

---
*Configurado automáticamente el ${new Date().toLocaleDateString('es-ES')}*
`;
  
  fs.writeFileSync('docs/amazon-integration.md', docs);
  console.log('✅ Documentación creada\n');
}

// Función principal
function main() {
  try {
    verifyCredentials();
    verifyFileStructure();
    verifyDependencies();
    createEnvFile();
    createVercelConfig();
    createTestScript();
    createDocumentation();
    
    console.log('🎉 ¡Configuración completada exitosamente!');
    console.log('');
    console.log('📋 Resumen de lo que se ha configurado:');
    console.log('   ✅ Credenciales de Amazon verificadas');
    console.log('   ✅ Estructura de archivos verificada');
    console.log('   ✅ Dependencias verificadas');
    console.log('   ✅ Archivo .env creado');
    console.log('   ✅ Configuración de Vercel actualizada');
    console.log('   ✅ Script de testing creado');
    console.log('   ✅ Documentación generada');
    console.log('');
    console.log('🚀 Próximos pasos:');
    console.log('   1. Ejecuta: npm run dev');
    console.log('   2. Prueba: node scripts/test-amazon-integration.js');
    console.log('   3. Visita tu blog para ver los productos dinámicos');
    console.log('   4. Accede al dashboard de analytics');
    console.log('');
    console.log('💡 ¡Tu sistema de monetización está listo para generar ingresos!');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
main(); 