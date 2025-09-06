import React from 'react';
import { useLocation } from 'react-router-dom';

interface SEOContentData {
  title: string;
  description: string;
  features: string[];
  useCases: string[];
  benefits: string[];
  keywords: string[];
}

const SEO_CONTENT_DATA: Record<string, SEOContentData> = {
  '/tools/case-converter': {
    title: 'Free Online Case Converter Tool',
    description: 'Transform text between different cases instantly with our free online case converter. Convert to uppercase, lowercase, title case, camel case, pascal case, and more. Perfect for developers, writers, and content creators who need quick text formatting.',
    features: [
      'Convert to UPPERCASE text',
      'Transform to lowercase letters', 
      'Generate Title Case formatting',
      'Create camelCase for programming',
      'Generate PascalCase for classes',
      'Create snake_case for variables',
      'Real-time conversion preview'
    ],
    useCases: [
      'Programming variable naming conventions',
      'Content formatting for blogs and articles',
      'Social media post optimization',
      'Database field standardization',
      'API endpoint naming'
    ],
    benefits: [
      'No software installation required',
      'Works on all devices and browsers',
      'Instant results with live preview',
      'Completely free to use',
      'No character limits'
    ],
    keywords: ['case converter', 'text formatting', 'uppercase', 'lowercase', 'title case', 'camel case']
  },
  '/tools/pdf-merge': {
    title: 'Free PDF Merge Tool - Combine PDF Files Online',
    description: 'Merge multiple PDF files into one document for free. Our online PDF merger allows you to combine, reorder, and organize PDF pages with drag-and-drop simplicity. No file size limits, completely secure processing.',
    features: [
      'Combine unlimited PDF files',
      'Drag-and-drop file reordering',
      'Preview pages before merging',
      'Maintain original quality',
      'Batch processing support',
      'No watermarks added',
      'Secure file processing'
    ],
    useCases: [
      'Combining report chapters into one document',
      'Merging scanned document pages',
      'Consolidating invoices and receipts',
      'Creating comprehensive presentations',
      'Combining legal documents'
    ],
    benefits: [
      'No file size restrictions',
      'Files processed securely',
      'No registration required',
      'Works on any device',
      'Professional quality output'
    ],
    keywords: ['PDF merge', 'combine PDF', 'PDF joiner', 'merge documents', 'PDF combiner']
  },
  '/tools/image-cropper': {
    title: 'Free Online Image Cropper - Crop Photos Instantly',
    description: 'Crop images online for free with our professional image cropper. Resize, trim, and adjust photos with precision. Support for JPG, PNG, GIF formats. Perfect for social media, websites, and print materials.',
    features: [
      'Precision cropping controls',
      'Custom aspect ratio selection',
      'Preset dimensions for social media',
      'Real-time crop preview',
      'Maintains image quality',
      'Supports all image formats',
      'Mobile-friendly interface'
    ],
    useCases: [
      'Social media profile pictures',
      'Website header images',
      'Product photography',
      'Thumbnail creation',
      'Print material preparation'
    ],
    benefits: [
      'No watermarks on output',
      'High-quality results',
      'Fast processing',
      'User-friendly interface',
      'Works offline after loading'
    ],
    keywords: ['image cropper', 'crop image', 'photo editor', 'resize image', 'image trimmer']
  },
  '/tools/qr-code-generator': {
    title: 'QR Code Generator - Create Custom QR Codes Free',
    description: 'Generate QR codes for URLs, text, WiFi passwords, contact information, and more. Customize colors, add logos, and download high-resolution QR codes. Perfect for business cards, marketing materials, and digital sharing.',
    features: [
      'Multiple QR code types supported',
      'Custom color schemes',
      'Logo embedding capability',
      'High-resolution output',
      'Bulk QR code generation',
      'Error correction levels',
      'Vector format downloads'
    ],
    useCases: [
      'Website URL sharing',
      'WiFi password distribution',
      'Contact information cards',
      'Event ticket generation',
      'Product information linking'
    ],
    benefits: [
      'Unlimited QR code generation',
      'Commercial use allowed',
      'No expiration dates',
      'Multiple download formats',
      'Mobile-optimized scanner friendly'
    ],
    keywords: ['QR code generator', 'create QR code', 'custom QR codes', 'QR maker', 'barcode generator']
  }
};

const SEOContent: React.FC = () => {
  const location = useLocation();
  const contentData = SEO_CONTENT_DATA[location.pathname];

  if (!contentData) {
    return null;
  }

  return (
    <div className="seo-content bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-8">
      {/* Main Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {contentData.description}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Features */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Key Features
          </h3>
          <ul className="space-y-2">
            {contentData.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Use Cases */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Use Cases
          </h3>
          <ul className="space-y-2">
            {contentData.useCases.map((useCase, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Benefits
          </h3>
          <ul className="space-y-2">
            {contentData.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keywords Section (Hidden but SEO valuable) */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Related:</strong> {contentData.keywords.join(' • ')}
        </div>
      </div>
    </div>
  );
};

export default SEOContent;