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
  <!-- Fondo circular de agua -->
  <circle cx="50" cy="50" r="45" fill="${themeColors.accent}" stroke="none"/>
  
  <!-- Elemento de agua/onda -->
  <path d="M 15 65 Q 25 45 35 50 Q 45 55 50 50 Q 55 45 65 50 Q 75 55 85 50 L 85 65 Z" fill="${themeColors.accent}" stroke="none"/>
  
  <!-- Vela trasera (más oscura) -->
  <path d="M 45 25 L 45 60 L 35 60 Z" fill="${themeColors.primary}" stroke="none"/>
  
  <!-- Vela delantera (más oscura) -->
  <path d="M 55 20 L 55 60 L 45 60 Z" fill="${themeColors.primary}" stroke="none"/>
  
  <!-- Casco del barco (azul claro) -->
  <path d="M 30 60 Q 50 70 70 60 L 70 65 Q 50 75 30 65 Z" fill="${themeColors.secondary}" stroke="none"/>
  
  <!-- Detalle del casco -->
  <path d="M 35 62 Q 50 68 65 62" stroke="#3B82F6" stroke-width="1" fill="none"/>
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