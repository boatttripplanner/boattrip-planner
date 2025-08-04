#!/usr/bin/env node
// scripts/run-blog-automation.js
// 🚀 SCRIPT DE LÍNEA DE COMANDOS PARA AUTOMATIZACIÓN DE BLOG
// Uso: node scripts/run-blog-automation.js [preset] [opciones]

const { runBlogAutomation, PRESET_CONFIGS } = require('./blogAutomationRunner.ts');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
  log('🚀 AUTOMATIZACIÓN DE BLOG NÁUTICO', 'bright');
  log('=====================================', 'cyan');
  log('');
  log('Uso:', 'yellow');
  log('  node scripts/run-blog-automation.js [preset] [opciones]', 'white');
  log('');
  log('Presets disponibles:', 'yellow');
  Object.keys(PRESET_CONFIGS).forEach(preset => {
    const config = PRESET_CONFIGS[preset];
    log(`  ${preset.padEnd(15)} - ${config.topics.length} artículos`, 'green');
  });
  log('');
  log('Opciones:', 'yellow');
  log('  --help, -h          Mostrar esta ayuda', 'white');
  log('  --dry-run           Simular sin generar contenido', 'white');
  log('  --output-dir <dir>  Directorio de salida personalizado', 'white');
  log('  --batch-size <n>    Tamaño del lote (default: 5)', 'white');
  log('  --delay <ms>        Delay entre requests (default: 3000ms)', 'white');
  log('');
  log('Ejemplos:', 'yellow');
  log('  node scripts/run-blog-automation.js destinations', 'white');
  log('  node scripts/run-blog-automation.js equipment --dry-run', 'white');
  log('  node scripts/run-blog-automation.js techniques --output-dir ./my-content', 'white');
  log('');
}

function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    preset: null,
    dryRun: false,
    outputDir: null,
    batchSize: 5,
    delay: 3000
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--output-dir' && i + 1 < args.length) {
      options.outputDir = args[++i];
    } else if (arg === '--batch-size' && i + 1 < args.length) {
      options.batchSize = parseInt(args[++i]);
    } else if (arg === '--delay' && i + 1 < args.length) {
      options.delay = parseInt(args[++i]);
    } else if (!options.preset) {
      options.preset = arg;
    }
  }

  return options;
}

function validateOptions(options) {
  if (!options.preset) {
    log('❌ Error: Debes especificar un preset', 'red');
    log('Usa --help para ver las opciones disponibles', 'yellow');
    process.exit(1);
  }

  if (!PRESET_CONFIGS[options.preset]) {
    log(`❌ Error: Preset "${options.preset}" no válido`, 'red');
    log('Presets disponibles:', 'yellow');
    Object.keys(PRESET_CONFIGS).forEach(preset => {
      log(`  - ${preset}`, 'green');
    });
    process.exit(1);
  }

  if (options.batchSize < 1 || options.batchSize > 10) {
    log('❌ Error: batch-size debe estar entre 1 y 10', 'red');
    process.exit(1);
  }

  if (options.delay < 1000 || options.delay > 10000) {
    log('❌ Error: delay debe estar entre 1000ms y 10000ms', 'red');
    process.exit(1);
  }

  return true;
}

function showConfiguration(options) {
  const preset = PRESET_CONFIGS[options.preset];
  
  log('⚙️ CONFIGURACIÓN:', 'bright');
  log('================', 'cyan');
  log(`Preset: ${options.preset}`, 'green');
  log(`Artículos: ${preset.topics.length}`, 'green');
  log(`Categorías: ${preset.config.categories.join(', ')}`, 'green');
  log(`Tipos de contenido: ${preset.config.contentTypes.join(', ')}`, 'green');
  log(`Imágenes: ${preset.config.generateImages ? 'Sí' : 'No'}`, 'green');
  log(`Productos: ${preset.config.generateProducts ? 'Sí' : 'No'}`, 'green');
  log(`Tamaño de lote: ${options.batchSize}`, 'green');
  log(`Delay: ${options.delay}ms`, 'green');
  log(`Modo dry-run: ${options.dryRun ? 'Sí' : 'No'}`, 'green');
  
  if (options.outputDir) {
    log(`Directorio de salida: ${options.outputDir}`, 'green');
  }
  
  log('');
}

async function main() {
  try {
    log('🚀 INICIANDO AUTOMATIZACIÓN DE BLOG', 'bright');
    log('====================================', 'cyan');
    log('');

    const options = parseArguments();
    
    if (!validateOptions(options)) {
      return;
    }

    showConfiguration(options);

    if (options.dryRun) {
      log('🔍 MODO DRY-RUN: No se generará contenido real', 'yellow');
      log('Presiona Ctrl+C para cancelar o Enter para continuar...', 'yellow');
      
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });
    }

    log('🚀 Iniciando generación...', 'green');
    log('');

    const startTime = Date.now();
    
    await runBlogAutomation(options.preset);
    
    const totalTime = Date.now() - startTime;
    
    log('');
    log('✅ AUTOMATIZACIÓN COMPLETADA', 'bright');
    log('============================', 'cyan');
    log(`Tiempo total: ${Math.round(totalTime / 1000)}s`, 'green');
    log(`Contenido generado en: ${options.outputDir || './generated-blog-content'}`, 'green');
    
    if (!options.dryRun) {
      log('');
      log('📝 Próximos pasos:', 'yellow');
      log('1. Revisa el contenido generado', 'white');
      log('2. Edita y personaliza según necesites', 'white');
      log('3. Integra con tu sistema de blog', 'white');
      log('4. Publica y monitorea el rendimiento', 'white');
    }

  } catch (error) {
    log('❌ ERROR EN LA EJECUCIÓN', 'red');
    log('=======================', 'red');
    log(error.message, 'red');
    
    if (error.stack) {
      log('');
      log('Stack trace:', 'yellow');
      log(error.stack, 'red');
    }
    
    process.exit(1);
  }
}

// Manejar señales de interrupción
process.on('SIGINT', () => {
  log('');
  log('⚠️ Interrumpido por el usuario', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('');
  log('⚠️ Proceso terminado', 'yellow');
  process.exit(0);
});

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = { main, parseArguments, validateOptions }; 