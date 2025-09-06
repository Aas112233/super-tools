import React, { useState, useCallback } from 'react';
import { Copy, Check, ArrowUpDown, Globe, Link as LinkIcon } from 'lucide-react';

const UrlEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'uri'>('component');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const urlEncode = (str: string, type: 'component' | 'uri'): string => {
    try {
      if (type === 'component') {
        return encodeURIComponent(str);
      } else {
        return encodeURI(str);
      }
    } catch (e) {
      throw new Error('Invalid input for encoding');
    }
  };

  const urlDecode = (str: string): string => {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      throw new Error('Invalid URL encoded string');
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
        setOutput(urlEncode(input, encodeType));
      } else {
        setOutput(urlDecode(input));
      }
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  }, [input, mode, encodeType]);

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
    setError('');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const examples = {
    encode: 'Hello World! How are you? #special-chars & symbols = 100%',
    decode: 'Hello%20World!%20How%20are%20you%3F%20%23special-chars%20%26%20symbols%20%3D%20100%25'
  };

  const loadExample = () => {
    setInput(examples[mode]);
  };

  // Characters that get encoded
  const specialChars = [
    { char: ' ', encoded: '%20', name: 'Space' },
    { char: '!', encoded: '%21', name: 'Exclamation' },
    { char: '"', encoded: '%22', name: 'Quote' },
    { char: '#', encoded: '%23', name: 'Hash' },
    { char: '$', encoded: '%24', name: 'Dollar' },
    { char: '%', encoded: '%25', name: 'Percent' },
    { char: '&', encoded: '%26', name: 'Ampersand' },
    { char: '+', encoded: '%2B', name: 'Plus' },
    { char: '=', encoded: '%3D', name: 'Equals' },
    { char: '?', encoded: '%3F', name: 'Question' },
    { char: '@', encoded: '%40', name: 'At' }
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>URL Encoder/Decoder</h1>
        <p>Encode and decode URLs for safe web transmission</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '2px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setMode('encode')}
                className={`case-btn ${mode === 'encode' ? 'active' : ''} animated-btn-sm`}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`case-btn ${mode === 'decode' ? 'active' : ''} animated-btn-sm`}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Decode
              </button>
            </div>
            <button
              onClick={clearAll}
              className="case-btn animated-btn-sm"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Clear
            </button>
          </div>

          {mode === 'encode' && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={() => setEncodeType('component')}
                className={`case-btn ${encodeType === 'component' ? 'active' : ''} animated-btn-xs`}
                style={{ padding: '0.5rem 1rem' }}
                title="Encodes all special characters (recommended)"
              >
                Component
              </button>
              <button
                onClick={() => setEncodeType('uri')}
                className={`case-btn ${encodeType === 'uri' ? 'active' : ''} animated-btn-xs`}
                style={{ padding: '0.5rem 1rem' }}
                title="Preserves URI structure characters"
              >
                URI
              </button>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start', minHeight: '600px' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <label htmlFor="input-text">
            {mode === 'encode' ? 'Text/URL to Encode' : 'URL Encoded Text to Decode'}
          </label>
          <textarea
            id="input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter URL encoded text to decode...'}
            rows={4}
            style={{ width: '295px', minHeight: '120px', maxHeight: '200px', borderRadius: '12px', border: '2px solid var(--border-color)', padding: '1rem', background: 'var(--bg-tertiary)', height: '119px' }}
          />

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

        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <label htmlFor="output-text">
            {mode === 'encode' ? 'URL Encoded' : 'Decoded Text'}
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="output-text"
              value={output}
              readOnly
              rows={4}
              style={{ paddingRight: '3rem', width: '295px', minHeight: '120px', maxHeight: '200px', borderRadius: '12px', border: '2px solid var(--border-color)', padding: '1rem', background: 'var(--bg-tertiary)', height: '119px' }}
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
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LinkIcon className="w-4 h-4" />
                URL Preview
              </h4>
              <code style={{ 
                color: 'var(--accent-color)', 
                wordBreak: 'break-all',
                fontSize: '0.9rem',
                display: 'block',
                background: 'var(--bg-tertiary)',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                {mode === 'encode' ? `https://example.com/search?q=${output}` : `https://example.com/search?q=${input}`}
              </code>
            </div>
          )}

          {output && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span>Input length: {input.length}</span>
                <span>Output length: {output.length}</span>
                {mode === 'encode' && input.length > 0 && (
                  <span>Size change: {output.length > input.length ? '+' : ''}{output.length - input.length}</span>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default UrlEncoderDecoder;