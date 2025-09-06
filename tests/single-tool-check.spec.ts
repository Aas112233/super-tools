import { test, expect } from '@playwright/test';

test.describe('Single Tool Check', () => {
  test('Check if sha224-encrypt-decrypt loads correctly', async ({ page }) => {
    console.log('\nChecking /tools/sha224-encrypt-decrypt...');
    
    try {
      await page.goto('http://localhost:3000/tools/sha224-encrypt-decrypt', { waitUntil: 'networkidle' });
      
      // Wait for page to load
      await page.waitForTimeout(3000);
      
      // Check if page loaded successfully
      const title = await page.title();
      const is404 = title.includes('404');
      const isError = title.includes('Error');
      
      if (is404 || isError) {
        console.log(`  Failed to load: Page shows ${is404 ? '404' : 'Error'}`);
        expect.fail(`Page shows ${is404 ? '404' : 'Error'}`);
      } else {
        console.log(`  Successfully loaded: ${title}`);
      }
    } catch (error) {
      console.log(`  Failed to load: ${error}`);
      expect.fail(`Failed to load: ${error}`);
    }
  });
});