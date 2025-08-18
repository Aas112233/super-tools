import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import DashboardContent from './components/DashboardContent';
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
import { InstagramFilters } from './pages/tools/InstagramFilters';
import { InstagramPostGenerator } from './pages/tools/InstagramPostGenerator';
import { InstagramPhotoDownloader } from './pages/tools/InstagramPhotoDownloader';
import { ToolPage } from './components/ToolPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
          <Route path="/tools/letter-counter" element={<LetterCounter />} />
          <Route path="/tools/text-to-handwriting-converter" element={<HandwritingGenerator />} />
          <Route path="/tools/bionic-reading-converter" element={<BionicTextConverter />} />
          <Route path="/tools/multiple-whitespace-remover" element={<WhitespaceCleaner />} />
          <Route path="/tools/google-fonts-pair-finder" element={<FontPairingFinder />} />
          <Route path="/tools/image-cropper" element={<ImageTrimmer />} />
          <Route path="/tools/image-filters" element={<PhotoFilters />} />
          <Route path="/tools/image-resizer" element={<ImageResizer />} />
          <Route path="/tools/image-color-extractor" element={<ImageColorExtractor />} />
          <Route path="/tools/css-loader-generator" element={<CssLoaderGenerator />} />
          <Route path="/tools/css-checkbox-generator" element={<CssCheckboxGenerator />} />
          <Route path="/tools/css-switch-generator" element={<CssSwitchGenerator />} />
          <Route path="/tools/css-clip-path-generator" element={<CssClipPathGenerator />} />
          <Route path="/tools/css-glassmorphism-generator" element={<CssGlassmorphismGenerator />} />
          <Route path="/tools/code-to-image-converter" element={<CodeToImageConverter />} />
          <Route path="/tools/image-average-color-finder" element={<ToolPage title="Average Color Detector" />} />
          <Route path="/tools/image-color-picker" element={<ToolPage title="Color Selector" />} />
          <Route path="/tools/css-background-pattern-generator" element={<ToolPage title="Background Pattern Maker" />} />
          <Route path="/tools/css-cubic-bezier-generator" element={<ToolPage title="Animation Curve Designer" />} />
          <Route path="/tools/url-slug-generator" element={<UrlSlugGenerator />} />
          <Route path="/tools/react-native-shadow-generator" element={<ReactNativeShadowGenerator />} />
          <Route path="/tools/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
          <Route path="/tools/html-encoder-decoder" element={<HtmlEncoderDecoder />} />
          <Route path="/tools/url-encoder-decoder" element={<UrlEncoderDecoder />} />
          <Route path="/tools/instagram-filters" element={<InstagramFilters />} />
          <Route path="/tools/instagram-post-generator" element={<InstagramPostGenerator />} />
          <Route path="/tools/instagram-photo-downloader" element={<InstagramPhotoDownloader />} />
          <Route path="/tools/tweet-generator" element={<ToolPage title="Twitter Post Creator" />} />
          <Route path="/tools/tweet-to-image-converter" element={<ToolPage title="Tweet Image Generator" />} />
          <Route path="/tools/twitter-ad-revenue-generator" element={<ToolPage title="Twitter Ad Earnings Calculator" />} />
          <Route path="/tools/strong-random-password-generator" element={<ToolPage title="Secure Password Creator" />} />
          <Route path="/tools/list-randomizer" element={<ToolPage title="Item Shuffler" />} />
          <Route path="/tools/qr-code-generator" element={<ToolPage title="QR Code Creator" />} />
          <Route path="/tools/barcode-generator" element={<ToolPage title="Barcode Maker" />} />
          <Route path="/tools/fake-iban-generator" element={<ToolPage title="Mock IBAN Generator" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;