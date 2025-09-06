import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the website
    await page.goto('https://1001s.info');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is correct
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if key elements are present
    const body = await page.$('body');
    const header = await page.$('header');
    const footer = await page.$('footer');
    const mainContent = await page.$('main, .main, #main');
    
    if (body) {
      console.log('✅ Body element found');
    } else {
      console.log('❌ Body element not found');
    }
    
    if (header) {
      console.log('✅ Header element found');
    } else {
      console.log('❌ Header element not found');
    }
    
    if (footer) {
      console.log('✅ Footer element found');
    } else {
      console.log('❌ Footer element not found');
    }
    
    if (mainContent) {
      console.log('✅ Main content element found');
    } else {
      console.log('❌ Main content element not found');
    }
    
    // Check for text content
    const pageContent = await page.content();
    if (pageContent.includes('1001s.info') || pageContent.includes('Online Tools')) {
      console.log('✅ Website content found');
    } else {
      console.log('❌ Website content not found');
    }
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'website-check.png' });
    console.log('📸 Screenshot saved as website-check.png');
    
    // Check for any JavaScript errors in the console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('-browser console error:', msg.text());
      }
    });
    
    // Check for uncaught exceptions
    page.on('pageerror', error => {
      console.log('❌ Page error:', error.message);
    });
    
    console.log('✅ Website load check completed');
  } catch (error) {
    console.error('❌ Error during website check:', error.message);
  } finally {
    await browser.close();
  }
})();