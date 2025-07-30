import {
  ApiResponse,
  ApiRequest,
  ApiError,
  ApiErrorCode,
  ApiVersion,
  ApiConfig,
  ApiClient,
  ApiKey,
  AuthToken,
  RateLimit,
  PaginationInfo,
  RateLimitInfo,
  RequestMetadata,
  ResponseMetadata,
  
  // Boat Models
  BoatModelRequest,
  BoatModelResponse,
  BoatSpecifications,
  AvailabilityInfo,
  
  // Itineraries
  ItineraryRequest,
  ItineraryResponse,
  RouteSegment,
  Location,
  WeatherInfo,
  Activity,
  Stop,
  WeatherForecast,
  BoatRecommendation,
  CostBreakdown,
  SafetyInfo,
  EmergencyContact,
  
  // Weather
  WeatherRequest,
  WeatherResponse,
  CurrentWeather,
  MarineConditions,
  WeatherAlert,
  
  // Analytics
  AnalyticsRequest,
  AnalyticsResponse,
  AnalyticsData,
  AnalyticsSummary,
  TrendData,
  
  // Webhooks
  WebhookRequest,
  WebhookEvent,
  WebhookPayload,
  WebhookMetadata,
  WebhookDelivery,
  
  // Integrations
  IntegrationRequest,
  IntegrationConfig,
  DataMapping,
  IntegrationStatus,
  SyncStatus,
  IntegrationError,
  
  // Reports
  ReportRequest,
  ReportResponse,
  ReportMetadata,
  
  // Batch Operations
  BatchRequest,
  BatchResponse,
  BatchSummary,
  
  // Search
  SearchRequest,
  SearchResponse,
  SearchFilters,
  SearchSort,
  SearchFacet,
  FacetValue,
  
  // Notifications
  NotificationRequest,
  NotificationResponse,
  
  // Audit
  AuditRequest,
  AuditResponse,
  AuditLog,
  
  // Health Check
  HealthCheckResponse,
  ServiceHealth,
  DatabaseHealth,
  ExternalHealth
} from '../types/api';

import { useTenant } from '../contexts/TenantContext';

// Configuración por defecto de la API
const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'https://api.boattrip-planner.com',
  version: ApiVersion.V1,
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'BoatTripPlanner-API-Client/1.0'
  }
};

// Clase principal del servicio de API
class ApiService implements ApiClient {
  private config: ApiConfig;
  private apiKey?: string;
  private authToken?: AuthToken;
  private rateLimitInfo?: RateLimitInfo;

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  // ===== CONFIGURACIÓN Y AUTENTICACIÓN =====
  
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.config.headers['Authorization'] = `Bearer ${apiKey}`;
  }

  setAuthToken(token: AuthToken): void {
    this.authToken = token;
    this.config.headers['Authorization'] = `${token.type} ${token.token}`;
  }

  getRateLimitInfo(): RateLimitInfo | undefined {
    return this.rateLimitInfo;
  }

  // ===== MÉTODOS HTTP PRINCIPALES =====

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>('GET', url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('POST', url, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('PUT', url, data);
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('PATCH', url, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('DELETE', url);
  }

  async upload<T>(endpoint: string, file: File, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }

    return this.request<T>('POST', url, formData, true);
  }

  // ===== ENDPOINTS DE BOAT MODELS =====

  async getBoatModels(request: BoatModelRequest): Promise<ApiResponse<BoatModelResponse[]>> {
    return this.get<BoatModelResponse[]>('/boats', request);
  }

  async getBoatModel(id: string): Promise<ApiResponse<BoatModelResponse>> {
    return this.get<BoatModelResponse>(`/boats/${id}`);
  }

  async createBoatModel(boat: Partial<BoatModelResponse>): Promise<ApiResponse<BoatModelResponse>> {
    return this.post<BoatModelResponse>('/boats', boat);
  }

  async updateBoatModel(id: string, updates: Partial<BoatModelResponse>): Promise<ApiResponse<BoatModelResponse>> {
    return this.put<BoatModelResponse>(`/boats/${id}`, updates);
  }

  async deleteBoatModel(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/boats/${id}`);
  }

  async getBoatAvailability(id: string, startDate: string, endDate: string): Promise<ApiResponse<AvailabilityInfo>> {
    return this.get<AvailabilityInfo>(`/boats/${id}/availability`, { startDate, endDate });
  }

  // ===== ENDPOINTS DE ITINERARIOS =====

  async createItinerary(request: ItineraryRequest): Promise<ApiResponse<ItineraryResponse>> {
    return this.post<ItineraryResponse>('/itineraries', request);
  }

  async getItinerary(id: string): Promise<ApiResponse<ItineraryResponse>> {
    return this.get<ItineraryResponse>(`/itineraries/${id}`);
  }

  async getItineraries(filters?: Record<string, any>): Promise<ApiResponse<ItineraryResponse[]>> {
    return this.get<ItineraryResponse[]>('/itineraries', filters);
  }

  async updateItinerary(id: string, updates: Partial<ItineraryResponse>): Promise<ApiResponse<ItineraryResponse>> {
    return this.put<ItineraryResponse>(`/itineraries/${id}`, updates);
  }

  async deleteItinerary(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/itineraries/${id}`);
  }

  async optimizeItinerary(id: string, preferences?: Record<string, any>): Promise<ApiResponse<ItineraryResponse>> {
    return this.post<ItineraryResponse>(`/itineraries/${id}/optimize`, preferences);
  }

  async exportItinerary(id: string, format: 'pdf' | 'gpx' | 'kml'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.get<{ downloadUrl: string }>(`/itineraries/${id}/export`, { format });
  }

  // ===== ENDPOINTS DE WEATHER =====

  async getWeather(request: WeatherRequest): Promise<ApiResponse<WeatherResponse>> {
    return this.get<WeatherResponse>('/weather', request);
  }

  async getWeatherForecast(location: string, days: number = 7): Promise<ApiResponse<WeatherForecast[]>> {
    return this.get<WeatherForecast[]>('/weather/forecast', { location, days });
  }

  async getMarineConditions(location: string): Promise<ApiResponse<MarineConditions>> {
    return this.get<MarineConditions>('/weather/marine', { location });
  }

  async getWeatherAlerts(location: string): Promise<ApiResponse<WeatherAlert[]>> {
    return this.get<WeatherAlert[]>('/weather/alerts', { location });
  }

  // ===== ENDPOINTS DE ANALYTICS =====

  async getAnalytics(request: AnalyticsRequest): Promise<ApiResponse<AnalyticsResponse>> {
    return this.post<AnalyticsResponse>('/analytics', request);
  }

  async getRevenueMetrics(tenantId: string, period: string): Promise<ApiResponse<AnalyticsData>> {
    return this.get<AnalyticsData>('/analytics/revenue', { tenantId, period });
  }

  async getUserMetrics(tenantId: string, period: string): Promise<ApiResponse<AnalyticsData>> {
    return this.get<AnalyticsData>('/analytics/users', { tenantId, period });
  }

  async getBoatMetrics(tenantId: string, period: string): Promise<ApiResponse<AnalyticsData>> {
    return this.get<AnalyticsData>('/analytics/boats', { tenantId, period });
  }

  async getPerformanceMetrics(tenantId: string, period: string): Promise<ApiResponse<AnalyticsData>> {
    return this.get<AnalyticsData>('/analytics/performance', { tenantId, period });
  }

  // ===== ENDPOINTS DE WEBHOOKS =====

  async createWebhook(request: WebhookRequest): Promise<ApiResponse<{ id: string }>> {
    return this.post<{ id: string }>('/webhooks', request);
  }

  async getWebhooks(): Promise<ApiResponse<WebhookRequest[]>> {
    return this.get<WebhookRequest[]>('/webhooks');
  }

  async updateWebhook(id: string, updates: Partial<WebhookRequest>): Promise<ApiResponse<WebhookRequest>> {
    return this.put<WebhookRequest>(`/webhooks/${id}`, updates);
  }

  async deleteWebhook(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/webhooks/${id}`);
  }

  async getWebhookDeliveries(webhookId: string): Promise<ApiResponse<WebhookDelivery[]>> {
    return this.get<WebhookDelivery[]>(`/webhooks/${webhookId}/deliveries`);
  }

  async retryWebhookDelivery(deliveryId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/webhooks/deliveries/${deliveryId}/retry`);
  }

  // ===== ENDPOINTS DE INTEGRACIONES =====

  async createIntegration(request: IntegrationRequest): Promise<ApiResponse<{ id: string }>> {
    return this.post<{ id: string }>('/integrations', request);
  }

  async getIntegrations(): Promise<ApiResponse<IntegrationStatus[]>> {
    return this.get<IntegrationStatus[]>('/integrations');
  }

  async getIntegration(id: string): Promise<ApiResponse<IntegrationStatus>> {
    return this.get<IntegrationStatus>(`/integrations/${id}`);
  }

  async updateIntegration(id: string, updates: Partial<IntegrationRequest>): Promise<ApiResponse<IntegrationStatus>> {
    return this.put<IntegrationStatus>(`/integrations/${id}`, updates);
  }

  async deleteIntegration(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/integrations/${id}`);
  }

  async syncIntegration(id: string): Promise<ApiResponse<SyncStatus>> {
    return this.post<SyncStatus>(`/integrations/${id}/sync`);
  }

  async testIntegration(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.post<{ success: boolean; message: string }>(`/integrations/${id}/test`);
  }

  // ===== ENDPOINTS DE REPORTES =====

  async generateReport(request: ReportRequest): Promise<ApiResponse<ReportResponse>> {
    return this.post<ReportResponse>('/reports', request);
  }

  async getReports(): Promise<ApiResponse<ReportResponse[]>> {
    return this.get<ReportResponse[]>('/reports');
  }

  async getReport(id: string): Promise<ApiResponse<ReportResponse>> {
    return this.get<ReportResponse>(`/reports/${id}`);
  }

  async downloadReport(id: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.get<{ downloadUrl: string }>(`/reports/${id}/download`);
  }

  async scheduleReport(request: ReportRequest): Promise<ApiResponse<{ id: string }>> {
    return this.post<{ id: string }>('/reports/schedule', request);
  }

  // ===== ENDPOINTS DE BATCH OPERATIONS =====

  async executeBatch<T>(request: BatchRequest<T>): Promise<ApiResponse<BatchResponse>> {
    return this.post<BatchResponse>('/batch', request);
  }

  async getBatchStatus(batchId: string): Promise<ApiResponse<BatchResponse>> {
    return this.get<BatchResponse>(`/batch/${batchId}`);
  }

  // ===== ENDPOINTS DE SEARCH =====

  async search<T>(request: SearchRequest): Promise<ApiResponse<SearchResponse<T>>> {
    return this.post<SearchResponse<T>>('/search', request);
  }

  async searchBoats(query: string, filters?: SearchFilters): Promise<ApiResponse<SearchResponse<BoatModelResponse>>> {
    return this.search<BoatModelResponse>({
      query,
      filters,
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
    });
  }

  async searchItineraries(query: string, filters?: SearchFilters): Promise<ApiResponse<SearchResponse<ItineraryResponse>>> {
    return this.search<ItineraryResponse>({
      query,
      filters,
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
    });
  }

  // ===== ENDPOINTS DE NOTIFICACIONES =====

  async sendNotification(request: NotificationRequest): Promise<ApiResponse<NotificationResponse>> {
    return this.post<NotificationResponse>('/notifications', request);
  }

  async getNotifications(): Promise<ApiResponse<NotificationResponse[]>> {
    return this.get<NotificationResponse[]>('/notifications');
  }

  async getNotification(id: string): Promise<ApiResponse<NotificationResponse>> {
    return this.get<NotificationResponse>(`/notifications/${id}`);
  }

  // ===== ENDPOINTS DE AUDIT =====

  async getAuditLogs(request: AuditRequest): Promise<ApiResponse<AuditResponse>> {
    return this.get<AuditResponse>('/audit', request);
  }

  async exportAuditLogs(request: AuditRequest, format: 'csv' | 'json'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.get<{ downloadUrl: string }>('/audit/export', { ...request, format });
  }

  // ===== ENDPOINTS DE HEALTH CHECK =====

  async getHealthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.get<HealthCheckResponse>('/health');
  }

  // ===== MÉTODOS PRIVADOS =====

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.config.baseUrl}/api/${this.config.version}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    isFormData: boolean = false
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const headers = { ...this.config.headers };
      
      if (isFormData) {
        delete headers['Content-Type']; // Let browser set it for FormData
      }

      const requestMetadata: RequestMetadata = {
        requestId,
        timestamp: new Date(),
        source: 'api-client',
        version: this.config.version
      };

      const response = await fetch(url, {
        method,
        headers,
        body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
        signal: AbortSignal.timeout(this.config.timeout)
      });

      const processingTime = Date.now() - startTime;

      // Extraer información de rate limiting de los headers
      this.extractRateLimitInfo(response);

      if (!response.ok) {
        const error = await this.parseError(response);
        return {
          success: false,
          error,
          metadata: {
            requestId,
            timestamp: new Date(),
            processingTime
          }
        };
      }

      const responseData = await response.json();
      
      const responseMetadata: ResponseMetadata = {
        requestId,
        timestamp: new Date(),
        processingTime,
        rateLimitInfo: this.rateLimitInfo
      };

      return {
        success: true,
        data: responseData,
        metadata: responseMetadata
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      const apiError: ApiError = {
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
        details: error
      };

      return {
        success: false,
        error: apiError,
        metadata: {
          requestId,
          timestamp: new Date(),
          processingTime
        }
      };
    }
  }

  private async parseError(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        code: errorData.code || ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: errorData.message || 'An error occurred',
        timestamp: new Date(),
        details: errorData.details
      };
    } catch {
      return {
        code: this.mapHttpStatusToErrorCode(response.status),
        message: `HTTP ${response.status}: ${response.statusText}`,
        timestamp: new Date()
      };
    }
  }

  private mapHttpStatusToErrorCode(status: number): string {
    switch (status) {
      case 400: return ApiErrorCode.VALIDATION_ERROR;
      case 401: return ApiErrorCode.UNAUTHORIZED;
      case 403: return ApiErrorCode.INSUFFICIENT_PERMISSIONS;
      case 404: return ApiErrorCode.RESOURCE_NOT_FOUND;
      case 409: return ApiErrorCode.RESOURCE_CONFLICT;
      case 429: return ApiErrorCode.RATE_LIMIT_EXCEEDED;
      case 500: return ApiErrorCode.INTERNAL_SERVER_ERROR;
      case 503: return ApiErrorCode.SERVICE_UNAVAILABLE;
      default: return ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  private extractRateLimitInfo(response: Response): void {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const limit = response.headers.get('X-RateLimit-Limit');

    if (remaining && reset && limit) {
      this.rateLimitInfo = {
        remaining: parseInt(remaining),
        reset: new Date(parseInt(reset) * 1000),
        limit: parseInt(limit)
      };
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ===== MÉTODOS DE UTILIDAD =====

  isRateLimited(): boolean {
    return this.rateLimitInfo ? this.rateLimitInfo.remaining <= 0 : false;
  }

  getTimeUntilReset(): number {
    if (!this.rateLimitInfo) return 0;
    return Math.max(0, this.rateLimitInfo.reset.getTime() - Date.now());
  }

  async waitForRateLimitReset(): Promise<void> {
    const waitTime = this.getTimeUntilReset();
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();

// Hook personalizado para usar el servicio de API con contexto de tenant
export function useApiService() {
  const { currentTenant, currentUser } = useTenant();
  
  // Configurar automáticamente el tenant y usuario en las requests
  const enhancedApiService = {
    ...apiService,
    async request<T>(method: string, url: string, data?: any, isFormData: boolean = false): Promise<ApiResponse<T>> {
      // Agregar headers de tenant y usuario si están disponibles
      if (currentTenant?.id) {
        apiService.config.headers['X-Tenant-ID'] = currentTenant.id;
      }
      if (currentUser?.id) {
        apiService.config.headers['X-User-ID'] = currentUser.id;
      }
      
      return apiService.request<T>(method, url, data, isFormData);
    }
  };

  return enhancedApiService;
}

export type { ApiService }; 