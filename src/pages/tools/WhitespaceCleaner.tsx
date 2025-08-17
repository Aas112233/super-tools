import React, { useState, useRef, useEffect } from 'react';

export const WhitespaceCleaner: React.FC = () => {
  const [text, setText] = useState('');
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeExtraLines, setRemoveExtraLines] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeAllSpaces, setRemoveAllSpaces] = useState(false);
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

  const cleanWhitespace = (inputText: string) => {
    let cleanedText = inputText;
    
    if (removeExtraSpaces) {
      cleanedText = cleanedText.replace(/[ \t]+/g, ' ');
    }
    if (removeExtraLines) {
      cleanedText = cleanedText.replace(/\n\s*\n/g, '\n');
    }
    if (trimLines) {
      cleanedText = cleanedText.split('\n').map(line => line.trim()).join('\n');
    }
    if (removeAllSpaces) {
      cleanedText = cleanedText.replace(/\s/g, '');
    }
    
    return cleanedText;
  };

  const copyToClipboard = async () => {
    try {
      const cleanedText = cleanWhitespace(text);
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const cleanedText = text ? cleanWhitespace(text) : '';

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Whitespace Cleaner</h1>
        <p>Clean up extra spaces and formatting in your text</p>
      </div>
      <div className="whitespace-cleaner-layout">
        <div className="whitespace-input-section">
          <label className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></span>
            Enter your text:
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text with multiple spaces here..."
            className="whitespace-input-textarea"
          />
          <div className="whitespace-preview-section">
            <label className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
              Cleaned Text:
            </label>
            <textarea 
              value={cleanedText}
              readOnly
              className="whitespace-output-textarea"
              placeholder="Your cleaned text will appear here..."
            />
            <button 
              className={`copy-btn ${copied ? 'copied' : ''} ${!text.trim() ? 'disabled' : ''}`}
              onClick={copyToClipboard}
              disabled={!text.trim()}
            >
              <span className="mr-2">{copied ? '✓' : '📋'}</span>
              {copied ? 'Copied!' : 'Copy Cleaned Text'}
            </button>
          </div>
        </div>
        <div className="whitespace-controls-section">
          <div className="whitespace-controls-header">
            <h3>Cleaning Options</h3>
            <p>Select what to clean</p>
          </div>
          <div className="whitespace-controls">
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={removeExtraSpaces}
                  onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
                />
                <span>Remove extra spaces</span>
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={removeExtraLines}
                  onChange={(e) => setRemoveExtraLines(e.target.checked)}
                />
                <span>Remove extra line breaks</span>
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={trimLines}
                  onChange={(e) => setTrimLines(e.target.checked)}
                />
                <span>Trim line endings</span>
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={removeAllSpaces}
                  onChange={(e) => setRemoveAllSpaces(e.target.checked)}
                />
                <span>Remove all spaces</span>
              </label>
            </div>
            <div className="whitespace-info">
              <h4>Cleaning Actions:</h4>
              <ul>
                <li>• Extra spaces: Multiple spaces → Single space</li>
                <li>• Extra lines: Multiple line breaks → Single break</li>
                <li>• Trim lines: Remove leading/trailing spaces</li>
                <li>• All spaces: Remove every whitespace character</li>
              </ul>
            </div>
            {text && (
              <div className="text-stats">
                <span>Original: {text.length} chars</span>
                <span>Cleaned: {cleanedText.length} chars</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};