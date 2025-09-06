import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Copy, Check, Download, Info, AlertCircle } from 'lucide-react';

const BarcodeGenerator: React.FC = () => {
  const [text, setText] = useState('1234567890');
  const [barcodeType, setBarcodeType] = useState('CODE128');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Barcode types supported by JsBarcode
  const barcodeTypes = [
    { value: 'CODE128', label: 'CODE128 (default)' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'UPC', label: 'UPC' },
    { value: 'UPCE', label: 'UPC-E' },
    { value: 'ITF14', label: 'ITF-14' },
    { value: 'ITF', label: 'ITF' },
    { value: 'MSI', label: 'MSI' },
    { value: 'MSI10', label: 'MSI10' },
    { value: 'MSI11', label: 'MSI11' },
    { value: 'MSI1010', label: 'MSI1010' },
    { value: 'MSI1110', label: 'MSI1110' },
    { value: 'pharmacode', label: 'Pharmacode' },
  ];

  useEffect(() => {
    generateBarcode();
  }, [text, barcodeType]);

  const generateBarcode = () => {
    if (!barcodeRef.current) return;

    try {
      // Clear previous errors
      setError('');

      // Validate input based on barcode type
      if (!text.trim()) {
        setError('Please enter text to generate a barcode');
        return;
      }

      // Generate the barcode
      if (svgRef.current) {
        JsBarcode(svgRef.current, text, {
          format: barcodeType,
          displayValue: true,
          fontSize: 16,
          textAlign: 'center',
          textPosition: 'bottom',
          textMargin: 5,
          background: '#ffffff',
          lineColor: '#000000',
          margin: 10,
        });
      }
    } catch (err) {
      setError(`Error generating barcode: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const copyToClipboard = async () => {
    if (svgRef.current) {
      try {
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const clipboardItem = new ClipboardItem({ 'image/svg+xml': blob });
        await navigator.clipboard.write([clipboardItem]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError(`Failed to copy: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const downloadBarcode = () => {
    if (svgRef.current) {
      try {
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
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
                link.download = `barcode-${text}.png`;
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
      } catch (err) {
        setError(`Failed to download: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Barcode Generator</h1>
        <p>Create barcodes from text or numbers. Choose from multiple barcode formats and download or copy your barcode.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {/* Input Column */}
        <div className="input-section">
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="barcode-text" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Text to Encode
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="barcode-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or numbers"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
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
            <label htmlFor="barcode-type" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Barcode Type
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="barcode-type"
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
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
                {barcodeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                  <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-4 4z" />
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
              onClick={generateBarcode}
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
              Generate Barcode
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
              onClick={downloadBarcode}
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
              Barcode Tips
            </h3>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>CODE128 is recommended for most use cases</li>
              <li>EAN-13 requires exactly 12 digits</li>
              <li>UPC requires exactly 11 digits</li>
              <li>Only alphanumeric characters are supported in most formats</li>
            </ul>
          </div>
        </div>

        {/* Preview Column */}
        <div className="output-section">
          <label>Barcode Preview</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <div
              ref={barcodeRef}
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
              <svg
                ref={svgRef}
                style={{ maxWidth: '100%', width: '100%', height: 'auto' }}
              />
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '12px',
              width: '100%'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scan this barcode with any barcode reader</p>
              <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: '600' }}>
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
              <li><strong>Enter</strong> the text or numbers you want to encode in the input field</li>
              <li><strong>Select</strong> the appropriate barcode format for your needs</li>
              <li><strong>Click</strong> "Generate Barcode" to create your barcode</li>
              <li><strong>Use</strong> "Copy SVG" to copy the barcode to your clipboard or "Download" to save it as an SVG file</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;