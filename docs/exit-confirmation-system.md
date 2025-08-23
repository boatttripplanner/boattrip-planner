# Sistema de Confirmación de Salida - BoatTrip Planner

## 🎯 **Descripción General**

El sistema de confirmación de salida está diseñado para proteger a los usuarios de perder datos importantes cuando intentan abandonar la página. Funciona en dos niveles:

1. **Navegación Externa**: Cerrar pestaña, navegar a otra URL, etc.
2. **Navegación Interna**: Cambiar de vista dentro de la aplicación SPA

## 🚀 **Cómo Funciona**

### **1. Detección de Datos Importantes**

El sistema se activa automáticamente cuando detecta que hay datos importantes en la aplicación:

```typescript
const hasImportantData = Boolean(
  recommendation?.text || 
  (activeChatSession?.history && activeChatSession.history.length > 0)
);
```

**Datos considerados importantes:**
- ✅ Recomendación generada por IA
- ✅ Historial de chat activo
- ✅ Formularios con datos ingresados

### **2. Navegación Externa (beforeunload)**

Para casos donde el usuario intenta cerrar la pestaña o navegar a otra URL:

```typescript
useBeforeUnloadOnly({
  message: '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
  enabled: hasImportantData
});
```

**Comportamiento:**
- Muestra el mensaje nativo del navegador
- El usuario puede cancelar o confirmar
- Funciona en todos los navegadores modernos

### **3. Navegación Interna (SPA)**

Para cambios de vista dentro de la aplicación:

```typescript
// El hook previene la navegación automáticamente
const handlePopState = (event: PopStateEvent) => {
  event.preventDefault();
  window.history.pushState(null, '', window.location.href);
  
  // Dispara evento personalizado
  const customEvent = new CustomEvent('navigation-confirm', {
    detail: { message, originalEvent: event }
  });
  window.dispatchEvent(customEvent);
};
```

**Comportamiento:**
- Previene la navegación automáticamente
- Muestra modal personalizado de confirmación
- Permite cancelar o confirmar la salida

## 🔧 **Componentes del Sistema**

### **Hook: `useBeforeUnloadOnly`**

```typescript
export const useBeforeUnloadOnly = (options: UseBeforeUnloadOptions = {}) => {
  const {
    message = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [message, enabled]);
};
```

### **Modal: `ExitConfirmationModal`**

```typescript
interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}
```

**Características:**
- 🎨 Diseño moderno y responsive
- ⚠️ Icono de advertencia
- 🔴 Botón de confirmación en rojo
- 🔘 Botón de cancelar en gris
- 📱 Compatible con móviles

## 📱 **Implementación en App.tsx**

### **Estado del Modal**

```typescript
const [showExitConfirmation, setShowExitConfirmation] = useState(false);
const [pendingNavigation, setPendingNavigation] = useState<{ view: AppView; slug: string | null } | null>(null);
```

### **Manejo de Eventos**

```typescript
// Escuchar eventos de confirmación de navegación
useEffect(() => {
  const handleNavigationConfirm = (event: CustomEvent) => {
    if (hasImportantData) {
      setShowExitConfirmation(true);
    }
  };

  window.addEventListener('navigation-confirm', handleNavigationConfirm as EventListener);
  return () => {
    window.removeEventListener('navigation-confirm', handleNavigationConfirm as EventListener);
  };
}, [hasImportantData]);
```

### **Funciones de Confirmación**

```typescript
const handleConfirmExit = () => {
  setShowExitConfirmation(false);
  setPendingNavigation(null);
  // Limpiar todos los datos importantes
  clearAppState();
};

const handleCancelExit = () => {
  setShowExitConfirmation(false);
  setPendingNavigation(null);
};
```

## 🎨 **Personalización del Modal**

### **Estilos CSS**

El modal usa Tailwind CSS con las siguientes clases:

```typescript
// Contenedor principal
"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"

// Modal
"bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-200 ease-out scale-100"

// Botones
"flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
"flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors duration-200"
```

### **Mensajes Personalizables**

```typescript
// Mensaje por defecto
message = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'

// Mensaje personalizado
<ExitConfirmationModal
  message="¡Atención! Tienes un plan de viaje sin guardar. ¿Quieres salir de todos modos?"
  // ... otros props
/>
```

## 🔄 **Flujo de Funcionamiento**

### **Escenario 1: Usuario con Datos Importantes**

1. **Usuario intenta cerrar pestaña**
   - `beforeunload` se dispara
   - Navegador muestra mensaje nativo
   - Usuario cancela → Se queda en la página
   - Usuario confirma → Pestaña se cierra

2. **Usuario intenta navegar internamente**
   - `popstate` se dispara
   - Navegación se previene
   - Modal personalizado se muestra
   - Usuario cancela → Se queda en la vista actual
   - Usuario confirma → Datos se limpian y navega

### **Escenario 2: Usuario sin Datos Importantes**

1. **Navegación libre**
   - No hay confirmaciones
   - Navegación normal
   - Sin interrupciones

## 🚨 **Casos de Uso**

### **✅ Cuándo Se Activa**

- Usuario ha generado una recomendación
- Usuario tiene chat activo con historial
- Usuario ha ingresado datos en formularios
- Usuario está en medio de una operación

### **❌ Cuándo No Se Activa**

- Página recién cargada
- Sin datos importantes
- Usuario ya confirmó salida
- Navegación programática (botones de la app)

## 🔧 **Mantenimiento y Extensión**

### **Añadir Nuevos Tipos de Datos Importantes**

```typescript
const hasImportantData = Boolean(
  recommendation?.text || 
  (activeChatSession?.history && activeChatSession.history.length > 0) ||
  userPreferences?.hasUnsavedChanges || // Nuevo tipo
  draftContent?.text // Nuevo tipo
);
```

### **Personalizar Mensajes por Contexto**

```typescript
const getExitMessage = () => {
  if (recommendation?.text) {
    return '¿Estás seguro de que quieres salir? Tu plan de viaje se perderá.';
  }
  if (activeChatSession?.history.length > 0) {
    return '¿Quieres salir? Tu conversación se perderá.';
  }
  return '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
};
```

### **Añadir Acciones Adicionales**

```typescript
const handleConfirmExit = () => {
  setShowExitConfirmation(false);
  
  // Guardar datos antes de salir
  if (recommendation?.text) {
    localStorage.setItem('draftRecommendation', recommendation.text);
  }
  
  // Limpiar estado
  clearAppState();
  
  // Navegar
  if (pendingNavigation) {
    setCurrentView(pendingNavigation.view);
    setCurrentBlogPostSlug(pendingNavigation.slug);
  }
};
```

## 📊 **Métricas y Analytics**

### **Eventos a Rastrear**

```typescript
// Usuario intenta salir
gtag('event', 'exit_attempt', {
  event_category: 'user_behavior',
  event_label: 'page_exit_attempt',
  value: hasImportantData ? 1 : 0
});

// Usuario confirma salida
gtag('event', 'exit_confirmed', {
  event_category: 'user_behavior',
  event_label: 'page_exit_confirmed',
  value: 1
});

// Usuario cancela salida
gtag('event', 'exit_cancelled', {
  event_category: 'user_behavior',
  event_label: 'page_exit_cancelled',
  value: 1
});
```

## 🎉 **Beneficios del Sistema**

### **Para el Usuario**
- ✅ **Protección de datos** - No pierde trabajo realizado
- ✅ **Experiencia consistente** - Confirmaciones claras
- ✅ **Control total** - Decide cuándo salir

### **Para la Aplicación**
- ✅ **Retención de usuarios** - Menos pérdidas accidentales
- ✅ **Calidad de datos** - Información más completa
- ✅ **UX mejorada** - Interacciones más seguras

### **Para el Negocio**
- ✅ **Mayor engagement** - Usuarios completan más planes
- ✅ **Mejor conversión** - Menos abandonos accidentales
- ✅ **Datos más valiosos** - Información completa de usuarios

---

**Sistema implementado en:** `App.tsx` + `hooks/useBeforeUnload.ts` + `components/ExitConfirmationModal.tsx`  
**Última actualización:** Diciembre 2024  
**Estado:** ✅ Funcionando completamente
