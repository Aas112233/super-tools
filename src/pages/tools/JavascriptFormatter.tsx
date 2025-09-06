import React, { useState } from 'react';
import { Copy, Check, Code, Zap, Settings } from 'lucide-react';

const JavascriptFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState('2');
  const [semicolons, setSemicolons] = useState(true);
  const [singleQuotes, setSingleQuotes] = useState(false);

  const formatJS = () => {
    if (!input.trim()) return;
    // Basic JS formatting logic would go here
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
        <h1 className="tool-title">⚡ JavaScript Formatter</h1>
        <p className="tool-subtitle">Format and prettify your JavaScript code with proper indentation and structure</p>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">📝 Input & Preview</h2>
            <p className="section-subtitle">Paste your JavaScript code and see it formatted beautifully</p>
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon"><Code className="w-4 h-4" /></span>
              <span className="label-text">JavaScript Code</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="function greetUser(name){const greeting='Hello, '+name+'!';console.log(greeting);return greeting;}greetUser('World');const users=[{name:'John',age:30},{name:'Jane',age:25}];users.forEach(user=>console.log(user.name));"
              className="enhanced-textarea"
              rows={12}
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
            <div className="text-counter">{input.length} characters</div>
          </div>

          <div className="preview-section">
            <label className="preview-label">
              <span className="label-icon"><Zap className="w-4 h-4" /></span>
              <span className="label-text">Formatted Output</span>
              <div className="preview-tags">
                <span className="preview-tag">✨ Beautified</span>
                <span className="preview-tag">📐 {indentSize} spaces</span>
                {semicolons && <span className="preview-tag">🔸 Semicolons</span>}
                {singleQuotes && <span className="preview-tag">’ Single quotes</span>}
              </div>
            </label>
            <div className="preview-container">
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Formatted JavaScript will appear here...\n\nClick 'Format JavaScript' to beautify your code!"
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
                onClick={formatJS}
                disabled={!input.trim()}
              >
                <span className="btn-icon">⚡</span>
                <span className="btn-text">Format JavaScript</span>
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
            <p className="section-subtitle">Customize your JavaScript formatting preferences</p>
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
                <span className="control-title">Code Style</span>
              </label>
              
              <div className="style-controls">
                <div className="control-item checkbox-item">
                  <input 
                    type="checkbox" 
                    id="semicolons" 
                    checked={semicolons}
                    onChange={(e) => setSemicolons(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <label htmlFor="semicolons" className="checkbox-label">
                    Add semicolons
                  </label>
                </div>
                
                <div className="control-item checkbox-item">
                  <input 
                    type="checkbox" 
                    id="single-quotes" 
                    checked={singleQuotes}
                    onChange={(e) => setSingleQuotes(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <label htmlFor="single-quotes" className="checkbox-label">
                    Use single quotes
                  </label>
                </div>
              </div>
            </div>

            {/* JavaScript Statistics */}
            {input && (
              <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
                <label className="control-label">
                  <span className="control-icon">📊</span>
                  <span className="control-title">JavaScript Statistics</span>
                </label>
                <div className="text-stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">{input.length}</span>
                    <span className="stat-label">Characters</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{(input.match(/function\s+\w+/g) || []).length}</span>
                    <span className="stat-label">Functions</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{input.split('\n').length}</span>
                    <span className="stat-label">Lines</span>
                  </div>
                </div>
              </div>
            )}

            {/* JavaScript Formatting Tips */}
            <div className="control-group enhanced" style={{gridColumn: '1 / -1'}}>
              <label className="control-label">
                <span className="control-icon">💡</span>
                <span className="control-title">JavaScript Formatting Tips</span>
              </label>
              <div className="tips-container">
                <div className="tip-item">
                  <span className="tip-icon">✨</span>
                  <span className="tip-text">Use consistent indentation for better readability</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span className="tip-text">Add semicolons to avoid ASI issues</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📝</span>
                  <span className="tip-text">Use meaningful variable and function names</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔧</span>
                  <span className="tip-text">Follow consistent quote style throughout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JavascriptFormatter;