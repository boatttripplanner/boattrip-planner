# Sistema de Tracking de Afiliados de Amazon

## Resumen
Se ha implementado un sistema completo de tracking para enlaces de afiliados de Amazon que permite rastrear todos los clicks y generar estadísticas detalladas.

## Componentes Implementados

### 1. Servicio de Tracking (`services/affiliateTracking.ts`)
- **Funcionalidad**: Registra clicks en enlaces de Amazon
- **Almacenamiento**: localStorage (datos locales del navegador)
- **Analytics**: Integración con Google Analytics y Facebook Pixel
- **Estadísticas**: Cálculo automático de revenue estimado

### 2. Componente AmazonCTAButton (`components/AmazonCTAButton.tsx`)
- **Tracking**: Automático en todos los clicks
- **Extracción de datos**: ASIN, nombre del producto, categoría
- **Categorización inteligente**: Basada en el texto del enlace
- **Logging**: Console.log para debugging

### 3. Dashboard de Afiliados (`components/AffiliateDashboard.tsx`)
- **Visualización**: Estadísticas en tiempo real
- **Métricas**: Clicks totales, revenue estimado, tasa de conversión
- **Análisis**: Productos más populares, categorías más clickeadas
- **Exportación**: Datos en formato JSON

## Cómo Funciona el Tracking

### 1. Detección de Enlaces de Amazon
```typescript
// En BlogPostPage.tsx
const getAmazonLinkInfo = (href: string, children: React.ReactNode) => {
  if (!href || !href.includes('amazon.es')) {
    return { isAmazon: false, variant: 'primary', text: '' };
  }
  // ... lógica de detección
};
```

### 2. Extracción de Información del Producto
```typescript
// En AmazonCTAButton.tsx
const extractAmazonInfo = (href: string, children: React.ReactNode) => {
  // Extrae ASIN de diferentes formatos de URL
  // Determina categoría basada en el texto
  // Retorna información estructurada
};
```

### 3. Registro del Click
```typescript
trackAffiliateClick(
  asin,           // Identificador del producto
  productName,    // Nombre del producto
  category,       // Categoría (gps, safety, snorkel, etc.)
  'blog_post',    // Fuente del click
  postSlug        // Slug del post del blog
);
```

## Categorías Soportadas

- **gps**: GPS náuticos, navegación
- **safety**: Chalecos salvavidas, seguridad
- **snorkel**: Equipo de snorkel, buceo
- **fishing**: Pesca, cañas, carretes
- **tools**: Herramientas, kits
- **technology**: Cámaras, cargadores, electrónica
- **comfort**: Neveras, comodidades
- **water_sports**: Deportes acuáticos
- **clothing**: Ropa náutica
- **food**: Comida, bebidas

## Fuentes de Tracking

1. **blog_post**: Enlaces en el contenido del blog
2. **product_recommendations**: Productos recomendados
3. **inline_link**: Enlaces inline

## Estadísticas Generadas

### Métricas Principales
- Total de clicks
- Revenue estimado (5% conversión, €20 promedio)
- Tasa de conversión
- Productos únicos clickeados

### Análisis por Categoría
- Clicks por categoría de producto
- Productos más populares
- Fuentes de tráfico más efectivas

## Verificación del Funcionamiento

### 1. Botón de Prueba en Desarrollo
```typescript
// Solo visible en modo desarrollo
{process.env.NODE_ENV === 'development' && (
  <button onClick={() => trackAffiliateClick(...)}>
    🧪 Test Tracking
  </button>
)}
```

### 2. Console Logs
```typescript
console.log('Amazon affiliate click tracked:', { 
  asin, productName, category, href 
});
```

### 3. Dashboard de Verificación
- Botón "🧪 Probar Tracking" en el dashboard
- Simula clicks de prueba
- Actualiza estadísticas en tiempo real

## Enlaces de Amazon Soportados

### Formato 1: Producto Directo
```
https://www.amazon.es/dp/B09M47HFCQ?tag=explorashop18-21
```

### Formato 2: Búsqueda
```
https://www.amazon.es/s?k=garmin+echomap+uhd+gps+nautico&tag=explorashop18-21
```

## Limitaciones Actuales

1. **Almacenamiento Local**: Los datos se guardan en localStorage
2. **Sin Sincronización**: No hay backend para persistencia
3. **Datos por Dispositivo**: Cada dispositivo tiene sus propios datos

## Próximas Mejoras

1. **Backend API**: Para sincronización de datos
2. **Base de Datos**: Persistencia permanente
3. **Analytics Avanzado**: Más métricas y reportes
4. **Notificaciones**: Alertas de clicks importantes

## Comandos de Verificación

### Verificar Tracking en Consola
```javascript
// En la consola del navegador
localStorage.getItem('affiliate_clicks')
```

### Exportar Datos
```javascript
// En el dashboard
affiliateTracking.exportData()
```

### Limpiar Datos Antiguos
```javascript
// Automático cada 7 días
affiliateTracking.cleanOldData()
```

## Integración con Amazon Associates

El sistema está diseñado para trabajar con el programa de afiliados de Amazon:

1. **Tag de Afiliado**: `explorashop18-21`
2. **Marketplace**: Amazon España (amazon.es)
3. **Tracking**: Todos los clicks se registran con información completa
4. **Comisiones**: Revenue estimado basado en conversiones típicas

## Troubleshooting

### Problema: No se registran clicks
**Solución**: Verificar que el enlace contenga "amazon.es"

### Problema: Categoría incorrecta
**Solución**: Revisar el texto del enlace para palabras clave

### Problema: Datos no persisten
**Solución**: Los datos están en localStorage, se pierden al limpiar caché

### Problema: Dashboard vacío
**Solución**: Hacer clicks de prueba o verificar localStorage 