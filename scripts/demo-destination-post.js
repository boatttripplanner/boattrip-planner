#!/usr/bin/env node
// scripts/demo-destination-post.js
// 🚀 DEMOSTRACIÓN: Generación de Entrada de Destinos
// Versión de demostración sin APIs externas

import fs from 'fs';
import path from 'path';

// Contenido de ejemplo generado automáticamente
const generatedContent = {
  title: 'Navegar por las Islas Columbretes: Paraíso Secreto del Mediterráneo',
  slug: 'navegar-islas-columbretes-paraiso-secreto-mediterraneo',
  excerpt: 'Descubre las Islas Columbretes, un archipiélago volcánico virgen a solo 30 millas de la costa de Castellón. Con aguas cristalinas, fondos marinos espectaculares y una biodiversidad única, este destino náutico te ofrece una experiencia de navegación inolvidable en el Mediterráneo español.',
  content: `# Navegar por las Islas Columbretes: Paraíso Secreto del Mediterráneo

![Navegación en las Islas Columbretes](https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&h=600&fit=crop&crop=center)

*Foto por Carlos López en Unsplash*

Las Islas Columbretes son uno de los secretos mejor guardados del Mediterráneo español. Este archipiélago volcánico, declarado Reserva Marina y Parque Natural, ofrece a los navegantes una experiencia única de navegación en un entorno prácticamente virgen.

## 🗺️ Descripción del Archipiélago

### Las Cuatro Islas Principales

**Isla Grossa (La Grande):**
- La más grande del archipiélago
- Única isla habitada (guardas del parque)
- Puerto natural protegido
- Faro histórico del siglo XIX

**Ferrera:**
- Formación rocosa impresionante
- Aguas profundas ideales para fondeo
- Paredes verticales para buceo

**Foradada:**
- Arco natural característico
- Fondeo protegido en su interior
- Vistas espectaculares al atardecer

**Carallot:**
- Islote más pequeño
- Aguas cristalinas perfectas para snorkel
- Zona de pesca tradicional

## 🚢 Cómo Llegar a las Columbretes

### Desde Valencia
- **Distancia:** 30 millas náuticas
- **Tiempo estimado:** 4-5 horas a vela
- **Ruta recomendada:** Salida desde puerto de Valencia o Gandía
- **Mejor época:** Mayo a Octubre

### Desde Castellón
- **Distancia:** 25 millas náuticas
- **Tiempo estimado:** 3-4 horas a vela
- **Ruta recomendada:** Salida desde puerto de Castellón
- **Ventajas:** Ruta más directa y protegida

## 🛒 Equipamiento Esencial para Columbretes

### GPS Náutico Garmin ECHOMAP UHD 94sv

**Precio:** €1,299 | **Valoración:** ★★★★★ (4.9/5)

**Características:**
- Pantalla de 9 pulgadas Ultra HD
- Cartas náuticas detalladas de Columbretes
- Sonar CHIRP tradicional y ClearVü
- Conectividad WiFi y Bluetooth

**✅ Ventajas**
- Cartografía excepcional de la zona
- Interfaz intuitiva y fácil de usar
- Sonar de alta definición para fondos rocosos
- Actualizaciones gratuitas de cartas

**⚠️ Consideraciones**
- Precio elevado pero justificado para navegación profesional
- Requiere instalación profesional
- Curva de aprendizaje inicial

[Ver en Amazon - €1,299](https://www.amazon.es/dp/B08F7PTF54?tag=explorashop18-21)

---

### Chaleco Salvavidas Náutico 150N

**Precio:** €89 | **Valoración:** ★★★★☆ (4.5/5)

**Características:**
- Flotabilidad 150N homologada CE
- Inflado automático con sensor de agua
- Color naranja de alta visibilidad
- Ajuste cómodo para adultos

**✅ Ventajas**
- Seguridad certificada para navegación en aguas abiertas
- Inflado automático confiable
- Ajuste cómodo y seguro
- Precio competitivo

**⚠️ Consideraciones**
- Talla única (ajustable)
- Requiere recarga anual
- Color limitado

[Ver en Amazon - €89](https://www.amazon.es/dp/B07XYZ1234?tag=explorashop18-21)

---

## 🏖️ Mejores Fondeos y Calas

### Puerto de la Isla Grossa

**Características:**
- Puerto natural protegido
- Fondeo en arena y roca
- Profundidad: 3-8 metros
- Protección: Excelente de todos los vientos

**Actividades:**
- Visita al faro histórico
- Senderismo por la isla
- Snorkel en aguas cristalinas
- Observación de aves marinas

### Cala del Foradada

**Características:**
- Fondeo protegido dentro del arco
- Aguas transparentes
- Profundidad: 5-12 metros
- Protección: Buena del norte y oeste

**Actividades:**
- Buceo en paredes verticales
- Fotografía del arco natural
- Puesta de sol espectacular
- Pesca deportiva

## 🐠 Biodiversidad Marina

### Especies Características

**Peces:**
- Meros y corvinas
- Lubinas y doradas
- Peces luna ocasionales
- Escuelas de jureles

**Invertebrados:**
- Langostas y bogavantes
- Pulpos y sepias
- Erizos de mar
- Anémonas y corales

**Aves Marinas:**
- Gaviotas de Audouin
- Cormoranes moñudos
- Pardelas cenicientas
- Paíños europeos

## 🌤️ Meteorología y Condiciones

### Vientos Predominantes

**Tramontana (Norte):**
- Frecuencia: 30% del tiempo
- Intensidad: 15-25 nudos
- Mejor fondeo: Puerto de la Isla Grossa

**Llevant (Este):**
- Frecuencia: 25% del tiempo
- Intensidad: 10-20 nudos
- Mejor fondeo: Cala del Foradada

**Garbí (SO):**
- Frecuencia: 20% del tiempo
- Intensidad: 8-15 nudos
- Mejor fondeo: Zona de Ferrera

## 🏆 Conclusión

Navegar por las Islas Columbretes es una experiencia única que combina la belleza natural del Mediterráneo con la aventura de la navegación en aguas abiertas. Este archipiélago virgen te ofrece fondos marinos espectaculares, calas paradisíacas y una biodiversidad única.

**Recuerda:** Las Columbretes son un espacio protegido, por lo que es fundamental respetar las normativas y contribuir a la conservación de este paraíso natural.

---

*¿Te ha gustado esta guía? Compártela con otros navegantes y ayúdanos a crear una comunidad náutica más informada.*`,
  images: [
    {
      url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&h=600&fit=crop&crop=center',
      alt: 'Velero navegando por las Islas Columbretes',
      caption: 'Foto por Carlos López en Unsplash',
      width: 1200,
      height: 600,
      position: 'header',
      unsplashId: 'abc123',
      photographer: 'Carlos López'
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-8647a1e1e4f8?w=800&h=400&fit=crop&crop=center',
      alt: 'Cala turquesa en las Columbretes',
      caption: 'Foto por Maria García en Unsplash',
      width: 800,
      height: 400,
      position: 'inline',
      unsplashId: 'def456',
      photographer: 'Maria García'
    }
  ],
  products: [
    {
      asin: 'B08F7PTF54',
      title: 'GPS Náutico Garmin ECHOMAP UHD 94sv',
      price: '€1,299',
      rating: 4.9,
      reviewCount: 156,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
      affiliateUrl: 'https://www.amazon.es/dp/B08F7PTF54?tag=explorashop18-21',
      category: 'navegacion',
      description: 'GPS náutico premium con pantalla Ultra HD y sonar CHIRP avanzado',
      pros: ['Cartografía excepcional', 'Interfaz intuitiva', 'Sonar de alta definición'],
      cons: ['Precio elevado', 'Requiere instalación profesional'],
      position: 'inline'
    },
    {
      asin: 'B07XYZ1234',
      title: 'Chaleco Salvavidas Náutico 150N',
      price: '€89',
      rating: 4.5,
      reviewCount: 89,
      imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop&crop=center',
      affiliateUrl: 'https://www.amazon.es/dp/B07XYZ1234?tag=explorashop18-21',
      category: 'seguridad',
      description: 'Chaleco salvavidas homologado con inflado automático y alta visibilidad',
      pros: ['Seguridad certificada', 'Inflado automático', 'Ajuste cómodo'],
      cons: ['Talla única', 'Requiere recarga anual'],
      position: 'inline'
    }
  ],
  seoData: {
    title: 'Navegar por las Islas Columbretes: Paraíso Secreto del Mediterráneo - Guía Completa de Navegación',
    description: 'Descubre las Islas Columbretes, un archipiélago volcánico virgen a solo 30 millas de la costa de Castellón. Con aguas cristalinas, fondos marinos espectaculares y una biodiversidad única.',
    keywords: ['islas columbretes', 'navegación mediterráneo', 'reserva marina', 'calas vírgenes', 'velero columbretes', 'fondeo columbretes', 'navegación valencia', 'destinos náuticos españa'],
    ogImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&h=600&fit=crop&crop=center',
    canonicalUrl: 'https://boattrip-planner.com/blog/navegar-islas-columbretes-paraiso-secreto-mediterraneo',
    structuredData: {}
  },
  readingTime: 10,
  publishDate: '2024-01-25',
  tags: ['destinos', 'islas columbretes', 'navegación', 'mediterráneo', 'reserva marina'],
  category: 'destinos'
};

async function generateDemoDestinationPost() {
  console.log('🚀 DEMOSTRACIÓN: Generando entrada de blog para destinos...');
  console.log('📍 Destino: Islas Columbretes');
  console.log('📝 Categoría: Destinos Náuticos');
  console.log('🎯 Audiencia: Navegantes intermedios');
  console.log('🤖 Modo: Demostración (sin APIs externas)');
  console.log('');

  try {
    console.log('⏳ Simulando generación de contenido...');
    
    // Simular tiempo de generación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Contenido generado exitosamente!');
    console.log('');

    // Mostrar resumen del contenido generado
    console.log('📊 RESUMEN DEL CONTENIDO GENERADO:');
    console.log('=====================================');
    console.log(`📝 Título: ${generatedContent.title}`);
    console.log(`🔗 Slug: ${generatedContent.slug}`);
    console.log(`📅 Fecha: ${generatedContent.publishDate}`);
    console.log(`⏱️ Tiempo de lectura: ${generatedContent.readingTime} minutos`);
    console.log(`🖼️ Imágenes: ${generatedContent.images.length}`);
    console.log(`🛒 Productos: ${generatedContent.products.length}`);
    console.log(`🏷️ Tags: ${generatedContent.tags.join(', ')}`);
    console.log('');

    // Mostrar extracto
    console.log('📖 EXTRACTO:');
    console.log('============');
    console.log(generatedContent.excerpt);
    console.log('');

    // Mostrar SEO data
    console.log('🔍 DATOS SEO:');
    console.log('=============');
    console.log(`Título SEO: ${generatedContent.seoData.title}`);
    console.log(`Descripción: ${generatedContent.seoData.description}`);
    console.log(`Keywords: ${generatedContent.seoData.keywords.join(', ')}`);
    console.log(`URL Canónica: ${generatedContent.seoData.canonicalUrl}`);
    console.log('');

    // Mostrar productos recomendados
    if (generatedContent.products.length > 0) {
      console.log('🛒 PRODUCTOS RECOMENDADOS:');
      console.log('==========================');
      generatedContent.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   💰 Precio: ${product.price}`);
        console.log(`   ⭐ Valoración: ${product.rating}/5 (${product.reviewCount} reviews)`);
        console.log(`   📝 Descripción: ${product.description.substring(0, 100)}...`);
        console.log('');
      });
    }

    // Guardar contenido en archivo
    const outputDir = './generated-content';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${generatedContent.slug}.json`;
    const filepath = path.join(outputDir, filename);
    
    const contentToSave = {
      ...generatedContent,
      generatedAt: new Date().toISOString(),
      generationTime: 2000,
      demo: true,
      note: 'Contenido de demostración generado automáticamente'
    };

    fs.writeFileSync(filepath, JSON.stringify(contentToSave, null, 2), 'utf8');
    console.log(`💾 Contenido guardado en: ${filepath}`);

    // Generar archivo Markdown
    const markdownContent = generateMarkdownContent(generatedContent);
    const markdownFilepath = path.join(outputDir, `${generatedContent.slug}.md`);
    fs.writeFileSync(markdownFilepath, markdownContent, 'utf8');
    console.log(`📄 Markdown guardado en: ${markdownFilepath}`);

    console.log('');
    console.log('🎉 ¡Entrada de blog generada exitosamente!');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Revisar el contenido generado en ./generated-content/');
    console.log('2. Editar y personalizar según necesites');
    console.log('3. Integrar con tu sistema de blog');
    console.log('4. Publicar y monitorea el rendimiento');
    console.log('');
    console.log('🔧 Para usar el sistema completo con APIs:');
    console.log('- Configura las variables de entorno (Gemini, Unsplash, Amazon)');
    console.log('- Ejecuta: node scripts/generate-destination-post.js');

    return generatedContent;

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
  
  markdown += '*Generado automáticamente por BoatTrip Planner Blog Automation System (Demo)*';
  
  return markdown;
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDemoDestinationPost()
    .then(() => {
      console.log('✅ Script de demostración completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { generateDemoDestinationPost, generateMarkdownContent }; 