import { chromium } from 'playwright';

async function inspectViteServer() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable detailed logging
  page.on('console', msg => {
    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`Page error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`Failed request: ${request.url()} - ${request.failure().errorText}`);
  });
  
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`HTTP ${response.status()} for ${response.url()}`);
    }
  });
  
  try {
    console.log('Navigating to the Vite development server on port 5173...');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if any content is visible
    const content = await page.content();
    console.log('Page content length:', content.length);
    
    // Look for WebSocket errors in the page content
    if (content.includes('WebSocket') && (content.includes('failed') || content.includes('error'))) {
      console.log('Page contains WebSocket error messages');
    }
    
    console.log('\nChecking for JavaScript errors in the console...');
    
    // Try to trigger some interaction to see if there are runtime errors
    await page.click('body', { force: true });
    
    console.log('Vite server inspection complete.');
    console.log('Check the opened Chromium browser for the actual page and Developer Tools.');
    console.log('The browser will remain open. Close it manually when you are done.');
    
  } catch (error) {
    console.error('Error during inspection:', error.message);
    await browser.close();
  }
}

inspectViteServer();