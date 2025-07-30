// config/analytics.ts
// Configuración de analytics para evitar errores 405

export const ANALYTICS_CONFIG = {
  // Endpoints de analytics
  endpoints: {
    events: '/api/analytics/events',
    pageviews: '/api/analytics/pageviews',
    sessions: '/api/analytics/sessions'
  },
  
  // Configuración por entorno
  environment: {
    development: {
      enabled: false,
      simulateSuccess: true,
      logErrors: false
    },
    production: {
      enabled: true,
      simulateSuccess: false,
      logErrors: true
    }
  },
  
  // Configuración de retry
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2
  },
  
  // Configuración de batch
  batch: {
    enabled: true,
    maxSize: 10,
    flushIntervalMs: 5000
  }
};

// Detectar entorno
export const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('vercel.app');
};

export const isProduction = () => {
  return !isDevelopment();
};

// Obtener configuración del entorno actual
export const getAnalyticsConfig = () => {
  return isDevelopment() 
    ? ANALYTICS_CONFIG.environment.development 
    : ANALYTICS_CONFIG.environment.production;
};

// Verificar si analytics está habilitado
export const isAnalyticsEnabled = () => {
  const config = getAnalyticsConfig();
  return config.enabled;
};

// Función para hacer requests de analytics con manejo de errores
export const makeAnalyticsRequest = async (
  endpoint: string, 
  data: any, 
  retryCount: number = 0
): Promise<boolean> => {
  const config = getAnalyticsConfig();
  
  // Si analytics está deshabilitado, simular éxito
  if (!config.enabled) {
    return true;
  }
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      return true;
    }
    
    // Si no es exitoso y tenemos reintentos disponibles
    if (retryCount < ANALYTICS_CONFIG.retry.maxAttempts) {
      const delay = ANALYTICS_CONFIG.retry.delayMs * Math.pow(ANALYTICS_CONFIG.retry.backoffMultiplier, retryCount);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return makeAnalyticsRequest(endpoint, data, retryCount + 1);
    }
    
    // Si se agotaron los reintentos, loggear error si está habilitado
    if (config.logErrors) {
      console.warn(`Analytics request failed after ${retryCount} retries:`, endpoint);
    }
    
    return false;
    
  } catch (error) {
    // Si hay error de red y tenemos reintentos disponibles
    if (retryCount < ANALYTICS_CONFIG.retry.maxAttempts) {
      const delay = ANALYTICS_CONFIG.retry.delayMs * Math.pow(ANALYTICS_CONFIG.retry.backoffMultiplier, retryCount);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return makeAnalyticsRequest(endpoint, data, retryCount + 1);
    }
    
    // Si se agotaron los reintentos, loggear error si está habilitado
    if (config.logErrors) {
      console.warn(`Analytics network error after ${retryCount} retries:`, error);
    }
    
    return false;
  }
};

// Función para simular éxito en desarrollo
export const simulateAnalyticsSuccess = (): boolean => {
  const config = getAnalyticsConfig();
  return config.simulateSuccess;
};

// Función para loggear errores de analytics
export const logAnalyticsError = (message: string, error?: any): void => {
  const config = getAnalyticsConfig();
  
  if (config.logErrors) {
    if (error) {
      console.warn(`Analytics: ${message}`, error);
    } else {
      console.warn(`Analytics: ${message}`);
    }
  }
}; 