#!/usr/bin/env node

/**
 * Script de Configuración para Desarrollo Local
 * Ejecutar: node scripts/dev-setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configurando entorno de desarrollo local...\n');

// Verificar que estamos en el directorio correcto
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto.');
  process.exit(1);
}

// Verificar archivos de configuración
const configFiles = [
  'vite.config.dev.ts',
  'env.local',
  'public/sw-config.js',
  'public/clear-sw-cache.js'
];

console.log('📁 Verificando archivos de configuración...');
configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
  }
});

// Verificar puerto del servidor
console.log('\n🌐 Verificando configuración del servidor...');
try {
  const viteConfig = fs.readFileSync('vite.config.dev.ts', 'utf8');
  if (viteConfig.includes('port: 5174')) {
    console.log('✅ Puerto configurado correctamente: 5174');
  } else {
    console.log('⚠️  Puerto no configurado como 5174');
  }
} catch (error) {
  console.log('❌ No se pudo verificar la configuración de Vite');
}

// Verificar variables de entorno
console.log('\n🔧 Verificando variables de entorno...');
try {
  const envLocal = fs.readFileSync('env.local', 'utf8');
  if (envLocal.includes('VITE_BASE_URL=http://localhost:5174')) {
    console.log('✅ VITE_BASE_URL configurado correctamente');
  } else {
    console.log('⚠️  VITE_BASE_URL no configurado correctamente');
  }
} catch (error) {
  console.log('❌ No se pudo verificar env.local');
}

// Instrucciones para el usuario
console.log('\n📋 INSTRUCCIONES PARA DESARROLLO LOCAL:');
console.log('1. Copia env.local a .env y completa las API keys necesarias');
console.log('2. Ejecuta: npm run dev');
console.log('3. Abre: http://localhost:5174');
console.log('4. Si hay errores del Service Worker, usa en consola: clearServiceWorkerCache()');

console.log('\n🔍 COMANDOS ÚTILES:');
console.log('- npm run dev          - Servidor de desarrollo');
console.log('- npm run build        - Build de producción');
console.log('- npm run lint         - Verificar código (si ESLint está configurado)');
console.log('- npm run preview      - Preview del build');

console.log('\n✨ ¡Configuración de desarrollo completada!');
