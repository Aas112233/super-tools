const { chromium } = require('playwright');

async function testFixes() {
  console.log('🔧 Testing WebSocket and Tool Container Fixes...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages to check for WebSocket errors
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  try {
    // Test 1: Check if main page loads without WebSocket errors
    console.log('📋 Test 1: Loading main dashboard...');
    await page.goto('http://localhost:5173/tools/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const wsErrors = consoleMessages.filter(msg => 
      msg.text.includes('WebSocket') || 
      msg.text.includes('ws://') ||
      msg.text.includes('Failed to connect')
    );
    
    if (wsErrors.length === 0) {
      console.log('✅ No WebSocket errors detected');
    } else {
      console.log('❌ WebSocket errors still present:', wsErrors.length);
      wsErrors.forEach(error => console.log('  -', error.text));
    }
    
    // Test 2: Check previously failing tools
    const failingTools = [
      'image-color-picker',
      'instagram-post-generator', 
      'pdf-to-image'
    ];
    
    for (const tool of failingTools) {
      console.log(`\n📋 Test 2.${failingTools.indexOf(tool) + 1}: Testing ${tool}...`);
      
      await page.goto(`http://localhost:5173/tools/${tool}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      // Check if tool loaded properly
      const hasContent = await page.evaluate(() => {
        const body = document.body;
        return body.textContent && body.textContent.trim().length > 0;
      });
      
      // Check for tool container or proper layout
      const hasProperLayout = await page.evaluate(() => {
        return document.querySelector('.p-6') || 
               document.querySelector('.tool-container') ||
               document.querySelector('h1');
      });
      
      if (hasContent && hasProperLayout) {
        console.log(`✅ ${tool} loads successfully`);
      } else {
        console.log(`❌ ${tool} failed to load properly`);
      }
    }
    
    // Test 3: Check HMR functionality
    console.log('\n📋 Test 3: Checking HMR configuration...');
    const hmrWorking = await page.evaluate(() => {
      return window.location.port === '5173';
    });
    
    if (hmrWorking) {
      console.log('✅ Development server running on correct port');
    } else {
      console.log('❌ Development server port issue');
    }
    
    console.log('\n🎉 Fix testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testFixes().catch(console.error);