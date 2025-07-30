# 🧭 Guía de Solución de Problemas de Safari - BoatTrip Planner

## 🚨 Problema: No arranca en Safari

### 📋 Diagnóstico Inicial

#### 1. Verificar Versión de Safari
```javascript
// En la consola de Safari (Cmd + Option + C)
console.log(navigator.userAgent);
console.log(navigator.appVersion);
```

**Versiones Soportadas:**
- Safari 11.1+ (macOS)
- Safari iOS 11.1+ (iPhone/iPad)

#### 2. Verificar Configuración de Safari
- **Preferencias > Privacidad y Seguridad**
  - [ ] Deshabilitar "Prevenir seguimiento entre sitios"
  - [ ] Permitir "Cookies y datos de sitios web"
  - [ ] Deshabilitar "Bloquear todas las cookies"

- **Preferencias > Avanzado**
  - [ ] Marcar "Mostrar menú Desarrollo"
  - [ ] Habilitar "Permitir JavaScript"

#### 3. Verificar Extensiones
- Deshabilitar todas las extensiones temporalmente
- Probar en modo privado (Cmd + Shift + N)

### 🔧 Soluciones Específicas

#### Solución 1: Limpiar Cache y Datos
```bash
# En Safari:
# 1. Desarrollo > Vaciar Cachés (Cmd + Option + E)
# 2. Desarrollo > Vaciar todos los datos de sitios web
# 3. Reiniciar Safari
```

#### Solución 2: Verificar Configuración de JavaScript
```javascript
// Verificar si JavaScript está habilitado
console.log('JavaScript está funcionando');
console.log('Safari version:', navigator.userAgent);
```

#### Solución 3: Verificar Service Worker
```javascript
// En la consola de Safari
if ('serviceWorker' in navigator) {
  console.log('Service Worker soportado');
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service Workers registrados:', registrations);
  });
} else {
  console.log('Service Worker NO soportado');
}
```

#### Solución 4: Verificar IndexedDB
```javascript
// Verificar soporte de IndexedDB
if ('indexedDB' in window) {
  console.log('IndexedDB soportado');
} else {
  console.log('IndexedDB NO soportado');
}
```

### 🛠️ Herramientas de Diagnóstico

#### 1. Consola de Desarrollo de Safari
```bash
# Abrir consola de desarrollo
Cmd + Option + C

# Verificar errores
# Los errores aparecerán en rojo
```

#### 2. Inspector de Red
```bash
# Abrir inspector de red
Cmd + Option + R

# Verificar:
# - Código de estado HTTP
# - Tiempo de respuesta
# - Recursos bloqueados
```

#### 3. Inspector de Almacenamiento
```bash
# En la consola de desarrollo
# Pestaña "Storage" > IndexedDB
# Verificar si hay errores de almacenamiento
```

### 🚨 Errores Comunes y Soluciones

#### Error 1: "Service Worker registration failed"
**Síntomas:**
- La aplicación no carga completamente
- Errores en la consola sobre Service Worker

**Solución:**
```javascript
// Verificar permisos de Service Worker
navigator.permissions.query({name: 'notifications'}).then(result => {
  console.log('Permisos:', result.state);
});
```

#### Error 2: "IndexedDB error"
**Síntomas:**
- Errores de almacenamiento
- Datos no se guardan

**Solución:**
```javascript
// Limpiar IndexedDB
indexedDB.deleteDatabase('ErrorHandlingDB');
indexedDB.deleteDatabase('BoatTripPlannerDB');
```

#### Error 3: "Memory quota exceeded"
**Síntomas:**
- Safari se cuelga
- Rendimiento lento

**Solución:**
- Cerrar otras pestañas de Safari
- Reiniciar Safari
- Limpiar caché

#### Error 4: "JavaScript execution timeout"
**Síntomas:**
- La página no responde
- Spinner de carga infinito

**Solución:**
- Recargar la página (Cmd + R)
- Probar en modo privado
- Deshabilitar extensiones

### 🔍 Diagnóstico Avanzado

#### 1. Verificar Rendimiento
```javascript
// Medir tiempo de carga
const startTime = performance.now();
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log('Tiempo de carga:', loadTime + 'ms');
});
```

#### 2. Verificar Memoria
```javascript
// Verificar uso de memoria (si está disponible)
if ('memory' in performance) {
  const memory = performance.memory;
  console.log('Memoria usada:', memory.usedJSHeapSize / 1024 / 1024 + 'MB');
  console.log('Límite de memoria:', memory.jsHeapSizeLimit / 1024 / 1024 + 'MB');
}
```

#### 3. Verificar APIs Web
```javascript
// Verificar soporte de APIs críticas
const apis = {
  'Service Worker': 'serviceWorker' in navigator,
  'IndexedDB': 'indexedDB' in window,
  'Fetch': 'fetch' in window,
  'Promise': 'Promise' in window,
  'IntersectionObserver': 'IntersectionObserver' in window,
  'ResizeObserver': 'ResizeObserver' in window
};

console.table(apis);
```

### 📱 Problemas Específicos de iOS Safari

#### 1. Problemas de Zoom
```css
/* Asegurar que los inputs no causen zoom */
input, textarea, select {
  font-size: 16px !important;
}
```

#### 2. Problemas de Scroll
```css
/* Habilitar scroll suave en iOS */
body {
  -webkit-overflow-scrolling: touch;
}
```

#### 3. Problemas de Viewport
```html
<!-- Meta tag para iOS -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

### 🔄 Proceso de Recuperación

#### Paso 1: Diagnóstico Básico
1. Abrir Safari
2. Ir a `https://boattrip-planner.com`
3. Abrir consola de desarrollo (Cmd + Option + C)
4. Verificar errores en rojo

#### Paso 2: Limpieza
1. Vaciar caché (Cmd + Option + E)
2. Vaciar datos de sitios web
3. Reiniciar Safari

#### Paso 3: Verificación
1. Probar en modo privado
2. Deshabilitar extensiones
3. Verificar configuración de privacidad

#### Paso 4: Recuperación Avanzada
1. Resetear Safari completamente
2. Verificar actualizaciones de macOS
3. Contactar soporte si persiste

### 📞 Contacto de Soporte

Si los problemas persisten después de intentar todas las soluciones:

**Información a proporcionar:**
- Versión de Safari
- Versión de macOS/iOS
- Errores específicos de la consola
- Pasos para reproducir el problema
- Capturas de pantalla de errores

**Canales de soporte:**
- Email: soporte@boattrip-planner.com
- GitHub Issues: https://github.com/boattrip-planner/issues
- Discord: https://discord.gg/boattrip-planner

### 🔧 Configuración Recomendada para Safari

#### Configuración Óptima:
```javascript
// Configuración recomendada
const safariConfig = {
  javascript: true,
  cookies: 'all',
  tracking: false,
  extensions: 'minimal',
  cache: 'enabled',
  serviceWorker: 'enabled',
  indexedDB: 'enabled'
};
```

#### Meta Tags Específicos:
```html
<!-- Safari-specific meta tags -->
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-touch-fullscreen" content="yes">
```

---

**Nota:** Esta guía se actualiza regularmente con las últimas soluciones para problemas de Safari. Si encuentras un problema no documentado, por favor reporta el issue para que podamos agregarlo a esta guía. 