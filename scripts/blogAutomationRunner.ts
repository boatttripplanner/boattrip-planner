// scripts/blogAutomationRunner.ts
// 🚀 SCRIPT DE EJECUCIÓN DE AUTOMATIZACIÓN DE BLOG
// Permite generar contenido en lote y integrarlo con el sistema existente

import { generateBlogContent, generateMultipleBlogPosts, BlogContentRequest } from '../services/blogAutomationService';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface BlogGenerationConfig {
  outputDir: string;
  generateImages: boolean;
  generateProducts: boolean;
  batchSize: number;
  delayBetweenRequests: number;
  categories: string[];
  contentTypes: string[];
}

interface BlogGenerationResult {
  success: boolean;
  content?: any;
  error?: string;
  timestamp: string;
  duration: number;
}

class BlogAutomationRunner {
  private config: BlogGenerationConfig;
  private results: BlogGenerationResult[] = [];

  constructor(config: Partial<BlogGenerationConfig> = {}) {
    this.config = {
      outputDir: './generated-blog-content',
      generateImages: true,
      generateProducts: true,
      batchSize: 5,
      delayBetweenRequests: 3000,
      categories: ['destinos', 'equipamiento', 'técnicas', 'reviews'],
      contentTypes: ['guia', 'review', 'destino'],
      ...config
    };

    this.ensureOutputDirectory();
  }

  /**
   * Asegura que el directorio de salida existe
   */
  private ensureOutputDirectory(): void {
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
      console.log(`📁 Creado directorio: ${this.config.outputDir}`);
    }
  }

  /**
   * Genera contenido de blog en lote
   */
  async generateBatchContent(topics: string[]): Promise<void> {
    console.log(`🚀 Iniciando generación de ${topics.length} artículos...`);
    
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < topics.length; i += this.config.batchSize) {
      const batch = topics.slice(i, i + this.config.batchSize);
      console.log(`\n📦 Procesando lote ${Math.floor(i / this.config.batchSize) + 1}/${Math.ceil(topics.length / this.config.batchSize)}`);
      
      const batchPromises = batch.map(async (topic, index) => {
        const request = this.createBlogRequest(topic);
        const result = await this.generateSingleContent(request, i + index + 1, topics.length);
        
        if (result.success) {
          successCount++;
          await this.saveContent(result.content!, topic);
        } else {
          errorCount++;
          console.error(`❌ Error en "${topic}": ${result.error}`);
        }
        
        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      this.results.push(...batchResults);

      // Pausa entre lotes
      if (i + this.config.batchSize < topics.length) {
        console.log(`⏳ Pausa de ${this.config.delayBetweenRequests / 1000}s entre lotes...`);
        await this.delay(this.config.delayBetweenRequests);
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n✅ Generación completada en ${Math.round(totalTime / 1000)}s`);
    console.log(`📊 Resultados: ${successCount} exitosos, ${errorCount} errores`);
    
    await this.generateReport();
  }

  /**
   * Genera un solo artículo
   */
  private async generateSingleContent(
    request: BlogContentRequest, 
    current: number, 
    total: number
  ): Promise<BlogGenerationResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    try {
      console.log(`📝 [${current}/${total}] Generando: ${request.topic}`);
      
      const content = await generateBlogContent(request);
      
      const duration = Date.now() - startTime;
      console.log(`✅ [${current}/${total}] Completado en ${duration}ms`);
      
      return {
        success: true,
        content,
        timestamp,
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp,
        duration
      };
    }
  }

  /**
   * Crea una solicitud de blog basada en el tema
   */
  private createBlogRequest(topic: string): BlogContentRequest {
    // Determinar categoría basada en palabras clave del tema
    const category = this.detectCategory(topic);
    const contentType = this.detectContentType(topic);
    
    return {
      topic,
      category,
      targetAudience: 'intermedios',
      contentType,
      targetLength: 'media',
      includeProducts: this.config.generateProducts,
      includeImages: this.config.generateImages,
      seoKeywords: this.getKeywordsForTopic(topic, category),
      affiliateFocus: this.getAffiliateFocus(category)
    };
  }

  /**
   * Detecta la categoría basada en el tema
   */
  private detectCategory(topic: string): string {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('destino') || topicLower.includes('isla') || topicLower.includes('costa') || topicLower.includes('cala')) {
      return 'destinos';
    }
    if (topicLower.includes('equipamiento') || topicLower.includes('gps') || topicLower.includes('chaleco') || topicLower.includes('radio')) {
      return 'equipamiento';
    }
    if (topicLower.includes('técnica') || topicLower.includes('navegación') || topicLower.includes('vela') || topicLower.includes('amarrado')) {
      return 'técnicas';
    }
    if (topicLower.includes('review') || topicLower.includes('comparativa') || topicLower.includes('análisis')) {
      return 'reviews';
    }
    if (topicLower.includes('sostenibilidad') || topicLower.includes('ecológico') || topicLower.includes('verde')) {
      return 'sostenibilidad';
    }
    if (topicLower.includes('familia') || topicLower.includes('niños') || topicLower.includes('infantil')) {
      return 'familia';
    }
    if (topicLower.includes('aventura') || topicLower.includes('travesía') || topicLower.includes('expedición')) {
      return 'aventuras';
    }
    
    return 'destinos'; // Categoría por defecto
  }

  /**
   * Detecta el tipo de contenido basado en el tema
   */
  private detectContentType(topic: string): string {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('review') || topicLower.includes('comparativa') || topicLower.includes('análisis')) {
      return 'review';
    }
    if (topicLower.includes('destino') || topicLower.includes('isla') || topicLower.includes('costa')) {
      return 'destino';
    }
    if (topicLower.includes('tutorial') || topicLower.includes('guía') || topicLower.includes('cómo')) {
      return 'tutorial';
    }
    
    return 'guia'; // Tipo por defecto
  }

  /**
   * Obtiene palabras clave SEO para el tema
   */
  private getKeywordsForTopic(topic: string, category: string): string[] {
    const baseKeywords = {
      destinos: ['navegación', 'velero', 'mediterráneo', 'calas', 'puertos', 'marinas'],
      equipamiento: ['equipamiento náutico', 'seguridad', 'navegación', 'barco', 'marino'],
      técnicas: ['navegación', 'técnicas', 'vela', 'marino', 'patrón', 'navegante'],
      reviews: ['review', 'productos náuticos', 'comparativa', 'análisis', 'calidad'],
      sostenibilidad: ['sostenibilidad', 'ecológico', 'verde', 'medio ambiente', 'conservación'],
      familia: ['familia', 'niños', 'seguridad', 'navegación familiar', 'actividades'],
      aventuras: ['aventura', 'exploración', 'travesía', 'expedición', 'desafío']
    };

    const categoryKeywords = baseKeywords[category] || baseKeywords.destinos;
    const topicKeywords = topic.toLowerCase().split(' ').filter(word => word.length > 3);
    
    return [...new Set([...categoryKeywords, ...topicKeywords])];
  }

  /**
   * Obtiene enfoque de afiliados para la categoría
   */
  private getAffiliateFocus(category: string): string[] {
    const affiliateFocus = {
      destinos: ['equipamiento de viaje', 'accesorios náuticos'],
      equipamiento: ['equipamiento náutico', 'herramientas', 'seguridad'],
      técnicas: ['equipamiento de navegación', 'herramientas'],
      reviews: ['productos náuticos', 'equipamiento'],
      sostenibilidad: ['productos ecológicos', 'energía solar'],
      familia: ['equipamiento familiar', 'seguridad infantil'],
      aventuras: ['equipamiento de aventura', 'supervivencia']
    };

    return affiliateFocus[category] || affiliateFocus.destinos;
  }

  /**
   * Guarda el contenido generado
   */
  private async saveContent(content: any, topic: string): Promise<void> {
    const slug = this.generateSlug(topic);
    const filename = `${slug}.json`;
    const filepath = join(this.config.outputDir, filename);
    
    const contentToSave = {
      ...content,
      generatedAt: new Date().toISOString(),
      originalTopic: topic
    };
    
    writeFileSync(filepath, JSON.stringify(contentToSave, null, 2), 'utf8');
    console.log(`💾 Guardado: ${filename}`);
  }

  /**
   * Genera un reporte de la ejecución
   */
  private async generateReport(): Promise<void> {
    const reportPath = join(this.config.outputDir, 'generation-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary: {
        total: this.results.length,
        successful: this.results.filter(r => r.success).length,
        failed: this.results.filter(r => !r.success).length,
        averageDuration: Math.round(
          this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length
        )
      },
      results: this.results
    };
    
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`📊 Reporte guardado: generation-report.json`);
  }

  /**
   * Genera slug para el tema
   */
  private generateSlug(topic: string): string {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Función de delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Integra el contenido generado con el sistema de blog existente
   */
  async integrateWithExistingBlog(): Promise<void> {
    console.log('🔗 Integrando contenido con el blog existente...');
    
    const blogDataPath = join(process.cwd(), 'src', 'blogData.ts');
    if (!existsSync(blogDataPath)) {
      console.error('❌ No se encontró src/blogData.ts');
      return;
    }

    // Leer el archivo de blog existente
    const blogDataContent = readFileSync(blogDataPath, 'utf8');
    
    // Buscar archivos generados
    const generatedFiles = this.getGeneratedFiles();
    
    for (const file of generatedFiles) {
      try {
        const content = JSON.parse(readFileSync(file, 'utf8'));
        await this.addToBlogData(content, blogDataPath, blogDataContent);
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error);
      }
    }
    
    console.log('✅ Integración completada');
  }

  /**
   * Obtiene archivos generados
   */
  private getGeneratedFiles(): string[] {
    // Implementar lógica para obtener archivos .json del directorio de salida
    // Por simplicidad, retornamos un array vacío
    return [];
  }

  /**
   * Añade contenido al archivo de blog existente
   */
  private async addToBlogData(content: any, blogDataPath: string, blogDataContent: string): Promise<void> {
    // Implementar lógica para integrar el contenido generado
    // con el formato existente del blogData.ts
    console.log(`📝 Integrando: ${content.title}`);
  }
}

// Configuraciones predefinidas
const PRESET_CONFIGS = {
  destinations: {
    topics: [
      'Navegar por las Islas Baleares',
      'Costa Brava en Velero',
      'Menorca: Paraíso de Calas',
      'Ibiza: Más Allá de la Fiesta',
      'Formentera: El Caribe Mediterráneo',
      'Islas Columbretes: Reserva Marina',
      'Costa del Sol Náutica',
      'Costa Blanca en Barco'
    ],
    config: {
      categories: ['destinos'],
      contentTypes: ['destino'],
      generateProducts: true,
      generateImages: true
    }
  },
  
  equipment: {
    topics: [
      'GPS Náutico: Guía de Compra 2024',
      'Chalecos Salvavidas: Comparativa Completa',
      'Equipamiento de Seguridad Esencial',
      'Sistemas de Navegación Modernos',
      'Equipamiento de Emergencia',
      'Gadgets Náuticos del Siglo XXI',
      'Equipamiento para Familias',
      'Sistemas de Comunicación Marina'
    ],
    config: {
      categories: ['equipamiento'],
      contentTypes: ['guia', 'review'],
      generateProducts: true,
      generateImages: true
    }
  },
  
  techniques: {
    topics: [
      'Navegación Nocturna Segura',
      'Fondeo en Condiciones Adversas',
      'Manejo de Vientos Fuertes',
      'Navegación Costera Avanzada',
      'Técnicas de Amarrado Profesionales',
      'Lectura de Cartas Náuticas',
      'Meteorología para Navegantes',
      'Navegación a Vela Avanzada'
    ],
    config: {
      categories: ['técnicas'],
      contentTypes: ['tutorial'],
      generateProducts: false,
      generateImages: true
    }
  }
};

// Función principal para ejecutar desde línea de comandos
export async function runBlogAutomation(preset: string = 'destinations'): Promise<void> {
  const presetConfig = PRESET_CONFIGS[preset as keyof typeof PRESET_CONFIGS];
  
  if (!presetConfig) {
    console.error('❌ Preset no válido. Opciones disponibles:', Object.keys(PRESET_CONFIGS));
    return;
  }

  const runner = new BlogAutomationRunner(presetConfig.config);
  
  try {
    await runner.generateBatchContent(presetConfig.topics);
    await runner.integrateWithExistingBlog();
  } catch (error) {
    console.error('❌ Error en la ejecución:', error);
  }
}

// Exportar para uso en otros scripts
export { BlogAutomationRunner, PRESET_CONFIGS };
export default BlogAutomationRunner; 