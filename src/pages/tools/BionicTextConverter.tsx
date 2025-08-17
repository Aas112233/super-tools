import React, { useState, useRef, useEffect } from 'react';

export const BionicTextConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [boldPercentage, setBoldPercentage] = useState(50);
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

  const convertToBionic = (inputText: string) => {
    return inputText.replace(/\b\w+\b/g, word => {
      const boldLength = Math.ceil(word.length * (boldPercentage / 100));
      return `<strong>${word.slice(0, boldLength)}</strong>${word.slice(boldLength)}`;
    });
  };

  const copyToClipboard = async () => {
    try {
      const bionicText = convertToBionic(text);
      await navigator.clipboard.writeText(bionicText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const bionicHtml = text ? convertToBionic(text) : 'Your bionic reading text will appear here...';

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Bionic Text Converter</h1>
        <p>Enhance reading speed and comprehension with bionic reading</p>
      </div>
      <div className="bionic-converter-layout">
        <div className="bionic-input-section">
          <label className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></span>
            Enter your text:
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here to convert to bionic reading format..."
            className="bionic-input-textarea"
          />
          <div className="bionic-preview-section">
            <label className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
              Bionic Reading Result:
            </label>
            <div 
              className="bionic-preview"
              dangerouslySetInnerHTML={{ __html: bionicHtml }}
            />
            <button 
              className={`copy-btn ${copied ? 'copied' : ''} ${!text.trim() ? 'disabled' : ''}`}
              onClick={copyToClipboard}
              disabled={!text.trim()}
            >
              <span className="mr-2">{copied ? '✓' : '📋'}</span>
              {copied ? 'Copied!' : 'Copy Bionic Text'}
            </button>
          </div>
        </div>
        <div className="bionic-controls-section">
          <div className="bionic-controls-header">
            <h3>Bionic Settings</h3>
            <p>Adjust reading enhancement</p>
          </div>
          <div className="bionic-controls">
            <div className="control-group">
              <label>Bold Percentage: {boldPercentage}%</label>
              <div className="volume-slider">
                <input
                  type="range"
                  value={boldPercentage}
                  onChange={(e) => setBoldPercentage(parseInt(e.target.value))}
                  min="30"
                  max="70"
                  className="slider"
                />
                <div className="slider-labels">
                  <span>30%</span>
                  <span>70%</span>
                </div>
              </div>
            </div>
            <div className="bionic-info">
              <h4>How Bionic Reading Works:</h4>
              <ul>
                <li>• Bolds the first part of each word</li>
                <li>• Helps eyes focus and read faster</li>
                <li>• Improves comprehension</li>
                <li>• Reduces reading fatigue</li>
              </ul>
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
    </div>
  );
};