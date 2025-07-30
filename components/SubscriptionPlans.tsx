import React, { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { SubscriptionPlan, PlanDetails, TenantLimits } from '../types/tenant';
import StripeCheckout from './StripeCheckout';

interface SubscriptionPlansProps {
  showCurrentPlan?: boolean;
  showUpgradeOptions?: boolean;
  onPlanSelect?: (plan: SubscriptionPlan) => void;
  onUpgrade?: (plan: SubscriptionPlan) => void;
}

export default function SubscriptionPlans({
  showCurrentPlan = true,
  showUpgradeOptions = true,
  onPlanSelect,
  onUpgrade,
}: SubscriptionPlansProps) {
  const { currentTenant, getPlan, isPlanActive } = useTenant();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);

  const currentPlan = getPlan();
  const isActive = isPlanActive();

  // Configuración de planes
  const plans: Record<SubscriptionPlan, PlanDetails> = {
    starter: {
      name: 'Starter',
      price: {
        monthly: 500,
        yearly: 5000, // 2 meses gratis
      },
      features: [
        'Hasta 100 usuarios',
        'Hasta 50 modelos de barcos',
        '1,000 llamadas API/mes',
        '5GB almacenamiento',
        'Soporte por email',
        'Analytics básico',
        'Integración meteorológica',
        'Wizard de planificación',
      ],
      limits: {
        users: 100,
        boats: 50,
        apiCalls: 1000,
        storage: 5120, // 5GB
        customDomains: 1,
        integrations: 2,
        reports: 10,
        exports: 50,
      },
    },
    professional: {
      name: 'Professional',
      price: {
        monthly: 1500,
        yearly: 15000, // 2 meses gratis
      },
      features: [
        'Hasta 500 usuarios',
        'Hasta 200 modelos de barcos',
        '10,000 llamadas API/mes',
        '25GB almacenamiento',
        'Soporte prioritario',
        'Analytics avanzado',
        'White-label básico',
        'API RESTful',
        'Reportes personalizados',
        'Integraciones avanzadas',
        'PWA offline',
        'Push notifications',
      ],
      limits: {
        users: 500,
        boats: 200,
        apiCalls: 10000,
        storage: 25600, // 25GB
        customDomains: 3,
        integrations: 10,
        reports: 100,
        exports: 500,
      },
      popular: true,
    },
    enterprise: {
      name: 'Enterprise',
      price: {
        monthly: 3000,
        yearly: 30000, // 2 meses gratis
      },
      features: [
        'Usuarios ilimitados',
        'Modelos de barcos ilimitados',
        '100,000 llamadas API/mes',
        '100GB almacenamiento',
        'Soporte 24/7',
        'Analytics premium',
        'White-label completo',
        'API RESTful completa',
        'Reportes personalizados',
        'Integraciones ilimitadas',
        'PWA offline avanzada',
        'Push notifications',
        'IA avanzada',
        'Machine Learning',
        'Predicción de demanda',
        'Optimización de rutas',
        'Análisis de sentimiento',
        'Certificaciones de seguridad',
        'GDPR compliance',
        'SLA garantizado',
      ],
      limits: {
        users: -1, // Ilimitado
        boats: -1, // Ilimitado
        apiCalls: 100000,
        storage: 102400, // 100GB
        customDomains: -1, // Ilimitado
        integrations: -1, // Ilimitado
        reports: -1, // Ilimitado
        exports: -1, // Ilimitado
      },
    },
    custom: {
      name: 'Custom',
      price: {
        monthly: 5000,
        yearly: 50000,
      },
      features: [
        'Todo lo de Enterprise',
        'Desarrollo personalizado',
        'Integración dedicada',
        'Soporte dedicado',
        'SLA premium',
        'Consultoría incluida',
        'Capacitación del equipo',
        'Migración de datos',
        'Backup dedicado',
        'Monitoreo 24/7',
      ],
      limits: {
        users: -1,
        boats: -1,
        apiCalls: -1,
        storage: -1,
        customDomains: -1,
        integrations: -1,
        reports: -1,
        exports: -1,
      },
    },
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    onPlanSelect?.(plan);
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      onUpgrade?.(selectedPlan);
    }
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setCheckoutPlan(plan);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (data: any) => {
    setShowCheckout(false);
    setCheckoutPlan(null);
    // Aquí podrías actualizar el estado del tenant o mostrar un mensaje de éxito
    console.log('Subscription created successfully:', data);
  };

  const handleCheckoutError = (error: string) => {
    console.error('Checkout error:', error);
    // Aquí podrías mostrar un mensaje de error
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setCheckoutPlan(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSavings = (plan: SubscriptionPlan) => {
    const monthlyPrice = plans[plan].price.monthly;
    const yearlyPrice = plans[plan].price.yearly;
    const yearlyEquivalent = monthlyPrice * 12;
    const savings = yearlyEquivalent - yearlyPrice;
    return savings;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Planes de Suscripción
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Elige el plan que mejor se adapte a tus necesidades
        </p>

        {/* Selector de ciclo de facturación */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Actual */}
      {showCurrentPlan && currentPlan && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                Plan Actual: {plans[currentPlan].name}
              </h3>
              <p className="text-blue-700">
                {formatPrice(plans[currentPlan].price[billingCycle])}/{billingCycle === 'monthly' ? 'mes' : 'año'}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Estado: {isActive ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Plan Actual
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Planes Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(plans).map(([planKey, plan]) => {
          const planType = planKey as SubscriptionPlan;
          const isCurrentPlan = currentPlan === planType;
          const isSelected = selectedPlan === planType;
          const price = plan.price[billingCycle];
          const savings = billingCycle === 'yearly' ? getSavings(planType) : 0;

          return (
            <div
              key={planKey}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
                isCurrentPlan
                  ? 'border-blue-500 bg-blue-50'
                  : isSelected
                  ? 'border-green-500'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
            >
              {/* Badge Popular */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}

              {/* Badge Plan Actual */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Actual
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Header del Plan */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(price)}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'mes' : 'año'}
                    </span>
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Ahorras {formatPrice(savings)} al año
                    </p>
                  )}
                </div>

                {/* Límites del Plan */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Límites</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usuarios:</span>
                      <span className="font-medium">
                        {plan.limits.users === -1 ? 'Ilimitado' : plan.limits.users.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Barcos:</span>
                      <span className="font-medium">
                        {plan.limits.boats === -1 ? 'Ilimitado' : plan.limits.boats.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Calls:</span>
                      <span className="font-medium">
                        {plan.limits.apiCalls === -1 ? 'Ilimitado' : plan.limits.apiCalls.toLocaleString()}/mes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Almacenamiento:</span>
                      <span className="font-medium">
                        {plan.limits.storage === -1 ? 'Ilimitado' : `${plan.limits.storage / 1024}GB`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Características</h4>
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="text-sm text-gray-500">
                        +{plan.features.length - 6} características más
                      </li>
                    )}
                  </ul>
                </div>

                {/* Botón de Acción */}
                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                    >
                      Plan Actual
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(planType)}
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                    >
                      Suscribirse
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Checkout */}
      {showCheckout && checkoutPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Completar Suscripción - {plans[checkoutPlan].name}
                </h3>
                <button
                  onClick={handleCheckoutCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <StripeCheckout
                planId={`price_${checkoutPlan}_${billingCycle}`}
                planName={plans[checkoutPlan].name}
                amount={plans[checkoutPlan].price[billingCycle]}
                currency="EUR"
                customerEmail={currentTenant?.settings?.billing?.email || 'admin@boattrip-planner.com'}
                onSuccess={handleCheckoutSuccess}
                onError={handleCheckoutError}
                onCancel={handleCheckoutCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Importante
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Facturación</h4>
            <ul className="space-y-1">
              <li>• Facturación automática mensual/anual</li>
              <li>• Cancelación en cualquier momento</li>
              <li>• Sin cargos ocultos</li>
              <li>• Facturación prorrateada al cambiar de plan</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Soporte</h4>
            <ul className="space-y-1">
              <li>• Soporte por email (Starter)</li>
              <li>• Soporte prioritario (Professional)</li>
              <li>• Soporte 24/7 (Enterprise)</li>
              <li>• Soporte dedicado (Custom)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparación de Planes */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparación Detallada
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Característica</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Starter</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Professional</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Enterprise</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Custom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600">Usuarios</td>
                <td className="py-3 px-4 text-center text-sm">100</td>
                <td className="py-3 px-4 text-center text-sm">500</td>
                <td className="py-3 px-4 text-center text-sm">Ilimitado</td>
                <td className="py-3 px-4 text-center text-sm">Ilimitado</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600">API Calls/mes</td>
                <td className="py-3 px-4 text-center text-sm">1,000</td>
                <td className="py-3 px-4 text-center text-sm">10,000</td>
                <td className="py-3 px-4 text-center text-sm">100,000</td>
                <td className="py-3 px-4 text-center text-sm">Ilimitado</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600">White-label</td>
                <td className="py-3 px-4 text-center text-sm">❌</td>
                <td className="py-3 px-4 text-center text-sm">Básico</td>
                <td className="py-3 px-4 text-center text-sm">Completo</td>
                <td className="py-3 px-4 text-center text-sm">Completo</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600">IA Avanzada</td>
                <td className="py-3 px-4 text-center text-sm">❌</td>
                <td className="py-3 px-4 text-center text-sm">❌</td>
                <td className="py-3 px-4 text-center text-sm">✅</td>
                <td className="py-3 px-4 text-center text-sm">✅</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600">Soporte 24/7</td>
                <td className="py-3 px-4 text-center text-sm">❌</td>
                <td className="py-3 px-4 text-center text-sm">❌</td>
                <td className="py-3 px-4 text-center text-sm">✅</td>
                <td className="py-3 px-4 text-center text-sm">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 