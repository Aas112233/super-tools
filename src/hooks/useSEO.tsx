import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateToolSchema, generateBreadcrumbSchema, generateOrganizationSchema, generateWebsiteSchema, TOOLS_STRUCTURED_DATA } from '../utils/structuredData';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
}

// SEO data for each tool/page - Enhanced with research-based keywords
const SEO_DATA: Record<string, SEOData> = {
  '/': {
    title: '1001s.info - Free Online Tools for Developers, Designers & Content Creators | All-in-One Toolbox',
    description: 'Access 100+ free online tools including PDF converters, image editors, CSS generators, text tools, and more. No signup required. Fast, secure, and user-friendly all-in-one online tool factory.',
    keywords: 'online tools, free tools, all-in-one tools, PDF converter, image editor, CSS generator, text tools, developer tools, design tools, productivity tools, online utilities, free online tools',
  },
  '/tools/dashboard': {
    title: 'Tool Dashboard - Browse All Free Online Tools | 1001s.info',
    description: 'Browse all 100+ available tools organized by category. Access PDF tools, image editors, CSS generators, text utilities, and more in one convenient location. Free online tool factory.',
    keywords: 'tool dashboard, online tools, free tools collection, all tools, tool categories, online utilities, developer tools, design tools, productivity tools',
  },
  '/tools/case-converter': {
    title: 'Case Converter - Convert Text to Upper, Lower, Title Case Online Free | 1001s.info',
    description: 'Free online case converter tool. Convert text to uppercase, lowercase, title case, camel case, and more. Instant conversion, no signup required. Perfect for developers and content creators.',
    keywords: 'case converter, text converter, uppercase, lowercase, title case, camel case, text formatting, online case converter, free case converter, text tool',
  },
  '/tools/lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator - Generate Placeholder Text Online Free | 1001s.info',
    description: 'Generate Lorem Ipsum placeholder text for your designs and layouts. Customize paragraphs, words, and sentences. Free online tool with no registration required.',
    keywords: 'lorem ipsum generator, placeholder text, dummy text, content generator, online lorem ipsum, free lorem ipsum, design placeholder, text generator',
  },
  '/tools/image-cropper': {
    title: 'Image Cropper - Crop Images Online Free No Watermark | 1001s.info',
    description: 'Crop images online for free. Upload and crop JPG, PNG, GIF images. No watermark, instant download. Professional image cropping tool for designers and content creators.',
    keywords: 'image cropper, crop image online, image editor, photo cropper, resize image, online image cropper, free image cropper, image tool',
  },
  '/tools/image-resizer': {
    title: 'Image Resizer - Resize Images Online Free | 1001s.info',
    description: 'Resize images online for free. Change image dimensions, compress file size. Support JPG, PNG, GIF. Professional image resizing tool for web optimization.',
    keywords: 'image resizer, resize image online, image compressor, photo resizer, image optimizer, online image resizer, free image resizer, image tool',
  },
  '/tools/pdf-merge': {
    title: 'PDF Merge - Combine Multiple PDF Files Online Free | 1001s.info',
    description: 'Merge multiple PDF files into one document for free. Drag and drop to reorder pages. No file size limits. Secure online PDF merger for professionals and students.',
    keywords: 'PDF merge, combine PDF, merge PDF files, PDF joiner, PDF combiner, online PDF merge, free PDF merge, PDF tool',
  },
  '/tools/pdf-split': {
    title: 'PDF Split - Split PDF Pages Online Free | 1001s.info',
    description: 'Split PDF files into separate pages or extract specific page ranges for free. No file size limits. Professional PDF splitting tool for document management.',
    keywords: 'PDF split, split PDF pages, PDF splitter, extract PDF pages, PDF page separator, online PDF split, free PDF split, PDF tool',
  },
  '/tools/pdf-compress': {
    title: 'PDF Compressor - Reduce PDF File Size Online Free | 1001s.info',
    description: 'Compress PDF files to reduce file size while maintaining quality. Free online PDF compressor with multiple compression levels for email and web sharing.',
    keywords: 'PDF compressor, compress PDF, reduce PDF size, PDF optimizer, shrink PDF, online PDF compressor, free PDF compressor, PDF tool',
  },
  '/tools/pdf-to-image': {
    title: 'PDF to Image Converter - Convert PDF to JPG, PNG Online Free | 1001s.info',
    description: 'Convert PDF to images (JPG, PNG, WebP) for free. High-quality conversion, all pages or selected pages. No watermark. Perfect for presentations and social media.',
    keywords: 'PDF to image, PDF to JPG, PDF to PNG, convert PDF, PDF converter, online PDF to image, free PDF converter, PDF tool',
  },
  '/tools/pdf-to-word': {
    title: 'PDF to Word Converter - Convert PDF to DOCX Online Free | 1001s.info',
    description: 'Convert PDF to Word document (DOCX, RTF, TXT) for free. Extract text from PDF files. Professional PDF to Word converter for document editing.',
    keywords: 'PDF to Word, PDF to DOCX, convert PDF to Word, PDF text extractor, online PDF to Word, free PDF converter, PDF tool',
  },
  '/tools/qr-code-generator': {
    title: 'QR Code Generator - Create QR Codes Online Free | 1001s.info',
    description: 'Generate QR codes for URLs, text, WiFi, contacts, and more. Customize colors, add logos. Download high-resolution QR codes for free for marketing and business use.',
    keywords: 'QR code generator, create QR code, QR maker, custom QR codes, online QR generator, free QR code, QR tool',
  },
  '/tools/barcode-generator': {
    title: 'Barcode Generator - Create Barcodes Online Free | 1001s.info',
    description: 'Generate barcodes in multiple formats (Code 128, EAN, UPC). Professional barcode generator for products and inventory management. Download high-quality barcodes.',
    keywords: 'barcode generator, create barcode, barcode maker, product barcode, online barcode generator, free barcode generator, barcode tool',
  },
  '/tools/strong-random-password-generator': {
    title: 'Password Generator - Create Strong Secure Passwords | 1001s.info',
    description: 'Generate strong, secure passwords with customizable length and character sets. Include uppercase, lowercase, numbers, and symbols. Free online password generator for security.',
    keywords: 'password generator, strong password, secure password, random password generator, online password generator, free password tool, security tool',
  },
  '/tools/css-loader-generator': {
    title: 'CSS Loader Generator - Create Loading Animations | 1001s.info',
    description: 'Generate CSS loading animations and spinners. Copy ready-to-use CSS code for your website. Multiple loader styles available for developers and designers.',
    keywords: 'CSS loader, loading animation, CSS spinner, loading spinner generator, online CSS generator, free CSS tool, developer tool',
  },
  '/tools/css-glassmorphism-generator': {
    title: 'CSS Glassmorphism Generator - Create Glass Effect CSS | 1001s.info',
    description: 'Generate glassmorphism CSS effects with backdrop blur and transparency. Modern glass UI design generator with live preview for web developers and designers.',
    keywords: 'glassmorphism CSS, glass effect, backdrop blur, CSS glass design, online CSS generator, free CSS tool, modern UI design, developer tool',
  },
  '/tools/base64-encoder-decoder': {
    title: 'Base64 Encoder Decoder - Encode Decode Base64 Online | 1001s.info',
    description: 'Encode and decode Base64 strings online. Convert text to Base64 and Base64 to text. Free Base64 converter tool for developers and data transmission.',
    keywords: 'Base64 encoder, Base64 decoder, Base64 converter, encode Base64, decode Base64, online Base64 tool, free developer tool, data encoding',
  },
  '/tools/html-encoder-decoder': {
    title: 'HTML Encoder Decoder - HTML Entity Converter | 1001s.info',
    description: 'Encode and decode HTML entities. Convert special characters to HTML entities and vice versa. Free HTML encoder tool for web developers and content creators.',
    keywords: 'HTML encoder, HTML decoder, HTML entities, HTML converter, online HTML tool, free developer tool, web development',
  },
  '/tools/url-encoder-decoder': {
    title: 'URL Encoder Decoder - URL Encode Decode Online | 1001s.info',
    description: 'Encode and decode URLs online. Convert special characters for URL compatibility. Free URL encoder decoder tool for web developers and digital marketers.',
    keywords: 'URL encoder, URL decoder, URL encode, URL decode, percent encoding, online URL tool, free developer tool, web development',
  },
};

export const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      const path = location.pathname;
      const seoData = SEO_DATA[path] || SEO_DATA['/tools/dashboard'];

      // Update document title
      document.title = seoData.title;

      // Update meta description
      updateMetaTag('name', 'description', seoData.description);
      
      // Update keywords if provided
      if (seoData.keywords) {
        updateMetaTag('name', 'keywords', seoData.keywords);
      }

      // Update Open Graph tags
      updateMetaTag('property', 'og:title', seoData.ogTitle || seoData.title);
      updateMetaTag('property', 'og:description', seoData.ogDescription || seoData.description);
      updateMetaTag('property', 'og:url', `https://1001s.info${path}`);
      updateMetaTag('property', 'og:site_name', '1001s.info - Free Online Tools');

      // Update Twitter Card tags
      updateMetaTag('name', 'twitter:title', seoData.ogTitle || seoData.title);
      updateMetaTag('name', 'twitter:description', seoData.ogDescription || seoData.description);
      updateMetaTag('name', 'twitter:url', `https://1001s.info${path}`);
      updateMetaTag('name', 'twitter:card', 'summary');

      // Update canonical URL
      updateCanonicalLink(`https://1001s.info${path}`);

      // Add structured data for all pages
      try {
        // Add tool-specific structured data
        if (TOOLS_STRUCTURED_DATA[path]) {
          const toolData = TOOLS_STRUCTURED_DATA[path];
          const toolSchema = generateToolSchema(toolData);
          injectStructuredData('tool-schema', toolSchema);
        }

        // Add breadcrumb structured data for tool pages
        if (path.startsWith('/tools/') && path !== '/tools/dashboard') {
          const breadcrumbs = [
            { name: 'Home', url: 'https://1001s.info' },
            { name: 'Tools', url: 'https://1001s.info/tools/dashboard' },
            { name: seoData.title.split(' - ')[0], url: `https://1001s.info${path}` }
          ];
          const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
          injectStructuredData('breadcrumb-schema', breadcrumbSchema);
        }
        
        // Add organization schema to homepage
        const orgSchema = generateOrganizationSchema();
        injectStructuredData('organization-schema', orgSchema);
        
        // Add website schema to all pages
        const websiteSchema = generateWebsiteSchema();
        injectStructuredData('website-schema', websiteSchema);
      } catch (error) {
        console.error('Error adding structured data:', error);
      }
    } catch (error) {
      console.error('Error in useSEO hook:', error);
      // Silently fail - don't break the app if SEO fails
    }
  }, [location.pathname]);
};

// Helper function to update meta tags
const updateMetaTag = (attribute: string, value: string, content: string) => {
  try {
    let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    
    if (element) {
      element.content = content;
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, value);
      element.content = content;
      document.head.appendChild(element);
    }
  } catch (error) {
    console.error(`Error updating meta tag ${attribute}="${value}":`, error);
  }
};

// Helper function to update canonical link
const updateCanonicalLink = (href: string) => {
  try {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (canonical) {
      canonical.href = href;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = href;
      document.head.appendChild(canonical);
    }
  } catch (error) {
    console.error('Error updating canonical link:', error);
  }
};

// Helper function to inject structured data
const injectStructuredData = (id: string, schema: any) => {
  try {
    // Remove existing schema with same id
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Create new script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema, null, 2); // Pretty print for better readability
    document.head.appendChild(script);
  } catch (error) {
    console.error(`Error injecting structured data with id ${id}:`, error);
  }
};

export default useSEO;