import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon } from 'lucide-react';

const InstagramFilters: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { name: 'none', label: 'Original', filter: 'none' },
    { name: 'aden', label: 'Aden', filter: 'sepia(0.2) brightness(1.15) contrast(0.9)' },
    { name: 'brooklyn', label: 'Brooklyn', filter: 'contrast(0.9) brightness(1.1)' },
    { name: 'clarendon', label: 'Clarendon', filter: 'contrast(1.2) saturate(1.35)' },
    { name: 'earlybird', label: 'Earlybird', filter: 'contrast(0.9) sepia(0.2)' },
    { name: 'gingham', label: 'Gingham', filter: 'brightness(1.05) hue-rotate(-10deg)' },
    { name: 'hudson', label: 'Hudson', filter: 'brightness(1.2) contrast(0.9) saturate(1.1)' },
    { name: 'inkwell', label: 'Inkwell', filter: 'sepia(0.3) contrast(1.1) brightness(1.1) grayscale(1)' },
    { name: 'juno', label: 'Juno', filter: 'sepia(0.2) contrast(1.2) brightness(1.1)' },
    { name: 'lark', label: 'Lark', filter: 'brightness(1.1) contrast(0.9)' },
    { name: 'ludwig', label: 'Ludwig', filter: 'brightness(1.05) saturate(2)' },
    { name: 'maven', label: 'Maven', filter: 'sepia(0.25) brightness(0.95) contrast(0.95)' },
    { name: 'mayfair', label: 'Mayfair', filter: 'contrast(1.1) saturate(1.1)' },
    { name: 'moon', label: 'Moon', filter: 'grayscale(1) contrast(1.1) brightness(1.1)' },
    { name: 'nashville', label: 'Nashville', filter: 'sepia(0.2) contrast(1.2) brightness(1.05) saturate(1.2)' },
    { name: 'perpetua', label: 'Perpetua', filter: 'brightness(1.05) contrast(1.05)' },
    { name: 'reyes', label: 'Reyes', filter: 'sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)' },
    { name: 'rise', label: 'Rise', filter: 'brightness(1.05) sepia(0.2) contrast(0.9)' },
    { name: 'sierra', label: 'Sierra', filter: 'contrast(0.95) saturate(0.75)' },
    { name: 'slumber', label: 'Slumber', filter: 'brightness(1.05) saturate(0.66)' },
    { name: 'stinson', label: 'Stinson', filter: 'contrast(0.75) brightness(1.15) saturate(0.85)' },
    { name: 'toaster', label: 'Toaster', filter: 'contrast(1.5) brightness(0.9)' },
    { name: 'valencia', label: 'Valencia', filter: 'contrast(1.08) brightness(1.08) sepia(0.08)' },
    { name: 'walden', label: 'Walden', filter: 'brightness(1.1) hue-rotate(-10deg) sepia(0.3) saturate(1.6)' },
    { name: 'willow', label: 'Willow', filter: 'grayscale(0.5) contrast(0.95) brightness(0.9)' },
    { name: 'xpro2', label: 'X-Pro II', filter: 'sepia(0.3)' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilterToCanvas = () => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      const filter = filters.find(f => f.name === selectedFilter);
      if (filter) {
        ctx.filter = filter.filter;
      }
      
      ctx.drawImage(img, 0, 0);
    };
    img.src = selectedImage;
  };

  useEffect(() => {
    applyFilterToCanvas();
  }, [selectedImage, selectedFilter]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `filtered-image-${selectedFilter}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const resetImage = () => {
    setSelectedImage(null);
    setSelectedFilter('none');
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Instagram Filter Effects</h1>
        <p>Apply popular Instagram-style filters to your images</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-tertiary)',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <h3>Upload an Image</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Click here or drag and drop your image
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '12px',
                    filter: filters.find(f => f.name === selectedFilter)?.filter || 'none'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={downloadImage}
                  className="case-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={resetImage}
                  className="case-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="case-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                  <ImageIcon className="w-4 h-4" />
                  New Image
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon className="w-5 h-5" />
            Instagram Filters
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name)}
                className={`case-btn ${selectedFilter === filter.name ? 'active' : ''}`}
                style={{ 
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  textAlign: 'center'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <h4>Popular Filters:</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Clarendon:</strong> High contrast and vibrant</li>
              <li><strong>Juno:</strong> Warm and bright</li>
              <li><strong>Ludwig:</strong> Bright and saturated</li>
              <li><strong>Valencia:</strong> Warm and faded</li>
              <li><strong>X-Pro II:</strong> Vintage and dramatic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramFilters;