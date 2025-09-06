import { chromium } from 'playwright';

async function inspectLocalhost5176() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`Console: ${msg.type()} - ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`Page error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`Request failed: ${request.url()} ${request.failure().errorText}`);
  });
  
  try {
    console.log('Navigating to localhost:5176...');
    await page.goto('http://localhost:5176', { 
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
    
    // Check for visible elements
    const visibleElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 style.opacity !== '0' &&
                 el.textContent?.trim() !== '';
        })
        .map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent?.substring(0, 50)
        }));
    });
    
    console.log('Number of visible elements:', visibleElements.length);
    
    // Check for specific error messages in the content
    if (content.includes('WebSocket') || content.includes('Failed')) {
      console.log('Page contains error messages related to WebSocket');
    }
    
    console.log('Page inspection complete. Check the browser for visual confirmation.');
    console.log('The browser will remain open. Close it manually when you are done.');
    
  } catch (error) {
    console.error('Error:', error.message);
    await browser.close();
  }
}

inspectLocalhost5176();