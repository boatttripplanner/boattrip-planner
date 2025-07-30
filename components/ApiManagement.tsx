import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { 
  CogIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeOffIcon,
  CopyIcon,
  TrashIcon,
  RefreshIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from './icons';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  created: number;
  lastUsed?: number;
  permissions: string[];
  isActive: boolean;
  usage: {
    total: number;
    thisMonth: number;
    limit: number;
  };
}

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responses: {
    code: number;
    description: string;
    example: any;
  }[];
}

interface ApiManagementProps {
  showUsage?: boolean;
  showDocumentation?: boolean;
  showKeys?: boolean;
}

export default function ApiManagement({
  showUsage = true,
  showDocumentation = true,
  showKeys = true
}: ApiManagementProps) {
  const { currentTenant, getPlan } = useTenant();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentPlan = getPlan();
  const planLimits = currentTenant?.subscription?.limits;

  // Endpoints de la API
  const apiEndpoints: ApiEndpoint[] = [
    {
      path: '/api/v1/boats',
      method: 'GET',
      description: 'Obtener lista de barcos disponibles',
      parameters: [
        {
          name: 'limit',
          type: 'integer',
          required: false,
          description: 'Número máximo de resultados (máx: 100)'
        },
        {
          name: 'offset',
          type: 'integer',
          required: false,
          description: 'Número de resultados a omitir'
        },
        {
          name: 'type',
          type: 'string',
          required: false,
          description: 'Filtrar por tipo de barco'
        }
      ],
      responses: [
        {
          code: 200,
          description: 'Lista de barcos obtenida exitosamente',
          example: {
            boats: [
              {
                id: 'boat_123',
                name: 'Sunseeker Predator 55',
                type: 'motor',
                length: 16.8,
                capacity: 12
              }
            ],
            total: 150,
            limit: 10,
            offset: 0
          }
        }
      ]
    },
    {
      path: '/api/v1/weather',
      method: 'GET',
      description: 'Obtener información meteorológica para una ubicación',
      parameters: [
        {
          name: 'lat',
          type: 'number',
          required: true,
          description: 'Latitud de la ubicación'
        },
        {
          name: 'lon',
          type: 'number',
          required: true,
          description: 'Longitud de la ubicación'
        },
        {
          name: 'forecast',
          type: 'boolean',
          required: false,
          description: 'Incluir pronóstico de 5 días'
        }
      ],
      responses: [
        {
          code: 200,
          description: 'Información meteorológica obtenida',
          example: {
            location: {
              lat: 40.4168,
              lon: -3.7038,
              name: 'Madrid, Spain'
            },
            current: {
              temperature: 22,
              humidity: 65,
              wind_speed: 15,
              wind_direction: 180,
              conditions: 'sunny'
            }
          }
        }
      ]
    },
    {
      path: '/api/v1/routes',
      method: 'POST',
      description: 'Calcular ruta optimizada entre dos puntos',
      parameters: [
        {
          name: 'origin',
          type: 'object',
          required: true,
          description: 'Punto de origen {lat, lon}'
        },
        {
          name: 'destination',
          type: 'object',
          required: true,
          description: 'Punto de destino {lat, lon}'
        },
        {
          name: 'boat_type',
          type: 'string',
          required: false,
          description: 'Tipo de barco para optimización'
        }
      ],
      responses: [
        {
          code: 200,
          description: 'Ruta calculada exitosamente',
          example: {
            route: {
              distance: 45.2,
              duration: 180,
              waypoints: [
                { lat: 40.4168, lon: -3.7038 },
                { lat: 40.4268, lon: -3.7138 }
              ]
            }
          }
        }
      ]
    }
  ];

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular carga de claves API
      const mockKeys: ApiKey[] = [
        {
          id: 'key_1',
          name: 'Clave Principal',
          key: 'sk_live_1234567890abcdef',
          prefix: 'sk_live_1234',
          created: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 días atrás
          lastUsed: Date.now() - 2 * 60 * 60 * 1000, // 2 horas atrás
          permissions: ['boats:read', 'weather:read', 'routes:read'],
          isActive: true,
          usage: {
            total: 15420,
            thisMonth: 3420,
            limit: planLimits?.apiCalls || 1000
          }
        },
        {
          id: 'key_2',
          name: 'Clave de Desarrollo',
          key: 'sk_test_abcdef1234567890',
          prefix: 'sk_test_abcd',
          created: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 días atrás
          lastUsed: Date.now() - 24 * 60 * 60 * 1000, // 1 día atrás
          permissions: ['boats:read'],
          isActive: true,
          usage: {
            total: 1250,
            thisMonth: 250,
            limit: planLimits?.apiCalls || 1000
          }
        }
      ];

      setApiKeys(mockKeys);
    } catch (err) {
      setError('Error al cargar las claves API');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      setError('Por favor, ingresa un nombre para la clave API');
      return;
    }

    if (selectedPermissions.length === 0) {
      setError('Por favor, selecciona al menos un permiso');
      return;
    }

    try {
      // Simular generación de clave API
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyName,
        key: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        prefix: `sk_${Math.random().toString(36).substring(2, 6)}`,
        created: Date.now(),
        permissions: selectedPermissions,
        isActive: true,
        usage: {
          total: 0,
          thisMonth: 0,
          limit: planLimits?.apiCalls || 1000
        }
      };

      setApiKeys(prev => [newKey, ...prev]);
      setShowNewKeyForm(false);
      setNewKeyName('');
      setSelectedPermissions([]);
      setShowKey(newKey.id);
    } catch (err) {
      setError('Error al generar la clave API');
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!confirm('¿Estás seguro de que quieres revocar esta clave API? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (err) {
      setError('Error al revocar la clave API');
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      setError('Error al copiar al portapapeles');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const getUsagePercentage = (usage: ApiKey['usage']) => {
    return Math.min((usage.thisMonth / usage.limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const availablePermissions = [
    { id: 'boats:read', name: 'Leer información de barcos', description: 'Acceso de solo lectura a datos de barcos' },
    { id: 'boats:write', name: 'Modificar barcos', description: 'Crear, actualizar y eliminar barcos' },
    { id: 'weather:read', name: 'Leer datos meteorológicos', description: 'Acceso a información meteorológica' },
    { id: 'routes:read', name: 'Leer rutas', description: 'Acceso de solo lectura a rutas calculadas' },
    { id: 'routes:write', name: 'Crear rutas', description: 'Calcular y guardar nuevas rutas' },
    { id: 'analytics:read', name: 'Leer analytics', description: 'Acceso a datos de analytics y métricas' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de API
          </h2>
          <p className="text-gray-600">
            Gestiona tus claves API y monitorea el uso
          </p>
        </div>
        <Button
          onClick={() => setShowNewKeyForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <KeyIcon className="w-4 h-4 mr-2" />
          Nueva Clave API
        </Button>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      {/* Claves API */}
      {showKeys && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Claves API
          </h3>
          
          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {apiKey.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Creada el {new Date(apiKey.created).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apiKey.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {apiKey.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                    <Button
                      onClick={() => revokeApiKey(apiKey.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Clave API */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clave API
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-50 rounded-md p-3 font-mono text-sm">
                      {showKey === apiKey.id ? apiKey.key : `${apiKey.prefix}...`}
                    </div>
                    <Button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      variant="outline"
                      size="sm"
                    >
                      {showKey === apiKey.id ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      variant="outline"
                      size="sm"
                    >
                      {copiedKey === apiKey.id ? <CheckCircleIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Permisos */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permisos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Uso */}
                {showUsage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uso este mes
                    </label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {apiKey.usage.thisMonth.toLocaleString()} / {apiKey.usage.limit.toLocaleString()} llamadas
                        </span>
                        <span className={`font-medium ${getUsageColor(getUsagePercentage(apiKey.usage))}`}>
                          {getUsagePercentage(apiKey.usage).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            getUsagePercentage(apiKey.usage) >= 90 ? 'bg-red-500' :
                            getUsagePercentage(apiKey.usage) >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${getUsagePercentage(apiKey.usage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario Nueva Clave */}
      {showNewKeyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nueva Clave API
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Clave
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Clave de Producción"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permisos
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions(prev => [...prev, permission.id]);
                          } else {
                            setSelectedPermissions(prev => prev.filter(p => p !== permission.id));
                          }
                        }}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {permission.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {permission.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowNewKeyForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={generateApiKey}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Generar Clave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Documentación de la API */}
      {showDocumentation && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Documentación de la API
          </h3>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                URL Base
              </h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                https://api.boattrip-planner.com
              </code>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                Autenticación
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Incluye tu clave API en el header de autorización:
              </p>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Endpoints Disponibles
              </h4>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {endpoint.description}
                    </p>
                    
                    {endpoint.parameters.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Parámetros</h5>
                        <div className="space-y-1">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="text-xs">
                              <code className="bg-gray-100 px-1 rounded">{param.name}</code>
                              <span className="text-gray-500 ml-1">({param.type})</span>
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                              <span className="text-gray-600 ml-2">- {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Respuestas</h5>
                      <div className="space-y-2">
                        {endpoint.responses.map((response, respIndex) => (
                          <div key={respIndex} className="text-xs">
                            <span className={`px-1 py-0.5 rounded ${
                              response.code === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {response.code}
                            </span>
                            <span className="text-gray-600 ml-2">{response.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Seguridad de la API:</p>
            <ul className="space-y-1 text-xs">
              <li>• Todas las claves API están encriptadas</li>
              <li>• Las claves revocadas no se pueden recuperar</li>
              <li>• Monitorea el uso para detectar actividad sospechosa</li>
              <li>• Usa HTTPS para todas las comunicaciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 