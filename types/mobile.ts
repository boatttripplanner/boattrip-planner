// Tipos para las Aplicaciones Móviles de BoatTrip Planner
// Sistema nativo iOS y Android con funcionalidades avanzadas

// ===== CONFIGURACIÓN DE APLICACIONES MÓVILES =====
export interface MobileAppConfig {
  ios: IOSConfig;
  android: AndroidConfig;
  shared: SharedMobileConfig;
}

export interface IOSConfig {
  bundleId: string;
  appStoreId?: string;
  minimumVersion: string;
  targetVersion: string;
  capabilities: IOSCapability[];
  permissions: IOSPermission[];
  frameworks: string[];
}

export interface AndroidConfig {
  packageName: string;
  playStoreId?: string;
  minimumSdk: number;
  targetSdk: number;
  permissions: AndroidPermission[];
  features: AndroidFeature[];
  libraries: string[];
}

export interface SharedMobileConfig {
  apiEndpoint: string;
  websocketUrl: string;
  pushNotificationServer: string;
  analyticsEndpoint: string;
  offlineStorageLimit: number;
  syncInterval: number;
  maxOfflineDays: number;
  imageCacheSize: number;
  locationAccuracy: number;
  locationUpdateInterval: number;
}

// ===== CAPACIDADES Y PERMISOS =====
export enum IOSCapability {
  PUSH_NOTIFICATIONS = 'push-notifications',
  BACKGROUND_MODES = 'background-modes',
  LOCATION_SERVICES = 'location-services',
  CAMERA = 'camera',
  PHOTO_LIBRARY = 'photo-library',
  MICROPHONE = 'microphone',
  BLUETOOTH = 'bluetooth',
  NETWORK_EXTENSION = 'network-extension',
  HEALTH_KIT = 'health-kit',
  ARKIT = 'arkit'
}

export enum AndroidFeature {
  CAMERA = 'android.hardware.camera',
  LOCATION = 'android.hardware.location',
  BLUETOOTH = 'android.hardware.bluetooth',
  WIFI = 'android.hardware.wifi',
  SENSORS = 'android.hardware.sensors',
  NFC = 'android.hardware.nfc',
  TELEPHONY = 'android.hardware.telephony'
}

export interface IOSPermission {
  name: string;
  usageDescription: string;
  required: boolean;
  category: 'privacy' | 'location' | 'media' | 'system';
}

export interface AndroidPermission {
  name: string;
  description: string;
  required: boolean;
  category: 'dangerous' | 'normal' | 'signature';
}

// ===== SINCRONIZACIÓN OFFLINE =====
export interface OfflineData {
  boats: OfflineBoat[];
  itineraries: OfflineItinerary[];
  weather: OfflineWeather[];
  userPreferences: OfflineUserPreferences;
  lastSync: Date;
  syncStatus: SyncStatus;
  pendingChanges: PendingChange[];
}

export interface OfflineBoat {
  id: string;
  brand: string;
  model: string;
  category: string;
  length: number;
  capacity: number;
  price: number;
  features: string[];
  images: string[];
  availability: OfflineAvailability[];
  lastUpdated: Date;
}

export interface OfflineItinerary {
  id: string;
  title: string;
  description: string;
  route: OfflineRoutePoint[];
  duration: number;
  distance: number;
  weatherConditions: string[];
  difficulty: string;
  pointsOfInterest: OfflinePOI[];
  lastUpdated: Date;
}

export interface OfflineWeather {
  location: string;
  coordinates: Coordinates;
  forecast: OfflineWeatherForecast[];
  current: OfflineCurrentWeather;
  lastUpdated: Date;
}

export interface OfflineRoutePoint {
  latitude: number;
  longitude: number;
  name?: string;
  description?: string;
  type: 'start' | 'waypoint' | 'destination' | 'anchor';
  estimatedTime?: number;
}

export interface OfflinePOI {
  id: string;
  name: string;
  type: 'marina' | 'restaurant' | 'beach' | 'lighthouse' | 'historical';
  coordinates: Coordinates;
  description: string;
  rating: number;
  images: string[];
}

export interface OfflineAvailability {
  startDate: string;
  endDate: string;
  price: number;
  isAvailable: boolean;
}

export interface OfflineWeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  conditions: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  visibility: number;
}

export interface OfflineCurrentWeather {
  temperature: number;
  conditions: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}

export interface OfflineUserPreferences {
  language: string;
  currency: string;
  units: 'metric' | 'imperial';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'boat' | 'itinerary' | 'weather' | 'preferences';
  data: any;
  timestamp: Date;
  retryCount: number;
}

export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  CONFLICT = 'conflict'
}

// ===== FUNCIONALIDADES GPS Y UBICACIÓN =====
export interface LocationService {
  currentLocation: Coordinates | null;
  lastKnownLocation: Coordinates | null;
  locationHistory: LocationHistoryEntry[];
  isTracking: boolean;
  accuracy: number;
  permissions: LocationPermissions;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: Date;
}

export interface LocationHistoryEntry {
  coordinates: Coordinates;
  speed?: number;
  heading?: number;
  activity?: string;
  timestamp: Date;
}

export interface LocationPermissions {
  ios: {
    whenInUse: boolean;
    always: boolean;
    background: boolean;
  };
  android: {
    fine: boolean;
    coarse: boolean;
    background: boolean;
  };
}

export interface NavigationData {
  currentRoute: NavigationRoute | null;
  nextWaypoint: NavigationWaypoint | null;
  estimatedArrival: Date | null;
  distanceRemaining: number;
  timeRemaining: number;
  speed: number;
  heading: number;
  alerts: NavigationAlert[];
}

export interface NavigationRoute {
  id: string;
  name: string;
  waypoints: NavigationWaypoint[];
  totalDistance: number;
  estimatedDuration: number;
  startLocation: Coordinates;
  endLocation: Coordinates;
  createdAt: Date;
}

export interface NavigationWaypoint {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: 'start' | 'waypoint' | 'destination';
  estimatedTime: number;
  distance: number;
  instructions: string;
  alerts: string[];
}

export interface NavigationAlert {
  id: string;
  type: 'weather' | 'traffic' | 'safety' | 'navigation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  coordinates?: Coordinates;
  timestamp: Date;
  acknowledged: boolean;
}

// ===== NOTIFICACIONES PUSH =====
export interface PushNotificationService {
  isEnabled: boolean;
  permissions: PushPermissions;
  deviceToken: string | null;
  topics: string[];
  notifications: PushNotification[];
  settings: PushNotificationSettings;
}

export interface PushPermissions {
  ios: {
    alert: boolean;
    badge: boolean;
    sound: boolean;
    critical: boolean;
  };
  android: {
    notifications: boolean;
    highPriority: boolean;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data: Record<string, any>;
  category: string;
  priority: 'low' | 'normal' | 'high';
  timestamp: Date;
  read: boolean;
  actioned: boolean;
  actions: PushNotificationAction[];
}

export interface PushNotificationAction {
  id: string;
  title: string;
  type: 'button' | 'text_input';
  destructive?: boolean;
  authenticationRequired?: boolean;
}

export interface PushNotificationSettings {
  weatherAlerts: boolean;
  bookingReminders: boolean;
  itineraryUpdates: boolean;
  promotionalOffers: boolean;
  systemUpdates: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

// ===== ANALÍTICAS MÓVILES =====
export interface MobileAnalytics {
  appUsage: AppUsageMetrics;
  userBehavior: UserBehaviorMetrics;
  performance: PerformanceMetrics;
  errors: ErrorMetrics;
  customEvents: CustomEvent[];
}

export interface AppUsageMetrics {
  sessionDuration: number;
  sessionsPerDay: number;
  timeInApp: number;
  screenViews: ScreenView[];
  featureUsage: FeatureUsage[];
  retention: RetentionMetrics;
}

export interface UserBehaviorMetrics {
  navigationPaths: NavigationPath[];
  searchQueries: SearchQuery[];
  interactions: UserInteraction[];
  preferences: UserPreference[];
  conversions: ConversionEvent[];
}

export interface PerformanceMetrics {
  appLaunchTime: number;
  screenLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  batteryUsage: number;
  networkUsage: NetworkUsage;
}

export interface ErrorMetrics {
  crashes: AppCrash[];
  exceptions: AppException[];
  networkErrors: NetworkError[];
  syncErrors: SyncError[];
}

export interface ScreenView {
  screenName: string;
  timestamp: Date;
  duration: number;
  parameters: Record<string, any>;
}

export interface FeatureUsage {
  featureName: string;
  usageCount: number;
  lastUsed: Date;
  averageSessionTime: number;
}

export interface RetentionMetrics {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  cohort: RetentionCohort[];
}

export interface NavigationPath {
  path: string[];
  frequency: number;
  averageTime: number;
  conversionRate: number;
}

export interface SearchQuery {
  query: string;
  frequency: number;
  results: number;
  clickThroughRate: number;
}

export interface UserInteraction {
  type: 'tap' | 'swipe' | 'scroll' | 'long_press';
  element: string;
  screen: string;
  timestamp: Date;
  parameters: Record<string, any>;
}

export interface UserPreference {
  category: string;
  value: any;
  timestamp: Date;
  source: 'user' | 'system' | 'inferred';
}

export interface ConversionEvent {
  type: 'booking' | 'subscription' | 'feature_upgrade' | 'social_share';
  value: number;
  currency: string;
  timestamp: Date;
  parameters: Record<string, any>;
}

export interface AppCrash {
  id: string;
  type: string;
  message: string;
  stackTrace: string;
  timestamp: Date;
  deviceInfo: DeviceInfo;
  appVersion: string;
}

export interface AppException {
  id: string;
  type: string;
  message: string;
  stackTrace: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface NetworkError {
  id: string;
  url: string;
  method: string;
  statusCode: number;
  errorMessage: string;
  timestamp: Date;
  retryCount: number;
}

export interface SyncError {
  id: string;
  entity: string;
  operation: string;
  errorMessage: string;
  timestamp: Date;
  data: any;
}

export interface CustomEvent {
  name: string;
  parameters: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface NetworkUsage {
  bytesReceived: number;
  bytesSent: number;
  requestsCount: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface RetentionCohort {
  cohort: string;
  size: number;
  retention: number[];
}

export interface DeviceInfo {
  platform: 'ios' | 'android';
  version: string;
  model: string;
  manufacturer: string;
  screenSize: string;
  memory: number;
  storage: number;
  networkType: string;
  batteryLevel: number;
}

// ===== CONFIGURACIÓN DE BUILD =====
export interface BuildConfig {
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  features: BuildFeature[];
  signing: SigningConfig;
  distribution: DistributionConfig;
}

export interface BuildFeature {
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface SigningConfig {
  ios: {
    teamId: string;
    bundleId: string;
    provisioningProfile: string;
    certificate: string;
  };
  android: {
    keystore: string;
    keyAlias: string;
    keyPassword: string;
    storePassword: string;
  };
}

export interface DistributionConfig {
  ios: {
    appStore: boolean;
    testFlight: boolean;
    enterprise: boolean;
  };
  android: {
    playStore: boolean;
    internalTesting: boolean;
    beta: boolean;
  };
}

// ===== TIPOS DE UTILIDAD =====
export type MobilePlatform = 'ios' | 'android';
export type AppState = 'active' | 'inactive' | 'background' | 'terminated';
export type NetworkStatus = 'connected' | 'disconnected' | 'wifi' | 'cellular';
export type BatteryStatus = 'charging' | 'discharging' | 'full' | 'low'; 