import { chromium } from 'playwright';

async function openCodeToImageConverter() {
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
    const hasCodeConverterContent = content.includes('Code Screenshot Generator') || 
                                   content.includes('Code to Image') ||
                                   content.includes('code');
    
    if (hasCodeConverterContent) {
      console.log('✓ Code to Image Converter page loaded successfully!');
    } else {
      console.log('⚠️ Page loaded but may be missing expected content');
    }
    
    // Keep the browser open for 60 seconds so you can see the page
    console.log('Browser will stay open for 60 seconds. Check the page manually.');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error opening the page:', error.message);
  } finally {
    await browser.close();
  }
}

openCodeToImageConverter();