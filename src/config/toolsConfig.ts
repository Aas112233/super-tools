export interface Tool {
  id: string;
  name: string;
  href: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  tools: string[];
}

// Central tools registry - single source of truth
export const TOOLS_REGISTRY: Record<string, Tool> = {
  'barcode-generator': { 
    id: 'barcode-generator', 
    name: 'Barcode Generator', 
    href: '/tools/barcode-generator',
    category: 'generator-tools'
  },
  'base64-encoder-decoder': { 
    id: 'base64-encoder-decoder', 
    name: 'Base64 Encoder Decoder', 
    href: '/tools/base64-encoder-decoder',
    category: 'developer-tools'
  },
  'bionic-text-converter': { 
    id: 'bionic-text-converter', 
    name: 'Bionic Text Converter', 
    href: '/tools/bionic-text-converter',
    category: 'text-tools'
  },
  'bulk-barcode-qr-generator': { 
    id: 'bulk-barcode-qr-generator', 
    name: 'Bulk Barcode QR Generator', 
    href: '/tools/bulk-barcode-qr-generator',
    category: 'generator-tools'
  },
  'case-converter': { 
    id: 'case-converter', 
    name: 'Case Converter', 
    href: '/tools/case-converter',
    category: 'text-tools'
  },
  'chart-exporter': { 
    id: 'chart-exporter', 
    name: 'Chart Exporter', 
    href: '/tools/chart-exporter',
    category: 'chart-tools'
  },
  'code-to-image-converter': { 
    id: 'code-to-image-converter', 
    name: 'Code To Image Converter', 
    href: '/tools/code-to-image-converter',
    category: 'developer-tools'
  },
  'color-prism': { 
    id: 'color-prism', 
    name: 'Color Prism', 
    href: '/tools/color-prism',
    category: 'color-tools'
  },
  'color-prism-handwriting-converter': { 
    id: 'color-prism-handwriting-converter', 
    name: 'Color Prism Handwriting Converter', 
    href: '/tools/color-prism-handwriting-converter',
    category: 'text-tools'
  },
  'css-background-pattern-generator': { 
    id: 'css-background-pattern-generator', 
    name: 'CSS Background Pattern Generator', 
    href: '/tools/css-background-pattern-generator',
    category: 'css-tools'
  },
  'css-border-radius-generator': { 
    id: 'css-border-radius-generator', 
    name: 'CSS Border Radius Generator', 
    href: '/tools/css-border-radius-generator',
    category: 'css-tools'
  },
  'css-checkbox-generator': { 
    id: 'css-checkbox-generator', 
    name: 'CSS Checkbox Generator', 
    href: '/tools/css-checkbox-generator',
    category: 'css-tools'
  },
  'css-clip-path-generator': { 
    id: 'css-clip-path-generator', 
    name: 'CSS Clip Path Generator', 
    href: '/tools/css-clip-path-generator',
    category: 'css-tools'
  },
  'css-cubic-bezier-generator': { 
    id: 'css-cubic-bezier-generator', 
    name: 'CSS Cubic Bezier Generator', 
    href: '/tools/css-cubic-bezier-generator',
    category: 'css-tools'
  },
  'css-formatter': { 
    id: 'css-formatter', 
    name: 'CSS Formatter', 
    href: '/tools/css-formatter',
    category: 'css-tools'
  },
  'css-glassmorphism-generator': { 
    id: 'css-glassmorphism-generator', 
    name: 'CSS Glassmorphism Generator', 
    href: '/tools/css-glassmorphism-generator',
    category: 'css-tools'
  },
  'css-loader-generator': { 
    id: 'css-loader-generator', 
    name: 'CSS Loader Generator', 
    href: '/tools/css-loader-generator',
    category: 'css-tools'
  },
  'css-minifier': { 
    id: 'css-minifier', 
    name: 'CSS Minifier', 
    href: '/tools/css-minifier',
    category: 'css-tools'
  },
  'css-switch-generator': { 
    id: 'css-switch-generator', 
    name: 'CSS Switch Generator', 
    href: '/tools/css-switch-generator',
    category: 'css-tools'
  },
  'css-gradient-button-generator': { 
    id: 'css-gradient-button-generator', 
    name: 'CSS Gradient Button Generator', 
    href: '/tools/css-gradient-button-generator',
    category: 'css-tools'
  },
  'data-visualization-builder': { 
    id: 'data-visualization-builder', 
    name: 'Data Visualization Builder', 
    href: '/tools/data-visualization-builder',
    category: 'chart-tools'
  },
  'echarts-integration': { 
    id: 'echarts-integration', 
    name: 'ECharts Integration', 
    href: '/tools/echarts-integration',
    category: 'chart-tools'
  },
  'font-pairing-finder': { 
    id: 'font-pairing-finder', 
    name: 'Font Pairing Finder', 
    href: '/tools/font-pairing-finder',
    category: 'text-tools'
  },
  'free-4k-wallpaper': { 
    id: 'free-4k-wallpaper', 
    name: 'Free 4K Wallpaper', 
    href: '/tools/free-4k-wallpaper',
    category: 'image-tools'
  },
  'gif-finder': { 
    id: 'gif-finder', 
    name: 'GIF Finder', 
    href: '/tools/gif-finder',
    category: 'image-tools'
  },
  'graphics-editor': { 
    id: 'graphics-editor', 
    name: 'Graphics Editor', 
    href: '/tools/graphics-editor',
    category: 'image-tools'
  },
  'handwriting-generator': { 
    id: 'handwriting-generator', 
    name: 'Handwriting Generator', 
    href: '/tools/handwriting-generator',
    category: 'text-tools'
  },
  'html-encoder-decoder': { 
    id: 'html-encoder-decoder', 
    name: 'HTML Encoder Decoder', 
    href: '/tools/html-encoder-decoder',
    category: 'developer-tools'
  },
  'html-formatter': { 
    id: 'html-formatter', 
    name: 'HTML Formatter', 
    href: '/tools/html-formatter',
    category: 'developer-tools'
  },
  'html-minifier': { 
    id: 'html-minifier', 
    name: 'HTML Minifier', 
    href: '/tools/html-minifier',
    category: 'developer-tools'
  },
  'image-average-color-finder': { 
    id: 'image-average-color-finder', 
    name: 'Image Average Color Finder', 
    href: '/tools/image-average-color-finder',
    category: 'color-tools'
  },
  'image-background-remover': { 
    id: 'image-background-remover', 
    name: 'Image Background Remover', 
    href: '/tools/image-background-remover',
    category: 'image-tools'
  },
  'image-color-extractor': { 
    id: 'image-color-extractor', 
    name: 'Image Color Extractor', 
    href: '/tools/image-color-extractor',
    category: 'color-tools'
  },
  'image-color-picker': { 
    id: 'image-color-picker', 
    name: 'Image Color Picker', 
    href: '/tools/image-color-picker',
    category: 'color-tools'
  },
  'image-resizer': { 
    id: 'image-resizer', 
    name: 'Image Resizer', 
    href: '/tools/image-resizer',
    category: 'image-tools'
  },
  'image-to-pdf': { 
    id: 'image-to-pdf', 
    name: 'Image To PDF', 
    href: '/tools/image-to-pdf',
    category: 'image-tools'
  },
  'image-trimmer': { 
    id: 'image-trimmer', 
    name: 'Image Trimmer', 
    href: '/tools/image-trimmer',
    category: 'image-tools'
  },
  'instagram-filters': { 
    id: 'instagram-filters', 
    name: 'Instagram Filters', 
    href: '/tools/instagram-filters',
    category: 'social-media-tools'
  },
  'instagram-photo-downloader': { 
    id: 'instagram-photo-downloader', 
    name: 'Instagram Photo Downloader', 
    href: '/tools/instagram-photo-downloader',
    category: 'social-media-tools'
  },
  'instagram-post-generator': { 
    id: 'instagram-post-generator', 
    name: 'Instagram Post Generator', 
    href: '/tools/instagram-post-generator',
    category: 'social-media-tools'
  },
  'javascript-formatter': { 
    id: 'javascript-formatter', 
    name: 'JavaScript Formatter', 
    href: '/tools/javascript-formatter',
    category: 'developer-tools'
  },
  'javascript-minifier': { 
    id: 'javascript-minifier', 
    name: 'JavaScript Minifier', 
    href: '/tools/javascript-minifier',
    category: 'developer-tools'
  },
  'json-tree-viewer': { 
    id: 'json-tree-viewer', 
    name: 'JSON Tree Viewer', 
    href: '/tools/json-tree-viewer',
    category: 'developer-tools'
  },
  'jwt-encoder-decoder': { 
    id: 'jwt-encoder-decoder', 
    name: 'JWT Encoder Decoder', 
    href: '/tools/jwt-encoder-decoder',
    category: 'developer-tools'
  },
  'letter-counter': { 
    id: 'letter-counter', 
    name: 'Letter Counter', 
    href: '/tools/letter-counter',
    category: 'text-tools'
  },
  'list-randomizer': { 
    id: 'list-randomizer', 
    name: 'List Randomizer', 
    href: '/tools/list-randomizer',
    category: 'generator-tools'
  },
  'lorem-ipsum-generator': { 
    id: 'lorem-ipsum-generator', 
    name: 'Lorem Ipsum Generator', 
    href: '/tools/lorem-ipsum-generator',
    category: 'text-tools'
  },
  'md5-encrypt-decrypt': { 
    id: 'md5-encrypt-decrypt', 
    name: 'MD5 Encrypt Decrypt', 
    href: '/tools/md5-encrypt-decrypt',
    category: 'developer-tools'
  },
  'pdf-add-page-numbers': { 
    id: 'pdf-add-page-numbers', 
    name: 'PDF Add Page Numbers', 
    href: '/tools/pdf-add-page-numbers',
    category: 'pdf-tools'
  },
  'pdf-add-watermark': { 
    id: 'pdf-add-watermark', 
    name: 'PDF Add Watermark', 
    href: '/tools/pdf-add-watermark',
    category: 'pdf-tools'
  },
  'pdf-compress': { 
    id: 'pdf-compress', 
    name: 'PDF Compress', 
    href: '/tools/pdf-compress',
    category: 'pdf-tools'
  },
  'pdf-crop': { 
    id: 'pdf-crop', 
    name: 'PDF Crop', 
    href: '/tools/pdf-crop',
    category: 'pdf-tools'
  },
  'pdf-extract-pages': { 
    id: 'pdf-extract-pages', 
    name: 'PDF Extract Pages', 
    href: '/tools/pdf-extract-pages',
    category: 'pdf-tools'
  },
  'pdf-merge': { 
    id: 'pdf-merge', 
    name: 'PDF Merge', 
    href: '/tools/pdf-merge',
    category: 'pdf-tools'
  },
  'pdf-metadata': { 
    id: 'pdf-metadata', 
    name: 'PDF Metadata', 
    href: '/tools/pdf-metadata',
    category: 'pdf-tools'
  },
  'pdf-password': { 
    id: 'pdf-password', 
    name: 'PDF Password', 
    href: '/tools/pdf-password',
    category: 'pdf-tools'
  },
  'pdf-rotate': { 
    id: 'pdf-rotate', 
    name: 'PDF Rotate', 
    href: '/tools/pdf-rotate',
    category: 'pdf-tools'
  },
  'pdf-split': { 
    id: 'pdf-split', 
    name: 'PDF Split', 
    href: '/tools/pdf-split',
    category: 'pdf-tools'
  },
  'pdf-to-image': { 
    id: 'pdf-to-image', 
    name: 'PDF To Image', 
    href: '/tools/pdf-to-image',
    category: 'pdf-tools'
  },
  'pdf-to-word': { 
    id: 'pdf-to-word', 
    name: 'PDF To Word', 
    href: '/tools/pdf-to-word',
    category: 'pdf-tools'
  },
  'photo-filters': { 
    id: 'photo-filters', 
    name: 'Photo Filters', 
    href: '/tools/photo-filters',
    category: 'image-tools'
  },
  'qrcode-generator': { 
    id: 'qrcode-generator', 
    name: 'QR Code Generator', 
    href: '/tools/qrcode-generator',
    category: 'generator-tools'
  },
  'react-native-shadow-generator': { 
    id: 'react-native-shadow-generator', 
    name: 'React Native Shadow Generator', 
    href: '/tools/react-native-shadow-generator',
    category: 'developer-tools'
  },
  'rich-text-editor': { 
    id: 'rich-text-editor', 
    name: 'Rich Text Editor', 
    href: '/tools/rich-text-editor',
    category: 'text-tools'
  },
  'sha1-encrypt-decrypt': { 
    id: 'sha1-encrypt-decrypt', 
    name: 'SHA1 Encrypt Decrypt', 
    href: '/tools/sha1-encrypt-decrypt',
    category: 'developer-tools'
  },
  'sha224-encrypt-decrypt': { 
    id: 'sha224-encrypt-decrypt', 
    name: 'SHA224 Encrypt Decrypt', 
    href: '/tools/sha224-encrypt-decrypt',
    category: 'developer-tools'
  },
  'sha256-encrypt-decrypt': { 
    id: 'sha256-encrypt-decrypt', 
    name: 'SHA256 Encrypt Decrypt', 
    href: '/tools/sha256-encrypt-decrypt',
    category: 'developer-tools'
  },
  'sha384-encrypt-decrypt': { 
    id: 'sha384-encrypt-decrypt', 
    name: 'SHA384 Encrypt Decrypt', 
    href: '/tools/sha384-encrypt-decrypt',
    category: 'developer-tools'
  },
  'sha512-encrypt-decrypt': { 
    id: 'sha512-encrypt-decrypt', 
    name: 'SHA512 Encrypt Decrypt', 
    href: '/tools/sha512-encrypt-decrypt',
    category: 'developer-tools'
  },
  'strong-random-password-generator': { 
    id: 'strong-random-password-generator', 
    name: 'Strong Random Password Generator', 
    href: '/tools/strong-random-password-generator',
    category: 'generator-tools'
  },
  'text-to-handwriting-converter': { 
    id: 'text-to-handwriting-converter', 
    name: 'Text To Handwriting Converter', 
    href: '/tools/text-to-handwriting-converter',
    category: 'text-tools'
  },
  'url-encoder-decoder': { 
    id: 'url-encoder-decoder', 
    name: 'URL Encoder Decoder', 
    href: '/tools/url-encoder-decoder',
    category: 'developer-tools'
  },
  'url-slug-generator': { 
    id: 'url-slug-generator', 
    name: 'URL Slug Generator', 
    href: '/tools/url-slug-generator',
    category: 'developer-tools'
  },
  'whitespace-cleaner': { 
    id: 'whitespace-cleaner', 
    name: 'Whitespace Cleaner', 
    href: '/tools/whitespace-cleaner',
    category: 'text-tools'
  },
  'maps-data-scraper': { 
    id: 'maps-data-scraper', 
    name: 'Maps Data Scraper', 
    href: '/tools/maps-data-scraper',
    category: 'google-maps-tools'
  },

  'image-cropper': { 
    id: 'image-cropper', 
    name: 'Image Cropper', 
    href: '/tools/image-cropper',
    category: 'image-tools'
  },
  'color-palette': { 
    id: 'color-palette', 
    name: 'Color Palette Generator', 
    href: '/tools/color-palette',
    category: 'color-tools'
  },
  'twitter-card-generator': { 
    id: 'twitter-card-generator', 
    name: 'Twitter Card Generator', 
    href: '/tools/twitter-card-generator',
    category: 'social-media-tools'
  },
  'hashtag-generator': { 
    id: 'hashtag-generator', 
    name: 'Hashtag Generator', 
    href: '/tools/hashtag-generator',
    category: 'social-media-tools'
  },
  'image-watermark': { 
    id: 'image-watermark', 
    name: 'Image Watermark', 
    href: '/tools/image-watermark',
    category: 'image-tools'
  },
  'location-finder': { 
    id: 'location-finder', 
    name: 'Location Finder', 
    href: '/tools/location-finder',
    category: 'google-maps-tools'
  },
  'lead-generator': { 
    id: 'lead-generator', 
    name: 'Lead Generator', 
    href: '/tools/lead-generator',
    category: 'business-tools'
  },
  'email-validator': { 
    id: 'email-validator', 
    name: 'Email Validator', 
    href: '/tools/email-validator',
    category: 'business-tools'
  },
  'company-profiler': { 
    id: 'company-profiler', 
    name: 'Company Profiler', 
    href: '/tools/company-profiler',
    category: 'business-tools'
  },
  'lead-generation-ai': {
    id: 'lead-generation-ai',
    name: 'AI Lead Generation',
    href: '/tools/lead-generation-ai',
    category: 'business-tools'
  },
  'ui-component-library': { 
    id: 'ui-component-library', 
    name: 'UI Component Library', 
    href: '/tools/ui-component-library',
    category: 'css-tools'
  },
  'button-generator': { 
    id: 'button-generator', 
    name: 'Button Generator', 
    href: '/tools/button-generator',
    category: 'css-tools'
  },
  'card-designer': { 
    id: 'card-designer', 
    name: 'Card Designer', 
    href: '/tools/card-designer',
    category: 'css-tools'
  },
  'loading-animation-generator': { 
    id: 'loading-animation-generator', 
    name: 'Loading Animation Generator', 
    href: '/tools/loading-animation-generator',
    category: 'css-tools'
  },
};

// Categories configuration
export const CATEGORIES_CONFIG: Category[] = [
  {
    id: 'favorite-tools',
    name: 'Bookmarked Tools',
    tools: [] // Will be populated dynamically
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    tools: [
      'rich-text-editor', 'bionic-text-converter', 'case-converter',
      'font-pairing-finder', 'handwriting-generator', 'letter-counter',
      'lorem-ipsum-generator', 'text-to-handwriting-converter',
      'color-prism-handwriting-converter', 'whitespace-cleaner'
    ]
  },
  {
    id: 'color-tools',
    name: 'Color Tools',
    tools: [
      'color-prism', 'color-palette', 'image-average-color-finder', 'image-color-extractor', 'image-color-picker'
    ]
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    tools: [
      'code-to-image-converter', 'image-resizer', 'image-to-pdf',
      'image-trimmer', 'image-cropper', 'image-watermark', 'image-background-remover', 'photo-filters',
      'free-4k-wallpaper', 'graphics-editor', 'gif-finder'
    ]
  },
  {
    id: 'css-tools',
    name: 'CSS Tools',
    tools: [
      'css-background-pattern-generator', 'css-border-radius-generator',
      'css-checkbox-generator', 'css-clip-path-generator', 'css-cubic-bezier-generator',
      'css-formatter', 'css-glassmorphism-generator', 'css-loader-generator',
      'css-minifier', 'css-switch-generator', 'css-gradient-button-generator',
      'ui-component-library', 'button-generator', 'card-designer', 'loading-animation-generator'
    ]
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    tools: [
      'base64-encoder-decoder', 'html-encoder-decoder', 'html-formatter',
      'html-minifier', 'javascript-formatter', 'javascript-minifier',
      'json-tree-viewer', 'jwt-encoder-decoder', 'md5-encrypt-decrypt',
      'react-native-shadow-generator', 'sha1-encrypt-decrypt', 'sha224-encrypt-decrypt',
      'sha256-encrypt-decrypt', 'sha384-encrypt-decrypt', 'sha512-encrypt-decrypt',
      'url-encoder-decoder', 'url-slug-generator', 'code-to-image-converter'
    ]
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    tools: [
      'pdf-add-page-numbers', 'pdf-add-watermark', 'pdf-compress',
      'pdf-crop', 'pdf-extract-pages', 'pdf-merge', 'pdf-metadata',
      'pdf-password', 'pdf-rotate', 'pdf-split', 'pdf-to-image', 'pdf-to-word'
    ]
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Tools',
    tools: [
      'instagram-filters', 'instagram-photo-downloader', 'instagram-post-generator',
      'twitter-card-generator', 'hashtag-generator'
    ]
  },
  {
    id: 'generator-tools',
    name: 'Generator Tools',
    tools: [
      'barcode-generator', 'bulk-barcode-qr-generator', 'list-randomizer',
      'qrcode-generator', 'strong-random-password-generator'
    ]
  },
  {
    id: 'chart-tools',
    name: 'Chart Tools',
    tools: [
      'data-visualization-builder', 'chart-exporter', 'echarts-integration'
    ]
  },
  {
    id: 'google-maps-tools',
    name: 'Google Maps Tools',
    tools: [
      'maps-data-scraper', 'location-finder'
    ]
  },
  {
    id: 'business-tools',
    name: 'Business Tools',
    tools: [
      'lead-generator', 'email-validator', 'company-profiler', 'lead-generation-ai'
    ]
  }
];

// Utility functions
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS_REGISTRY[id];
};

export const getToolsByCategory = (categoryId: string): Tool[] => {
  const category = CATEGORIES_CONFIG.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return category.tools
    .map(toolId => TOOLS_REGISTRY[toolId])
    .filter((tool): tool is Tool => tool !== undefined);
};

export const getAllTools = (): Tool[] => {
  return Object.values(TOOLS_REGISTRY);
};

export const getCategoryByToolId = (toolId: string): Category | undefined => {
  return CATEGORIES_CONFIG.find(category => 
    category.tools.includes(toolId)
  );
};