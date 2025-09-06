import { chromium } from 'playwright';

// List of all tool URLs based on the routes in App.tsx
const toolUrls = [
  'barcode-generator',
  'base64-encoder-decoder',
  'bionic-text-converter',
  'bionic-reading-converter',
  'bulk-barcode-qr-generator',
  'case-converter',
  'chart-exporter',
  'code-to-image-converter',
  'color-prism',
  'css-background-pattern-generator',
  'css-border-radius-generator',
  'css-checkbox-generator',
  'css-clip-path-generator',
  'css-cubic-bezier-generator',
  'css-formatter',
  'css-glassmorphism-generator',
  'css-loader-generator',
  'css-minifier',
  'css-switch-generator',
  'data-visualization-builder',
  'echarts-integration',
  'font-pairing-finder',
  'google-fonts-pair-finder',
  'graphics-editor',
  'handwriting-generator',
  'html-encoder-decoder',
  'html-formatter',
  'html-minifier',
  'image-average-color-finder',
  'image-color-extractor',
  'image-color-picker',
  'image-resizer',
  'image-to-pdf',
  'image-trimmer',
  'image-background-remover',
  'instagram-filters',
  'instagram-photo-downloader',
  'instagram-post-generator',
  'javascript-formatter',
  'javascript-minifier',
  'json-tree-viewer',
  'jwt-encoder-decoder',
  'letter-counter',
  'list-randomizer',
  'lorem-ipsum-generator',
  'md5-encrypt-decrypt',
  'pdf-add-page-numbers',
  'pdf-add-watermark',
  'pdf-compress',
  'pdf-crop',
  'pdf-extract-pages',
  'pdf-merge',
  'pdf-metadata',
  'pdf-password',
  'pdf-rotate',
  'pdf-split',
  'pdf-to-image',
  'pdf-to-word',
  'photo-filters',
  'qrcode-generator',
  'react-native-shadow-generator',
  'rich-text-editor',
  'sha1-encrypt-decrypt',
  'sha224-encrypt-decrypt',
  'sha256-encrypt-decrypt',
  'sha384-encrypt-decrypt',
  'sha512-encrypt-decrypt',
  'strong-random-password-generator',
  'text-to-handwriting-converter',
  'color-prism-handwriting-converter',
  'url-encoder-decoder',
  'url-slug-generator',
  'whitespace-cleaner',
  'multiple-whitespace-remover'
];

async function checkAllTools() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  console.log(`Starting check of ${toolUrls.length} tools...\n`);

  for (const [index, toolUrl] of toolUrls.entries()) {
    try {
      console.log(`Checking tool ${index + 1}/${toolUrls.length}: ${toolUrl}`);
      
      // Navigate to the tool page
      await page.goto(`http://localhost:5175/tools/${toolUrl}`, { 
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Wait for page to load
      await page.waitForTimeout(5000);
      
      // Check if page loaded by looking for content
      const content = await page.content();
      
      if (content && content.length > 1000) {
        console.log(`✓ ${toolUrl} loaded successfully`);
        results.passed++;
      } else {
        console.log(`✗ ${toolUrl} may not have loaded properly (content too short)`);
        results.failed++;
        results.errors.push(`${toolUrl}: Content too short`);
      }
    } catch (error) {
      console.log(`✗ ${toolUrl} failed to load: ${error.message}`);
      results.failed++;
      results.errors.push(`${toolUrl}: ${error.message}`);
    }
  }

  // Print summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total tools checked: ${toolUrls.length}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(error => console.log(`- ${error}`));
  }

  await browser.close();
}

checkAllTools().catch(console.error);