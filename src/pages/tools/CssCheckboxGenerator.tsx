import React, { useState } from 'react';

export default function CssCheckboxGenerator() {
  const [selectedCheckbox, setSelectedCheckbox] = useState('check-a');
  const [primaryColor, setPrimaryColor] = useState('#4CAF50');
  const [uncheckedColor, setUncheckedColor] = useState('#ccc');
  const [size, setSize] = useState(24);
  const [isChecked, setIsChecked] = useState(true);

  const checkboxes = [
    { id: 'check-a', name: 'Check A', description: 'Animated checkmark' },
    { id: 'check-b', name: 'Check B', description: 'Bouncing background' },
    { id: 'check-c', name: 'Check C', description: 'Filled background' },
    { id: 'check-d', name: 'Check D', description: 'Scale animation' },
    { id: 'material', name: 'Material', description: 'Material Design style' },
    { id: 'ios', name: 'iOS', description: 'Apple iOS style' },
    { id: 'toggle', name: 'Toggle', description: 'Toggle switch style' },
    { id: 'round', name: 'Round', description: 'Circular checkbox' }
  ];

  const generateCSS = () => {
    const animations = {
      'check-a': `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${uncheckedColor};
  transition: all 0.2s ease-in-out;
}

.checkbox-container input:checked ~ .checkmark {
  border-color: ${primaryColor};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid ${primaryColor};
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  animation: checkmark 0.4s ease-in-out;
}

@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
  }
  50% {
    height: 0;
    width: 0.25em;
  }
  100% {
    height: 0.5em;
    width: 0.25em;
  }
}`,
      'check-b': `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${uncheckedColor};
  border-radius: 0.125em;
  transition: all 0.2s ease-in-out;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
  animation: bounce 0.5s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}`,
      'check-c': `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: ${uncheckedColor};
  border-radius: 0.125em;
  transition: all 0.2s ease-in-out;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
  animation: bounce 0.5s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.checkmark:after {
  content: "";
  position: absolute;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}`,
      'check-d': `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${uncheckedColor};
  border-radius: 0.125em;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
  transform: scale(1.1);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  animation: scale-in 0.3s ease;
}

@keyframes scale-in {
  0% {
    transform: rotate(45deg) scale(0);
  }
  100% {
    transform: rotate(45deg) scale(1);
  }
}`,
      material: `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: transparent;
  border: 2px solid ${uncheckedColor};
  border-radius: 2px;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.3em;
  top: 0.1em;
  width: 0.2em;
  height: 0.4em;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}`,
      ios: `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 1px solid ${uncheckedColor};
  border-radius: 50%;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.2em;
  height: 0.4em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}`,
      toggle: `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 2em;
  background-color: ${uncheckedColor};
  border-radius: 1em;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
}

.checkmark:after {
  content: "";
  position: absolute;
  top: 0.1em;
  left: 0.1em;
  width: 0.8em;
  height: 0.8em;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark:after {
  transform: translateX(1em);
}`,
      round: `
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${size}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${uncheckedColor};
  border-radius: 50%;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.2em;
  height: 0.4em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}`
    };

    return animations[selectedCheckbox as keyof typeof animations] || animations['check-a'];
  };

  const generateHTML = () => {
    return `<label class="checkbox-container">
  <input type="checkbox"${isChecked ? ' checked' : ''}>
  <span class="checkmark"></span>
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
    <title>CSS Checkbox</title>
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
    link.download = `${selectedCheckbox}-checkbox.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>CSS Checkbox Generator</h1>
        <p>Create beautiful custom checkboxes inspired by Checkbox.css</p>
      </div>
      <div className="css-checkbox-layout">
        <div className="checkbox-preview-section">
          <div className="preview-container">
            <h3>Preview</h3>
            <div className="checkbox-preview">
              <label className="checkbox-demo">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className="checkmark-demo"></span>
              </label>
              <style dangerouslySetInnerHTML={{ 
                __html: generateCSS().replace(/\.checkbox-container/g, '.checkbox-demo').replace(/\.checkmark/g, '.checkmark-demo')
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
        <div className="checkbox-controls-section">
          <div className="checkbox-controls-header">
            <h3>Checkbox Settings</h3>
            <p>Customize your checkbox design</p>
          </div>
          <div className="checkbox-controls">
            <div className="control-group">
              <label>Checkbox Style:</label>
              <div className="checkbox-types">
                {checkboxes.map(checkbox => (
                  <button
                    key={checkbox.id}
                    className={`checkbox-type-btn ${selectedCheckbox === checkbox.id ? 'active' : ''}`}
                    onClick={() => setSelectedCheckbox(checkbox.id)}
                  >
                    <span className="checkbox-name">{checkbox.name}</span>
                    <span className="checkbox-desc">{checkbox.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label>Checked Color:</label>
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
              <label>Unchecked Color:</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={uncheckedColor}
                  onChange={(e) => setUncheckedColor(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={uncheckedColor}
                  onChange={(e) => setUncheckedColor(e.target.value)}
                  className="color-text"
                />
              </div>
            </div>
            <div className="control-group">
              <label>Size: {size}px</label>
              <input
                type="range"
                min="16"
                max="48"
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