import React, { useState, useRef, useEffect } from 'react';

const PhotoFilters: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [colorMatrix, setColorMatrix] = useState({
    rr: 1, gr: 0, br: 0, ar: 0, addR: 0,
    rg: 0, gg: 1, bg: 0, ag: 0, addG: 0,
    rb: 0, gb: 0, bb: 1, ab: 0, addB: 0,
    ra: 0, ga: 0, ba: 0, aa: 1, addA: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const filters = [
    { id: 'none', label: 'Original', filter: 'none' },
    { id: 'grayscale', label: 'Grayscale', filter: 'grayscale(100%)' },
    { id: 'blackwhite', label: 'Black & White', filter: 'grayscale(100%) contrast(150%) brightness(110%)' },
    { id: 'sepia', label: 'Sepia', filter: 'sepia(100%)' },
    { id: 'blur', label: 'Blur', filter: 'blur(3px)' },
    { id: 'brightness', label: 'Bright', filter: 'brightness(150%)' },
    { id: 'contrast', label: 'Contrast', filter: 'contrast(150%)' },
    { id: 'saturate', label: 'Saturate', filter: 'saturate(200%)' },
    { id: 'hue', label: 'Hue Rotate', filter: 'hue-rotate(90deg)' },
    { id: 'invert', label: 'Invert', filter: 'invert(100%)' },
    { id: 'vintage', label: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(110%)' },
    { id: 'cool', label: 'Cool', filter: 'hue-rotate(180deg) saturate(120%)' },
    { id: 'warm', label: 'Warm', filter: 'hue-rotate(30deg) saturate(130%) brightness(110%)' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilterToCanvas = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    if (showAdvanced) {
      const matrix = `${colorMatrix.rr} ${colorMatrix.gr} ${colorMatrix.br} ${colorMatrix.ar} ${colorMatrix.addR} ${colorMatrix.rg} ${colorMatrix.gg} ${colorMatrix.bg} ${colorMatrix.ag} ${colorMatrix.addG} ${colorMatrix.rb} ${colorMatrix.gb} ${colorMatrix.bb} ${colorMatrix.ab} ${colorMatrix.addB} ${colorMatrix.ra} ${colorMatrix.ga} ${colorMatrix.ba} ${colorMatrix.aa} ${colorMatrix.addA}`;
      ctx!.filter = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="matrix"><feColorMatrix values="${matrix}"/></filter></svg>#matrix')`;
    } else {
      const selectedFilterData = filters.find(f => f.id === selectedFilter);
      if (selectedFilterData) {
        ctx!.filter = selectedFilterData.filter;
      }
    }
    
    ctx!.drawImage(img, 0, 0);
    ctx!.filter = 'none';
  };

  useEffect(() => {
    if (imageSrc && imageRef.current) {
      applyFilterToCanvas();
    }
  }, [selectedFilter, imageSrc, colorMatrix, showAdvanced]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `filtered-${showAdvanced ? 'advanced' : selectedFilter}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setImageSrc('');
    setSelectedFilter('none');
    setShowAdvanced(false);
    setColorMatrix({
      rr: 1, gr: 0, br: 0, ar: 0, addR: 0,
      rg: 0, gg: 1, bg: 0, ag: 0, addG: 0,
      rb: 0, gb: 0, bb: 1, ab: 0, addB: 0,
      ra: 0, ga: 0, ba: 0, aa: 1, addA: 0
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getImageFilter = () => {
    if (showAdvanced) {
      const matrix = `${colorMatrix.rr} ${colorMatrix.gr} ${colorMatrix.br} ${colorMatrix.ar} ${colorMatrix.addR} ${colorMatrix.rg} ${colorMatrix.gg} ${colorMatrix.bg} ${colorMatrix.ag} ${colorMatrix.addG} ${colorMatrix.rb} ${colorMatrix.gb} ${colorMatrix.bb} ${colorMatrix.ab} ${colorMatrix.addB} ${colorMatrix.ra} ${colorMatrix.ga} ${colorMatrix.ba} ${colorMatrix.aa} ${colorMatrix.addA}`;
      return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="matrix"><feColorMatrix values="${matrix}"/></filter></svg>#matrix')`;
    }
    const selectedFilterData = filters.find(f => f.id === selectedFilter);
    return selectedFilterData?.filter || 'none';
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Photo Filters</h1>
        <p>Apply professional filters with advanced color matrix controls</p>
      </div>
      <div className="photo-filters-layout">
        <div className="image-preview-section">
          {!imageSrc ? (
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">🖼️</div>
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
            <div className="filter-preview-container">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Filtered"
                className="filtered-image"
                style={{ filter: getImageFilter() }}
                onLoad={applyFilterToCanvas}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="filter-actions">
                <button className="download-btn" onClick={downloadImage}>
                  📥 Download
                </button>
                <button className="new-btn" onClick={resetTool}>
                  🔄 New Image
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="filters-controls-section">
          <div className="filters-controls-header">
            <h3>Photo Filters</h3>
            <p>Choose presets or advanced controls</p>
          </div>
          <div className="filters-controls">
            <div className="filter-mode-toggle">
              <button 
                className={`mode-btn ${!showAdvanced ? 'active' : ''}`}
                onClick={() => setShowAdvanced(false)}
              >
                Presets
              </button>
              <button 
                className={`mode-btn ${showAdvanced ? 'active' : ''}`}
                onClick={() => setShowAdvanced(true)}
              >
                Advanced
              </button>
            </div>
            {!showAdvanced ? (
              <div className="filter-grid">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                    onClick={() => setSelectedFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="color-matrix-controls">
                <div className="matrix-section">
                  <h5>Red Channel</h5>
                  <div className="slider-group">
                    <label>Red to Red: {colorMatrix.rr.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.rr} onChange={(e) => setColorMatrix(prev => ({...prev, rr: parseFloat(e.target.value)}))} />
                  </div>
                  <div className="slider-group">
                    <label>Green to Red: {colorMatrix.gr.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.gr} onChange={(e) => setColorMatrix(prev => ({...prev, gr: parseFloat(e.target.value)}))} />
                  </div>
                  <div className="slider-group">
                    <label>Blue to Red: {colorMatrix.br.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.br} onChange={(e) => setColorMatrix(prev => ({...prev, br: parseFloat(e.target.value)}))} />
                  </div>
                </div>
                <div className="matrix-section">
                  <h5>Green Channel</h5>
                  <div className="slider-group">
                    <label>Red to Green: {colorMatrix.rg.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.rg} onChange={(e) => setColorMatrix(prev => ({...prev, rg: parseFloat(e.target.value)}))} />
                  </div>
                  <div className="slider-group">
                    <label>Green to Green: {colorMatrix.gg.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.gg} onChange={(e) => setColorMatrix(prev => ({...prev, gg: parseFloat(e.target.value)}))} />
                  </div>
                  <div className="slider-group">
                    <label>Blue to Green: {colorMatrix.bg.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.bg} onChange={(e) => setColorMatrix(prev => ({...prev, bg: parseFloat(e.target.value)}))} />
                  </div>
                </div>
                <div className="matrix-section">
                  <h5>Blue Channel</h5>
                  <div className="slider-group">
                    <label>Red to Blue: {colorMatrix.rb.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.rb} onChange={(e) => setColorMatrix(prev => ({...prev, rb: parseFloat(e.target.value)}))} />
                  </div>
                  <div className="slider-group">
                    <label>Green to Blue: {colorMatrix.gb.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.gb} onChange={(e) => setColorMatrix(prev => ({...prev, gb: parseFloat(e.target.value)}))} />
                  </div>
                  <div className="slider-group">
                    <label>Blue to Blue: {colorMatrix.bb.toFixed(2)}</label>
                    <input type="range" min="-2" max="2" step="0.01" value={colorMatrix.bb} onChange={(e) => setColorMatrix(prev => ({...prev, bb: parseFloat(e.target.value)}))} />
                  </div>
                </div>
              </div>
            )}
            <div className="filters-info">
              <h4>{showAdvanced ? 'Color Matrix:' : 'Filter Categories:'}</h4>
              <ul>
                {showAdvanced ? (
                  <>
                    <li>• Adjust RGB channel mixing</li>
                    <li>• Real-time color transformation</li>
                    <li>• Professional color grading</li>
                  </>
                ) : (
                  <>
                    <li>• <strong>Basic:</strong> Grayscale, Sepia, Blur</li>
                    <li>• <strong>Enhance:</strong> Brightness, Contrast, Saturate</li>
                    <li>• <strong>Creative:</strong> Hue Rotate, Invert</li>
                    <li>• <strong>Vintage:</strong> Retro, Cool, Warm tones</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFilters;