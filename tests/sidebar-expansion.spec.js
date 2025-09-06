import { test, expect } from '@playwright/test';

test.describe('Sidebar Category Expansion', () => {
  test('should expand categories when clicked', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:3002/tools/dashboard');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find the Text Tools category
    const textToolsCategory = page.locator('div.collapse-header-override', { 
      hasText: 'Text Tools' 
    });
    
    // Click on the Text Tools category
    await textToolsCategory.click();
    
    // Check if the category expanded by looking for tools inside it
    const caseConverterTool = page.locator('a.category-tool-override', { 
      hasText: 'Case Converter' 
    });
    
    // Wait for the tool to be visible
    await expect(caseConverterTool).toBeVisible({ timeout: 5000 });
    
    console.log('✓ Text Tools category expanded successfully');
    
    // Click again to collapse
    await textToolsCategory.click();
    
    // Check if the tool is hidden
    await expect(caseConverterTool).not.toBeVisible({ timeout: 5000 });
    
    console.log('✓ Text Tools category collapsed successfully');
  });
  
  test('should expand categories when sidebar is collapsed and then expanded', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:3002/tools/dashboard');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find the Text Tools category
    const textToolsCategory = page.locator('div.collapse-header-override', { 
      hasText: 'Text Tools' 
    });
    
    // Click on the Text Tools category while sidebar is collapsed
    await textToolsCategory.click();
    
    // Expand the sidebar by hovering over it
    const sidebar = page.locator('aside.sidebar-override');
    await sidebar.hover();
    
    // Wait a bit for the hover effect
    await page.waitForTimeout(500);
    
    // Check if the tools are visible now
    const caseConverterTool = page.locator('a.category-tool-override', { 
      hasText: 'Case Converter' 
    });
    
    await expect(caseConverterTool).toBeVisible({ timeout: 5000 });
    
    console.log('✓ Text Tools category expanded correctly when sidebar is collapsed then expanded');
  });
});