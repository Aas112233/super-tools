import { chromium } from 'playwright';

async function simpleCheck() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to code-to-image-converter page...');
    await page.goto('http://localhost:3000/tools/code-to-image-converter');
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check if the main title is visible
    const titleVisible = await page.isVisible('h1:has-text("Code Screenshot Generator")');
    console.log('Main title visible:', titleVisible);
    
    // Check if any content is visible
    const content = await page.content();
    console.log('Page content length:', content.length);
    
    // Check if there are any visible elements
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
    console.log('First few visible elements:', visibleElements.slice(0, 10));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

simpleCheck();