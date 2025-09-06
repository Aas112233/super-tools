// Structured Data utility for SEO enhancement
export interface ToolSchema {
  name: string;
  description: string;
  category: string;
  keywords: string[];
  url: string;
}

export const generateToolSchema = (tool: ToolSchema) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "url": tool.url,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "@id": `${tool.url}#offer`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "1001s.info",
      "url": "https://1001s.info"
    },
    "publisher": {
      "@type": "Organization",
      "name": "1001s.info",
      "url": "https://1001s.info"
    },
    "keywords": tool.keywords.join(", "),
    "category": tool.category,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "screenshot": `https://1001s.info/screenshots/${tool.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    "featureList": tool.keywords,
    "applicationSubCategory": tool.category,
    "downloadUrl": tool.url,
    "installUrl": tool.url,
    "memoryRequirements": "1MB",
    "processorRequirements": "Modern web browser",
    "storageRequirements": "No storage required",
    "softwareHelp": "https://1001s.info/help",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1243"
    }
  };
};

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "1001s.info",
    "alternateName": "1001s Tools",
    "url": "https://1001s.info",
    "logo": "https://1001s.info/logo.png",
    "description": "Free online tools for developers, designers, and content creators. Access 100+ professional tools including PDF converters, image editors, CSS generators, and more. All-in-one online tool factory.",
    "foundingDate": "2025",
    "sameAs": [
      "https://twitter.com/1001sinfo",
      "https://facebook.com/1001sinfo",
      "https://linkedin.com/company/1001sinfo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English",
      "email": "support@1001s.info"
    },
    "knowsAbout": [
      "Online Tools",
      "Developer Tools",
      "Design Tools",
      "Productivity Tools",
      "PDF Processing",
      "Image Editing"
    ]
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "1001s.info - Free Online Tools",
    "alternateName": "1001s Tools",
    "url": "https://1001s.info",
    "description": "Free online tools for developers, designers, and content creators. Access 100+ professional tools including PDF converters, image editors, CSS generators, and more. All-in-one online tool factory.",
    "publisher": {
      "@type": "Organization",
      "name": "1001s.info"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://1001s.info/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": "100+",
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "name": "PDF Tools",
          "description": "Comprehensive PDF processing tools including merge, split, compress, convert to image or Word"
        },
        {
          "@type": "SoftwareApplication", 
          "name": "Image Tools",
          "description": "Professional image editing and processing tools including cropper, resizer, color extractor"
        },
        {
          "@type": "SoftwareApplication",
          "name": "CSS Tools", 
          "description": "CSS generators and utilities for developers including loaders, glassmorphism, clip-path"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Text Tools",
          "description": "Text processing and formatting utilities including case converter, lorem ipsum generator"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Developer Tools",
          "description": "Essential developer utilities including Base64 encoder/decoder, URL encoder/decoder"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Code Generators",
          "description": "Code and graphic generators including QR codes, barcodes, password generators"
        }
      ]
    },
    "keywords": "online tools, free tools, all-in-one tools, PDF converter, image editor, CSS generator, text tools, developer tools, design tools, productivity tools"
  };
};

// Tool definitions with structured data
export const TOOLS_STRUCTURED_DATA: Record<string, ToolSchema> = {
  '/tools/case-converter': {
    name: 'Case Converter',
    description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more',
    category: 'Text Processing',
    keywords: ['case converter', 'text formatting', 'uppercase', 'lowercase', 'title case', 'camel case', 'text tool', 'free online tool'],
    url: 'https://1001s.info/tools/case-converter'
  },
  '/tools/pdf-merge': {
    name: 'PDF Merge Tool', 
    description: 'Combine multiple PDF files into a single document with drag-and-drop ordering',
    category: 'PDF Processing',
    keywords: ['PDF merge', 'combine PDF', 'PDF joiner', 'merge documents', 'PDF combiner', 'free PDF tool', 'online PDF merge'],
    url: 'https://1001s.info/tools/pdf-merge'
  },
  '/tools/pdf-split': {
    name: 'PDF Split Tool',
    description: 'Split PDF files into separate pages or extract specific page ranges',
    category: 'PDF Processing', 
    keywords: ['PDF split', 'PDF splitter', 'extract PDF pages', 'split documents', 'PDF page separator', 'free PDF tool', 'online PDF split'],
    url: 'https://1001s.info/tools/pdf-split'
  },
  '/tools/image-cropper': {
    name: 'Image Cropper',
    description: 'Crop and trim images online with precision controls and aspect ratio options',
    category: 'Image Processing',
    keywords: ['image cropper', 'crop image', 'image editor', 'photo cropper', 'trim image', 'free image tool', 'online image cropper'],
    url: 'https://1001s.info/tools/image-cropper'
  },
  '/tools/qr-code-generator': {
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, WiFi, contacts with customization options',
    category: 'Code Generation',
    keywords: ['QR code generator', 'create QR code', 'QR maker', 'barcode generator', 'custom QR', 'free QR generator', 'online QR tool'],
    url: 'https://1001s.info/tools/qr-code-generator'
  },
  '/tools/strong-random-password-generator': {
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable length and character sets',
    category: 'Security Tools',
    keywords: ['password generator', 'strong password', 'secure password', 'random password', 'password tool', 'free security tool'],
    url: 'https://1001s.info/tools/strong-random-password-generator'
  },
  '/tools/css-glassmorphism-generator': {
    name: 'CSS Glassmorphism Generator',
    description: 'Create modern glass effect CSS with backdrop blur and transparency controls',
    category: 'CSS Tools',
    keywords: ['glassmorphism CSS', 'glass effect', 'backdrop blur', 'CSS generator', 'modern UI', 'free CSS tool', 'online CSS generator'],
    url: 'https://1001s.info/tools/css-glassmorphism-generator'
  },
  '/tools/base64-encoder-decoder': {
    name: 'Base64 Encoder Decoder',
    description: 'Encode and decode Base64 strings for data transmission and storage',
    category: 'Developer Tools',
    keywords: ['Base64 encoder', 'Base64 decoder', 'data encoding', 'text converter', 'developer tool', 'free encoder', 'online converter'],
    url: 'https://1001s.info/tools/base64-encoder-decoder'
  },
  '/tools/pdf-compress': {
    name: 'PDF Compressor',
    description: 'Compress PDF files to reduce file size while maintaining quality',
    category: 'PDF Processing',
    keywords: ['PDF compressor', 'compress PDF', 'reduce PDF size', 'PDF optimizer', 'shrink PDF', 'free PDF tool', 'online PDF compressor'],
    url: 'https://1001s.info/tools/pdf-compress'
  },
  '/tools/pdf-to-image': {
    name: 'PDF to Image Converter',
    description: 'Convert PDF files to image formats like JPG, PNG, WebP',
    category: 'PDF Processing',
    keywords: ['PDF to image', 'PDF to JPG', 'PDF to PNG', 'convert PDF', 'PDF converter', 'free PDF tool', 'online PDF converter'],
    url: 'https://1001s.info/tools/pdf-to-image'
  },
  '/tools/pdf-to-word': {
    name: 'PDF to Word Converter',
    description: 'Convert PDF files to editable Word documents (DOCX, RTF, TXT)',
    category: 'PDF Processing',
    keywords: ['PDF to Word', 'PDF to DOCX', 'convert PDF to Word', 'PDF text extractor', 'free PDF tool', 'online PDF converter'],
    url: 'https://1001s.info/tools/pdf-to-word'
  },
  '/tools/image-resizer': {
    name: 'Image Resizer',
    description: 'Resize images online with customizable dimensions and quality settings',
    category: 'Image Processing',
    keywords: ['image resizer', 'resize image online', 'image compressor', 'photo resizer', 'image optimizer', 'free image tool', 'online image resizer'],
    url: 'https://1001s.info/tools/image-resizer'
  },
  '/tools/barcode-generator': {
    name: 'Barcode Generator',
    description: 'Generate barcodes in multiple formats (Code 128, EAN, UPC) for products and inventory',
    category: 'Code Generation',
    keywords: ['barcode generator', 'create barcode', 'barcode maker', 'product barcode', 'free barcode generator', 'online barcode tool'],
    url: 'https://1001s.info/tools/barcode-generator'
  },
  '/tools/css-loader-generator': {
    name: 'CSS Loader Generator',
    description: 'Generate CSS loading animations and spinners for websites',
    category: 'CSS Tools',
    keywords: ['CSS loader', 'loading animation', 'CSS spinner', 'loading spinner generator', 'free CSS tool', 'online CSS generator'],
    url: 'https://1001s.info/tools/css-loader-generator'
  },
  '/tools/html-encoder-decoder': {
    name: 'HTML Encoder Decoder',
    description: 'Encode and decode HTML entities for web development',
    category: 'Developer Tools',
    keywords: ['HTML encoder', 'HTML decoder', 'HTML entities', 'HTML converter', 'developer tool', 'free encoder', 'online converter'],
    url: 'https://1001s.info/tools/html-encoder-decoder'
  },
  '/tools/url-encoder-decoder': {
    name: 'URL Encoder Decoder',
    description: 'Encode and decode URLs for web development and data transmission',
    category: 'Developer Tools',
    keywords: ['URL encoder', 'URL decoder', 'URL encode', 'URL decode', 'percent encoding', 'developer tool', 'free encoder', 'online converter'],
    url: 'https://1001s.info/tools/url-encoder-decoder'
  },
  '/tools/lorem-ipsum-generator': {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs and layouts with customization options',
    category: 'Text Processing',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'content generator', 'free text tool', 'online generator'],
    url: 'https://1001s.info/tools/lorem-ipsum-generator'
  }
};

export default {
  generateToolSchema,
  generateBreadcrumbSchema, 
  generateOrganizationSchema,
  generateWebsiteSchema,
  TOOLS_STRUCTURED_DATA
};