import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function debugCodeToImageConverter() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to code-to-image-converter page...');
    await page.goto('http://localhost:3000/tools/code-to-image-converter', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Get the full page content
    const content = await page.content();
    console.log('Page content length:', content.length);
    
    // Save content to a file for analysis
    writeFileSync('page-content.html', content);
    console.log('Full page content saved to page-content.html');
    
    // Check if there are any visible elements
    const allVisibleElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      }).map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textContent: el.textContent?.substring(0, 100)
      }));
    });
    
    console.log('Number of visible elements:', allVisibleElements.length);
    
    // Check for specific elements that should be visible
    const appContainer = await page.$('#root');
    if (appContainer) {
      const appContent = await appContainer.innerHTML();
      console.log('App container content length:', appContent.length);
    } else {
      console.log('No app container found');
    }
    
    // Check if there are any error messages in the DOM
    const errorElements = await page.$$('.error, .error-message, .alert-error');
    console.log('Error elements found:', errorElements.length);
    
  } catch (error) {
    console.error('Error debugging the page:', error.message);
  } finally {
    await browser.close();
  }
}

debugCodeToImageConverter();