import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSEO } from './hooks/useSEO';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import { TOOLS_REGISTRY } from './config/toolsConfig';

const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const EnhancedDashboard = lazy(() => import('./components/EnhancedDashboard'));

const tools = {
  'barcode-generator': lazy(() => import('./pages/tools/BarcodeGenerator')),
  'base64-encoder-decoder': lazy(() => import('./pages/tools/Base64EncoderDecoder')),
  'bionic-text-converter': lazy(() => import('./pages/tools/BionicTextConverter')),
  'bulk-barcode-qr-generator': lazy(() => import('./pages/tools/BulkBarcodeQRGenerator')),
  'case-converter': lazy(() => import('./pages/tools/CaseConverter')),
  'chart-exporter': lazy(() => import('./pages/tools/ChartExporter')),
  'code-to-image-converter': lazy(() => import('./pages/tools/CodeToImageConverter')),
  'color-prism': lazy(() => import('./pages/tools/ColorPrism')),
  'color-prism-handwriting-converter': lazy(() => import('./pages/tools/ColorPrismHandwritingConverter')),
  'css-background-pattern-generator': lazy(() => import('./pages/tools/CssBackgroundPatternGenerator')),
  'css-border-radius-generator': lazy(() => import('./pages/tools/CssBorderRadiusGenerator')),
  'css-checkbox-generator': lazy(() => import('./pages/tools/CssCheckboxGenerator')),
  'css-clip-path-generator': lazy(() => import('./pages/tools/CssClipPathGenerator')),
  'css-cubic-bezier-generator': lazy(() => import('./pages/tools/CssCubicBezierGenerator')),
  'css-formatter': lazy(() => import('./pages/tools/CssFormatter')),
  'css-glassmorphism-generator': lazy(() => import('./pages/tools/CssGlassmorphismGenerator')),
  'css-loader-generator': lazy(() => import('./pages/tools/CssLoaderGenerator')),
  'css-minifier': lazy(() => import('./pages/tools/CssMinifier')),
  'css-switch-generator': lazy(() => import('./pages/tools/CssSwitchGenerator')),
  'css-gradient-button-generator': lazy(() => import('./pages/tools/CssGradientButtonGenerator')),
  'data-visualization-builder': lazy(() => import('./pages/tools/DataVisualizationBuilder')),
  'echarts-integration': lazy(() => import('./pages/tools/EChartsIntegration')),
  'font-pairing-finder': lazy(() => import('./pages/tools/FontPairingFinder')),
  'free-4k-wallpaper': lazy(() => import('./pages/tools/Free4kWallpaper')),
  'gif-finder': lazy(() => import('./pages/tools/GifFinder')),
  'graphics-editor': lazy(() => import('./pages/tools/GraphicsEditor')),
  'handwriting-generator': lazy(() => import('./pages/tools/HandwritingGenerator')),
  'html-encoder-decoder': lazy(() => import('./pages/tools/HtmlEncoderDecoder')),
  'html-formatter': lazy(() => import('./pages/tools/HtmlFormatter')),
  'html-minifier': lazy(() => import('./pages/tools/HtmlMinifier')),
  'image-average-color-finder': lazy(() => import('./pages/tools/ImageAverageColorFinder')),
  'image-background-remover': lazy(() => import('./pages/tools/ImageBackgroundRemover')),
  'image-color-extractor': lazy(() => import('./pages/tools/ImageColorExtractor')),
  'image-color-picker': lazy(() => import('./pages/tools/ImageColorPicker')),
  'image-resizer': lazy(() => import('./pages/tools/ImageResizer')),
  'image-to-pdf': lazy(() => import('./pages/tools/ImageToPdf')),
  'image-trimmer': lazy(() => import('./pages/tools/ImageTrimmer')),
  'instagram-filters': lazy(() => import('./pages/tools/InstagramFilters')),
  'instagram-photo-downloader': lazy(() => import('./pages/tools/InstagramPhotoDownloader')),
  'instagram-post-generator': lazy(() => import('./pages/tools/InstagramPostGenerator')),
  'javascript-formatter': lazy(() => import('./pages/tools/JavascriptFormatter')),
  'javascript-minifier': lazy(() => import('./pages/tools/JavascriptMinifier')),
  'json-tree-viewer': lazy(() => import('./pages/tools/JsonTreeViewer')),
  'jwt-encoder-decoder': lazy(() => import('./pages/tools/JwtEncoderDecoder')),
  'letter-counter': lazy(() => import('./pages/tools/LetterCounter')),
  'list-randomizer': lazy(() => import('./pages/tools/ListRandomizer')),
  'lorem-ipsum-generator': lazy(() => import('./pages/tools/LoremIpsumGenerator')),
  'md5-encrypt-decrypt': lazy(() => import('./pages/tools/Md5EncryptDecrypt')),
  'pdf-add-page-numbers': lazy(() => import('./pages/tools/PdfAddPageNumbers')),
  'pdf-add-watermark': lazy(() => import('./pages/tools/PdfAddWatermark')),
  'pdf-compress': lazy(() => import('./pages/tools/PdfCompress')),
  'pdf-crop': lazy(() => import('./pages/tools/PdfCrop')),
  'pdf-extract-pages': lazy(() => import('./pages/tools/PdfExtractPages')),
  'pdf-merge': lazy(() => import('./pages/tools/PdfMerge')),
  'pdf-metadata': lazy(() => import('./pages/tools/PdfMetadata')),
  'pdf-password': lazy(() => import('./pages/tools/PdfPassword')),
  'pdf-rotate': lazy(() => import('./pages/tools/PdfRotate')),
  'pdf-split': lazy(() => import('./pages/tools/PdfSplit')),
  'pdf-to-image': lazy(() => import('./pages/tools/PdfToImage')),
  'pdf-to-word': lazy(() => import('./pages/tools/PdfToWord')),
  'photo-filters': lazy(() => import('./pages/tools/PhotoFilters')),
  'qrcode-generator': lazy(() => import('./pages/tools/QRCodeGenerator')),
  'react-native-shadow-generator': lazy(() => import('./pages/tools/ReactNativeShadowGenerator')),
  'rich-text-editor': lazy(() => import('./pages/tools/RichTextEditor')),
  'sha1-encrypt-decrypt': lazy(() => import('./pages/tools/Sha1EncryptDecrypt')),
  'sha224-encrypt-decrypt': lazy(() => import('./pages/tools/Sha224EncryptDecrypt')),
  'sha256-encrypt-decrypt': lazy(() => import('./pages/tools/Sha256EncryptDecrypt')),
  'sha384-encrypt-decrypt': lazy(() => import('./pages/tools/Sha384EncryptDecrypt')),
  'sha512-encrypt-decrypt': lazy(() => import('./pages/tools/Sha512EncryptDecrypt')),
  'strong-random-password-generator': lazy(() => import('./pages/tools/StrongRandomPasswordGenerator')),
  'text-to-handwriting-converter': lazy(() => import('./pages/tools/TextToHandwritingConverter')),
  'url-encoder-decoder': lazy(() => import('./pages/tools/UrlEncoderDecoder')),
  'url-slug-generator': lazy(() => import('./pages/tools/UrlSlugGenerator')),
  'whitespace-cleaner': lazy(() => import('./pages/tools/WhitespaceCleaner')),
  'maps-data-scraper': lazy(() => import('./pages/tools/MapsDataScraper')),
  'image-cropper': lazy(() => import('./pages/tools/ImageCropper')),
  'color-palette': lazy(() => import('./pages/tools/ColorPalette')),
  'twitter-card-generator': lazy(() => import('./pages/tools/TwitterCardGenerator')),
  'hashtag-generator': lazy(() => import('./pages/tools/HashtagGenerator')),
  'image-watermark': lazy(() => import('./pages/tools/ImageWatermark')),
  'location-finder': lazy(() => import('./pages/tools/LocationFinder')),
  'lead-generator': lazy(() => import('./pages/tools/LeadGenerator')),
  'email-validator': lazy(() => import('./pages/tools/EmailValidator')),
  'company-profiler': lazy(() => import('./pages/tools/CompanyProfiler')),
  'lead-generation-ai': lazy(() => import('./pages/tools/LeadGenerationTool')),
  'ui-component-library': lazy(() => import('./pages/tools/UiComponentLibrary')),
  'button-generator': lazy(() => import('./pages/tools/ButtonGenerator')),
  'card-designer': lazy(() => import('./pages/tools/CardDesigner')),
  'loading-animation-generator': lazy(() => import('./pages/tools/LoadingAnimationGenerator')),
};

const toolNames: Record<string, string> = Object.fromEntries(
  Object.values(TOOLS_REGISTRY).map(tool => [tool.id, tool.name])
);

function App() {
  // SEO data for different routes
  const seoData = {
    // 主页
    '/': {
      title: 'Super Tools - 高效在线工具集合',
      description: '提供超过100+种实用工具，涵盖文本处理、图像编辑、编码辅助等多种类型',
      keywords: '在线工具, 文本处理, 图像编辑, 编码工具, 实用工具',
      ogImage: '/images/seo/landing-page-og.jpg'
    },
    // 工具仪表板
    '/tools/dashboard': {
      title: '工具仪表板 - Super Tools',
      description: '浏览所有可用工具并快速访问最近使用的功能',
      keywords: '工具仪表板, 工具列表, 工具导航',
      ogImage: '/images/seo/dashboard-og.jpg'
    },
    // 默认工具SEO数据（当具体工具没有定义时使用）
    defaultToolSEO: {
      title: '工具 - Super Tools',
      description: '强大的在线工具，帮助您快速完成各种任务',
      keywords: '在线工具, 实用工具, 工具应用',
      ogImage: '/images/seo/tool-default-og.jpg'
    }
  };

  // 使用SEO钩子应用SEO数据
  useSEO();
  
  // 检查Service Worker更新
  useEffect(() => {
    // Check for service worker updates periodically
    const swUpdateInterval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.update();
          }
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Clean up interval on component unmount
    return () => {
      clearInterval(swUpdateInterval);
    };
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/tools" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<LoadingComponent />}>
            <ErrorBoundary toolName="Dashboard">
              <EnhancedDashboard />
            </ErrorBoundary>
          </Suspense>
        } />
        
        {Object.entries(tools).map(([path, Component]) => (
          <Route 
            key={path} 
            path={path} 
            element={
              <Suspense fallback={<LoadingComponent />}>
                <ErrorBoundary toolName={toolNames[path] || 'Tool'}>
                  <div className="min-h-screen">
                    <Component />
                  </div>
                </ErrorBoundary>
              </Suspense>
            } 
          />
        ))}
        
        <Route path="bionic-reading-converter" element={<Navigate to="bionic-text-converter" replace />} />
        <Route path="google-fonts-pair-finder" element={<Navigate to="font-pairing-finder" replace />} />
        <Route path="multiple-whitespace-remover" element={<Navigate to="whitespace-cleaner" replace />} />
        
        {/* Catch-all for unknown tools - redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Global catch-all - redirect to tools dashboard */}
      <Route path="*" element={<Navigate to="/tools/dashboard" replace />} />
    </Routes>
  );
}

export default App;