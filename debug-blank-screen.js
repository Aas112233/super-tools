import { chromium } from 'playwright';

async function debugBlankScreen() {
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type()}]:`, msg.text());
  });
  
  // Enable error logging
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]:`, error.message);
  });
  
  // Enable request/response logging
  page.on('request', request => {
    console.log(`[REQUEST]: ${request.method()} ${request.url()}`);
  });
  
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`[RESPONSE ERROR]: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('Navigating to http://localhost:5174/...');
    
    // Navigate to the page
    await page.goto('http://localhost:5174/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Check if root element exists
    const rootElement = await page.$('#root');
    console.log('Root element exists:', !!rootElement);
    
    // Check if root has content
    const rootContent = await page.$eval('#root', el => el.innerHTML);
    console.log('Root content length:', rootContent.length);
    console.log('Root content preview:', rootContent.substring(0, 200));
    
    // Check for React errors
    const reactErrors = await page.evaluate(() => {
      return window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ || null;
    });
    
    if (reactErrors) {
      console.log('React errors detected:', reactErrors);
    }
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check for any visible content
    const bodyText = await page.$eval('body', el => el.innerText);
    console.log('Body text length:', bodyText.length);
    console.log('Body text preview:', bodyText.substring(0, 200));
    
    // Check for specific elements
    const hasLandingPage = await page.$('.hero-section');
    const hasDashboard = await page.$('.sidebar-override');
    const hasErrorBoundary = await page.$('[data-error-boundary]');
    
    console.log('Has landing page:', !!hasLandingPage);
    console.log('Has dashboard/sidebar:', !!hasDashboard);
    console.log('Has error boundary:', !!hasErrorBoundary);
    
    // Check for loading states
    const hasLoader = await page.$('.animate-spin');
    console.log('Has loader:', !!hasLoader);
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('Screenshot saved as debug-screenshot.png');
    
    // Check network requests
    const failedRequests = [];
    page.on('response', response => {
      if (!response.ok()) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });
    
    // Wait for any additional network activity
    await page.waitForTimeout(3000);
    
    if (failedRequests.length > 0) {
      console.log('Failed requests:', failedRequests);
    }
    
    // Check for JavaScript errors in console
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    if (logs.length > 0) {
      console.log('Console errors:', logs);
    }
    
    console.log('\nDebugging complete. Browser will stay open for manual inspection.');
    console.log('Press Ctrl+C to close when done.');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Error during debugging:', error);
  } finally {
    // Don't close automatically - let user inspect
    // await browser.close();
  }
}

debugBlankScreen().catch(console.error);