import { test, expect } from '@playwright/test';

// List of tool URLs to check
const TOOL_URLS = [
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
];

test.describe('Tool Error Checking', () => {
  test('Check tools for errors', async ({ page }) => {
    const errorTools: string[] = [];
    
    // Navigate to the main page first
    await page.goto('http://localhost:3004/');
    
    // Check each tool
    for (const toolUrl of TOOL_URLS) {
      try {
        console.log(`Checking ${toolUrl}...`);
        await page.goto(`http://localhost:3004${toolUrl}`, { waitUntil: 'networkidle' });
        
        // Wait a bit for the page to load
        await page.waitForTimeout(2000);
        
        // Check if there are any console errors
        const errors = await page.evaluate(() => {
          // @ts-ignore
          return window.errorMessages || [];
        });
        
        if (errors.length > 0) {
          console.log(`Errors found in ${toolUrl}:`, errors);
          errorTools.push(toolUrl);
        } else {
          // Check if the page loaded without errors
          const title = await page.title();
          if (title.includes('Error') || title.includes('500')) {
            console.log(`Error page detected for ${toolUrl}`);
            errorTools.push(toolUrl);
          }
        }
      } catch (error) {
        console.log(`Failed to load ${toolUrl}:`, error);
        errorTools.push(toolUrl);
      }
    }
    
    if (errorTools.length > 0) {
      console.log('Tools with errors:', errorTools);
    } else {
      console.log('No errors found in tools');
    }
    
    // Print summary
    console.log(`\nSummary: ${errorTools.length} tools with errors out of ${TOOL_URLS.length} total tools`);
  });
});