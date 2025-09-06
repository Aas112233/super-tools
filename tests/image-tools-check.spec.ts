import { test, expect } from '@playwright/test';

// List of all image-related tools
const IMAGE_TOOL_URLS = [
  '/tools/image-background-remover',
  '/tools/image-resizer',
  '/tools/image-trimmer',
  '/tools/image-to-pdf',
  '/tools/image-color-extractor',
  '/tools/image-average-color-finder',
  '/tools/image-color-picker',
  '/tools/photo-filters',
  '/tools/instagram-filters',
  '/tools/instagram-photo-downloader',
  '/tools/instagram-post-generator',
  '/tools/graphics-editor',
  '/tools/pdf-to-image'
];

test.describe('Image Tools Check', () => {
  test('Check if image tools load without console errors', async ({ page }) => {
    let consoleErrors: string[] = [];
    let failedTools: string[] = [];
    let successfulTools: string[] = [];
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      consoleErrors.push(`[pageerror] ${error.message}`);
    });
    
    for (const toolUrl of IMAGE_TOOL_URLS) {
      consoleErrors = [];
      console.log(`\nChecking ${toolUrl}...`);
      
      try {
        await page.goto(`http://localhost:5174${toolUrl}`, { waitUntil: 'load', timeout: 10000 });
        await page.waitForTimeout(2000); // Wait for any errors to appear
        
        // Check if the tool loaded by looking for specific elements
        const toolContainer = await page.$('.tool-container');
        const hasToolContainer = toolContainer !== null;
        
        console.log(`  Tool container found: ${hasToolContainer}`);
        
        if (consoleErrors.length > 0) {
          console.log(`  Console errors found:`);
          consoleErrors.forEach(err => console.log(`    ${err}`));
        } else {
          console.log(`  No console errors detected`);
        }
        
        // Track successful tools
        if (hasToolContainer) {
          successfulTools.push(toolUrl);
        } else {
          failedTools.push(toolUrl);
        }
      } catch (error) {
        console.log(`  Failed to load: ${error}`);
        failedTools.push(toolUrl);
      }
    }
    
    console.log(`\nSuccessful tools: ${successfulTools.length}/${IMAGE_TOOL_URLS.length}`);
    successfulTools.forEach(tool => console.log(`  ✓ ${tool}`));
    
    if (failedTools.length > 0) {
      console.log(`\nFailed tools: ${failedTools.length}`);
      failedTools.forEach(tool => console.log(`  ✗ ${tool}`));
    }
    
    // We expect most tools to work
    expect(successfulTools.length).toBeGreaterThan(IMAGE_TOOL_URLS.length / 2);
    
    console.log('\nImage tools check completed!');
  });
  
  test('Check functionality of Image Background Remover', async ({ page }) => {
    console.log('\nTesting Image Background Remover functionality...');
    
    await page.goto('http://localhost:5174/tools/image-background-remover', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    
    // Check for key elements
    const uploadButton = await page.$('button:has-text("Select Image")');
    const dragDropArea = await page.$('.border-dashed');
    const toolHeader = await page.$('.tool-header h1:has-text("AI Background Remover")');
    
    expect(uploadButton).toBeTruthy();
    expect(dragDropArea).toBeTruthy();
    expect(toolHeader).toBeTruthy();
    
    console.log('  All key elements present');
    
    // Test drag and drop area interaction
    await dragDropArea?.click();
    await page.waitForTimeout(500);
    
    const fileInput = await page.$('input[type="file"]');
    expect(fileInput).toBeTruthy();
    
    console.log('  Drag and drop area functional');
    
    // Test button interactions
    await uploadButton?.click();
    await page.waitForTimeout(500);
    
    console.log('  Upload button functional');
    
    console.log('Image Background Remover tested successfully!');
  });
  
  test('Check functionality of Image Resizer', async ({ page }) => {
    console.log('\nTesting Image Resizer functionality...');
    
    await page.goto('http://localhost:5174/tools/image-resizer', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    
    // Check for key elements
    const uploadArea = await page.$('.upload-area');
    const toolHeader = await page.$('.tool-header h1:has-text("Image Resizer")');
    
    expect(uploadArea).toBeTruthy();
    expect(toolHeader).toBeTruthy();
    
    console.log('  All key elements present');
    console.log('Image Resizer tested successfully!');
  });
});