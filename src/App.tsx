import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSEO } from './hooks/useSEO';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Dashboard components
const EnhancedDashboard = lazy(() => import('./components/EnhancedDashboard'));
const TestDashboard = lazy(() => import('./components/TestDashboard'));

// Tool components
const BarcodeGenerator = lazy(() => import('./pages/tools/BarcodeGenerator'));
const Base64EncoderDecoder = lazy(() => import('./pages/tools/Base64EncoderDecoder'));
const BionicTextConverter = lazy(() => import('./pages/tools/BionicTextConverter'));
const BulkBarcodeQRGenerator = lazy(() => import('./pages/tools/BulkBarcodeQRGenerator'));
const CaseConverter = lazy(() => import('./pages/tools/CaseConverter'));
const ChartExporter = lazy(() => import('./pages/tools/ChartExporter'));
const CodeToImageConverter = lazy(() => import('./pages/tools/CodeToImageConverter'));
const ColorPrism = lazy(() => import('./pages/tools/ColorPrism'));
const CssBackgroundPatternGenerator = lazy(() => import('./pages/tools/CssBackgroundPatternGenerator'));
const CssBorderRadiusGenerator = lazy(() => import('./pages/tools/CssBorderRadiusGenerator'));
const CssCheckboxGenerator = lazy(() => import('./pages/tools/CssCheckboxGenerator'));
const CssClipPathGenerator = lazy(() => import('./pages/tools/CssClipPathGenerator'));
const CssCubicBezierGenerator = lazy(() => import('./pages/tools/CssCubicBezierGenerator'));
const CssFormatter = lazy(() => import('./pages/tools/CssFormatter'));
const CssGlassmorphismGenerator = lazy(() => import('./pages/tools/CssGlassmorphismGenerator'));
const CssLoaderGenerator = lazy(() => import('./pages/tools/CssLoaderGenerator'));
const CssMinifier = lazy(() => import('./pages/tools/CssMinifier'));
const CssSwitchGenerator = lazy(() => import('./pages/tools/CssSwitchGenerator'));
const DataVisualizationBuilder = lazy(() => import('./pages/tools/DataVisualizationBuilder'));
const EChartsIntegration = lazy(() => import('./pages/tools/EChartsIntegration'));
const FontPairingFinder = lazy(() => import('./pages/tools/FontPairingFinder'));
const GraphicsEditor = lazy(() => import('./pages/tools/GraphicsEditor'));
const HandwritingGenerator = lazy(() => import('./pages/tools/HandwritingGenerator'));
const HtmlEncoderDecoder = lazy(() => import('./pages/tools/HtmlEncoderDecoder'));
const HtmlFormatter = lazy(() => import('./pages/tools/HtmlFormatter'));
const HtmlMinifier = lazy(() => import('./pages/tools/HtmlMinifier'));
const ImageAverageColorFinder = lazy(() => import('./pages/tools/ImageAverageColorFinder'));
const ImageColorExtractor = lazy(() => import('./pages/tools/ImageColorExtractor'));
const ImageColorPicker = lazy(() => import('./pages/tools/ImageColorPicker'));
const ImageResizer = lazy(() => import('./pages/tools/ImageResizer'));
const ImageToPdf = lazy(() => import('./pages/tools/ImageToPdf'));
const ImageTrimmer = lazy(() => import('./pages/tools/ImageTrimmer'));
const InstagramFilters = lazy(() => import('./pages/tools/InstagramFilters'));
const InstagramPhotoDownloader = lazy(() => import('./pages/tools/InstagramPhotoDownloader'));
const InstagramPostGenerator = lazy(() => import('./pages/tools/InstagramPostGenerator'));
const JavascriptFormatter = lazy(() => import('./pages/tools/JavascriptFormatter'));
const JavascriptMinifier = lazy(() => import('./pages/tools/JavascriptMinifier'));
const JsonTreeViewer = lazy(() => import('./pages/tools/JsonTreeViewer'));
const JwtEncoderDecoder = lazy(() => import('./pages/tools/JwtEncoderDecoder'));
const LetterCounter = lazy(() => import('./pages/tools/LetterCounter'));
const ListRandomizer = lazy(() => import('./pages/tools/ListRandomizer'));
const LoremIpsumGenerator = lazy(() => import('./pages/tools/LoremIpsumGenerator'));
const Md5EncryptDecrypt = lazy(() => import('./pages/tools/Md5EncryptDecrypt'));
const PdfAddPageNumbers = lazy(() => import('./pages/tools/PdfAddPageNumbers'));
const PdfAddWatermark = lazy(() => import('./pages/tools/PdfAddWatermark'));
const PdfCompress = lazy(() => import('./pages/tools/PdfCompress'));
const PdfCrop = lazy(() => import('./pages/tools/PdfCrop'));
const PdfExtractPages = lazy(() => import('./pages/tools/PdfExtractPages'));
const PdfMerge = lazy(() => import('./pages/tools/PdfMerge'));
const PdfMetadata = lazy(() => import('./pages/tools/PdfMetadata'));
const PdfPassword = lazy(() => import('./pages/tools/PdfPassword'));
const PdfRotate = lazy(() => import('./pages/tools/PdfRotate'));
const PdfSplit = lazy(() => import('./pages/tools/PdfSplit'));
const PdfToImage = lazy(() => import('./pages/tools/PdfToImage'));
const PdfToWord = lazy(() => import('./pages/tools/PdfToWord'));
const PhotoFilters = lazy(() => import('./pages/tools/PhotoFilters'));
const QRCodeGenerator = lazy(() => import('./pages/tools/QRCodeGenerator'));
const ReactNativeShadowGenerator = lazy(() => import('./pages/tools/ReactNativeShadowGenerator'));
const Sha1EncryptDecrypt = lazy(() => import('./pages/tools/Sha1EncryptDecrypt'));
const Sha224EncryptDecrypt = lazy(() => import('./pages/tools/Sha224EncryptDecrypt'));
const Sha256EncryptDecrypt = lazy(() => import('./pages/tools/Sha256EncryptDecrypt'));
const Sha384EncryptDecrypt = lazy(() => import('./pages/tools/Sha384EncryptDecrypt'));
const Sha512EncryptDecrypt = lazy(() => import('./pages/tools/Sha512EncryptDecrypt'));
const StrongRandomPasswordGenerator = lazy(() => import('./pages/tools/StrongRandomPasswordGenerator'));
const TextToHandwritingConverter = lazy(() => import('./pages/tools/TextToHandwritingConverter'));
const ColorPrismHandwritingConverter = lazy(() => import('./pages/tools/ColorPrismHandwritingConverter'));
const UrlEncoderDecoder = lazy(() => import('./pages/tools/UrlEncoderDecoder'));
const UrlSlugGenerator = lazy(() => import('./pages/tools/UrlSlugGenerator'));
const WhitespaceCleaner = lazy(() => import('./pages/tools/WhitespaceCleaner'));

function App() {
  useSEO();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/tools" element={<Layout />}>
        <Route index element={<Navigate to="/tools/dashboard" replace />} />
        <Route path="dashboard" element={<EnhancedDashboard />} />
        
        {/* Tool routes */}
        <Route path="barcode-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Barcode Generator"><BarcodeGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="base64-encoder-decoder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Base64 Encoder Decoder"><Base64EncoderDecoder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="bionic-text-converter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Bionic Text Converter"><BionicTextConverter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="bionic-reading-converter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Bionic Reading Converter"><BionicTextConverter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="bulk-barcode-qr-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Bulk Barcode QR Generator"><BulkBarcodeQRGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="case-converter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Case Converter"><CaseConverter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="chart-exporter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Chart Exporter"><ChartExporter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="code-to-image-converter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Code To Image Converter"><CodeToImageConverter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="color-prism" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Color Prism"><ColorPrism /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-background-pattern-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Background Pattern Generator"><CssBackgroundPatternGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-border-radius-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Border Radius Generator"><CssBorderRadiusGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-checkbox-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Checkbox Generator"><CssCheckboxGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-clip-path-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Clip Path Generator"><CssClipPathGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-cubic-bezier-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Cubic Bezier Generator"><CssCubicBezierGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-formatter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Formatter"><CssFormatter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-glassmorphism-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Glassmorphism Generator"><CssGlassmorphismGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-loader-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Loader Generator"><CssLoaderGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-minifier" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Minifier"><CssMinifier /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="css-switch-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="CSS Switch Generator"><CssSwitchGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="data-visualization-builder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Data Visualization Builder"><DataVisualizationBuilder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="echarts-integration" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="ECharts Integration"><EChartsIntegration /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="font-pairing-finder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Font Pairing Finder"><FontPairingFinder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="google-fonts-pair-finder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Google Fonts Pair Finder"><FontPairingFinder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="graphics-editor" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Graphics Editor"><GraphicsEditor /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="handwriting-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Handwriting Generator"><HandwritingGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="html-encoder-decoder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="HTML Encoder Decoder"><HtmlEncoderDecoder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="html-formatter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="HTML Formatter"><HtmlFormatter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="html-minifier" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="HTML Minifier"><HtmlMinifier /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="image-average-color-finder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Image Average Color Finder"><ImageAverageColorFinder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="image-color-extractor" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Image Color Extractor"><ImageColorExtractor /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="image-color-picker" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Image Color Picker"><ImageColorPicker /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="color-prism" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Color Prism"><ColorPrism /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="image-resizer" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Image Resizer"><ImageResizer /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="image-to-pdf" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Image To PDF"><ImageToPdf /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="image-trimmer" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Image Trimmer"><ImageTrimmer /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="instagram-filters" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Instagram Filters"><InstagramFilters /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="instagram-photo-downloader" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Instagram Photo Downloader"><InstagramPhotoDownloader /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="instagram-post-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Instagram Post Generator"><InstagramPostGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="javascript-formatter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="JavaScript Formatter"><JavascriptFormatter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="javascript-minifier" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="JavaScript Minifier"><JavascriptMinifier /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="json-tree-viewer" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="JSON Tree Viewer"><JsonTreeViewer /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="jwt-encoder-decoder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="JWT Encoder Decoder"><JwtEncoderDecoder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="letter-counter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Letter Counter"><LetterCounter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="list-randomizer" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="List Randomizer"><ListRandomizer /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="lorem-ipsum-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Lorem Ipsum Generator"><LoremIpsumGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="md5-encrypt-decrypt" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="MD5 Encrypt Decrypt"><Md5EncryptDecrypt /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-add-page-numbers" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Add Page Numbers"><PdfAddPageNumbers /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-add-watermark" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Add Watermark"><PdfAddWatermark /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-compress" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Compress"><PdfCompress /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-crop" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Crop"><PdfCrop /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-extract-pages" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Extract Pages"><PdfExtractPages /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-merge" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Merge"><PdfMerge /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-metadata" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Metadata"><PdfMetadata /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-password" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Password"><PdfPassword /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-rotate" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Rotate"><PdfRotate /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-split" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF Split"><PdfSplit /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-to-image" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF To Image"><PdfToImage /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="pdf-to-word" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="PDF To Word"><PdfToWord /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="photo-filters" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Photo Filters"><PhotoFilters /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="qrcode-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="QR Code Generator"><QRCodeGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="react-native-shadow-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="React Native Shadow Generator"><ReactNativeShadowGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="sha1-encrypt-decrypt" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="SHA1 Encrypt Decrypt"><Sha1EncryptDecrypt /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="sha224-encrypt-decrypt" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="SHA224 Encrypt Decrypt"><Sha224EncryptDecrypt /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="sha256-encrypt-decrypt" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="SHA256 Encrypt Decrypt"><Sha256EncryptDecrypt /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="sha384-encrypt-decrypt" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="SHA384 Encrypt Decrypt"><Sha384EncryptDecrypt /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="sha512-encrypt-decrypt" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="SHA512 Encrypt Decrypt"><Sha512EncryptDecrypt /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="strong-random-password-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Strong Random Password Generator"><StrongRandomPasswordGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="text-to-handwriting-converter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Text To Handwriting Converter"><TextToHandwritingConverter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="color-prism-handwriting-converter" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Color Prism Handwriting Converter"><ColorPrismHandwritingConverter /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="url-encoder-decoder" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="URL Encoder Decoder"><UrlEncoderDecoder /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="url-slug-generator" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="URL Slug Generator"><UrlSlugGenerator /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="whitespace-cleaner" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Whitespace Cleaner"><WhitespaceCleaner /></ErrorBoundary>
          </Suspense>
        } />
        <Route path="multiple-whitespace-remover" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Multiple Whitespace Remover"><WhitespaceCleaner /></ErrorBoundary>
          </Suspense>
        } />
      </Route>

      {/* 404 handler */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center space-y-4">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tool Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The tool you're looking for doesn't exist or the URL is incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                onClick={() => window.location.href = '/tools/dashboard'}
              >
                Go to Dashboard
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;