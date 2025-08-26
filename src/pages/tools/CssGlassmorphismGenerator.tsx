import React, { useState } from 'react';

export default function CssGlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [transparency, setTransparency] = useState(0.25);
  const [borderRadius, setBorderRadius] = useState(10);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderOpacity, setBorderOpacity] = useState(0.18);
  const [shadowIntensity, setShadowIntensity] = useState(0.8);

  const generateCSS = () => {
    return `.glass {
  background: rgba(255, 255, 255, ${transparency});
  border-radius: ${borderRadius}px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, ${shadowIntensity / 10});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: ${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity});
}`;
  };

  const generateHTML = () => {
    return `<div class="glass">
  <h2>Glassmorphism Card</h2>
  <p>This is a beautiful glass effect created with CSS backdrop-filter and transparency.</p>
</div>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetSettings = () => {
    setBlur(16);
    setTransparency(0.25);
    setBorderRadius(10);
    setBorderWidth(1);
    setBorderOpacity(0.18);
    setShadowIntensity(0.8);
  };

  const downloadCode = () => {
    const css = generateCSS();
    const html = generateHTML();
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glassmorphism Effect</title>
    <style>
body {
  margin: 0;
  padding: 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

${css}

.glass {
  padding: 40px;
  max-width: 400px;
  text-align: center;
}

.glass h2 {
  margin: 0 0 20px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 24px;
}

.glass p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'glassmorphism-effect.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>CSS Glassmorphism Generator</h1>
        <p>Create beautiful glass morphism effects with backdrop-filter</p>
      </div>
      <div className="css-glassmorphism-layout">
        <div className="glassmorphism-preview-section">
          <div className="preview-container">
            <h3>Preview</h3>
            <div 
            className="glassmorphism-preview"
            style={{
              backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1661882403999-46081e67c401?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
              <div 
                className="glass-demo"
                style={{
                  background: `rgba(255, 255, 255, ${transparency})`,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `0 4px 30px rgba(0, 0, 0, ${shadowIntensity / 10})`,
                  backdropFilter: `blur(${blur}px)`,
                  WebkitBackdropFilter: `blur(${blur}px)`,
                  border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
                  padding: '40px',
                  maxWidth: '350px',
                  minHeight: '200px',
                  textAlign: 'center'
                }}
              >
                <h1 style={{ margin: '0 0 10px 0', color: 'rgba(255, 255, 255, 0.95)', fontSize: '28px', fontWeight: '700', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Glassmorphism
                </h1>
                <h2 style={{ margin: '0 0 15px 0', color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Modern UI Design
                </h2>
                <p style={{ margin: '0 0 12px 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Beautiful glass morphism effect with backdrop blur, transparency, and subtle borders.
                </p>
                <small style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontStyle: 'italic', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Perfect for modern web interfaces
                </small>
              </div>
            </div>
          </div>
          <div className="code-section">
            <div className="code-tabs">
              <button className="code-tab active">CSS</button>
              <button className="code-tab">HTML</button>
            </div>
            <div className="code-content">
              <pre className="code-block">
                <code>{generateCSS()}</code>
              </pre>
              <button 
                className="copy-code-btn"
                onClick={() => copyToClipboard(generateCSS())}
              >
                📋 Copy CSS
              </button>
            </div>
          </div>
        </div>
        <div className="glassmorphism-controls-section">
          <div className="glassmorphism-controls-header">
            <h3>Glass Settings</h3>
            <p>Adjust glassmorphism properties</p>
          </div>
          <div className="glassmorphism-controls">
            <div className="control-group">
              <label>Blur: {blur}px</label>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Transparency: {transparency}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={transparency}
                onChange={(e) => setTransparency(parseFloat(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Border Radius: {borderRadius}px</label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Border Width: {borderWidth}px</label>
              <input
                type="range"
                min="0"
                max="5"
                value={borderWidth}
                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Border Opacity: {borderOpacity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Shadow Intensity: {shadowIntensity}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={shadowIntensity}
                onChange={(e) => setShadowIntensity(parseFloat(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => copyToClipboard(generateHTML())}>
                📋 Copy HTML
              </button>
              <button className="action-btn" onClick={resetSettings}>
                🔄 Reset
              </button>
              <button className="action-btn primary" onClick={downloadCode}>
                📥 Download
              </button>
            </div>
            <div className="glassmorphism-info">
              <h4>Glassmorphism Properties:</h4>
              <ul>
                <li>• <strong>Backdrop Filter:</strong> Creates the blur effect</li>
                <li>• <strong>Transparency:</strong> Controls background opacity</li>
                <li>• <strong>Border:</strong> Semi-transparent border for depth</li>
                <li>• <strong>Box Shadow:</strong> Adds depth and elevation</li>
              </ul>
              <p><strong>Browser Support:</strong> Modern browsers support backdrop-filter. Use -webkit-backdrop-filter for Safari.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};