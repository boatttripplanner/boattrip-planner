// components/BlogAutomationDemo.tsx
// 🚀 DEMOSTRACIÓN DEL SISTEMA DE AUTOMATIZACIÓN DE BLOG
// Muestra ejemplos de contenido generado automáticamente

import React, { useState } from 'react';
import { GeneratedBlogContent, BlogImage, BlogProduct } from '../types';

interface BlogAutomationDemoProps {
  onGenerateContent?: () => void;
}

const BlogAutomationDemo: React.FC<BlogAutomationDemoProps> = ({
  onGenerateContent
}) => {
  const [selectedExample, setSelectedExample] = useState<string>('destinos');

  // Ejemplos de contenido generado automáticamente
  const exampleContent: { [key: string]: GeneratedBlogContent } = {
    destinos: {
      title: 'Navegar por las Islas Baleares: Guía Completa 2024',
      slug: 'navegar-islas-baleares-guia-completa-2024',
      excerpt: 'Descubre los mejores destinos náuticos de las Islas Baleares con nuestra guía completa. Desde las calas turquesas de Menorca hasta la costa salvaje de Mallorca, te mostramos todo lo que necesitas saber para planificar tu aventura náutica perfecta.',
      content: `# Navegar por las Islas Baleares: Guía Completa 2024

![Navegación en las Islas Baleares](https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop&crop=center)

*Foto por John Smith en Unsplash*

Las Islas Baleares son uno de los destinos náuticos más impresionantes del Mediterráneo. Con aguas cristalinas, calas paradisíacas y una infraestructura náutica de primer nivel, estas islas ofrecen experiencias inolvidables para navegantes de todos los niveles.

## 🗺️ Mejores Destinos por Isla

### Mallorca: La Isla Principal

**Puertos y Marinas:**
- Puerto de Palma: Marina principal con todos los servicios
- Puerto de Alcudia: Perfecto para explorar el norte
- Puerto de Andratx: Ambiente más tranquilo y auténtico

**Calas Imprescindibles:**
- Cala Varques: Agua turquesa y arena blanca
- Cala Mondragó: Parque natural protegido
- Cala Deià: Ambiente bohemio y artístico

### Menorca: El Paraíso Natural

**Fondeos Recomendados:**
- Cala Macarella y Macarelleta: Las más famosas
- Cala Turqueta: Agua cristalina perfecta
- Cala Pregonda: Arena rojiza y aguas tranquilas

**Navegación:**
- Vientos predominantes del norte (Tramontana)
- Mejor época: Mayo a Octubre
- Reserva de la Biosfera UNESCO

### Ibiza: Más Allá de la Fiesta

**Destinos Tranquilos:**
- Cala Salada: Agua cristalina y rocas
- Cala d'Hort: Vista a Es Vedrà
- Cala Conta: Puestas de sol espectaculares

**Gastronomía Local:**
- Restaurantes en el puerto de Ibiza
- Comida tradicional en Formentera
- Experiencias gastronómicas únicas

## 🛒 Equipamiento Recomendado

### GPS Náutico Garmin ECHOMAP UHD

**Precio:** €899 | **Valoración:** ★★★★★ (4.8/5)

**Características:**
- Pantalla de 9 pulgadas Ultra HD
- Cartas náuticas detalladas de las Baleares
- Sonar CHIRP tradicional y ClearVü
- Conectividad WiFi y Bluetooth

**✅ Ventajas**
- Cartografía excepcional de las Baleares
- Interfaz intuitiva y fácil de usar
- Sonar de alta definición
- Actualizaciones gratuitas

**⚠️ Consideraciones**
- Precio elevado pero justificado
- Requiere instalación profesional
- Curva de aprendizaje inicial

[Ver en Amazon - €899](https://www.amazon.es/dp/B08F7PTF54?tag=explorashop18-21)

---

### Chaleco Salvavidas Náutico 150N

**Precio:** €89 | **Valoración:** ★★★★☆ (4.5/5)

**Características:**
- Flotabilidad 150N homologada CE
- Inflado automático con sensor de agua
- Color naranja de alta visibilidad
- Ajuste cómodo para adultos

**✅ Ventajas**
- Seguridad certificada para navegación
- Inflado automático confiable
- Ajuste cómodo y seguro
- Precio competitivo

**⚠️ Consideraciones**
- Talla única (ajustable)
- Requiere recarga anual
- Color limitado

[Ver en Amazon - €89](https://www.amazon.es/dp/B07XYZ1234?tag=explorashop18-21)

---

## 🧭 Consejos de Navegación

### Mejor Época para Visitar

**Temporada Alta (Julio-Agosto):**
- Clima perfecto pero más concurrido
- Reservas necesarias con antelación
- Precios más elevados

**Temporada Media (Mayo-Junio, Septiembre):**
- Clima excelente y menos turistas
- Mejor relación calidad-precio
- Condiciones ideales para navegación

**Temporada Baja (Octubre-Abril):**
- Menos servicios disponibles
- Clima variable pero navegable
- Precios más económicos

### Condiciones Meteorológicas

**Vientos Predominantes:**
- **Tramontana (Norte):** Fuerte y frío, especialmente en invierno
- **Llevant (Este):** Húmedo y persistente
- **Mestral (NO):** Fresco y seco, ideal para navegación
- **Garbí (SO):** Cálido y húmedo

**Consejos de Seguridad:**
- Consultar siempre la meteorología antes de zarpar
- Tener plan B para condiciones adversas
- Conocer los puertos de refugio de cada zona

## 🍽️ Gastronomía Local

### Platos Típicos

**Mallorca:**
- Sobrasada mallorquina
- Ensaimada tradicional
- Tumbet (verduras con patatas)

**Menorca:**
- Queso de Mahón
- Caldereta de langosta
- Gin de Menorca

**Ibiza:**
- Bullit de peix
- Sofrit pagès
- Hierbas ibicencas

### Restaurantes Recomendados

**Mallorca:**
- Restaurante Es Molí (Puerto de Alcudia)
- Sa Foradada (Deià)
- El Olivo (Puerto de Andratx)

**Menorca:**
- Es Cranc (Cala Galdana)
- Sa Paissa (Mahón)
- Es Moli de Foc (Ciutadella)

## 🏆 Conclusión

Navegar por las Islas Baleares es una experiencia única que combina la belleza natural del Mediterráneo con una infraestructura náutica de primer nivel. Cada isla tiene su propio carácter y encanto, ofreciendo algo para todos los tipos de navegantes.

**Recuerda:** La clave para disfrutar al máximo es planificar bien tu ruta, respetar el medio ambiente y estar preparado para las condiciones meteorológicas cambiantes del Mediterráneo.

---

*¿Te ha gustado esta guía? Compártela con otros navegantes y ayúdanos a crear una comunidad náutica más informada.*`,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop&crop=center',
          alt: 'Velero navegando por las Islas Baleares',
          caption: 'Foto por John Smith en Unsplash',
          width: 1200,
          height: 600,
          position: 'header',
          unsplashId: 'abc123',
          photographer: 'John Smith'
        },
        {
          url: 'https://images.unsplash.com/photo-1558618666-8647a1e1e4f8?w=800&h=400&fit=crop&crop=center',
          alt: 'Cala turquesa en Menorca',
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
          title: 'GPS Náutico Garmin ECHOMAP UHD',
          price: '€899',
          rating: 4.8,
          reviewCount: 127,
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: 'https://www.amazon.es/dp/B08F7PTF54?tag=explorashop18-21',
          category: 'navegacion',
          description: 'GPS náutico profesional con pantalla Ultra HD y cartas detalladas de las Baleares',
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
        title: 'Navegar por las Islas Baleares: Guía Completa 2024 - BoatTrip Planner',
        description: 'Descubre los mejores destinos náuticos de las Islas Baleares. Guía completa con calas, puertos, equipamiento y consejos de navegación.',
        keywords: ['navegación', 'islas baleares', 'velero', 'mediterráneo', 'calas', 'puertos'],
        ogImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop&crop=center',
        canonicalUrl: 'https://boattrip-planner.com/blog/navegar-islas-baleares-guia-completa-2024',
        structuredData: {}
      },
      readingTime: 8,
      publishDate: '2024-01-15',
      tags: ['destinos', 'islas baleares', 'navegación', 'mediterráneo'],
      category: 'destinos'
    },
    
    equipamiento: {
      title: 'GPS Náutico: Guía de Compra 2024 - Los Mejores Modelos',
      slug: 'gps-nautico-guia-compra-2024',
      excerpt: 'Descubre los mejores GPS náuticos del mercado con nuestra guía completa de compra. Análisis detallado de características, precios y recomendaciones para todos los presupuestos.',
      content: `# GPS Náutico: Guía de Compra 2024

![GPS Náutico Profesional](https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&crop=center)

*Foto por Carlos López en Unsplash*

Un GPS náutico es una inversión fundamental para cualquier navegante serio. En esta guía completa analizamos los mejores modelos del mercado, sus características y cómo elegir el que mejor se adapte a tus necesidades.

## 🎯 ¿Por Qué Necesitas un GPS Náutico?

### Ventajas Principales

**Seguridad:**
- Navegación precisa en condiciones adversas
- Alertas de peligros y obstáculos
- Funciones de emergencia integradas

**Conveniencia:**
- Planificación de rutas automática
- Información meteorológica en tiempo real
- Integración con otros equipos náuticos

**Eficiencia:**
- Optimización de rutas para ahorrar combustible
- Tracking de rendimiento del barco
- Análisis de datos de navegación

## 🏆 Mejores GPS Náuticos 2024

### 1. Garmin ECHOMAP UHD 94sv - TOP PREMIUM

**Precio:** €1,299 | **Valoración:** ★★★★★ (4.9/5)

**Características Destacadas:**
- Pantalla de 9 pulgadas Ultra HD
- Sonar CHIRP tradicional y ClearVü
- Cartas náuticas BlueChart g3
- Conectividad WiFi y Bluetooth

**✅ Ventajas**
- Calidad de imagen excepcional
- Cartografía muy detallada
- Sonar de alta definición
- Interfaz intuitiva

**⚠️ Consideraciones**
- Precio muy elevado
- Requiere instalación profesional
- Curva de aprendizaje

[Ver en Amazon - €1,299](https://www.amazon.es/dp/B08F7PTF54?tag=explorashop18-21)

---

### 2. Raymarine Axiom 9 - EXCELENTE RELACIÓN CALIDAD-PRECIO

**Precio:** €899 | **Valoración:** ★★★★☆ (4.7/5)

**Características Destacadas:**
- Pantalla de 9 pulgadas táctil
- Sistema operativo Lighthouse 3
- Cartas Navionics incluidas
- Radar integrado opcional

**✅ Ventajas**
- Interfaz táctil muy intuitiva
- Cartografía Navionics de calidad
- Precio competitivo
- Fácil instalación

**⚠️ Consideraciones**
- Menos opciones de personalización
- Sonar básico incluido
- Actualizaciones de pago

[Ver en Amazon - €899](https://www.amazon.es/dp/B07ABC1234?tag=explorashop18-21)

---

### 3. Lowrance HDS LIVE 9 - PARA PESCADORES

**Precio:** €799 | **Valoración:** ★★★★☆ (4.6/5)

**Características Destacadas:**
- Pantalla de 9 pulgadas LED
- Sonar ActiveTarget Live
- Cartas C-MAP incluidas
- Especializado en pesca

**✅ Ventajas**
- Sonar excepcional para pesca
- Precio asequible
- Fácil de usar
- Durabilidad comprobada

**⚠️ Consideraciones**
- Menos opciones de navegación
- Cartografía limitada
- Interfaz menos moderna

[Ver en Amazon - €799](https://www.amazon.es/dp/B06XYZ7890?tag=explorashop18-21)

---

## 🛒 Accesorios Recomendados

### Antena GPS Externa

**Precio:** €89 | **Valoración:** ★★★★☆ (4.4/5)

**Características:**
- Precisión mejorada
- Instalación sencilla
- Compatible con la mayoría de GPS

[Ver en Amazon - €89](https://www.amazon.es/dp/B05DEF456?tag=explorashop18-21)

---

### Funda Protectora

**Precio:** €45 | **Valoración:** ★★★★☆ (4.3/5)

**Características:**
- Protección UV y sal
- Fácil instalación
- Transparente para visibilidad

[Ver en Amazon - €45](https://www.amazon.es/dp/B04GHI789?tag=explorashop18-21)

---

## 💰 Comparativa de Precios

| Modelo | Precio | Pantalla | Sonar | Cartografía | Valoración |
|--------|--------|----------|-------|-------------|------------|
| Garmin ECHOMAP UHD 94sv | €1,299 | 9" UHD | CHIRP | BlueChart g3 | 4.9/5 |
| Raymarine Axiom 9 | €899 | 9" táctil | Básico | Navionics | 4.7/5 |
| Lowrance HDS LIVE 9 | €799 | 9" LED | ActiveTarget | C-MAP | 4.6/5 |

## 🎯 Cómo Elegir tu GPS Náutico

### Factores a Considerar

**1. Tamaño de Pantalla:**
- 7-9 pulgadas: Ideal para barcos medianos
- 10-12 pulgadas: Para barcos grandes
- 16+ pulgadas: Para yates de lujo

**2. Tipo de Navegación:**
- **Costera:** GPS básico con cartas locales
- **Altura:** GPS avanzado con cartas oceánicas
- **Pesca:** GPS con sonar especializado

**3. Presupuesto:**
- **Económico (€300-600):** Funcionalidades básicas
- **Medio (€600-1,000):** Buenas características
- **Premium (€1,000+):** Máxima calidad y funciones

### Consejos de Compra

**Antes de Comprar:**
1. Define tus necesidades específicas
2. Investiga las cartas náuticas disponibles
3. Considera la instalación y mantenimiento
4. Lee reviews de usuarios reales

**Durante la Compra:**
1. Verifica la garantía y soporte
2. Confirma la compatibilidad con tu barco
3. Incluye accesorios necesarios
4. Considera opciones de financiación

## 🔧 Instalación y Mantenimiento

### Instalación Profesional

**Recomendado para:**
- GPS de alta gama
- Integración con otros sistemas
- Barcos nuevos o en garantía

**Ventajas:**
- Instalación correcta garantizada
- Configuración optimizada
- Soporte técnico incluido

### Instalación DIY

**Adecuado para:**
- GPS básicos o medianos
- Barcos pequeños
- Navegantes con experiencia

**Consideraciones:**
- Seguir manuales al pie de la letra
- Verificar conexiones eléctricas
- Probar en condiciones seguras

### Mantenimiento Regular

**Tareas Mensuales:**
- Limpiar pantalla y conexiones
- Verificar actualizaciones
- Comprobar funcionamiento del GPS

**Tareas Anuales:**
- Actualizar cartas náuticas
- Revisar antena y cables
- Calibrar sensores si es necesario

## 🏆 Conclusión

Un GPS náutico es una inversión que mejora significativamente la seguridad y disfrute de la navegación. La elección correcta depende de tus necesidades específicas, presupuesto y tipo de navegación.

**Nuestra Recomendación:**
- **Principiantes:** Raymarine Axiom 9
- **Intermedios:** Garmin ECHOMAP UHD 74sv
- **Expertos:** Garmin ECHOMAP UHD 94sv

**Recuerda:** La mejor inversión es la que se adapta perfectamente a tus necesidades y presupuesto.

---

*¿Te ha gustado esta guía? Compártela con otros navegantes y ayúdanos a crear una comunidad náutica más informada.*`,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&crop=center',
          alt: 'GPS Náutico Profesional',
          caption: 'Foto por Carlos López en Unsplash',
          width: 1200,
          height: 600,
          position: 'header',
          unsplashId: 'ghi789',
          photographer: 'Carlos López'
        }
      ],
      products: [
        {
          asin: 'B08F7PTF54',
          title: 'Garmin ECHOMAP UHD 94sv',
          price: '€1,299',
          rating: 4.9,
          reviewCount: 156,
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: 'https://www.amazon.es/dp/B08F7PTF54?tag=explorashop18-21',
          category: 'navegacion',
          description: 'GPS náutico premium con pantalla Ultra HD y sonar CHIRP avanzado',
          pros: ['Calidad de imagen excepcional', 'Cartografía muy detallada', 'Sonar de alta definición'],
          cons: ['Precio muy elevado', 'Requiere instalación profesional'],
          position: 'inline'
        }
      ],
      seoData: {
        title: 'GPS Náutico: Guía de Compra 2024 - Los Mejores Modelos - BoatTrip Planner',
        description: 'Descubre los mejores GPS náuticos del mercado. Análisis completo con características, precios y recomendaciones para todos los presupuestos.',
        keywords: ['gps náutico', 'navegación', 'equipamiento náutico', 'cartas náuticas', 'sonar'],
        ogImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&crop=center',
        canonicalUrl: 'https://boattrip-planner.com/blog/gps-nautico-guia-compra-2024',
        structuredData: {}
      },
      readingTime: 12,
      publishDate: '2024-01-20',
      tags: ['equipamiento', 'gps náutico', 'navegación', 'tecnología'],
      category: 'equipamiento'
    }
  };

  const examples = [
    { key: 'destinos', label: '🌍 Destinos Náuticos', description: 'Guías de destinos y rutas' },
    { key: 'equipamiento', label: '⚙️ Equipamiento', description: 'Reviews y comparativas de productos' }
  ];

  const currentContent = exampleContent[selectedExample];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Demostración: Automatización de Blog
        </h1>
        <p className="text-gray-600">
          Ejemplos de contenido generado automáticamente con IA, imágenes de Unsplash y productos de Amazon
        </p>
      </div>

      {/* Selector de Ejemplos */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📚 Ejemplos de Contenido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map(example => (
            <button
              key={example.key}
              onClick={() => setSelectedExample(example.key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedExample === example.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="text-lg font-semibold">{example.label}</div>
                <div className="text-sm text-gray-600">{example.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Generado */}
      {currentContent && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header del Artículo */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-teal-600">
            {currentContent.images.find(img => img.position === 'header') && (
              <img
                src={currentContent.images.find(img => img.position === 'header')!.url}
                alt={currentContent.images.find(img => img.position === 'header')!.alt}
                className="w-full h-full object-cover opacity-20"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-2">{currentContent.title}</h1>
                <p className="text-lg opacity-90">{currentContent.excerpt}</p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                  <span>📅 {currentContent.publishDate}</span>
                  <span>⏱️ {currentContent.readingTime} min lectura</span>
                  <span>📂 {currentContent.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metadatos */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap gap-2 mb-4">
              {currentContent.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>🖼️ Imágenes:</strong> {currentContent.images.length}
              </div>
              <div>
                <strong>🛒 Productos:</strong> {currentContent.products.length}
              </div>
              <div>
                <strong>🔍 SEO:</strong> {currentContent.seoData.keywords.length} keywords
              </div>
            </div>
          </div>

          {/* Contenido del Artículo */}
          <div className="p-6">
            <div className="prose max-w-none">
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ 
                  __html: currentContent.content
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold mt-6 mb-4">$1</h2>')
                    .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
                    .replace(/- (.*?)\n/g, '<li class="ml-4">$1</li>')
                }}
              />
            </div>
          </div>

          {/* Productos Recomendados */}
          {currentContent.products.length > 0 && (
            <div className="p-6 bg-gray-50 border-t">
              <h3 className="text-xl font-semibold mb-4">🛒 Productos Recomendados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContent.products.map((product, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{product.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-yellow-500">
                            {'★'.repeat(Math.floor(product.rating))}
                          </span>
                          <span className="text-sm text-gray-600">
                            {product.rating}/5 ({product.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="text-lg font-bold text-green-600 mt-1">
                          {product.price}
                        </div>
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Ver en Amazon
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datos SEO */}
          <div className="p-6 bg-blue-50 border-t">
            <h3 className="text-lg font-semibold mb-3">🔍 Datos SEO Generados</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Título SEO:</strong> {currentContent.seoData.title}</div>
              <div><strong>Descripción:</strong> {currentContent.seoData.description}</div>
              <div><strong>Keywords:</strong> {currentContent.seoData.keywords.join(', ')}</div>
              <div><strong>URL Canónica:</strong> {currentContent.seoData.canonicalUrl}</div>
            </div>
          </div>
        </div>
      )}

      {/* Información del Sistema */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Características del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
          <div>
            <strong>🤖 IA:</strong> Contenido generado con Gemini Pro
          </div>
          <div>
            <strong>🖼️ Imágenes:</strong> Unsplash con temas marítimos
          </div>
          <div>
            <strong>🛒 Productos:</strong> Amazon con enlaces de afiliado
          </div>
          <div>
            <strong>🔍 SEO:</strong> Optimización automática completa
          </div>
          <div>
            <strong>📊 Analytics:</strong> Tracking de rendimiento
          </div>
          <div>
            <strong>⚡ Velocidad:</strong> Generación en segundos
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <button
          onClick={onGenerateContent}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          🚀 Probar Automatización
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Genera tu propio contenido personalizado
        </p>
      </div>
    </div>
  );
};

export default BlogAutomationDemo; 