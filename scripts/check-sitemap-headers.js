import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a simple server to serve the sitemap
const server = createServer((req, res) => {
  if (req.url === '/sitemap.xml') {
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    res.writeHead(200, {
      'Content-Type': 'application/xml',
      'Content-Length': Buffer.byteLength(sitemapContent)
    });
    
    res.end(sitemapContent);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3001, () => {
  console.log('Test server running at http://localhost:3001/sitemap.xml');
});