import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import DashboardContent from './components/DashboardContent';
import * as Tools from './pages/tools/index';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/tools" element={<DashboardContent />} />
        <Route path="/tools/case-converter" element={<Tools.CaseConverter />} />
        <Route path="/tools/lorem-ipsum-generator" element={<Tools.LoremIpsumGenerator />} />
        <Route path="/tools/letter-counter" element={<Tools.LetterCounter />} />
        <Route path="/tools/text-to-handwriting-converter" element={<Tools.TextToHandwritingConverter />} />
        <Route path="/tools/bionic-reading-converter" element={<Tools.BionicReadingConverter />} />
        <Route path="/tools/multiple-whitespace-remover" element={<Tools.MultipleWhitespaceRemover />} />
        <Route path="/tools/google-fonts-pair-finder" element={<Tools.GoogleFontsPairFinder />} />
        <Route path="/tools/image-cropper" element={<Tools.ImageCropper />} />
        <Route path="/tools/image-filters" element={<Tools.ImageFilters />} />
        <Route path="/tools/image-resizer" element={<Tools.ImageResizer />} />
        <Route path="/tools/image-average-color-finder" element={<Tools.ImageAverageColorFinder />} />
        <Route path="/tools/image-color-extractor" element={<Tools.ImageColorExtractor />} />
        <Route path="/tools/image-color-picker" element={<Tools.ImageColorPicker />} />
        <Route path="/tools/css-loader-generator" element={<Tools.CssLoaderGenerator />} />
        <Route path="/tools/css-checkbox-generator" element={<Tools.CssCheckboxGenerator />} />
        <Route path="/tools/css-switch-generator" element={<Tools.CssSwitchGenerator />} />
        <Route path="/tools/css-clip-path-generator" element={<Tools.CssClipPathGenerator />} />
        <Route path="/tools/css-background-pattern-generator" element={<Tools.CssBackgroundPatternGenerator />} />
        <Route path="/tools/css-cubic-bezier-generator" element={<Tools.CssCubicBezierGenerator />} />
        <Route path="/tools/css-glassmorphism-generator" element={<Tools.CssGlassmorphismGenerator />} />
        <Route path="/tools/code-to-image-converter" element={<Tools.CodeToImageConverter />} />
        <Route path="/tools/url-slug-generator" element={<Tools.UrlSlugGenerator />} />
        <Route path="/tools/react-native-shadow-generator" element={<Tools.ReactNativeShadowGenerator />} />
        <Route path="/tools/base64-encoder-decoder" element={<Tools.Base64EncoderDecoder />} />
        <Route path="/tools/html-encoder-decoder" element={<Tools.HtmlEncoderDecoder />} />
        <Route path="/tools/url-encoder-decoder" element={<Tools.UrlEncoderDecoder />} />
        <Route path="/tools/instagram-filters" element={<Tools.InstagramFilters />} />
        <Route path="/tools/instagram-post-generator" element={<Tools.InstagramPostGenerator />} />
        <Route path="/tools/instagram-photo-downloader" element={<Tools.InstagramPhotoDownloader />} />
        <Route path="/tools/tweet-generator" element={<Tools.TweetGenerator />} />
        <Route path="/tools/tweet-to-image-converter" element={<Tools.TweetToImageConverter />} />
        <Route path="/tools/twitter-ad-revenue-generator" element={<Tools.TwitterAdRevenueGenerator />} />
        <Route path="/tools/strong-random-password-generator" element={<Tools.StrongRandomPasswordGenerator />} />
        <Route path="/tools/list-randomizer" element={<Tools.ListRandomizer />} />
        <Route path="/tools/qr-code-generator" element={<Tools.QrCodeGenerator />} />
        <Route path="/tools/barcode-generator" element={<Tools.BarcodeGenerator />} />
        <Route path="/tools/fake-iban-generator" element={<Tools.FakeIbanGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;