# 🚀 Configuración de la API de Amazon Product Advertising

## 📋 Requisitos Previos

- Cuenta de Amazon Associates España activa
- Acceso aprobado a la Product Advertising API
- Credenciales de API (Access Key ID y Secret Access Key)

## 🔑 Configuración de Credenciales

### 1. Obtener Acceso a la API

1. Ve a [Amazon Associates España](https://affiliate-program.amazon.es/)
2. Inicia sesión con tu cuenta
3. Navega a **Tools** > **Product Advertising API**
4. Solicita acceso a la API
5. Espera la aprobación (puede tomar 24-48 horas)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Amazon Product Advertising API
VITE_AMAZON_ACCESS_KEY=tu_access_key_id_aqui
VITE_AMAZON_SECRET_KEY=tu_secret_access_key_aqui
VITE_AMAZON_ASSOCIATE_TAG=explorashop18-21
```

### 3. Configurar el Archivo de Configuración

Copia `src/config/amazon.example.ts` como `src/config/amazon.ts` y actualiza las credenciales:

```typescript
export const AMAZON_API_CONFIG = {
  ACCESS_KEY: import.meta.env.VITE_AMAZON_ACCESS_KEY || '',
  SECRET_KEY: import.meta.env.VITE_AMAZON_SECRET_KEY || '',
  ASSOCIATE_TAG: import.meta.env.VITE_AMAZON_ASSOCIATE_TAG || 'explorashop18-21',
  REGION: 'eu-west-1',
  MARKETPLACE: 'ES',
  HOST: 'webservices.amazon.es'
};
```

## 🏗️ Arquitectura del Sistema

### Componentes Principales

- **`amazonApi.ts`** - Configuración y tipos de la API
- **`useAmazonProducts.ts`** - Hook personalizado para buscar productos
- **`AmazonProductButton.tsx`** - Componente para mostrar productos individuales
- **`RecommendedProducts.tsx`** - Grid de productos recomendados

### Flujo de Datos

1. **Hook `useAmazonProducts`** se inicializa
2. **`searchProducts()`** se ejecuta automáticamente
3. **Productos simulados** se cargan (en producción: llamada real a la API)
4. **Componente `RecommendedProducts`** renderiza los productos
5. **Cada producto** se muestra con `AmazonProductButton`

## 🎯 Uso en Blog Posts

### Integración Automática

El componente `RecommendedProducts` se integra automáticamente en el blog post "Mascotas en Barcos de Alquiler":

```tsx
<RecommendedProducts 
  category="mascotas náuticas"
  title="🛒 PRODUCTOS RECOMENDADOS PARA TU MASCOTA NÁUTICA"
  subtitle="Equipamiento profesional verificado por expertos"
/>
```

### Personalización

Puedes personalizar cada instancia:

```tsx
<RecommendedProducts 
  category="chalecos salvavidas"
  title="🦺 CHALECOS SALVAVIDAS CERTIFICADOS"
  subtitle="Seguridad máxima para tu mascota"
  className="my-8"
/>
```

## 🔧 Funcionalidades

### ✅ Características Implementadas

- **Búsqueda automática** de productos al cargar
- **Estados de loading** con spinners animados
- **Manejo de errores** con reintentos
- **Grid responsive** que se adapta a diferentes pantallas
- **Variantes de botones** (primary, secondary, outline)
- **Información completa** del producto (precio, reviews, disponibilidad)
- **Enlaces de afiliado** automáticos con tu tag

### 🚧 Limitaciones Actuales

- **Productos simulados** - En producción se conectaría a la API real
- **Firma de API simplificada** - Para producción se necesita implementar AWS Signature V4
- **Rate limiting** - No implementado (importante para producción)

## 🚀 Implementación en Producción

### 1. Implementar Firma Real de AWS

```typescript
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';

export const generateSignature = async (params: any): Promise<string> => {
  const signer = new SignatureV4({
    credentials: {
      accessKeyId: AMAZON_API_CONFIG.ACCESS_KEY,
      secretAccessKey: AMAZON_API_CONFIG.SECRET_KEY,
    },
    region: AMAZON_API_CONFIG.REGION,
    service: 'ProductAdvertisingAPI',
    sha256: Sha256,
  });
  
  // Implementar firma completa aquí
};
```

### 2. Llamadas Reales a la API

```typescript
const searchProducts = async (keywords: string) => {
  const response = await fetch(AMAZON_API_ENDPOINTS.SEARCH_ITEMS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `AWS4-HMAC-SHA256 ${await generateSignature(params)}`,
    },
    body: JSON.stringify({
      ...DEFAULT_SEARCH_PARAMS,
      Keywords: keywords,
    }),
  });
  
  const data: AmazonProductResponse = await response.json();
  setProducts(data.SearchResult.Items);
};
```

### 3. Rate Limiting y Caching

```typescript
import { useMemo } from 'react';

const cachedProducts = useMemo(() => {
  // Implementar cache local para evitar llamadas repetidas
  return products;
}, [products]);
```

## 📊 Monitoreo y Analytics

### Métricas Importantes

- **Click-through rate** de productos
- **Conversiones** por categoría
- **Productos más populares**
- **Rendimiento** por tag de afiliado

### Implementación de Tracking

```typescript
const trackProductClick = (product: AmazonProductItem) => {
  // Google Analytics
  gtag('event', 'product_click', {
    product_id: product.ASIN,
    product_name: product.Title,
    category: 'mascotas_nauticas',
    value: product.Offers?.Listings?.[0]?.Price?.Amount || 0,
  });
  
  // Facebook Pixel
  fbq('track', 'ViewContent', {
    content_ids: [product.ASIN],
    content_name: product.Title,
    content_category: 'mascotas_nauticas',
    value: product.Offers?.Listings?.[0]?.Price?.Amount || 0,
    currency: 'EUR',
  });
};
```

## 🛡️ Seguridad y Mejores Prácticas

### ✅ Hacer

- Usar variables de entorno para credenciales
- Implementar rate limiting
- Validar respuestas de la API
- Manejar errores de forma segura
- Usar HTTPS en producción

### ❌ No Hacer

- Hardcodear credenciales
- Exponer credenciales en el frontend
- Ignorar límites de la API
- No validar datos de entrada
- Usar HTTP en producción

## 🔍 Troubleshooting

### Problemas Comunes

1. **"Credenciales no configuradas"**
   - Verifica que las variables de entorno estén definidas
   - Reinicia el servidor de desarrollo

2. **"Error al cargar productos"**
   - Verifica la conectividad a internet
   - Revisa los logs del navegador

3. **Productos no se muestran**
   - Verifica que el hook se esté ejecutando
   - Revisa la consola para errores

### Logs de Debug

```typescript
console.log('API Config:', AMAZON_API_CONFIG);
console.log('Products:', products);
console.log('Loading:', loading);
console.log('Error:', error);
```

## 📚 Recursos Adicionales

- [Documentación oficial de Amazon PA-API](https://webservices.amazon.com/paapi5/documentation/)
- [Guía de Amazon Associates](https://affiliate-program.amazon.es/)
- [AWS Signature V4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)

## 🎯 Próximos Pasos

1. **Configurar credenciales** reales de Amazon
2. **Implementar firma** real de AWS
3. **Conectar a la API** real de Amazon
4. **Agregar más categorías** de productos
5. **Implementar analytics** y tracking
6. **Optimizar rendimiento** con caching

---

**¿Necesitas ayuda?** [Contacta con nuestro equipo](https://www.boattrip-planner.com/contacto) para soporte técnico.
