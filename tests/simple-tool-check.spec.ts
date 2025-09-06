import { test, expect } from '@playwright/test';

// List of some tools to check (simplified list)
const TOOL_URLS = [
  '/tools/case-converter',
  '/tools/lorem-ipsum-generator',
  '/tools/image-resizer',
  '/tools/css-glassmorphism-generator',
  '/tools/pdf-merge',
  '/tools/pdf-to-word',
];

test.describe('Simple Tool Check', () => {
  test('Check if tools load without console errors', async ({ page }) => {
    let consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      consoleErrors.push(`[pageerror] ${error.message}`);
    });
    
    for (const toolUrl of TOOL_URLS) {
      consoleErrors = [];
      console.log(`\nChecking ${toolUrl}...`);
      
      try {
        await page.goto(`http://localhost:3004${toolUrl}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // Wait for any errors to appear
        
        if (consoleErrors.length > 0) {
          console.log(`  Console errors found:`);
          consoleErrors.forEach(err => console.log(`    ${err}`));
        } else {
          console.log(`  No console errors detected`);
        }
      } catch (error) {
        console.log(`  Failed to load: ${error}`);
      }
    }
  });
});