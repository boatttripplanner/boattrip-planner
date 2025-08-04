#!/usr/bin/env node

import { execSync } from 'child_process';
import http from 'http';

console.log('🔍 Verificando el servidor de desarrollo...\n');

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
      resolve({
        success: true,
        statusCode: res.statusCode,
        headers: res.headers
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

async function main() {
  const devPort = 5175;
  
  console.log(`📡 Verificando puerto ${devPort}...`);
  const portInUse = await checkPort(devPort);
  
  if (portInUse) {
    console.log(`✅ Puerto ${devPort} está en uso`);
    
    console.log(`🌐 Verificando conectividad HTTP...`);
    const httpResult = await checkHttpConnection(devPort);
    
    if (httpResult.success) {
      console.log(`✅ Servidor HTTP respondiendo correctamente`);
      console.log(`📊 Status Code: ${httpResult.statusCode}`);
      console.log(`🔗 Headers: ${JSON.stringify(httpResult.headers, null, 2)}`);
    } else {
      console.log(`❌ Error de conectividad HTTP: ${httpResult.error}`);
    }
    
    // Verificar procesos Node.js
    try {
      console.log(`\n🔍 Verificando procesos Node.js...`);
             const processes = execSync('netstat -ano | findstr :5175', { encoding: 'utf8' });
       console.log('📋 Procesos en puerto 5175:');
      console.log(processes);
    } catch (error) {
      console.log('❌ No se pudieron obtener los procesos');
    }
    
  } else {
    console.log(`❌ Puerto ${devPort} no está en uso`);
    console.log('💡 Ejecuta: npm run dev');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Resumen de diagnóstico:');
  console.log(`- Puerto ${devPort}: ${portInUse ? '✅ En uso' : '❌ Libre'}`);
  console.log(`- Servidor HTTP: ${portInUse ? '✅ Funcionando' : '❌ No disponible'}`);
  console.log('='.repeat(50));
}

main().catch(console.error); 