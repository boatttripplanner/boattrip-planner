// Tipos para la API RESTful de BoatTrip Planner
// Sistema de integraciones externas para la plataforma SaaS

// ===== AUTENTICACIÓN Y AUTORIZACIÓN =====
export interface ApiKey {
  id: string;
  key: string;
  name: string;
  tenantId: string;
  userId: string;
  permissions: ApiPermission[];
  rateLimit: RateLimit;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ApiPermission {
  resource: string;
  actions: string[];
  conditions?: PermissionCondition;
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

export interface AuthToken {
  token: string;
  type: 'bearer' | 'api_key';
  expiresAt: Date;
  scopes: string[];
}

// ===== REQUEST/RESPONSE BASE =====
export interface ApiRequest<T = any> {
  data?: T;
  metadata?: RequestMetadata;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
  pagination?: PaginationInfo;
}

export interface RequestMetadata {
  requestId: string;
  timestamp: Date;
  source: string;
  version: string;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Date;
  processingTime: number;
  rateLimitInfo?: RateLimitInfo;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}

// ===== ENDPOINTS DE BOAT MODELS =====
export interface BoatModelRequest {
  brand?: string;
  model?: string;
  category?: string;
  length?: {
    min?: number;
    max?: number;
  };
  capacity?: {
    min?: number;
    max?: number;
  };
  price?: {
    min?: number;
    max?: number;
  };
  features?: string[];
  availability?: {
    startDate?: string;
    endDate?: string;
    location?: string;
  };
}

export interface BoatModelResponse {
  id: string;
  brand: string;
  model: string;
  category: string;
  length: number;
  capacity: number;
  price: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  features: string[];
  specifications: BoatSpecifications;
  images: string[];
  availability: AvailabilityInfo;
  rating: number;
  reviews: number;
}

export interface BoatSpecifications {
  engine: string;
  fuelType: string;
  maxSpeed: number;
  cruisingSpeed: number;
  fuelCapacity: number;
  waterCapacity: number;
  beam: number;
  draft: number;
  year: number;
}

export interface AvailabilityInfo {
  isAvailable: boolean;
  nextAvailableDate?: string;
  locations: string[];
  pricing: {
    base: number;
    seasonal: Record<string, number>;
    special: Record<string, number>;
  };
}

// ===== ENDPOINTS DE ITINERARIOS =====
export interface ItineraryRequest {
  startLocation: string;
  endLocation?: string;
  duration: {
    days: number;
    hours?: number;
  };
  preferences: {
    experience: 'beginner' | 'intermediate' | 'expert';
    boatType?: string;
    budget?: {
      min: number;
      max: number;
    };
    activities?: string[];
    crewSize: number;
  };
  weather: {
    startDate: string;
    endDate: string;
    conditions?: string[];
  };
  constraints?: {
    maxDistance?: number;
    mustVisit?: string[];
    avoidAreas?: string[];
    specialRequirements?: string[];
  };
}

export interface ItineraryResponse {
  id: string;
  title: string;
  description: string;
  route: RouteSegment[];
  weather: WeatherForecast[];
  recommendations: BoatRecommendation[];
  cost: CostBreakdown;
  safety: SafetyInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteSegment {
  id: string;
  from: Location;
  to: Location;
  distance: number;
  duration: number;
  weather: WeatherInfo;
  activities: Activity[];
  stops: Stop[];
  warnings: string[];
}

export interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'port' | 'marina' | 'anchor' | 'destination';
  facilities: string[];
  rating: number;
}

export interface WeatherInfo {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  visibility: number;
  precipitation: number;
  conditions: string;
  safetyLevel: 'safe' | 'moderate' | 'dangerous';
}

export interface Activity {
  name: string;
  description: string;
  duration: number;
  cost: number;
  location: Location;
  requirements: string[];
}

export interface Stop {
  location: Location;
  duration: number;
  purpose: string;
  activities: Activity[];
}

export interface WeatherForecast {
  date: string;
  hourly: WeatherInfo[];
  summary: string;
  alerts: string[];
}

export interface BoatRecommendation {
  boat: BoatModelResponse;
  score: number;
  reasons: string[];
  availability: AvailabilityInfo;
  totalCost: number;
}

export interface CostBreakdown {
  boatRental: number;
  fuel: number;
  mooring: number;
  activities: number;
  insurance: number;
  total: number;
  currency: string;
}

export interface SafetyInfo {
  level: 'low' | 'medium' | 'high';
  concerns: string[];
  recommendations: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  type: 'coast_guard' | 'marina' | 'emergency' | 'local';
  phone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// ===== ENDPOINTS DE WEATHER =====
export interface WeatherRequest {
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  date: string;
  duration?: number;
  units?: 'metric' | 'imperial';
}

export interface WeatherResponse {
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  current: CurrentWeather;
  forecast: WeatherForecast[];
  marine: MarineConditions;
  alerts: WeatherAlert[];
  lastUpdated: Date;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  visibility: number;
  uvIndex: number;
  conditions: string;
  icon: string;
}

export interface MarineConditions {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  swellHeight: number;
  swellPeriod: number;
  swellDirection: number;
  waterTemperature: number;
  tideHeight: number;
  tideDirection: 'rising' | 'falling';
  currentSpeed: number;
  currentDirection: number;
}

export interface WeatherAlert {
  type: 'warning' | 'watch' | 'advisory';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  areas: string[];
}

// ===== ENDPOINTS DE ANALYTICS =====
export interface AnalyticsRequest {
  tenantId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  metrics: string[];
  filters?: Record<string, any>;
  groupBy?: string[];
}

export interface AnalyticsResponse {
  tenantId: string;
  period: string;
  data: AnalyticsData;
  summary: AnalyticsSummary;
  trends: TrendData[];
  generatedAt: Date;
}

export interface AnalyticsData {
  revenue: RevenueMetrics;
  users: UserMetrics;
  boats: BoatMetrics;
  weather: WeatherMetrics;
  performance: PerformanceMetrics;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalUsers: number;
  totalItineraries: number;
  averageRating: number;
  growthRate: number;
  topPerformingBoats: string[];
  mostPopularRoutes: string[];
}

export interface TrendData {
  date: string;
  value: number;
  change: number;
  changePercent: number;
}

// ===== ENDPOINTS DE WEBHOOKS =====
export interface WebhookRequest {
  url: string;
  events: WebhookEvent[];
  secret?: string;
  isActive: boolean;
  retryConfig: RetryConfig;
  headers?: Record<string, string>;
}

export interface WebhookEvent {
  type: string;
  version: string;
  description: string;
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface WebhookPayload<T = any> {
  id: string;
  event: string;
  timestamp: Date;
  data: T;
  metadata: WebhookMetadata;
}

export interface WebhookMetadata {
  tenantId: string;
  userId?: string;
  source: string;
  version: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  lastAttempt: Date;
  nextAttempt?: Date;
  responseCode?: number;
  responseBody?: string;
  error?: string;
}

// ===== ENDPOINTS DE INTEGRACIONES =====
export interface IntegrationRequest {
  type: 'booking_system' | 'crm' | 'accounting' | 'marketing' | 'analytics' | 'custom';
  name: string;
  description: string;
  config: IntegrationConfig;
  webhooks: WebhookRequest[];
  isActive: boolean;
}

export interface IntegrationConfig {
  apiUrl: string;
  apiKey?: string;
  credentials?: Record<string, string>;
  settings: Record<string, any>;
  mappings: DataMapping[];
}

export interface DataMapping {
  source: string;
  target: string;
  transformation?: string;
  required: boolean;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: Date;
  syncStatus: SyncStatus;
  errors: IntegrationError[];
}

export interface SyncStatus {
  totalRecords: number;
  syncedRecords: number;
  failedRecords: number;
  lastSyncTime: Date;
  nextSyncTime?: Date;
}

export interface IntegrationError {
  code: string;
  message: string;
  timestamp: Date;
  data?: any;
}

// ===== ENDPOINTS DE REPORTES =====
export interface ReportRequest {
  type: 'revenue' | 'usage' | 'performance' | 'custom';
  format: 'pdf' | 'csv' | 'json' | 'excel';
  filters: ReportFilters;
  schedule?: ReportSchedule;
  recipients?: string[];
}

export interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  tenants?: string[];
  users?: string[];
  boats?: string[];
  locations?: string[];
  custom?: Record<string, any>;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
}

export interface ReportResponse {
  id: string;
  type: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt: Date;
  metadata: ReportMetadata;
}

export interface ReportMetadata {
  generatedAt: Date;
  recordCount: number;
  fileSize: number;
  format: string;
  filters: ReportFilters;
}

// ===== ENDPOINTS DE BATCH OPERATIONS =====
export interface BatchRequest<T = any> {
  operations: BatchOperation<T>[];
  options?: BatchOptions;
}

export interface BatchOperation<T = any> {
  id: string;
  action: 'create' | 'update' | 'delete' | 'upsert';
  resource: string;
  data?: T;
  conditions?: Record<string, any>;
}

export interface BatchOptions {
  continueOnError: boolean;
  maxConcurrency: number;
  timeout: number;
  retryAttempts: number;
}

export interface BatchResponse {
  batchId: string;
  status: 'processing' | 'completed' | 'failed';
  results: BatchResult[];
  summary: BatchSummary;
}

export interface BatchResult {
  operationId: string;
  status: 'success' | 'error';
  data?: any;
  error?: ApiError;
}

export interface BatchSummary {
  total: number;
  successful: number;
  failed: number;
  processingTime: number;
}

// ===== ENDPOINTS DE SEARCH =====
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  sort?: SearchSort;
  pagination?: PaginationInfo;
  facets?: string[];
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  location?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
    max?: number;
  };
  availability?: {
    startDate?: string;
    endDate?: string;
  };
  features?: string[];
  custom?: Record<string, any>;
}

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchResponse<T = any> {
  results: T[];
  total: number;
  facets: SearchFacet[];
  suggestions: string[];
  pagination: PaginationInfo;
  searchTime: number;
}

export interface SearchFacet {
  field: string;
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
  selected: boolean;
}

// ===== ENDPOINTS DE NOTIFICACIONES =====
export interface NotificationRequest {
  type: 'email' | 'sms' | 'push' | 'webhook';
  recipient: string;
  template: string;
  data: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: Date;
}

export interface NotificationResponse {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

// ===== ENDPOINTS DE AUDIT =====
export interface AuditRequest {
  resource: string;
  action: string;
  userId?: string;
  tenantId?: string;
  startDate?: string;
  endDate?: string;
  pagination?: PaginationInfo;
}

export interface AuditResponse {
  logs: AuditLog[];
  pagination: PaginationInfo;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  tenantId: string;
  resource: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  error?: string;
}

// ===== ENDPOINTS DE HEALTH CHECK =====
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  version: string;
  uptime: number;
  services: ServiceHealth[];
  database: DatabaseHealth;
  external: ExternalHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  connections: number;
  maxConnections: number;
  error?: string;
}

export interface ExternalHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

// ===== ENUMS Y CONSTANTES =====
export enum ApiErrorCode {
  // Autenticación
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_API_KEY = 'INVALID_API_KEY',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validación
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Recursos
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // Servidor
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  
  // Integración
  INTEGRATION_ERROR = 'INTEGRATION_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  WEBHOOK_DELIVERY_FAILED = 'WEBHOOK_DELIVERY_FAILED'
}

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  BETA = 'beta'
}

export enum ContentType {
  JSON = 'application/json',
  XML = 'application/xml',
  FORM = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data'
}

// ===== UTILIDADES =====
export type ApiEndpoint = 
  | '/api/v1/boats'
  | '/api/v1/itineraries'
  | '/api/v1/weather'
  | '/api/v1/analytics'
  | '/api/v1/webhooks'
  | '/api/v1/integrations'
  | '/api/v1/reports'
  | '/api/v1/batch'
  | '/api/v1/search'
  | '/api/v1/notifications'
  | '/api/v1/audit'
  | '/api/v1/health';

export interface ApiConfig {
  baseUrl: string;
  version: ApiVersion;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export interface ApiClient {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
  upload<T>(endpoint: string, file: File, data?: any): Promise<ApiResponse<T>>;
} 