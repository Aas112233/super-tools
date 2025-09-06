import { test, expect } from '@playwright/test';

test.describe('Code to Image Converter Tool', () => {
  test('should load the code-to-image-converter tool without redirecting to dashboard', async ({ page }) => {
    console.log('Checking code-to-image-converter tool...');
    
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
    
    try {
      // Navigate to the tool page
      await page.goto('http://localhost:3004/tools/code-to-image-converter', { 
        waitUntil: 'networkidle',
        timeout: 10000
      });
      
      // Wait a bit for the page to load
      await page.waitForTimeout(2000);
      
      // Check that we're not redirected to the dashboard
      const currentUrl = page.url();
      const isRedirected = currentUrl.includes('/tools/dashboard');
      
      if (isRedirected) {
        console.log('❌ Tool redirected to dashboard');
      } else {
        console.log('✓ Tool did not redirect to dashboard');
      }
      
      // Check if there are any JavaScript errors
      if (pageErrors.length > 0) {
        console.log(`❌ Tool has page errors:`, pageErrors);
      } else {
        console.log('✓ Tool loaded without JavaScript errors');
      }
      
      // Check if there are console errors
      if (consoleErrors.length > 0) {
        console.log(`⚠️ Tool has console errors:`, consoleErrors);
      } else {
        console.log('✓ Tool loaded without console errors');
      }
      
      // Check that the page has content
      const content = await page.content();
      const hasContent = content.includes('Code Screenshot Generator') || content.includes('Code to Image') || content.length > 1000;
      
      if (hasContent) {
        console.log('✓ Tool has content');
      } else {
        console.log('❌ Tool appears to be blank or missing content');
      }
      
      // Overall tool status
      if (!isRedirected && pageErrors.length === 0 && hasContent) {
        console.log('✅ Code to Image Converter tool is working correctly');
      } else {
        console.log('❌ Code to Image Converter tool has issues');
      }
      
      // Assertions
      expect(isRedirected).toBeFalsy();
      expect(pageErrors.length).toBe(0);
      expect(hasContent).toBeTruthy();
    } catch (error) {
      console.log('❌ Tool failed to load:', error.message);
      throw error;
    }
  });
});