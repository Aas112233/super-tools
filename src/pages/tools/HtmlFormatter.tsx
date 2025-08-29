import React, { useState } from 'react';
import { Copy, Check, FileText, Code, Settings } from 'lucide-react';

const HtmlFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState('2');
  const [wrapLines, setWrapLines] = useState(false);
  const [uppercaseTags, setUppercaseTags] = useState(false);

  const formatHTML = () => {
    if (!input.trim()) return;
    // Basic HTML formatting logic would go here
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
        <h1 className="tool-title">🎨 HTML Formatter</h1>
        <p className="tool-subtitle">Format and prettify your HTML code with proper indentation and structure</p>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">📝 Input & Preview</h2>
            <p className="section-subtitle">Paste your HTML code and see it formatted beautifully</p>
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon"><FileText className="w-4 h-4" /></span>
              <span className="label-text">HTML Code</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`<!DOCTYPE html><html><head><title>Document</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML document that needs formatting.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>`}
              className="enhanced-textarea"
              rows={12}
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
            <div className="text-counter">{input.length} characters</div>
          </div>

          <div className="preview-section">
            <label className="preview-label">
              <span className="label-icon"><Code className="w-4 h-4" /></span>
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
                  placeholder="Formatted HTML will appear here...\n\nClick 'Format HTML' to beautify your code!"
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
                onClick={formatHTML}
                disabled={!input.trim()}
              >
                <span className="btn-icon">✨</span>
                <span className="btn-text">Format HTML</span>
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
            <p className="section-subtitle">Customize your HTML formatting preferences</p>
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
                <span className="control-title">Formatting Options</span>
              </label>
              
              <div className="style-controls">
                <div className="control-item checkbox-item">
                  <input 
                    type="checkbox" 
                    id="wrap-lines" 
                    checked={wrapLines}
                    onChange={(e) => setWrapLines(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <label htmlFor="wrap-lines" className="checkbox-label">
                    Wrap long lines
                  </label>
                </div>
                
                <div className="control-item checkbox-item">
                  <input 
                    type="checkbox" 
                    id="uppercase-tags" 
                    checked={uppercaseTags}
                    onChange={(e) => setUppercaseTags(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <label htmlFor="uppercase-tags" className="checkbox-label">
                    Uppercase HTML tags
                  </label>
                </div>
              </div>
            </div>

            {/* HTML Statistics */}
            {input && (
              <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
                <label className="control-label">
                  <span className="control-icon">📊</span>
                  <span className="control-title">HTML Statistics</span>
                </label>
                <div className="text-stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">{input.length}</span>
                    <span className="stat-label">Characters</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{(input.match(/<[^>]+>/g) || []).length}</span>
                    <span className="stat-label">HTML Tags</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{input.split('\n').length}</span>
                    <span className="stat-label">Lines</span>
                  </div>
                </div>
              </div>
            )}

            {/* HTML Formatting Tips */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon">💡</span>
                <span className="control-title">HTML Formatting Tips</span>
              </label>
              <div className="tips-container">
                <div className="tip-item">
                  <span className="tip-icon">✨</span>
                  <span className="tip-text">Use consistent indentation for nested elements</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span className="tip-text">Keep attributes on separate lines for readability</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📝</span>
                  <span className="tip-text">Add comments to explain complex structures</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔧</span>
                  <span className="tip-text">Use semantic HTML elements when possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlFormatter;