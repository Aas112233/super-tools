import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the sitemap
    const response = await page.goto('https://1001s.info/sitemap.xml');
    
    // Check the response status
    const status = response.status();
    console.log('Sitemap HTTP status:', status);
    
    // Check the content type
    const contentType = await response.headerValue('content-type');
    console.log('Content-Type header:', contentType);
    
    // Get the page content
    const content = await page.content();
    
    // Check if it's valid XML
    if (content.includes('<?xml') && content.includes('<urlset')) {
      console.log('✅ Sitemap appears to be valid XML');
    } else {
      console.log('❌ Sitemap does not appear to be valid XML');
      console.log('Content preview:', content.substring(0, 200));
    }
    
    // Check for specific elements
    if (content.includes('https://1001s.info/')) {
      console.log('✅ Homepage URL found in sitemap');
    } else {
      console.log('❌ Homepage URL not found in sitemap');
    }
    
    if (content.includes('https://1001s.info/tools/dashboard')) {
      console.log('✅ Dashboard URL found in sitemap');
    } else {
      console.log('❌ Dashboard URL not found in sitemap');
    }
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'sitemap-check.png' });
    console.log('📸 Screenshot saved as sitemap-check.png');
    
    console.log('✅ Sitemap access check completed');
  } catch (error) {
    console.error('❌ Error during sitemap check:', error.message);
  } finally {
    await browser.close();
  }
})();