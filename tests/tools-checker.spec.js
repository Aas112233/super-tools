import { test, expect } from '@playwright/test';

// List of all tools from your App.tsx routes
const tools = [
  // Text Tools
  { name: 'Case Converter', path: '/tools/case-converter' },
  { name: 'Lorem Ipsum Generator', path: '/tools/lorem-ipsum-generator' },
  { name: 'Bionic Text Converter', path: '/tools/bionic-text-converter' },
  { name: 'Text to Handwriting Converter', path: '/tools/text-to-handwriting-converter' },
  { name: 'Handwriting Generator', path: '/tools/handwriting-generator' },
  { name: 'Letter Counter', path: '/tools/letter-counter' },
  { name: 'URL Slug Generator', path: '/tools/url-slug-generator' },
  { name: 'Whitespace Cleaner', path: '/tools/whitespace-cleaner' },
  { name: 'Font Pairing Finder', path: '/tools/font-pairing-finder' },

  // Image Tools
  { name: 'Image Resizer', path: '/tools/image-resizer' },
  { name: 'Image Average Color Finder', path: '/tools/image-average-color-finder' },
  { name: 'Image Color Picker', path: '/tools/image-color-picker' },
  { name: 'Image Color Extractor', path: '/tools/image-color-extractor' },
  { name: 'Image Trimmer', path: '/tools/image-trimmer' },
  { name: 'Photo Filters', path: '/tools/photo-filters' },

  // CSS Tools
  { name: 'CSS Loader Generator', path: '/tools/css-loader-generator' },
  { name: 'CSS Glassmorphism Generator', path: '/tools/css-glassmorphism-generator' },
  { name: 'CSS Minifier', path: '/tools/css-minifier' },
  { name: 'CSS Formatter', path: '/tools/css-formatter' },
  { name: 'CSS Background Pattern Generator', path: '/tools/css-background-pattern-generator' },
  { name: 'CSS Cubic Bezier Generator', path: '/tools/css-cubic-bezier-generator' },
  { name: 'CSS Switch Generator', path: '/tools/css-switch-generator' },
  { name: 'CSS Clip Path Generator', path: '/tools/css-clip-path-generator' },
  { name: 'CSS Border Radius Generator', path: '/tools/css-border-radius-generator' },
  { name: 'CSS Checkbox Generator', path: '/tools/css-checkbox-generator' },

  // Developer Tools
  { name: 'Base64 Encoder/Decoder', path: '/tools/base64-encoder-decoder' },
  { name: 'HTML Encoder/Decoder', path: '/tools/html-encoder-decoder' },
  { name: 'URL Encoder/Decoder', path: '/tools/url-encoder-decoder' },
  { name: 'Code to Image Converter', path: '/tools/code-to-image-converter' },
  { name: 'HTML Minifier', path: '/tools/html-minifier' },
  { name: 'HTML Formatter', path: '/tools/html-formatter' },
  { name: 'MD5 Encrypt/Decrypt', path: '/tools/md5-encrypt-decrypt' },
  { name: 'SHA1 Encrypt/Decrypt', path: '/tools/sha1-encrypt-decrypt' },
  { name: 'SHA224 Encrypt/Decrypt', path: '/tools/sha224-encrypt-decrypt' },
  { name: 'SHA256 Encrypt/Decrypt', path: '/tools/sha256-encrypt-decrypt' },
  { name: 'SHA384 Encrypt/Decrypt', path: '/tools/sha384-encrypt-decrypt' },
  { name: 'SHA512 Encrypt/Decrypt', path: '/tools/sha512-encrypt-decrypt' },
  { name: 'JWT Encoder/Decoder', path: '/tools/jwt-encoder-decoder' },
  { name: 'JSON Tree Viewer', path: '/tools/json-tree-viewer' },
  { name: 'JavaScript Minifier', path: '/tools/javascript-minifier' },
  { name: 'JavaScript Formatter', path: '/tools/javascript-formatter' },

  // Social Media Tools
  { name: 'Instagram Filters', path: '/tools/instagram-filters' },
  { name: 'Instagram Post Generator', path: '/tools/instagram-post-generator' },
  { name: 'Instagram Photo Downloader', path: '/tools/instagram-photo-downloader' },

  // Utilities
  { name: 'List Randomizer', path: '/tools/list-randomizer' },
  { name: 'Barcode Generator', path: '/tools/barcode-generator' },
  { name: 'QR Code Generator', path: '/tools/qrcode-generator' },
  { name: 'Strong Random Password Generator', path: '/tools/strong-random-password-generator' },

  // PDF Tools
  { name: 'PDF Merge', path: '/tools/pdf-merge' },
  { name: 'PDF Split', path: '/tools/pdf-split' },
  { name: 'PDF Compress', path: '/tools/pdf-compress' },
  { name: 'PDF to Word', path: '/tools/pdf-to-word' },

  // Other Tools
  { name: 'React Native Shadow Generator', path: '/tools/react-native-shadow-generator' },
  { name: 'Graphics Editor', path: '/tools/graphics-editor' },
  { name: 'ECharts Integration', path: '/tools/e-charts-integration' }
];

test.describe('Super Tools Dashboard - Tool Checker', () => {
  let workingTools = [];
  let brokenTools = [];
  let notImplementedTools = [];

  test.beforeAll(async () => {
    console.log(`\n🔍 Testing ${tools.length} tools...\n`);
  });

  for (const tool of tools) {
    test(`Check ${tool.name}`, async ({ page }) => {
      try {
        // Navigate to the tool
        await page.goto(`http://localhost:5173${tool.path}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });

        // Check if page loaded successfully
        const title = await page.title();
        
        // Check for error indicators
        const hasError = await page.locator('text=Error').count() > 0;
        const hasErrorBoundary = await page.locator('text=Something went wrong').count() > 0;
        const hasNotFound = await page.locator('text=404').count() > 0;
        const hasChunkLoadError = await page.locator('text=ChunkLoadError').count() > 0;
        
        // Check if redirected to dashboard (tool not implemented)
        const currentUrl = page.url();
        const redirectedToDashboard = currentUrl.includes('/tools/dashboard');

        // Check for loading spinner stuck
        await page.waitForTimeout(2000);
        const hasLoadingSpinner = await page.locator('.animate-spin').count() > 0;

        // Check for main content
        const hasMainContent = await page.locator('.tool-container, h1, textarea, button').count() > 0;

        if (hasError || hasErrorBoundary || hasChunkLoadError) {
          brokenTools.push({
            name: tool.name,
            path: tool.path,
            issue: 'Runtime Error',
            details: hasChunkLoadError ? 'Chunk Load Error' : 'Component Error'
          });
          console.log(`❌ ${tool.name} - Runtime Error`);
        } else if (redirectedToDashboard) {
          notImplementedTools.push({
            name: tool.name,
            path: tool.path,
            issue: 'Not Implemented',
            details: 'Redirects to dashboard'
          });
          console.log(`⚠️  ${tool.name} - Not Implemented`);
        } else if (hasLoadingSpinner) {
          brokenTools.push({
            name: tool.name,
            path: tool.path,
            issue: 'Loading Issue',
            details: 'Stuck on loading spinner'
          });
          console.log(`🔄 ${tool.name} - Loading Issue`);
        } else if (hasMainContent) {
          workingTools.push({
            name: tool.name,
            path: tool.path,
            status: 'Working'
          });
          console.log(`✅ ${tool.name} - Working`);
        } else {
          brokenTools.push({
            name: tool.name,
            path: tool.path,
            issue: 'No Content',
            details: 'Page loads but no main content found'
          });
          console.log(`❓ ${tool.name} - No Content`);
        }

      } catch (error) {
        brokenTools.push({
          name: tool.name,
          path: tool.path,
          issue: 'Navigation Error',
          details: error.message
        });
        console.log(`💥 ${tool.name} - Navigation Error: ${error.message}`);
      }
    });
  }

  test.afterAll(async () => {
    console.log('\n📊 SUMMARY REPORT');
    console.log('==================');
    console.log(`✅ Working Tools: ${workingTools.length}`);
    console.log(`❌ Broken Tools: ${brokenTools.length}`);
    console.log(`⚠️  Not Implemented: ${notImplementedTools.length}`);
    console.log(`📈 Total Tools: ${tools.length}`);
    
    if (brokenTools.length > 0) {
      console.log('\n❌ BROKEN TOOLS:');
      brokenTools.forEach(tool => {
        console.log(`   • ${tool.name} (${tool.issue}): ${tool.details}`);
      });
    }

    if (notImplementedTools.length > 0) {
      console.log('\n⚠️  NOT IMPLEMENTED TOOLS:');
      notImplementedTools.forEach(tool => {
        console.log(`   • ${tool.name}`);
      });
    }

    if (workingTools.length > 0) {
      console.log('\n✅ WORKING TOOLS:');
      workingTools.forEach(tool => {
        console.log(`   • ${tool.name}`);
      });
    }

    // Generate JSON report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: tools.length,
        working: workingTools.length,
        broken: brokenTools.length,
        notImplemented: notImplementedTools.length
      },
      workingTools,
      brokenTools,
      notImplementedTools
    };

    // Save report to file
    import('fs').then(fs => {
      fs.writeFileSync('tools-test-report.json', JSON.stringify(report, null, 2));
    });
    console.log('\n📄 Detailed report saved to: tools-test-report.json');
  });
});