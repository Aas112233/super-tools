import React, { useState, useCallback } from 'react';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';

const urlSlug = (str: string, options: { separator?: string; lowercase?: boolean; remove?: RegExp } = {}) => {
  const { separator = '-', lowercase = true, remove } = options;
  
  let result = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim();
  
  if (remove) {
    result = result.replace(remove, '');
  }
  
  result = result.replace(/[-\s]+/g, separator);
  
  if (lowercase) {
    result = result.toLowerCase();
  }
  
  return result;
};

const UrlSlugGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [removePattern, setRemovePattern] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSlug = useCallback(() => {
    if (!input.trim()) return '';
    
    const options: { separator?: string; lowercase?: boolean; remove?: RegExp } = {
      separator,
      lowercase,
    };
    
    if (removePattern) {
      try {
        options.remove = new RegExp(removePattern, 'g');
      } catch (e) {
        // Invalid regex, ignore
      }
    }
    
    return urlSlug(input, options);
  }, [input, separator, lowercase, removePattern]);

  const slug = generateSlug();

  const copyToClipboard = async () => {
    if (slug) {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>SEO URL Creator</h1>
        <p>Convert text into SEO-friendly URL slugs</p>
      </div>

      <div className="desktop-layout">
        <div className="input-section">
          <label htmlFor="input-text">Input Text</label>
          <textarea
            id="input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
            rows={4}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label htmlFor="separator">Separator</label>
              <select
                id="separator"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Dot (.)</option>
                <option value="">None</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="remove-pattern">Remove Pattern (RegEx)</label>
              <input
                id="remove-pattern"
                type="text"
                value={removePattern}
                onChange={(e) => setRemovePattern(e.target.value)}
                placeholder="e.g., [0-9]"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
              />
              Convert to lowercase
            </label>
          </div>
        </div>

        <div className="output-section">
          <label htmlFor="output-slug">Generated URL Slug</label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="output-slug"
              value={slug}
              readOnly
              rows={4}
              style={{ paddingRight: '3rem' }}
            />
            <button
              onClick={copyToClipboard}
              disabled={!slug}
              className={`copy-btn ${copied ? 'copied' : ''} ${!slug ? 'disabled' : ''}`}
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
          
          {slug && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LinkIcon className="w-4 h-4" />
                Preview URL
              </h4>
              <code style={{ color: 'var(--accent-color)', wordBreak: 'break-all' }}>
                https://example.com/{slug}
              </code>
            </div>
          )}
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <h4>Features:</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Removes accents and special characters</li>
              <li>Converts spaces to separators</li>
              <li>Handles multiple consecutive separators</li>
              <li>Custom regex pattern removal</li>
              <li>SEO-friendly output</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlSlugGenerator;