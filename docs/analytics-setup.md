# 📊 Configuración de Analytics - BoatTrip Planner

## ✅ Estado Actual

**Google Analytics 4 está completamente configurado y funcionando:**

- **ID de Medición:** `G-VR3KE7RXBD`
- **Propiedad:** BoatTrip Planner
- **URL del Flujo:** https://boattrip-planner.com/
- **ID del Flujo:** 11532242322

## 🏗️ Arquitectura del Sistema

### 1. **Configuración Base** (`public/gtag.js`)
- Inicialización automática de Google Analytics
- Configuración de privacidad y GDPR
- Tracking automático de errores y performance
- Eventos personalizados predefinidos

### 2. **Servicio de Analytics** (`services/analyticsService.ts`)
- API centralizada para tracking
- Manejo de errores y fallbacks
- Configuración automática desde variables de entorno

### 3. **Hook de React** (`hooks/useAnalytics.ts`)
- Tracking automático de vistas de página
- Funciones de conveniencia para eventos comunes
- Integración con React Router

### 4. **Consentimiento GDPR** (`components/GoogleAnalyticsConsent.tsx`)
- Banner de consentimiento personalizable
- Control granular de tipos de cookies
- Cumplimiento automático con GDPR

## 🚀 Cómo Usar

### Tracking Básico

```tsx
import { useAnalytics } from '../hooks/useAnalytics';

const MyComponent = () => {
  const { trackUserAction, trackEngagement } = useAnalytics();

  const handleButtonClick = () => {
    trackUserAction('button_click', 'ui', 'cta_button');
  };

  const handleFormSubmit = () => {
    trackEngagement('form_submit', 'contact_form');
  };

  return (
    <button onClick={handleButtonClick}>
      Click me
    </button>
  );
};
```

### Tracking de Afiliados

```tsx
import { trackAffiliateClick } from '../services/analyticsService';

const handleProductClick = (product: Product) => {
  trackAffiliateClick({
    productId: product.asin,
    productName: product.name,
    category: product.category,
    source: 'blog_post',
    postSlug: 'mi-articulo-blog'
  });
};
```

### Tracking de Búsquedas

```tsx
const { trackUserSearch } = useAnalytics();

const handleSearch = (query: string, results: any[]) => {
  trackUserSearch(query, results.length);
};
```

### Tracking de Errores

```tsx
const { trackUserError } = useAnalytics();

try {
  // Código que puede fallar
} catch (error) {
  trackUserError('api_error', error.message);
}
```

## 📈 Eventos Disponibles

### Eventos Automáticos
- **Page Views:** Se registran automáticamente
- **Time on Page:** Se calcula automáticamente
- **Scroll Depth:** Cada 25% de scroll
- **Outbound Links:** Clicks en enlaces externos
- **Form Submissions:** Envíos de formularios
- **JavaScript Errors:** Errores no manejados
- **Performance Metrics:** Métricas de carga

### Eventos Personalizados
- **User Actions:** Clicks, navegación, etc.
- **Engagement:** Interacciones con elementos
- **Affiliate Clicks:** Clicks en productos de Amazon
- **Search Queries:** Búsquedas realizadas
- **Recommendations:** Recomendaciones generadas
- **Form Submissions:** Envíos exitosos/fallidos

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# .env.local
VITE_GOOGLE_ANALYTICS_ID=G-VR3KE7RXBD
```

### Personalización de Eventos

```tsx
import { trackEvent } from '../services/analyticsService';

trackEvent({
  action: 'custom_action',
  category: 'custom_category',
  label: 'custom_label',
  value: 100,
  customParameters: {
    custom_param_1: 'value1',
    custom_param_2: 'value2'
  }
});
```

### Debug Mode

El debug mode se activa automáticamente en localhost:
- Logs detallados en consola
- Verificación de eventos en tiempo real
- Testing de configuración

## 📊 Métricas Clave

### Engagement
- **Page Views:** Vistas de página
- **Time on Page:** Tiempo promedio en página
- **Scroll Depth:** Profundidad de scroll
- **Bounce Rate:** Tasa de rebote

### Conversiones
- **Affiliate Clicks:** Clicks en productos
- **Form Submissions:** Envíos de formularios
- **Search Queries:** Búsquedas realizadas
- **Navigation Events:** Eventos de navegación

### Performance
- **Load Time:** Tiempo de carga
- **Time to First Byte:** TTFB
- **DOM Content Loaded:** DCL
- **JavaScript Errors:** Errores de JS

## 🛡️ Privacidad y GDPR

### Configuración de Privacidad
- **IP Anonymization:** Activada
- **Google Signals:** Desactivadas por defecto
- **Ad Personalization:** Controlada por consentimiento
- **Cookie Flags:** SameSite=None;Secure

### Consentimiento de Cookies
- **Necesarias:** Siempre activas
- **Analíticas:** Controladas por usuario
- **Marketing:** Controladas por usuario
- **Persistencia:** Almacenada en localStorage

## 🔍 Debugging y Testing

### Verificar Configuración

1. **Abrir DevTools Console**
2. **Buscar mensaje:** "✅ Google Analytics configurado correctamente"
3. **Verificar gtag function:** `typeof gtag === 'function'`

### Testing de Eventos

```tsx
// En consola del navegador
gtag('event', 'test_event', {
  event_category: 'testing',
  event_label: 'manual_test'
});
```

### Verificar en Google Analytics

1. **Ir a Google Analytics**
2. **Real-time > Events**
3. **Ver eventos en tiempo real**

## 📱 Integración con Componentes

### Componentes Actualizados
- ✅ `AmazonCTAButton`: Tracking de clicks de afiliados
- ✅ `App.tsx`: Consentimiento de cookies
- ✅ `UserInputForm`: Tracking de formularios
- ✅ `BlogPostPage`: Tracking de vistas de blog

### Próximos Componentes
- 🔄 `BlogSearch`: Tracking de búsquedas
- 🔄 `ItineraryMap`: Tracking de interacciones
- 🔄 `ChatInterface`: Tracking de conversaciones

## 🚨 Troubleshooting

### Problemas Comunes

1. **Analytics no se carga**
   - Verificar bloqueadores de anuncios
   - Comprobar conexión a internet
   - Revisar consola para errores

2. **Eventos no se registran**
   - Verificar consentimiento de cookies
   - Comprobar configuración de gtag
   - Revisar logs del servicio

3. **Performance degradada**
   - Verificar carga asíncrona de scripts
   - Comprobar optimizaciones de Vite
   - Revisar métricas de performance

### Logs de Debug

```bash
# En consola del navegador
console.log('Analytics Service:', window.gtag);
console.log('Data Layer:', window.dataLayer);
console.log('Consent Status:', localStorage.getItem('cookieConsent'));
```

## 📚 Recursos Adicionales

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [Vercel Analytics Integration](https://vercel.com/docs/analytics)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)

---

**Última actualización:** 29 de Agosto, 2025  
**Estado:** ✅ Completamente configurado y funcional
