import { chromium } from 'playwright';

async function showcaseRichTextEditor() {
  // Launch browser with visible window
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to Rich Text Editor...');
    
    // Navigate to the rich text editor
    await page.goto('http://localhost:5177/tools/rich-text-editor', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if main elements are visible
    const headerVisible = await page.isVisible('.header');
    const editorVisible = await page.isVisible('[contenteditable]');
    const statusBarVisible = await page.isVisible('.status-bar');
    
    console.log('Rich Text Editor Components:');
    console.log('- Header visible:', headerVisible);
    console.log('- Editor area visible:', editorVisible);
    console.log('- Status bar visible:', statusBarVisible);
    
    console.log('\nMS Word 2021 Style Rich Text Editor is now open!');
    console.log('Features implemented:');
    console.log('1. MS Word 2021-like interface with ribbon toolbar');
    console.log('2. File operations (New, Save, Print)');
    console.log('3. Text formatting (Bold, Italic, Underline, etc.)');
    console.log('4. Paragraph formatting (Alignment, Lists, Indentation)');
    console.log('5. Find and Replace functionality');
    console.log('6. Zoom controls');
    console.log('7. Word and character count');
    console.log('8. Page navigation');
    console.log('9. Ruler for precise layout');
    console.log('10. Collapsible sidebar');
    
    // Demonstrating some interactions with the editor
    console.log('\nDemonstrating features:');
    
    // Type some text in the editor
    await page.click('[contenteditable]');
    await page.type('[contenteditable]', 'This is a demonstration of the rich text editor.');
    console.log('- Typed text into the editor');
    await page.waitForTimeout(1000);
    
    // Format text as bold
    await page.click('button[title="Bold"]');
    console.log('- Applied bold formatting');
    await page.waitForTimeout(1000);
    
    // Change alignment
    await page.click('button[title="Align Left"]');
    console.log('- Applied left alignment');
    await page.waitForTimeout(1000);
    
    // Create a list
    await page.click('button[title="Bullets"]');
    console.log('- Created a bulleted list');
    await page.waitForTimeout(1000);
    
    // Zoom in
    await page.click('button:has-text("+")');
    console.log('- Zoomed in');
    await page.waitForTimeout(1000);
    
    // Zoom out
    await page.click('button:has-text("-")');
    console.log('- Zoomed out');
    await page.waitForTimeout(1000);
    
    // Reset zoom
    await page.click('button:has-text("100%")');
    console.log('- Reset zoom to 100%');
    await page.waitForTimeout(1000);
    
    // Toggle sidebar
    await page.click('button:has(i.bi-chevron-left)');
    console.log('- Opened sidebar');
    await page.waitForTimeout(1000);
    
    // Close sidebar
    await page.click('button:has(i.bi-chevron-right)');
    console.log('- Closed sidebar');
    await page.waitForTimeout(1000);
    
    console.log('\nRich Text Editor showcase complete!');
    console.log('The browser will remain open so you can continue exploring the interface.');
    console.log('Close the browser window when you are finished.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Note: We don't close the browser here so the user can interact with the editor
}

showcaseRichTextEditor();