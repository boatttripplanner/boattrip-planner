// Tipos para la integración con Stripe
// Sistema de pagos para la plataforma SaaS

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  currency: string;
  taxRates: {
    [country: string]: string;
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: StripeAddress;
  metadata: {
    tenantId: string;
    userId: string;
    plan: string;
  };
  created: number;
  updated: number;
}

export interface StripeAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  metadata: {
    planType: string;
    features: string;
    limits: string;
  };
  created: number;
  updated: number;
}

export interface StripePrice {
  id: string;
  product: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    usage_type: 'licensed' | 'metered';
  };
  metadata: {
    planType: string;
    billingCycle: string;
    features: string;
  };
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  cancel_at?: number;
  canceled_at?: number;
  trial_start?: number;
  trial_end?: number;
  items: {
    data: StripeSubscriptionItem[];
  };
  metadata: {
    tenantId: string;
    planType: string;
    features: string;
  };
}

export interface StripeSubscriptionItem {
  id: string;
  subscription: string;
  price: StripePrice;
  quantity: number;
  metadata: {
    feature: string;
    limit: string;
  };
}

export interface StripeInvoice {
  id: string;
  customer: string;
  subscription?: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_paid: number;
  amount_due: number;
  currency: string;
  due_date?: number;
  paid_at?: number;
  lines: {
    data: StripeInvoiceLineItem[];
  };
  metadata: {
    tenantId: string;
    billingPeriod: string;
  };
}

export interface StripeInvoiceLineItem {
  id: string;
  amount: number;
  currency: string;
  description?: string;
  quantity?: number;
  unit_amount?: number;
  metadata: {
    feature: string;
    usage: string;
  };
}

export interface StripePaymentMethod {
  id: string;
  customer?: string;
  type: 'card' | 'bank_account' | 'sepa_debit' | 'ideal' | 'sofort';
  card?: {
    brand: string;
    country?: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    last4: string;
  };
  billing_details: {
    name?: string;
    email?: string;
    phone?: string;
    address?: StripeAddress;
  };
  metadata: {
    tenantId: string;
    userId: string;
  };
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  customer?: string;
  payment_method?: string;
  metadata: {
    tenantId: string;
    userId: string;
    planType: string;
  };
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

// Tipos para las respuestas de la API
export interface CreateCustomerRequest {
  email: string;
  name?: string;
  phone?: string;
  address?: StripeAddress;
  tenantId: string;
  userId: string;
  plan: string;
}

export interface CreateSubscriptionRequest {
  customerId: string;
  priceId: string;
  tenantId: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  priceId?: string;
  quantity?: number;
  metadata?: Record<string, string>;
  cancelAtPeriodEnd?: boolean;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  customerId?: string;
  paymentMethodId?: string;
  tenantId: string;
  userId: string;
  planType: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Enums para estados y tipos
export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  PAUSED = 'paused'
}

export enum PaymentStatus {
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  REQUIRES_ACTION = 'requires_action',
  PROCESSING = 'processing',
  REQUIRES_CAPTURE = 'requires_capture',
  CANCELED = 'canceled',
  SUCCEEDED = 'succeeded'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAID = 'paid',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void'
} 