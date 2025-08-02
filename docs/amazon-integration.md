# 🛒 Guía de Integración con Amazon

## Configuración Completada ✅

Tu integración con Amazon está configurada y lista para usar.

### Credenciales Configuradas
- **Access Key ID**: AKPAXD3F...
- **Associate Tag**: boattrippl07-21
- **Marketplace**: amazon.es

### Funcionalidades Disponibles

#### 1. Productos Dinámicos
- Búsqueda automática de productos en Amazon
- Productos trending por categoría
- Precios actualizados en tiempo real
- URLs de afiliado optimizadas

#### 2. Tracking Avanzado
- Registro de clicks por producto
- Análisis de conversión por categoría
- Estadísticas de revenue estimado
- Dashboard de analytics completo

#### 3. Integración en el Blog
- Productos recomendados automáticos
- Enlaces contextuales en artículos
- Optimización SEO para afiliados

### Cómo Usar

#### En Componentes React:
```tsx
import DynamicProductRecommendations from './components/DynamicProductRecommendations';

// Productos basados en búsqueda
<DynamicProductRecommendations 
  query="snorkel"
  category="snorkel_gear"
  maxProducts={6}
/>

// Productos trending
<DynamicProductRecommendations 
  showTrending={true}
  category="nautical"
/>
```

#### En el Blog:
Los productos se muestran automáticamente en cada artículo del blog basándose en:
- Etiquetas del artículo
- Contenido del texto
- Categoría del post

### Testing

Ejecuta el script de testing:
```bash
node scripts/test-amazon-integration.js
```

### Dashboard de Analytics

Accede al dashboard avanzado para ver:
- Revenue estimado
- Productos top
- Posts más rentables
- Tendencias estacionales

### Próximos Pasos

1. **Configurar Google Analytics** para tracking real
2. **Optimizar categorías** basándose en datos
3. **Añadir más productos** según rendimiento
4. **Implementar A/B testing** para optimizar conversión

### Soporte

Si tienes problemas:
1. Verifica las credenciales en `constants.ts`
2. Ejecuta el script de testing
3. Revisa los logs del navegador
4. Contacta con soporte técnico

---
*Configurado automáticamente el 31/7/2025*
