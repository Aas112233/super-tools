import { chromium } from 'playwright';

async function openRichTextEditor() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to Rich Text Editor on localhost:5173...');
    await page.goto('http://localhost:5173/tools/rich-text-editor', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check if the main title is visible
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for specific rich text editor elements
    const editorVisible = await page.isVisible('[contenteditable], .rich-text-editor, .editor-container');
    console.log('Rich text editor visible:', editorVisible);
    
    // Check if any content is visible
    const content = await page.content();
    console.log('Page content length:', content.length);
    
    console.log('Rich Text Editor is now open in Chromium!');
    console.log('The browser will remain open. Close it manually when you are done.');
    
    // Keep the browser open by not closing it
    // The script will end but the browser window will stay open
    
  } catch (error) {
    console.error('Error:', error.message);
    await browser.close();
  }
}

openRichTextEditor();