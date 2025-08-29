import React from 'react';
import { findAffiliateProductByText, findAffiliateProductByTextComplete, AFFILIATE_CATALOG } from '../data/affiliateCatalog';

const ProductMappingDemo: React.FC = () => {
  // Elementos típicos del checklist náutico para probar
  const testItems = [
    'chaleco salvavidas',
    'protector solar',
    'equipo snorkel',
    'gps nautico',
    'gopro',
    'nevera portatil',
    'linterna',
    'radio vhf',
    'ancla marina',
    'compas nautico',
    'cartas nauticas',
    'gafas polarizadas',
    'chaleco perro',
    'juguetes acuaticos',
    'manual navegacion',
    'detergente biodegradable',
    'kit limpieza',
    'power bank',
    'bolsa estanca',
    'caña pesca',
    // Nuevos elementos agregados
    'ropa baño toallas',
    'ropa abrigo ligera',
    'calzado blanco barco',
    'agua bebidas',
    'snacks comida picnic',
    'bolsas basura',
    'bateria externa movil',
    'camara fotografica',
    'documentos dni pasaporte'
  ];

  const getProductInfo = (item: string) => {
    const curated = findAffiliateProductByText(item);
    const complete = findAffiliateProductByTextComplete(item);
    
    return {
      item,
      curated: curated ? { title: curated.title, url: curated.affiliateUrl } : null,
      complete: complete ? { 
        title: complete.title, 
        category: complete.category, 
        price: complete.price,
        asin: complete.asin 
      } : null
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        🧪 Demostración del Sistema de Mapeo de Productos
      </h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">ℹ️ Información del Sistema</h3>
        <p className="text-blue-700 text-sm">
          Este componente demuestra cómo el sistema mapea elementos del checklist náutico a productos específicos de Amazon.
          Se muestran {AFFILIATE_CATALOG.length} productos curados con enlaces de afiliado directos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos del Catálogo */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            📚 Catálogo de Productos Curados ({AFFILIATE_CATALOG.length} productos)
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {AFFILIATE_CATALOG.map((product) => (
              <div key={product.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 text-sm">{product.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-600 bg-slate-200 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.price && (
                    <span className="text-xs font-medium text-green-600">
                      {product.price}
                    </span>
                  )}
                </div>
                {product.asin && (
                  <div className="mt-1 text-xs text-slate-500">
                    ASIN: {product.asin}
                  </div>
                )}
                <div className="mt-2 text-xs text-slate-600">
                  <strong>Keywords:</strong> {product.keywords.slice(0, 3).join(', ')}
                  {product.keywords.length > 3 && '...'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pruebas de Mapeo */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            🔍 Pruebas de Mapeo del Checklist
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testItems.map((item) => {
              const info = getProductInfo(item);
              return (
                <div key={item} className="p-3 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-medium text-slate-800 text-sm mb-2">
                    "{item}"
                  </h4>
                  
                  {info.complete ? (
                    <div className="space-y-2">
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✅ Producto encontrado
                      </div>
                      <div className="text-xs text-slate-700">
                        <strong>Nombre:</strong> {info.complete.title}
                      </div>
                      <div className="text-xs text-slate-700">
                        <strong>Categoría:</strong> {info.complete.category}
                      </div>
                      {info.complete.price && (
                        <div className="text-xs text-slate-700">
                          <strong>Precio:</strong> {info.complete.price}
                        </div>
                      )}
                      {info.complete.asin && (
                        <div className="text-xs text-slate-700">
                          <strong>ASIN:</strong> {info.complete.asin}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      ⚠️ No se encontró producto específico
                    </div>
                  )}
                  
                  {info.curated && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <strong>Enlace curado:</strong> {info.curated.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mt-8 p-4 bg-teal-50 rounded-lg">
        <h3 className="text-lg font-semibold text-teal-800 mb-3">📊 Estadísticas del Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{AFFILIATE_CATALOG.length}</div>
            <div className="text-sm text-teal-700">Productos curados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {AFFILIATE_CATALOG.filter(p => p.asin).length}
            </div>
            <div className="text-sm text-blue-700">Con ASIN directo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {AFFILIATE_CATALOG.filter(p => p.price).length}
            </div>
            <div className="text-sm text-green-700">Con precio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(AFFILIATE_CATALOG.map(p => p.category)).size}
            </div>
            <div className="text-sm text-purple-700">Categorías</div>
          </div>
        </div>
      </div>

      {/* Categorías disponibles */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">🏷️ Categorías Disponibles</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(AFFILIATE_CATALOG.map(p => p.category))).map((category) => (
            <span key={category} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductMappingDemo;
