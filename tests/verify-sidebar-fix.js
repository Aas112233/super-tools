// Simple test to verify that sidebar categories expand correctly
import { readFileSync } from 'fs';
import { join } from 'path';

async function verifySidebarFix() {
  console.log('Testing sidebar category expansion fix...');
  
  try {
    // Check if the Layout.tsx file has the correct condition
    const layoutPath = join(process.cwd(), 'src/components/Layout.tsx');
    const layoutContent = readFileSync(layoutPath, 'utf8');
    
    // Check if the problematic condition is removed
    const hasOldCondition = layoutContent.includes(
      '{!isSidebarCollapsed && category.tools.length > 0 && !['
    );
    
    if (hasOldCondition) {
      console.error('❌ Layout.tsx still contains the problematic condition');
      process.exit(1);
    }
    
    console.log('✓ Layout.tsx condition fixed correctly');
    
    // Check if the CSS has the correct rule
    const cssPath = join(process.cwd(), 'src/index.css');
    const cssContent = readFileSync(cssPath, 'utf8');
    
    const hasCssFix = cssContent.includes(
      '.sidebar-override.collapsed:not(.hover-expanded) .collapse-item-override.expanded .collapse-content-override'
    );
    
    if (!hasCssFix) {
      console.error('❌ CSS fix not found');
      process.exit(1);
    }
    
    console.log('✓ CSS rule for expanded categories added correctly');
    
    console.log('All sidebar fixes verified successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error verifying sidebar fixes:', error);
    process.exit(1);
  }
}

verifySidebarFix();