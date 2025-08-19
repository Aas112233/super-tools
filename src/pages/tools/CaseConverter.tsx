import React, { useState, useRef, useEffect } from 'react';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [activeCase, setActiveCase] = useState('upper');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(120, textareaRef.current.scrollHeight) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [text]);

  const convertCase = (type: string) => {
    switch (type) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default: return text;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Case Converter</h1>
        <p>Convert text between different cases with enhanced formatting</p>
      </div>
      <div className="case-converter-layout">
        <div className="input-output-section">
          <div className="input-area">
            <label className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
              Enter your text:
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="case-converter-input"
            />
          </div>
          <div className="output-area">
            <label className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
              Result ({activeCase}):
            </label>
            <textarea
              value={convertCase(activeCase)}
              readOnly
              className="case-converter-output"
            />
            <button 
              className={`copy-btn ${copied ? 'copied' : ''} ${!text.trim() ? 'disabled' : ''}`}
              onClick={() => copyToClipboard(convertCase(activeCase))}
              disabled={!text.trim()}
            >
              <span className="mr-2">{copied ? '✓' : '📋'}</span>
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
        </div>
        <div className="case-options-section">
          <div className="case-options-header">
            <h3>Case Options</h3>
            <p>Select conversion type</p>
          </div>
          <div className="case-options">
            {[
              { type: 'upper', label: 'UPPERCASE', icon: '🔤' },
              { type: 'lower', label: 'lowercase', icon: '🔡' },
              { type: 'title', label: 'Title Case', icon: '📝' },
              { type: 'sentence', label: 'Sentence case', icon: '📄' }
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                className={`case-btn ${activeCase === type ? 'active' : ''} animated-btn`}
                onClick={() => setActiveCase(type)}
              >
                <div className="btn-icon">{icon}</div>
                <div className="btn-label">{label}</div>
              </button>
            ))}
          </div>
          {text && (
            <div className="text-stats">
              <span>{text.length} chars</span>
              <span>{text.split(/\s+/).filter(word => word.length > 0).length} words</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};