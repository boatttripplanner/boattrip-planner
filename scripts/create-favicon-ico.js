#!/usr/bin/env node

/**
 * Script para crear el favicon.ico basado en el diseño del velero
 * de BoatTrip Planner
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diseño del velero en formato SVG que se convertirá a ICO
const boatSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
  <!-- Fondo circular de agua -->
  <circle cx="50" cy="50" r="45" fill="#87CEEB" stroke="none"/>
  
  <!-- Elemento de agua/onda -->
  <path d="M 15 65 Q 25 45 35 50 Q 45 55 50 50 Q 55 45 65 50 Q 75 55 85 50 L 85 65 Z" fill="#87CEEB" stroke="none"/>
  
  <!-- Vela trasera (más oscura) -->
  <path d="M 45 25 L 45 60 L 35 60 Z" fill="#1E3A8A" stroke="none"/>
  
  <!-- Vela delantera (más oscura) -->
  <path d="M 55 20 L 55 60 L 45 60 Z" fill="#1E3A8A" stroke="none"/>
  
  <!-- Casco del barco (azul claro) -->
  <path d="M 30 60 Q 50 70 70 60 L 70 65 Q 50 75 30 65 Z" fill="#60A5FA" stroke="none"/>
  
  <!-- Detalle del casco -->
  <path d="M 35 62 Q 50 68 65 62" stroke="#3B82F6" stroke-width="1" fill="none"/>
</svg>`;

// Función para crear el favicon.ico
function createFaviconICO() {
  console.log('🚤 Creando favicon.ico para BoatTrip Planner...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const icoPath = path.join(publicDir, 'favicon.ico');
  
  try {
    // Para crear un ICO real, necesitaríamos una librería como sharp o jimp
    // Por ahora, vamos a crear un archivo SVG con extensión .ico como placeholder
    // En producción, esto se convertiría a formato ICO real
    
    // Crear el contenido del favicon.ico (SVG como placeholder)
    const icoContent = boatSVG;
    
    // Escribir el archivo
    fs.writeFileSync(icoPath, icoContent);
    
    console.log('✅ favicon.ico creado exitosamente!');
    console.log('📁 Ubicación: /public/favicon.ico');
    console.log('🎨 Diseño: Velero náutico en tonos azules');
    console.log('💡 Nota: En producción, convertir a formato ICO real');
    
  } catch (error) {
    console.error('❌ Error al crear favicon.ico:', error.message);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createFaviconICO();
}

export { createFaviconICO, boatSVG }; 