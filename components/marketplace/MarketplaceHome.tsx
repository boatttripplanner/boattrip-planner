import React, { useState, useEffect } from 'react';
import { 
  MarketplaceService, 
  ServiceCategory, 
  MarketplaceFilters, 
  SortOption,
  ServiceStatus 
} from '../../types/marketplace';
import { ServiceCard } from './ServiceCard';
import { MarketplaceFilters as FiltersComponent } from './MarketplaceFilters';
import { MarketplaceSearch } from './MarketplaceSearch';
import { MarketplaceStats } from './MarketplaceStats';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';

interface MarketplaceHomeProps {
  initialFilters?: MarketplaceFilters;
  onServiceSelect?: (service: MarketplaceService) => void;
  onBookingRequest?: (service: MarketplaceService) => void;
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  initialFilters = {},
  onServiceSelect,
  onBookingRequest
}) => {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [filteredServices, setFilteredServices] = useState<MarketplaceService[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.POPULAR);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeProviders: 0,
    totalBookings: 0,
    averageRating: 0
  });

  // Mock data for demonstration
  const mockServices: MarketplaceService[] = [
    {
      id: '1',
      name: 'Alquiler de Yate de Lujo en Mallorca',
      description: 'Experimenta el lujo en el Mediterráneo con nuestro yate de 50 pies equipado con todas las comodidades.',
      category: {
        id: '1',
        name: 'Alquiler de Barcos',
        description: 'Barcos y yates para alquiler',
        icon: '🚤'
      },
      provider: {
        id: '1',
        name: 'Luxury Yachts Mallorca',
        description: 'Especialistas en yates de lujo',
        logo: '/images/providers/luxury-yachts.png',
        rating: 4.8,
        verified: true,
        location: {
          country: 'España',
          region: 'Baleares',
          city: 'Palma de Mallorca',
          address: 'Puerto de Palma',
          postalCode: '07012'
        },
        services: ['Alquiler de Yates', 'Charter Privado'],
        contact: {
          email: 'info@luxuryyachts.com',
          phone: '+34 971 123 456'
        },
        documents: [],
        subscription: {
          plan: { name: 'Premium', features: [], limits: { users: 10, vessels: 5, integrations: 3, storage: 100, apiCalls: 10000 }, pricing: { monthly: 500, yearly: 5000, setup: 0, custom: false } },
          status: 0,
          startDate: new Date(),
          endDate: new Date(),
          features: [],
          limits: { users: 10, vessels: 5, integrations: 3, storage: 100, apiCalls: 10000, custom: {} }
        },
        earnings: {
          total: 50000,
          thisMonth: 5000,
          thisYear: 50000,
          pending: 1000,
          paid: 49000,
          commission: 5000
        },
        status: 0,
        joinedAt: new Date()
      },
      price: {
        amount: 2500,
        currency: 'EUR',
        type: 0,
        perUnit: 'por día'
      },
      location: {
        country: 'España',
        region: 'Baleares',
        city: 'Palma de Mallorca',
        port: 'Puerto de Palma',
        address: 'Muelle de Levante',
        postalCode: '07012'
      },
      availability: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        availableDays: [1, 2, 3, 4, 5, 6, 7],
        availableHours: [{ start: '09:00', end: '18:00' }],
        maxBookings: 10,
        currentBookings: 3,
        blackoutDates: []
      },
      reviews: [],
      rating: 4.8,
      images: ['/images/services/yacht-1.jpg', '/images/services/yacht-2.jpg'],
      features: ['GPS', 'WiFi', 'Cocina completa', 'Camarotes', 'Equipo de buceo'],
      requirements: ['Licencia náutica', 'Depósito de seguridad'],
      cancellationPolicy: {
        type: 1,
        refundPercentage: 80,
        timeLimit: 48,
        description: 'Cancelación gratuita hasta 48 horas antes'
      },
      insurance: {
        included: true,
        coverage: ['Daños', 'Responsabilidad civil', 'Accidentes'],
        deductible: 500,
        provider: 'Seguros Marítimos SA'
      },
      status: ServiceStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Curso de Navegación Básica',
      description: 'Aprende los fundamentos de la navegación con instructores certificados.',
      category: {
        id: '2',
        name: 'Cursos y Formación',
        description: 'Cursos náuticos y certificaciones',
        icon: '📚'
      },
      provider: {
        id: '2',
        name: 'Escuela Náutica Mediterránea',
        description: 'Formación náutica profesional',
        logo: '/images/providers/escuela-nautica.png',
        rating: 4.9,
        verified: true,
        location: {
          country: 'España',
          region: 'Baleares',
          city: 'Palma de Mallorca',
          address: 'Calle del Mar 123',
          postalCode: '07001'
        },
        services: ['Cursos Náuticos', 'Certificaciones'],
        contact: {
          email: 'info@escuelanautica.com',
          phone: '+34 971 987 654'
        },
        documents: [],
        subscription: {
          plan: { name: 'Professional', features: [], limits: { users: 50, vessels: 20, integrations: 5, storage: 500, apiCalls: 50000 }, pricing: { monthly: 1500, yearly: 15000, setup: 0, custom: false } },
          status: 0,
          startDate: new Date(),
          endDate: new Date(),
          features: [],
          limits: { users: 50, vessels: 20, integrations: 5, storage: 500, apiCalls: 50000, custom: {} }
        },
        earnings: {
          total: 75000,
          thisMonth: 7500,
          thisYear: 75000,
          pending: 1500,
          paid: 73500,
          commission: 7500
        },
        status: 0,
        joinedAt: new Date()
      },
      price: {
        amount: 450,
        currency: 'EUR',
        type: 0,
        perUnit: 'por curso'
      },
      location: {
        country: 'España',
        region: 'Baleares',
        city: 'Palma de Mallorca',
        address: 'Calle del Mar 123',
        postalCode: '07001'
      },
      availability: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        availableDays: [1, 2, 3, 4, 5],
        availableHours: [{ start: '09:00', end: '17:00' }],
        maxBookings: 20,
        currentBookings: 8,
        blackoutDates: []
      },
      reviews: [],
      rating: 4.9,
      images: ['/images/services/course-1.jpg'],
      features: ['Material incluido', 'Certificación oficial', 'Práctica en mar'],
      requirements: ['Edad mínima 16 años', 'Nivel básico de español'],
      cancellationPolicy: {
        type: 0,
        refundPercentage: 100,
        timeLimit: 72,
        description: 'Cancelación gratuita hasta 72 horas antes'
      },
      insurance: {
        included: true,
        coverage: ['Accidentes', 'Responsabilidad civil'],
        deductible: 0,
        provider: 'Seguros Educativos SA'
      },
      status: ServiceStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockCategories: ServiceCategory[] = [
    {
      id: '1',
      name: 'Alquiler de Barcos',
      description: 'Barcos y yates para alquiler',
      icon: '🚤'
    },
    {
      id: '2',
      name: 'Cursos y Formación',
      description: 'Cursos náuticos y certificaciones',
      icon: '📚'
    },
    {
      id: '3',
      name: 'Mantenimiento',
      description: 'Servicios de mantenimiento náutico',
      icon: '🔧'
    },
    {
      id: '4',
      name: 'Seguros',
      description: 'Seguros náuticos y cobertura',
      icon: '🛡️'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadMarketplaceData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setServices(mockServices);
        setCategories(mockCategories);
        setStats({
          totalServices: mockServices.length,
          activeProviders: 2,
          totalBookings: 156,
          averageRating: 4.85
        });
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el marketplace');
        setLoading(false);
      }
    };

    loadMarketplaceData();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = services.filter(service => {
      // Status filter
      if (service.status !== ServiceStatus.ACTIVE) return false;
      
      // Category filter
      if (filters.category && service.category.id !== filters.category) return false;
      
      // Price range filter
      if (filters.priceRange) {
        const price = service.price.amount;
        if (price < filters.priceRange.min || price > filters.priceRange.max) return false;
      }
      
      // Rating filter
      if (filters.rating && service.rating < filters.rating) return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDescription = service.description.toLowerCase().includes(query);
        const matchesProvider = service.provider.name.toLowerCase().includes(query);
        
        if (!matchesName && !matchesDescription && !matchesProvider) return false;
      }
      
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case SortOption.PRICE_LOW_TO_HIGH:
          return a.price.amount - b.price.amount;
        case SortOption.PRICE_HIGH_TO_LOW:
          return b.price.amount - a.price.amount;
        case SortOption.RATING_HIGH_TO_LOW:
          return b.rating - a.rating;
        case SortOption.NEWEST:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case SortOption.POPULAR:
        default:
          return b.reviews.length - a.reviews.length;
      }
    });

    setFilteredServices(filtered);
    setTotalPages(Math.ceil(filtered.length / 12)); // 12 items per page
    setCurrentPage(1);
  }, [services, filters, searchQuery, sortBy]);

  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  const handleServiceSelect = (service: MarketplaceService) => {
    onServiceSelect?.(service);
  };

  const handleBookingRequest = (service: MarketplaceService) => {
    onBookingRequest?.(service);
  };

  const getCurrentPageServices = () => {
    const startIndex = (currentPage - 1) * 12;
    const endIndex = startIndex + 12;
    return filteredServices.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏪 Marketplace Náutico
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre servicios náuticos de calidad, desde alquiler de barcos hasta cursos de formación, 
            todo en una plataforma confiable y segura.
          </p>
        </div>

        {/* Stats */}
        <MarketplaceStats stats={stats} />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <MarketplaceSearch 
            onSearch={handleSearch}
            placeholder="Buscar servicios, proveedores..."
          />
          
          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            <div className="lg:w-1/4">
              <FiltersComponent
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            <div className="lg:w-3/4">
              {/* Sort and Results */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  {filteredServices.length} servicios encontrados
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={SortOption.POPULAR}>Más populares</option>
                    <option value={SortOption.RATING_HIGH_TO_LOW}>Mejor valorados</option>
                    <option value={SortOption.PRICE_LOW_TO_HIGH}>Precio: menor a mayor</option>
                    <option value={SortOption.PRICE_HIGH_TO_LOW}>Precio: mayor a menor</option>
                    <option value={SortOption.NEWEST}>Más recientes</option>
                  </select>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentPageServices().map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onSelect={() => handleServiceSelect(service)}
                    onBookingRequest={() => handleBookingRequest(service)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}

              {/* No Results */}
              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron servicios
                  </h3>
                  <p className="text-gray-600">
                    Intenta ajustar los filtros o la búsqueda para encontrar lo que buscas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 