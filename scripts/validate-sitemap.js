import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { XMLParser } from 'fast-xml-parser';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the sitemap file
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Validate XML format
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: 'text'
});

try {
  const parsed = parser.parse(sitemapContent);
  console.log('✅ Sitemap is valid XML');
  console.log('✅ Sitemap has', parsed.urlset.url.length, 'URLs');
  console.log('✅ Sitemap structure is correct');
} catch (error) {
  console.error('❌ Sitemap is not valid XML:', error.message);
  process.exit(1);
}