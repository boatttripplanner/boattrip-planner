import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { stripeService } from '../services/stripeService';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  DownloadIcon,
  EyeIcon
} from './icons';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: number;
  due_date?: number;
  paid_at?: number;
  invoice_pdf?: string;
  hosted_invoice_url?: string;
  description?: string;
  customer_email?: string;
  subscription?: string;
}

interface InvoiceHistoryProps {
  customerId?: string;
  limit?: number;
  showDownload?: boolean;
  showActions?: boolean;
}

export default function InvoiceHistory({
  customerId,
  limit = 10,
  showDownload = true,
  showActions = true
}: InvoiceHistoryProps) {
  const { currentTenant } = useTenant();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const effectiveCustomerId = customerId || currentTenant?.settings?.billing?.stripeCustomerId;

  useEffect(() => {
    if (effectiveCustomerId) {
      loadInvoices();
    } else {
      setLoading(false);
      setError('No se encontró información del cliente');
    }
  }, [effectiveCustomerId]);

  const loadInvoices = async () => {
    if (!effectiveCustomerId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await stripeService.getInvoices(effectiveCustomerId, limit);
      
      if (response.success && response.data) {
        setInvoices(response.data);
      } else {
        setError(response.error?.message || 'Error al cargar las facturas');
      }
    } catch (err) {
      setError('Error inesperado al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'void':
        return 'bg-gray-100 text-gray-800';
      case 'uncollectible':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'open':
        return <ClockIcon className="w-4 h-4" />;
      case 'void':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'uncollectible':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'open':
        return 'Pendiente';
      case 'void':
        return 'Anulada';
      case 'uncollectible':
        return 'No Cobrable';
      default:
        return status;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount / 100); // Stripe usa centavos
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    if (!invoice.invoice_pdf) {
      setError('PDF no disponible para esta factura');
      return;
    }

    try {
      const response = await fetch(invoice.invoice_pdf);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${invoice.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error al descargar la factura');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
    } else {
      setError('Vista previa no disponible para esta factura');
    }
  };

  const handlePayInvoice = async (invoice: Invoice) => {
    if (invoice.status !== 'open') {
      setError('Solo se pueden pagar facturas pendientes');
      return;
    }

    try {
      // Crear Payment Intent para la factura
      const paymentIntentResponse = await stripeService.createPaymentIntent({
        amount: invoice.amount,
        currency: invoice.currency,
        customerId: effectiveCustomerId!,
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.number
        }
      });

      if (paymentIntentResponse.success) {
        // Redirigir al checkout de Stripe
        const stripe = await import('@stripe/stripe-js');
        const stripeInstance = await stripe.loadStripe(stripeService.getPublishableKey());
        
        if (stripeInstance) {
          const { error } = await stripeInstance.redirectToCheckout({
            sessionId: paymentIntentResponse.data.client_secret!
          });
          
          if (error) {
            setError(error.message || 'Error al procesar el pago');
          }
        }
      } else {
        setError(paymentIntentResponse.error?.message || 'Error al crear el pago');
      }
    } catch (err) {
      setError('Error inesperado al procesar el pago');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <ErrorMessage message={error} />
        <Button
          onClick={loadInvoices}
          className="mt-4"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay facturas
        </h3>
        <p className="text-gray-600">
          Aún no se han generado facturas para esta cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Historial de Facturas
          </h2>
          <p className="text-gray-600">
            Gestiona y descarga tus facturas
          </p>
        </div>
        <Button
          onClick={loadInvoices}
          variant="outline"
          size="sm"
        >
          Actualizar
        </Button>
      </div>

      {/* Lista de Facturas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.number}
                        </div>
                        {invoice.description && (
                          <div className="text-sm text-gray-500">
                            {invoice.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(invoice.amount, invoice.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">{getStatusText(invoice.status)}</span>
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {invoice.hosted_invoice_url && (
                          <Button
                            onClick={() => handleViewInvoice(invoice)}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        )}
                        {showDownload && invoice.invoice_pdf && (
                          <Button
                            onClick={() => handleDownloadInvoice(invoice)}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <DownloadIcon className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        )}
                        {invoice.status === 'open' && (
                          <Button
                            onClick={() => handlePayInvoice(invoice)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Pagar
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <DocumentTextIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información sobre Facturas:</p>
            <ul className="space-y-1 text-xs">
              <li>• Las facturas se generan automáticamente cada mes</li>
              <li>• Puedes descargar el PDF o ver online</li>
              <li>• Las facturas pendientes se pueden pagar directamente</li>
              <li>• Todas las facturas incluyen desglose detallado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 