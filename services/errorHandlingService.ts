// services/errorHandlingService.ts
// Servicio de gestión de errores offline con sincronización automática

interface ErrorReport {
  id: string;
  error: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  synced: boolean;
}

interface PerformanceIssue {
  id: string;
  type: 'slow-load' | 'memory-leak' | 'cpu-spike' | 'network-timeout';
  metric: string;
  value: number;
  threshold: number;
  url: string;
  timestamp: number;
  sessionId: string;
  synced: boolean;
}

class ErrorHandlingService {
  private sessionId: string;
  private isOnline: boolean = navigator.onLine;
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceIssue[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private init(): void {
    // Escuchar cambios de conectividad
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncErrorReports();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Configurar global error handlers
    this.setupGlobalErrorHandlers();
    
    // Configurar performance monitoring
    this.setupPerformanceMonitoring();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Capturar errores de JavaScript
    window.addEventListener('error', (event) => {
      this.captureError(
        event.error || new Error(event.message),
        event.filename,
        event.lineno,
        event.colno
      );
    });

    // Capturar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason),
        'unhandledrejection',
        0,
        0
      );
    });

    // Capturar errores de recursos
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureResourceError(event.target as HTMLElement);
      }
    }, true);
  }

  private setupPerformanceMonitoring(): void {
    // Monitorear métricas de performance
    if ('PerformanceObserver' in window) {
      // Monitorear LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.startTime > 2500) { // LCP > 2.5s
          this.capturePerformanceIssue('slow-load', 'lcp', lastEntry.startTime, 2500);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitorear FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart - entry.startTime > 100) { // FID > 100ms
            this.capturePerformanceIssue('slow-load', 'fid', entry.processingStart - entry.startTime, 100);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitorear CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        if (clsValue > 0.1) { // CLS > 0.1
          this.capturePerformanceIssue('slow-load', 'cls', clsValue, 0.1);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitorear uso de memoria
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        
        if (usedMB > limitMB * 0.8) { // > 80% del límite
          this.capturePerformanceIssue('memory-leak', 'memory-usage', usedMB, limitMB * 0.8);
        }
      }, 30000); // Cada 30 segundos
    }
  }

  async captureError(
    error: Error,
    filename?: string,
    lineno?: number,
    colno?: number,
    context?: Record<string, any>
  ): Promise<void> {
    const errorReport: ErrorReport = {
      id: crypto.randomUUID(),
      error: error.name,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      severity: this.determineSeverity(error),
      context: {
        filename,
        lineno,
        colno,
        ...context
      },
      synced: false
    };

    // Guardar en IndexedDB
    await this.saveErrorReport(errorReport);

    // Enviar inmediatamente si está online
    if (this.isOnline) {
      await this.sendErrorReport(errorReport);
    } else {
      this.errorQueue.push(errorReport);
    }
  }

  private captureResourceError(element: HTMLElement): void {
    const errorReport: ErrorReport = {
      id: crypto.randomUUID(),
      error: 'ResourceError',
      message: `Failed to load resource: ${element.tagName}`,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      severity: 'low',
      context: {
        element: element.tagName,
        src: (element as any).src,
        href: (element as any).href
      },
      synced: false
    };

    this.saveErrorReport(errorReport);
  }

  async capturePerformanceIssue(
    type: PerformanceIssue['type'],
    metric: string,
    value: number,
    threshold: number
  ): Promise<void> {
    const performanceIssue: PerformanceIssue = {
      id: crypto.randomUUID(),
      type,
      metric,
      value,
      threshold,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      synced: false
    };

    // Guardar en IndexedDB
    await this.savePerformanceIssue(performanceIssue);

    // Enviar inmediatamente si está online
    if (this.isOnline) {
      await this.sendPerformanceIssue(performanceIssue);
    } else {
      this.performanceQueue.push(performanceIssue);
    }
  }

  private determineSeverity(error: Error): ErrorReport['severity'] {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // Errores críticos
    if (errorName.includes('syntax') || errorName.includes('reference')) {
      return 'critical';
    }

    // Errores altos
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'high';
    }

    // Errores medios
    if (errorMessage.includes('timeout') || errorMessage.includes('permission')) {
      return 'medium';
    }

    // Errores bajos por defecto
    return 'low';
  }

  private async saveErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['errorReports'], 'readwrite');
      const store = transaction.objectStore('errorReports');
      await store.add(errorReport);
    } catch (error) {
      console.error('Error guardando reporte de error:', error);
    }
  }

  private async savePerformanceIssue(performanceIssue: PerformanceIssue): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['performanceIssues'], 'readwrite');
      const store = transaction.objectStore('performanceIssues');
      await store.add(performanceIssue);
    } catch (error) {
      console.error('Error guardando issue de performance:', error);
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ErrorHandlingDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear stores
        if (!db.objectStoreNames.contains('errorReports')) {
          const errorStore = db.createObjectStore('errorReports', { keyPath: 'id' });
          errorStore.createIndex('timestamp', 'timestamp');
          errorStore.createIndex('severity', 'severity');
          errorStore.createIndex('synced', 'synced');
        }

        if (!db.objectStoreNames.contains('performanceIssues')) {
          const performanceStore = db.createObjectStore('performanceIssues', { keyPath: 'id' });
          performanceStore.createIndex('timestamp', 'timestamp');
          performanceStore.createIndex('type', 'type');
          performanceStore.createIndex('synced', 'synced');
        }
      };
    });
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      });

      // Marcar como sincronizado
      errorReport.synced = true;
      await this.updateErrorReport(errorReport);
    } catch (error) {
      console.error('Error enviando reporte de error:', error);
    }
  }

  private async sendPerformanceIssue(performanceIssue: PerformanceIssue): Promise<void> {
    try {
      await fetch('/api/performance-issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performanceIssue)
      });

      // Marcar como sincronizado
      performanceIssue.synced = true;
      await this.updatePerformanceIssue(performanceIssue);
    } catch (error) {
      console.error('Error enviando issue de performance:', error);
    }
  }

  private async updateErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['errorReports'], 'readwrite');
      const store = transaction.objectStore('errorReports');
      await store.put(errorReport);
    } catch (error) {
      console.error('Error actualizando reporte de error:', error);
    }
  }

  private async updatePerformanceIssue(performanceIssue: PerformanceIssue): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['performanceIssues'], 'readwrite');
      const store = transaction.objectStore('performanceIssues');
      await store.put(performanceIssue);
    } catch (error) {
      console.error('Error actualizando issue de performance:', error);
    }
  }

  private async syncErrorReports(): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Sincronizar reportes de errores pendientes
      const pendingErrors = await this.getPendingErrorReports();
      for (const errorReport of pendingErrors) {
        await this.sendErrorReport(errorReport);
      }

      // Sincronizar issues de performance pendientes
      const pendingPerformanceIssues = await this.getPendingPerformanceIssues();
      for (const performanceIssue of pendingPerformanceIssues) {
        await this.sendPerformanceIssue(performanceIssue);
      }
    } catch (error) {
      console.error('Error sincronizando reportes:', error);
    }
  }

  private async getPendingErrorReports(): Promise<ErrorReport[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['errorReports'], 'readonly');
      const store = transaction.objectStore('errorReports');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allReports = request.result;
          const pendingReports = allReports.filter((report: ErrorReport) => !report.synced);
          resolve(pendingReports);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo reportes de error pendientes:', error);
      return [];
    }
  }

  private async getPendingPerformanceIssues(): Promise<PerformanceIssue[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['performanceIssues'], 'readonly');
      const store = transaction.objectStore('performanceIssues');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allIssues = request.result;
          const pendingIssues = allIssues.filter((issue: PerformanceIssue) => !issue.synced);
          resolve(pendingIssues);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo issues de performance pendientes:', error);
      return [];
    }
  }

  // Métodos públicos para manejo de errores
  async handleAsyncError<T>(promise: Promise<T>, context?: Record<string, any>): Promise<T | null> {
    try {
      return await promise;
    } catch (error) {
      await this.captureError(error as Error, undefined, undefined, undefined, context);
      return null;
    }
  }

  async wrapAsyncFunction<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: Record<string, any>
  ): Promise<(...args: T) => Promise<R | null>> {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        await this.captureError(error as Error, undefined, undefined, undefined, context);
        return null;
      }
    };
  }
}

// Instancia singleton
const errorHandlingService = new ErrorHandlingService();
export default errorHandlingService; 