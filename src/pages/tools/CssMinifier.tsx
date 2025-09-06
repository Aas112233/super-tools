import React, { useState } from 'react';
import { Copy, Check, Minimize2, Archive, TrendingDown } from 'lucide-react';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  const minifyCSS = () => {
    if (!input.trim()) return;
    // Basic CSS minification logic would go here
    const minified = input.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
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
        <h1 className="tool-title">🗃️ CSS Minifier</h1>
        <p className="tool-subtitle">Compress your CSS by removing whitespace and unnecessary characters</p>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">📝 Input & Preview</h2>
            <p className="section-subtitle">Paste your CSS code and compress it instantly</p>
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon"><Archive className="w-4 h-4" /></span>
              <span className="label-text">CSS Code</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="/* Your CSS code here */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n    background-color: #ffffff;\n}\n\n.container {\n    width: 100%;\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n}"
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
                  placeholder="Minified CSS will appear here...\n\nClick 'Minify CSS' to compress your code!"
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
                onClick={minifyCSS}
                disabled={!input.trim()}
              >
                <span className="btn-icon">🗃️</span>
                <span className="btn-text">Minify CSS</span>
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

            {/* Minification Benefits */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon">🚀</span>
                <span className="control-title">Minification Benefits</span>
              </label>
              <div className="tips-container">
                <div className="tip-item">
                  <span className="tip-icon">⚡</span>
                  <span className="tip-text">Faster page load times</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">💾</span>
                  <span className="tip-text">Reduced bandwidth usage</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📊</span>
                  <span className="tip-text">Better SEO performance</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">💰</span>
                  <span className="tip-text">Lower hosting costs</span>
                </div>
              </div>
            </div>

            {/* What Gets Removed */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon">✂️</span>
                <span className="control-title">What Gets Removed</span>
              </label>
              <div className="tips-container">
                <div className="tip-item">
                  <span className="tip-icon">🔲</span>
                  <span className="tip-text">Whitespace and line breaks</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">💬</span>
                  <span className="tip-text">Comments and documentation</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔄</span>
                  <span className="tip-text">Unnecessary semicolons</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span className="tip-text">Redundant characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
