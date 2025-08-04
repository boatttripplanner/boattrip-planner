#!/usr/bin/env node

/**
 * Script para configurar Unsplash API
 * 
 * Pasos para obtener la API key:
 * 1. Ve a https://unsplash.com/developers
 * 2. Crea una cuenta o inicia sesión
 * 3. Crea una nueva aplicación
 * 4. Copia la Access Key
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Configuración de Unsplash API');
console.log('================================\n');

console.log('Para obtener tu API key de Unsplash:');
console.log('1. Ve a https://unsplash.com/developers');
console.log('2. Crea una cuenta o inicia sesión');
console.log('3. Crea una nueva aplicación');
console.log('4. Copia la Access Key\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('¿Tienes tu API key de Unsplash? (s/n): ', (answer) => {
  if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    readline.question('Ingresa tu API key de Unsplash: ', (apiKey) => {
      if (apiKey.trim()) {
        setupEnvironmentVariable(apiKey.trim());
      } else {
        console.log('❌ API key no válida');
        readline.close();
      }
    });
  } else {
    console.log('\n📋 Pasos para obtener la API key:');
    console.log('1. Ve a https://unsplash.com/developers');
    console.log('2. Haz clic en "Register as a developer"');
    console.log('3. Completa el formulario de registro');
    console.log('4. Una vez registrado, ve a "Your apps"');
    console.log('5. Haz clic en "New Application"');
    console.log('6. Completa la información de tu aplicación');
    console.log('7. Copia la "Access Key" que aparece\n');
    
    console.log('💡 La API de Unsplash es completamente gratuita para uso comercial');
    console.log('   - 5,000 requests por hora');
    console.log('   - 50,000 requests por mes');
    console.log('   - Sin límites de descarga\n');
    
    readline.close();
  }
});

function setupEnvironmentVariable(apiKey) {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = `VITE_UNSPLASH_ACCESS_KEY=${apiKey}\n`;
  
  try {
    // Verificar si el archivo .env existe
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');
      
      // Verificar si ya existe la variable
      if (content.includes('VITE_UNSPLASH_ACCESS_KEY=')) {
        content = content.replace(/VITE_UNSPLASH_ACCESS_KEY=.*\n?/g, envContent);
      } else {
        content += envContent;
      }
      
      fs.writeFileSync(envPath, content);
    } else {
      fs.writeFileSync(envPath, envContent);
    }
    
    console.log('✅ API key configurada correctamente en .env');
    console.log('🔑 Variable: VITE_UNSPLASH_ACCESS_KEY');
    console.log('\n📝 Recuerda:');
    console.log('   - Nunca compartas tu API key');
    console.log('   - El archivo .env debe estar en .gitignore');
    console.log('   - Para producción, configura la variable en tu hosting\n');
    
    // Verificar .gitignore
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        console.log('⚠️  Advertencia: .env no está en .gitignore');
        console.log('   Añade ".env" a tu archivo .gitignore para mayor seguridad\n');
      }
    }
    
  } catch (error) {
    console.error('❌ Error al configurar la API key:', error.message);
  }
  
  readline.close();
} 