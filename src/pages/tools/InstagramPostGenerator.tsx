import React, { useState, useRef } from 'react';
import { Download, Upload, Type, Palette, Image as ImageIcon } from 'lucide-react';

export const InstagramPostGenerator: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [text, setText] = useState('Your text here');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Courier New', 'Lucida Console'
  ];

  const gradients = [
    { name: 'Sunset', value: 'linear-gradient(45deg, #ff6b6b, #feca57)' },
    { name: 'Ocean', value: 'linear-gradient(45deg, #74b9ff, #0984e3)' },
    { name: 'Forest', value: 'linear-gradient(45deg, #00b894, #00cec9)' },
    { name: 'Purple', value: 'linear-gradient(45deg, #a29bfe, #6c5ce7)' },
    { name: 'Pink', value: 'linear-gradient(45deg, #fd79a8, #e84393)' },
    { name: 'Dark', value: 'linear-gradient(45deg, #2d3436, #636e72)' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePost = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1080, 1080);
        drawText(ctx);
      };
      img.src = backgroundImage;
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, 1080, 1080);
      drawText(ctx);
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize * 2}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better readability
    ctx.shadowColor = textColor === '#ffffff' ? '#000000' : '#ffffff';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    const x = (textPosition.x / 100) * 1080;
    const y = (textPosition.y / 100) * 1080;
    
    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = fontSize * 2.2;
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + (index * lineHeight));
    });
  };

  React.useEffect(() => {
    generatePost();
  }, [backgroundImage, backgroundColor, text, textColor, fontSize, fontFamily, textPosition]);

  const downloadPost = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'instagram-post.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const applyGradient = (gradient: string) => {
    // Create a temporary canvas to generate gradient
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 100;
    tempCanvas.height = 100;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    const grad = tempCtx.createLinearGradient(0, 0, 100, 100);
    if (gradient.includes('#ff6b6b')) {
      grad.addColorStop(0, '#ff6b6b');
      grad.addColorStop(1, '#feca57');
    } else if (gradient.includes('#74b9ff')) {
      grad.addColorStop(0, '#74b9ff');
      grad.addColorStop(1, '#0984e3');
    } else if (gradient.includes('#00b894')) {
      grad.addColorStop(0, '#00b894');
      grad.addColorStop(1, '#00cec9');
    } else if (gradient.includes('#a29bfe')) {
      grad.addColorStop(0, '#a29bfe');
      grad.addColorStop(1, '#6c5ce7');
    } else if (gradient.includes('#fd79a8')) {
      grad.addColorStop(0, '#fd79a8');
      grad.addColorStop(1, '#e84393');
    } else {
      grad.addColorStop(0, '#2d3436');
      grad.addColorStop(1, '#636e72');
    }
    
    tempCtx.fillStyle = grad;
    tempCtx.fillRect(0, 0, 100, 100);
    setBackgroundImage(tempCanvas.toDataURL());
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Instagram Post Creator</h1>
        <p>Create stunning 1080x1080 Instagram posts with custom text and backgrounds</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '400px', 
              height: '400px', 
              margin: '0 auto',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: backgroundColor,
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  fontFamily: fontFamily,
                  textAlign: 'center',
                  textShadow: textColor === '#ffffff' ? '2px 2px 4px #000000' : '2px 2px 4px #ffffff',
                  position: 'absolute',
                  left: `${textPosition.x}%`,
                  top: `${textPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  whiteSpace: 'pre-line',
                  maxWidth: '90%',
                  wordWrap: 'break-word'
                }}
              >
                {text}
              </div>
            </div>
            
            <button
              onClick={downloadPost}
              className="case-btn active"
              style={{ 
                marginTop: '1rem',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '1rem auto 0'
              }}
            >
              <Download className="w-4 h-4" />
              Download Post (1080x1080)
            </button>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Type className="w-4 h-4" />
              Text Settings
            </h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <label>Text Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text..."
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  marginTop: '0.5rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </div>
              <div>
                <label>Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '100%', height: '40px', marginTop: '0.5rem', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  marginTop: '0.5rem'
                }}
              >
                {fonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Horizontal: {textPosition.x}%</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={textPosition.x}
                  onChange={(e) => setTextPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </div>
              <div>
                <label>Vertical: {textPosition.y}%</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={textPosition.y}
                  onChange={(e) => setTextPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Palette className="w-4 h-4" />
              Background
            </h4>

            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="case-btn"
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                style={{ width: '100%', height: '40px', marginTop: '0.5rem', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label>Gradient Presets</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                {gradients.map(gradient => (
                  <button
                    key={gradient.name}
                    onClick={() => applyGradient(gradient.value)}
                    className="case-btn"
                    style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                  >
                    {gradient.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => {
                  setBackgroundImage(null);
                  setBackgroundColor('#ffffff');
                }}
                className="case-btn"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Clear Background
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};