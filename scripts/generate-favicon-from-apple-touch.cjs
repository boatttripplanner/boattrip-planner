const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  try {
    console.log('🚤 Generando favicons desde apple-touch-icon.png...');
    
    const appleTouchIconPath = path.join(__dirname, '../public/apple-touch-icon.png');
    const outputDir = path.join(__dirname, '../public');
    
    // Verificar que existe el archivo fuente
    if (!fs.existsSync(appleTouchIconPath)) {
      console.error('❌ No se encontró apple-touch-icon.png');
      return;
    }
    
    // Generar favicon-16x16.png
    console.log('🔍 Generando favicon-16x16.png...');
    await sharp(appleTouchIconPath)
      .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    
    // Generar favicon-32x32.png
    console.log('📱 Generando favicon-32x32.png...');
    await sharp(appleTouchIconPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    
    // Generar favicon-48x48.png
    console.log('📐 Generando favicon-48x48.png...');
    await sharp(appleTouchIconPath)
      .resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-48x48.png'));
    
    // Generar favicon-96x96.png
    console.log('💎 Generando favicon-96x96.png...');
    await sharp(appleTouchIconPath)
      .resize(96, 96, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-96x96.png'));
    
    // Generar favicon-192x192.png
    console.log('📱 Generando favicon-192x192.png...');
    await sharp(appleTouchIconPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-192x192.png'));
    
    // Generar favicon-512x512.png
    console.log('🖥️ Generando favicon-512x512.png...');
    await sharp(appleTouchIconPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-512x512.png'));
    
    console.log('✅ Favicons generados exitosamente!');
    console.log('📁 Archivos creados en:', outputDir);
    console.log('🔗 Ahora actualiza el HTML para usar estos nuevos favicons');
    
  } catch (error) {
    console.error('❌ Error generando favicons:', error);
  }
}

generateFavicons();
