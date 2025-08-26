import React, { useState } from 'react';

export default function CssClipPathGenerator() {
  const [selectedShape, setSelectedShape] = useState('triangle');
  const [clipPath, setClipPath] = useState('polygon(50% 0%, 0% 100%, 100% 100%)');

  const shapes = [
    { id: 'triangle', name: 'Triangle', path: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { id: 'trapezoid', name: 'Trapezoid', path: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' },
    { id: 'parallelogram', name: 'Parallelogram', path: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
    { id: 'rhombus', name: 'Rhombus', path: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    { id: 'pentagon', name: 'Pentagon', path: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
    { id: 'hexagon', name: 'Hexagon', path: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
    { id: 'octagon', name: 'Octagon', path: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
    { id: 'star', name: 'Star', path: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
    { id: 'circle', name: 'Circle', path: 'circle(50% at 50% 50%)' },
    { id: 'ellipse', name: 'Ellipse', path: 'ellipse(25% 40% at 50% 50%)' },
    { id: 'inset', name: 'Inset', path: 'inset(10% 20% 30% 40%)' },
    { id: 'left-arrow', name: 'Left Arrow', path: 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)' },
    { id: 'right-arrow', name: 'Right Arrow', path: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
    { id: 'cross', name: 'Cross', path: 'polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)' },
    { id: 'message', name: 'Message', path: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
    { id: 'close', name: 'Close', path: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)' }
  ];

  const handleShapeSelect = (shape: any) => {
    setSelectedShape(shape.id);
    setClipPath(shape.path);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCSS = () => {
    return `.clipped-element {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  clip-path: ${clipPath};
  -webkit-clip-path: ${clipPath};
}`;
  };

  const generateHTML = () => {
    return `<div class="clipped-element"></div>`;
  };

  const downloadCode = () => {
    const css = generateCSS();
    const html = generateHTML();
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Clip Path</title>
    <style>
${css}

/* Center the demo */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f0f0f0;
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
    link.download = `${selectedShape}-clip-path.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>CSS Clip Path Generator</h1>
        <p>Create complex shapes with CSS clip-path property inspired by Clippy</p>
      </div>
      <div className="css-clippath-layout">
        <div className="clippath-preview-section">
          <div className="preview-container">
            <h3>Preview</h3>
            <div className="clippath-preview">
              <div 
                className="clipped-demo"
                style={{
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  clipPath: clipPath,
                  WebkitClipPath: clipPath
                }}
              />
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
        <div className="clippath-controls-section">
          <div className="clippath-controls-header">
            <h3>Clip Path Shapes</h3>
            <p>Choose from predefined shapes</p>
          </div>
          <div className="clippath-controls">
            <div className="control-group">
              <label>Current Clip Path:</label>
              <div className="clippath-input-group">
                <input
                  type="text"
                  value={clipPath}
                  onChange={(e) => setClipPath(e.target.value)}
                  className="clippath-input"
                  placeholder="Enter custom clip-path value"
                />
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(`clip-path: ${clipPath};`)}
                >
                  📋
                </button>
              </div>
            </div>
            <div className="control-group">
              <label>Shape Library:</label>
              <div className="shape-grid">
                {shapes.map(shape => (
                  <button
                    key={shape.id}
                    className={`shape-btn ${selectedShape === shape.id ? 'active' : ''}`}
                    onClick={() => handleShapeSelect(shape)}
                    title={shape.path}
                  >
                    <div 
                      className="shape-preview"
                      style={{
                        clipPath: shape.path,
                        WebkitClipPath: shape.path
                      }}
                    />
                    <span className="shape-name">{shape.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => copyToClipboard(generateHTML())}>
                📋 Copy HTML
              </button>
              <button className="action-btn primary" onClick={downloadCode}>
                📥 Download
              </button>
            </div>
            <div className="clippath-info">
              <h4>Clip Path Types:</h4>
              <ul>
                <li>• <strong>Polygon:</strong> Complex shapes with multiple points</li>
                <li>• <strong>Circle:</strong> Perfect circles with radius and position</li>
                <li>• <strong>Ellipse:</strong> Oval shapes with custom dimensions</li>
                <li>• <strong>Inset:</strong> Rectangular cutouts with rounded corners</li>
              </ul>
              <p><strong>Browser Support:</strong> Modern browsers support clip-path. Use -webkit-clip-path for older WebKit browsers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};