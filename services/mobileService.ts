import {
  MobileAppConfig,
  OfflineData,
  LocationService,
  PushNotificationService,
  MobileAnalytics,
  Coordinates,
  NavigationData,
  SyncStatus,
  PendingChange,
  PushNotification,
  CustomEvent,
  DeviceInfo,
  NetworkStatus,
  BatteryStatus,
  AppState
} from '../types/mobile';

import { apiService } from './apiService';

// Configuración por defecto para aplicaciones móviles
const DEFAULT_MOBILE_CONFIG: MobileAppConfig = {
  ios: {
    bundleId: 'com.boattripplanner.ios',
    minimumVersion: '14.0',
    targetVersion: '17.0',
    capabilities: [],
    permissions: [],
    frameworks: []
  },
  android: {
    packageName: 'com.boattripplanner.android',
    minimumSdk: 24,
    targetSdk: 34,
    permissions: [],
    features: [],
    libraries: []
  },
  shared: {
    apiEndpoint: process.env.REACT_APP_API_URL || 'https://api.boattrip-planner.com',
    websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || 'wss://api.boattrip-planner.com/ws',
    pushNotificationServer: process.env.REACT_APP_PUSH_SERVER || 'https://push.boattrip-planner.com',
    analyticsEndpoint: process.env.REACT_APP_ANALYTICS_URL || 'https://analytics.boattrip-planner.com',
    offlineStorageLimit: 100 * 1024 * 1024, // 100MB
    syncInterval: 5 * 60 * 1000, // 5 minutos
    maxOfflineDays: 30,
    imageCacheSize: 50 * 1024 * 1024, // 50MB
    locationAccuracy: 10, // metros
    locationUpdateInterval: 30 * 1000 // 30 segundos
  }
};

class MobileService {
  private config: MobileAppConfig;
  private offlineData: OfflineData | null = null;
  private locationService: LocationService | null = null;
  private pushService: PushNotificationService | null = null;
  private analytics: MobileAnalytics | null = null;
  private syncTimer: NodeJS.Timeout | null = null;
  private locationWatcher: number | null = null;
  private networkStatus: NetworkStatus = 'disconnected';
  private batteryStatus: BatteryStatus = 'discharging';
  private appState: AppState = 'active';

  constructor(config: MobileAppConfig = DEFAULT_MOBILE_CONFIG) {
    this.config = config;
    this.initializeServices();
  }

  // ===== INICIALIZACIÓN DE SERVICIOS =====
  private async initializeServices(): Promise<void> {
    try {
      await this.initializeOfflineStorage();
      await this.initializeLocationService();
      await this.initializePushNotifications();
      await this.initializeAnalytics();
      this.startSyncTimer();
      this.startNetworkMonitoring();
      this.startBatteryMonitoring();
      this.startAppStateMonitoring();
    } catch (error) {
      console.error('Error initializing mobile services:', error);
    }
  }

  // ===== SINCRONIZACIÓN OFFLINE =====
  private async initializeOfflineStorage(): Promise<void> {
    try {
      // Verificar si IndexedDB está disponible
      if (!window.indexedDB) {
        throw new Error('IndexedDB not supported');
      }

      // Inicializar datos offline
      this.offlineData = {
        boats: [],
        itineraries: [],
        weather: [],
        userPreferences: {
          language: navigator.language || 'es',
          currency: 'EUR',
          units: 'metric',
          notifications: {
            weatherAlerts: true,
            bookingReminders: true,
            itineraryUpdates: true,
            promotionalOffers: false
          },
          privacy: {
            locationSharing: false,
            analyticsTracking: true,
            crashReporting: true
          },
          accessibility: {
            highContrast: false,
            largeText: false,
            reduceMotion: false
          }
        },
        lastSync: new Date(),
        syncStatus: SyncStatus.IDLE,
        pendingChanges: []
      };

      // Cargar datos existentes
      await this.loadOfflineData();
    } catch (error) {
      console.error('Error initializing offline storage:', error);
    }
  }

  private async loadOfflineData(): Promise<void> {
    try {
      const stored = localStorage.getItem('boattrip_offline_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.offlineData = {
          ...parsed,
          lastSync: new Date(parsed.lastSync),
          pendingChanges: parsed.pendingChanges.map((change: any) => ({
            ...change,
            timestamp: new Date(change.timestamp)
          }))
        };
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }

  private async saveOfflineData(): Promise<void> {
    try {
      if (this.offlineData) {
        localStorage.setItem('boattrip_offline_data', JSON.stringify(this.offlineData));
      }
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  async syncData(): Promise<void> {
    if (!this.offlineData) return;

    try {
      this.offlineData.syncStatus = SyncStatus.SYNCING;

      // Sincronizar cambios pendientes
      await this.syncPendingChanges();

      // Descargar datos actualizados
      await this.downloadOfflineData();

      // Actualizar estado
      this.offlineData.lastSync = new Date();
      this.offlineData.syncStatus = SyncStatus.SUCCESS;

      await this.saveOfflineData();
    } catch (error) {
      console.error('Error syncing data:', error);
      this.offlineData.syncStatus = SyncStatus.ERROR;
      await this.saveOfflineData();
    }
  }

  private async syncPendingChanges(): Promise<void> {
    if (!this.offlineData?.pendingChanges.length) return;

    for (const change of this.offlineData.pendingChanges) {
      try {
        switch (change.type) {
          case 'create':
            await this.createOfflineEntity(change.entity, change.data);
            break;
          case 'update':
            await this.updateOfflineEntity(change.entity, change.data);
            break;
          case 'delete':
            await this.deleteOfflineEntity(change.entity, change.data);
            break;
        }

        // Remover cambio exitoso
        this.offlineData.pendingChanges = this.offlineData.pendingChanges.filter(
          c => c.id !== change.id
        );
      } catch (error) {
        console.error(`Error syncing change ${change.id}:`, error);
        change.retryCount++;
      }
    }
  }

  private async downloadOfflineData(): Promise<void> {
    if (!this.offlineData) return;

    try {
      // Descargar barcos
      const boatsResponse = await apiService.get('/boats', { limit: 100 });
      if (boatsResponse.success && boatsResponse.data) {
        this.offlineData.boats = boatsResponse.data.boats || [];
      }

      // Descargar itinerarios
      const itinerariesResponse = await apiService.get('/itineraries', { limit: 50 });
      if (itinerariesResponse.success && itinerariesResponse.data) {
        this.offlineData.itineraries = itinerariesResponse.data.itineraries || [];
      }

      // Descargar datos meteorológicos
      const weatherResponse = await apiService.get('/weather/forecast', { days: 7 });
      if (weatherResponse.success && weatherResponse.data) {
        this.offlineData.weather = weatherResponse.data.forecasts || [];
      }
    } catch (error) {
      console.error('Error downloading offline data:', error);
    }
  }

  // ===== SERVICIO DE UBICACIÓN =====
  private async initializeLocationService(): Promise<void> {
    try {
      this.locationService = {
        currentLocation: null,
        lastKnownLocation: null,
        locationHistory: [],
        isTracking: false,
        accuracy: this.config.shared.locationAccuracy,
        permissions: {
          ios: { whenInUse: false, always: false, background: false },
          android: { fine: false, coarse: false, background: false }
        }
      };

      // Solicitar permisos de ubicación
      await this.requestLocationPermissions();
    } catch (error) {
      console.error('Error initializing location service:', error);
    }
  }

  private async requestLocationPermissions(): Promise<void> {
    try {
      if ('geolocation' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'granted') {
          this.startLocationTracking();
        } else if (permission.state === 'prompt') {
          // Solicitar permiso
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.handleLocationUpdate(position);
              this.startLocationTracking();
            },
            (error) => {
              console.error('Location permission denied:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        }
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
    }
  }

  private startLocationTracking(): void {
    if (!this.locationService || this.locationService.isTracking) return;

    try {
      this.locationService.isTracking = true;
      
      this.locationWatcher = navigator.geolocation.watchPosition(
        (position) => this.handleLocationUpdate(position),
        (error) => console.error('Location tracking error:', error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  private handleLocationUpdate(position: GeolocationPosition): void {
    if (!this.locationService) return;

    const coordinates: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy || undefined,
      timestamp: new Date(position.timestamp)
    };

    this.locationService.currentLocation = coordinates;
    this.locationService.lastKnownLocation = coordinates;

    // Agregar al historial
    this.locationService.locationHistory.push({
      coordinates,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
      timestamp: new Date(position.timestamp)
    });

    // Limitar historial a 1000 entradas
    if (this.locationService.locationHistory.length > 1000) {
      this.locationService.locationHistory = this.locationService.locationHistory.slice(-1000);
    }

    // Enviar ubicación al servidor si hay conexión
    if (this.networkStatus === 'connected') {
      this.sendLocationToServer(coordinates);
    }
  }

  private async sendLocationToServer(coordinates: Coordinates): Promise<void> {
    try {
      await apiService.post('/location/update', {
        coordinates,
        timestamp: coordinates.timestamp.toISOString()
      });
    } catch (error) {
      console.error('Error sending location to server:', error);
    }
  }

  // ===== NOTIFICACIONES PUSH =====
  private async initializePushNotifications(): Promise<void> {
    try {
      this.pushService = {
        isEnabled: false,
        permissions: {
          ios: { alert: false, badge: false, sound: false, critical: false },
          android: { notifications: false, highPriority: false }
        },
        deviceToken: null,
        topics: [],
        notifications: [],
        settings: {
          weatherAlerts: true,
          bookingReminders: true,
          itineraryUpdates: true,
          promotionalOffers: false,
          systemUpdates: true,
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00'
          }
        }
      };

      // Verificar soporte para notificaciones
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        await this.requestPushPermissions();
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private async requestPushPermissions(): Promise<void> {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.pushService!.isEnabled = true;
        await this.registerPushServiceWorker();
        await this.subscribeToPushNotifications();
      }
    } catch (error) {
      console.error('Error requesting push permissions:', error);
    }
  }

  private async registerPushServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/sw-push.js');
      console.log('Push service worker registered:', registration);
    } catch (error) {
      console.error('Error registering push service worker:', error);
    }
  }

  private async subscribeToPushNotifications(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.config.shared.pushNotificationServer)
      });

      this.pushService!.deviceToken = subscription.toJSON();
      
      // Enviar token al servidor
      await apiService.post('/push/register', {
        deviceToken: this.pushService!.deviceToken,
        platform: this.getPlatform(),
        topics: this.pushService!.topics
      });
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // ===== ANALÍTICAS MÓVILES =====
  private async initializeAnalytics(): Promise<void> {
    try {
      this.analytics = {
        appUsage: {
          sessionDuration: 0,
          sessionsPerDay: 0,
          timeInApp: 0,
          screenViews: [],
          featureUsage: [],
          retention: {
            day1: 0,
            day7: 0,
            day30: 0,
            day90: 0,
            cohort: []
          }
        },
        userBehavior: {
          navigationPaths: [],
          searchQueries: [],
          interactions: [],
          preferences: [],
          conversions: []
        },
        performance: {
          appLaunchTime: 0,
          screenLoadTime: 0,
          apiResponseTime: 0,
          memoryUsage: 0,
          batteryUsage: 0,
          networkUsage: {
            bytesReceived: 0,
            bytesSent: 0,
            requestsCount: 0,
            averageResponseTime: 0,
            errorRate: 0
          }
        },
        errors: {
          crashes: [],
          exceptions: [],
          networkErrors: [],
          syncErrors: []
        },
        customEvents: []
      };

      this.startAnalyticsTracking();
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  private startAnalyticsTracking(): void {
    // Medir tiempo de inicio de la app
    this.analytics!.performance.appLaunchTime = performance.now();

    // Trackear vistas de pantalla
    this.trackScreenView('app_launch');

    // Trackear uso de características
    this.trackFeatureUsage('app_launch');
  }

  trackScreenView(screenName: string, parameters: Record<string, any> = {}): void {
    if (!this.analytics) return;

    this.analytics.appUsage.screenViews.push({
      screenName,
      timestamp: new Date(),
      duration: 0,
      parameters
    });

    // Enviar al servidor si hay conexión
    if (this.networkStatus === 'connected') {
      this.sendAnalyticsEvent('screen_view', {
        screen_name: screenName,
        ...parameters
      });
    }
  }

  trackFeatureUsage(featureName: string): void {
    if (!this.analytics) return;

    const existingFeature = this.analytics.appUsage.featureUsage.find(
      f => f.featureName === featureName
    );

    if (existingFeature) {
      existingFeature.usageCount++;
      existingFeature.lastUsed = new Date();
    } else {
      this.analytics.appUsage.featureUsage.push({
        featureName,
        usageCount: 1,
        lastUsed: new Date(),
        averageSessionTime: 0
      });
    }
  }

  trackCustomEvent(name: string, parameters: Record<string, any> = {}): void {
    if (!this.analytics) return;

    const event: CustomEvent = {
      name,
      parameters,
      timestamp: new Date(),
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };

    this.analytics.customEvents.push(event);

    // Enviar al servidor si hay conexión
    if (this.networkStatus === 'connected') {
      this.sendAnalyticsEvent(name, parameters);
    }
  }

  private async sendAnalyticsEvent(name: string, parameters: Record<string, any>): Promise<void> {
    try {
      await apiService.post('/analytics/event', {
        event: name,
        parameters,
        timestamp: new Date().toISOString(),
        platform: this.getPlatform(),
        deviceInfo: await this.getDeviceInfo()
      });
    } catch (error) {
      console.error('Error sending analytics event:', error);
    }
  }

  // ===== MONITOREO DE ESTADO =====
  private startSyncTimer(): void {
    this.syncTimer = setInterval(() => {
      if (this.networkStatus === 'connected') {
        this.syncData();
      }
    }, this.config.shared.syncInterval);
  }

  private startNetworkMonitoring(): void {
    if ('navigator' in window && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkStatus = () => {
        if (connection.effectiveType === '4g' || connection.effectiveType === '3g') {
          this.networkStatus = 'cellular';
        } else if (connection.effectiveType === 'wifi') {
          this.networkStatus = 'wifi';
        } else {
          this.networkStatus = 'disconnected';
        }
      };

      connection.addEventListener('change', updateNetworkStatus);
      updateNetworkStatus();
    }
  }

  private startBatteryMonitoring(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          if (battery.charging) {
            this.batteryStatus = battery.level === 1 ? 'full' : 'charging';
          } else {
            this.batteryStatus = battery.level < 0.2 ? 'low' : 'discharging';
          }
        };

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        updateBatteryStatus();
      });
    }
  }

  private startAppStateMonitoring(): void {
    document.addEventListener('visibilitychange', () => {
      this.appState = document.hidden ? 'background' : 'active';
      
      if (this.appState === 'active') {
        this.trackCustomEvent('app_resumed');
      } else {
        this.trackCustomEvent('app_backgrounded');
      }
    });
  }

  // ===== MÉTODOS PÚBLICOS =====
  async getOfflineData(): Promise<OfflineData | null> {
    return this.offlineData;
  }

  async getCurrentLocation(): Promise<Coordinates | null> {
    return this.locationService?.currentLocation || null;
  }

  async getLocationHistory(): Promise<Coordinates[]> {
    return this.locationService?.locationHistory.map(entry => entry.coordinates) || [];
  }

  async getPushNotifications(): Promise<PushNotification[]> {
    return this.pushService?.notifications || [];
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    if (!this.pushService) return;

    const notification = this.pushService.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  async subscribeToTopic(topic: string): Promise<void> {
    if (!this.pushService) return;

    if (!this.pushService.topics.includes(topic)) {
      this.pushService.topics.push(topic);
      
      // Enviar al servidor
      if (this.networkStatus === 'connected') {
        await apiService.post('/push/subscribe', { topic });
      }
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    if (!this.pushService) return;

    this.pushService.topics = this.pushService.topics.filter(t => t !== topic);
    
    // Enviar al servidor
    if (this.networkStatus === 'connected') {
      await apiService.post('/push/unsubscribe', { topic });
    }
  }

  async getAnalytics(): Promise<MobileAnalytics | null> {
    return this.analytics;
  }

  async clearOfflineData(): Promise<void> {
    if (this.offlineData) {
      this.offlineData.boats = [];
      this.offlineData.itineraries = [];
      this.offlineData.weather = [];
      this.offlineData.pendingChanges = [];
      await this.saveOfflineData();
    }
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    return {
      platform: this.getPlatform(),
      version: navigator.appVersion,
      model: this.getDeviceModel(),
      manufacturer: this.getDeviceManufacturer(),
      screenSize: `${screen.width}x${screen.height}`,
      memory: (navigator as any).deviceMemory || 0,
      storage: 0, // No disponible en web
      networkType: this.networkStatus,
      batteryLevel: 0 // No disponible en web
    };
  }

  // ===== MÉTODOS DE UTILIDAD =====
  private getPlatform(): 'ios' | 'android' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'android'; // Por defecto
  }

  private getDeviceModel(): string {
    const userAgent = navigator.userAgent;
    // Lógica para detectar modelo del dispositivo
    return 'Unknown';
  }

  private getDeviceManufacturer(): string {
    const userAgent = navigator.userAgent;
    // Lógica para detectar fabricante
    return 'Unknown';
  }

  private getUserId(): string | undefined {
    // Obtener ID de usuario del contexto
    return undefined;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('boattrip_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('boattrip_session_id', sessionId);
    }
    return sessionId;
  }

  private async createOfflineEntity(entity: string, data: any): Promise<void> {
    // Implementar creación de entidad offline
  }

  private async updateOfflineEntity(entity: string, data: any): Promise<void> {
    // Implementar actualización de entidad offline
  }

  private async deleteOfflineEntity(entity: string, data: any): Promise<void> {
    // Implementar eliminación de entidad offline
  }

  // ===== LIMPIEZA =====
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    if (this.locationWatcher) {
      navigator.geolocation.clearWatch(this.locationWatcher);
    }
  }
}

// Instancia singleton del servicio móvil
export const mobileService = new MobileService();

export type { MobileAppConfig, OfflineData, LocationService, PushNotificationService, MobileAnalytics }; 