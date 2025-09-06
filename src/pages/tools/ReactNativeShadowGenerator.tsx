import React, { useState } from 'react';
import { Copy, Check, Smartphone } from 'lucide-react';

const ReactNativeShadowGenerator: React.FC = () => {
  const [shadowOffset, setShadowOffset] = useState({ width: 0, height: 2 });
  const [shadowOpacity, setShadowOpacity] = useState(0.25);
  const [shadowRadius, setShadowRadius] = useState(3.84);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [elevation, setElevation] = useState(5);
  const [copied, setCopied] = useState('');

  const generateIOSShadow = () => {
    return `shadowColor: '${shadowColor}',
shadowOffset: {
  width: ${shadowOffset.width},
  height: ${shadowOffset.height},
},
shadowOpacity: ${shadowOpacity},
shadowRadius: ${shadowRadius},`;
  };

  const generateAndroidShadow = () => {
    return `elevation: ${elevation},`;
  };

  const generateCombinedShadow = () => {
    return `// iOS Shadow
shadowColor: '${shadowColor}',
shadowOffset: {
  width: ${shadowOffset.width},
  height: ${shadowOffset.height},
},
shadowOpacity: ${shadowOpacity},
shadowRadius: ${shadowRadius},
// Android Shadow
elevation: ${elevation},`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const presetShadows = [
    { name: 'Light', offset: { width: 0, height: 1 }, opacity: 0.18, radius: 1.0, elevation: 1 },
    { name: 'Medium', offset: { width: 0, height: 2 }, opacity: 0.25, radius: 3.84, elevation: 5 },
    { name: 'Heavy', offset: { width: 0, height: 4 }, opacity: 0.30, radius: 4.65, elevation: 8 },
    { name: 'Strong', offset: { width: 0, height: 8 }, opacity: 0.44, radius: 10.32, elevation: 16 },
  ];

  const applyPreset = (preset: typeof presetShadows[0]) => {
    setShadowOffset(preset.offset);
    setShadowOpacity(preset.opacity);
    setShadowRadius(preset.radius);
    setElevation(preset.elevation);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>React Native Shadow Creator</h1>
        <p>Generate cross-platform shadow styles for React Native</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="input-section">
          <h3>Shadow Properties</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4>Quick Presets</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {presetShadows.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="case-btn"
                  style={{ padding: '0.75rem' }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label>Shadow Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  style={{ width: '50px', height: '40px', border: 'none', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem' }}
                />
              </div>
            </div>

            <div>
              <label>Shadow Offset Width: {shadowOffset.width}</label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={shadowOffset.width}
                onChange={(e) => setShadowOffset(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>

            <div>
              <label>Shadow Offset Height: {shadowOffset.height}</label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={shadowOffset.height}
                onChange={(e) => setShadowOffset(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>

            <div>
              <label>Shadow Opacity: {shadowOpacity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={shadowOpacity}
                onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>

            <div>
              <label>Shadow Radius: {shadowRadius}</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={shadowRadius}
                onChange={(e) => setShadowRadius(parseFloat(e.target.value))}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>

            <div>
              <label>Android Elevation: {elevation}</label>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={elevation}
                onChange={(e) => setElevation(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>
          </div>
        </div>

        <div className="output-section">
          <h3>Preview & Code</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone className="w-4 h-4" />
              Shadow Preview
            </h4>
            <div
              style={{
                width: '200px',
                height: '120px',
                backgroundColor: '#ffffff',
                margin: '1rem auto',
                borderRadius: '12px',
                boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(shadowColor.slice(5, 7), 16)}, ${shadowOpacity})`,
                backgroundImage: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=240&fit=crop&crop=center")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                padding: '0.5rem'
              }}
            >
              Shadow Preview
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4>iOS Shadow</h4>
                <button
                  onClick={() => copyToClipboard(generateIOSShadow(), 'ios')}
                  className={`copy-btn ${copied === 'ios' ? 'copied' : ''}`}
                  style={{ padding: '0.5rem', minWidth: 'auto', margin: 0 }}
                >
                  {copied === 'ios' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.85rem',
                overflow: 'auto'
              }}>
                {generateIOSShadow()}
              </pre>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4>Android Shadow</h4>
                <button
                  onClick={() => copyToClipboard(generateAndroidShadow(), 'android')}
                  className={`copy-btn ${copied === 'android' ? 'copied' : ''}`}
                  style={{ padding: '0.5rem', minWidth: 'auto', margin: 0 }}
                >
                  {copied === 'android' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.85rem',
                overflow: 'auto'
              }}>
                {generateAndroidShadow()}
              </pre>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4>Combined (Cross-Platform)</h4>
                <button
                  onClick={() => copyToClipboard(generateCombinedShadow(), 'combined')}
                  className={`copy-btn ${copied === 'combined' ? 'copied' : ''}`}
                  style={{ padding: '0.5rem', minWidth: 'auto', margin: 0 }}
                >
                  {copied === 'combined' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.85rem',
                overflow: 'auto'
              }}>
                {generateCombinedShadow()}
              </pre>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <h4>Usage Notes:</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius</li>
              <li>Android uses elevation for material design shadows</li>
              <li>Use combined styles for cross-platform compatibility</li>
              <li>Higher elevation values create more prominent shadows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactNativeShadowGenerator;