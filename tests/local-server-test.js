import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Start the server
const server = app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
  console.log(`Sitemap should be accessible at http://localhost:${port}/sitemap.xml`);
});

// Export the server for potential testing
export { app, server };