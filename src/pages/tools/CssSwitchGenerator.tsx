import React, { useState } from 'react';

export const CssSwitchGenerator: React.FC = () => {
  const [selectedSwitch, setSelectedSwitch] = useState('normal');
  const [primaryColor, setPrimaryColor] = useState('#40bfc1');
  const [secondaryColor, setSecondaryColor] = useState('#f0134d');
  const [size, setSize] = useState(50);
  const [isChecked, setIsChecked] = useState(true);

  const switches = [
    { id: 'normal', name: 'Normal', description: 'MoreToggles normal style' },
    { id: 'ios', name: 'iOS', description: 'Apple iOS style toggle' },
    { id: 'android', name: 'Android', description: 'Material Android style' },
    { id: 'square', name: 'Square', description: 'Square toggle switch' },
    { id: 'heart', name: 'Heart', description: 'Heart-shaped toggle' },
    { id: 'star', name: 'Star', description: 'Star-shaped toggle' },
    { id: 'emoji', name: 'Emoji', description: 'Emoji toggle switch' },
    { id: 'transparent', name: 'Transparent', description: 'Transparent style' }
  ];

  const generateCSS = () => {
    const animations = {
      normal: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 2.33}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${secondaryColor};
  border-radius: ${size * 0.5}px;
  border: 1px solid rgba(117, 117, 117, 0.31);
  box-shadow: inset 0px 0px ${size * 0.08}px 0px rgba(0, 0, 0, 0.2), 0 -${size * 0.06}px ${size * 0.08}px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  top: ${size * 0.08}px;
  left: ${size * 0.08}px;
  width: ${size * 0.83}px;
  height: ${size * 0.83}px;
  border-radius: ${size * 0.67}px;
  background: #fff;
  box-shadow: inset 1px -2px 2px rgba(0, 0, 0, 0.35);
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: -${size * 0.1}px;
  left: -${size * 0.08}px;
  width: calc(100% + ${size * 0.17}px);
  height: calc(100% + ${size * 0.17}px);
  background: transparent;
  border-radius: ${size}px;
  box-shadow: inset 0px ${size * 0.04}px ${size * 0.08}px -${size * 0.04}px rgba(0, 0, 0, 0.2), 0px ${size * 0.03}px ${size * 0.04}px 0px rgba(151, 151, 151, 0.2);
}

input:checked + .slider {
  background: ${primaryColor};
}

input:checked + .slider:before {
  transform: translateX(${size * 1.4}px);
}`,
      ios: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 1.67}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f8f8;
  border-radius: ${size * 0.5}px;
  box-shadow: inset 0 0 0 0px ${primaryColor}, 0 0 0 ${size * 0.06}px #dddddd;
  transition: 0.25s ease-in-out;
}

.slider:before {
  position: absolute;
  content: "";
  width: ${size}px;
  height: ${size}px;
  border-radius: ${size * 0.5}px;
  background: #fff;
  box-shadow: 0 ${size * 0.125}px ${size * 0.125}px rgba(0, 0, 0, 0.2), 0 0 0 ${size * 0.06}px #dddddd;
  transition: 0.25s ease-in-out;
}

input:checked + .slider {
  box-shadow: inset 0 0 0 ${size * 0.5}px ${primaryColor}, 0 0 0 ${size * 0.06}px ${primaryColor};
}

input:checked + .slider:before {
  transform: translateX(${size * 0.67}px);
  box-shadow: 0 0 0 ${size * 0.06}px transparent, 0 ${size * 0.125}px ${size * 0.125}px rgba(0, 0, 0, 0.3);
}`,
      android: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 1.33}px;
  height: ${size * 0.58}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #848484 0%, #848484 50%, ${primaryColor} 50%, ${primaryColor} 100%);
  background-size: ${size * 2.67}px ${size * 0.57}px;
  border-radius: ${size * 0.29}px;
  transition: all 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  width: ${size * 0.75}px;
  height: ${size * 0.75}px;
  top: -${size * 0.08}px;
  left: 0;
  border-radius: ${size * 0.67}px;
  background: #fff;
  box-shadow: 0 ${size * 0.04}px ${size * 0.125}px rgba(0, 0, 0, 0.5);
  transition: 0.3s ease;
}

input:checked + .slider {
  background-position: -100%;
}

input:checked + .slider:before {
  transform: translateX(${size * 0.58}px);
}`,
      square: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 2}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${secondaryColor};
  border-radius: ${size * 0.1}px;
  transition: 0.3s ease;
  border: 2px solid #ddd;
}

.slider:before {
  position: absolute;
  content: "";
  top: ${size * 0.05}px;
  left: ${size * 0.05}px;
  width: ${size * 0.85}px;
  height: ${size * 0.85}px;
  border-radius: ${size * 0.05}px;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${primaryColor};
  border-color: ${primaryColor};
}

input:checked + .slider:before {
  transform: translateX(${size * 0.95}px);
}`,
      heart: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 2}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${secondaryColor};
  border-radius: ${size * 0.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "♡";
  top: 50%;
  left: ${size * 0.2}px;
  transform: translateY(-50%);
  font-size: ${size * 0.6}px;
  color: #fff;
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: ${size * 0.1}px;
  left: ${size * 0.1}px;
  width: ${size * 0.8}px;
  height: ${size * 0.8}px;
  border-radius: 50%;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${primaryColor};
}

input:checked + .slider:before {
  content: "♥";
  left: ${size * 1.2}px;
}

input:checked + .slider:after {
  transform: translateX(${size}px);
}`,
      star: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 2}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${secondaryColor};
  border-radius: ${size * 0.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "☆";
  top: 50%;
  left: ${size * 0.2}px;
  transform: translateY(-50%);
  font-size: ${size * 0.6}px;
  color: #fff;
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: ${size * 0.1}px;
  left: ${size * 0.1}px;
  width: ${size * 0.8}px;
  height: ${size * 0.8}px;
  border-radius: 50%;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${primaryColor};
}

input:checked + .slider:before {
  content: "★";
  left: ${size * 1.2}px;
}

input:checked + .slider:after {
  transform: translateX(${size}px);
}`,
      emoji: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 2}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${secondaryColor};
  border-radius: ${size * 0.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "😴";
  top: 50%;
  left: ${size * 0.15}px;
  transform: translateY(-50%);
  font-size: ${size * 0.5}px;
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: ${size * 0.1}px;
  left: ${size * 0.1}px;
  width: ${size * 0.8}px;
  height: ${size * 0.8}px;
  border-radius: 50%;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${primaryColor};
}

input:checked + .slider:before {
  content: "😊";
  left: ${size * 1.05}px;
}

input:checked + .slider:after {
  transform: translateX(${size}px);
}`,
      transparent: `
.switch {
  position: relative;
  display: inline-block;
  width: ${size * 2}px;
  height: ${size}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  border: 2px solid ${secondaryColor};
  border-radius: ${size * 0.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  top: ${size * 0.05}px;
  left: ${size * 0.05}px;
  width: ${size * 0.85}px;
  height: ${size * 0.85}px;
  border-radius: 50%;
  background: ${secondaryColor};
  transition: 0.3s ease;
}

input:checked + .slider {
  border-color: ${primaryColor};
}

input:checked + .slider:before {
  background: ${primaryColor};
  transform: translateX(${size * 0.95}px);
}`
    };

    return animations[selectedSwitch as keyof typeof animations] || animations.normal;
  };

  const generateHTML = () => {
    return `<label class="switch">
  <input type="checkbox"${isChecked ? ' checked' : ''}>
  <span class="slider"></span>
</label>`;
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
    <title>CSS Toggle Switch</title>
    <style>
${css}
    </style>
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f3f4f6;">
        ${html}
    </div>
</body>
</html>`;

    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedSwitch}-switch.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>CSS Switch Generator</h1>
        <p>Create beautiful toggle switches inspired by MoreToggles.css</p>
      </div>
      <div className="css-switch-layout">
        <div className="switch-preview-section">
          <div className="preview-container">
            <h3>Preview</h3>
            <div className="switch-preview">
              <label className="switch-demo">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className="slider-demo"></span>
              </label>
              <style dangerouslySetInnerHTML={{ 
                __html: generateCSS().replace(/\.switch/g, '.switch-demo').replace(/\.slider/g, '.slider-demo')
              }} />
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
        <div className="switch-controls-section">
          <div className="switch-controls-header">
            <h3>Switch Settings</h3>
            <p>Customize your toggle switch</p>
          </div>
          <div className="switch-controls">
            <div className="control-group">
              <label>Switch Style:</label>
              <div className="switch-types">
                {switches.map(switchType => (
                  <button
                    key={switchType.id}
                    className={`switch-type-btn ${selectedSwitch === switchType.id ? 'active' : ''}`}
                    onClick={() => setSelectedSwitch(switchType.id)}
                  >
                    <span className="switch-name">{switchType.name}</span>
                    <span className="switch-desc">{switchType.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label>Primary Color (ON):</label>
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
              <label>Secondary Color (OFF):</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="color-text"
                />
              </div>
            </div>
            <div className="control-group">
              <label>Size: {size}px</label>
              <input
                type="range"
                min="20"
                max="80"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
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