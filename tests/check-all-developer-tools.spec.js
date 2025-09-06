import { test, expect } from '@playwright/test';

// All developer tools that should now be in the sidebar
const ALL_DEVELOPER_TOOLS = [
  { id: 'code-to-image-converter', name: 'Code Screenshot Generator', href: '/tools/code-to-image-converter' },
  { id: 'url-slug-generator', name: 'SEO URL Creator', href: '/tools/url-slug-generator' },
  { id: 'react-native-shadow-generator', name: 'React Native Shadow Creator', href: '/tools/react-native-shadow-generator' },
  { id: 'base64-encoder-decoder', name: 'Base64 Converter', href: '/tools/base64-encoder-decoder' },
  { id: 'html-encoder-decoder', name: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder' },
  { id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder' },
  { id: 'html-minifier', name: 'HTML Minifier', href: '/tools/html-minifier' },
  { id: 'css-minifier', name: 'CSS Minifier', href: '/tools/css-minifier' },
  { id: 'javascript-minifier', name: 'JavaScript Minifier', href: '/tools/javascript-minifier' },
  { id: 'html-formatter', name: 'HTML Formatter', href: '/tools/html-formatter' },
  { id: 'css-formatter', name: 'CSS Formatter', href: '/tools/css-formatter' },
  { id: 'javascript-formatter', name: 'JavaScript Formatter', href: '/tools/javascript-formatter' },
  { id: 'md5-encrypt-decrypt', name: 'MD5 Hash Generator', href: '/tools/md5-encrypt-decrypt' },
  { id: 'sha1-encrypt-decrypt', name: 'SHA1 Hash Generator', href: '/tools/sha1-encrypt-decrypt' },
  { id: 'sha224-encrypt-decrypt', name: 'SHA224 Hash Generator', href: '/tools/sha224-encrypt-decrypt' },
  { id: 'sha256-encrypt-decrypt', name: 'SHA256 Hash Generator', href: '/tools/sha256-encrypt-decrypt' },
  { id: 'sha384-encrypt-decrypt', name: 'SHA384 Hash Generator', href: '/tools/sha384-encrypt-decrypt' },
  { id: 'sha512-encrypt-decrypt', name: 'SHA512 Hash Generator', href: '/tools/sha512-encrypt-decrypt' },
  { id: 'jwt-encoder-decoder', name: 'JWT Encoder/Decoder', href: '/tools/jwt-encoder-decoder' },
  { id: 'json-tree-viewer', name: 'JSON Tree Viewer', href: '/tools/json-tree-viewer' }
];

test.describe('Check All Developer Tools Functionality', () => {
  // Test a sample of developer tools to make sure they're working
  const sampleTools = [
    { id: 'code-to-image-converter', name: 'Code Screenshot Generator', href: '/tools/code-to-image-converter' },
    { id: 'base64-encoder-decoder', name: 'Base64 Converter', href: '/tools/base64-encoder-decoder' },
    { id: 'html-encoder-decoder', name: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder' },
    { id: 'md5-encrypt-decrypt', name: 'MD5 Hash Generator', href: '/tools/md5-encrypt-decrypt' },
    { id: 'json-tree-viewer', name: 'JSON Tree Viewer', href: '/tools/json-tree-viewer' }
  ];
  
  for (const tool of sampleTools) {
    test(`should check if ${tool.name} is working`, async ({ page }) => {
      console.log(`\nChecking ${tool.name}...`);
      
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Listen for page errors
      const pageErrors = [];
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });
      
      try {
        // Navigate to the tool page
        await page.goto(`http://localhost:3004${tool.href}`, { 
          waitUntil: 'networkidle',
          timeout: 10000
        });
        
        // Wait a bit for the page to load
        await page.waitForTimeout(2000);
        
        // Check if there are any JavaScript errors
        if (pageErrors.length > 0) {
          console.log(`❌ ${tool.name} has page errors:`, pageErrors);
        } else {
          console.log(`✓ ${tool.name} loaded without JavaScript errors`);
        }
        
        // Check if there are console errors
        if (consoleErrors.length > 0) {
          console.log(`⚠️ ${tool.name} has console errors:`, consoleErrors);
        } else {
          console.log(`✓ ${tool.name} loaded without console errors`);
        }
        
        // Check that the page has content
        const content = await page.content();
        const hasContent = content.includes(tool.name) || content.includes('Tool') || content.length > 1000;
        
        if (hasContent) {
          console.log(`✓ ${tool.name} has content`);
        } else {
          console.log(`❌ ${tool.name} appears to be blank or missing content`);
        }
        
        // Overall tool status
        if (pageErrors.length === 0 && hasContent) {
          console.log(`✅ ${tool.name} is working correctly`);
        } else {
          console.log(`❌ ${tool.name} has issues`);
        }
      } catch (error) {
        console.log(`❌ ${tool.name} failed to load:`, error.message);
      }
    });
  }
  
  // Test that all developer tools are available in the sidebar
  test('should check if all developer tools are available in sidebar', async ({ page }) => {
    console.log('\nChecking if all developer tools are available in sidebar...');
    
    // Navigate to the dashboard
    await page.goto('http://localhost:3004/tools/dashboard', {
      waitUntil: 'networkidle'
    });
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Expand the Developer Tools category
    const devToolsCategory = page.locator('div.collapse-header-override', {
      hasText: 'Developer Tools'
    });
    
    try {
      await devToolsCategory.click({ timeout: 5000 });
      console.log('✓ Clicked on Developer Tools category');
    } catch (error) {
      console.log('❌ Failed to click on Developer Tools category:', error.message);
      return;
    }
    
    // Wait a bit for the tools to expand
    await page.waitForTimeout(1000);
    
    // Check if each tool is available in the sidebar
    let allToolsFound = true;
    for (const tool of ALL_DEVELOPER_TOOLS) {
      try {
        const toolLink = page.locator('a.category-tool-override', {
          hasText: tool.name
        });
        
        const isVisible = await toolLink.isVisible({ timeout: 3000 });
        if (isVisible) {
          console.log(`✓ ${tool.name} is available in sidebar`);
        } else {
          console.log(`❌ ${tool.name} is not visible in sidebar`);
          allToolsFound = false;
        }
      } catch (error) {
        console.log(`❌ ${tool.name} is not available in sidebar:`, error.message);
        allToolsFound = false;
      }
    }
    
    if (allToolsFound) {
      console.log('✅ All developer tools are available in sidebar');
    } else {
      console.log('❌ Some developer tools are missing from sidebar');
    }
  });
});