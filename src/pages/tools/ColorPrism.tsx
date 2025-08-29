import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Copy, 
  Download, 
  Upload, 
  Eye, 
  Droplets,
  Zap,
  RefreshCw,
  Info,
  Check,
  X
} from 'lucide-react';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
  name?: string;
}

interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
}

const ColorPrism: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null);
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Color conversion utilities
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const v = max;
    const s = max === 0 ? 0 : diff / max;
    let h = 0;

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // Generate color harmonies
  const generateHarmonies = useCallback((hex: string, rgb: { r: number; g: number; b: number }) => {
    const { h } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    return [
      {
        name: 'Complementary',
        colors: [
          hex,
          `hsl(${(h + 180) % 360}, 70%, 50%)`
        ],
        description: 'Colors that are opposite each other on the color wheel'
      },
      {
        name: 'Analogous',
        colors: [
          `hsl(${(h + 330) % 360}, 70%, 50%)`,
          hex,
          `hsl(${(h + 30) % 360}, 70%, 50%)`
        ],
        description: 'Colors that are adjacent to each other on the color wheel'
      },
      {
        name: 'Triadic',
        colors: [
          hex,
          `hsl(${(h + 120) % 360}, 70%, 50%)`,
          `hsl(${(h + 240) % 360}, 70%, 50%)`
        ],
        description: 'Three colors that are evenly spaced on the color wheel'
      },
      {
        name: 'Split Complementary',
        colors: [
          hex,
          `hsl(${(h + 150) % 360}, 70%, 50%)`,
          `hsl(${(h + 210) % 360}, 70%, 50%)`
        ],
        description: 'A base color and two colors adjacent to its complement'
      },
      {
        name: 'Square',
        colors: [
          hex,
          `hsl(${(h + 90) % 360}, 70%, 50%)`,
          `hsl(${(h + 180) % 360}, 70%, 50%)`,
          `hsl(${(h + 270) % 360}, 70%, 50%)`
        ],
        description: 'Four colors that are evenly spaced on the color wheel'
      },
      {
        name: 'Monochromatic',
        colors: [
          `hsl(${h}, 70%, 20%)`,
          `hsl(${h}, 70%, 35%)`,
          hex,
          `hsl(${h}, 70%, 65%)`,
          `hsl(${h}, 70%, 80%)`
        ],
        description: 'Different tones, shades and tints of the same hue'
      }
    ];
  }, []);

  // Analyze color and generate information
  const analyzeColor = useCallback((hex: string) => {
    setIsAnalyzing(true);
    
    try {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      
      const colorInfo: ColorInfo = {
        hex,
        rgb,
        hsl,
        hsv,
        cmyk
      };

      setColorInfo(colorInfo);
      setHarmonies(generateHarmonies(hex, rgb));
    } catch (error) {
      console.error('Error analyzing color:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [generateHarmonies]);

  // Handle color change
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    analyzeColor(color);
  };

  // Generate random color
  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    handleColorChange(randomHex);
  };

  // Handle file upload for color extraction
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple average color calculation
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        
        const pixelCount = data.length / 4;
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);
        
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        handleColorChange(hex);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(label);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Initialize with default color
  useEffect(() => {
    analyzeColor(selectedColor);
  }, [analyzeColor, selectedColor]);

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Color Prism</h1>
        <p>Advanced color analysis and harmony generation tool</p>
      </div>
      
      <div className="color-prism-layout">
        <div className="color-input-section">
          <label className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></span>
            Select or enter a color:
          </label>
          
          <div className="color-preview-input">
            <div 
              className="w-16 h-16 rounded-xl shadow-lg border-4 border-white cursor-pointer"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-input')?.focus()}
            ></div>
            
            <div className="flex-1">
              <input
                id="color-input"
                type="text"
                value={selectedColor}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    setSelectedColor(value);
                    if (value.length === 7) {
                      analyzeColor(value);
                    }
                  }
                }}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={generateRandomColor}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Random
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4" />
              Extract
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Color Information */}
          {colorInfo && (
            <div className="color-info-section">
              <label className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                Color Information:
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-300 mb-1">HEX</div>
                  <div className="font-mono font-bold">{colorInfo.hex}</div>
                  <button 
                    onClick={() => copyToClipboard(colorInfo.hex, 'HEX')}
                    className="mt-2 text-xs text-blue-300 hover:text-blue-100 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-300 mb-1">RGB</div>
                  <div className="font-mono font-bold text-sm">
                    {colorInfo.rgb.r}, {colorInfo.rgb.g}, {colorInfo.rgb.b}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b}`, 'RGB')}
                    className="mt-2 text-xs text-blue-300 hover:text-blue-100 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-300 mb-1">HSL</div>
                  <div className="font-mono font-bold text-sm">
                    {colorInfo.hsl.h}°, {colorInfo.hsl.s}%, {colorInfo.hsl.l}%
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%`, 'HSL')}
                    className="mt-2 text-xs text-blue-300 hover:text-blue-100 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-300 mb-1">HSV</div>
                  <div className="font-mono font-bold text-sm">
                    {colorInfo.hsv.h}°, {colorInfo.hsv.s}%, {colorInfo.hsv.v}%
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`${colorInfo.hsv.h}, ${colorInfo.hsv.s}%, ${colorInfo.hsv.v}%`, 'HSV')}
                    className="mt-2 text-xs text-blue-300 hover:text-blue-100 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-300 mb-1">CMYK</div>
                  <div className="font-mono font-bold text-sm">
                    {colorInfo.cmyk.c}%, {colorInfo.cmyk.m}%, {colorInfo.cmyk.y}%, {colorInfo.cmyk.k}%
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`${colorInfo.cmyk.c}%, ${colorInfo.cmyk.m}%, ${colorInfo.cmyk.y}%, ${colorInfo.cmyk.k}%`, 'CMYK')}
                    className="mt-2 text-xs text-blue-300 hover:text-blue-100 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="color-controls-section">
          <div className="color-controls-header">
            <h3>Color Harmonies</h3>
            <p>Explore different color combinations</p>
          </div>
          
          <div className="color-controls">
            {/* Color Harmonies */}
            <div className="space-y-6">
              {harmonies.map((harmony, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    {harmony.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {harmony.description}
                  </p>
                  <div className="flex gap-2 mb-3">
                    {harmony.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-8 h-8 rounded-lg shadow-sm border border-white/50 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      ></div>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard(harmony.colors.join(', '), harmony.name)}
                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy palette
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      <AnimatePresence>
        {copiedColor && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Copied: {copiedColor}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPrism;