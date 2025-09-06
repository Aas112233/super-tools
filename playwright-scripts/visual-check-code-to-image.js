import { chromium } from 'playwright';

async function visualCheckCodeToImageConverter() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to code-to-image-converter page...');
    await page.goto('http://localhost:3000/tools/code-to-image-converter', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    console.log('Page loaded successfully!');
    console.log('Current URL:', page.url());
    
    // Wait for the page content to load
    await page.waitForTimeout(5000);
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if specific elements are visible
    const isTitleVisible = await page.isVisible('h1:has-text("Code Screenshot Generator")');
    console.log('Is main title visible:', isTitleVisible);
    
    const isPreviewVisible = await page.isVisible('.code-screenshot-preview');
    console.log('Is preview section visible:', isPreviewVisible);
    
    const isControlsVisible = await page.isVisible('.code-controls-section');
    console.log('Are controls visible:', isControlsVisible);
    
    // Take a screenshot to see what's actually displayed
    await page.screenshot({ path: 'code-to-image-final-check.png', fullPage: true });
    console.log('Screenshot saved as code-to-image-final-check.png');
    
    console.log('Browser will stay open for 30 seconds. Check the page manually.');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error checking the page:', error.message);
  } finally {
    await browser.close();
  }
}

visualCheckCodeToImageConverter();