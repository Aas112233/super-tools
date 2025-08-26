import React, { useState } from 'react';

export default function CssLoaderGenerator() {
  const [selectedLoader, setSelectedLoader] = useState('spinner');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [size, setSize] = useState(40);
  const [speed, setSpeed] = useState(1);

  const loaders = [
    { id: 'spinner', name: 'Spinner', description: 'Classic rotating spinner' },
    { id: 'dots', name: 'Dots', description: 'Three bouncing dots' },
    { id: 'pulse', name: 'Pulse', description: 'Pulsing circle' },
    { id: 'bars', name: 'Bars', description: 'Loading bars' },
    { id: 'ring', name: 'Ring', description: 'Rotating ring' },
    { id: 'wave', name: 'Wave', description: 'Wave animation' },
    { id: 'ripple', name: 'Ripple', description: 'Ripple effect loader' },
    { id: 'grid', name: 'Grid', description: '3x3 grid animation' },
    { id: 'heart', name: 'Heart', description: 'Beating heart loader' },
    { id: 'hourglass', name: 'Hourglass', description: 'Hourglass rotation' }
  ];

  const generateCSS = () => {
    const animations = {
      spinner: `
.loader {
  width: ${size}px;
  height: ${size}px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${primaryColor};
  border-radius: 50%;
  animation: spin ${2/speed}s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
      dots: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size * 2}px;
  height: ${size/2}px;
}

.loader div {
  position: absolute;
  top: 0;
  width: ${size/4}px;
  height: ${size/4}px;
  border-radius: 50%;
  background: ${primaryColor};
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: ${size/8}px;
  animation: dots1 ${1.2/speed}s infinite;
}

.loader div:nth-child(2) {
  left: ${size/8}px;
  animation: dots2 ${1.2/speed}s infinite;
}

.loader div:nth-child(3) {
  left: ${size/2.67}px;
  animation: dots2 ${1.2/speed}s infinite;
}

.loader div:nth-child(4) {
  left: ${size/1.6}px;
  animation: dots3 ${1.2/speed}s infinite;
}

@keyframes dots1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes dots3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}

@keyframes dots2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(${size/2.67}px, 0); }
}`,
      pulse: `
.loader {
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  background-color: ${primaryColor};
  border-radius: 100%;
  animation: pulse-scale ${1/speed}s infinite ease-in-out;
}

@keyframes pulse-scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1.0);
    opacity: 0;
  }
}`,
      bars: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader div {
  display: inline-block;
  position: absolute;
  left: ${size/10}px;
  width: ${size/8}px;
  background: ${primaryColor};
  animation: bars ${1.2/speed}s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.loader div:nth-child(1) {
  left: ${size/10}px;
  animation-delay: -${0.24/speed}s;
}

.loader div:nth-child(2) {
  left: ${size/3.33}px;
  animation-delay: -${0.12/speed}s;
}

.loader div:nth-child(3) {
  left: ${size/2}px;
  animation-delay: 0;
}

@keyframes bars {
  0% {
    top: ${size/10}px;
    height: ${size * 0.8}px;
  }
  50%, 100% {
    top: ${size/2.5}px;
    height: ${size/2.5}px;
  }
}`,
      ring: `
.loader {
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
}

.loader:after {
  content: " ";
  display: block;
  width: ${size * 0.8}px;
  height: ${size * 0.8}px;
  margin: ${size * 0.1}px;
  border-radius: 50%;
  border: ${size * 0.1}px solid ${primaryColor};
  border-color: ${primaryColor} transparent ${primaryColor} transparent;
  animation: ring ${1.2/speed}s linear infinite;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`,
      wave: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader div {
  position: absolute;
  top: ${size/2.5}px;
  width: ${size/8}px;
  height: ${size/8}px;
  border-radius: 50%;
  background: ${primaryColor};
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: ${size/10}px;
  animation: wave1 ${0.6/speed}s infinite;
}

.loader div:nth-child(2) {
  left: ${size/10}px;
  animation: wave2 ${0.6/speed}s infinite;
}

.loader div:nth-child(3) {
  left: ${size/2.5}px;
  animation: wave2 ${0.6/speed}s infinite;
}

.loader div:nth-child(4) {
  left: ${size/1.67}px;
  animation: wave3 ${0.6/speed}s infinite;
}

@keyframes wave1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes wave3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}

@keyframes wave2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(${size/2.5}px, 0); }
}`,
      ripple: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader div {
  position: absolute;
  border: 4px solid ${primaryColor};
  opacity: 1;
  border-radius: 50%;
  animation: ripple ${1/speed}s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.loader div:nth-child(2) {
  animation-delay: -${0.5/speed}s;
}

@keyframes ripple {
  0% {
    top: ${size/2.22}px;
    left: ${size/2.22}px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: ${size * 0.9}px;
    height: ${size * 0.9}px;
    opacity: 0;
  }
}`,
      grid: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader div {
  position: absolute;
  width: ${size/6}px;
  height: ${size/6}px;
  border-radius: 50%;
  background: ${primaryColor};
  animation: grid ${1.2/speed}s linear infinite;
}

.loader div:nth-child(1) { top: ${size/10}px; left: ${size/10}px; animation-delay: 0s; }
.loader div:nth-child(2) { top: ${size/10}px; left: ${size/2.5}px; animation-delay: -${0.4/speed}s; }
.loader div:nth-child(3) { top: ${size/10}px; left: ${size/1.43}px; animation-delay: -${0.8/speed}s; }
.loader div:nth-child(4) { top: ${size/2.5}px; left: ${size/10}px; animation-delay: -${0.4/speed}s; }
.loader div:nth-child(5) { top: ${size/2.5}px; left: ${size/2.5}px; animation-delay: -${0.8/speed}s; }
.loader div:nth-child(6) { top: ${size/2.5}px; left: ${size/1.43}px; animation-delay: -${1.2/speed}s; }
.loader div:nth-child(7) { top: ${size/1.43}px; left: ${size/10}px; animation-delay: -${0.8/speed}s; }
.loader div:nth-child(8) { top: ${size/1.43}px; left: ${size/2.5}px; animation-delay: -${1.2/speed}s; }
.loader div:nth-child(9) { top: ${size/1.43}px; left: ${size/1.43}px; animation-delay: -${1.6/speed}s; }

@keyframes grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}`,
      heart: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
  transform: rotate(45deg);
  transform-origin: ${size/2}px ${size/2}px;
}

.loader div {
  top: ${size/2.5}px;
  left: ${size/2.5}px;
  position: absolute;
  width: ${size/2.5}px;
  height: ${size/2.5}px;
  background: ${primaryColor};
  animation: heart ${1.2/speed}s infinite ease-in-out;
}

.loader div:after,
.loader div:before {
  content: ' ';
  position: absolute;
  display: block;
  width: ${size/2.5}px;
  height: ${size/2.5}px;
  background: ${primaryColor};
}

.loader div:before {
  left: -${size/3.57}px;
  border-radius: 50% 0 0 50%;
}

.loader div:after {
  top: -${size/3.57}px;
  border-radius: 50% 50% 0 0;
}

@keyframes heart {
  0% {
    transform: scale(0.95);
  }
  5% {
    transform: scale(1.1);
  }
  39% {
    transform: scale(0.85);
  }
  45% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0.9);
  }
}`,
      hourglass: `
.loader {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: ${size/10}px;
  box-sizing: border-box;
  border: ${size/2.5}px solid ${primaryColor};
  border-color: ${primaryColor} transparent ${primaryColor} transparent;
  animation: hourglass ${1.2/speed}s infinite;
}

@keyframes hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}`
    };

    return animations[selectedLoader as keyof typeof animations] || animations.spinner;
  };

  const generateHTML = () => {
    const htmlStructures = {
      spinner: '<div class="loader"></div>',
      dots: '<div class="loader"><div></div><div></div><div></div><div></div></div>',
      pulse: '<div class="loader"></div>',
      bars: '<div class="loader"><div></div><div></div><div></div></div>',
      ring: '<div class="loader"></div>',
      wave: '<div class="loader"><div></div><div></div><div></div><div></div></div>',
      ripple: '<div class="loader"><div></div><div></div></div>',
      grid: '<div class="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
      heart: '<div class="loader"><div></div></div>',
      hourglass: '<div class="loader"></div>'
    };

    return htmlStructures[selectedLoader as keyof typeof htmlStructures] || htmlStructures.spinner;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCode = () => {
    const css = generateCSS();
    const html = generateHTML();
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Loader</title>
    <style>
${css}
    </style>
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        ${html}
    </div>
</body>
</html>`;

    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedLoader}-loader.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>CSS Loader Generator</h1>
        <p>Create beautiful loading animations with customizable CSS</p>
      </div>
      <div className="css-loader-layout">
        <div className="loader-preview-section">
          <div className="preview-container">
            <h3>Preview</h3>
            <div className="loader-preview">
              <div 
                className="loader-demo"
                dangerouslySetInnerHTML={{ __html: generateHTML() }}
              />
              <style dangerouslySetInnerHTML={{ __html: generateCSS() }} />
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
        <div className="loader-controls-section">
          <div className="loader-controls-header">
            <h3>Loader Settings</h3>
            <p>Customize your loading animation</p>
          </div>
          <div className="loader-controls">
            <div className="control-group">
              <label>Loader Type:</label>
              <div className="loader-types">
                {loaders.map(loader => (
                  <button
                    key={loader.id}
                    className={`loader-type-btn ${selectedLoader === loader.id ? 'active' : ''}`}
                    onClick={() => setSelectedLoader(loader.id)}
                  >
                    <span className="loader-name">{loader.name}</span>
                    <span className="loader-desc">{loader.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label>Primary Color:</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="color-text"
                />
              </div>
            </div>
            <div className="control-group">
              <label>Size: {size}px</label>
              <input
                type="range"
                min="20"
                max="100"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Speed: {speed}x</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => copyToClipboard(generateHTML())}>
                📋 Copy HTML
              </button>
              <button className="action-btn primary" onClick={downloadCode}>
                📥 Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};