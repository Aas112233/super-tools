import React, { useState } from 'react';
import { Shuffle, Copy, Check } from 'lucide-react';

export const ListRandomizer: React.FC = () => {
  const [inputList, setInputList] = useState('');
  const [randomizedList, setRandomizedList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const randomizeList = () => {
    if (!inputList.trim()) {
      setRandomizedList([]);
      return;
    }

    // Split by newlines and filter out empty lines
    const items = inputList.split('\n').filter(item => item.trim() !== '');
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setRandomizedList(shuffled);
  };

  const copyToClipboard = async () => {
    if (randomizedList.length > 0) {
      const text = randomizedList.join('\n');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInputList('');
    setRandomizedList([]);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>List Randomizer</h1>
        <p>Randomize the order of items in your list</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {/* Input Section */}
        <div className="input-section">
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="list-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Enter your list (one item per line)
            </label>
            <textarea
              id="list-input"
              value={inputList}
              onChange={(e) => setInputList(e.target.value)}
              placeholder="Enter items, one per line&#10;Item 1&#10;Item 2&#10;Item 3&#10;..."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={randomizeList}
              disabled={!inputList.trim()}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, var(--accent-color) 0%, #6366f1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: inputList.trim() ? 'pointer' : 'not-allowed',
                opacity: inputList.trim() ? 1 : 0.7,
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Shuffle size={20} />
              Randomize List
            </button>

            <button
              onClick={clearAll}
              style={{
                padding: '1rem 2rem',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="output-section">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <label>Randomized List</label>
            {randomizedList.length > 0 && (
              <button
                onClick={copyToClipboard}
                disabled={copied}
                style={{
                  padding: '0.5rem 1rem',
                  background: copied ? 'var(--success-color)' : 'var(--bg-tertiary)',
                  color: copied ? 'white' : 'var(--text-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div
            style={{
              minHeight: '200px',
              padding: '1rem',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'inherit',
              whiteSpace: 'pre-wrap',
              overflow: 'auto'
            }}
          >
            {randomizedList.length > 0 ? (
              randomizedList.map((item, index) => (
                <div key={index} style={{ padding: '0.25rem 0' }}>
                  {index + 1}. {item}
                </div>
              ))
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'var(--text-muted)',
                fontStyle: 'italic'
              }}>
                Randomized list will appear here...
              </div>
            )}
          </div>

          {randomizedList.length > 0 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem',
              background: 'var(--accent-light)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Items:</strong> {randomizedList.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};