import {
  StripeConfig,
  StripeCustomer,
  StripeSubscription,
  StripePaymentIntent,
  StripePaymentMethod,
  StripeInvoice,
  CreateCustomerRequest,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CreatePaymentIntentRequest,
  PaymentResponse,
  SubscriptionStatus,
  PaymentStatus,
  InvoiceStatus
} from '../types/stripe';

// Configuración de Stripe
const STRIPE_CONFIG: StripeConfig = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  secretKey: process.env.REACT_APP_STRIPE_SECRET_KEY || 'sk_test_...',
  webhookSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET || 'whsec_...',
  currency: 'eur',
  taxRates: {
    'ES': 'txr_spanish_vat',
    'US': 'txr_us_tax',
    'GB': 'txr_uk_vat'
  }
};

class StripeService {
  private config: StripeConfig;
  private baseUrl: string;

  constructor(config: StripeConfig = STRIPE_CONFIG) {
    this.config = config;
    this.baseUrl = process.env.REACT_APP_API_URL || 'https://api.boattrip-planner.com';
  }

  // ===== GESTIÓN DE CLIENTES =====

  async createCustomer(request: CreateCustomerRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error creating customer');
      }

      return {
        success: true,
        data: data.customer
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_CREATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async getCustomer(customerId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error fetching customer');
      }

      return {
        success: true,
        data: data.customer
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async updateCustomer(customerId: string, updates: Partial<StripeCustomer>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error updating customer');
      }

      return {
        success: true,
        data: data.customer
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_UPDATE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  // ===== GESTIÓN DE SUSCRIPCIONES =====

  async createSubscription(request: CreateSubscriptionRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error creating subscription');
      }

      return {
        success: true,
        data: data.subscription
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_CREATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async getSubscription(subscriptionId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/subscriptions/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error fetching subscription');
      }

      return {
        success: true,
        data: data.subscription
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async updateSubscription(request: UpdateSubscriptionRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/subscriptions/${request.subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error updating subscription');
      }

      return {
        success: true,
        data: data.subscription
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_UPDATE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify({ cancelAtPeriodEnd })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error canceling subscription');
      }

      return {
        success: true,
        data: data.subscription
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_CANCEL_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  // ===== GESTIÓN DE PAGOS =====

  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/payment-intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error creating payment intent');
      }

      return {
        success: true,
        data: data.paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_INTENT_CREATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/payment-intents/${paymentIntentId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify({ paymentMethodId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error confirming payment intent');
      }

      return {
        success: true,
        data: data.paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_INTENT_CONFIRMATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  // ===== GESTIÓN DE MÉTODOS DE PAGO =====

  async getPaymentMethods(customerId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/customers/${customerId}/payment-methods`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error fetching payment methods');
      }

      return {
        success: true,
        data: data.paymentMethods
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_METHODS_FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/payment-methods/${paymentMethodId}/attach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify({ customerId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error attaching payment method');
      }

      return {
        success: true,
        data: data.paymentMethod
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_METHOD_ATTACH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  // ===== GESTIÓN DE FACTURAS =====

  async getInvoices(customerId: string, limit: number = 10): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/customers/${customerId}/invoices?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error fetching invoices');
      }

      return {
        success: true,
        data: data.invoices
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INVOICES_FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  async getInvoice(invoiceId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error fetching invoice');
      }

      return {
        success: true,
        data: data.invoice
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INVOICE_FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  // ===== WEBHOOKS =====

  async handleWebhook(payload: string, signature: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': signature
        },
        body: payload
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error processing webhook');
      }

      return {
        success: true,
        data: data.event
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'WEBHOOK_PROCESSING_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  // ===== UTILIDADES =====

  formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  }

  parseAmount(amount: string): number {
    return Math.round(parseFloat(amount) * 100);
  }

  isSubscriptionActive(status: string): boolean {
    return status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.TRIALING;
  }

  isPaymentSuccessful(status: string): boolean {
    return status === PaymentStatus.SUCCEEDED;
  }

  isInvoicePaid(status: string): boolean {
    return status === InvoiceStatus.PAID;
  }

  // ===== CONFIGURACIÓN =====

  getPublishableKey(): string {
    return this.config.publishableKey;
  }

  getCurrency(): string {
    return this.config.currency;
  }

  getTaxRate(country: string): string | undefined {
    return this.config.taxRates[country];
  }
}

// Instancia singleton del servicio
export const stripeService = new StripeService();

// Exportar tipos para uso externo
export type { StripeConfig, StripeCustomer, StripeSubscription, StripePaymentIntent }; 