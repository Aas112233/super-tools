import React, { useState, useRef } from 'react';
import Resizer from 'react-image-file-resizer';

const ImageResizer: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [resizedImage, setResizedImage] = useState<string>('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('JPEG');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats = ['JPEG', 'PNG', 'WEBP'];
  const presets = [
    { name: 'HD (1920x1080)', width: 1920, height: 1080 },
    { name: 'Full HD (1080x1920)', width: 1080, height: 1920 },
    { name: 'Square (1080x1080)', width: 1080, height: 1080 },
    { name: 'Web (800x600)', width: 800, height: 600 },
    { name: 'Thumbnail (300x300)', width: 300, height: 300 },
    { name: 'Banner (1200x400)', width: 1200, height: 400 }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = event.target?.result as string;
        setOriginalImage(event.target?.result as string);
        setResizedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const resizeImage = () => {
    if (!originalImage) return;

    // Convert data URL to file
    fetch(originalImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'image.jpg', { type: blob.type });
        
        Resizer.imageFileResizer(
          file,
          width,
          height,
          format,
          quality,
          0,
          (uri) => {
            setResizedImage(uri as string);
          },
          'base64'
        );
      });
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    
    const link = document.createElement('a');
    link.download = `resized-${width}x${height}-${Date.now()}.${format.toLowerCase()}`;
    link.href = resizedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setOriginalImage('');
    setResizedImage('');
    setWidth(800);
    setHeight(600);
    setQuality(80);
    setFormat('JPEG');
    setMaintainAspectRatio(true);
    setOriginalDimensions({ width: 0, height: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Image Resizer</h1>
        <p>Resize images with quality control and format conversion</p>
      </div>
      <div className="image-resizer-layout">
        <div className="image-preview-section">
          {!originalImage ? (
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">📐</div>
              <p>Click to upload an image</p>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>
          ) : resizedImage ? (
            <div className="result-container">
              <div className="image-comparison">
                <div className="image-preview">
                  <h4>Original ({originalDimensions.width}x{originalDimensions.height})</h4>
                  <img src={originalImage} alt="Original" className="comparison-image" />
                </div>
                <div className="image-preview">
                  <h4>Resized ({width}x{height})</h4>
                  <img src={resizedImage} alt="Resized" className="comparison-image" />
                </div>
              </div>
              <div className="resize-actions">
                <button className="download-btn" onClick={downloadImage}>
                  📥 Download
                </button>
                <button className="new-btn" onClick={resetTool}>
                  🔄 New Image
                </button>
              </div>
            </div>
          ) : (
            <div className="resize-preview-container">
              <img src={originalImage} alt="Original" className="resize-preview-image" />
              <div className="resize-info">
                <p>Original: {originalDimensions.width}x{originalDimensions.height}</p>
                <p>Target: {width}x{height}</p>
              </div>
            </div>
          )}
        </div>
        <div className="resizer-controls-section">
          <div className="resizer-controls-header">
            <h3>Resize Settings</h3>
            <p>Adjust dimensions and quality</p>
          </div>
          <div className="resizer-controls">
            <div className="control-group">
              <label>Presets:</label>
              <div className="preset-buttons">
                {presets.map(preset => (
                  <button
                    key={preset.name}
                    className="preset-btn"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                />
                Maintain Aspect Ratio
              </label>
            </div>
            <div className="dimension-controls">
              <div className="dimension-input">
                <label>Width: {width}px</label>
                <div className="input-group">
                  <input
                    type="number"
                    min="50"
                    max="3000"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 50)}
                    className="dimension-number-input"
                  />
                  <input
                    type="range"
                    min="50"
                    max="3000"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="dimension-input">
                <label>Height: {height}px</label>
                <div className="input-group">
                  <input
                    type="number"
                    min="50"
                    max="3000"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 50)}
                    className="dimension-number-input"
                  />
                  <input
                    type="range"
                    min="50"
                    max="3000"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="control-group">
              <label>Quality: {quality}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
              />
            </div>
            <div className="control-group">
              <label>Format:</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                {formats.map(fmt => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>
            {originalImage && !resizedImage && (
              <button className="action-btn primary" onClick={resizeImage}>
                🔧 Resize Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;