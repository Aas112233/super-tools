import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Download, Info, AlertCircle } from 'lucide-react';

export const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(200);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQRCode = () => {
    try {
      // Clear previous errors
      setError('');
      
      // Validate input
      if (!text.trim()) {
        setError('Please enter text to generate a QR code');
        return;
      }
      
      // Validate size
      if (size < 50 || size > 1000) {
        setError('Size must be between 50 and 1000 pixels');
        return;
      }
    } catch (err) {
      setError(`Error generating QR code: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const copyToClipboard = async () => {
    if (qrRef.current) {
      try {
        const svg = qrRef.current.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          const clipboardItem = new ClipboardItem({ 'image/svg+xml': blob });
          await navigator.clipboard.write([clipboardItem]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        setError(`Failed to copy: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      try {
        const svg = qrRef.current.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          // Create canvas to convert SVG to PNG
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image on canvas
            if (ctx) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              
              // Convert to PNG and download
              canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                  const pngUrl = URL.createObjectURL(pngBlob);
                  const link = document.createElement('a');
                  link.href = pngUrl;
                  link.download = `qrcode-${text.substring(0, 10)}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pngUrl);
                }
              }, 'image/png');
            }
            
            // Clean up
            URL.revokeObjectURL(svgUrl);
          };
          
          img.src = svgUrl;
        }
      } catch (err) {
        setError(`Failed to download: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  // Error correction levels information
  const errorCorrectionLevels = [
    { value: 'L', label: 'L - Low (7%)' },
    { value: 'M', label: 'M - Medium (15%)' },
    { value: 'Q', label: 'Q - Quartile (25%)' },
    { value: 'H', label: 'H - High (30%)' }
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>QR Code Generator</h1>
        <p>Create QR codes from text or URLs. Customize size, colors, and error correction level.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem'
      }} className="qr-grid-container">
        {/* Input Column */}
        <div className="input-section">
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="qr-text" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Text to Encode
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL"
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '1rem',
                color: 'var(--text-muted)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3" />
                  <path d="M4 7v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7" />
                  <path d="M8 7v10" />
                  <path d="M12 7v10" />
                  <path d="M16 7v10" />
                </svg>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="qr-size" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Size: {size}px
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="qr-size"
                type="range"
                min="50"
                max="500"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="qr-level" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Error Correction Level
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="qr-level"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  appearance: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              >
                {errorCorrectionLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-muted)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label htmlFor="bg-color" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Background Color
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="fg-color" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Foreground Color
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--error-light)',
              color: 'var(--error-color)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <AlertCircle style={{ marginRight: '0.75rem', marginTop: '0.25rem', flexShrink: '0' }} size={20} />
              <div>{error}</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button
              onClick={generateQRCode}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, var(--accent-color) 0%, #6366f1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Generate QR Code
            </button>

            <button
              onClick={copyToClipboard}
              disabled={copied}
              className={`copy-btn ${copied ? 'copied' : ''} ${!text ? 'disabled' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy SVG
                </>
              )}
            </button>

            <button
              onClick={downloadQRCode}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--border-color) 100%)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Download size={20} />
              Download
            </button>
          </div>

          <div style={{
            background: 'var(--accent-light)',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Info size={20} />
              QR Code Tips
            </h3>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Use error correction level M for most applications</li>
              <li>Higher error correction levels require larger QR codes</li>
              <li>Keep URLs short for smaller, more scannable QR codes</li>
              <li>Test your QR code with multiple scanners to ensure compatibility</li>
            </ul>
          </div>
        </div>

        {/* Preview Column */}
        <div className="output-section">
          <label>QR Code Preview</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <div
              ref={qrRef}
              style={{
                padding: '2rem',
                background: 'white',
                border: '2px dashed var(--border-color)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '1.5rem',
                minHeight: '200px'
              }}
            >
              {text ? (
                <QRCodeSVG 
                  value={text} 
                  size={size}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={level}
                  includeMargin={true}
                />
              ) : (
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontStyle: 'italic' 
                }}>
                  Enter text and generate QR code
                </div>
              )}
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '12px',
              width: '100%'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scan this QR code with any QR code reader</p>
              <p style={{ 
                marginTop: '0.5rem', 
                fontFamily: 'monospace', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                wordBreak: 'break-all'
              }}>
                {text || 'No text to encode'}
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--accent-light)',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Info size={20} />
              How to Use
            </h3>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><strong>Enter</strong> the text or URL you want to encode in the input field</li>
              <li><strong>Adjust</strong> the size, colors, and error correction level as needed</li>
              <li><strong>Click</strong> "Generate QR Code" to create your QR code</li>
              <li><strong>Use</strong> "Copy SVG" to copy the QR code to your clipboard or "Download" to save it as an SVG file</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};