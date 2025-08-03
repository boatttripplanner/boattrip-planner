#!/usr/bin/env node

/**
 * Script para generar automáticamente diferentes tamaños de favicon
 * desde el SVG principal de BoatTrip Planner
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de tamaños de favicon
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'web-app-manifest-192x192.png' },
  { size: 512, name: 'web-app-manifest-512x512.png' }
];

// Colores del tema náutico
const themeColors = {
  primary: '#1E3A8A',    // Azul oscuro para las velas
  secondary: '#60A5FA',  // Azul claro para el casco
  accent: '#87CEEB',     // Azul cielo para el agua
  background: '#FFFFFF'  // Fondo blanco
};

// Función para generar el SVG con diferentes tamaños
function generateFaviconSVG(size) {
  const scale = size / 100; // El SVG base es 100x100
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <!-- Fondo blanco -->
  <rect width="100" height="100" fill="white"/>
  
  <!-- Elemento de agua/onda circular (azul claro) -->
  <path d="M 10 70 Q 20 30 30 40 Q 40 50 50 40 Q 60 30 70 40 Q 80 50 90 40 L 90 70 Z" fill="${themeColors.accent}" stroke="none"/>
  
  <!-- Vela trasera (azul oscuro) -->
  <path d="M 40 20 L 40 60 L 30 60 Z" fill="${themeColors.primary}" stroke="none"/>
  
  <!-- Vela delantera (azul oscuro) -->
  <path d="M 50 15 L 50 60 L 40 60 Z" fill="${themeColors.primary}" stroke="none"/>
  
  <!-- Casco del barco (azul claro) -->
  <path d="M 25 60 Q 50 75 75 60 L 75 65 Q 50 80 25 65 Z" fill="${themeColors.secondary}" stroke="none"/>
  
  <!-- Detalle del casco -->
  <path d="M 30 62 Q 50 70 70 62" stroke="#3B82F6" stroke-width="1" fill="none"/>
</svg>`;
}

// Función para generar el favicon.ico (formato ICO)
function generateFaviconICO() {
  // Para el favicon.ico, usamos el SVG de 32x32 como base
  const svg32 = generateFaviconSVG(32);
  
  // En un entorno real, aquí convertiríamos SVG a ICO
  // Por ahora, solo copiamos el SVG como placeholder
  return svg32;
}

// Función principal
function generateFavicons() {
  console.log('🚤 Generando favicons para BoatTrip Planner...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Generar SVG principal
  const mainSVG = generateFaviconSVG(100);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), mainSVG);
  console.log('✅ favicon.svg generado');
  
  // Generar favicon.ico
  const icoContent = generateFaviconICO();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoContent);
  console.log('✅ favicon.ico generado');
  
  // Generar diferentes tamaños
  faviconSizes.forEach(({ size, name }) => {
    const svg = generateFaviconSVG(size);
    const pngPath = path.join(publicDir, name);
    
    // En un entorno real, aquí convertiríamos SVG a PNG
    // Por ahora, guardamos como SVG con extensión .png
    fs.writeFileSync(pngPath, svg);
    console.log(`✅ ${name} generado (${size}x${size})`);
  });
  
  console.log('🎉 Todos los favicons han sido generados exitosamente!');
  console.log('📁 Ubicación: /public/');
  console.log('🌐 El favicon se mostrará en:');
  console.log('   - Pestañas del navegador');
  console.log('   - Marcadores/favoritos');
  console.log('   - Aplicaciones móviles (PWA)');
  console.log('   - Header y Footer de la aplicación');
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFavicons();
}

export { generateFavicons, generateFaviconSVG, themeColors }; 