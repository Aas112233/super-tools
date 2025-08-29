import React, { useState } from 'react';
import { Copy, Check, FileText, Minimize2, TrendingDown } from 'lucide-react';

const HtmlMinifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  const minifyHTML = () => {
    if (!input.trim()) return;
    // Basic HTML minification logic
    const minified = input
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/> </g, '><') // Remove spaces between tags
      .trim();
    setOutput(minified);
    setOriginalSize(new Blob([input]).size);
    setMinifiedSize(new Blob([minified]).size);
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
    setOriginalSize(0);
    setMinifiedSize(0);
  };

  const compressionRatio = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">🗃️ HTML Minifier</h1>
        <p className="tool-subtitle">Compress your HTML by removing whitespace, comments, and unnecessary characters</p>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">📝 Input & Preview</h2>
            <p className="section-subtitle">Paste your HTML code and compress it instantly</p>
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon"><FileText className="w-4 h-4" /></span>
              <span className="label-text">HTML Code</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <!-- Your content here -->\n    <div class="container">\n        <h1>Hello World</h1>\n        <p>This is a sample HTML document.</p>\n    </div>\n</body>\n</html>`}
              className="enhanced-textarea"
              rows={12}
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
            <div className="text-counter">{input.length} characters</div>
          </div>

          <div className="preview-section">
            <label className="preview-label">
              <span className="label-icon"><Minimize2 className="w-4 h-4" /></span>
              <span className="label-text">Minified Output</span>
              <div className="preview-tags">
                <span className="preview-tag">🗃️ Compressed</span>
                {compressionRatio > 0 && (
                  <span className="preview-tag">📊 -{compressionRatio}%</span>
                )}
              </div>
            </label>
            <div className="preview-container">
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Minified HTML will appear here...\n\nClick 'Minify HTML' to compress your code!"
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
                onClick={minifyHTML}
                disabled={!input.trim()}
              >
                <span className="btn-icon">🗃️</span>
                <span className="btn-text">Minify HTML</span>
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
            <h2 className="section-title">📊 Compression Stats</h2>
            <p className="section-subtitle">See how much space you've saved</p>
          </div>

          <div className="controls-wrapper">
            {/* Compression Statistics */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon"><TrendingDown className="w-4 h-4" /></span>
                <span className="control-title">File Size Analysis</span>
              </label>
              <div className="text-stats-grid">
                <div className="stat-card">
                  <span className="stat-value">{originalSize}</span>
                  <span className="stat-label">Original (bytes)</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{minifiedSize}</span>
                  <span className="stat-label">Minified (bytes)</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value" style={{color: compressionRatio > 0 ? '#10b981' : 'inherit'}}>
                    {compressionRatio}%
                  </span>
                  <span className="stat-label">Saved</span>
                </div>
              </div>
            </div>

            {/* HTML Elements Count */}
            {input && (
              <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
                <label className="control-label">
                  <span className="control-icon">🏷️</span>
                  <span className="control-title">HTML Analysis</span>
                </label>
                <div className="text-stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">{(input.match(/<[^>]+>/g) || []).length}</span>
                    <span className="stat-label">HTML Tags</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{(input.match(/<!--[\s\S]*?-->/g) || []).length}</span>
                    <span className="stat-label">Comments</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{input.split('\n').length}</span>
                    <span className="stat-label">Lines</span>
                  </div>
                </div>
              </div>
            )}

            {/* What Gets Removed */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon">✂️</span>
                <span className="control-title">What Gets Removed</span>
              </label>
              <div className="tips-container">
                <div className="tip-item">
                  <span className="tip-icon">🔲</span>
                  <span className="tip-text">Extra whitespace and line breaks</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">💬</span>
                  <span className="tip-text">HTML comments</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔄</span>
                  <span className="tip-text">Spaces between tags</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span className="tip-text">Unnecessary characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlMinifier;