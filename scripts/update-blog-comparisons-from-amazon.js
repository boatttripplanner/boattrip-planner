/*
  scripts/update-blog-comparisons-from-amazon.js
  Actualiza tablas de "Comparativa rápida de productos" en posts Markdown usando Amazon PA-API (v5).

  - Extrae ASINs de las tablas existentes
  - Consulta precios, ratings y reviews en tiempo real
  - Recalcula badges (🏆 Más vendido, 💎 Mejor calidad-precio, ✨ Premium)
  - Reescribe la tabla manteniendo el formato

  Uso:
    node scripts/update-blog-comparisons-from-amazon.js

  Configuración (recomendado por variables de entorno):
    AMAZON_ACCESS_KEY_ID, AMAZON_SECRET_ACCESS_KEY, AMAZON_ASSOCIATE_TAG
    AMAZON_PAAPI_HOST (opcional, por defecto webservices.amazon.com)
    AMAZON_PAAPI_REGION (opcional, por defecto eu-west-1)
    AMAZON_MARKETPLACE (opcional, por defecto amazon.es)
*/

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, 'docs', 'blog'),
  path.join(ROOT, 'examples')
];

// Config Amazon - usa ENV si existen; fallback a valores del proyecto
const AMAZON_API_CONFIG = {
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID || 'AKPAXD3F0H1753982397',
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY || 'UUY08lWjgs40wYKps1NGLx8RjA2zAXYoQ5e6fw33',
  associateTag: process.env.AMAZON_ASSOCIATE_TAG || 'explorashop18-21',
  marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.es',
  region: process.env.AMAZON_PAAPI_REGION || 'eu-west-1',
  host: process.env.AMAZON_PAAPI_HOST || 'webservices.amazon.es',
  service: 'ProductAdvertisingAPI'
};

// --- Helpers Amazon Signature V4 ---
function isoDateBasic(date = new Date()) {
  return date.toISOString().replace(/[:-]|\..+/g, '');
}

function generateSignature(method, pathname, queryParams, headers, payload = '') {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');

  const operation = pathname.includes('searchitems') ? 'SearchItems' : 'GetItems';
  const target = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`;
  const signedHeaders = {
    host: AMAZON_API_CONFIG.host,
    'x-amz-date': isoDateBasic(now),
    'x-amz-target': target,
    'content-type': 'application/json; charset=utf-8'
  };

  const canonicalHeaders = Object.keys(signedHeaders)
    .sort()
    .map(k => `${k}:${signedHeaders[k]}`)
    .join('\n') + '\n';

  const signedHeadersString = Object.keys(signedHeaders).sort().join(';');
  const canonicalRequest = [
    method,
    `/paapi5/${pathname}`,
    queryParams,
    canonicalHeaders,
    signedHeadersString,
    crypto.createHash('sha256').update(payload).digest('hex')
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${AMAZON_API_CONFIG.region}/${AMAZON_API_CONFIG.service}/aws4_request`;
  const stringToSign = [
    algorithm,
    signedHeaders['x-amz-date'],
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const dateKey = crypto.createHmac('sha256', `AWS4${AMAZON_API_CONFIG.secretAccessKey}`).update(dateStamp).digest();
  const dateRegionKey = crypto.createHmac('sha256', dateKey).update(AMAZON_API_CONFIG.region).digest();
  const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update(AMAZON_API_CONFIG.service).digest();
  const signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  return {
    ...signedHeaders,
    authorization: `${algorithm} Credential=${AMAZON_API_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersString}, Signature=${signature}`
  };
}

async function paapiGetItems(asins) {
  if (!asins || asins.length === 0) return {};
  // PA-API permite hasta 10 ASINs por petición
  const batched = [];
  for (let i = 0; i < asins.length; i += 10) batched.push(asins.slice(i, i + 10));

  const results = {};
  for (const batch of batched) {
    const payload = {
      ItemIds: batch,
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating',
        'Images.Primary.Large'
      ],
      PartnerTag: AMAZON_API_CONFIG.associateTag,
      PartnerType: 'Associates',
      Marketplace: AMAZON_API_CONFIG.marketplace
    };

    const headers = generateSignature('POST', 'getitems', '', {}, JSON.stringify(payload));
    const resp = await fetch(`https://${AMAZON_API_CONFIG.host}/paapi5/getitems`, {
      method: 'POST',
      headers: { ...headers, 'content-length': Buffer.byteLength(JSON.stringify(payload)).toString() },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Amazon API error ${resp.status} ${resp.statusText}: ${text}`);
    }

    const data = await resp.json();
    const items = data.ItemsResult?.Items || [];
    for (const item of items) {
      const asin = item.ASIN;
      results[asin] = {
        asin,
        title: item.ItemInfo?.Title?.DisplayValue || asin,
        price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'No disponible',
        rating: Number(item.CustomerReviews?.StarRating?.Value || 0),
        reviewCount: Number(item.CustomerReviews?.Count || 0),
        affiliateUrl: createAffiliateUrl(asin)
      };
    }
  }

  return results;
}

function createAffiliateUrl(asin) {
  const baseUrl = `https://www.${AMAZON_API_CONFIG.marketplace}/dp/${asin}`;
  const params = new URLSearchParams({
    tag: AMAZON_API_CONFIG.associateTag,
    linkCode: 'ogi',
    th: '1',
    psc: '1',
    ref: 'as_li_ss_tl'
  });
  return `${baseUrl}?${params.toString()}`;
}

// --- Markdown parsing helpers ---
function readAllMarkdownFiles() {
  const files = [];
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.md')) files.push(path.join(dir, name));
    }
  }
  return files;
}

function extractComparisonBlock(md) {
  const headerRegex = /^##\s+🔍\s+Comparativa rápida de productos\s*$/im;
  const match = md.match(headerRegex);
  if (!match) return null;
  const start = md.indexOf(match[0]);
  // Find next H2 or end of file
  const rest = md.slice(start + match[0].length);
  const nextH2Idx = rest.search(/\n##\s+/m);
  const end = nextH2Idx === -1 ? md.length : start + match[0].length + nextH2Idx;
  return { start, end, block: md.slice(start, end) };
}

function extractAsinsFromBlock(block) {
  const asins = new Set();
  const linkRegex = /\((https?:[^)]+)\)/g; // capture links in table cells
  let m;
  while ((m = linkRegex.exec(block))) {
    const url = m[1];
    const dp = url.match(/\/dp\/([A-Z0-9]{8,12})/i);
    if (dp) {
      asins.add(dp[1].toUpperCase());
      continue;
    }
    const creative = url.match(/(?:creativeASIN|asin)=([A-Z0-9]{8,12})/i);
    if (creative) {
      asins.add(creative[1].toUpperCase());
    }
  }
  return Array.from(asins);
}

function parsePriceToNumber(price) {
  if (!price) return Number.POSITIVE_INFINITY;
  const cleaned = String(price).replace(/\./g, '');
  const m = cleaned.match(/([0-9]+)(?:[\.,]([0-9]{1,2}))?/);
  if (!m) return Number.POSITIVE_INFINITY;
  const num = m[1];
  const dec = m[2] ? '.' + m[2] : '';
  return parseFloat(num + dec);
}

function buildUpdatedTable(itemsByAsin) {
  const items = Object.values(itemsByAsin);
  if (items.length < 2) return null;

  // Score for sorting: rating * log(1 + reviews)
  const scored = items.map(p => ({
    p,
    priceNum: parsePriceToNumber(p.price),
    score: (p.rating || 0) * Math.log(1 + (p.reviewCount || 1))
  }));

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 5);
  const eligible = top.filter(t => t.p.rating >= 4.2);
  const bestSeller = eligible.reduce((acc, cur) => cur.p.reviewCount > (acc?.p.reviewCount || 0) ? cur : acc, undefined);
  const bestValue = eligible.reduce((acc, cur) => cur.priceNum < (acc?.priceNum || Number.POSITIVE_INFINITY) ? cur : acc, undefined);
  const premium = eligible.reduce((acc, cur) => cur.priceNum > (acc?.priceNum || 0) ? cur : acc, undefined);

  const badgeFor = (t) => {
    if (bestSeller && t.p.asin === bestSeller.p.asin) return '🏆 Más vendido';
    if (bestValue && t.p.asin === bestValue.p.asin) return '💎 Mejor calidad-precio';
    if (premium && t.p.asin === premium.p.asin && t.p.rating >= 4.5) return '✨ Premium';
    return '';
  };

  const header = `\n\n## 🔍 Comparativa rápida de productos\n\n| Producto | Badge | Precio | Valoración | Opiniones | Enlace |\n|---|:--:|---|---|---|---|`;
  const rows = top.map(t => {
    const p = t.p;
    const stars = '★'.repeat(Math.floor(p.rating || 0));
    return `\n| ${p.title.replace(/\|/g, ' ')} | ${badgeFor(t)} | ${p.price} | ${stars} (${(p.rating || 0).toFixed(1)}) | ${p.reviewCount || 0} | [Ver](${p.affiliateUrl}) |`;
  }).join('');

  return `${header}${rows}\n\n`;
}

function replaceComparisonBlock(md, newTable) {
  const info = extractComparisonBlock(md);
  if (!info) return md; // nothing to replace
  const { start, end } = info;
  return md.slice(0, start) + newTable + md.slice(end);
}

async function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const blockInfo = extractComparisonBlock(original);
  if (!blockInfo) {
    console.log(`ℹ️ Sin comparativa: ${path.relative(ROOT, filePath)}`);
    return false;
  }

  const asins = extractAsinsFromBlock(blockInfo.block);
  if (asins.length < 2) {
    console.log(`ℹ️ Pocos ASINs (${asins.length}): ${path.relative(ROOT, filePath)}`);
    return false;
  }

  const items = await paapiGetItems(asins);
  const newTable = buildUpdatedTable(items);
  if (!newTable) {
    console.log(`ℹ️ No se pudo construir tabla: ${path.relative(ROOT, filePath)}`);
    return false;
  }

  const updated = replaceComparisonBlock(original, newTable);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Actualizado: ${path.relative(ROOT, filePath)}`);
    return true;
  }
  console.log(`ℹ️ Sin cambios: ${path.relative(ROOT, filePath)}`);
  return false;
}

async function main() {
  console.log('🚀 Actualizando comparativas de productos con Amazon PA-API');
  const files = readAllMarkdownFiles();
  if (files.length === 0) {
    console.log('⚠️ No se encontraron archivos Markdown en docs/blog o examples');
    return;
  }

  let changed = 0; let total = 0;
  for (const file of files) {
    total++;
    try {
      const did = await processFile(file);
      if (did) changed++;
      // breve pausa para evitar rate limiting
      await new Promise(r => setTimeout(r, 350));
    } catch (err) {
      console.error(`❌ Error en ${path.relative(ROOT, file)}:`, err.message);
    }
  }
  console.log(`\n📊 Completado. Archivos procesados: ${total}. Actualizados: ${changed}.`);
}

await main();


