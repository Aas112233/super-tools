import { test, expect } from '@playwright/test';

// List of text tools to check
const TEXT_TOOL_URLS = [
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
];

test.describe('Text Tools Check', () => {
  test('Check if all text tools pages load correctly', async ({ page }) => {
    const failedTools: string[] = [];
    const loadedTools: string[] = [];
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[Console Error] ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      console.log(`[Page Error] ${error.message}`);
    });
    
    // Check each text tool
    for (const toolUrl of TEXT_TOOL_URLS) {
      console.log(`\nChecking ${toolUrl}...`);
      
      try {
        await page.goto(`http://localhost:3000${toolUrl}`, { waitUntil: 'networkidle' });
        
        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Check if page loaded successfully
        const title = await page.title();
        const is404 = title.includes('404');
        const isError = title.includes('Error');
        
        if (is404 || isError) {
          console.log(`  Failed to load: Page shows ${is404 ? '404' : 'Error'}`);
          failedTools.push(toolUrl);
        } else {
          console.log(`  Successfully loaded: ${title}`);
          loadedTools.push(toolUrl);
        }
      } catch (error) {
        console.log(`  Failed to load: ${error}`);
        failedTools.push(toolUrl);
      }
    }
    
    // Print summary
    console.log(`\n=== TEXT TOOLS CHECK SUMMARY ===`);
    console.log(`Total tools checked: ${TEXT_TOOL_URLS.length}`);
    console.log(`Successfully loaded: ${loadedTools.length}`);
    console.log(`Failed to load: ${failedTools.length}`);
    
    if (loadedTools.length > 0) {
      console.log(`\nLoaded tools:`);
      loadedTools.forEach(tool => console.log(`  ✓ ${tool}`));
    }
    
    if (failedTools.length > 0) {
      console.log(`\nFailed tools:`);
      failedTools.forEach(tool => console.log(`  ✗ ${tool}`));
    }
    
    // Expectation: All tools should load without failure
    expect(failedTools.length, `The following tools failed to load: ${failedTools.join(', ')}`).toBe(0);
  });
});