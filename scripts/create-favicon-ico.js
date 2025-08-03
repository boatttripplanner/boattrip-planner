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

// Usar el favicon-96x96.png como base para el favicon.ico
const favicon96x96Path = path.join(__dirname, '..', 'public', 'favicon-96x96.png');

// Función para crear el favicon.ico
function createFaviconICO() {
  console.log('🚤 Creando favicon.ico para BoatTrip Planner...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const icoPath = path.join(publicDir, 'favicon.ico');
  
  try {
    // Copiar el favicon-96x96.png como favicon.ico
    if (fs.existsSync(favicon96x96Path)) {
      const pngContent = fs.readFileSync(favicon96x96Path);
      fs.writeFileSync(icoPath, pngContent);
      
      console.log('✅ favicon.ico creado exitosamente!');
      console.log('📁 Ubicación: /public/favicon.ico');
      console.log('🎨 Fuente: favicon-96x96.png');
      console.log('💡 Nota: favicon.ico es una copia del favicon-96x96.png');
    } else {
      console.error('❌ Error: favicon-96x96.png no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error al crear favicon.ico:', error.message);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createFaviconICO();
}

export { createFaviconICO }; 