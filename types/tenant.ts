// Tipos para el sistema Multi-tenancy de BoatTrip Planner
// Base para transformar la aplicación en plataforma SaaS

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain?: string;
  customDomain?: string;
  settings: TenantSettings;
  subscription: Subscription;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'suspended' | 'cancelled';
}

export interface TenantSettings {
  branding: BrandingSettings;
  features: FeatureSettings;
  pricing: PricingSettings;
  integrations: IntegrationSettings;
  limits: TenantLimits;
}

export interface BrandingSettings {
  logo: string;
  favicon: string;
  colors: ColorScheme;
  customDomain: string;
  companyName: string;
  contactEmail: string;
  phoneNumber?: string;
  address?: string;
  website?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
}

export interface FeatureSettings {
  aiEnabled: boolean;
  weatherApi: boolean;
  analytics: boolean;
  whiteLabel: boolean;
  customIntegrations: boolean;
  prioritySupport: boolean;
  advancedReports: boolean;
  apiAccess: boolean;
  mobileApp: boolean;
  offlineMode: boolean;
}

export interface PricingSettings {
  plan: SubscriptionPlan;
  customPricing: boolean;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  discount?: number;
}

export interface IntegrationSettings {
  stripe: StripeSettings;
  googleAnalytics?: GoogleAnalyticsSettings;
  emailProvider?: EmailProviderSettings;
  crm?: CRMSettings;
  bookingSystem?: BookingSystemSettings;
}

export interface StripeSettings {
  customerId: string;
  subscriptionId: string;
  paymentMethodId?: string;
  invoiceSettings: InvoiceSettings;
}

export interface InvoiceSettings {
  autoAdvance: boolean;
  collectionMethod: 'charge_automatically' | 'send_invoice';
  daysUntilDue?: number;
  defaultPaymentMethod?: string;
}

export interface GoogleAnalyticsSettings {
  trackingId: string;
  enhancedEcommerce: boolean;
  customDimensions: Record<string, string>;
}

export interface EmailProviderSettings {
  provider: 'sendgrid' | 'mailgun' | 'ses';
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface CRMSettings {
  provider: 'salesforce' | 'hubspot' | 'pipedrive';
  apiKey: string;
  syncEnabled: boolean;
  customFields: Record<string, string>;
}

export interface BookingSystemSettings {
  provider: 'calendly' | 'acuity' | 'custom';
  apiKey?: string;
  webhookUrl?: string;
  syncEnabled: boolean;
}

export interface TenantLimits {
  users: number;
  boats: number;
  apiCalls: number;
  storage: number; // MB
  customDomains: number;
  integrations: number;
  reports: number;
  exports: number;
}

export interface Subscription {
  id: string;
  tenantId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  features: Feature[];
  usage: UsageMetrics;
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise' | 'custom';

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  limit?: number;
  usage?: number;
}

export interface UsageMetrics {
  users: {
    total: number;
    active: number;
    limit: number;
  };
  boats: {
    total: number;
    limit: number;
  };
  apiCalls: {
    current: number;
    limit: number;
    resetDate: Date;
  };
  storage: {
    used: number; // MB
    limit: number; // MB
  };
  recommendations: {
    generated: number;
    limit: number;
  };
  weatherApi: {
    calls: number;
    limit: number;
  };
}

// Enums para roles y permisos
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  profile: UserProfile;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface UserProfile {
  avatar?: string;
  phone?: string;
  position?: string;
  department?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'auto';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  types: {
    recommendations: boolean;
    weather: boolean;
    system: boolean;
    billing: boolean;
  };
}

// Tipos para analytics y métricas
export interface AnalyticsData {
  tenantId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    revenue: RevenueMetrics;
    users: UserMetrics;
    boats: BoatMetrics;
    weather: WeatherMetrics;
    performance: PerformanceMetrics;
  };
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  growth: number;
  churn: number;
  ltv: number;
  cac: number;
  projections: RevenueProjection[];
}

export interface RevenueProjection {
  date: Date;
  projectedRevenue: number;
  confidence: number;
  factors: string[];
}

export interface UserMetrics {
  total: number;
  active: number;
  new: number;
  churn: number;
  engagement: number;
  retention: number;
}

export interface BoatMetrics {
  total: number;
  popular: BoatModel[];
  recommendations: number;
  conversions: number;
  averageRating: number;
}

export interface WeatherMetrics {
  apiUsage: number;
  accuracy: number;
  impact: number;
  cost: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  uptime: number;
  errors: number;
}

// Tipos para el sistema de pagos
export interface PaymentMethod {
  id: string;
  tenantId: string;
  type: 'card' | 'bank_account' | 'sepa_debit';
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  currency: string;
}

// Tipos para auditoría y logs
export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Tipos para configuración global
export interface GlobalConfig {
  features: {
    multiTenancy: boolean;
    whiteLabel: boolean;
    apiAccess: boolean;
    mobileApp: boolean;
  };
  limits: {
    maxTenants: number;
    maxUsersPerTenant: number;
    maxBoatsPerTenant: number;
    maxApiCallsPerMonth: number;
  };
  pricing: {
    plans: Record<SubscriptionPlan, PlanDetails>;
    currency: string;
    billingCycles: ('monthly' | 'yearly')[];
  };
}

export interface PlanDetails {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: TenantLimits;
  popular?: boolean;
} 