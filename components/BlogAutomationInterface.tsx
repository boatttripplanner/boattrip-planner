// components/BlogAutomationInterface.tsx
// 🚀 INTERFAZ DE AUTOMATIZACIÓN DE BLOG
// Panel de control para generar contenido automatizado

import React, { useState } from 'react';
import { 
  generateBlogContent, 
  generateMultipleBlogPosts,
  BlogContentRequest, 
  GeneratedBlogContent 
} from '../services/blogAutomationService';

interface BlogAutomationInterfaceProps {
  onContentGenerated?: (content: GeneratedBlogContent) => void;
  onMultipleContentGenerated?: (contents: GeneratedBlogContent[]) => void;
}

const BlogAutomationInterface: React.FC<BlogAutomationInterfaceProps> = ({
  onContentGenerated,
  onMultipleContentGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedBlogContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<BlogContentRequest>({
    topic: '',
    category: 'destinos',
    targetAudience: 'intermedios',
    contentType: 'guia',
    targetLength: 'media',
    includeProducts: true,
    includeImages: true,
    seoKeywords: [],
    affiliateFocus: []
  });

  // Opciones predefinidas
  const categoryOptions = [
    { value: 'destinos', label: '🌍 Destinos Náuticos' },
    { value: 'equipamiento', label: '⚙️ Equipamiento' },
    { value: 'técnicas', label: '🧭 Técnicas de Navegación' },
    { value: 'reviews', label: '📊 Reviews de Productos' },
    { value: 'sostenibilidad', label: '🌱 Sostenibilidad' },
    { value: 'familia', label: '👨‍👩‍👧‍👦 Navegación Familiar' },
    { value: 'aventuras', label: '🏴‍☠️ Aventuras Náuticas' }
  ];

  const audienceOptions = [
    { value: 'principiantes', label: '🚣 Principiantes' },
    { value: 'intermedios', label: '⛵ Intermedios' },
    { value: 'expertos', label: '🏆 Expertos' }
  ];

  const contentTypeOptions = [
    { value: 'guia', label: '📖 Guía Completa' },
    { value: 'review', label: '🔍 Review de Producto' },
    { value: 'destino', label: '🗺️ Guía de Destino' },
    { value: 'tutorial', label: '🎓 Tutorial' },
    { value: 'noticias', label: '📰 Noticias' }
  ];

  const lengthOptions = [
    { value: 'corta', label: '📝 Corta (800 palabras)' },
    { value: 'media', label: '📄 Media (1500 palabras)' },
    { value: 'larga', label: '📚 Larga (2500 palabras)' }
  ];

  // Temas predefinidos por categoría
  const predefinedTopics = {
    destinos: [
      'Navegar por las Islas Baleares',
      'Costa Brava en Velero',
      'Menorca: Paraíso de Calas',
      'Ibiza: Más Allá de la Fiesta',
      'Formentera: El Caribe Mediterráneo',
      'Islas Columbretes: Reserva Marina',
      'Costa del Sol Náutica',
      'Costa Blanca en Barco'
    ],
    equipamiento: [
      'GPS Náutico: Guía de Compra',
      'Chalecos Salvavidas 2024',
      'Equipamiento de Seguridad',
      'Sistemas de Navegación',
      'Equipamiento de Emergencia',
      'Gadgets Náuticos Modernos',
      'Equipamiento para Familias',
      'Sistemas de Comunicación'
    ],
    técnicas: [
      'Navegación Nocturna Segura',
      'Fondeo en Condiciones Adversas',
      'Manejo de Vientos Fuertes',
      'Navegación Costera',
      'Técnicas de Amarrado',
      'Lectura de Cartas Náuticas',
      'Meteorología para Navegantes',
      'Navegación a Vela Avanzada'
    ],
    reviews: [
      'Mejores GPS Marinos 2024',
      'Chalecos Salvavidas Comparativa',
      'Radios VHF: Análisis Completo',
      'Equipamiento de Pesca',
      'Sistemas de Energía Solar',
      'Equipamiento de Buceo',
      'Herramientas Náuticas',
      'Equipamiento de Cocina'
    ],
    sostenibilidad: [
      'Navegación Sostenible',
      'Energía Solar en Barcos',
      'Reducción de Plásticos',
      'Conservación Marina',
      'Barcos Ecológicos',
      'Prácticas Sostenibles',
      'Tecnología Verde Náutica',
      'Protección del Medio Marino'
    ],
    familia: [
      'Navegar con Niños',
      'Seguridad Familiar a Bordo',
      'Actividades para Familias',
      'Equipamiento Infantil',
      'Destinos Familiares',
      'Preparación con Niños',
      'Entretenimiento Familiar',
      'Educación Náutica Infantil'
    ],
    aventuras: [
      'Travesías Largas',
      'Navegación Oceánica',
      'Exploración de Calas Secretas',
      'Aventuras en Solitario',
      'Regatas y Competiciones',
      'Navegación Invernal',
      'Expediciones Náuticas',
      'Aventuras Extremas'
    ]
  };

  // Palabras clave SEO predefinidas
  const predefinedKeywords = {
    destinos: ['navegación', 'velero', 'mediterráneo', 'calas', 'puertos', 'marinas', 'fondeo'],
    equipamiento: ['equipamiento náutico', 'seguridad', 'navegación', 'barco', 'marino', 'profesional'],
    técnicas: ['navegación', 'técnicas', 'vela', 'marino', 'patrón', 'navegante', 'experiencia'],
    reviews: ['review', 'productos náuticos', 'comparativa', 'análisis', 'calidad', 'precio'],
    sostenibilidad: ['sostenibilidad', 'ecológico', 'verde', 'medio ambiente', 'conservación', 'marino'],
    familia: ['familia', 'niños', 'seguridad', 'navegación familiar', 'actividades', 'educación'],
    aventuras: ['aventura', 'exploración', 'travesía', 'expedición', 'desafío', 'experiencia']
  };

  // Manejadores de eventos
  const handleInputChange = (field: keyof BlogContentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Actualizar palabras clave cuando cambia la categoría
    if (field === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        seoKeywords: predefinedKeywords[value] || []
      }));
    }
  };

  const handleTopicSelect = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topic
    }));
  };

  const handleKeywordToggle = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.includes(keyword)
        ? prev.seoKeywords.filter(k => k !== keyword)
        : [...prev.seoKeywords, keyword]
    }));
  };

  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.seoKeywords.includes(keyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, keyword.trim()]
      }));
    }
  };

  const handleGenerateContent = async () => {
    if (!formData.topic.trim()) {
      setError('Por favor, introduce un tema para el artículo');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setCurrentStep('Iniciando generación...');

    try {
      const content = await generateBlogContent(formData);
      setGeneratedContent(content);
      onContentGenerated?.(content);
      
      setGenerationProgress(100);
      setCurrentStep('¡Contenido generado exitosamente!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCurrentStep('Error en la generación');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMultiple = async () => {
    const requests: BlogContentRequest[] = predefinedTopics[formData.category].slice(0, 3).map(topic => ({
      ...formData,
      topic
    }));

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setCurrentStep('Generando múltiples artículos...');

    try {
      const contents = await generateMultipleBlogPosts(requests);
      onMultipleContentGenerated?.(contents);
      
      setGenerationProgress(100);
      setCurrentStep(`¡${contents.length} artículos generados exitosamente!`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCurrentStep('Error en la generación múltiple');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      const markdownContent = `# ${generatedContent.title}

${generatedContent.excerpt}

${generatedContent.content}

---
*Generado automáticamente por BoatTrip Planner*
*Fecha: ${generatedContent.publishDate}*
*Tiempo de lectura: ${generatedContent.readingTime} minutos*
`;

      navigator.clipboard.writeText(markdownContent);
      alert('Contenido copiado al portapapeles');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Automatización de Blog Náutico
        </h1>
        <p className="text-gray-600">
          Genera contenido de revista de alta calidad con imágenes, productos de Amazon y optimización SEO
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Configuración */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">⚙️ Configuración del Contenido</h2>
          
          {/* Tema */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Tema del Artículo
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="Ej: Navegar por las Islas Baleares"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Temas Predefinidos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Temas Sugeridos
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {predefinedTopics[formData.category].map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTopicSelect(topic)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Contenido */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 Tipo de Contenido
            </label>
            <select
              value={formData.contentType}
              onChange={(e) => handleInputChange('contentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {contentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Audiencia Objetivo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👥 Audiencia Objetivo
            </label>
            <select
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {audienceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Longitud */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📏 Longitud del Artículo
            </label>
            <select
              value={formData.targetLength}
              onChange={(e) => handleInputChange('targetLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {lengthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Opciones */}
          <div className="mb-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includeImages}
                onChange={(e) => handleInputChange('includeImages', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">🖼️ Incluir imágenes de Unsplash</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includeProducts}
                onChange={(e) => handleInputChange('includeProducts', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">🛒 Incluir productos de Amazon</span>
            </label>
          </div>

          {/* Palabras Clave SEO */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Palabras Clave SEO
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {predefinedKeywords[formData.category].map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordToggle(keyword)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    formData.seoKeywords.includes(keyword)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Añadir palabra clave..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddKeyword(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  handleAddKeyword(input.value);
                  input.value = '';
                }}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-2">
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? '🔄 Generando...' : '🚀 Generar Artículo'}
            </button>
            
            <button
              onClick={handleGenerateMultiple}
              disabled={isGenerating}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? '🔄 Generando Múltiples...' : '📚 Generar Múltiples Artículos'}
            </button>
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Resultados</h2>
          
          {/* Progreso */}
          {isGenerating && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{currentStep}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              ❌ {error}
            </div>
          )}

          {/* Contenido Generado */}
          {generatedContent && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">✅ Artículo Generado</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Título:</strong> {generatedContent.title}</p>
                  <p><strong>Categoría:</strong> {generatedContent.category}</p>
                  <p><strong>Tiempo de lectura:</strong> {generatedContent.readingTime} min</p>
                  <p><strong>Imágenes:</strong> {generatedContent.images.length}</p>
                  <p><strong>Productos:</strong> {generatedContent.products.length}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopyContent}
                  className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  📋 Copiar Contenido Markdown
                </button>
                
                <button
                  onClick={() => setGeneratedContent(null)}
                  className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  🗑️ Limpiar Resultados
                </button>
              </div>

              {/* Vista Previa */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">👀 Vista Previa</h4>
                <div className="max-h-64 overflow-y-auto p-3 bg-gray-50 rounded-md text-sm">
                  <h3 className="font-bold mb-2">{generatedContent.title}</h3>
                  <p className="text-gray-600 mb-2">{generatedContent.excerpt}</p>
                  <div className="text-xs text-gray-500">
                    {generatedContent.content.substring(0, 300)}...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estado Inicial */}
          {!isGenerating && !generatedContent && !error && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📝</div>
              <p>Configura los parámetros y genera tu primer artículo</p>
            </div>
          )}
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div>
            <strong>🤖 IA:</strong> Gemini Pro para contenido de revista
          </div>
          <div>
            <strong>🖼️ Imágenes:</strong> Unsplash con temas marítimos
          </div>
          <div>
            <strong>🛒 Productos:</strong> Amazon con enlaces de afiliado
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAutomationInterface; 