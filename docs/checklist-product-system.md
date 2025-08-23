# Sistema de Productos del Checklist - Sin ASINs Hardcodeados

## 🎯 **Problema Resuelto**

**Antes**: ASINs hardcodeados que llevaban a productos descatalogados o inexistentes
- ❌ `B0B3QJ8K1M` → Protector solar que ya no existe
- ❌ `B07FNPY8WG` → Equipo snorkel descatalogado
- ❌ `B08C7KG5LP` → Chaleco salvavidas no disponible

**Ahora**: URLs de búsqueda dinámicas que siempre encuentran productos disponibles
- ✅ URLs de búsqueda con keywords específicos
- ✅ Filtrado por categoría náutica
- ✅ Tracking de afiliado optimizado

## 🚀 **Cómo Funciona el Nuevo Sistema**

### 1. **Mapeo Inteligente de Keywords**

```typescript
// PROTECCIÓN SOLAR
'crema solar' → 'protector+solar+spf50+resistente+agua+nautico'
'protector solar' → 'protector+solar+spf50+resistente+agua+nautico'
'spf' → 'protector+solar+spf50+resistente+agua+nautico'

// GAFAS DE SOL
'gafas de sol' → 'gafas+sol+polarizadas+nauticas+barco'
'polarizadas' → 'gafas+sol+polarizadas+nauticas+barco'
'sombrero' → 'gafas+sol+polarizadas+nauticas+barco'
```

### 2. **URLs de Búsqueda Optimizadas**

```typescript
// Ejemplo: Gafas de Sol
searchUrl: 'https://www.amazon.es/s?k=gafas+sol+polarizadas+nauticas+barco&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_gafas&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=gafas_sol'
```

**Componentes de la URL:**
- 🔍 **Query de búsqueda**: `gafas+sol+polarizadas+nauticas+barco`
- 🏷️ **Tag de afiliado**: `explorashop18-21`
- 📊 **Tracking UTM**: `utm_source=boattrip-planner`
- 🎯 **Campaña**: `utm_campaign=nautical_guide`
- 📝 **Contenido**: `utm_content=gafas_sol`

### 3. **Categorías Soportadas**

| Categoría | Keywords | URL de Búsqueda |
|-----------|----------|------------------|
| 🏖️ **Protección Solar** | crema, solar, spf, protector | `protector+solar+spf50+resistente+agua+nautico` |
| 🕶️ **Gafas de Sol** | gafas, polarizadas, sombrero, gorra | `gafas+sol+polarizadas+nauticas+barco` |
| 🥽 **Equipo Snorkel** | snorkel, buceo, aletas, máscara | `equipo+snorkel+completo+profesional+nautico` |
| 🦺 **Seguridad** | chaleco, salvavidas, linterna | `chaleco+salvavidas+homologado+ce+150n+nautico` |
| 🧭 **GPS/Navegación** | gps, garmin, plotter, navegación | `gps+navegacion+nautica+garmin+profesional` |
| 📱 **Tecnología** | gopro, cámara, fotos, videos | `camara+accion+gopro+hero+black+nautica` |
| 🧊 **Nevera/Cooler** | nevera, cooler, hielo, coleman | `nevera+portatil+coleman+barco+hielo` |
| 🏥 **Botiquín** | botiquín, primeros auxilios, medicación | `botiquin+primeros+auxilios+nautico+barco` |

## 🔧 **Ventajas del Nuevo Sistema**

### ✅ **Para el Usuario**
- **Productos siempre disponibles** - No más enlaces rotos
- **Búsqueda relevante** - Keywords específicos para náutica
- **Filtrado automático** - Solo productos de la categoría correcta

### ✅ **Para la Monetización**
- **Enlaces funcionales** - Siempre llevan a productos disponibles
- **Tracking completo** - UTM parameters para analytics
- **Conversión mejorada** - Productos relevantes y actuales

### ✅ **Para el Mantenimiento**
- **Sin ASINs hardcodeados** - No hay que actualizar productos
- **Búsqueda automática** - Amazon siempre encuentra alternativas
- **Escalabilidad** - Fácil añadir nuevas categorías

## 📊 **Ejemplos de URLs Generadas**

### **Protector Solar**
```
https://www.amazon.es/s?k=protector+solar+spf50+resistente+agua+nautico
&tag=explorashop18-21
&utm_source=boattrip-planner
&utm_campaign=nautical_guide
&utm_content=proteccion_solar
```

### **Gafas de Sol**
```
https://www.amazon.es/s?k=gafas+sol+polarizadas+nauticas+barco
&tag=explorashop18-21
&utm_source=boattrip-planner
&utm_campaign=nautical_guide
&utm_content=gafas_sol
```

### **Equipo Snorkel**
```
https://www.amazon.es/s?k=equipo+snorkel+completo+profesional+nautico
&tag=explorashop18-21
&utm_source=boattrip-planner
&utm_campaign=nautical_guide
&utm_content=equipo_snorkel
```

## 🚨 **Fallback Inteligente**

Si no se encuentra una coincidencia exacta, el sistema usa **fallbacks inteligentes**:

```typescript
// Ejemplo: "crema solar spf50"
if (lowerText.includes('solar') || lowerText.includes('protector') || lowerText.includes('crema') || lowerText.includes('spf')) {
  return AMAZON_SEARCH_URLS.protector_solar;
}

// Ejemplo: "gafas polarizadas náuticas"
if (lowerText.includes('gafas') || lowerText.includes('polarizadas') || lowerText.includes('sombrero') || lowerText.includes('gorra')) {
  return AMAZON_SEARCH_URLS.gafas_polarizadas;
}
```

## 🔄 **Mantenimiento y Actualización**

### **Añadir Nueva Categoría**
```typescript
'ropa_impermeable': {
  searchUrl: 'https://www.amazon.es/s?k=ropa+impermeable+nautica+barco&tag=explorashop18-21&...',
  name: 'Ropa Impermeable Náutica',
  category: 'ropa impermeable',
  keywords: ['ropa', 'impermeable', 'nautica', 'barco'],
  asin: undefined
}
```

### **Modificar Keywords Existentes**
```typescript
'protector_solar': {
  keywords: ['crema solar', 'protector solar', 'solar', 'spf', 'biodegradable', 'aftersun']
}
```

## 📈 **Métricas y Analytics**

### **Tracking UTM Parameters**
- `utm_source=boattrip-planner` - Identifica la fuente
- `utm_medium=affiliate` - Tipo de tráfico
- `utm_campaign=nautical_guide` - Campaña principal
- `utm_content=proteccion_solar` - Contenido específico

### **Google Analytics Events**
```typescript
gtag('event', 'click', {
  'event_category': 'amazon_affiliate_checklist',
  'event_label': textContent,
  'custom_parameter': {
    'product_name': textContent,
    'category': 'checklist_recommendation'
  }
});
```

## 🎉 **Resultado Final**

- ✅ **No más productos descatalogados**
- ✅ **Enlaces siempre funcionales**
- ✅ **Monetización garantizada**
- ✅ **Experiencia de usuario mejorada**
- ✅ **Mantenimiento automático**

---

**Sistema implementado en:** `components/RecommendationCard.tsx`  
**Última actualización:** Diciembre 2024  
**Estado:** ✅ Funcionando sin ASINs hardcodeados
