import { test, expect } from '@playwright/test';

// Developer tools in the 'coding-tools' category
const DEVELOPER_TOOLS = [
  {
    id: 'code-to-image-converter',
    name: 'Code Screenshot Generator',
    url: '/tools/code-to-image-converter'
  },
  {
    id: 'url-slug-generator',
    name: 'SEO URL Creator',
    url: '/tools/url-slug-generator'
  },
  {
    id: 'react-native-shadow-generator',
    name: 'React Native Shadow Creator',
    url: '/tools/react-native-shadow-generator'
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Converter',
    url: '/tools/base64-encoder-decoder'
  }
];

test.describe('Developer Tools Functionality Check', () => {
  // Test each developer tool
  for (const tool of DEVELOPER_TOOLS) {
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
        await page.goto(`http://localhost:3004${tool.url}`, { 
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
  
  // Test if developer tools are available in the sidebar
  test('should check if developer tools are available in sidebar', async ({ page }) => {
    console.log('\nChecking if developer tools are available in sidebar...');
    
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
    for (const tool of DEVELOPER_TOOLS) {
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