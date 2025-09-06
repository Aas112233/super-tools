import React, { useState } from 'react';
import { Copy, Check, Code, Palette, Settings } from 'lucide-react';

export default function CssFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState('2');
  const [uppercaseColors, setUppercaseColors] = useState(false);
  const [leadingZero, setLeadingZero] = useState(false);

  const formatCSS = () => {
    if (!input.trim()) return;
    // Basic CSS formatting logic would go here
    setOutput(input); // Placeholder
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">🎨 CSS Formatter</h1>
        <p className="tool-subtitle">Format and prettify your CSS code with proper indentation and structure</p>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">📝 Input & Preview</h2>
            <p className="section-subtitle">Paste your CSS code and see it formatted beautifully</p>
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon"><Code className="w-4 h-4" /></span>
              <span className="label-text">CSS Code</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="body {\n  margin: 0; padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n.container { width: 100%; max-width: 1200px; margin: 0 auto; }\n\n.header { background: #333; color: white; padding: 1rem; }"
              className="enhanced-textarea"
              rows={12}
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
            <div className="text-counter">{input.length} characters</div>
          </div>

          <div className="preview-section">
            <label className="preview-label">
              <span className="label-icon"><Palette className="w-4 h-4" /></span>
              <span className="label-text">Formatted Output</span>
              <div className="preview-tags">
                <span className="preview-tag">✨ Beautified</span>
                <span className="preview-tag">📐 {indentSize} spaces</span>
              </div>
            </label>
            <div className="preview-container">
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Formatted CSS will appear here...\n\nClick 'Format CSS' to beautify your code!"
                  className="enhanced-textarea"
                  rows={12}
                  style={{ 
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className={`copy-btn ${copied ? 'copied' : ''} ${!output ? 'disabled' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.5rem',
                    minWidth: 'auto'
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className={`action-btn primary ${!input.trim() ? 'disabled' : ''}`}
                onClick={formatCSS}
                disabled={!input.trim()}
              >
                <span className="btn-icon">✨</span>
                <span className="btn-text">Format CSS</span>
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={clearAll}
              >
                <span className="btn-icon">🗑️</span>
                <span className="btn-text">Clear All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2 className="section-title">⚙️ Formatting Options</h2>
            <p className="section-subtitle">Customize your CSS formatting preferences</p>
          </div>

          <div className="controls-wrapper">
            <div className="control-group enhanced">
              <label className="control-label">
                <span className="control-icon"><Settings className="w-4 h-4" /></span>
                <span className="control-title">Indentation</span>
              </label>
              
              <div className="style-controls">
                <div className="control-item">
                  <label className="control-item-label">Indent Size:</label>
                  <select 
                    value={indentSize} 
                    onChange={(e) => setIndentSize(e.target.value)} 
                    className="styled-select"
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="tab">Tab</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="control-group enhanced">
              <label className="control-label">
                <span className="control-icon">🎨</span>
                <span className="control-title">Color Options</span>
              </label>
              
              <div className="style-controls">
                <div className="control-item checkbox-item">
                  <input 
                    type="checkbox" 
                    id="uppercase-colors" 
                    checked={uppercaseColors}
                    onChange={(e) => setUppercaseColors(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <label htmlFor="uppercase-colors" className="checkbox-label">
                    Uppercase hex colors (#FF0000)
                  </label>
                </div>
                
                <div className="control-item checkbox-item">
                  <input 
                    type="checkbox" 
                    id="leading-zero" 
                    checked={leadingZero}
                    onChange={(e) => setLeadingZero(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <label htmlFor="leading-zero" className="checkbox-label">
                    Add leading zero (0.5 → 0.5)
                  </label>
                </div>
              </div>
            </div>

            {/* CSS Statistics */}
            {input && (
              <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
                <label className="control-label">
                  <span className="control-icon">📊</span>
                  <span className="control-title">CSS Statistics</span>
                </label>
                <div className="text-stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">{input.length}</span>
                    <span className="stat-label">Characters</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{input.split('\n').length}</span>
                    <span className="stat-label">Lines</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{(input.match(/{/g) || []).length}</span>
                    <span className="stat-label">Rules</span>
                  </div>
                </div>
              </div>
            )}

            {/* CSS Tips */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon">💡</span>
                <span className="control-title">CSS Formatting Tips</span>
              </label>
              <div className="tips-container">
                <div className="tip-item">
                  <span className="tip-icon">✨</span>
                  <span className="tip-text">Use consistent indentation for better readability</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span className="tip-text">Group related properties together</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📝</span>
                  <span className="tip-text">Add comments to explain complex styles</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔧</span>
                  <span className="tip-text">Use shorthand properties when possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
