const fs = require('fs');
const path = require('path');

// Función para limpiar conflictos de Git en un archivo
function cleanGitConflicts(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Eliminar todos los marcadores de conflicto de Git
    content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+\n/g, (match, headContent, otherContent) => {
      // Mantener el contenido de HEAD (primera opción)
      return headContent;
    });
    
    // Eliminar marcadores sueltos
    content = content.replace(/<<<<<<< HEAD\n/g, '');
    content = content.replace(/=======\n/g, '');
    content = content.replace(/>>>>>>> [a-f0-9]+\n/g, '');
    
    // Si el contenido cambió, escribir el archivo
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para procesar directorios recursivamente
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let cleanedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      cleanedCount += processDirectory(fullPath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))) {
      if (cleanGitConflicts(fullPath)) {
        cleanedCount++;
      }
    }
  }
  
  return cleanedCount;
}

// Función principal
function main() {
  console.log('🧹 Limpiando conflictos de Git...\n');
  
  const currentDir = process.cwd();
  const cleanedCount = processDirectory(currentDir);
  
  console.log(`\n🎉 ¡Completado! Se limpiaron ${cleanedCount} archivos con conflictos de Git.`);
  
  if (cleanedCount > 0) {
    console.log('\n💡 Ahora puedes ejecutar "npm run dev" para probar la aplicación.');
  } else {
    console.log('\n✨ No se encontraron conflictos de Git para limpiar.');
  }
}

// Ejecutar el script
main();
