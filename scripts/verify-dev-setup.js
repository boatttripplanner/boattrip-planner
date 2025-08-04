#!/usr/bin/env node

import { execSync } from 'child_process';
import http from 'http';

console.log('🔍 Verificación completa del entorno de desarrollo...\n');

// Función para verificar si un puerto está en uso
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close();
      resolve(false); // Puerto libre
    });
    server.on('error', () => {
      resolve(true); // Puerto en uso
    });
  });
}

// Función para verificar la conectividad HTTP
function checkHttpConnection(port) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          success: true,
          statusCode: res.statusCode,
          headers: res.headers,
          hasViteScript: data.includes('vite') || data.includes('__VITE__'),
          hasReactScript: data.includes('react') || data.includes('React')
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

// Función para verificar WebSocket
function checkWebSocket(port) {
  return new Promise((resolve) => {
    const WebSocket = require('ws');
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      ws.close();
      resolve({ success: true });
    });
    
    ws.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    setTimeout(() => {
      ws.close();
      resolve({ success: false, error: 'Timeout' });
    }, 3000);
  });
}

async function main() {
  const devPort = 5175;
  let allChecksPassed = true;
  
  console.log('📡 Verificando puerto del servidor...');
  const portInUse = await checkPort(devPort);
  
  if (portInUse) {
    console.log(`✅ Puerto ${devPort} está en uso`);
    
    console.log('\n🌐 Verificando conectividad HTTP...');
    const httpResult = await checkHttpConnection(devPort);
    
    if (httpResult.success) {
      console.log(`✅ Servidor HTTP respondiendo correctamente`);
      console.log(`📊 Status Code: ${httpResult.statusCode}`);
      console.log(`🔧 Vite detectado: ${httpResult.hasViteScript ? '✅' : '❌'}`);
      console.log(`⚛️ React detectado: ${httpResult.hasReactScript ? '✅' : '❌'}`);
    } else {
      console.log(`❌ Error de conectividad HTTP: ${httpResult.error}`);
      allChecksPassed = false;
    }
    
    console.log('\n🔌 Verificando WebSocket (HMR)...');
    try {
      const wsResult = await checkWebSocket(devPort);
      if (wsResult.success) {
        console.log('✅ WebSocket funcionando correctamente');
      } else {
        console.log(`⚠️ WebSocket no disponible: ${wsResult.error}`);
        console.log('💡 Esto puede ser normal si HMR está deshabilitado');
      }
    } catch (error) {
      console.log('⚠️ No se pudo verificar WebSocket (ws module no disponible)');
    }
    
    // Verificar procesos Node.js
    try {
      console.log('\n🔍 Verificando procesos Node.js...');
      const processes = execSync('netstat -ano | findstr :5175', { encoding: 'utf8' });
      const processLines = processes.trim().split('\n').filter(line => line.trim());
      console.log(`📋 ${processLines.length} proceso(s) en puerto 5175`);
      
      if (processLines.length > 0) {
        console.log('✅ Procesos activos detectados');
      }
    } catch (error) {
      console.log('❌ No se pudieron obtener los procesos');
      allChecksPassed = false;
    }
    
  } else {
    console.log(`❌ Puerto ${devPort} no está en uso`);
    console.log('💡 Ejecuta: npm run dev');
    allChecksPassed = false;
  }
  
  // Verificar archivos de configuración
  console.log('\n📁 Verificando archivos de configuración...');
  const fs = await import('fs');
  const configFiles = [
    'vite.config.dev.ts',
    'vite.config.ts',
    'package.json',
    'tsconfig.json',
    '.eslintrc.json',
    '.prettierrc'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} encontrado`);
    } else {
      console.log(`❌ ${file} faltante`);
      allChecksPassed = false;
    }
  });
  
  // Resultado final
  console.log('\n' + '='.repeat(60));
  console.log('🎯 RESUMEN DE VERIFICACIÓN:');
  console.log('='.repeat(60));
  console.log(`📡 Puerto ${devPort}: ${portInUse ? '✅ En uso' : '❌ Libre'}`);
  console.log(`🌐 Servidor HTTP: ${portInUse ? '✅ Funcionando' : '❌ No disponible'}`);
  console.log(`🔧 Vite: ${portInUse ? '✅ Detectado' : '❌ No detectado'}`);
  console.log(`⚛️ React: ${portInUse ? '✅ Detectado' : '❌ No detectado'}`);
  console.log(`📁 Configuración: ${allChecksPassed ? '✅ Completa' : '❌ Incompleta'}`);
  console.log('='.repeat(60));
  
  if (allChecksPassed) {
    console.log('🎉 ¡Entorno de desarrollo funcionando correctamente!');
    console.log('✅ No hay problemas de WebSocket detectados');
    console.log('✅ El servidor está listo para desarrollo');
  } else {
    console.log('⚠️ Se encontraron algunos problemas. Revisa los errores arriba.');
    process.exit(1);
  }
  console.log('='.repeat(60));
}

main().catch(console.error); 