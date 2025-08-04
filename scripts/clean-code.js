#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando y verificando el código...\n');

// Función para ejecutar comandos de forma segura
function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`);
    return true;
  } catch (error) {
    console.log(`❌ Error en ${description}: ${error.message}\n`);
    return false;
  }
}

// Función para verificar si un archivo existe
function fileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

// Verificar dependencias de desarrollo
const devDependencies = [
  'eslint',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'prettier'
];

console.log('🔍 Verificando dependencias de desarrollo...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const missingDeps = devDependencies.filter(dep => !packageJson.devDependencies?.[dep]);

if (missingDeps.length > 0) {
  console.log(`⚠️ Dependencias faltantes: ${missingDeps.join(', ')}`);
  console.log('💡 Ejecuta: npm install --save-dev ' + missingDeps.join(' '));
} else {
  console.log('✅ Todas las dependencias están instaladas\n');
}

// Ejecutar verificaciones
const checks = [
  {
    command: 'npx tsc --noEmit',
    description: 'Verificación de tipos TypeScript'
  },
  {
    command: 'npx eslint . --ext .ts,.tsx --fix',
    description: 'Linting y corrección automática'
  },
  {
    command: 'npx prettier --write .',
    description: 'Formateo de código con Prettier'
  }
];

let allPassed = true;

checks.forEach(check => {
  if (!runCommand(check.command, check.description)) {
    allPassed = false;
  }
});

// Verificar archivos de configuración
const configFiles = [
  '.eslintrc.json',
  '.prettierrc',
  'tsconfig.json',
  'vite.config.ts'
];

console.log('📁 Verificando archivos de configuración...');
configFiles.forEach(file => {
  if (fileExists(file)) {
    console.log(`✅ ${file} encontrado`);
  } else {
    console.log(`❌ ${file} faltante`);
    allPassed = false;
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 ¡Todo el código está limpio y sin errores!');
  console.log('✅ Build listo para producción');
} else {
  console.log('⚠️ Se encontraron algunos problemas. Revisa los errores arriba.');
  process.exit(1);
}
console.log('='.repeat(50)); 