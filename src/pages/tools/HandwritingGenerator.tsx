import React, { useState, useRef } from 'react';

export const HandwritingGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [font, setFont] = useState('cursive');
  const [color, setColor] = useState('blue');
  const [size, setSize] = useState(24);
  const [language, setLanguage] = useState('english');
  const [copied, setCopied] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const languageOptions = [
    { value: 'english', label: 'English', flag: '🇺🇸', font: '"Dancing Script", cursive' },
    { value: 'spanish', label: 'Español', flag: '🇪🇸', font: '"Kalam", cursive' },
    { value: 'french', label: 'Français', flag: '🇫🇷', font: '"Caveat", cursive' },
    { value: 'german', label: 'Deutsch', flag: '🇩🇪', font: '"Shadows Into Light", cursive' },
    { value: 'italian', label: 'Italiano', flag: '🇮🇹', font: '"Amatic SC", cursive' },
    { value: 'portuguese', label: 'Português', flag: '🇵🇹', font: '"Patrick Hand", cursive' },
    { value: 'russian', label: 'Русский', flag: '🇷🇺', font: '"Marck Script", cursive' },
    { value: 'chinese', label: '中文', flag: '🇨🇳', font: '"Ma Shan Zheng", cursive' },
    { value: 'japanese', label: '日本語', flag: '🇯🇵', font: '"Klee One", cursive' },
    { value: 'korean', label: '한국어', flag: '🇰🇷', font: '"Gaegu", cursive' },
    { value: 'arabic', label: 'العربية', flag: '🇸🇦', font: '"Amiri", serif' },
    { value: 'hindi', label: 'हिन्दी', flag: '🇮🇳', font: '"Kalam", cursive' },
    { value: 'bangla', label: 'বাংলা', flag: '🇧🇩', font: '"Kalpurush", cursive' },
    { value: 'urdu', label: 'اردو', flag: '🇵🇰', font: '"Noto Nastaliq Urdu", serif' },
    { value: 'turkish', label: 'Türkçe', flag: '🇹🇷', font: '"Caveat", cursive' },
    { value: 'dutch', label: 'Nederlands', flag: '🇳🇱', font: '"Kalam", cursive' },
    { value: 'swedish', label: 'Svenska', flag: '🇸🇪', font: '"Dancing Script", cursive' },
    { value: 'norwegian', label: 'Norsk', flag: '🇳🇴', font: '"Patrick Hand", cursive' },
    { value: 'danish', label: 'Dansk', flag: '🇩🇰', font: '"Amatic SC", cursive' },
    { value: 'finnish', label: 'Suomi', flag: '🇫🇮', font: '"Shadows Into Light", cursive' },
    { value: 'polish', label: 'Polski', flag: '🇵🇱', font: '"Caveat", cursive' },
    { value: 'czech', label: 'Čeština', flag: '🇨🇿', font: '"Dancing Script", cursive' },
    { value: 'hungarian', label: 'Magyar', flag: '🇭🇺', font: '"Kalam", cursive' },
    { value: 'romanian', label: 'Română', flag: '🇷🇴', font: '"Patrick Hand", cursive' },
    { value: 'greek', label: 'Ελληνικά', flag: '🇬🇷', font: '"Dancing Script", cursive' },
    { value: 'hebrew', label: 'עברית', flag: '🇮🇱', font: '"Alef", serif' },
    { value: 'thai', label: 'ไทย', flag: '🇹🇭', font: '"Sarabun", cursive' },
    { value: 'vietnamese', label: 'Tiếng Việt', flag: '🇻🇳', font: '"Dancing Script", cursive' },
    { value: 'indonesian', label: 'Bahasa Indonesia', flag: '🇮🇩', font: '"Kalam", cursive' },
    { value: 'malay', label: 'Bahasa Melayu', flag: '🇲🇾', font: '"Patrick Hand", cursive' },
    { value: 'filipino', label: 'Filipino', flag: '🇵🇭', font: '"Caveat", cursive' },
    { value: 'persian', label: 'فارسی', flag: '🇮🇷', font: '"Vazir", serif' },
    { value: 'tamil', label: 'தமிழ்', flag: '🇮🇳', font: '"Mukti", cursive' },
    { value: 'telugu', label: 'తెలుగు', flag: '🇮🇳', font: '"Noto Sans Telugu", serif' },
    { value: 'gujarati', label: 'ગુજરાતી', flag: '🇮🇳', font: '"Noto Sans Gujarati", serif' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳', font: '"Noto Sans Gurmukhi", serif' },
    { value: 'marathi', label: 'मराठी', flag: '🇮🇳', font: '"Kalam", cursive' },
    { value: 'kannada', label: 'ಕನ್ನಡ', flag: '🇮🇳', font: '"Noto Sans Kannada", serif' },
    { value: 'malayalam', label: 'മലയാളം', flag: '🇮🇳', font: '"Noto Sans Malayalam", serif' },
    { value: 'sinhala', label: 'සිංහල', flag: '🇱🇰', font: '"Noto Sans Sinhala", serif' },
    { value: 'burmese', label: 'မြန်မာ', flag: '🇲🇲', font: '"Noto Sans Myanmar", serif' },
    { value: 'khmer', label: 'ខ្មែរ', flag: '🇰🇭', font: '"Noto Sans Khmer", serif' },
    { value: 'georgian', label: 'ქართული', flag: '🇬🇪', font: '"Noto Sans Georgian", serif' }
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

  const getSelectedFont = () => {
    const selectedLanguage = languageOptions.find(l => l.value === language);
    if (selectedLanguage) {
      return selectedLanguage.font;
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

  const downloadAsImage = () => {
    if (!text.trim()) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 3;
    canvas.width = 1200 * scale;
    canvas.height = 800 * scale;
    
    ctx!.scale(scale, scale);
    
    ctx!.fillStyle = '#ffffff';
    ctx!.fillRect(0, 0, 1200, 800);
    
    ctx!.fillStyle = getSelectedColor();
    ctx!.font = `${size * 1.5}px ${getSelectedFont()}`;
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = size * 2.2;
    const startY = (800 - (lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx!.fillText(line, 600, startY + index * lineHeight);
    });
    
    const link = document.createElement('a');
    link.download = `handwriting-${language}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Handwriting Text Generator</h1>
        <p>Convert your text into beautiful handwriting styles</p>
      </div>
      <div className="handwriting-layout">
        <div className="handwriting-input-section">
          <label className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
            Enter your text:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here to see it in handwriting style..."
            className="handwriting-input-textarea"
          />
          <div className="handwriting-preview-section">
            <label className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></span>
              Handwriting Preview:
            </label>
            <div 
              ref={previewRef}
              className="handwriting-preview"
              style={{
                fontFamily: getSelectedFont(),
                color: getSelectedColor(),
                fontSize: `${size}px`
              }}
            >
              {text || 'Your handwritten text will appear here...'}
            </div>
            <div className="handwriting-actions">
              <button 
                className={`copy-btn ${copied ? 'copied' : ''} ${!text.trim() ? 'disabled' : ''}`}
                onClick={copyToClipboard}
                disabled={!text.trim()}
              >
                <span className="mr-2">{copied ? '✓' : '📋'}</span>
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button 
                className="download-btn"
                onClick={downloadAsImage}
              >
                📥 Download Image
              </button>
            </div>
          </div>
        </div>
        <div className="handwriting-controls-section">
          <div className="handwriting-controls-header">
            <h3>Style Settings</h3>
            <p>Customize handwriting</p>
          </div>
          <div className="handwriting-controls">
            <div className="control-group">
              <label>Language:</label>
              <div className="language-selector">
                <div className="selected-language" onClick={() => setShowLanguages(!showLanguages)}>
                  <span className="flag">{languageOptions.find(l => l.value === language)?.flag}</span>
                  <span className="name">{languageOptions.find(l => l.value === language)?.label}</span>
                  <span className="arrow">▼</span>
                </div>
                {showLanguages && (
                  <div className="language-dropdown">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="control-group">
              <label>Font Style:</label>
              <select value={font} onChange={(e) => setFont(e.target.value)}>
                {fontOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Ink Color:</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Text Size: {size}px</label>
              <div className="volume-slider">
                <input
                  type="range"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  min="16"
                  max="48"
                  className="slider"
                />
                <div className="slider-labels">
                  <span>16px</span>
                  <span>48px</span>
                </div>
              </div>
            </div>
            {text && (
              <div className="text-stats">
                <span>{text.length} chars</span>
                <span>{text.split(/\s+/).filter(word => word.length > 0).length} words</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};