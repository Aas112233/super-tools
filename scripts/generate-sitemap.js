import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the sitemap generator
const generateSitemap = (await import('../src/utils/sitemapGenerator.ts')).default;

// Generate sitemap
const sitemapContent = generateSitemap();

// Write to public directory
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent);

console.log('Sitemap generated successfully at:', sitemapPath);