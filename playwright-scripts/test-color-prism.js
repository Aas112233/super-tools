import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the Color Prism page
    console.log('Navigating to Color Prism page...');
    await page.goto('http://localhost:5173/tools/color-prism');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the main tool container exists
    const toolContainer = await page.$('.tool-container');
    if (toolContainer) {
      console.log('✓ Tool container found');
    } else {
      console.log('✗ Tool container not found');
    }
    
    // Check if the tool header exists
    const toolHeader = await page.$('.tool-header');
    if (toolHeader) {
      console.log('✓ Tool header found');
      
      // Check if the title is correct
      const title = await toolHeader.$eval('h1', el => el.textContent);
      if (title === 'Color Prism') {
        console.log('✓ Correct title found:', title);
      } else {
        console.log('✗ Incorrect title:', title);
      }
    } else {
      console.log('✗ Tool header not found');
    }
    
    // Check if the layout exists
    const layout = await page.$('.color-prism-layout');
    if (layout) {
      console.log('✓ Color Prism layout found');
    } else {
      console.log('✗ Color Prism layout not found');
    }
    
    // Check if input section exists
    const inputSection = await page.$('.color-input-section');
    if (inputSection) {
      console.log('✓ Color input section found');
    } else {
      console.log('✗ Color input section not found');
    }
    
    // Check if controls section exists
    const controlsSection = await page.$('.color-controls-section');
    if (controlsSection) {
      console.log('✓ Color controls section found');
    } else {
      console.log('✗ Color controls section not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'color-prism-test.png' });
    console.log('✓ Screenshot saved as color-prism-test.png');
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await browser.close();
  }
})();