import React from 'react';
import { AmazonProductButton, AmazonProductGrid } from './AmazonProductButton';
import { SustainabilityProducts, SafetyProducts, TechnologyProducts } from './ProductShowcase';

// Ejemplo de productos de sostenibilidad
const sustainabilityProducts = [
  {
    title: 'Panel Solar Marino 100W',
    price: '€89.99',
    rating: 4.5,
    category: 'energia' as const,
    badge: 'eco' as const,
    href: 'https://www.amazon.es/s?k=panel+solar+marino+100w&tag=explorashop18-21'
  },
  {
    title: 'Kit Limpieza Ecológica',
    price: '€24.99',
    rating: 4.6,
    category: 'limpieza' as const,
    badge: 'eco' as const,
    href: 'https://www.amazon.es/s?k=kit+limpieza+ecologica+nautica&tag=explorashop18-21'
  },
  {
    title: 'Botella Acero Inoxidable 1L',
    price: '€18.99',
    rating: 4.7,
    category: 'sostenibilidad' as const,
    badge: 'eco' as const,
    href: 'https://www.amazon.es/s?k=botella+acero+inoxidable+1l&tag=explorashop18-21'
  },
  {
    title: 'Cargador Solar Portátil',
    price: '€45.99',
    rating: 4.3,
    category: 'energia' as const,
    badge: 'mas-vendido' as const,
    href: 'https://www.amazon.es/s?k=cargador+solar+portatil+20000mah&tag=explorashop18-21'
  }
];

// Ejemplo de productos de seguridad
const safetyProducts = [
  {
    title: 'Chaleco Salvavidas Homologado',
    price: '€89.99',
    rating: 4.8,
    category: 'seguridad' as const,
    badge: 'mas-vendido' as const,
    href: 'https://www.amazon.es/s?k=chaleco+salvavidas+homologado&tag=explorashop18-21'
  },
  {
    title: 'GPS Náutico Portátil',
    price: '€199.99',
    rating: 4.4,
    category: 'tecnologia' as const,
    badge: 'nuevo' as const,
    href: 'https://www.amazon.es/s?k=gps+nautico+portatil&tag=explorashop18-21'
  },
  {
    title: 'Linterna LED Resistente',
    price: '€32.99',
    rating: 4.5,
    category: 'seguridad' as const,
    href: 'https://www.amazon.es/s?k=linterna+led+resistente+agua&tag=explorashop18-21'
  }
];

// Ejemplo de productos de tecnología
const technologyProducts = [
  {
    title: 'Garmin fēnix 7 GPS',
    price: '€599.99',
    rating: 4.6,
    category: 'tecnologia' as const,
    badge: 'oferta' as const,
    href: 'https://www.amazon.es/dp/B09M47HFCQ?tag=explorashop18-21'
  },
  {
    title: 'GoPro HERO11 Black',
    price: '€399.99',
    rating: 4.7,
    category: 'tecnologia' as const,
    badge: 'mas-vendido' as const,
    href: 'https://www.amazon.es/dp/B0B1T4TVTS?tag=explorashop18-21'
  },
  {
    title: 'Cámara Subacuática',
    price: '€89.99',
    rating: 4.3,
    category: 'tecnologia' as const,
    href: 'https://www.amazon.es/s?k=camara+subacuatica&tag=explorashop18-21'
  }
];

export const BlogProductExample: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🛍️ Ejemplo de Productos con Botones Premium
      </h1>

      {/* Productos de Sostenibilidad */}
      <SustainabilityProducts products={sustainabilityProducts} />

      {/* Productos de Seguridad */}
      <SafetyProducts products={safetyProducts} />

      {/* Productos de Tecnología */}
      <TechnologyProducts products={technologyProducts} />

      {/* Ejemplo de botón individual */}
      <div className="my-8">
        <h3 className="text-xl font-bold text-center mb-4">Botón Individual Premium</h3>
        <div className="max-w-md mx-auto">
          <AmazonProductButton
            title="Panel Solar Marino 200W Premium"
            price="€159.99"
            rating={4.8}
            category="energia"
            badge="oferta"
            href="https://www.amazon.es/s?k=panel+solar+marino+200w&tag=explorashop18-21"
          />
        </div>
      </div>

      {/* Ejemplo de grid personalizado */}
      <div className="my-8">
        <h3 className="text-xl font-bold text-center mb-4">Grid Personalizado (3 columnas)</h3>
        <AmazonProductGrid
          products={[
            {
              title: 'Nevera Portátil Coleman',
              price: '€79.99',
              rating: 4.4,
              category: 'equipamiento',
              href: 'https://www.amazon.es/s?k=nevera+portatil+coleman&tag=explorashop18-21'
            },
            {
              title: 'Kit Herramientas Náuticas',
              price: '€45.99',
              rating: 4.2,
              category: 'equipamiento',
              href: 'https://www.amazon.es/s?k=kit+herramientas+nauticas&tag=explorashop18-21'
            },
            {
              title: 'Protector Solar Resistente',
              price: '€12.99',
              rating: 4.6,
              category: 'limpieza',
              badge: 'eco',
              href: 'https://www.amazon.es/s?k=protector+solar+resistente+agua&tag=explorashop18-21'
            }
          ]}
          columns={3}
        />
      </div>
    </div>
  );
}; 