import React, { useState, useRef, useEffect } from 'react';

// Font loading utility with enhanced error handling for complex scripts
class FontLoader {
  private static loadedFonts = new Set<string>();
  private static loadingFonts = new Map<string, Promise<void>>();

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
      this.loadFontViaCSS(fontFamily, fontUrl)
        .then(() => {
          setTimeout(() => {
            if (this.verifyFontLoaded(fontFamily)) {
              resolve();
            } else {
              this.loadFontViaFontFace(fontFamily, fontUrl)
                .then(resolve)
                .catch(reject);
            }
          }, 200);
        })
        .catch(() => {
          this.loadFontViaFontFace(fontFamily, fontUrl)
            .then(resolve)
            .catch(reject);
        });
    });
  }

  private static loadFontViaCSS(fontFamily: string, fontUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
        setTimeout(() => resolve(), 100);
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
      const fontFileUrl = await this.extractFontFileUrl(fontUrl);
      const fontFace = new FontFace(fontFamily, `url(${fontFileUrl})`);
      
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (error) {
      throw new Error(`FontFace loading failed: ${error}`);
    }
  }

  private static async extractFontFileUrl(cssUrl: string): Promise<string> {
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
      return true;
    }

    try {
      return document.fonts.check(`16px "${fontFamily}"`);
    } catch {
      return true;
    }
  }
}

const ColorPrismHandwritingConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('english');
  const [color, setColor] = useState('rainbow');
  const [size, setSize] = useState(24);
  const [copied, setCopied] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [fontLoading, setFontLoading] = useState(false);
  const [fontError, setFontError] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('prism');
  const [showPapers, setShowPapers] = useState(false);
  const [outputFormat, setOutputFormat] = useState('prism-card');
  const [showFormats, setShowFormats] = useState(false);
  const [textPosition, setTextPosition] = useState('center');
  const [showPositions, setShowPositions] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Language options with prismatic styling
  const languageOptions = [
    { value: 'english', label: 'English', flag: '🇺🇸', font: 'Dancing Script', fontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
    { value: 'spanish', label: 'Español', flag: '🇪🇸', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' },
    { value: 'french', label: 'Français', flag: '🇫🇷', font: 'Caveat', fontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' },
    { value: 'chinese', label: '中文', flag: '🇨🇳', font: 'Ma Shan Zheng', fontUrl: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap' },
    { value: 'japanese', label: '日本語', flag: '🇯🇵', font: 'Klee One', fontUrl: 'https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap' },
    { value: 'korean', label: '한국어', flag: '🇰🇷', font: 'Gaegu', fontUrl: 'https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap' },
    { value: 'arabic', label: 'العربية', flag: '🇸🇦', font: 'Amiri', fontUrl: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
    { value: 'hindi', label: 'हिन्दी', flag: '🇮🇳', font: 'Kalam', fontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap' }
  ];

  // Prism paper options with rainbow themes
  const paperOptions = [
    {
      id: 'prism',
      name: 'Rainbow Prism',
      preview: '🌈',
      description: 'Vibrant rainbow gradient',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)'
    },
    {
      id: 'aurora',
      name: 'Aurora Borealis',
      preview: '🌌',
      description: 'Northern lights effect',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
    },
    {
      id: 'sunset',
      name: 'Sunset Gradient',
      preview: '🌅',
      description: 'Warm sunset colors',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #fad0c4 75%, #ffd1ff 100%)'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      preview: '🌊',
      description: 'Deep ocean blues',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #89f7fe 50%, #66a6ff 75%, #667eea 100%)'
    },
    {
      id: 'galaxy',
      name: 'Galaxy Nebula',
      preview: '🌌',
      description: 'Cosmic space theme',
      background: 'linear-gradient(135deg, #2c3e50 0%, #4a00e0 25%, #8e2de2 50%, #ff006e 75%, #8a2387 100%)'
    },
    {
      id: 'crystal',
      name: 'Crystal Prism',
      preview: '💎',
      description: 'Crystalline reflections',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #ff9a9e 50%, #fecfef 75%, #ffecd2 100%)'
    }
  ];

  // Prism output formats
  const outputFormatOptions = [
    {
      id: 'prism-card',
      name: 'Prism Card',
      icon: '🌈',
      description: 'Rainbow card format',
      aspectRatio: '16:10',
      padding: 32
    },
    {
      id: 'crystal-square',
      name: 'Crystal Square',
      icon: '💎',
      description: 'Perfect square crystal',
      aspectRatio: '1:1',
      padding: 40
    },
    {
      id: 'aurora-wide',
      name: 'Aurora Wide',
      icon: '🌌',
      description: 'Wide aurora display',
      aspectRatio: '21:9',
      padding: 24
    },
    {
      id: 'rainbow-portrait',
      name: 'Rainbow Portrait',
      icon: '🎨',
      description: 'Tall rainbow format',
      aspectRatio: '9:16',
      padding: 36
    }
  ];

  // Prism text positions
  const textPositionOptions = [
    {
      id: 'center',
      name: 'Center Prism',
      icon: '🌈',
      description: 'Centered rainbow text',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    {
      id: 'floating',
      name: 'Floating Colors',
      icon: '✨',
      description: 'Floating color effect',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    {
      id: 'cascade',
      name: 'Color Cascade',
      icon: '🌊',
      description: 'Cascading rainbow',
      textAlign: 'left',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }
  ];

  // Prism color options
  const colorOptions = [
    { value: 'rainbow', label: '🌈 Rainbow', gradient: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)' },
    { value: 'fire', label: '🔥 Fire', gradient: 'linear-gradient(45deg, #ff4757, #ff6348, #ff7675, #fd79a8)' },
    { value: 'ice', label: '❄️ Ice', gradient: 'linear-gradient(45deg, #74b9ff, #0984e3, #00b894, #00cec9)' },
    { value: 'sunset', label: '🌅 Sunset', gradient: 'linear-gradient(45deg, #fd79a8, #fdcb6e, #e17055, #d63031)' },
    { value: 'aurora', label: '🌌 Aurora', gradient: 'linear-gradient(45deg, #a29bfe, #6c5ce7, #fd79a8, #fdcb6e)' }
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

  const getSelectedFont = () => {
    const selectedLanguage = languageOptions.find(l => l.value === language);
    if (selectedLanguage) {
      const fontName = selectedLanguage.font;
      let fallbacks = 'cursive';
      
      if (['hindi'].includes(language)) {
        fallbacks = 'Kalam, "Noto Sans Devanagari", sans-serif';
      } else if (['arabic'].includes(language)) {
        fallbacks = 'Amiri, "Noto Sans Arabic", serif';
      } else if (['chinese', 'japanese', 'korean'].includes(language)) {
        fallbacks = '"Noto Sans CJK", sans-serif';
      } else {
        fallbacks = 'cursive, fantasy';
      }
      
      return `"${fontName}", ${fallbacks}`;
    }
    return 'cursive';
  };

  const getSelectedColor = () => {
    const selectedColorOption = colorOptions.find(c => c.value === color);
    return selectedColorOption?.gradient || colorOptions[0].gradient;
  };

  const getSelectedPaper = () => {
    const selectedPaperOption = paperOptions.find(p => p.id === selectedPaper);
    return {
      background: selectedPaperOption?.background || paperOptions[0].background
    };
  };

  const getOutputFormatStyles = () => {
    const format = outputFormatOptions.find(f => f.id === outputFormat);
    if (!format) return {};

    const [widthRatio, heightRatio] = format.aspectRatio.split(':').map(Number);
    const baseWidth = 400;
    const calculatedHeight = (baseWidth * heightRatio) / widthRatio;
    
    return {
      width: `${baseWidth}px`,
      height: `${Math.min(calculatedHeight, 500)}px`,
      padding: `${format.padding}px`,
      aspectRatio: format.aspectRatio.replace(':', '/')
    };
  };

  const getTextPositionStyles = (): React.CSSProperties => {
    const position = textPositionOptions.find(p => p.id === textPosition);
    if (!position) return {};

    if (textPosition === 'floating') {
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

  const renderFloatingText = () => {
    if (textPosition !== 'floating' || !text) return null;
    
    const lines = text.split('\n');
    return (
      <>
        {lines.map((line, index) => (
          <span
            key={index}
            className="floating-text-line"
            style={{
              position: 'absolute',
              left: `${15 + Math.random() * 60}%`,
              top: `${15 + Math.random() * 60}%`,
              transform: `rotate(${(Math.random() - 0.5) * 15}deg) scale(${0.9 + Math.random() * 0.2})`,
              whiteSpace: 'nowrap',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              background: getSelectedColor(),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `hue-rotate(${index * 30}deg)`,
              animation: `float-${index % 3} 3s ease-in-out infinite`
            }}
          >
            {line}
          </span>
        ))}
      </>
    );
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
    
    const [widthRatio, heightRatio] = format.aspectRatio.split(':').map(Number);
    let baseWidth = 1200;
    let baseHeight = (baseWidth * heightRatio) / widthRatio;
    
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    
    ctx!.scale(scale, scale);
    
    // Create gradient background
    const selectedPaperOption = paperOptions.find(p => p.id === selectedPaper);
    const gradient = ctx!.createLinearGradient(0, 0, baseWidth, baseHeight);
    
    // Parse gradient colors from CSS
    if (selectedPaperOption?.background.includes('linear-gradient')) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
    }
    
    ctx!.fillStyle = gradient;
    ctx!.fillRect(0, 0, baseWidth, baseHeight);
    
    // Draw text with gradient
    const fontSize = Math.max(16, size * (baseWidth / 600));
    ctx!.font = `${fontSize}px ${getSelectedFont()}`;
    
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.6;
    const textAreaHeight = lines.length * lineHeight;
    
    let textStartX = baseWidth / 2;
    let textStartY = (baseHeight - textAreaHeight) / 2 + lineHeight / 2;
    
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    
    // Create text gradient
    const textGradient = ctx!.createLinearGradient(0, textStartY - lineHeight, 0, textStartY + textAreaHeight);
    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    rainbowColors.forEach((color, index) => {
      textGradient.addColorStop(index / (rainbowColors.length - 1), color);
    });
    
    ctx!.fillStyle = textGradient;
    
    lines.forEach((line, index) => {
      const x = textStartX;
      const y = textStartY + index * lineHeight;
      ctx!.fillText(line, x, y);
    });
    
    const link = document.createElement('a');
    link.download = `prism-handwriting-${language}-${selectedPaper}-${outputFormat}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="prism-tool-container">
      <style jsx>{`
        .prism-tool-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          background-size: 400% 400%;
          animation: prismBackground 15s ease infinite;
          padding: 2rem;
        }

        @keyframes prismBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        .prism-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .prism-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
        }

        .prism-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          font-weight: 300;
        }

        .prism-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .prism-input-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .prism-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .prism-textarea {
          width: 100%;
          min-height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          padding: 1rem;
          color: white;
          font-size: 1rem;
          resize: vertical;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .prism-textarea:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .prism-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .prism-preview-container {
          margin-top: 2rem;
          position: relative;
        }

        .prism-preview {
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          position: relative;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .prism-preview:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .prism-text-content {
          font-weight: 500;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }

        .prism-placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          text-align: center;
        }

        .prism-controls {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .prism-control-group {
          margin-bottom: 2rem;
        }

        .prism-control-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .prism-dropdown {
          position: relative;
        }

        .prism-dropdown-trigger {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .prism-dropdown-trigger:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .prism-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
          margin-top: 0.5rem;
        }

        .prism-dropdown-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
        }

        .prism-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .prism-dropdown-item.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .prism-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }

        .prism-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .prism-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .prism-btn {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .prism-btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .prism-btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .prism-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .prism-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .prism-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .prism-stat {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }

        .prism-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          display: block;
        }

        .prism-stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .prism-layout {
            grid-template-columns: 1fr;
          }
          
          .prism-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="prism-header">
        <h1 className="prism-title">🌈 Color Prism Handwriting</h1>
        <p className="prism-subtitle">Transform your text into vibrant rainbow handwriting</p>
      </div>

      <div className="prism-layout">
        <div className="prism-input-section">
          <h2 className="prism-section-title">
            <span>✨</span>
            Text Input & Preview
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here to see it transform into beautiful rainbow handwriting...

Try multiple lines!
Experiment with different colors and effects."
            className="prism-textarea"
          />

          <div className="prism-preview-container">
            <div 
              ref={previewRef}
              className="prism-preview"
              style={{
                ...getSelectedPaper(),
                ...getOutputFormatStyles()
              }}
            >
              <div className="prism-text-content" style={getTextPositionStyles()}>
                {textPosition === 'floating' ? (
                  renderFloatingText()
                ) : (
                  <div
                    style={{
                      fontFamily: getSelectedFont(),
                      fontSize: `${size}px`,
                      background: getSelectedColor(),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 500,
                      lineHeight: 1.6
                    }}
                  >
                    {text || (
                      <div className="prism-placeholder">
                        Your rainbow handwriting will appear here... ✨
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="prism-actions">
            <button 
              className={`prism-btn prism-btn-primary ${copied ? 'success' : ''}`}
              onClick={copyToClipboard}
              disabled={!text.trim()}
            >
              <span>{copied ? '✅' : '📋'}</span>
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            
            <button 
              className="prism-btn prism-btn-secondary"
              onClick={downloadAsImage}
              disabled={!text.trim()}
            >
              <span>💾</span>
              Download Image
            </button>
          </div>

          {text && (
            <div className="prism-stats">
              <div className="prism-stat">
                <span className="prism-stat-value">{text.length}</span>
                <span className="prism-stat-label">Characters</span>
              </div>
              <div className="prism-stat">
                <span className="prism-stat-value">{text.split(/\s+/).filter(word => word.length > 0).length}</span>
                <span className="prism-stat-label">Words</span>
              </div>
              <div className="prism-stat">
                <span className="prism-stat-value">{text.split('\n').length}</span>
                <span className="prism-stat-label">Lines</span>
              </div>
            </div>
          )}
        </div>

        <div className="prism-controls">
          <h2 className="prism-section-title">
            <span>🎨</span>
            Customization
          </h2>

          {/* Language Selection */}
          <div className="prism-control-group">
            <label className="prism-control-label">
              <span>🌍</span>
              Language & Font
              {fontLoading && <span>⏳</span>}
            </label>
            {fontError && <div style={{color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '0.5rem'}}>⚠️ {fontError}</div>}
            <div className="prism-dropdown">
              <div className="prism-dropdown-trigger" onClick={() => setShowLanguages(!showLanguages)}>
                <span>
                  {languageOptions.find(l => l.value === language)?.flag} {languageOptions.find(l => l.value === language)?.label}
                </span>
                <span>{showLanguages ? '▲' : '▼'}</span>
              </div>
              {showLanguages && (
                <div className="prism-dropdown-menu">
                  {languageOptions.map(option => (
                    <div 
                      key={option.value} 
                      className={`prism-dropdown-item ${language === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(option.value);
                        setShowLanguages(false);
                      }}
                    >
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="prism-control-group">
            <label className="prism-control-label">
              <span>🎨</span>
              Color Theme
            </label>
            <div className="prism-dropdown">
              <div className="prism-dropdown-trigger" onClick={() => setShowLanguages(false)}>
                <span>{colorOptions.find(c => c.value === color)?.label}</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.5rem'}}>
                {colorOptions.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => setColor(option.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: option.gradient,
                      color: 'white',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: color === option.value ? '2px solid white' : '2px solid transparent',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paper Selection */}
          <div className="prism-control-group">
            <label className="prism-control-label">
              <span>📄</span>
              Background Theme
            </label>
            <div className="prism-dropdown">
              <div className="prism-dropdown-trigger" onClick={() => setShowPapers(!showPapers)}>
                <span>
                  {paperOptions.find(p => p.id === selectedPaper)?.preview} {paperOptions.find(p => p.id === selectedPaper)?.name}
                </span>
                <span>{showPapers ? '▲' : '▼'}</span>
              </div>
              {showPapers && (
                <div className="prism-dropdown-menu">
                  {paperOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`prism-dropdown-item ${selectedPaper === option.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedPaper(option.id);
                        setShowPapers(false);
                      }}
                    >
                      <span>{option.preview}</span>
                      <div>
                        <div>{option.name}</div>
                        <div style={{fontSize: '0.7rem', opacity: 0.7}}>{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text Size */}
          <div className="prism-control-group">
            <label className="prism-control-label">
              <span>📏</span>
              Text Size: {size}px
            </label>
            <input
              type="range"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              min="16"
              max="48"
              className="prism-slider"
            />
          </div>

          {/* Output Format */}
          <div className="prism-control-group">
            <label className="prism-control-label">
              <span>📐</span>
              Format
            </label>
            <div className="prism-dropdown">
              <div className="prism-dropdown-trigger" onClick={() => setShowFormats(!showFormats)}>
                <span>
                  {outputFormatOptions.find(f => f.id === outputFormat)?.icon} {outputFormatOptions.find(f => f.id === outputFormat)?.name}
                </span>
                <span>{showFormats ? '▲' : '▼'}</span>
              </div>
              {showFormats && (
                <div className="prism-dropdown-menu">
                  {outputFormatOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`prism-dropdown-item ${outputFormat === option.id ? 'active' : ''}`}
                      onClick={() => {
                        setOutputFormat(option.id);
                        setShowFormats(false);
                      }}
                    >
                      <span>{option.icon}</span>
                      <div>
                        <div>{option.name}</div>
                        <div style={{fontSize: '0.7rem', opacity: 0.7}}>{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text Position */}
          <div className="prism-control-group">
            <label className="prism-control-label">
              <span>📍</span>
              Text Effect
            </label>
            <div className="prism-dropdown">
              <div className="prism-dropdown-trigger" onClick={() => setShowPositions(!showPositions)}>
                <span>
                  {textPositionOptions.find(p => p.id === textPosition)?.icon} {textPositionOptions.find(p => p.id === textPosition)?.name}
                </span>
                <span>{showPositions ? '▲' : '▼'}</span>
              </div>
              {showPositions && (
                <div className="prism-dropdown-menu">
                  {textPositionOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`prism-dropdown-item ${textPosition === option.id ? 'active' : ''}`}
                      onClick={() => {
                        setTextPosition(option.id);
                        setShowPositions(false);
                      }}
                    >
                      <span>{option.icon}</span>
                      <div>
                        <div>{option.name}</div>
                        <div style={{fontSize: '0.7rem', opacity: 0.7}}>{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPrismHandwritingConverter;