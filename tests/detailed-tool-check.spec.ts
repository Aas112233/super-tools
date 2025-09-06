import { test, expect } from '@playwright/test';

test.describe('Detailed Tool Check', () => {
  test('Check if sha224-encrypt-decrypt renders content', async ({ page }) => {
    console.log('\nChecking /tools/sha224-encrypt-decrypt...');
    
    try {
      await page.goto('http://localhost:3000/tools/sha224-encrypt-decrypt', { waitUntil: 'networkidle' });
      
      // Wait for page to load
      await page.waitForTimeout(3000);
      
      // Check if page loaded successfully
      const title = await page.title();
      console.log(`  Page title: ${title}`);
      
      // Check for specific content that should be in the SHA224 tool
      const content = await page.content();
      const hasSha224Content = content.includes('SHA224') || content.includes('Encrypt') || content.includes('Decrypt');
      
      if (hasSha224Content) {
        console.log('  Tool content is rendering correctly');
      } else {
        console.log('  Tool content may not be rendering correctly');
        console.log('  Page appears to be loading the dashboard instead of the specific tool');
      }
      
      // Take a screenshot for visual verification
      await page.screenshot({ path: 'sha224-test-result.png', fullPage: true });
      
    } catch (error) {
      console.log(`  Failed to load: ${error}`);
      expect.fail(`Failed to load: ${error}`);
    }
  });
});