import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for console messages
  page.on('console', msg => console.log('Console:', msg.text()));
  
  // Listen for page errors
  page.on('pageerror', error => console.log('Page error:', error.message));
  
  // Listen for request failures
  page.on('requestfailed', request => 
    console.log('Request failed:', request.url(), request.failure()?.errorText)
  );

  try {
    // Navigate to the Color Prism page
    console.log('Navigating to Color Prism page...');
    const response = await page.goto('http://localhost:5173/tools/color-prism');
    console.log('Response status:', response?.status());
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Get the page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Get the page content
    const content = await page.content();
    console.log('Page has content:', content.length > 0);
    
    // Check for specific elements
    const toolContainer = await page.$('.tool-container');
    console.log('Tool container found:', !!toolContainer);
    
    if (!toolContainer) {
      // Take a screenshot to see what's actually rendering
      await page.screenshot({ path: 'color-prism-debug.png' });
      console.log('Debug screenshot saved as color-prism-debug.png');
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await browser.close();
  }
})();