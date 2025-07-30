import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  Tenant, 
  User, 
  UserRole, 
  Subscription, 
  TenantSettings,
  UsageMetrics,
  AnalyticsData 
} from '../types/tenant';

// Estado del contexto
interface TenantState {
  currentTenant: Tenant | null;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  usage: UsageMetrics | null;
  analytics: AnalyticsData | null;
  isMultiTenant: boolean;
}

// Acciones del reducer
type TenantAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TENANT'; payload: Tenant }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_USAGE'; payload: UsageMetrics }
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData }
  | { type: 'UPDATE_TENANT_SETTINGS'; payload: Partial<TenantSettings> }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'LOGOUT' }
  | { type: 'SET_MULTI_TENANT'; payload: boolean };

// Estado inicial
const initialState: TenantState = {
  currentTenant: null,
  currentUser: null,
  isLoading: true,
  error: null,
  usage: null,
  analytics: null,
  isMultiTenant: false,
};

// Reducer
function tenantReducer(state: TenantState, action: TenantAction): TenantState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_TENANT':
      return { 
        ...state, 
        currentTenant: action.payload, 
        isLoading: false, 
        error: null 
      };
    
    case 'SET_USER':
      return { 
        ...state, 
        currentUser: action.payload, 
        isLoading: false, 
        error: null 
      };
    
    case 'SET_USAGE':
      return { ...state, usage: action.payload };
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    
    case 'UPDATE_TENANT_SETTINGS':
      if (!state.currentTenant) return state;
      return {
        ...state,
        currentTenant: {
          ...state.currentTenant,
          settings: {
            ...state.currentTenant.settings,
            ...action.payload,
          },
        },
      };
    
    case 'UPDATE_SUBSCRIPTION':
      if (!state.currentTenant) return state;
      return {
        ...state,
        currentTenant: {
          ...state.currentTenant,
          subscription: action.payload,
        },
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        isMultiTenant: state.isMultiTenant,
      };
    
    case 'SET_MULTI_TENANT':
      return { ...state, isMultiTenant: action.payload };
    
    default:
      return state;
  }
}

// Contexto
interface TenantContextType extends TenantState {
  // Acciones
  setTenant: (tenant: Tenant) => void;
  setUser: (user: User) => void;
  setUsage: (usage: UsageMetrics) => void;
  setAnalytics: (analytics: AnalyticsData) => void;
  updateTenantSettings: (settings: Partial<TenantSettings>) => void;
  updateSubscription: (subscription: Subscription) => void;
  logout: () => void;
  setMultiTenant: (enabled: boolean) => void;
  
  // Utilidades
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isFeatureEnabled: (feature: keyof TenantSettings['features']) => boolean;
  getUsagePercentage: (metric: keyof UsageMetrics) => number;
  isOverLimit: (metric: keyof UsageMetrics) => boolean;
  getBranding: () => TenantSettings['branding'] | null;
  getPlan: () => SubscriptionPlan | null;
  isPlanActive: () => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Provider
interface TenantProviderProps {
  children: ReactNode;
  initialTenant?: Tenant;
  initialUser?: User;
  multiTenant?: boolean;
}

export function TenantProvider({ 
  children, 
  initialTenant, 
  initialUser, 
  multiTenant = false 
}: TenantProviderProps) {
  const [state, dispatch] = useReducer(tenantReducer, {
    ...initialState,
    currentTenant: initialTenant || null,
    currentUser: initialUser || null,
    isMultiTenant: multiTenant,
    isLoading: !initialTenant && !initialUser,
  });

  // Acciones
  const setTenant = (tenant: Tenant) => {
    dispatch({ type: 'SET_TENANT', payload: tenant });
  };

  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setUsage = (usage: UsageMetrics) => {
    dispatch({ type: 'SET_USAGE', payload: usage });
  };

  const setAnalytics = (analytics: AnalyticsData) => {
    dispatch({ type: 'SET_ANALYTICS', payload: analytics });
  };

  const updateTenantSettings = (settings: Partial<TenantSettings>) => {
    dispatch({ type: 'UPDATE_TENANT_SETTINGS', payload: settings });
  };

  const updateSubscription = (subscription: Subscription) => {
    dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: subscription });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const setMultiTenant = (enabled: boolean) => {
    dispatch({ type: 'SET_MULTI_TENANT', payload: enabled });
  };

  // Utilidades
  const hasPermission = (resource: string, action: string): boolean => {
    if (!state.currentUser) return false;
    
    return state.currentUser.permissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    );
  };

  const hasRole = (role: UserRole): boolean => {
    return state.currentUser?.role === role;
  };

  const isFeatureEnabled = (feature: keyof TenantSettings['features']): boolean => {
    return state.currentTenant?.settings.features[feature] || false;
  };

  const getUsagePercentage = (metric: keyof UsageMetrics): number => {
    if (!state.usage) return 0;
    
    const usage = state.usage[metric];
    if (typeof usage === 'object' && 'current' in usage && 'limit' in usage) {
      return (usage.current / usage.limit) * 100;
    }
    
    return 0;
  };

  const isOverLimit = (metric: keyof UsageMetrics): boolean => {
    return getUsagePercentage(metric) > 100;
  };

  const getBranding = (): TenantSettings['branding'] | null => {
    return state.currentTenant?.settings.branding || null;
  };

  const getPlan = (): SubscriptionPlan | null => {
    return state.currentTenant?.subscription.plan || null;
  };

  const isPlanActive = (): boolean => {
    return state.currentTenant?.subscription.status === 'active';
  };

  // Efecto para detectar el tenant desde la URL en modo multi-tenant
  useEffect(() => {
    if (!state.isMultiTenant) return;

    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Si es un subdominio válido, cargar el tenant correspondiente
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      // Aquí se haría la llamada a la API para cargar el tenant
      console.log('Loading tenant for subdomain:', subdomain);
    }
  }, [state.isMultiTenant]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (state.currentTenant && state.currentUser) {
      // Cargar métricas de uso
      // Cargar analytics
      // Cargar configuración adicional
    }
  }, [state.currentTenant, state.currentUser]);

  const value: TenantContextType = {
    ...state,
    setTenant,
    setUser,
    setUsage,
    setAnalytics,
    updateTenantSettings,
    updateSubscription,
    logout,
    setMultiTenant,
    hasPermission,
    hasRole,
    isFeatureEnabled,
    getUsagePercentage,
    isOverLimit,
    getBranding,
    getPlan,
    isPlanActive,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// Hook personalizado
export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Hooks especializados
export function useTenantPermissions() {
  const { hasPermission, hasRole, currentUser } = useTenant();
  
  return {
    hasPermission,
    hasRole,
    currentUser,
    isAdmin: hasRole(UserRole.TENANT_ADMIN) || hasRole(UserRole.SUPER_ADMIN),
    isManager: hasRole(UserRole.MANAGER),
    isOperator: hasRole(UserRole.OPERATOR),
    isViewer: hasRole(UserRole.VIEWER),
  };
}

export function useTenantFeatures() {
  const { isFeatureEnabled, currentTenant } = useTenant();
  
  return {
    isFeatureEnabled,
    currentTenant,
    hasAI: isFeatureEnabled('aiEnabled'),
    hasWeather: isFeatureEnabled('weatherApi'),
    hasAnalytics: isFeatureEnabled('analytics'),
    hasWhiteLabel: isFeatureEnabled('whiteLabel'),
    hasCustomIntegrations: isFeatureEnabled('customIntegrations'),
    hasPrioritySupport: isFeatureEnabled('prioritySupport'),
    hasAdvancedReports: isFeatureEnabled('advancedReports'),
    hasApiAccess: isFeatureEnabled('apiAccess'),
    hasMobileApp: isFeatureEnabled('mobileApp'),
    hasOfflineMode: isFeatureEnabled('offlineMode'),
  };
}

export function useTenantUsage() {
  const { usage, getUsagePercentage, isOverLimit, currentTenant } = useTenant();
  
  return {
    usage,
    getUsagePercentage,
    isOverLimit,
    currentTenant,
    usersUsage: getUsagePercentage('users'),
    boatsUsage: getUsagePercentage('boats'),
    apiCallsUsage: getUsagePercentage('apiCalls'),
    storageUsage: getUsagePercentage('storage'),
    recommendationsUsage: getUsagePercentage('recommendations'),
    weatherApiUsage: getUsagePercentage('weatherApi'),
    isOverUsersLimit: isOverLimit('users'),
    isOverBoatsLimit: isOverLimit('boats'),
    isOverApiCallsLimit: isOverLimit('apiCalls'),
    isOverStorageLimit: isOverLimit('storage'),
  };
}

export function useTenantBranding() {
  const { getBranding, currentTenant } = useTenant();
  
  return {
    branding: getBranding(),
    currentTenant,
    logo: getBranding()?.logo,
    colors: getBranding()?.colors,
    companyName: getBranding()?.companyName,
    customDomain: getBranding()?.customDomain,
  };
} 