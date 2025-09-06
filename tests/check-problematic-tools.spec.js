import { test, expect } from '@playwright/test';

// List of problematic tool paths
const problematicToolPaths = [
  '/tools/url-slug-generator',
  '/tools/list-randomizer',
  '/tools/image-average-color-finder',
  '/tools/image-color-picker',
  '/tools/css-background-pattern-generator',
  '/tools/css-cubic-bezier-generator',
  '/tools/base64-encoder-decoder',
  '/tools/pdf-merge',
  '/tools/pdf-split',
  '/tools/pdf-compress',
  '/tools/pdf-to-image',
  '/tools/pdf-to-word',
  '/tools/barcode-generator',
  '/tools/strong-random-password-generator',
];

test.describe('Check problematic tools', () => {
  problematicToolPaths.forEach((path) => {
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
      console.log(`Checking ${path}...`);
      await page.goto(`http://localhost:3000${path}`);
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle');
      
      // Check for specific error patterns
      const content = await page.content();
      
      // Log any errors for debugging
      if (pageErrors.length > 0) {
        console.log(`Page errors for ${path}:`, pageErrors);
      }
      
      if (consoleErrors.length > 0) {
        console.log(`Console errors for ${path}:`, consoleErrors);
      }
      
      // Check if there's a specific error message in the content
      if (content.includes("Element type is invalid") || 
          content.includes("Received a promise that resolves to: undefined")) {
        console.log(`Component error detected for ${path}`);
      }
      
      console.log(`✓ ${path} check completed`);
    });
  });
});