// services/safariErrorHandlingService.ts
// Safari-specific error handling service

interface SafariErrorReport {
  id: string;
  error: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  safariVersion: string;
  isSafari: boolean;
  context?: Record<string, any>;
}

class SafariErrorHandlingService {
  private isSafari: boolean;
  private safariVersion: string;
  private errorQueue: SafariErrorReport[] = [];

  constructor() {
    this.isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    this.safariVersion = this.getSafariVersion();
    this.init();
  }

  private getSafariVersion(): string {
    if (!this.isSafari) return 'not-safari';
    
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    return match ? match[1] : 'unknown';
  }

  private init(): void {
    if (!this.isSafari) return;

    console.log(`Safari Error Handler inicializado - Versión: ${this.safariVersion}`);
    
    // Safari-specific error handlers
    this.setupSafariErrorHandlers();
    
    // Safari-specific performance monitoring
    this.setupSafariPerformanceMonitoring();
    
    // Safari-specific compatibility checks
    this.runSafariCompatibilityChecks();
  }

  private setupSafariErrorHandlers(): void {
    // Safari-specific JavaScript error handling
    window.addEventListener('error', (event) => {
      this.handleSafariError(
        event.error || new Error(event.message),
        event.filename,
        event.lineno,
        event.colno
      );
    });

    // Safari-specific promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
      this.handleSafariError(
        new Error(event.reason),
        'unhandledrejection',
        0,
        0
      );
    });

    // Safari-specific resource error handling
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleSafariResourceError(event.target as HTMLElement);
      }
    }, true);
  }

  private setupSafariPerformanceMonitoring(): void {
    if (!this.isSafari) return;

    // Safari-specific performance monitoring
    if ('PerformanceObserver' in window) {
      // Monitor Safari-specific performance issues
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          // Safari-specific performance thresholds
          if (entry.duration > 100) { // Safari is slower with certain operations
            console.warn('Safari performance issue detected:', entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask', 'measure'] });
    }

    // Safari-specific memory monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        
        // Safari has lower memory limits
        if (usedMB > limitMB * 0.7) { // 70% threshold for Safari
          console.warn('Safari memory usage high:', `${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`);
        }
      }, 30000);
    }
  }

  private runSafariCompatibilityChecks(): void {
    if (!this.isSafari) return;

    const checks = [
      { name: 'Service Worker', test: () => 'serviceWorker' in navigator },
      { name: 'IndexedDB', test: () => 'indexedDB' in window },
      { name: 'WebGL', test: () => 'WebGLRenderingContext' in window },
      { name: 'Fetch API', test: () => 'fetch' in window },
      { name: 'Promise', test: () => 'Promise' in window },
      { name: 'IntersectionObserver', test: () => 'IntersectionObserver' in window },
      { name: 'ResizeObserver', test: () => 'ResizeObserver' in window },
      { name: 'PerformanceObserver', test: () => 'PerformanceObserver' in window }
    ];

    const results = checks.map(check => ({
      feature: check.name,
      supported: check.test()
    }));

    const unsupported = results.filter(r => !r.supported);
    
    if (unsupported.length > 0) {
      console.warn('Safari compatibility issues detected:', unsupported);
      this.handleSafariCompatibilityIssues(unsupported);
    }
  }

  private handleSafariCompatibilityIssues(unsupported: Array<{feature: string, supported: boolean}>): void {
    // Apply Safari-specific polyfills or fallbacks
    unsupported.forEach(issue => {
      switch (issue.feature) {
        case 'IntersectionObserver':
          this.polyfillIntersectionObserver();
          break;
        case 'ResizeObserver':
          this.polyfillResizeObserver();
          break;
        case 'PerformanceObserver':
          this.polyfillPerformanceObserver();
          break;
      }
    });
  }

  private polyfillIntersectionObserver(): void {
    if (!window.IntersectionObserver) {
      window.IntersectionObserver = class IntersectionObserver {
        constructor(callback: any) {
          this.callback = callback;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      } as any;
    }
  }

  private polyfillResizeObserver(): void {
    if (!window.ResizeObserver) {
      window.ResizeObserver = class ResizeObserver {
        constructor(callback: any) {
          this.callback = callback;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      } as any;
    }
  }

  private polyfillPerformanceObserver(): void {
    if (!window.PerformanceObserver) {
      window.PerformanceObserver = class PerformanceObserver {
        constructor(callback: any) {
          this.callback = callback;
        }
        observe() {}
        disconnect() {}
      } as any;
    }
  }

  async handleSafariError(
    error: Error,
    filename?: string,
    lineno?: number,
    colno?: number,
    context?: Record<string, any>
  ): Promise<void> {
    if (!this.isSafari) return;

    const errorReport: SafariErrorReport = {
      id: crypto.randomUUID(),
      error: error.name,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      safariVersion: this.safariVersion,
      isSafari: true,
      context: {
        filename,
        lineno,
        colno,
        ...context
      }
    };

    // Safari-specific error categorization
    const severity = this.categorizeSafariError(error);
    
    console.error(`Safari Error (${severity}):`, errorReport);

    // Store error for potential reporting
    this.errorQueue.push(errorReport);

    // Safari-specific error recovery
    await this.attemptSafariErrorRecovery(error, severity);
  }

  private categorizeSafariError(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // Safari-specific error patterns
    if (errorName.includes('quotaexceedederror') || errorName.includes('memory')) {
      return 'critical'; // Safari memory issues
    }

    if (errorMessage.includes('webkit') || errorMessage.includes('safari')) {
      return 'high'; // Safari-specific errors
    }

    if (errorMessage.includes('serviceworker') || errorMessage.includes('indexeddb')) {
      return 'medium'; // PWA-related errors
    }

    return 'low';
  }

  private async attemptSafariErrorRecovery(error: Error, severity: string): Promise<void> {
    if (severity === 'critical') {
      // For critical Safari errors, try to reload the page
      console.log('Attempting Safari error recovery...');
      
      // Wait a bit before reloading to avoid infinite loops
      setTimeout(() => {
        if (this.errorQueue.length > 5) {
          console.log('Too many Safari errors, reloading page...');
          window.location.reload();
        }
      }, 5000);
    }
  }

  private handleSafariResourceError(element: HTMLElement): void {
    if (!this.isSafari) return;

    const errorReport: SafariErrorReport = {
      id: crypto.randomUUID(),
      error: 'SafariResourceError',
      message: `Safari failed to load resource: ${element.tagName}`,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      safariVersion: this.safariVersion,
      isSafari: true,
      context: {
        element: element.tagName,
        src: (element as any).src,
        href: (element as any).href
      }
    };

    console.warn('Safari resource error:', errorReport);
    this.errorQueue.push(errorReport);
  }

  // Public methods
  isSafariBrowser(): boolean {
    return this.isSafari;
  }

  getErrorQueue(): SafariErrorReport[] {
    return this.errorQueue;
  }

  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  async reportErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    try {
      // Send errors to analytics or error reporting service
      await fetch('/api/safari-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errors: this.errorQueue,
          safariVersion: this.safariVersion,
          timestamp: Date.now()
        })
      });

      this.clearErrorQueue();
    } catch (error) {
      console.error('Error reporting Safari errors:', error);
    }
  }
}

// Instancia singleton
const safariErrorHandlingService = new SafariErrorHandlingService();
export default safariErrorHandlingService; 