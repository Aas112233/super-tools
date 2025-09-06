// Generate sitemap for improved SEO indexing
const generateSitemap = () => {
  const baseUrl = 'https://1001s.info';
  
  // Complete list of all tool paths from TOOLS_REGISTRY
  const toolPaths = [
    '/tools/barcode-generator',
    '/tools/base64-encoder-decoder',
    '/tools/bionic-text-converter',
    '/tools/bionic-reading-converter',
    '/tools/bulk-barcode-qr-generator',
    '/tools/case-converter',
    '/tools/chart-exporter',
    '/tools/code-to-image-converter',
    '/tools/color-prism',
    '/tools/color-prism-handwriting-converter',
    '/tools/css-background-pattern-generator',
    '/tools/css-border-radius-generator',
    '/tools/css-checkbox-generator',
    '/tools/css-clip-path-generator',
    '/tools/css-cubic-bezier-generator',
    '/tools/css-formatter',
    '/tools/css-glassmorphism-generator',
    '/tools/css-loader-generator',
    '/tools/css-minifier',
    '/tools/css-switch-generator',
    '/tools/data-visualization-builder',
    '/tools/echarts-integration',
    '/tools/font-pairing-finder',
    '/tools/graphics-editor',
    '/tools/handwriting-generator',
    '/tools/html-encoder-decoder',
    '/tools/html-formatter',
    '/tools/html-minifier',
    '/tools/image-average-color-finder',
    '/tools/image-color-extractor',
    '/tools/image-color-picker',
    '/tools/image-resizer',
    '/tools/image-to-pdf',
    '/tools/image-trimmer',
    '/tools/instagram-filters',
    '/tools/instagram-photo-downloader',
    '/tools/instagram-post-generator',
    '/tools/javascript-formatter',
    '/tools/javascript-minifier',
    '/tools/json-tree-viewer',
    '/tools/jwt-encoder-decoder',
    '/tools/letter-counter',
    '/tools/list-randomizer',
    '/tools/lorem-ipsum-generator',
    '/tools/md5-encrypt-decrypt',
    '/tools/pdf-add-page-numbers',
    '/tools/pdf-add-watermark',
    '/tools/pdf-compress',
    '/tools/pdf-crop',
    '/tools/pdf-extract-pages',
    '/tools/pdf-merge',
    '/tools/pdf-metadata',
    '/tools/pdf-password',
    '/tools/pdf-rotate',
    '/tools/pdf-split',
    '/tools/pdf-to-image',
    '/tools/pdf-to-word',
    '/tools/photo-filters',
    '/tools/qrcode-generator',
    '/tools/react-native-shadow-generator',
    '/tools/rich-text-editor',
    '/tools/sha1-encrypt-decrypt',
    '/tools/sha224-encrypt-decrypt',
    '/tools/sha256-encrypt-decrypt',
    '/tools/sha384-encrypt-decrypt',
    '/tools/sha512-encrypt-decrypt',
    '/tools/strong-random-password-generator',
    '/tools/text-to-handwriting-converter',
    '/tools/url-encoder-decoder',
    '/tools/url-slug-generator',
    '/tools/whitespace-cleaner'
  ];
  
  // Category pages
  const categoryPaths = [
    '/tools/dashboard',
    '/tools/text-tools',
    '/tools/color-tools', 
    '/tools/image-tools',
    '/tools/css-tools',
    '/tools/developer-tools',
    '/tools/pdf-tools',
    '/tools/social-tools',
    '/tools/utility-tools'
  ];

  // Generate sitemap XML
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Category Pages -->
  ${categoryPaths.map(path => `<url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n  ')}
  <!-- Individual Tools -->
  ${toolPaths.map(path => `<url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n  ')}
</urlset>`;

  return sitemap;
};

export default generateSitemap;