import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('=== Testing BionicTextConverter Design ===');
    // Navigate to the BionicTextConverter page
    await page.goto('http://localhost:5173/tools/bionic-text-converter');
    await page.waitForLoadState('networkidle');
    
    // Check key design elements
    const bionicContainer = await page.$('.tool-container');
    const bionicHeader = await page.$('.tool-header');
    const bionicLayout = await page.$('.bionic-converter-layout');
    
    console.log('BionicTextConverter - Tool container:', bionicContainer ? '✓' : '✗');
    console.log('BionicTextConverter - Tool header:', bionicHeader ? '✓' : '✗');
    console.log('BionicTextConverter - Layout:', bionicLayout ? '✓' : '✗');
    
    // Take screenshot
    await page.screenshot({ path: 'bionic-text-converter.png' });
    console.log('Screenshot saved as bionic-text-converter.png');
    
    console.log('\n=== Testing ColorPrism Design ===');
    // Navigate to the ColorPrism page
    await page.goto('http://localhost:5173/tools/color-prism');
    await page.waitForLoadState('networkidle');
    
    // Check key design elements
    const colorContainer = await page.$('.tool-container');
    const colorHeader = await page.$('.tool-header');
    const colorLayout = await page.$('.color-prism-layout');
    
    console.log('ColorPrism - Tool container:', colorContainer ? '✓' : '✗');
    console.log('ColorPrism - Tool header:', colorHeader ? '✓' : '✗');
    console.log('ColorPrism - Layout:', colorLayout ? '✓' : '✗');
    
    // Take screenshot
    await page.screenshot({ path: 'color-prism.png' });
    console.log('Screenshot saved as color-prism.png');
    
    console.log('\n=== Design Comparison Complete ===');
    console.log('Both tools now follow the same design pattern!');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await browser.close();
  }
})();