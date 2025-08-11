/*
  scripts/upgrade-existing-blog-posts.js
  Mejora entradas de blog Markdown existentes con:
  - Resumen ejecutivo
  - Comparativa rápida de productos (basada en tags/keywords)
  - Ajustes menores de imágenes Unsplash (asegura tamaño/calidad)

  Uso: node scripts/upgrade-existing-blog-posts.js
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rutas a revisar
const TARGET_DIRS = [
  path.join(process.cwd(), 'docs', 'blog'),
  path.join(process.cwd(), 'examples'),
];

// Palabras clave → tags de catálogo interno
const KEYWORD_TO_TAG = [
  { re: /(snorkel|aletas|buceo|máscara)/i, tag: 'snorkel' },
  { re: /(gps|garmin|plotter)/i, tag: 'gps' },
  { re: /(gopro|c[aá]mara|acción)/i, tag: 'tecnologia' },
  { re: /(nevera|cooler|coleman)/i, tag: 'nevera' },
  { re: /(botiqu[ií]n|auxilios|emergencia)/i, tag: 'botiquin' },
  { re: /(gafas\s+sol|polarizadas|sombrero|gorra)/i, tag: 'gafas' },
  { re: /(deportes\s+acu[aá]ticos|wakeboard|esqu[ií]s|donut|cabo)/i, tag: 'deportes' },
  { re: /(ropa|baño|toalla|impermeable)/i, tag: 'ropa' },
  { re: /(comida|bebida|agua|conservas)/i, tag: 'comida' },
  { re: /(limpieza|basura|bolsa\s+estanca)/i, tag: 'limpieza' },
  { re: /(documentaci[oó]n|dni|licencia|pasaporte)/i, tag: 'documentacion' },
];

// Carga recomendaciones del mapa existente
let productModule = null;
try {
  const m = await import(path.join(__dirname, '..', 'data', 'productRecommendations.js'));
  productModule = m;
} catch (e) {
  try {
    const mts = await import(path.join(__dirname, '..', 'data', 'productRecommendations.ts'));
    productModule = mts;
  } catch (err) {
    // no-op
  }
}

function readAllMarkdownFiles() {
  const files = [];
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const name of entries) {
      if (name.endsWith('.md')) {
        files.push(path.join(dir, name));
      }
    }
  }
  return files;
}

function ensureExecutiveSummary(md) {
  if (/^##\s+Resumen ejecutivo/im.test(md)) return md;
  const h1Match = md.match(/^#\s+.+/m);
  const insertPos = h1Match ? md.indexOf(h1Match[0]) + h1Match[0].length : 0;
  const summaryBlock = `\n\n## Resumen ejecutivo\n\n- Qué aprenderás: conceptos clave y decisiones prácticas para ${extractTopic(md)}\n- Errores comunes: lo que debes evitar para ahorrar tiempo y dinero\n- Checklist accionable: pasos concretos antes/durante/después\n- Presupuesto estimado: rangos de costes y cómo optimizarlos\n- FAQ: dudas reales resueltas en el artículo\n\n`;
  return md.slice(0, insertPos) + summaryBlock + md.slice(insertPos);
}

function extractTopic(md) {
  const h1 = md.match(/^#\s+(.+)$/m);
  return h1 ? h1[1] : 'tu travesía náutica';
}

function extractTags(md) {
  const tags = new Set();
  for (const rule of KEYWORD_TO_TAG) {
    if (rule.re.test(md)) tags.add(rule.tag);
  }
  return Array.from(tags);
}

function buildComparisonTable(md) {
  if (!productModule || !productModule.getRecommendedProductsForEntry) return '';
  const tags = extractTags(md);
  if (tags.length === 0) return '';
  const products = productModule.getRecommendedProductsForEntry(tags).slice(0, 5);
  if (products.length < 2) return '';

  // Parse price helper
  const parsePrice = (price) => {
    if (!price) return Number.POSITIVE_INFINITY;
    // extrae número tipo "Desde 12.99€" o "12,99€"
    const m = String(price).replace(/\./g, '').match(/([0-9]+)(?:[\.,]([0-9]{1,2}))?/);
    if (!m) return Number.POSITIVE_INFINITY;
    const num = m[1];
    const dec = m[2] ? '.' + m[2] : '';
    return parseFloat(num + dec);
  };

  // Compute badges: best value (min price), premium (max price), bestseller (first item as proxy)
  const withPrice = products.map((p, idx) => ({ p, idx, priceNum: parsePrice(p.price) }));
  const bestValue = withPrice.reduce((a, b) => (b.priceNum < (a?.priceNum ?? Number.POSITIVE_INFINITY) ? b : a), undefined);
  const premium = withPrice.reduce((a, b) => (b.priceNum > (a?.priceNum ?? 0) ? b : a), undefined);
  const bestSeller = withPrice[0];

  const badgeFor = (entry) => {
    if (bestSeller && entry.p.title === bestSeller.p.title) return '🏆 Más vendido';
    if (bestValue && entry.p.title === bestValue.p.title) return '💎 Mejor calidad-precio';
    if (premium && entry.p.title === premium.p.title) return '✨ Premium';
    return '';
  };

  const header = `\n\n## 🔍 Comparativa rápida de productos\n\n| Producto | Badge | Precio | Enlace |\n|---|:--:|---|---|`;
  const rows = withPrice.map(e => {
    const title = e.p.title.replace(/\|/g, ' ');
    const badge = badgeFor(e);
    return `\n| ${title} | ${badge} | ${e.p.price} | [Ver](${e.p.affiliateUrl}) |`;
  }).join('');
  return `${header}${rows}\n\n`;
}

function ensureComparison(md) {
  if (/^##\s+🔍\s+Comparativa rápida de productos/im.test(md)) return md;
  const table = buildComparisonTable(md);
  if (!table) return md;
  // Inserta antes de "Productos Recomendados" si existe, si no al final
  const anchor = md.match(/^##\s+.*Productos Recomendados.*$/im);
  if (anchor) {
    const pos = md.indexOf(anchor[0]);
    return md.slice(0, pos) + table + md.slice(pos);
  }
  return md + table;
}

function normalizeUnsplashParams(md) {
  // Asegurar w=1200&q=80 en imágenes Unsplash con parámetros típicos
  return md.replace(/(https:\/\/images\.unsplash\.com\/[^("\s)]+)(\?[^"\s)]*)?/g, (m, base, qs) => {
    const params = new URLSearchParams((qs || '').replace(/^\?/, ''));
    params.set('w', '1200');
    params.set('q', '80');
    params.set('auto', 'format');
    params.set('fit', 'crop');
    return `${base}?${params.toString()}`;
  });
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;
  updated = ensureExecutiveSummary(updated);
  updated = ensureComparison(updated);
  updated = normalizeUnsplashParams(updated);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Mejorado: ${path.relative(process.cwd(), filePath)}`);
  } else {
    console.log(`ℹ️ Sin cambios: ${path.relative(process.cwd(), filePath)}`);
  }
}

async function main() {
  const files = readAllMarkdownFiles();
  if (files.length === 0) {
    console.log('No se encontraron archivos Markdown en docs/blog o examples');
    return;
  }
  files.forEach(processFile);
}

await main();


