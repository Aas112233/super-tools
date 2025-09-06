import { chromium } from 'playwright';

async function checkCodeToImageConverterErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.text()));
  
  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  
  try {
    console.log('Navigating to code-to-image-converter page...');
    await page.goto('http://localhost:3000/tools/code-to-image-converter', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    console.log('Console messages:', consoleMessages);
    console.log('Page errors:', pageErrors);
    
    if (pageErrors.length > 0) {
      console.log('❌ Found page errors:');
      pageErrors.forEach(error => console.log('  -', error));
    } else {
      console.log('✓ No page errors found');
    }
    
    if (consoleMessages.some(msg => msg.includes('error') || msg.includes('Error'))) {
      console.log('⚠️ Found potential error messages in console:');
      consoleMessages
        .filter(msg => msg.includes('error') || msg.includes('Error'))
        .forEach(msg => console.log('  -', msg));
    } else {
      console.log('✓ No error messages found in console');
    }
    
    // Check if the main content is present
    const hasMainContent = await page.isVisible('text=Code Screenshot Generator');
    if (hasMainContent) {
      console.log('✓ Main content is visible');
    } else {
      console.log('⚠️ Main content might not be visible');
    }
    
  } catch (error) {
    console.error('Error checking the page:', error.message);
  } finally {
    await browser.close();
  }
}

checkCodeToImageConverterErrors();