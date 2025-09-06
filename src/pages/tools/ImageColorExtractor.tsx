import React, { useState, useRef } from 'react';
import { ImageColorPicker } from 'react-image-color-picker';

const ImageColorExtractor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setShowPicker(true);
        setSelectedColor('');
        setColorHistory([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorPick = (color: string) => {
    setSelectedColor(color);
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 11)]);
    }
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return rgb;
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return hex;
  };

  const resetTool = () => {
    setImageSrc('');
    setSelectedColor('');
    setColorHistory([]);
    setShowPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Image Color Extractor</h1>
        <p>Click on any pixel to extract its color value</p>
      </div>
      <div className="color-extractor-layout">
        <div className="image-preview-section">
          {!imageSrc ? (
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">🎨</div>
              <p>Click to upload an image</p>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>
          ) : (
            <div className="color-picker-container">
              {showPicker && (
                <ImageColorPicker
                  onColorPick={handleColorPick}
                  imgSrc={imageSrc}
                  zoom={1}
                />
              )}
              <button className="new-btn" onClick={resetTool}>
                🔄 New Image
              </button>
            </div>
          )}
        </div>
        <div className="color-info-section">
          <div className="color-info-header">
            <h3>Color Information</h3>
            <p>Click on image to extract colors</p>
          </div>
          <div className="color-details">
            {selectedColor && (
              <div className="selected-color">
                <h4>Selected Color</h4>
                <div className="color-display">
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                  <div className="color-values">
                    <div className="color-value">
                      <label>HEX:</label>
                      <span 
                        className="color-code"
                        onClick={() => copyToClipboard(rgbToHex(selectedColor))}
                      >
                        {rgbToHex(selectedColor)}
                      </span>
                    </div>
                    <div className="color-value">
                      <label>RGB:</label>
                      <span 
                        className="color-code"
                        onClick={() => copyToClipboard(hexToRgb(rgbToHex(selectedColor)))}
                      >
                        {hexToRgb(rgbToHex(selectedColor))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {colorHistory.length > 0 && (
              <div className="color-history">
                <h4>Color History</h4>
                <div className="color-palette">
                  {colorHistory.map((color, index) => (
                    <div 
                      key={index}
                      className="palette-color"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={rgbToHex(color)}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            <div className="extractor-info">
              <h4>How to Use:</h4>
              <ul>
                <li>• Upload an image file</li>
                <li>• Click anywhere on the image</li>
                <li>• Color values will be extracted</li>
                <li>• Click color codes to copy</li>
                <li>• View color history palette</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageColorExtractor;