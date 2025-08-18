import React, { useState, useCallback } from 'react';
import { Copy, Check, ArrowUpDown, FileText, Image as ImageIcon } from 'lucide-react';

export const Base64EncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const base64Encode = (str: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      throw new Error('Invalid input for encoding');
    }
  };

  const base64Decode = (str: string): string => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      throw new Error('Invalid Base64 string');
    }
  };

  const processText = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(base64Encode(input));
      } else {
        setOutput(base64Decode(input));
      }
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  }, [input, mode]);

  React.useEffect(() => {
    processText();
  }, [processText]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (mode === 'encode') {
        const base64 = result.split(',')[1]; // Remove data:type;base64, prefix
        setInput(file.name);
        setOutput(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Base64 Converter</h1>
        <p>Encode and decode Base64 strings with support for text and files</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setMode('encode')}
              className={`case-btn ${mode === 'encode' ? 'active' : ''}`}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`case-btn ${mode === 'decode' ? 'active' : ''}`}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Decode
            </button>
          </div>
          
          <button
            onClick={swapInputOutput}
            className="case-btn"
            style={{ padding: '0.75rem', minWidth: 'auto' }}
            title="Swap input and output"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
          
          <button
            onClick={clearAll}
            className="case-btn"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Clear
          </button>
        </div>

        {mode === 'encode' && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setInputType('text')}
              className={`case-btn ${inputType === 'text' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FileText className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`case-btn ${inputType === 'file' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ImageIcon className="w-4 h-4" />
              File
            </button>
          </div>
        )}
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <label htmlFor="input-text">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          
          {mode === 'encode' && inputType === 'file' ? (
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: '12px',
                  background: 'var(--bg-tertiary)',
                  marginBottom: '1rem'
                }}
              />
              <textarea
                value={input}
                readOnly
                placeholder="Selected file name will appear here..."
                rows={2}
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
              />
            </div>
          ) : (
            <textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
              rows={8}
            />
          )}

          {error && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
        </div>

        <div className="output-section">
          <label htmlFor="output-text">
            {mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'}
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="output-text"
              value={output}
              readOnly
              rows={8}
              style={{ paddingRight: '3rem' }}
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
                minWidth: 'auto',
                width: 'auto',
                margin: 0
              }}
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {output && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span>Input length: {input.length}</span>
                <span>Output length: {output.length}</span>
                {mode === 'encode' && (
                  <span>Size increase: {input.length > 0 ? Math.round((output.length / input.length - 1) * 100) : 0}%</span>
                )}
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <h4>About Base64:</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Base64 encoding converts binary data to ASCII text</li>
              <li>Commonly used for embedding images in HTML/CSS</li>
              <li>Safe for transmission over text-based protocols</li>
              <li>Increases data size by approximately 33%</li>
              <li>Uses characters A-Z, a-z, 0-9, +, / and = for padding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};