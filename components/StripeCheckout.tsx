import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeService } from '../services/stripeService';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { CheckCircleIcon, AlertTriangleIcon } from './icons';

// Cargar Stripe
const stripePromise = loadStripe(stripeService.getPublishableKey());

interface StripeCheckoutProps {
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  customerEmail: string;
  onSuccess: (subscription: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

interface CheckoutFormProps {
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  customerEmail: string;
  onSuccess: (subscription: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  planId,
  planName,
  amount,
  currency,
  customerEmail,
  onSuccess,
  onError,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe no está disponible');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Crear o obtener cliente
      const customerResponse = await stripeService.createCustomer({
        email: customerEmail,
        name: customerEmail.split('@')[0], // Usar parte del email como nombre
        metadata: {
          planId,
          planName
        }
      });

      if (!customerResponse.success) {
        throw new Error(customerResponse.error?.message || 'Error al crear cliente');
      }

      const customer = customerResponse.data;

      // 2. Crear Payment Intent
      const paymentIntentResponse = await stripeService.createPaymentIntent({
        amount: amount * 100, // Stripe usa centavos
        currency: currency.toLowerCase(),
        customerId: customer.id,
        metadata: {
          planId,
          planName,
          customerEmail
        }
      });

      if (!paymentIntentResponse.success) {
        throw new Error(paymentIntentResponse.error?.message || 'Error al crear intención de pago');
      }

      const paymentIntent = paymentIntentResponse.data;

      // 3. Confirmar pago con Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Elemento de tarjeta no encontrado');
      }

      const { error: stripeError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret!,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: customerEmail,
            },
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Error al procesar el pago');
      }

      if (confirmedPaymentIntent.status === 'succeeded') {
        // 4. Crear suscripción
        const subscriptionResponse = await stripeService.createSubscription({
          customerId: customer.id,
          priceId: planId,
          metadata: {
            paymentIntentId: confirmedPaymentIntent.id,
            customerEmail
          }
        });

        if (!subscriptionResponse.success) {
          throw new Error(subscriptionResponse.error?.message || 'Error al crear suscripción');
        }

        setSuccess(true);
        onSuccess(subscriptionResponse.data);
      } else {
        throw new Error('El pago no se completó correctamente');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (success) {
    return (
      <div className="text-center p-8">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Pago Exitoso!
        </h3>
        <p className="text-gray-600 mb-4">
          Tu suscripción a {planName} ha sido activada correctamente.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continuar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información de Pago
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Seleccionado
          </label>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium text-gray-900">{planName}</p>
            <p className="text-sm text-gray-600">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: currency.toUpperCase()
              }).format(amount)}/mes
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={customerEmail}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Información de Tarjeta
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tu información de pago está protegida con encriptación SSL de 256 bits.
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!stripe || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Procesando...
              </div>
            ) : (
              `Pagar ${new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: currency.toUpperCase()
              }).format(amount)}`
            )}
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información Importante:</p>
            <ul className="space-y-1 text-xs">
              <li>• Tu suscripción se renovará automáticamente cada mes</li>
              <li>• Puedes cancelar en cualquier momento desde tu panel de control</li>
              <li>• No hay cargos ocultos ni comisiones adicionales</li>
              <li>• Soporte técnico incluido en todos los planes</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout; 