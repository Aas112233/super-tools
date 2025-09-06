import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the sitemap file
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Create a simple server to serve the sitemap
const server = createServer((req, res) => {
  if (req.url === '/sitemap.xml') {
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

const serverInstance = server.listen(0, () => {
  const port = serverInstance.address().port;
  console.log(`Test server running at http://localhost:${port}/sitemap.xml`);
  
  // Now check the headers
  import('node-fetch').then(({ default: fetch }) => {
    fetch(`http://localhost:${port}/sitemap.xml`)
      .then(response => {
        console.log('Status:', response.status);
        console.log('Headers:');
        for (const [key, value] of response.headers.entries()) {
          console.log(`  ${key}: ${value}`);
        }
        
        // Close the server
        serverInstance.close();
      })
      .catch(error => {
        console.error('Error:', error);
        serverInstance.close();
      });
  });
});