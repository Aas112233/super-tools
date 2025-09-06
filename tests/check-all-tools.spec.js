import { test, expect } from '@playwright/test';

// List of all tool paths
const toolPaths = [
  // Text Tools
  '/tools/case-converter',
  '/tools/lorem-ipsum-generator',
  '/tools/letter-counter',
  '/tools/bionic-text-converter',
  '/tools/whitespace-cleaner',
  '/tools/url-slug-generator',
  '/tools/html-formatter',
  '/tools/javascript-formatter',
  '/tools/list-randomizer',
  '/tools/handwriting-generator',
  
  // Image Tools
  '/tools/image-resizer',
  '/tools/image-average-color-finder',
  '/tools/image-color-extractor',
  '/tools/image-color-picker',
  '/tools/photo-filters',
  '/tools/image-trimmer',
  
  // CSS Tools
  '/tools/css-loader-generator',
  '/tools/css-checkbox-generator',
  '/tools/css-switch-generator',
  '/tools/css-clip-path-generator',
  '/tools/css-background-pattern-generator',
  '/tools/css-cubic-bezier-generator',
  '/tools/css-glassmorphism-generator',
  
  // Developer Tools
  '/tools/base64-encoder-decoder',
  '/tools/html-encoder-decoder',
  '/tools/url-encoder-decoder',
  '/tools/md5-encrypt-decrypt',
  '/tools/sha1-encrypt-decrypt',
  '/tools/sha224-encrypt-decrypt',
  '/tools/sha256-encrypt-decrypt',
  '/tools/sha384-encrypt-decrypt',
  '/tools/sha512-encrypt-decrypt',
  '/tools/jwt-encoder-decoder',
  '/tools/json-tree-viewer',
  
  // PDF Tools
  '/tools/pdf-merge',
  '/tools/pdf-split',
  '/tools/pdf-compress',
  '/tools/pdf-to-image',
  '/tools/pdf-to-word',
  
  // Other Tools
  '/tools/qr-code-generator',
  '/tools/barcode-generator',
  '/tools/strong-random-password-generator',
  '/tools/google-fonts-pair-finder',
  '/tools/text-to-handwriting-converter',
];

test.describe('Check all developer tools screens', () => {
  toolPaths.forEach((path) => {
    test(`should open ${path} without errors`, async ({ page }) => {
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Listen for page errors
      const pageErrors = [];
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });
      
      // Navigate to the tool page
      await page.goto(`http://localhost:3000${path}`);
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle');
      
      // Check that the page loaded without errors
      expect(pageErrors).toHaveLength(0);
      expect(consoleErrors).toHaveLength(0);
      
      // Check that the page has content
      const content = await page.content();
      expect(content.length).toBeGreaterThan(1000); // Basic check that page has content
      
      console.log(`✓ ${path} loaded successfully`);
    });
  });
  
  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/tools/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that the dashboard loaded
    const title = await page.title();
    expect(title).toContain('1001s.info');
    
    console.log('✓ Dashboard loaded successfully');
  });
});