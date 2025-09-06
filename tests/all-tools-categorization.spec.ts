import { test, expect } from '@playwright/test';

// List of all tool URLs to check
const ALL_TOOL_URLS = [
  '/tools/case-converter',
  '/tools/lorem-ipsum-generator',
  '/tools/letter-counter',
  '/tools/bionic-text-converter',
  '/tools/multiple-whitespace-remover',
  '/tools/google-fonts-pair-finder',
  '/tools/text-to-handwriting-converter',
  '/tools/image-cropper',
  '/tools/image-filters',
  '/tools/image-resizer',
  '/tools/image-average-color-finder',
  '/tools/image-color-extractor',
  '/tools/image-color-picker',
  '/tools/css-loader-generator',
  '/tools/css-checkbox-generator',
  '/tools/css-switch-generator',
  '/tools/css-clip-path-generator',
  '/tools/css-background-pattern-generator',
  '/tools/css-cubic-bezier-generator',
  '/tools/css-glassmorphism-generator',
  '/tools/css-minifier',
  '/tools/css-formatter',
  '/tools/code-to-image-converter',
  '/tools/url-slug-generator',
  '/tools/react-native-shadow-generator',
  '/tools/base64-encoder-decoder',
  '/tools/html-encoder-decoder',
  '/tools/url-encoder-decoder',
  '/tools/html-minifier',
  '/tools/javascript-minifier',
  '/tools/html-formatter',
  '/tools/javascript-formatter',
  '/tools/md5-encrypt-decrypt',
  '/tools/sha1-encrypt-decrypt',
  '/tools/sha224-encrypt-decrypt',
  '/tools/sha256-encrypt-decrypt',
  '/tools/sha384-encrypt-decrypt',
  '/tools/sha512-encrypt-decrypt',
  '/tools/jwt-encoder-decoder',
  '/tools/json-tree-viewer',
  '/tools/instagram-filters',
  '/tools/instagram-post-generator',
  '/tools/instagram-photo-downloader',
  '/tools/strong-random-password-generator',
  '/tools/list-randomizer',
  '/tools/barcode-generator',
  '/tools/whitespace-cleaner',
  '/tools/handwriting-generator',
  '/tools/data-visualization-builder',
  '/tools/chart-exporter',
  '/tools/graphics-editor',
  '/tools/pdf-merge',
  '/tools/pdf-split',
  '/tools/pdf-compress',
  '/tools/pdf-to-image',
  '/tools/pdf-metadata',
  '/tools/pdf-add-password',
  '/tools/pdf-remove-password',
  '/tools/pdf-change-metadata',
  '/tools/image-to-pdf',
  '/tools/pdf-add-watermark',
  '/tools/pdf-rotate',
  '/tools/pdf-extract-pages',
  '/tools/pdf-crop',
  '/tools/pdf-add-page-numbers',
  '/tools/pdf-to-word',
  '/tools/bulk-barcode-qr-generator',
  '/tools/qr-code-generator',
  '/tools/photo-filters',
  '/tools/image-trimmer',
  '/tools/pdf-password',
  '/tools/e-charts-integration'
];

// Categories for tools
const CATEGORIES = {
  text: [
    '/tools/case-converter',
    '/tools/lorem-ipsum-generator',
    '/tools/letter-counter',
    '/tools/bionic-text-converter',
    '/tools/multiple-whitespace-remover',
    '/tools/google-fonts-pair-finder',
    '/tools/text-to-handwriting-converter',
    '/tools/url-slug-generator',
    '/tools/base64-encoder-decoder',
    '/tools/html-encoder-decoder',
    '/tools/url-encoder-decoder',
    '/tools/html-formatter',
    '/tools/javascript-formatter',
    '/tools/md5-encrypt-decrypt',
    '/tools/sha1-encrypt-decrypt',
    '/tools/sha224-encrypt-decrypt',
    '/tools/sha256-encrypt-decrypt',
    '/tools/sha384-encrypt-decrypt',
    '/tools/sha512-encrypt-decrypt',
    '/tools/jwt-encoder-decoder',
    '/tools/json-tree-viewer',
    '/tools/strong-random-password-generator',
    '/tools/list-randomizer',
    '/tools/barcode-generator',
    '/tools/whitespace-cleaner',
    '/tools/handwriting-generator',
    '/tools/bulk-barcode-qr-generator',
    '/tools/qr-code-generator'
  ],
  image: [
    '/tools/image-cropper',
    '/tools/image-filters',
    '/tools/image-resizer',
    '/tools/image-average-color-finder',
    '/tools/image-color-extractor',
    '/tools/image-color-picker',
    '/tools/instagram-filters',
    '/tools/instagram-photo-downloader',
    '/tools/image-to-pdf',
    '/tools/photo-filters',
    '/tools/image-trimmer'
  ],
  css: [
    '/tools/css-loader-generator',
    '/tools/css-checkbox-generator',
    '/tools/css-switch-generator',
    '/tools/css-clip-path-generator',
    '/tools/css-background-pattern-generator',
    '/tools/css-cubic-bezier-generator',
    '/tools/css-glassmorphism-generator',
    '/tools/css-minifier',
    '/tools/css-formatter',
    '/tools/react-native-shadow-generator'
  ],
  pdf: [
    '/tools/pdf-merge',
    '/tools/pdf-split',
    '/tools/pdf-compress',
    '/tools/pdf-to-image',
    '/tools/pdf-metadata',
    '/tools/pdf-add-password',
    '/tools/pdf-remove-password',
    '/tools/pdf-change-metadata',
    '/tools/pdf-add-watermark',
    '/tools/pdf-rotate',
    '/tools/pdf-extract-pages',
    '/tools/pdf-crop',
    '/tools/pdf-add-page-numbers',
    '/tools/pdf-to-word',
    '/tools/pdf-password'
  ],
  data: [
    '/tools/data-visualization-builder',
    '/tools/chart-exporter',
    '/tools/e-charts-integration'
  ],
  other: [
    '/tools/google-fonts-pair-finder',
    '/tools/code-to-image-converter',
    '/tools/html-minifier',
    '/tools/javascript-minifier',
    '/tools/instagram-post-generator',
    '/tools/graphics-editor'
  ]
};

test.describe('All Tools Categorization Check', () => {
  test('Check if all tools pages load and categorize them', async ({ page }) => {
    const failedTools: string[] = [];
    const loadedTools: string[] = [];
    const categorizedResults: Record<string, { loaded: string[], failed: string[] }> = {
      text: { loaded: [], failed: [] },
      image: { loaded: [], failed: [] },
      css: { loaded: [], failed: [] },
      pdf: { loaded: [], failed: [] },
      data: { loaded: [], failed: [] },
      other: { loaded: [], failed: [] }
    };
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[Console Error] ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      console.log(`[Page Error] ${error.message}`);
    });
    
    // Check each tool
    for (const toolUrl of ALL_TOOL_URLS) {
      console.log(`\nChecking ${toolUrl}...`);
      
      try {
        await page.goto(`http://localhost:3000${toolUrl}`, { waitUntil: 'networkidle' });
        
        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Check if page loaded successfully
        const title = await page.title();
        const is404 = title.includes('404');
        const isError = title.includes('Error');
        
        // Determine category
        let category = 'other';
        for (const [cat, tools] of Object.entries(CATEGORIES)) {
          if (tools.includes(toolUrl)) {
            category = cat;
            break;
          }
        }
        
        if (is404 || isError) {
          console.log(`  Failed to load: Page shows ${is404 ? '404' : 'Error'}`);
          failedTools.push(toolUrl);
          categorizedResults[category].failed.push(toolUrl);
        } else {
          console.log(`  Successfully loaded: ${title}`);
          loadedTools.push(toolUrl);
          categorizedResults[category].loaded.push(toolUrl);
        }
      } catch (error) {
        console.log(`  Failed to load: ${error}`);
        
        // Determine category
        let category = 'other';
        for (const [cat, tools] of Object.entries(CATEGORIES)) {
          if (tools.includes(toolUrl)) {
            category = cat;
            break;
          }
        }
        
        failedTools.push(toolUrl);
        categorizedResults[category].failed.push(toolUrl);
      }
    }
    
    // Print summary
    console.log(`\n=== ALL TOOLS CHECK SUMMARY ===`);
    console.log(`Total tools checked: ${ALL_TOOL_URLS.length}`);
    console.log(`Successfully loaded: ${loadedTools.length}`);
    console.log(`Failed to load: ${failedTools.length}`);
    
    console.log(`\n=== CATEGORIZED RESULTS ===`);
    for (const [category, results] of Object.entries(categorizedResults)) {
      const total = results.loaded.length + results.failed.length;
      console.log(`\n${category.toUpperCase()} TOOLS (${total} total):`);
      console.log(`  Loaded: ${results.loaded.length}`);
      if (results.loaded.length > 0) {
        results.loaded.forEach(tool => console.log(`    ✓ ${tool}`));
      }
      console.log(`  Failed: ${results.failed.length}`);
      if (results.failed.length > 0) {
        results.failed.forEach(tool => console.log(`    ✗ ${tool}`));
      }
    }
    
    // Print simple list of failed tools
    if (failedTools.length > 0) {
      console.log(`\n=== FAILED TOOLS LIST ===`);
      failedTools.forEach(tool => console.log(`  ✗ ${tool}`));
    }
    
    // Expectation: All tools should load without failure
    expect(failedTools.length, `The following tools failed to load: ${failedTools.join(', ')}`).toBe(0);
  });
});