#!/usr/bin/env node
// scripts/generate-destination-post.js
// 🚀 SCRIPT PARA GENERAR ENTRADA DE DESTINOS
// Genera contenido específico para destinos náuticos

import { generateBlogContent } from '../services/blogAutomationService.ts';

// Configuración para entrada de destinos
const destinationRequest = {
  topic: 'Navegar por las Islas Columbretes: Paraíso Secreto del Mediterráneo',
  category: 'destinos',
  targetAudience: 'intermedios',
  contentType: 'destino',
  targetLength: 'media',
  includeProducts: true,
  includeImages: true,
  seoKeywords: [
    'islas columbretes',
    'navegación mediterráneo',
    'reserva marina',
    'calas vírgenes',
    'velero columbretes',
    'fondeo columbretes',
    'navegación valencia',
    'destinos náuticos españa'
  ],
  affiliateFocus: ['equipamiento de viaje', 'accesorios náuticos', 'seguridad marítima']
};

async function generateDestinationPost() {
  console.log('🚀 Generando entrada de blog para destinos...');
  console.log('📍 Destino: Islas Columbretes');
  console.log('📝 Categoría: Destinos Náuticos');
  console.log('🎯 Audiencia: Navegantes intermedios');
  console.log('');

  try {
    console.log('⏳ Iniciando generación de contenido...');
    
    const startTime = Date.now();
    const content = await generateBlogContent(destinationRequest);
    const generationTime = Date.now() - startTime;

    console.log('✅ Contenido generado exitosamente!');
    console.log(`⏱️ Tiempo de generación: ${generationTime}ms`);
    console.log('');

    // Mostrar resumen del contenido generado
    console.log('📊 RESUMEN DEL CONTENIDO GENERADO:');
    console.log('=====================================');
    console.log(`📝 Título: ${content.title}`);
    console.log(`🔗 Slug: ${content.slug}`);
    console.log(`📅 Fecha: ${content.publishDate}`);
    console.log(`⏱️ Tiempo de lectura: ${content.readingTime} minutos`);
    console.log(`🖼️ Imágenes: ${content.images.length}`);
    console.log(`🛒 Productos: ${content.products.length}`);
    console.log(`🏷️ Tags: ${content.tags.join(', ')}`);
    console.log('');

    // Mostrar extracto
    console.log('📖 EXTRACTO:');
    console.log('============');
    console.log(content.excerpt);
    console.log('');

    // Mostrar SEO data
    console.log('🔍 DATOS SEO:');
    console.log('=============');
    console.log(`Título SEO: ${content.seoData.title}`);
    console.log(`Descripción: ${content.seoData.description}`);
    console.log(`Keywords: ${content.seoData.keywords.join(', ')}`);
    console.log(`URL Canónica: ${content.seoData.canonicalUrl}`);
    console.log('');

    // Mostrar productos recomendados
    if (content.products.length > 0) {
      console.log('🛒 PRODUCTOS RECOMENDADOS:');
      console.log('==========================');
      content.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   💰 Precio: ${product.price}`);
        console.log(`   ⭐ Valoración: ${product.rating}/5 (${product.reviewCount} reviews)`);
        console.log(`   📝 Descripción: ${product.description.substring(0, 100)}...`);
        console.log('');
      });
    }

    // Guardar contenido en archivo
    import fs from 'fs';
    import path from 'path';
    
    const outputDir = './generated-content';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${content.slug}.json`;
    const filepath = path.join(outputDir, filename);
    
    const contentToSave = {
      ...content,
      generatedAt: new Date().toISOString(),
      generationTime: generationTime,
      request: destinationRequest
    };

    fs.writeFileSync(filepath, JSON.stringify(contentToSave, null, 2), 'utf8');
    console.log(`💾 Contenido guardado en: ${filepath}`);

    // Generar archivo Markdown
    const markdownContent = generateMarkdownContent(content);
    const markdownFilepath = path.join(outputDir, `${content.slug}.md`);
    fs.writeFileSync(markdownFilepath, markdownContent, 'utf8');
    console.log(`📄 Markdown guardado en: ${markdownFilepath}`);

    console.log('');
    console.log('🎉 ¡Entrada de blog generada exitosamente!');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Revisar el contenido generado');
    console.log('2. Editar y personalizar según necesites');
    console.log('3. Integrar con tu sistema de blog');
    console.log('4. Publicar y monitorea el rendimiento');

    return content;

  } catch (error) {
    console.error('❌ Error generando contenido:', error);
    throw error;
  }
}

function generateMarkdownContent(content) {
  let markdown = `# ${content.title}\n\n`;
  
  // Metadatos
  markdown += `**Fecha:** ${content.publishDate} | **Tiempo de lectura:** ${content.readingTime} min | **Categoría:** ${content.category}\n\n`;
  
  // Extracto
  markdown += `> ${content.excerpt}\n\n`;
  
  // Tags
  markdown += `**Tags:** ${content.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
  
  // Contenido principal
  markdown += content.content;
  
  // Productos recomendados
  if (content.products.length > 0) {
    markdown += '\n\n## 🛒 Productos Recomendados\n\n';
    content.products.forEach(product => {
      markdown += `### ${product.title}\n\n`;
      markdown += `**Precio:** ${product.price} | **Valoración:** ${'★'.repeat(Math.floor(product.rating))} (${product.rating}/5)\n\n`;
      markdown += `${product.description}\n\n`;
      markdown += `**✅ Ventajas:**\n`;
      product.pros.forEach(pro => markdown += `- ${pro}\n`);
      markdown += `\n**⚠️ Consideraciones:**\n`;
      product.cons.forEach(con => markdown += `- ${con}\n`);
      markdown += `\n[Ver en Amazon - ${product.price}](${product.affiliateUrl})\n\n`;
    });
  }
  
  // Datos SEO
  markdown += '\n---\n\n';
  markdown += '**SEO Data:**\n';
  markdown += `- Título: ${content.seoData.title}\n`;
  markdown += `- Descripción: ${content.seoData.description}\n`;
  markdown += `- Keywords: ${content.seoData.keywords.join(', ')}\n`;
  markdown += `- URL: ${content.seoData.canonicalUrl}\n\n`;
  
  markdown += '*Generado automáticamente por BoatTrip Planner Blog Automation System*';
  
  return markdown;
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDestinationPost()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { generateDestinationPost, generateMarkdownContent }; 