// services/analyticsService.ts
// Servicio de analytics offline con sincronización automática

import { 
  ANALYTICS_CONFIG, 
  isDevelopment, 
  isProduction, 
  getAnalyticsConfig, 
  isAnalyticsEnabled, 
  makeAnalyticsRequest, 
  simulateAnalyticsSuccess, 
  logAnalyticsError 
} from '../config/analytics';

interface AnalyticsEvent {
  id: string;
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  properties?: Record<string, any>;
  synced: boolean;
}

interface PageView {
  id: string;
  path: string;
  title: string;
  referrer?: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  synced: boolean;
}

interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  events: number;
  userId?: string;
  synced: boolean;
}

class AnalyticsService {
  private sessionId: string;
  private currentSession: UserSession | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: AnalyticsEvent[] = [];
  private pageViewQueue: PageView[] = [];
  private sessionQueue: UserSession[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private init(): void {
    // Escuchar cambios de conectividad
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Iniciar sesión
    this.startSession();

    // Sincronizar datos pendientes
    this.syncData();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async startSession(): Promise<void> {
    this.currentSession = {
      id: this.sessionId,
      startTime: Date.now(),
      pageViews: 0,
      events: 0,
      synced: false
    };

    // Guardar en IndexedDB
    await this.saveSession(this.currentSession);
  }

  async trackEvent(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      id: crypto.randomUUID(),
      event,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      properties,
      synced: false
    };

    // Guardar en IndexedDB
    await this.saveEvent(analyticsEvent);

    // Actualizar contador de eventos de la sesión
    if (this.currentSession) {
      this.currentSession.events++;
      await this.updateSession(this.currentSession);
    }

    // Enviar inmediatamente si está online
    if (this.isOnline) {
      await this.sendEvent(analyticsEvent);
    } else {
      this.syncQueue.push(analyticsEvent);
    }
  }

  async trackPageView(path: string, title: string, referrer?: string): Promise<void> {
    const pageView: PageView = {
      id: crypto.randomUUID(),
      path,
      title,
      referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      synced: false
    };

    // Guardar en IndexedDB
    await this.savePageView(pageView);

    // Actualizar contador de page views de la sesión
    if (this.currentSession) {
      this.currentSession.pageViews++;
      await this.updateSession(this.currentSession);
    }

    // Enviar inmediatamente si está online
    if (this.isOnline) {
      await this.sendPageView(pageView);
    } else {
      this.pageViewQueue.push(pageView);
    }
  }

  async endSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      await this.updateSession(this.currentSession);

      // Enviar sesión completada
      if (this.isOnline) {
        await this.sendSession(this.currentSession);
      } else {
        this.sessionQueue.push(this.currentSession);
      }
    }
  }

  private async saveEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['analyticsEvents'], 'readwrite');
      const store = transaction.objectStore('analyticsEvents');
      await store.add(event);
    } catch (error) {
      console.error('Error guardando evento:', error);
    }
  }

  private async savePageView(pageView: PageView): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['pageViews'], 'readwrite');
      const store = transaction.objectStore('pageViews');
      await store.add(pageView);
    } catch (error) {
      console.error('Error guardando page view:', error);
    }
  }

  private async saveSession(session: UserSession): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      await store.add(session);
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  }

  private async updateSession(session: UserSession): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      await store.put(session);
    } catch (error) {
      console.error('Error actualizando sesión:', error);
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AnalyticsDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear stores
        if (!db.objectStoreNames.contains('analyticsEvents')) {
          const eventStore = db.createObjectStore('analyticsEvents', { keyPath: 'id' });
          eventStore.createIndex('timestamp', 'timestamp');
          eventStore.createIndex('synced', 'synced');
        }

        if (!db.objectStoreNames.contains('pageViews')) {
          const pageViewStore = db.createObjectStore('pageViews', { keyPath: 'id' });
          pageViewStore.createIndex('timestamp', 'timestamp');
          pageViewStore.createIndex('synced', 'synced');
        }

        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('startTime', 'startTime');
          sessionStore.createIndex('synced', 'synced');
        }
      };
    });
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Usar la nueva configuración de analytics
      if (isAnalyticsEnabled()) {
        const success = await makeAnalyticsRequest(ANALYTICS_CONFIG.endpoints.events, event);
        if (success) {
          event.synced = true;
          await this.updateEvent(event);
        }
      } else {
        // Si analytics está deshabilitado, simular éxito
        event.synced = true;
        await this.updateEvent(event);
      }
    } catch (error) {
      logAnalyticsError('Error sending event', error);
    }
  }

  private async sendPageView(pageView: PageView): Promise<void> {
    try {
      // Usar la nueva configuración de analytics
      if (isAnalyticsEnabled()) {
        const success = await makeAnalyticsRequest(ANALYTICS_CONFIG.endpoints.pageviews, pageView);
        if (success) {
          pageView.synced = true;
          await this.updatePageView(pageView);
        }
      } else {
        // Si analytics está deshabilitado, simular éxito
        pageView.synced = true;
        await this.updatePageView(pageView);
      }
    } catch (error) {
      logAnalyticsError('Error sending page view', error);
    }
  }

  private async sendSession(session: UserSession): Promise<void> {
    try {
      // Usar la nueva configuración de analytics
      if (isAnalyticsEnabled()) {
        const success = await makeAnalyticsRequest(ANALYTICS_CONFIG.endpoints.sessions, session);
        if (success) {
          session.synced = true;
          await this.updateSession(session);
        }
      } else {
        // Si analytics está deshabilitado, simular éxito
        session.synced = true;
        await this.updateSession(session);
      }
    } catch (error) {
      logAnalyticsError('Error sending session', error);
    }
  }

  private async updateEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['analyticsEvents'], 'readwrite');
      const store = transaction.objectStore('analyticsEvents');
      await store.put(event);
    } catch (error) {
      console.error('Error actualizando evento:', error);
    }
  }

  private async updatePageView(pageView: PageView): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['pageViews'], 'readwrite');
      const store = transaction.objectStore('pageViews');
      await store.put(pageView);
    } catch (error) {
      console.error('Error actualizando page view:', error);
    }
  }

  private async syncData(): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Sincronizar eventos pendientes
      const pendingEvents = await this.getPendingEvents();
      for (const event of pendingEvents) {
        await this.sendEvent(event);
      }

      // Sincronizar page views pendientes
      const pendingPageViews = await this.getPendingPageViews();
      for (const pageView of pendingPageViews) {
        await this.sendPageView(pageView);
      }

      // Sincronizar sesiones pendientes
      const pendingSessions = await this.getPendingSessions();
      for (const session of pendingSessions) {
        await this.sendSession(session);
      }
    } catch (error) {
      console.error('Error sincronizando analytics:', error);
    }
  }

  private async getPendingEvents(): Promise<AnalyticsEvent[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['analyticsEvents'], 'readonly');
      const store = transaction.objectStore('analyticsEvents');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allEvents = request.result;
          const pendingEvents = allEvents.filter((event: AnalyticsEvent) => !event.synced);
          resolve(pendingEvents);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo eventos pendientes:', error);
      return [];
    }
  }

  private async getPendingPageViews(): Promise<PageView[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['pageViews'], 'readonly');
      const store = transaction.objectStore('pageViews');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allPageViews = request.result;
          const pendingPageViews = allPageViews.filter((pageView: PageView) => !pageView.synced);
          resolve(pendingPageViews);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo page views pendientes:', error);
      return [];
    }
  }

  private async getPendingSessions(): Promise<UserSession[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allSessions = request.result;
          const pendingSessions = allSessions.filter((session: UserSession) => !session.synced);
          resolve(pendingSessions);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo sesiones pendientes:', error);
      return [];
    }
  }

  // Métodos públicos para tracking
  async trackButtonClick(buttonName: string, page: string): Promise<void> {
    await this.trackEvent('click', 'engagement', 'button_click', buttonName, undefined, { page });
  }

  async trackFormSubmission(formName: string, success: boolean): Promise<void> {
    await this.trackEvent('submit', 'engagement', 'form_submit', formName, success ? 1 : 0);
  }

  async trackNavigation(from: string, to: string): Promise<void> {
    await this.trackEvent('navigation', 'engagement', 'page_navigation', `${from} -> ${to}`);
  }

  async trackError(errorType: string, errorMessage: string): Promise<void> {
    await this.trackEvent('error', 'system', 'error_occurred', errorType, undefined, { message: errorMessage });
  }
}

// Instancia singleton
const analyticsService = new AnalyticsService();
export default analyticsService; 