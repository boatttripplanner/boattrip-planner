import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import blog data
const blogDataPath = path.join(__dirname, '../src/blogData.ts');
const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

// Extract blog posts from the file
const extractBlogPosts = (content) => {
  const posts = [];
  const slugRegex = /slug:\s*'([^']+)'/g;
  const titleRegex = /title:\s*'([^']+)'/g;
  
  let match;
  const slugs = [];
  const titles = [];
  
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  
  while ((match = titleRegex.exec(content)) !== null) {
    titles.push(match[1]);
  }
  
  // Match slugs with titles (assuming they're in the same order)
  for (let i = 0; i < slugs.length; i++) {
    if (titles[i]) {
      posts.push({
        slug: slugs[i],
        title: titles[i]
      });
    }
  }
  
  return posts;
};

const blogPosts = extractBlogPosts(blogDataContent);

// Generate sitemap XML
const generateSitemap = () => {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  
  <!-- Página principal - Máxima prioridad -->
  <url>
    <loc>https://boattrip-planner.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://boattrip-planner.com/og-image.png</image:loc>
      <image:title>BoatTrip Planner - Planificador de Viajes en Barco</image:title>
    </image:image>
  </url>
  
  <!-- Páginas principales de la aplicación -->
  <url>
    <loc>https://boattrip-planner.com/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://boattrip-planner.com/how-it-works</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog principal - Alta prioridad -->
  <url>
    <loc>https://boattrip-planner.com/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Página 404 personalizada - Baja prioridad pero rastreable -->
  <url>
    <loc>https://boattrip-planner.com/404</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`;

  // Add blog posts
  blogPosts.forEach(post => {
    sitemap += `
  
  <!-- Entrada de blog: ${post.title} -->
  <url>
    <loc>https://boattrip-planner.com/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://boattrip-planner.com/og-image.png</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Write sitemap to file
const sitemapContent = generateSitemap();
const sitemapPath = path.join(__dirname, '../sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

console.log(`✅ Sitemap generado exitosamente con ${blogPosts.length} entradas de blog`);
console.log(`📁 Archivo guardado en: ${sitemapPath}`);
console.log(`📊 Total de URLs: ${blogPosts.length + 4}`); // +4 for main pages 