import React from 'react';
import { AmazonProductButton, AmazonProductGrid } from './AmazonProductButton';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Array<{
    title: string;
    price: string;
    rating?: number;
    category: 'sostenibilidad' | 'equipamiento' | 'seguridad' | 'tecnologia' | 'deportes' | 'limpieza' | 'energia' | 'general';
    badge?: 'oferta' | 'mas-vendido' | 'nuevo' | 'eco';
    href: string;
  }>;
  layout?: 'grid' | 'list' | 'featured';
  columns?: 1 | 2 | 3;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  subtitle,
  products,
  layout = 'grid',
  columns = 2
}) => {
  if (layout === 'featured' && products.length > 0) {
    const featuredProduct = products[0];
    const otherProducts = products.slice(1);

    return (
      <div className="my-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        {/* Producto destacado */}
        <div className="mb-6">
          <AmazonProductButton
            {...featuredProduct}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Otros productos en grid */}
        {otherProducts.length > 0 && (
          <AmazonProductGrid
            products={otherProducts}
            columns={columns}
          />
        )}
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="my-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          {products.map((product, index) => (
            <AmazonProductButton
              key={index}
              {...product}
              className="max-w-2xl mx-auto"
            />
          ))}
        </div>
      </div>
    );
  }

  // Layout grid por defecto
  return (
    <div className="my-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <AmazonProductGrid
        products={products}
        columns={columns}
      />
    </div>
  );
};

// Componente específico para productos de sostenibilidad
export const SustainabilityProducts: React.FC<{ products: ProductShowcaseProps['products'] }> = ({ products }) => {
  return (
    <ProductShowcase
      title="🌱 Equipamiento Sostenible Recomendado"
      subtitle="Productos eco-friendly para navegar cuidando el planeta"
      products={products}
      layout="grid"
      columns={2}
    />
  );
};

// Componente específico para productos de seguridad
export const SafetyProducts: React.FC<{ products: ProductShowcaseProps['products'] }> = ({ products }) => {
  return (
    <ProductShowcase
      title="🛟 Equipamiento de Seguridad"
      subtitle="Productos esenciales para navegar con total seguridad"
      products={products}
      layout="featured"
      columns={2}
    />
  );
};

// Componente específico para productos de tecnología
export const TechnologyProducts: React.FC<{ products: ProductShowcaseProps['products'] }> = ({ products }) => {
  return (
    <ProductShowcase
      title="📱 Tecnología Náutica Avanzada"
      subtitle="Los mejores gadgets y equipos tecnológicos para tu barco"
      products={products}
      layout="grid"
      columns={3}
    />
  );
}; 