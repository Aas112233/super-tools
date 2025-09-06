import { chromium } from 'playwright';

async function errorCheck() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  // Listen for request failures
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), request.failure()?.errorText);
  });
  
  try {
    console.log('Navigating to code-to-image-converter page...');
    const response = await page.goto('http://localhost:3000/tools/code-to-image-converter');
    console.log('Response status:', response?.status());
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check for any JavaScript errors
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });
    
    console.log('Errors found:', errors);
    
  } catch (error) {
    console.error('Navigation error:', error.message);
  } finally {
    await browser.close();
  }
}

errorCheck();