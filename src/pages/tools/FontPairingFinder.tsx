import React, { useState } from 'react';

const FontPairingFinder: React.FC = () => {
  const [currentPair, setCurrentPair] = useState({ primary: 'Playfair Display', secondary: 'Source Sans Pro' });
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fontPairs = [
    { primary: 'Playfair Display', secondary: 'Source Sans Pro', category: 'serif' },
    { primary: 'Montserrat', secondary: 'Open Sans', category: 'sans-serif' },
    { primary: 'Oswald', secondary: 'Lato', category: 'sans-serif' },
    { primary: 'Raleway', secondary: 'Roboto', category: 'sans-serif' },
    { primary: 'Poppins', secondary: 'Inter', category: 'sans-serif' },
    { primary: 'Merriweather', secondary: 'Lato', category: 'serif' },
    { primary: 'Dancing Script', secondary: 'Josefin Sans', category: 'handwriting' },
    { primary: 'Lobster', secondary: 'Cabin', category: 'display' },
    { primary: 'Fira Code', secondary: 'Roboto', category: 'monospace' },
    { primary: 'Crimson Text', secondary: 'Work Sans', category: 'serif' },
    { primary: 'Abril Fatface', secondary: 'Dosis', category: 'display' },
    { primary: 'Amatic SC', secondary: 'Nunito', category: 'handwriting' }
  ];

  const categories = [
    { id: 'all', label: 'All Fonts' },
    { id: 'serif', label: 'Serif' },
    { id: 'sans-serif', label: 'Sans Serif' },
    { id: 'display', label: 'Display' },
    { id: 'handwriting', label: 'Handwriting' },
    { id: 'monospace', label: 'Monospace' }
  ];

  const generateRandomPair = () => {
    const filteredPairs = category === 'all' 
      ? fontPairs 
      : fontPairs.filter(pair => pair.category === category);
    
    const randomPair = filteredPairs[Math.floor(Math.random() * filteredPairs.length)];
    setCurrentPair(randomPair);
  };

  const copyFontPair = async () => {
    try {
      const fontCode = `/* Font Pair: ${currentPair.primary} + ${currentPair.secondary} */
@import url('https://fonts.googleapis.com/css2?family=${currentPair.primary.replace(/\s+/g, '+')}:wght@400;700&family=${currentPair.secondary.replace(/\s+/g, '+')}:wght@400;700&display=swap');

.primary-font {
  font-family: '${currentPair.primary}', serif;
}

.secondary-font {
  font-family: '${currentPair.secondary}', sans-serif;
}`;
      
      await navigator.clipboard.writeText(fontCode);
    } catch (err) {
      console.error('Failed to copy font code: ', err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Font Pairing Finder</h1>
        <p>Discover perfect Google Fonts combinations for your projects</p>
      </div>
      <div className="font-pairing-layout">
        <div className="font-preview-section">
          <div className="pair-header">
            <h3>{currentPair.primary} + {currentPair.secondary}</h3>
            <button className="copy-btn" onClick={copyFontPair}>
              📋 Copy CSS Code
            </button>
          </div>
          <div className="pair-preview">
            <div 
              className="primary-font-preview" 
              style={{ fontFamily: `'${currentPair.primary}', serif` }}
            >
              <h2>Primary Font ({currentPair.primary})</h2>
              <p>The quick brown fox jumps over the lazy dog</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>1234567890 !@#$%^&*()</p>
            </div>
            <div 
              className="secondary-font-preview" 
              style={{ fontFamily: `'${currentPair.secondary}', sans-serif` }}
            >
              <h3>Secondary Font ({currentPair.secondary})</h3>
              <p>The quick brown fox jumps over the lazy dog</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>1234567890 !@#$%^&*()</p>
            </div>
          </div>
        </div>
        <div className="font-controls-section">
          <div className="font-controls-header">
            <h3>Font Generator</h3>
            <p>Find perfect combinations</p>
          </div>
          <div className="font-controls">
            <div className="control-group">
              <label>Search Fonts:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Google Fonts..."
                className="font-search-input"
              />
            </div>
            <div className="control-group">
              <label>Font Category:</label>
              <div className="category-buttons">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${category === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="generate-btn" onClick={generateRandomPair}>
              🎲 Generate New Pair
            </button>
            <div className="font-info">
              <h4>Font Pairing Tips:</h4>
              <ul>
                <li>• Contrast serif with sans-serif</li>
                <li>• Use display fonts for headings</li>
                <li>• Keep body text readable</li>
                <li>• Limit to 2-3 font families</li>
                <li>• Consider font weights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontPairingFinder;