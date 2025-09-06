import { chromium } from 'playwright';

async function testCodeToImageConverter() {
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
    await page.waitForTimeout(3000);
    
    // Check if the page contains expected content
    const content = await page.content();
    console.log('Page content length:', content.length);
    
    // Look for specific elements that should be on the page
    const hasCodeConverterContent = content.includes('Code Screenshot Generator') || 
                                   content.includes('Code to Image') ||
                                   content.includes('code');
    
    // Take a screenshot to see what's actually displayed
    await page.screenshot({ path: 'code-to-image-converter-test.png', fullPage: true });
    console.log('Screenshot saved as code-to-image-converter-test.png');
    
    if (hasCodeConverterContent) {
      console.log('✓ Code to Image Converter page loaded successfully with content!');
    } else {
      console.log('⚠️ Page loaded but may be missing expected content');
      console.log('Page title:', await page.title());
    }
    
    // Keep the browser open for 60 seconds so you can see the page
    console.log('Browser will stay open for 60 seconds. Check the page manually.');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error opening the page:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await browser.close();
  }
}

testCodeToImageConverter();