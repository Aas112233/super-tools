import { chromium } from 'playwright';

async function checkForErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  
  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  // Capture request failures
  const requestFailures = [];
  page.on('requestfailed', request => {
    requestFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText
    });
  });
  
  try {
    console.log('Navigating to code-to-image-converter page...');
    await page.goto('http://localhost:3000/tools/code-to-image-converter', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    console.log('Console messages:');
    consoleMessages.forEach(msg => {
      console.log(`  ${msg.type}: ${msg.text}`);
    });
    
    console.log('Page errors:');
    pageErrors.forEach(error => {
      console.log(`  ${error}`);
    });
    
    console.log('Request failures:');
    requestFailures.forEach(failure => {
      console.log(`  ${failure.url}: ${failure.failure}`);
    });
    
    // Check if component loaded
    const content = await page.content();
    const hasCodeConverterContent = content.includes('Code Screenshot Generator');
    console.log('Has expected content:', hasCodeConverterContent);
    
  } catch (error) {
    console.error('Error checking the page:', error.message);
  } finally {
    await browser.close();
  }
}

checkForErrors();