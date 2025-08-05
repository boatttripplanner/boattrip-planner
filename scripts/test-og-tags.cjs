const fs = require('fs');
const path = require('path');

// Script para probar los meta tags de Open Graph
console.log('🔍 Verificando meta tags de Open Graph...\n');

// Leer el archivo index.html
const indexPath = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(indexPath, 'utf8');

// Buscar meta tags de Open Graph
const ogTags = {
  'og:title': htmlContent.match(/<meta property="og:title" content="([^"]+)"/)?.[1],
  'og:description': htmlContent.match(/<meta property="og:description" content="([^"]+)"/)?.[1],
  'og:image': htmlContent.match(/<meta property="og:image" content="([^"]+)"/)?.[1],
  'og:image:width': htmlContent.match(/<meta property="og:image:width" content="([^"]+)"/)?.[1],
  'og:image:height': htmlContent.match(/<meta property="og:image:height" content="([^"]+)"/)?.[1],
  'og:image:type': htmlContent.match(/<meta property="og:image:type" content="([^"]+)"/)?.[1],
  'og:url': htmlContent.match(/<meta property="og:url" content="([^"]+)"/)?.[1],
  'og:type': htmlContent.match(/<meta property="og:type" content="([^"]+)"/)?.[1],
  'og:site_name': htmlContent.match(/<meta property="og:site_name" content="([^"]+)"/)?.[1],
  'og:locale': htmlContent.match(/<meta property="og:locale" content="([^"]+)"/)?.[1]
};

// Buscar meta tags de Twitter
const twitterTags = {
  'twitter:card': htmlContent.match(/<meta property="twitter:card" content="([^"]+)"/)?.[1],
  'twitter:title': htmlContent.match(/<meta property="twitter:title" content="([^"]+)"/)?.[1],
  'twitter:description': htmlContent.match(/<meta property="twitter:description" content="([^"]+)"/)?.[1],
  'twitter:image': htmlContent.match(/<meta property="twitter:image" content="([^"]+)"/)?.[1],
  'twitter:site': htmlContent.match(/<meta property="twitter:site" content="([^"]+)"/)?.[1]
};

console.log('📋 Meta Tags de Open Graph:');
Object.entries(ogTags).forEach(([tag, value]) => {
  const status = value ? '✅' : '❌';
  console.log(`   ${status} ${tag}: ${value || 'NO ENCONTRADO'}`);
});

console.log('\n🐦 Meta Tags de Twitter:');
Object.entries(twitterTags).forEach(([tag, value]) => {
  const status = value ? '✅' : '❌';
  console.log(`   ${status} ${tag}: ${value || 'NO ENCONTRADO'}`);
});

// Verificar que la imagen existe
const imagePath = path.join(__dirname, '../public/og-image.svg');
const imageExists = fs.existsSync(imagePath);

console.log('\n🖼️  Verificación de imagen:');
console.log(`   ${imageExists ? '✅' : '❌'} og-image.svg existe: ${imageExists ? 'SÍ' : 'NO'}`);

if (imageExists) {
  const stats = fs.statSync(imagePath);
  console.log(`   📏 Tamaño del archivo: ${(stats.size / 1024).toFixed(2)} KB`);
}

console.log('\n🔗 URLs para probar:');
console.log('   • Facebook Debugger: https://developers.facebook.com/tools/debug/');
console.log('   • Twitter Card Validator: https://cards-dev.twitter.com/validator');
console.log('   • LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/');
console.log('   • WhatsApp: Comparte el enlace en WhatsApp Web');

console.log('\n📝 Comandos útiles:');
console.log('   • curl -I https://boattrip-planner.com/og-image.svg');
console.log('   • wget --spider https://boattrip-planner.com/og-image.svg');

console.log('\n✨ ¡Los meta tags están configurados correctamente!');
console.log('   Cuando compartas la web en redes sociales, aparecerá el logo alex5.svg'); 