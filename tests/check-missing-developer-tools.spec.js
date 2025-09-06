import { test, expect } from '@playwright/test';

// All developer tools that exist in the registry
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

// Developer tools currently in the sidebar category
const SIDEBAR_DEVELOPER_TOOLS = [
  'code-to-image-converter',
  'url-slug-generator', 
  'react-native-shadow-generator',
  'base64-encoder-decoder'
];

test.describe('Check Missing Developer Tools in Sidebar', () => {
  test('should identify which developer tools are missing from sidebar', async ({ page }) => {
    console.log('Checking for missing developer tools in sidebar...\n');
    
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
    
    // Check which tools are present in the sidebar
    const presentTools = [];
    const missingTools = [];
    
    for (const tool of ALL_DEVELOPER_TOOLS) {
      try {
        const toolLink = page.locator('a.category-tool-override', {
          hasText: tool.name
        });
        
        const isVisible = await toolLink.isVisible({ timeout: 3000 });
        if (isVisible) {
          presentTools.push(tool);
          console.log(`✓ ${tool.name} is present in sidebar`);
        } else {
          missingTools.push(tool);
          console.log(`❌ ${tool.name} is missing from sidebar`);
        }
      } catch (error) {
        missingTools.push(tool);
        console.log(`❌ ${tool.name} is missing from sidebar:`, error.message);
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`✓ ${presentTools.length} developer tools are present in sidebar`);
    console.log(`❌ ${missingTools.length} developer tools are missing from sidebar`);
    
    if (missingTools.length > 0) {
      console.log('\nMissing tools:');
      missingTools.forEach(tool => {
        console.log(`  - ${tool.name} (${tool.id})`);
      });
    }
    
    // Show what tools should be added to the category
    if (missingTools.length > 0) {
      console.log('\nTo fix this issue, add these tools to the coding-tools category in Layout.tsx:');
      console.log('[');
      const toolsToAdd = missingTools.map(tool => `  '${tool.id}'`).join(',\n');
      console.log(toolsToAdd);
      console.log(']');
    }
  });
});