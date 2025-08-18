import React, { useState, useCallback } from 'react';
import { Copy, Check, ArrowUpDown, Code } from 'lucide-react';

export const HtmlEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<'named' | 'numeric' | 'hex'>('named');
  const [copied, setCopied] = useState(false);

  // HTML entity maps
  const namedEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  const htmlEncode = (str: string, type: 'named' | 'numeric' | 'hex'): string => {
    return str.replace(/[&<>"'`=\/]/g, (match) => {
      if (type === 'named' && namedEntities[match]) {
        return namedEntities[match];
      } else if (type === 'numeric') {
        return `&#${match.charCodeAt(0)};`;
      } else if (type === 'hex') {
        return `&#x${match.charCodeAt(0).toString(16).toUpperCase()};`;
      }
      return namedEntities[match] || match;
    });
  };

  const htmlDecode = (str: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  const processText = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(htmlEncode(input, encodeMode));
      } else {
        setOutput(htmlDecode(input));
      }
    } catch (e) {
      setOutput('Error processing text');
    }
  }, [input, mode, encodeMode]);

  React.useEffect(() => {
    processText();
  }, [processText]);

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
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const examples = {
    encode: 'Hello <world> & "friends"!',
    decode: 'Hello &lt;world&gt; &amp; &quot;friends&quot;!'
  };

  const loadExample = () => {
    setInput(examples[mode]);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>HTML Encoder/Decoder</h1>
        <p>Encode and decode HTML entities for safe web content</p>
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
            onClick={loadExample}
            className="case-btn"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Example
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
              onClick={() => setEncodeMode('named')}
              className={`case-btn ${encodeMode === 'named' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              Named Entities
            </button>
            <button
              onClick={() => setEncodeMode('numeric')}
              className={`case-btn ${encodeMode === 'numeric' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              Numeric
            </button>
            <button
              onClick={() => setEncodeMode('hex')}
              className={`case-btn ${encodeMode === 'hex' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              Hexadecimal
            </button>
          </div>
        )}
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <label htmlFor="input-text">
            {mode === 'encode' ? 'Text to Encode' : 'HTML Entities to Decode'}
          </label>
          <textarea
            id="input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text with special characters...' : 'Enter HTML entities to decode...'}
            rows={8}
          />

          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <h4>Common Characters:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
              {Object.entries(namedEntities).map(([char, entity]) => (
                <div key={char} style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '0.5rem', 
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{char}</div>
                  <div style={{ color: 'var(--accent-color)' }}>{entity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="output-section">
          <label htmlFor="output-text">
            {mode === 'encode' ? 'HTML Encoded' : 'Decoded Text'}
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
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code className="w-4 h-4" />
              HTML Entity Types:
            </h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Named:</strong> &amp;lt; &amp;gt; &amp;amp; (human-readable)</li>
              <li><strong>Numeric:</strong> &amp;#60; &amp;#62; &amp;#38; (decimal codes)</li>
              <li><strong>Hex:</strong> &amp;#x3C; &amp;#x3E; &amp;#x26; (hexadecimal codes)</li>
            </ul>
            
            <h4>Use Cases:</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Display HTML code in web pages</li>
              <li>Prevent XSS attacks by encoding user input</li>
              <li>Store HTML content safely in databases</li>
              <li>Include special characters in XML/HTML attributes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};