import { test, expect } from '@playwright/test';

test.describe('Check key tools functionality', () => {
  test('should open Case Converter tool without errors', async ({ page }) => {
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
    await page.goto('http://localhost:3002/tools/case-converter');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded without errors
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    
    // Check that the page has content
    const content = await page.content();
    expect(content).toContain('Case Converter');
    
    console.log('✓ Case Converter tool loaded successfully');
  });
  
  test('should open Lorem Ipsum Generator tool without errors', async ({ page }) => {
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
    await page.goto('http://localhost:3002/tools/lorem-ipsum-generator');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded without errors
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    
    // Check that the page has content
    const content = await page.content();
    expect(content).toContain('Lorem Ipsum Generator');
    
    console.log('✓ Lorem Ipsum Generator tool loaded successfully');
  });
  
  test('should open Image Average Color Finder tool without errors', async ({ page }) => {
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
    await page.goto('http://localhost:3002/tools/image-average-color-finder');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded without errors
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    
    // Check that the page has content
    const content = await page.content();
    expect(content).toContain('Image Average Color Finder');
    
    console.log('✓ Image Average Color Finder tool loaded successfully');
  });
  
  test('should open Strong Random Password Generator tool without errors', async ({ page }) => {
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
    await page.goto('http://localhost:3002/tools/strong-random-password-generator');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded without errors
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    
    // Check that the page has content
    const content = await page.content();
    expect(content).toContain('Strong Random Password Generator');
    
    console.log('✓ Strong Random Password Generator tool loaded successfully');
  });
  
  test('should open dashboard without errors', async ({ page }) => {
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
    
    // Navigate to the dashboard
    await page.goto('http://localhost:3002/tools/dashboard');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded without errors
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    
    // Check that the page has content
    const content = await page.content();
    expect(content).toContain('1001s.info');
    
    console.log('✓ Dashboard loaded successfully');
  });
});