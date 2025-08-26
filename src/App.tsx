import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CaseConverter from './pages/tools/CaseConverter';
import Base64EncoderDecoder from './pages/tools/Base64EncoderDecoder';
import BionicTextConverter from './pages/tools/BionicTextConverter';
import BulkBarcodeQRGenerator from './pages/tools/BulkBarcodeQRGenerator';
import CssCheckboxGenerator from './pages/tools/CssCheckboxGenerator';
import CssClipPathGenerator from './pages/tools/CssClipPathGenerator';
import CssFormatter from './pages/tools/CssFormatter';
import CssGlassmorphismGenerator from './pages/tools/CssGlassmorphismGenerator';
import CssLoaderGenerator from './pages/tools/CssLoaderGenerator';
import CssMinifier from './pages/tools/CssMinifier';
import CssSwitchGenerator from './pages/tools/CssSwitchGenerator';
import EChartsIntegration from './pages/tools/EChartsIntegration';
import DashboardContent from './components/DashboardContent';
import EnhancedDashboard from './components/EnhancedDashboard';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Import all the other tool components that were missing
import { LoremIpsumGenerator } from './pages/tools/LoremIpsumGenerator';
import { LetterCounter } from './pages/tools/LetterCounter';
import { ImageResizer } from './pages/tools/ImageResizer';
import ImageAverageColorFinder from './pages/tools/ImageAverageColorFinder';
import { ImageColorExtractor } from './pages/tools/ImageColorExtractor';
import ImageColorPicker from './pages/tools/ImageColorPicker';
import CssBackgroundPatternGenerator from './pages/tools/CssBackgroundPatternGenerator';
import CssCubicBezierGenerator from './pages/tools/CssCubicBezierGenerator';
import { CodeToImageConverter } from './pages/tools/CodeToImageConverter';
import { UrlSlugGenerator } from './pages/tools/UrlSlugGenerator';
import { ReactNativeShadowGenerator } from './pages/tools/ReactNativeShadowGenerator';
import { HtmlEncoderDecoder } from './pages/tools/HtmlEncoderDecoder';
import { UrlEncoderDecoder } from './pages/tools/UrlEncoderDecoder';
import { HtmlMinifier } from './pages/tools/HtmlMinifier';
import { HtmlFormatter } from './pages/tools/HtmlFormatter';
import { Md5EncryptDecrypt } from './pages/tools/Md5EncryptDecrypt';
import { Sha1EncryptDecrypt } from './pages/tools/Sha1EncryptDecrypt';
import { Sha224EncryptDecrypt } from './pages/tools/Sha224EncryptDecrypt';
import { Sha256EncryptDecrypt } from './pages/tools/Sha256EncryptDecrypt';
import { Sha384EncryptDecrypt } from './pages/tools/Sha384EncryptDecrypt';
import { Sha512EncryptDecrypt } from './pages/tools/Sha512EncryptDecrypt';
import { JwtEncoderDecoder } from './pages/tools/JwtEncoderDecoder';
import { JsonTreeViewer } from './pages/tools/JsonTreeViewer';
import { InstagramFilters } from './pages/tools/InstagramFilters';
import { InstagramPostGenerator } from './pages/tools/InstagramPostGenerator';
import { InstagramPhotoDownloader } from './pages/tools/InstagramPhotoDownloader';
import StrongRandomPasswordGenerator from './pages/tools/StrongRandomPasswordGenerator';
import { ListRandomizer } from './pages/tools/ListRandomizer';
import { BarcodeGenerator } from './pages/tools/BarcodeGenerator';
import { WhitespaceCleaner } from './pages/tools/WhitespaceCleaner';
import { FontPairingFinder } from './pages/tools/FontPairingFinder';
import { ImageTrimmer } from './pages/tools/ImageTrimmer';
import { PhotoFilters } from './pages/tools/PhotoFilters';
import { JavascriptMinifier } from './pages/tools/JavascriptMinifier';
import { JavascriptFormatter } from './pages/tools/JavascriptFormatter';
import TextToHandwritingConverter from './pages/tools/TextToHandwritingConverter';
import { QRCodeGenerator } from './pages/tools/QRCodeGenerator';
import DataVisualizationBuilder from './pages/tools/DataVisualizationBuilder';
import ChartExporter from './pages/tools/ChartExporter';
import GraphicsEditor from './pages/tools/GraphicsEditor';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Tool routes wrapped with Layout */}
      <Route element={<Layout />}>
        {/* Text Tools */}
        <Route path="/tools/case-converter" element={<ErrorBoundary><CaseConverter /></ErrorBoundary>} />
        <Route path="/tools/lorem-ipsum-generator" element={<ErrorBoundary><LoremIpsumGenerator /></ErrorBoundary>} />
        <Route path="/tools/letter-counter" element={<ErrorBoundary><LetterCounter /></ErrorBoundary>} />
        <Route path="/tools/bionic-text-converter" element={<ErrorBoundary><BionicTextConverter /></ErrorBoundary>} />
        <Route path="/tools/bionic-reading-converter" element={<ErrorBoundary><BionicTextConverter /></ErrorBoundary>} />
        <Route path="/tools/multiple-whitespace-remover" element={<ErrorBoundary><WhitespaceCleaner /></ErrorBoundary>} />
        <Route path="/tools/google-fonts-pair-finder" element={<ErrorBoundary><FontPairingFinder /></ErrorBoundary>} />
        <Route path="/tools/text-to-handwriting-converter" element={<ErrorBoundary><TextToHandwritingConverter /></ErrorBoundary>} />
        
        {/* Image Tools */}
        <Route path="/tools/image-cropper" element={<ErrorBoundary><ImageTrimmer /></ErrorBoundary>} />
        <Route path="/tools/image-filters" element={<ErrorBoundary><PhotoFilters /></ErrorBoundary>} />
        <Route path="/tools/image-resizer" element={<ErrorBoundary><ImageResizer /></ErrorBoundary>} />
        <Route path="/tools/image-average-color-finder" element={<ErrorBoundary><ImageAverageColorFinder /></ErrorBoundary>} />
        <Route path="/tools/image-color-extractor" element={<ErrorBoundary><ImageColorExtractor /></ErrorBoundary>} />
        <Route path="/tools/image-color-picker" element={<ErrorBoundary><ImageColorPicker /></ErrorBoundary>} />
        
        {/* CSS Tools */}
        <Route path="/tools/css-loader-generator" element={<ErrorBoundary><CssLoaderGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-checkbox-generator" element={<ErrorBoundary><CssCheckboxGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-switch-generator" element={<ErrorBoundary><CssSwitchGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-clip-path-generator" element={<ErrorBoundary><CssClipPathGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-background-pattern-generator" element={<ErrorBoundary><CssBackgroundPatternGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-cubic-bezier-generator" element={<ErrorBoundary><CssCubicBezierGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-glassmorphism-generator" element={<ErrorBoundary><CssGlassmorphismGenerator /></ErrorBoundary>} />
        <Route path="/tools/css-minifier" element={<ErrorBoundary><CssMinifier /></ErrorBoundary>} />
        <Route path="/tools/css-formatter" element={<ErrorBoundary><CssFormatter /></ErrorBoundary>} />
        
        {/* Developer Tools */}
        <Route path="/tools/code-to-image-converter" element={<ErrorBoundary><CodeToImageConverter /></ErrorBoundary>} />
        <Route path="/tools/url-slug-generator" element={<ErrorBoundary><UrlSlugGenerator /></ErrorBoundary>} />
        <Route path="/tools/react-native-shadow-generator" element={<ErrorBoundary><ReactNativeShadowGenerator /></ErrorBoundary>} />
        <Route path="/tools/base64-encoder-decoder" element={<ErrorBoundary><Base64EncoderDecoder /></ErrorBoundary>} />
        <Route path="/tools/html-encoder-decoder" element={<ErrorBoundary><HtmlEncoderDecoder /></ErrorBoundary>} />
        <Route path="/tools/url-encoder-decoder" element={<ErrorBoundary><UrlEncoderDecoder /></ErrorBoundary>} />
        <Route path="/tools/html-minifier" element={<ErrorBoundary><HtmlMinifier /></ErrorBoundary>} />
        <Route path="/tools/javascript-minifier" element={<ErrorBoundary><JavascriptMinifier /></ErrorBoundary>} />
        <Route path="/tools/html-formatter" element={<ErrorBoundary><HtmlFormatter /></ErrorBoundary>} />
        <Route path="/tools/javascript-formatter" element={<ErrorBoundary><JavascriptFormatter /></ErrorBoundary>} />
        <Route path="/tools/md5-encrypt-decrypt" element={<ErrorBoundary><Md5EncryptDecrypt /></ErrorBoundary>} />
        <Route path="/tools/sha1-encrypt-decrypt" element={<ErrorBoundary><Sha1EncryptDecrypt /></ErrorBoundary>} />
        <Route path="/tools/sha224-encrypt-decrypt" element={<ErrorBoundary><Sha224EncryptDecrypt /></ErrorBoundary>} />
        <Route path="/tools/sha256-encrypt-decrypt" element={<ErrorBoundary><Sha256EncryptDecrypt /></ErrorBoundary>} />
        <Route path="/tools/sha384-encrypt-decrypt" element={<ErrorBoundary><Sha384EncryptDecrypt /></ErrorBoundary>} />
        <Route path="/tools/sha512-encrypt-decrypt" element={<ErrorBoundary><Sha512EncryptDecrypt /></ErrorBoundary>} />
        <Route path="/tools/jwt-encoder-decoder" element={<ErrorBoundary><JwtEncoderDecoder /></ErrorBoundary>} />
        <Route path="/tools/json-tree-viewer" element={<ErrorBoundary><JsonTreeViewer /></ErrorBoundary>} />
        
        {/* Social Media Tools */}
        <Route path="/tools/instagram-filters" element={<ErrorBoundary><InstagramFilters /></ErrorBoundary>} />
        <Route path="/tools/instagram-post-generator" element={<ErrorBoundary><InstagramPostGenerator /></ErrorBoundary>} />
        <Route path="/tools/instagram-photo-downloader" element={<ErrorBoundary><InstagramPhotoDownloader /></ErrorBoundary>} />
        
        {/* Security Tools */}
        <Route path="/tools/strong-random-password-generator" element={<ErrorBoundary><StrongRandomPasswordGenerator /></ErrorBoundary>} />
        
        {/* List Tools */}
        <Route path="/tools/list-randomizer" element={<ErrorBoundary><ListRandomizer /></ErrorBoundary>} />
        
        {/* Barcode and QR Tools */}
        <Route path="/tools/qr-code-generator" element={<ErrorBoundary><QRCodeGenerator /></ErrorBoundary>} />
        <Route path="/tools/barcode-generator" element={<ErrorBoundary><BarcodeGenerator /></ErrorBoundary>} />
        <Route path="/tools/bulk-barcode-qr-generator" element={<ErrorBoundary><BulkBarcodeQRGenerator /></ErrorBoundary>} />
        
        {/* Chart Tools */}
        <Route path="/tools/data-visualization-builder" element={<ErrorBoundary><DataVisualizationBuilder /></ErrorBoundary>} />
        <Route path="/tools/chart-exporter" element={<ErrorBoundary><ChartExporter /></ErrorBoundary>} />
        
        {/* Image Editor */}
        <Route path="/tools/graphics-editor" element={<ErrorBoundary><GraphicsEditor /></ErrorBoundary>} />
        
        {/* Category Routes (Not wrapped in ErrorBoundary since they show the dashboard) */}
        <Route path="/tools/echarts-integration" element={<ErrorBoundary><EChartsIntegration /></ErrorBoundary>} />
        <Route path="/tools/coding-tools" element={<EnhancedDashboard activeCategory="coding-tools" />} />
        <Route path="/tools/text-tools" element={<EnhancedDashboard activeCategory="text-tools" />} />
        <Route path="/tools/image-tools" element={<EnhancedDashboard activeCategory="image-tools" />} />
        <Route path="/tools/css-tools" element={<EnhancedDashboard activeCategory="css-tools" />} />
        <Route path="/tools/barcode-qr-tools" element={<EnhancedDashboard activeCategory="barcode-qr-tools" />} />
        <Route path="/tools/image-editor" element={<EnhancedDashboard activeCategory="image-editor" />} />
        
        {/* Dashboard route - enhanced with proper integration */}
        <Route path="/tools/dashboard" element={<EnhancedDashboard />} />
        
        {/* Base Tools Route - should be the last route */}
        <Route path="/tools" element={<Navigate to="/tools/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;  // Ensure default export