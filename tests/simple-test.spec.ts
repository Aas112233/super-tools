import { test, expect } from '@playwright/test';

// List of a few text tools to check
const SIMPLE_TOOL_URLS = [
  '/tools/case-converter',
  '/tools/lorem-ipsum-generator',
  '/tools/letter-counter',
  '/tools/base64-encoder-decoder',
  '/tools/html-encoder-decoder'
];

test.describe('Simple Tools Check', () => {
  test('Check if simple tools pages load correctly', async ({ page }) => {
    const failedTools: string[] = [];
    const loadedTools: string[] = [];
    
    // Check each text tool
    for (const toolUrl of SIMPLE_TOOL_URLS) {
      console.log(`\nChecking ${toolUrl}...`);
      
      try {
        await page.goto(`http://localhost:3000${toolUrl}`, { waitUntil: 'domcontentloaded' });
        
        // Wait for page to load
        await page.waitForTimeout(1000);
        
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
    console.log(`\n=== SIMPLE TOOLS CHECK SUMMARY ===`);
    console.log(`Total tools checked: ${SIMPLE_TOOL_URLS.length}`);
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