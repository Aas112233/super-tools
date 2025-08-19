import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import DashboardContent from './components/DashboardContent';
import LandingPage from './pages/LandingPage';
import { CaseConverter } from './pages/tools/CaseConverter';
import { LoremIpsumGenerator } from './pages/tools/LoremIpsumGenerator';
import { LetterCounter } from './pages/tools/LetterCounter';
import { HandwritingGenerator } from './pages/tools/HandwritingGenerator';
import { BionicTextConverter } from './pages/tools/BionicTextConverter';
import { WhitespaceCleaner } from './pages/tools/WhitespaceCleaner';
import { FontPairingFinder } from './pages/tools/FontPairingFinder';
import { ImageTrimmer } from './pages/tools/ImageTrimmer';
import { PhotoFilters } from './pages/tools/PhotoFilters';
import { ImageResizer } from './pages/tools/ImageResizer';
import { ImageColorExtractor } from './pages/tools/ImageColorExtractor';
import { CssLoaderGenerator } from './pages/tools/CssLoaderGenerator';
import { CssSwitchGenerator } from './pages/tools/CssSwitchGenerator';
import { CssCheckboxGenerator } from './pages/tools/CssCheckboxGenerator';
import { CssClipPathGenerator } from './pages/tools/CssClipPathGenerator';
import { CssGlassmorphismGenerator } from './pages/tools/CssGlassmorphismGenerator';
import { CodeToImageConverter } from './pages/tools/CodeToImageConverter';
import { UrlSlugGenerator } from './pages/tools/UrlSlugGenerator';
import { ReactNativeShadowGenerator } from './pages/tools/ReactNativeShadowGenerator';
import { Base64EncoderDecoder } from './pages/tools/Base64EncoderDecoder';
import { HtmlEncoderDecoder } from './pages/tools/HtmlEncoderDecoder';
import { UrlEncoderDecoder } from './pages/tools/UrlEncoderDecoder';
import { HtmlMinifier } from './pages/tools/HtmlMinifier';
import { CssMinifier } from './pages/tools/CssMinifier';
import { JavascriptMinifier } from './pages/tools/JavascriptMinifier';
import { HtmlFormatter } from './pages/tools/HtmlFormatter';
import { CssFormatter } from './pages/tools/CssFormatter';
import { JavascriptFormatter } from './pages/tools/JavascriptFormatter';
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
import { BarcodeGenerator } from './pages/tools/BarcodeGenerator';
import { QRCodeGenerator } from './pages/tools/QRCodeGenerator';
import { BulkBarcodeQRGenerator } from './pages/tools/BulkBarcodeQRGenerator';
import { ToolPage } from './components/ToolPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tools" element={<Layout />}>
          <Route index element={<DashboardContent />} />
          <Route path="case-converter" element={<CaseConverter />} />
          <Route path="lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
          <Route path="letter-counter" element={<LetterCounter />} />
          <Route path="text-to-handwriting-converter" element={<HandwritingGenerator />} />
          <Route path="bionic-reading-converter" element={<BionicTextConverter />} />
          <Route path="multiple-whitespace-remover" element={<WhitespaceCleaner />} />
          <Route path="google-fonts-pair-finder" element={<FontPairingFinder />} />
          <Route path="image-cropper" element={<ImageTrimmer />} />
          <Route path="image-filters" element={<PhotoFilters />} />
          <Route path="image-resizer" element={<ImageResizer />} />
          <Route path="image-color-extractor" element={<ImageColorExtractor />} />
          <Route path="css-loader-generator" element={<CssLoaderGenerator />} />
          <Route path="css-checkbox-generator" element={<CssCheckboxGenerator />} />
          <Route path="css-switch-generator" element={<CssSwitchGenerator />} />
          <Route path="css-clip-path-generator" element={<CssClipPathGenerator />} />
          <Route path="css-glassmorphism-generator" element={<CssGlassmorphismGenerator />} />
          <Route path="code-to-image-converter" element={<CodeToImageConverter />} />
          <Route path="html-minifier" element={<HtmlMinifier />} />
          <Route path="css-minifier" element={<CssMinifier />} />
          <Route path="javascript-minifier" element={<JavascriptMinifier />} />
          <Route path="html-formatter" element={<HtmlFormatter />} />
          <Route path="css-formatter" element={<CssFormatter />} />
          <Route path="javascript-formatter" element={<JavascriptFormatter />} />
          <Route path="md5-encrypt-decrypt" element={<Md5EncryptDecrypt />} />
          <Route path="sha1-encrypt-decrypt" element={<Sha1EncryptDecrypt />} />
          <Route path="sha224-encrypt-decrypt" element={<Sha224EncryptDecrypt />} />
          <Route path="sha256-encrypt-decrypt" element={<Sha256EncryptDecrypt />} />
          <Route path="sha384-encrypt-decrypt" element={<Sha384EncryptDecrypt />} />
          <Route path="sha512-encrypt-decrypt" element={<Sha512EncryptDecrypt />} />
          <Route path="jwt-encoder-decoder" element={<JwtEncoderDecoder />} />
          <Route path="json-tree-viewer" element={<JsonTreeViewer />} />
          <Route path="image-average-color-finder" element={<ToolPage title="Average Color Detector" />} />
          <Route path="image-color-picker" element={<ToolPage title="Color Selector" />} />
          <Route path="css-background-pattern-generator" element={<ToolPage title="Background Pattern Maker" />} />
          <Route path="css-cubic-bezier-generator" element={<ToolPage title="Animation Curve Designer" />} />
          <Route path="url-slug-generator" element={<UrlSlugGenerator />} />
          <Route path="react-native-shadow-generator" element={<ReactNativeShadowGenerator />} />
          <Route path="base64-encoder-decoder" element={<Base64EncoderDecoder />} />
          <Route path="html-encoder-decoder" element={<HtmlEncoderDecoder />} />
          <Route path="url-encoder-decoder" element={<UrlEncoderDecoder />} />
          <Route path="instagram-filters" element={<InstagramFilters />} />
          <Route path="instagram-post-generator" element={<InstagramPostGenerator />} />
          <Route path="instagram-photo-downloader" element={<InstagramPhotoDownloader />} />
          <Route path="barcode-generator" element={<BarcodeGenerator />} />
          <Route path="bulk-barcode-qr-generator" element={<BulkBarcodeQRGenerator />} />
          <Route path="qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="tweet-generator" element={<ToolPage title="Twitter Post Creator" />} />
          <Route path="tweet-to-image-converter" element={<ToolPage title="Tweet Image Generator" />} />
          <Route path="twitter-ad-revenue-generator" element={<ToolPage title="Twitter Ad Earnings Calculator" />} />
          <Route path="strong-random-password-generator" element={<ToolPage title="Secure Password Creator" />} />
          <Route path="list-randomizer" element={<ToolPage title="Item Shuffler" />} />
          <Route path="fake-iban-generator" element={<ToolPage title="Mock IBAN Generator" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;