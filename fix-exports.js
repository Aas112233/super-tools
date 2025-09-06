import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsWithMissingExports = [
  'UrlSlugGenerator', 'WhitespaceCleaner', 'FontPairingFinder', 'ImageResizer', 
  'ImageColorExtractor', 'ImageTrimmer', 'PhotoFilters', 'HtmlEncoderDecoder',
  'UrlEncoderDecoder', 'HtmlMinifier', 'HtmlFormatter', 'Md5EncryptDecrypt',
  'Sha1EncryptDecrypt', 'Sha224EncryptDecrypt', 'Sha256EncryptDecrypt', 
  'Sha384EncryptDecrypt', 'Sha512EncryptDecrypt', 'JwtEncoderDecoder',
  'JsonTreeViewer', 'JavascriptMinifier', 'JavascriptFormatter',
  'InstagramFilters', 'InstagramPostGenerator', 'InstagramPhotoDownloader',
  'ListRandomizer', 'BarcodeGenerator', 'QRCodeGenerator', 'ReactNativeShadowGenerator'
];

const toolsDir = path.join(__dirname, 'src', 'pages', 'tools');

console.log('🔧 Fixing export statements...\n');

toolsWithMissingExports.forEach(tool => {
  const filePath = path.join(toolsDir, `${tool}.tsx`);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it has named export that needs to be converted to default
    const namedExportRegex = new RegExp(`export const ${tool}`, 'g');
    const namedExportRegex2 = new RegExp(`export function ${tool}`, 'g');
    
    if (namedExportRegex.test(content)) {
      content = content.replace(namedExportRegex, `const ${tool}`);
      if (!content.includes(`export default ${tool}`)) {
        content += `\n\nexport default ${tool};`;
      }
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${tool} - converted named export to default`);
    } else if (namedExportRegex2.test(content)) {
      content = content.replace(namedExportRegex2, `function ${tool}`);
      if (!content.includes(`export default ${tool}`)) {
        content += `\n\nexport default ${tool};`;
      }
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${tool} - converted named function export to default`);
    } else if (!content.includes('export default') && !content.includes('export {')) {
      // Add default export if missing entirely
      content += `\n\nexport default ${tool};`;
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${tool} - added missing default export`);
    } else {
      console.log(`⚠️  ${tool} - already has export or needs manual fix`);
    }
  } else {
    console.log(`❌ ${tool} - file not found`);
  }
});

console.log('\n🎉 Export fixing completed!');