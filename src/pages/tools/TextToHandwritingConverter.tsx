import React, { useState, useRef, useEffect } from 'react';

// Font loading utility with enhanced error handling for complex scripts
class FontLoader {
  private static loadedFonts = new Set<string>();
  private static loadingFonts = new Map<string, Promise<void>>();
  private static fontTestStrings = new Map<string, string>([
    ['bengali', 'আমি একটি বাক্য'],
    ['hindi', 'मैं एक वाक्य'],
    ['tamil', 'நான் ஒரு வாக்கியம்'],
    ['arabic', 'أنا جملة'],
    ['chinese', '我是一个句子'],
    ['japanese', '私は文です'],
    ['korean', '나는 문장이다']
  ]);

  static async loadFont(fontFamily: string, fontUrl: string): Promise<void> {
    if (this.loadedFonts.has(fontFamily)) {
      return Promise.resolve();
    }

    if (this.loadingFonts.has(fontFamily)) {
      return this.loadingFonts.get(fontFamily)!;
    }

    const loadPromise = this.loadFontInternal(fontFamily, fontUrl);
    this.loadingFonts.set(fontFamily, loadPromise);
    
    try {
      await loadPromise;
      this.loadedFonts.add(fontFamily);
    } catch (error) {
      console.warn(`Failed to load font ${fontFamily}:`, error);
      throw error;
    } finally {
      this.loadingFonts.delete(fontFamily);
    }
  }

  private static async loadFontInternal(fontFamily: string, fontUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Try CSS loading first for better compatibility
      this.loadFontViaCSS(fontFamily, fontUrl)
        .then(() => {
          // Verify font loaded with complex script test
          setTimeout(() => {
            if (this.verifyFontLoaded(fontFamily)) {
              resolve();
            } else {
              // Fallback to FontFace API
              this.loadFontViaFontFace(fontFamily, fontUrl)
                .then(resolve)
                .catch(reject);
            }
          }, 200);
        })
        .catch(() => {
          // Fallback to FontFace API
          this.loadFontViaFontFace(fontFamily, fontUrl)
            .then(resolve)
            .catch(reject);
        });
    });
  }

  private static loadFontViaCSS(fontFamily: string, fontUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded via CSS
      const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        reject(new Error(`Font loading timeout: ${fontFamily}`));
      }, 10000);
      
      link.onload = () => {
        clearTimeout(timeout);
        setTimeout(() => resolve(), 100); // Give time for font to be available
      };
      
      link.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load font CSS from ${fontUrl}`));
      };
      
      document.head.appendChild(link);
    });
  }

  private static async loadFontViaFontFace(fontFamily: string, fontUrl: string): Promise<void> {
    if (!window.FontFace) {
      throw new Error('FontFace API not supported');
    }

    try {
      // Extract font file URL from CSS URL
      const fontFileUrl = await this.extractFontFileUrl(fontUrl);
      const fontFace = new FontFace(fontFamily, `url(${fontFileUrl})`);
      
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (error) {
      throw new Error(`FontFace loading failed: ${error}`);
    }
  }

  private static async extractFontFileUrl(cssUrl: string): Promise<string> {
    // For Google Fonts, we can construct the font file URL
    if (cssUrl.includes('fonts.googleapis.com')) {
      const response = await fetch(cssUrl);
      const css = await response.text();
      const match = css.match(/url\(([^)]+)\)/);
      if (match) {
        return match[1].replace(/["']/g, '');
      }
    }
    throw new Error('Could not extract font file URL');
  }

  private static verifyFontLoaded(fontFamily: string): boolean {
    if (!document.fonts || !document.fonts.check) {
      return true; // Assume loaded if can't check
    }

    try {
      return document.fonts.check(`16px "${fontFamily}"`);
    } catch {
      return true; // Assume loaded if check fails
    }
  }
}

// Paper texture loader with error handling
class PaperLoader {
  private static loadedTextures = new Set<string>();
  private static loadingTextures = new Map<string, Promise<string>>();

  static async loadPaperTexture(textureUrl: string): Promise<string> {
    if (!textureUrl) {
      return Promise.resolve('');
    }

    if (this.loadedTextures.has(textureUrl)) {
      return Promise.resolve(textureUrl);
    }

    if (this.loadingTextures.has(textureUrl)) {
      return this.loadingTextures.get(textureUrl)!;
    }

    const loadPromise = this.loadTextureInternal(textureUrl);
    this.loadingTextures.set(textureUrl, loadPromise);
    
    try {
      const result = await loadPromise;
      this.loadedTextures.add(textureUrl);
      return result;
    } catch (error) {
      console.warn(`Failed to load paper texture:`, error);
      throw error;
    } finally {
      this.loadingTextures.delete(textureUrl);
    }
  }

  private static async loadTextureInternal(textureUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        reject(new Error(`Paper texture loading timeout`));
      }, 8000);
      
      img.onload = () => {
        clearTimeout(timeout);
        // Convert to base64 for reliable usage
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64);
        } catch {
          // Fallback to original URL if canvas conversion fails
          resolve(textureUrl);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load paper texture from ${textureUrl}`));
      };
      
      // Add cache busting and error handling
      img.src = textureUrl + (textureUrl.includes('?') ? '&' : '?') + 'cache=' + Date.now();
    });
  }

  static preloadTextures(urls: string[]): Promise<void> {
    const promises = urls.filter(url => url).map(url => 
      this.loadPaperTexture(url).catch(() => console.warn(`Preload failed for: ${url}`))
    );
    return Promise.all(promises).then(() => {});
  }

  static isTextureLoaded(textureUrl: string): boolean {
    return this.loadedTextures.has(textureUrl);
  }
}

const TextToHandwritingConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [font, setFont] = useState('cursive');
  const [color, setColor] = useState('blue');
  const [size, setSize] = useState(24);
  const [language, setLanguage] = useState('english');
  const [copied, setCopied] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [fontLoading, setFontLoading] = useState(false);
  const [fontError, setFontError] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('plain');
  const [paperLoading, setPaperLoading] = useState(false);
  const [paperError, setPaperError] = useState('');
  const [showPapers, setShowPapers] = useState(false);
  const [outputFormat, setOutputFormat] = useState('text-area');
  const [showFormats, setShowFormats] = useState(false);
  const [textPosition, setTextPosition] = useState('center');
  const [showPositions, setShowPositions] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Expanded language options with more countries and better font sources
  const languageOptions = [
    // European Languages
    { value: 'english', label: 'English', flag: '🇺🇸', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'spanish', label: 'Español', flag: '🇪🇸', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'french', label: 'Français', flag: '🇫🇷', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    { value: 'german', label: 'Deutsch', flag: '🇩🇪', font: 'Shadows Into Light', fontUrl: 'https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap' },
    { value: 'italian', label: 'Italiano', flag: '🇮🇹', font: 'Amatic SC', fontUrl: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap' },
    { value: 'portuguese', label: 'Português', flag: '🇵🇹', font: 'Patrick Hand', fontUrl: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap' },
    { value: 'dutch', label: 'Nederlands', flag: '🇳🇱', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'swedish', label: 'Svenska', flag: '🇸🇪', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'norwegian', label: 'Norsk', flag: '🇳🇴', font: 'Patrick Hand', fontUrl: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap' },
    { value: 'danish', label: 'Dansk', flag: '🇩🇰', font: 'Amatic SC', fontUrl: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap' },
    { value: 'finnish', label: 'Suomi', flag: '🇫🇮', font: 'Shadows Into Light', fontUrl: 'https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap' },
    { value: 'polish', label: 'Polski', flag: '🇵🇱', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    { value: 'czech', label: 'Čeština', flag: '🇨🇿', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'hungarian', label: 'Magyar', flag: '🇭🇺', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'romanian', label: 'Română', flag: '🇷🇴', font: 'Patrick Hand', fontUrl: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap' },
    { value: 'greek', label: 'Ελληνικά', flag: '🇬🇷', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    
    // Slavic Languages
    { value: 'russian', label: 'Русский', flag: '🇷🇺', font: 'Marck Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Marck+Script&display=swap' },
    { value: 'ukrainian', label: 'Українська', flag: '🇺🇦', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    { value: 'bulgarian', label: 'Български', flag: '🇧🇬', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    { value: 'serbian', label: 'Српски', flag: '🇷🇸', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'croatian', label: 'Hrvatski', flag: '🇭🇷', font: 'Patrick Hand', fontUrl: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap' },
    
    // Asian Languages  
    { value: 'chinese', label: '中文', flag: '🇨🇳', font: 'Ma Shan Zheng', fontUrl: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap' },
    { value: 'japanese', label: '日本語', flag: '🇯🇵', font: 'Klee One', fontUrl: 'https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap' },
    { value: 'korean', label: '한국어', flag: '🇰🇷', font: 'Gaegu', fontUrl: 'https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap' },
    { value: 'thai', label: 'ไทย', flag: '🇹🇭', font: 'Sarabun', fontUrl: 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap' },
    { value: 'vietnamese', label: 'Tiếng Việt', flag: '🇻🇳', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'indonesian', label: 'Bahasa Indonesia', flag: '🇮🇩', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'malay', label: 'Bahasa Melayu', flag: '🇲🇾', font: 'Patrick Hand', fontUrl: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap' },
    { value: 'filipino', label: 'Filipino', flag: '🇵🇭', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    
    // Middle Eastern & South Asian Languages
    { value: 'arabic', label: 'العربية', flag: '🇸🇦', font: 'Amiri', fontUrl: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
    { value: 'persian', label: 'فارسی', flag: '🇮🇷', font: 'Vazirmatn', fontUrl: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    { value: 'hebrew', label: 'עברית', flag: '🇮🇱', font: 'Alef', fontUrl: 'https://fonts.googleapis.com/css2?family=Alef:wght@400;700&display=swap' },
    { value: 'urdu', label: 'اردو', flag: '🇵🇰', font: 'Noto Nastaliq Urdu', fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap' },
    { value: 'turkish', label: 'Türkçe', flag: '🇹🇷', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    { value: 'hindi', label: 'हिन्दी', flag: '🇮🇳', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'bengali', label: 'বাংলা', flag: '🇧🇩', font: 'Galada', fontUrl: 'https://fonts.googleapis.com/css2?family=Galada&display=swap' },
    { value: 'tamil', label: 'தமிழ்', flag: '🇮🇳', font: 'Yatra One', fontUrl: 'https://fonts.googleapis.com/css2?family=Yatra+One&display=swap' },
    { value: 'telugu', label: 'తెలుగు', flag: '🇮🇳', font: 'Gidugu', fontUrl: 'https://fonts.googleapis.com/css2?family=Gidugu&display=swap' },
    { value: 'gujarati', label: 'ગુજરાતી', flag: '🇮🇳', font: 'Modak', fontUrl: 'https://fonts.googleapis.com/css2?family=Modak&display=swap' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳', font: 'Baloo Bhai', fontUrl: 'https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@400;500;600;700;800&display=swap' },
    { value: 'marathi', label: 'मराठी', flag: '🇮🇳', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'kannada', label: 'ಕನ್ನಡ', flag: '🇮🇳', font: 'Gurajada', fontUrl: 'https://fonts.googleapis.com/css2?family=Gurajada&display=swap' },
    { value: 'malayalam', label: 'മലയാളം', flag: '🇮🇳', font: 'Meera Inimai', fontUrl: 'https://fonts.googleapis.com/css2?family=Meera+Inimai&display=swap' },
    { value: 'sinhala', label: 'සිංහල', flag: '🇱🇰', font: 'Yaldevi', fontUrl: 'https://fonts.googleapis.com/css2?family=Yaldevi:wght@200;300;400;500;600;700&display=swap' },
    { value: 'nepali', label: 'नेपाली', flag: '🇳🇵', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    
    // African & Other Languages
    { value: 'amharic', label: 'አማርኛ', flag: '🇪🇹', font: 'Noto Sans Ethiopic', fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    { value: 'swahili', label: 'Kiswahili', flag: '🇰🇪', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'afrikaans', label: 'Afrikaans', flag: '🇿🇦', font: 'Amatic SC', fontUrl: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap' },
    { value: 'georgian', label: 'ქართული', flag: '🇬🇪', font: 'Noto Sans Georgian', fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    { value: 'armenian', label: 'Հայերեն', flag: '🇦🇲', font: 'Noto Sans Armenian', fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    
    // Latin American variants
    { value: 'brazilian', label: 'Português (Brasil)', flag: '🇧🇷', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'mexican', label: 'Español (México)', flag: '🇲🇽', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' }
  ];

  // Paper texture options with real paper images from internet sources
  const paperOptions = [
    {
      id: 'plain',
      name: 'Plain White',
      preview: '📄',
      description: 'Clean white paper',
      textureUrl: '',
      background: '#ffffff'
    },
    {
      id: 'lined',
      name: 'Lined Paper',
      preview: '📝',
      description: 'Classic ruled paper',
      textureUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
      background: 'linear-gradient(to bottom, transparent 24px, #e5e7eb 25px, transparent 26px), #ffffff'
    },
    {
      id: 'notebook',
      name: 'Notebook Paper',
      preview: '📔',
      description: 'Three-hole punched paper',
      textureUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop&auto=format',
      background: '#fefefe'
    },
    {
      id: 'vintage',
      name: 'Vintage Parchment',
      preview: '📜',
      description: 'Aged paper texture',
      textureUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
      background: '#f5f1e8'
    },
    {
      id: 'kraft',
      name: 'Kraft Paper',
      preview: '📦',
      description: 'Brown craft paper',
      textureUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&auto=format',
      background: '#d4b896'
    },
    {
      id: 'textured',
      name: 'Textured White',
      preview: '📋',
      description: 'Subtle paper texture',
      textureUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&auto=format',
      background: '#fafafa'
    },
    {
      id: 'grid',
      name: 'Grid Paper',
      preview: '⬜',
      description: 'Graph paper pattern',
      textureUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&auto=format',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #e5e7eb 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #e5e7eb 20px), #ffffff'
    },
    {
      id: 'watercolor',
      name: 'Watercolor Paper',
      preview: '🎨',
      description: 'Artistic paper texture',
      textureUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format',
      background: '#fcfcfc'
    },
    {
      id: 'recycled',
      name: 'Recycled Paper',
      preview: '♻️',
      description: 'Eco-friendly paper',
      textureUrl: 'https://images.unsplash.com/photo-1594736797933-d0f9dcaac9c4?w=800&h=600&fit=crop&auto=format',
      background: '#f8f6f0'
    },
    {
      id: 'legal',
      name: 'Legal Pad',
      preview: '📑',
      description: 'Yellow legal paper',
      textureUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&auto=format',
      background: '#fff8dc'
    }
  ];

  // Output format options for different display modes
  const outputFormatOptions = [
    {
      id: 'text-area',
      name: 'Text Area Only',
      icon: '📝',
      description: 'Just the handwritten text',
      aspectRatio: '16:9',
      padding: 24,
      showMargins: false,
      showHoles: false,
      showHeader: false
    },
    {
      id: 'full-page',
      name: 'Full Page',
      icon: '📄',
      description: 'Complete A4 page layout',
      aspectRatio: '210:297', // A4 ratio
      padding: 80,
      showMargins: true,
      showHoles: false,
      showHeader: false
    },
    {
      id: 'notebook-page',
      name: 'Notebook Page',
      icon: '📔',
      description: 'Spiral notebook with holes',
      aspectRatio: '8.5:11', // Letter size
      padding: 60,
      showMargins: true,
      showHoles: true,
      showHeader: false
    },
    {
      id: 'letter-paper',
      name: 'Letter Paper',
      icon: '📑',
      description: 'US Letter size format',
      aspectRatio: '8.5:11',
      padding: 70,
      showMargins: true,
      showHoles: false,
      showHeader: true
    },
    {
      id: 'sticky-note',
      name: 'Sticky Note',
      icon: '🟨',
      description: 'Small square note format',
      aspectRatio: '1:1',
      padding: 16,
      showMargins: false,
      showHoles: false,
      showHeader: false
    },
    {
      id: 'index-card',
      name: 'Index Card',
      icon: '🗃️',
      description: '3x5 index card format',
      aspectRatio: '3:5',
      padding: 20,
      showMargins: false,
      showHoles: false,
      showHeader: false
    },
    {
      id: 'wide-screen',
      name: 'Wide Screen',
      icon: '🖥️',
      description: 'Panoramic text display',
      aspectRatio: '21:9',
      padding: 32,
      showMargins: false,
      showHoles: false,
      showHeader: false
    },
    {
      id: 'social-post',
      name: 'Social Media',
      icon: '📱',
      description: 'Square format for social',
      aspectRatio: '1:1',
      padding: 40,
      showMargins: false,
      showHoles: false,
      showHeader: false
    }
  ];

  // Text position options for controlling text placement
  const textPositionOptions = [
    {
      id: 'center',
      name: 'Center',
      icon: '⬛',
      description: 'Text in the center',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    {
      id: 'top-left',
      name: 'Top Left',
      icon: '◤',
      description: 'Text at top-left corner',
      textAlign: 'left',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },
    {
      id: 'top-center',
      name: 'Top Center',
      icon: '⬆️',
      description: 'Text at top center',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    {
      id: 'top-right',
      name: 'Top Right',
      icon: '◥',
      description: 'Text at top-right corner',
      textAlign: 'right',
      justifyContent: 'flex-end',
      alignItems: 'flex-start'
    },
    {
      id: 'middle-left',
      name: 'Middle Left',
      icon: '⬅️',
      description: 'Text at middle-left',
      textAlign: 'left',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    {
      id: 'middle-right',
      name: 'Middle Right',
      icon: '➡️',
      description: 'Text at middle-right',
      textAlign: 'right',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    {
      id: 'bottom-left',
      name: 'Bottom Left',
      icon: '◣',
      description: 'Text at bottom-left corner',
      textAlign: 'left',
      justifyContent: 'flex-start',
      alignItems: 'flex-end'
    },
    {
      id: 'bottom-center',
      name: 'Bottom Center',
      icon: '⬇️',
      description: 'Text at bottom center',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    {
      id: 'bottom-right',
      name: 'Bottom Right',
      icon: '◢',
      description: 'Text at bottom-right corner',
      textAlign: 'right',
      justifyContent: 'flex-end',
      alignItems: 'flex-end'
    },
    {
      id: 'scattered',
      name: 'Scattered',
      icon: '✨',
      description: 'Text randomly scattered',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    }
  ];

  const fontOptions = [
    { value: 'cursive', label: '✍️ Cursive', style: 'cursive' },
    { value: 'script', label: '📝 Script', style: '"Brush Script MT", cursive' },
    { value: 'handwritten', label: '🖋️ Handwritten', style: '"Comic Sans MS", cursive' },
    { value: 'elegant', label: '✨ Elegant', style: '"Dancing Script", cursive' }
  ];

  const colorOptions = [
    { value: 'blue', label: '🔵 Blue', hex: '#1e40af' },
    { value: 'black', label: '⚫ Black', hex: '#1f2937' },
    { value: 'red', label: '🔴 Red', hex: '#dc2626' },
    { value: 'green', label: '🟢 Green', hex: '#16a34a' },
    { value: 'purple', label: '🟣 Purple', hex: '#9333ea' }
  ];

  // Load font when language changes
  useEffect(() => {
    const loadSelectedFont = async () => {
      const selectedLanguage = languageOptions.find(l => l.value === language);
      if (selectedLanguage && selectedLanguage.fontUrl) {
        setFontLoading(true);
        setFontError('');
        
        try {
          await FontLoader.loadFont(selectedLanguage.font, selectedLanguage.fontUrl);
          
          // Additional verification for complex scripts
          setTimeout(() => {
            const testStrings = new Map([
              ['bengali', 'আমি একটি বাক্য'],
              ['hindi', 'मैं एक वाक्य'],
              ['tamil', 'நான் ஒரு வாக்கியம்'],
              ['arabic', 'أنا جملة'],
              ['chinese', '我是一个句子'],
              ['japanese', '私は文です'],
              ['korean', '나는 문장이다']
            ]);
            const testText = testStrings.get(language) || 'Test';
            console.log(`Font ${selectedLanguage.font} loaded for ${language}. Test with: "${testText}"`);
          }, 300);
          
        } catch (error) {
          const errorMessage = `Font "${selectedLanguage.font}" may not display correctly. Using system fallback.`;
          setFontError(errorMessage);
          console.warn('Font loading error:', error);
        } finally {
          setFontLoading(false);
        }
      }
    };

    loadSelectedFont();
  }, [language]);

  // Load paper texture when selection changes
  useEffect(() => {
    const loadSelectedPaper = async () => {
      const selectedPaperOption = paperOptions.find(p => p.id === selectedPaper);
      if (selectedPaperOption && selectedPaperOption.textureUrl) {
        setPaperLoading(true);
        setPaperError('');
        
        try {
          await PaperLoader.loadPaperTexture(selectedPaperOption.textureUrl);
          console.log(`Paper texture loaded: ${selectedPaperOption.name}`);
        } catch (error) {
          const errorMessage = `Failed to load "${selectedPaperOption.name}" texture. Using fallback.`;
          setPaperError(errorMessage);
          console.warn('Paper loading error:', error);
        } finally {
          setPaperLoading(false);
        }
      }
    };

    loadSelectedPaper();
  }, [selectedPaper]);

  // Preload popular paper textures
  useEffect(() => {
    const popularTextures = paperOptions
      .filter(p => ['lined', 'notebook', 'vintage'].includes(p.id))
      .map(p => p.textureUrl)
      .filter(url => url);
    
    PaperLoader.preloadTextures(popularTextures);
  }, []);

  const getSelectedPaper = () => {
    const selectedPaperOption = paperOptions.find(p => p.id === selectedPaper);
    if (selectedPaperOption) {
      if (selectedPaperOption.textureUrl && PaperLoader.isTextureLoaded(selectedPaperOption.textureUrl)) {
        return {
          background: selectedPaperOption.background,
          backgroundImage: `url(${selectedPaperOption.textureUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'multiply'
        };
      }
      return {
        background: selectedPaperOption.background
      };
    }
    return {
      background: '#ffffff'
    };
  };

  const getOutputFormatStyles = () => {
    const format = outputFormatOptions.find(f => f.id === outputFormat);
    if (!format) return {};

    const [widthRatio, heightRatio] = format.aspectRatio.split(':').map(Number);
    const baseWidth = 400; // Base width for preview
    const calculatedHeight = (baseWidth * heightRatio) / widthRatio;
    
    let additionalStyles = {};
    
    // Add format-specific visual elements
    if (format.showMargins) {
      additionalStyles = {
        ...additionalStyles,
        borderLeft: '2px solid #e5e7eb',
        marginLeft: '40px',
        position: 'relative'
      };
    }
    
    if (format.showHoles) {
      additionalStyles = {
        ...additionalStyles,
        position: 'relative'
      };
    }
    
    return {
      width: `${baseWidth}px`,
      height: `${Math.min(calculatedHeight, 500)}px`, // Cap height for preview
      padding: `${format.padding}px`,
      aspectRatio: format.aspectRatio.replace(':', '/'),
      ...additionalStyles
    };
  };

  const getTextPositionStyles = (): React.CSSProperties => {
    const position = textPositionOptions.find(p => p.id === textPosition);
    if (!position) return {};

    // Special handling for scattered text
    if (textPosition === 'scattered') {
      return {
        position: 'relative' as const,
        overflow: 'hidden' as const,
        display: 'block' as const
      };
    }

    return {
      textAlign: position.textAlign as 'left' | 'center' | 'right',
      justifyContent: position.justifyContent as any,
      alignItems: position.alignItems as any,
      display: 'flex' as const,
      flexDirection: 'column' as const,
      height: '100%',
      width: '100%'
    };
  };

  const renderScatteredText = () => {
    if (textPosition !== 'scattered' || !text) return null;
    
    const lines = text.split('\n');
    return (
      <>
        {lines.map((line, index) => (
          <span
            key={index}
            style={{
              position: 'absolute',
              left: `${10 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 70}%`,
              transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
              whiteSpace: 'nowrap',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              color: 'inherit'
            }}
          >
            {line}
          </span>
        ))}
      </>
    );
  };

  const renderFormatDecorations = () => {
    const format = outputFormatOptions.find(f => f.id === outputFormat);
    if (!format) return null;

    return (
      <>
        {/* Notebook holes */}
        {format.showHoles && (
          <div className="notebook-holes">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="hole"
                style={{
                  position: 'absolute',
                  left: '-15px',
                  top: `${40 + i * 40}px`,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Page header for letter format */}
        {format.showHeader && format.id === 'letter-paper' && (
          <div 
            className="page-header"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '12px',
              color: '#6b7280',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {new Date().toLocaleDateString()}
          </div>
        )}
        
        {/* Red margin line for notebook/letter */}
        {format.showMargins && (
          <div 
            className="margin-line"
            style={{
              position: 'absolute',
              left: '40px',
              top: '0',
              bottom: '0',
              width: '1px',
              backgroundColor: '#ef4444',
              opacity: 0.6
            }}
          />
        )}
      </>
    );
  };

  const getSelectedFont = () => {
    const selectedLanguage = languageOptions.find(l => l.value === language);
    if (selectedLanguage) {
      const fontName = selectedLanguage.font;
      
      // Create fallback fonts based on script type
      let fallbacks = 'cursive';
      
      // Script-specific fallbacks
      if (['bengali', 'hindi', 'marathi', 'nepali'].includes(language)) {
        fallbacks = 'Kalam, "Noto Sans Devanagari", "Noto Sans Bengali", sans-serif';
      } else if (['tamil', 'telugu', 'kannada', 'malayalam'].includes(language)) {
        fallbacks = '"Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Kannada", "Noto Sans Malayalam", sans-serif';
      } else if (['arabic', 'persian', 'urdu'].includes(language)) {
        fallbacks = 'Amiri, "Noto Sans Arabic", "Times New Roman", serif';
      } else if (['chinese', 'japanese', 'korean'].includes(language)) {
        fallbacks = '"Noto Sans CJK", "PingFang SC", "Hiragino Sans", sans-serif';
      } else if (['thai', 'vietnamese'].includes(language)) {
        fallbacks = '"Noto Sans Thai", "Noto Sans", sans-serif';
      } else {
        fallbacks = 'cursive, "Comic Sans MS", fantasy';
      }
      
      return `"${fontName}", ${fallbacks}`;
    }
    return fontOptions.find(f => f.value === font)?.style || 'cursive';
  };

  const getSelectedColor = () => {
    return colorOptions.find(c => c.value === color)?.hex || '#1e40af';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsImage = async () => {
    if (!text.trim()) return;
    
    const format = outputFormatOptions.find(f => f.id === outputFormat);
    if (!format) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 3;
    
    // Calculate dimensions based on format
    const [widthRatio, heightRatio] = format.aspectRatio.split(':').map(Number);
    let baseWidth = 1200;
    let baseHeight = (baseWidth * heightRatio) / widthRatio;
    
    // Adjust for specific formats
    if (format.id === 'sticky-note' || format.id === 'social-post') {
      baseWidth = 800;
      baseHeight = 800;
    } else if (format.id === 'index-card') {
      baseWidth = 600;
      baseHeight = 1000;
    } else if (format.id === 'wide-screen') {
      baseWidth = 1600;
      baseHeight = 686;
    }
    
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    
    ctx!.scale(scale, scale);
    
    // Get selected paper background
    const paperStyle = getSelectedPaper();
    const selectedPaperOption = paperOptions.find(p => p.id === selectedPaper);
    
    // Draw paper background
    if (selectedPaperOption?.textureUrl && PaperLoader.isTextureLoaded(selectedPaperOption.textureUrl)) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = selectedPaperOption.textureUrl;
        });
        
        // Draw paper texture
        ctx!.drawImage(img, 0, 0, baseWidth, baseHeight);
        
        // Apply background color overlay if needed
        if (selectedPaperOption.background !== '#ffffff') {
          ctx!.globalCompositeOperation = 'multiply';
          ctx!.fillStyle = selectedPaperOption.background;
          ctx!.fillRect(0, 0, baseWidth, baseHeight);
          ctx!.globalCompositeOperation = 'source-over';
        }
      } catch (error) {
        console.warn('Failed to load paper texture for download, using solid color');
        ctx!.fillStyle = selectedPaperOption.background || '#ffffff';
        ctx!.fillRect(0, 0, baseWidth, baseHeight);
      }
    } else {
      // Use solid background color
      ctx!.fillStyle = selectedPaperOption?.background || '#ffffff';
      ctx!.fillRect(0, 0, baseWidth, baseHeight);
    }
    
    // Draw format-specific decorations
    if (format.showMargins) {
      // Red margin line
      ctx!.strokeStyle = '#ef4444';
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(format.padding + 40, 0);
      ctx!.lineTo(format.padding + 40, baseHeight);
      ctx!.stroke();
    }
    
    if (format.showHoles) {
      // Notebook holes
      ctx!.fillStyle = '#ffffff';
      ctx!.strokeStyle = '#d1d5db';
      ctx!.lineWidth = 1;
      const holeCount = Math.floor(baseHeight / 80);
      for (let i = 0; i < holeCount; i++) {
        const y = 60 + i * 80;
        ctx!.beginPath();
        ctx!.arc(20, y, 8, 0, 2 * Math.PI);
        ctx!.fill();
        ctx!.stroke();
      }
    }
    
    if (format.showHeader && format.id === 'letter-paper') {
      // Date header
      ctx!.fillStyle = '#6b7280';
      ctx!.font = '12px Arial, sans-serif';
      ctx!.textAlign = 'right';
      ctx!.fillText(new Date().toLocaleDateString(), baseWidth - 20, 30);
    }
    
    // Draw special patterns for some paper types
    if (selectedPaper === 'lined') {
      ctx!.strokeStyle = '#e5e7eb';
      ctx!.lineWidth = 1;
      const lineSpacing = 30;
      for (let y = format.padding; y < baseHeight - format.padding; y += lineSpacing) {
        ctx!.beginPath();
        ctx!.moveTo(format.padding, y);
        ctx!.lineTo(baseWidth - format.padding, y);
        ctx!.stroke();
      }
    } else if (selectedPaper === 'grid') {
      ctx!.strokeStyle = '#e5e7eb';
      ctx!.lineWidth = 0.5;
      const gridSize = 25;
      // Vertical lines
      for (let x = format.padding; x < baseWidth - format.padding; x += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, format.padding);
        ctx!.lineTo(x, baseHeight - format.padding);
        ctx!.stroke();
      }
      // Horizontal lines
      for (let y = format.padding; y < baseHeight - format.padding; y += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(format.padding, y);
        ctx!.lineTo(baseWidth - format.padding, y);
        ctx!.stroke();
      }
    }
    
    // Draw text with positioning
    ctx!.fillStyle = getSelectedColor();
    const fontSize = Math.max(16, size * (baseWidth / 600)); // Scale font with canvas
    ctx!.font = `${fontSize}px ${getSelectedFont()}`;
    
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.6;
    const textAreaHeight = lines.length * lineHeight;
    
    // Get text position settings
    const position = textPositionOptions.find(p => p.id === textPosition);
    const textAlign = position?.textAlign || 'center';
    const justifyContent = position?.justifyContent || 'center';
    const alignItems = position?.alignItems || 'center';
    
    // Calculate text positioning
    let textStartX = format.padding;
    let textStartY = format.padding;
    
    // Horizontal positioning
    if (justifyContent === 'center') {
      textStartX = baseWidth / 2;
      ctx!.textAlign = 'center';
    } else if (justifyContent === 'flex-end') {
      textStartX = baseWidth - format.padding;
      ctx!.textAlign = 'right';
    } else {
      textStartX = format.padding;
      ctx!.textAlign = 'left';
    }
    
    // Vertical positioning
    if (alignItems === 'center') {
      textStartY = (baseHeight - textAreaHeight) / 2 + lineHeight / 2;
    } else if (alignItems === 'flex-end') {
      textStartY = baseHeight - format.padding - textAreaHeight + lineHeight / 2;
    } else {
      textStartY = format.padding + lineHeight;
    }
    
    // Adjust for margins if present
    if (format.showMargins && (justifyContent === 'flex-start' || justifyContent === 'center')) {
      textStartX += 40; // Account for margin line
    }
    
    ctx!.textBaseline = 'middle';
    
    // Special handling for scattered text
    if (textPosition === 'scattered') {
      lines.forEach((line, index) => {
        const randomX = format.padding + Math.random() * (baseWidth - 2 * format.padding);
        const randomY = format.padding + Math.random() * (baseHeight - 2 * format.padding);
        ctx!.save();
        ctx!.translate(randomX, randomY);
        ctx!.rotate((Math.random() - 0.5) * 0.3); // Slight rotation
        ctx!.textAlign = 'center';
        ctx!.fillText(line, 0, 0);
        ctx!.restore();
      });
    } else {
      // Normal text positioning
      lines.forEach((line, index) => {
        const x = textStartX;
        const y = textStartY + index * lineHeight;
        ctx!.fillText(line, x, y);
      });
    }
    
    const link = document.createElement('a');
    link.download = `handwriting-${language}-${selectedPaper}-${outputFormat}-${textPosition}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">✍️ Text to Handwriting Converter</h1>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">📝 Input & Preview</h2>
            <p className="section-subtitle">Enter your text and see the magic happen</p>
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">✏️</span>
              <span className="label-text">Your Text</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here to see it transform into beautiful handwriting...\n\nTry multiple lines!\nExperiment with different languages and styles."
              className="enhanced-textarea"
              rows={6}
            />
            <div className="text-counter">{text.length} characters</div>
          </div>

          <div className="preview-section">
            <label className="preview-label">
              <span className="label-icon">🎨</span>
              <span className="label-text">Live Preview</span>
              <div className="preview-tags">
                <span className="preview-tag">
                  {outputFormatOptions.find(f => f.id === outputFormat)?.icon}
                  {outputFormatOptions.find(f => f.id === outputFormat)?.name}
                </span>
                <span className="preview-tag">
                  {textPositionOptions.find(p => p.id === textPosition)?.icon}
                  {textPositionOptions.find(p => p.id === textPosition)?.name}
                </span>
                <span className="preview-tag">
                  {paperOptions.find(p => p.id === selectedPaper)?.preview}
                  {paperOptions.find(p => p.id === selectedPaper)?.name}
                </span>
              </div>
            </label>
            <div className="preview-container">
              <div 
                ref={previewRef}
                className="handwriting-preview-enhanced"
                style={{
                  fontFamily: getSelectedFont(),
                  color: getSelectedColor(),
                  fontSize: `${size}px`,
                  ...getSelectedPaper(),
                  ...getOutputFormatStyles()
                }}
              >
                {renderFormatDecorations()}
                <div className="handwriting-text-content" style={getTextPositionStyles()}>
                  {textPosition === 'scattered' ? (
                    renderScatteredText()
                  ) : (
                    text || (
                      <div className="placeholder-text">
                        <span className="placeholder-line">Your handwritten text will appear here...</span>
                        <span className="placeholder-hint">Try typing something beautiful! ✨</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              
              {(fontLoading || paperLoading) && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">
                    {fontLoading ? 'Loading font...' : 'Loading paper texture...'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="action-buttons">
              <button 
                className={`action-btn primary ${copied ? 'success' : ''} ${!text.trim() ? 'disabled' : ''}`}
                onClick={copyToClipboard}
                disabled={!text.trim()}
              >
                <span className="btn-icon">{copied ? '✅' : '📋'}</span>
                <span className="btn-text">{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
              
              <button 
                className={`action-btn secondary ${!text.trim() ? 'disabled' : ''}`}
                onClick={downloadAsImage}
                disabled={!text.trim()}
              >
                <span className="btn-icon">💾</span>
                <span className="btn-text">Download Image</span>
              </button>
            </div>
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2 className="section-title">⚙️ Customization</h2>
            <p className="section-subtitle">Personalize your handwriting style</p>
          </div>

          <div className="controls-wrapper">
            {/* Language Selection */}
            <div className={`control-group enhanced ${showLanguages ? 'dropdown-open' : ''}`}>
              <label className="control-label">
                <span className="control-icon">🌍</span>
                <span className="control-title">Language & Font</span>
                {fontLoading && <div className="mini-loader"></div>}
              </label>
              {fontError && <div className="error-message">⚠️ {fontError}</div>}
              <div className="language-selector">
                <div className="selected-language" onClick={() => setShowLanguages(!showLanguages)}>
                  <span className="flag">{languageOptions.find(l => l.value === language)?.flag}</span>
                  <span className="name">{languageOptions.find(l => l.value === language)?.label}</span>
                  <span className="arrow">{showLanguages ? '▲' : '▼'}</span>
                </div>
                {showLanguages && (
                  <div className="language-dropdown">
                    <div className="language-search">
                      <input 
                        type="text" 
                        placeholder="Search languages..." 
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const filteredOptions = languageOptions.filter(option => 
                            option.label.toLowerCase().includes(searchTerm) ||
                            option.value.toLowerCase().includes(searchTerm)
                          );
                          // This would need additional state management for filtered results
                        }}
                        className="language-search-input"
                      />
                    </div>
                    <div className="language-options-container">
                      {languageOptions.map(option => (
                        <div 
                          key={option.value} 
                          className={`language-option ${language === option.value ? 'active' : ''}`}
                          onClick={() => {
                            setLanguage(option.value);
                            setShowLanguages(false);
                          }}
                        >
                          <span className="flag">{option.flag}</span>
                          <span className="name">{option.label}</span>
                          <span className="font-name">{option.font}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Paper Selection */}
            <div className={`control-group enhanced ${showPapers ? 'dropdown-open' : ''}`}>
              <label className="control-label">
                <span className="control-icon">📄</span>
                <span className="control-title">Paper Type</span>
                {paperLoading && <div className="mini-loader"></div>}
              </label>
              {paperError && <div className="error-message">⚠️ {paperError}</div>}
              <div className="paper-selector">
                <div className="selected-paper" onClick={() => setShowPapers(!showPapers)}>
                  <span className="paper-preview">{paperOptions.find(p => p.id === selectedPaper)?.preview}</span>
                  <span className="paper-name">{paperOptions.find(p => p.id === selectedPaper)?.name}</span>
                  <span className="arrow">{showPapers ? '▲' : '▼'}</span>
                </div>
                {showPapers && (
                  <div className="paper-dropdown">
                    <div className="paper-options-grid">
                      {paperOptions.map(option => (
                        <div 
                          key={option.id} 
                          className={`paper-option ${selectedPaper === option.id ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedPaper(option.id);
                            setShowPapers(false);
                          }}
                        >
                          <div 
                            className="paper-sample"
                            style={{
                              background: option.background,
                              backgroundImage: option.textureUrl ? `url(${option.textureUrl})` : 'none',
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            <span className="paper-preview-large">{option.preview}</span>
                          </div>
                          <div className="paper-info">
                            <span className="paper-name">{option.name}</span>
                            <span className="paper-description">{option.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Output Format Selection */}
            <div className={`control-group enhanced ${showFormats ? 'dropdown-open' : ''}`}>
              <label className="control-label">
                <span className="control-icon">📐</span>
                <span className="control-title">Output Format</span>
              </label>
              <div className="format-selector">
                <div className="selected-format" onClick={() => setShowFormats(!showFormats)}>
                  <span className="format-icon">{outputFormatOptions.find(f => f.id === outputFormat)?.icon}</span>
                  <span className="format-name">{outputFormatOptions.find(f => f.id === outputFormat)?.name}</span>
                  <span className="arrow">{showFormats ? '▲' : '▼'}</span>
                </div>
                {showFormats && (
                  <div className="format-dropdown">
                    <div className="format-options-grid">
                      {outputFormatOptions.map(option => (
                        <div 
                          key={option.id} 
                          className={`format-option ${outputFormat === option.id ? 'active' : ''}`}
                          onClick={() => {
                            setOutputFormat(option.id);
                            setShowFormats(false);
                          }}
                        >
                          <div className="format-preview">
                            <div 
                              className="format-sample"
                              style={{
                                aspectRatio: option.aspectRatio.replace(':', '/'),
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              <span className="format-icon-large">{option.icon}</span>
                              {option.showMargins && (
                                <div style={{
                                  position: 'absolute',
                                  left: '15%',
                                  top: '0',
                                  bottom: '0',
                                  width: '1px',
                                  backgroundColor: '#ef4444',
                                  opacity: 0.5
                                }} />
                              )}
                              {option.showHoles && (
                                <div style={{
                                  position: 'absolute',
                                  left: '5%',
                                  top: '20%',
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: 'white',
                                  border: '0.5px solid #d1d5db'
                                }} />
                              )}
                            </div>
                          </div>
                          <div className="format-info">
                            <span className="format-name">{option.name}</span>
                            <span className="format-description">{option.description}</span>
                            <span className="format-ratio">{option.aspectRatio}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Position Selection */}
            <div className={`control-group enhanced ${showPositions ? 'dropdown-open' : ''}`}>
              <label className="control-label">
                <span className="control-icon">📍</span>
                <span className="control-title">Text Position</span>
              </label>
              <div className="position-selector">
                <div className="selected-position" onClick={() => setShowPositions(!showPositions)}>
                  <span className="position-icon">{textPositionOptions.find(p => p.id === textPosition)?.icon}</span>
                  <span className="position-name">{textPositionOptions.find(p => p.id === textPosition)?.name}</span>
                  <span className="arrow">{showPositions ? '▲' : '▼'}</span>
                </div>
                {showPositions && (
                  <div className="position-dropdown">
                    <div className="position-grid">
                      {textPositionOptions.map(option => (
                        <div 
                          key={option.id} 
                          className={`position-option ${textPosition === option.id ? 'active' : ''}`}
                          onClick={() => {
                            setTextPosition(option.id);
                            setShowPositions(false);
                          }}
                        >
                          <div className="position-preview">
                            <div 
                              className="position-sample"
                              style={{
                                display: 'flex',
                                justifyContent: option.justifyContent,
                                alignItems: option.alignItems,
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                position: 'relative'
                              }}
                            >
                              <span className="position-dot">{option.icon}</span>
                            </div>
                          </div>
                          <div className="position-info">
                            <span className="position-name">{option.name}</span>
                            <span className="position-description">{option.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Style Controls */}
            <div className="control-group enhanced">
              <label className="control-label">
                <span className="control-icon">🎨</span>
                <span className="control-title">Style Settings</span>
              </label>
              
              <div className="style-controls">
                <div className="control-item">
                  <label className="control-item-label">Ink Color:</label>
                  <select value={color} onChange={(e) => setColor(e.target.value)} className="styled-select">
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="control-item">
                  <label className="control-item-label">Text Size: {size}px</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      min="16"
                      max="48"
                      className="styled-slider"
                    />
                    <div className="slider-labels">
                      <span>16px</span>
                      <span>48px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Statistics */}
            {text && (
              <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
                <label className="control-label">
                  <span className="control-icon">📊</span>
                  <span className="control-title">Text Statistics</span>
                </label>
                <div className="text-stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">{text.length}</span>
                    <span className="stat-label">Characters</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{text.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span className="stat-label">Words</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{text.split('\n').length}</span>
                    <span className="stat-label">Lines</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToHandwritingConverter;