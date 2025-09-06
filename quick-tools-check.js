import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tools from App.tsx routes
const tools = [
  'CaseConverter', 'LoremIpsumGenerator', 'BionicTextConverter', 'TextToHandwritingConverter',
  'HandwritingGenerator', 'LetterCounter', 'UrlSlugGenerator', 'WhitespaceCleaner', 'FontPairingFinder',
  'ImageResizer', 'ImageAverageColorFinder', 'ImageColorPicker', 'ImageColorExtractor', 'ImageTrimmer', 'PhotoFilters',
  'CssLoaderGenerator', 'CssGlassmorphismGenerator', 'CssMinifier', 'CssFormatter', 'CssBackgroundPatternGenerator',
  'CssCubicBezierGenerator', 'CssSwitchGenerator', 'CssClipPathGenerator', 'CssBorderRadiusGenerator', 'CssCheckboxGenerator',
  'Base64EncoderDecoder', 'HtmlEncoderDecoder', 'UrlEncoderDecoder', 'CodeToImageConverter', 'HtmlMinifier', 'HtmlFormatter',
  'Md5EncryptDecrypt', 'Sha1EncryptDecrypt', 'Sha224EncryptDecrypt', 'Sha256EncryptDecrypt', 'Sha384EncryptDecrypt', 'Sha512EncryptDecrypt',
  'JwtEncoderDecoder', 'JsonTreeViewer', 'JavascriptMinifier', 'JavascriptFormatter',
  'InstagramFilters', 'InstagramPostGenerator', 'InstagramPhotoDownloader',
  'ListRandomizer', 'BarcodeGenerator', 'QRCodeGenerator', 'StrongRandomPasswordGenerator',
  'PdfMerge', 'PdfSplit', 'PdfCompress', 'PdfToWord',
  'ReactNativeShadowGenerator', 'GraphicsEditor', 'EChartsIntegration'
];

const toolsDir = path.join(__dirname, 'src', 'pages', 'tools');

console.log('🔍 Checking Super Tools Dashboard Components...\n');

let existingFiles = [];
let missingFiles = [];
let emptyFiles = [];

tools.forEach(tool => {
  const filePath = path.join(toolsDir, `${tool}.tsx`);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasExport = content.includes('export default') || content.includes('export {');
    const hasComponent = content.includes('const ' + tool) || content.includes('function ' + tool) || content.includes('class ' + tool);
    const fileSize = content.length;
    
    if (fileSize < 100) {
      emptyFiles.push({ tool, size: fileSize });
      console.log(`⚠️  ${tool} - File too small (${fileSize} bytes)`);
    } else if (!hasExport) {
      console.log(`❌ ${tool} - Missing export`);
    } else if (!hasComponent) {
      console.log(`❌ ${tool} - No component found`);
    } else {
      existingFiles.push(tool);
      console.log(`✅ ${tool} - OK`);
    }
  } else {
    missingFiles.push(tool);
    console.log(`❌ ${tool} - File missing`);
  }
});

console.log('\n📊 SUMMARY:');
console.log(`✅ Existing: ${existingFiles.length}`);
console.log(`❌ Missing: ${missingFiles.length}`);
console.log(`⚠️  Empty/Small: ${emptyFiles.length}`);
console.log(`📈 Total: ${tools.length}`);

if (missingFiles.length > 0) {
  console.log('\n❌ MISSING FILES:');
  missingFiles.forEach(tool => console.log(`   • ${tool}.tsx`));
}

if (emptyFiles.length > 0) {
  console.log('\n⚠️  EMPTY/SMALL FILES:');
  emptyFiles.forEach(({tool, size}) => console.log(`   • ${tool}.tsx (${size} bytes)`));
}

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: tools.length,
    existing: existingFiles.length,
    missing: missingFiles.length,
    empty: emptyFiles.length
  },
  existingFiles,
  missingFiles,
  emptyFiles
};

fs.writeFileSync('component-check-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Report saved to: component-check-report.json');