// services/affiliateLinkService.ts
// Generación de URLs de afiliado para cualquier producto (sin requerir ASIN)

import { AMAZON_AFFILIATE_TAG } from '../constants';
import { findAffiliateProductByText } from '../data/affiliateCatalog';

// Añade términos náuticos para sesgar resultados a nuestro nicho
const boostNauticalQuery = (raw: string): string => {
  const lower = raw.toLowerCase();
  const boosters = [' náutico', ' barco', ' marino', ' embarcacion'];
  const alreadyNautical = ['náutic', 'barco', 'marin', 'vela', 'nautica', 'náutica', 'embarcacion', 'yate', 'lancha']
    .some(k => lower.includes(k));
  return alreadyNautical ? raw : `${raw} ${boosters[0]}`.trim(); // Solo añadir "náutico" para no saturar
};

// Departamento Amazon para mejorar relevancia (i=...)
const determineDepartment = (query: string): string | undefined => {
  const q = query.toLowerCase();
  if (/(garmin|gps|vhf|radio|plotter|sonda|cargador|solar|bater(i|í)a|power bank|gopro|cámara|camara)/.test(q)) {
    return 'electronics';
  }
  if (/(chaleco|salvavidas|arn(e|é)s|ancla|amarre|snorkel|neopreno|deportes|pesca|boya)/.test(q)) {
    return 'sporting';
  }
  if (/(libro|manual|cartas|guía|guia|examen|cuaderno)/.test(q)) {
    return 'stripbooks'; // Libros
  }
  return undefined;
};

const buildSearchAffiliateLink = (
  query: string,
  linkId: string = 'auto',
  utmContent: string = 'auto',
  department?: string
): string => {
  const boosted = boostNauticalQuery(query);
  const q = encodeURIComponent(boosted);
  const utm = `utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=blog&utm_content=${encodeURIComponent(utmContent)}`;
  const dept = department ? `&i=${encodeURIComponent(department)}` : '';
  return `https://www.amazon.es/s?k=${q}${dept}&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkId=${encodeURIComponent(linkId)}&${utm}`;
};

export const generateAffiliateUrlForProductName = (
  productName: string,
  options?: { linkId?: string; utmContent?: string }
): string => {
  const linkId = options?.linkId || 'auto';
  const utmContent = options?.utmContent || 'auto';

  // 1) Preferencia: producto curado (DP directo)
  const curated = findAffiliateProductByText(productName);
  if (curated?.affiliateUrl) return curated.affiliateUrl;

  // 2) Fallback universal: búsqueda monetizada
  const dept = determineDepartment(productName);
  return buildSearchAffiliateLink(productName, linkId, utmContent, dept);
};

// =============================
// Enlace Guardián (Blog)
// Normaliza cualquier href hacia un destino de Amazon válido, relevante y monetizado
// =============================

const sanitizeQuery = (q: string): string => {
  if (!q) return '';
  // Quitar emojis y caracteres no útiles para búsqueda
  try {
    // Rango amplio de emojis + símbolos
    // eslint-disable-next-line no-control-regex
    return q.replace(/[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
  } catch {
    return q.replace(/[\u2600-\u27BF]/g, '').trim();
  }
};

const addAffiliateTag = (url: URL): URL => {
  url.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
  // Señales típicas de afiliado y tracking SEO-safe
  if (!url.searchParams.get('ref')) url.searchParams.set('ref', 'as_li_ss_tl');
  if (!url.searchParams.get('camp')) url.searchParams.set('camp', '3638');
  if (!url.searchParams.get('creative')) url.searchParams.set('creative', '24630');
  return url;
};

const isDisallowedCategory = (text: string): boolean => {
  const t = text.toLowerCase();
  const disallowed = [
    'pelicula','películas','pelis','movie','movies','cine','dvd','blu-ray','blu ray',
    'videojuego','videojuegos','game','games','xbox','playstation','nintendo','switch',
    'cd','mp3','mp4','blu'
  ];
  return disallowed.some(k => t.includes(k));
};

const buildCuratedOrSearch = (anchorText: string, linkId: string, utmContent: string): string => {
  const text = sanitizeQuery(anchorText) || 'equipamiento nautico';
  const curated = findAffiliateProductByText(text);
  if (curated?.affiliateUrl) return curated.affiliateUrl;
  const dept = determineDepartment(text);
  return buildSearchAffiliateLink(text, linkId, utmContent, dept);
};

export const ensureAffiliateAmazonUrl = (
  href: string,
  anchorText: string,
  options?: { linkId?: string; utmContent?: string }
): string => {
  const linkId = options?.linkId || 'blog_inline';
  const utmContent = options?.utmContent || 'blog';

  // Si el texto apunta a categoría prohibida, forzar búsqueda segura monetizada
  if (isDisallowedCategory(anchorText)) {
    return buildCuratedOrSearch(anchorText, linkId, utmContent);
  }

  // Si no es URL válida o no es Amazon → curado o búsqueda
  let parsed: URL | null = null;
  try {
    parsed = new URL(href);
  } catch {
    return buildCuratedOrSearch(anchorText, linkId, utmContent);
  }

  const host = parsed.hostname.toLowerCase();
  if (!host.includes('amazon.es')) {
    return buildCuratedOrSearch(anchorText, linkId, utmContent);
  }

  // Asegurar tag de afiliado
  addAffiliateTag(parsed);

  const pathname = parsed.pathname;
  // Caso DP: /dp/ASIN
  const asinMatch = pathname.match(/\/dp\/([A-Z0-9]{10})/i);
  if (asinMatch) {
    // Comprobar si tenemos un producto curado mejor para este texto
    const curated = findAffiliateProductByText(sanitizeQuery(anchorText));
    if (curated?.affiliateUrl) {
      // Preferimos el enlace curado que coincide con el texto
      return curated.affiliateUrl;
    }
    return parsed.toString();
  }

  // Caso búsqueda: asegurar query náutica y departamento
  if (pathname.startsWith('/s')) {
    const k = parsed.searchParams.get('k') || sanitizeQuery(anchorText);
    const boosted = boostNauticalQuery(k || 'equipamiento nautico');
    parsed.searchParams.set('k', boosted);
    const dept = determineDepartment(boosted);
    if (dept) parsed.searchParams.set('i', dept);
    return parsed.toString();
  }

  // Otros paths (gp/, shops, etc.): intentar curado; si no, búsqueda segura
  const curated = findAffiliateProductByText(sanitizeQuery(anchorText));
  if (curated?.affiliateUrl) return curated.affiliateUrl;
  const dept = determineDepartment(anchorText);
  return buildSearchAffiliateLink(anchorText || 'equipamiento nautico', linkId, utmContent, dept);
};



