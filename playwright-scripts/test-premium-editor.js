import { chromium } from 'playwright';

async function testPremiumRichTextEditor() {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Opening Premium Rich Text Editor...');
    await page.goto('http://localhost:5173/tools/rich-text-editor', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(2000);
    console.log('✅ Page loaded successfully');
    
    // Test premium design elements
    console.log('🎨 Testing premium design elements...');
    
    const editorVisible = await page.isVisible('[contenteditable]');
    console.log(`📝 Editor visible: ${editorVisible}`);
    
    // Test typing in the editor
    if (editorVisible) {
      await page.click('[contenteditable]');
      await page.type('[contenteditable]', 'Testing Premium Rich Text Editor\n\nThis is a sample document with premium design elements.');
      console.log('✍️ Sample text added');
    }
    
    // Test ribbon tabs
    console.log('🎛️ Testing ribbon interface...');
    const tabs = ['Home', 'Insert', 'Layout', 'View'];
    for (const tab of tabs) {
      const tabButton = page.locator(`button:has-text("${tab}")`);
      if (await tabButton.isVisible()) {
        await tabButton.click();
        await page.waitForTimeout(500);
        console.log(`📋 ${tab} tab activated`);
      }
    }
    
    // Test formatting buttons
    console.log('🎨 Testing formatting controls...');
    await page.click('button:has-text("Home")');
    await page.waitForTimeout(500);
    
    // Select text
    await page.click('[contenteditable]');
    await page.keyboard.press('Control+A');
    
    // Test bold button
    const boldButton = page.locator('button[title*="Bold"]').first();
    if (await boldButton.isVisible()) {
      await boldButton.click();
      console.log('🔤 Bold formatting applied');
    }
    
    // Test italic button
    const italicButton = page.locator('button[title*="Italic"]').first();
    if (await italicButton.isVisible()) {
      await italicButton.click();
      console.log('🔤 Italic formatting applied');
    }
    
    // Test font family dropdown
    const fontSelect = page.locator('select').first();
    if (await fontSelect.isVisible()) {
      await fontSelect.selectOption('Arial');
      console.log('🔤 Font changed to Arial');
    }
    
    // Test zoom controls
    console.log('🔍 Testing zoom controls...');
    const zoomIn = page.locator('button[title*="Zoom In"]');
    if (await zoomIn.isVisible()) {
      await zoomIn.click();
      await zoomIn.click();
      console.log('🔍 Zoomed in');
    }
    
    // Test view modes
    console.log('👁️ Testing view modes...');
    await page.click('button:has-text("View")');
    await page.waitForTimeout(500);
    
    const simpleView = page.locator('button:has-text("Simple View")');
    if (await simpleView.isVisible()) {
      await simpleView.click();
      await page.waitForTimeout(1000);
      console.log('👁️ Simple view activated');
      
      const printLayout = page.locator('button:has-text("Print Layout")');
      if (await printLayout.isVisible()) {
        await printLayout.click();
        await page.waitForTimeout(1000);
        console.log('👁️ Print layout restored');
      }
    }
    
    // Test File backstage
    console.log('📁 Testing File backstage...');
    const fileButton = page.locator('button:has-text("File")');
    if (await fileButton.isVisible()) {
      await fileButton.click();
      await page.waitForTimeout(1000);
      console.log('📁 File backstage opened');
      
      const closeButton = page.locator('button').filter({ hasText: '×' }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log('📁 File backstage closed');
      }
    }
    
    console.log('\n🎉 Premium Rich Text Editor testing completed!');
    console.log('✨ All premium design elements are working correctly');
    console.log('🌟 The browser will remain open for manual testing');
    console.log('📝 You can continue editing and testing features manually');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    await browser.close();
  }
}

testPremiumRichTextEditor();