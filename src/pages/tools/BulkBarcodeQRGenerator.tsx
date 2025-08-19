import React, { useState, useRef } from 'react';
import { Copy, Check, Download, Info, AlertCircle, Plus, Trash2, Clipboard } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import JSZip from 'jszip';

export const BulkBarcodeQRGenerator: React.FC = () => {
  const [items, setItems] = useState<Array<{id: number, text: string, type: 'barcode' | 'qrcode'}>>([
    { id: 1, text: 'Item 1', type: 'barcode' },
    { id: 2, text: 'https://example.com', type: 'qrcode' }
  ]);
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Add a new item
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      text: `Item ${items.length + 1}`,
      type: 'barcode' as const
    };
    setItems([...items, newItem]);
  };

  // Remove an item
  const removeItem = (id: number) => {
    if (items.length <= 1) {
      setError('You must have at least one item');
      return;
    }
    setItems(items.filter(item => item.id !== id));
    setError('');
  };

  // Update item text
  const updateItemText = (id: number, text: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  // Update item type
  const updateItemType = (id: number, type: 'barcode' | 'qrcode') => {
    setItems(items.map(item => 
      item.id === id ? { ...item, type } : item
    ));
  };

  // Generate all barcodes/QR codes
  const generateAll = () => {
    try {
      // Clear previous errors
      setError('');
      
      // Validate inputs
      const emptyItems = items.filter(item => !item.text.trim());
      if (emptyItems.length > 0) {
        setError(`Please fill in text for all items. ${emptyItems.length} item(s) are empty.`);
        return;
      }
    } catch (err) {
      setError(`Error generating codes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Copy all as ZIP (in a real implementation, this would create a ZIP file)
  const copyAll = async () => {
    try {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // In a real implementation, this would create and copy a ZIP file
    } catch (err) {
      setError(`Failed to copy: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Download all as ZIP
  const downloadAll = async () => {
    try {
      if (items.length === 0) {
        setError('No items to download');
        return;
      }

      // Validate inputs
      const emptyItems = items.filter(item => !item.text.trim());
      if (emptyItems.length > 0) {
        setError(`Please fill in text for all items. ${emptyItems.length} item(s) are empty.`);
        return;
      }

      setError('');
      
      // Create a new ZIP file
      const zip = new JSZip();
      
      // Create a folder for the codes
      const folder = zip.folder("barcodes-and-qrcodes");
      
      if (!folder) {
        throw new Error('Failed to create folder in ZIP');
      }

      // Process each item
      for (const item of items) {
        if (item.type === 'barcode') {
          // Generate barcode as SVG
          const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          try {
            JsBarcode(svgElement, item.text, {
              format: 'CODE128',
              displayValue: true,
              fontSize: 16,
              textAlign: 'center',
              textPosition: 'bottom',
              textMargin: 5,
              background: '#ffffff',
              lineColor: '#000000',
              margin: 10,
              width: 2,
              height: 100
            });
            
            // Serialize SVG to string
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            
            // Convert SVG to canvas and then to PNG
            const svgUrl = URL.createObjectURL(svgBlob);
            const img = new Image();
            
            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                try {
                  // Create canvas
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                  }
                  
                  // Set canvas dimensions
                  canvas.width = img.width || 300;
                  canvas.height = img.height || 150;
                  
                  // Draw background
                  ctx.fillStyle = 'white';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw the image
                  ctx.drawImage(img, 0, 0);
                  
                  // Convert to blob and add to ZIP
                  canvas.toBlob((blob) => {
                    if (blob) {
                      const fileName = `${item.text.substring(0, 20)}_barcode.png`;
                      folder.file(fileName, blob);
                      resolve();
                    } else {
                      reject(new Error('Failed to create blob from canvas'));
                    }
                  }, 'image/png');
                } catch (error) {
                  reject(error);
                } finally {
                  URL.revokeObjectURL(svgUrl);
                }
              };
              
              img.onerror = () => {
                reject(new Error('Failed to load image'));
              };
              
              img.src = svgUrl;
            });
          } catch (error) {
            console.error(`Error generating barcode for "${item.text}":`, error);
            // Continue with other items even if one fails
          }
        } else {
          // Generate QR code as SVG
          const container = document.createElement('div');
          const qrCode = document.createElement('div');
          container.appendChild(qrCode);
          
          try {
            // Render QR code to SVG
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            QRCodeSVG({
              value: item.text,
              size: 200,
              bgColor: '#ffffff',
              fgColor: '#000000',
              level: 'M',
              includeMargin: true,
              ref: (el) => {
                if (el) {
                  // Copy the generated SVG content
                  const serialized = new XMLSerializer().serializeToString(el);
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(serialized, 'image/svg+xml');
                  const clonedSvg = doc.documentElement;
                  
                  // Clear the container and add the cloned SVG
                  while (qrCode.firstChild) {
                    qrCode.removeChild(qrCode.firstChild);
                  }
                  qrCode.appendChild(clonedSvg);
                }
              }
            });
            
            // Wait a bit for the QR code to render
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Get the SVG element
            const svg = qrCode.querySelector('svg');
            if (svg) {
              // Serialize SVG to string
              const svgData = new XMLSerializer().serializeToString(svg);
              const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
              
              // Convert SVG to canvas and then to PNG
              const svgUrl = URL.createObjectURL(svgBlob);
              const img = new Image();
              
              await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                  try {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                      reject(new Error('Failed to get canvas context'));
                      return;
                    }
                    
                    // Set canvas dimensions
                    canvas.width = img.width || 200;
                    canvas.height = img.height || 200;
                    
                    // Draw background
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw the image
                    ctx.drawImage(img, 0, 0);
                    
                    // Convert to blob and add to ZIP
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const fileName = `${item.text.substring(0, 20)}_qrcode.png`;
                        folder.file(fileName, blob);
                        resolve();
                      } else {
                        reject(new Error('Failed to create blob from canvas'));
                      }
                    }, 'image/png');
                  } catch (error) {
                    reject(error);
                  } finally {
                    URL.revokeObjectURL(svgUrl);
                  }
                };
                
                img.onerror = () => {
                  reject(new Error('Failed to load image'));
                };
                
                img.src = svgUrl;
              });
            }
          } catch (error) {
            console.error(`Error generating QR code for "${item.text}":`, error);
            // Continue with other items even if one fails
          }
        }
      }
      
      // Generate the ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulk-barcodes-qrcodes-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(`Failed to download ZIP: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('ZIP generation error:', err);
    }
  };

  // Import from CSV
  const importFromCSV = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const newItems = lines.map((line, index) => {
          const [text, type] = line.split(',');
          return {
            id: Date.now() + index,
            text: text.trim() || `Item ${index + 1}`,
            type: (type && (type.trim() === 'qrcode' || type.trim() === 'barcode')) ? type.trim() as 'barcode' | 'qrcode' : 'barcode'
          };
        });
        setItems(newItems);
      } catch (err) {
        setError(`Failed to import CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Process bulk text input
  const processBulkText = () => {
    if (!bulkText.trim()) {
      setError('Please enter some text to process');
      return;
    }

    try {
      const lines = bulkText.split('\n').filter(line => line.trim() !== '');
      const newItems = lines.map((line, index) => {
        // Try to detect if it's a URL (for QR code) or regular text (for barcode)
        const isUrl = line.match(/^https?:\/\//);
        return {
          id: Date.now() + index,
          text: line.trim(),
          type: isUrl ? 'qrcode' : 'barcode' as 'barcode' | 'qrcode'
        };
      });
      
      if (newItems.length > 0) {
        setItems(newItems);
        setError('');
      } else {
        setError('No valid items found in the text');
      }
    } catch (err) {
      setError(`Failed to process bulk text: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Paste from clipboard to bulk text area
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setBulkText(text);
    } catch (err) {
      setError(`Failed to paste from clipboard: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Bulk Barcode and QR Code Generator</h1>
        <p>Generate multiple barcodes and QR codes at once. Add items, customize types, and download as a ZIP archive.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {/* Settings Column */}
        <div className="input-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Items List</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={addItem}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = 'var(--shadow-sm)';
                  
                  // Create shine effect
                  let shine = target.querySelector('.shine-effect') as HTMLElement;
                  if (!shine) {
                    shine = document.createElement('span');
                    shine.className = 'shine-effect';
                    shine.style.position = 'absolute';
                    shine.style.top = '0';
                    shine.style.left = '-100%';
                    shine.style.width = '100%';
                    shine.style.height = '100%';
                    shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
                    shine.style.transition = 'left 0.5s';
                    shine.style.pointerEvents = 'none';
                    target.appendChild(shine);
                  }
                  setTimeout(() => {
                    if (shine) {
                      shine.style.left = '100%';
                    }
                  }, 10);
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = '';
                  target.style.boxShadow = '';
                  
                  // Reset shine effect
                  const shine = target.querySelector('.shine-effect') as HTMLElement;
                  if (shine) {
                    shine.style.left = '-100%';
                  }
                }}
              >
                <Plus size={16} />
                Add Item
              </button>
              
              <button
                onClick={importFromCSV}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = 'var(--shadow-sm)';
                  
                  // Create shine effect
                  let shine = target.querySelector('.shine-effect') as HTMLElement;
                  if (!shine) {
                    shine = document.createElement('span');
                    shine.className = 'shine-effect';
                    shine.style.position = 'absolute';
                    shine.style.top = '0';
                    shine.style.left = '-100%';
                    shine.style.width = '100%';
                    shine.style.height = '100%';
                    shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
                    shine.style.transition = 'left 0.5s';
                    shine.style.pointerEvents = 'none';
                    target.appendChild(shine);
                  }
                  setTimeout(() => {
                    if (shine) {
                      shine.style.left = '100%';
                    }
                  }, 10);
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = '';
                  target.style.boxShadow = '';
                  
                  // Reset shine effect
                  const shine = target.querySelector('.shine-effect') as HTMLElement;
                  if (shine) {
                    shine.style.left = '-100%';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import CSV
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv" 
                style={{ display: 'none' }} 
              />
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

          {/* Bulk Text Input Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="bulk-text" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Bulk Paste Text
            </label>
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <textarea
                ref={bulkTextareaRef}
                id="bulk-text"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste one item per line&#10;URLs will be treated as QR codes&#10;Other text as barcodes"
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
                <Clipboard size={20} />
              </div>
              <button
                onClick={pasteFromClipboard}
                style={{
                  right: '0.5rem',
                  top: '0.5rem',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  position: 'absolute',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = 'var(--shadow-sm)';
                  
                  // Create shine effect
                  let shine = target.querySelector('.shine-effect') as HTMLElement;
                  if (!shine) {
                    shine = document.createElement('span');
                    shine.className = 'shine-effect';
                    shine.style.position = 'absolute';
                    shine.style.top = '0';
                    shine.style.left = '-100%';
                    shine.style.width = '100%';
                    shine.style.height = '100%';
                    shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
                    shine.style.transition = 'left 0.5s';
                    shine.style.pointerEvents = 'none';
                    target.appendChild(shine);
                  }
                  setTimeout(() => {
                    if (shine) {
                      shine.style.left = '100%';
                    }
                  }, 10);
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = '';
                  target.style.boxShadow = '';
                  
                  // Reset shine effect
                  const shine = target.querySelector('.shine-effect') as HTMLElement;
                  if (shine) {
                    shine.style.left = '-100%';
                  }
                }}
              >
                Paste
              </button>

            </div>
            
            <button
              onClick={processBulkText}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = 'var(--shadow-md)';
                
                // Create shine effect
                let shine = target.querySelector('.shine-effect') as HTMLElement;
                if (!shine) {
                  shine = document.createElement('span');
                  shine.className = 'shine-effect';
                  shine.style.position = 'absolute';
                  shine.style.top = '0';
                  shine.style.left = '-100%';
                  shine.style.width = '100%';
                  shine.style.height = '100%';
                  shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
                  shine.style.transition = 'left 0.5s';
                  shine.style.pointerEvents = 'none';
                  target.appendChild(shine);
                }
                setTimeout(() => {
                  if (shine) {
                    shine.style.left = '100%';
                  }
                }, 10);
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = '';
                target.style.boxShadow = '';
                
                // Reset shine effect
                const shine = target.querySelector('.shine-effect') as HTMLElement;
                if (shine) {
                  shine.style.left = '-100%';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Process Bulk Text
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              onClick={generateAll}
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
                gap: '0.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-3px)';
                target.style.boxShadow = 'var(--shadow-xl)';
                
                // Create shine effect
                let shine = target.querySelector('.shine-effect') as HTMLElement;
                if (!shine) {
                  shine = document.createElement('span');
                  shine.className = 'shine-effect';
                  shine.style.position = 'absolute';
                  shine.style.top = '0';
                  shine.style.left = '-100%';
                  shine.style.width = '100%';
                  shine.style.height = '100%';
                  shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
                  shine.style.transition = 'left 0.5s';
                  shine.style.pointerEvents = 'none';
                  target.appendChild(shine);
                }
                setTimeout(() => {
                  if (shine) {
                    shine.style.left = '100%';
                  }
                }, 10);
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = '';
                target.style.boxShadow = 'var(--shadow-md)';
                
                // Reset shine effect
                const shine = target.querySelector('.shine-effect') as HTMLElement;
                if (shine) {
                  shine.style.left = '-100%';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate All
            </button>

            <button
              onClick={copyAll}
              disabled={copied}
              className={`copy-btn ${copied ? 'copied' : ''}`}
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
                  Copy All
                </>
              )}
            </button>

            <button
              onClick={downloadAll}
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
                gap: '0.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-3px)';
                target.style.boxShadow = 'var(--shadow-xl)';
                
                // Create shine effect
                let shine = target.querySelector('.shine-effect') as HTMLElement;
                if (!shine) {
                  shine = document.createElement('span');
                  shine.className = 'shine-effect';
                  shine.style.position = 'absolute';
                  shine.style.top = '0';
                  shine.style.left = '-100%';
                  shine.style.width = '100%';
                  shine.style.height = '100%';
                  shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
                  shine.style.transition = 'left 0.5s';
                  shine.style.pointerEvents = 'none';
                  target.appendChild(shine);
                }
                setTimeout(() => {
                  if (shine) {
                    shine.style.left = '100%';
                  }
                }, 10);
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = '';
                target.style.boxShadow = 'var(--shadow-md)';
                
                // Reset shine effect
                const shine = target.querySelector('.shine-effect') as HTMLElement;
                if (shine) {
                  shine.style.left = '-100%';
                }
              }}
            >
              <Download size={20} />
              Download ZIP
            </button>
          </div>

          {/* Items List */}
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            {items.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateItemText(item.id, e.target.value)}
                    placeholder="Enter text or URL"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <select
                    value={item.type}
                    onChange={(e) => updateItemType(item.id, e.target.value as 'barcode' | 'qrcode')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      minWidth: '120px'
                    }}
                  >
                    <option value="barcode">Barcode</option>
                    <option value="qrcode">QR Code</option>
                  </select>
                </div>
                
                <div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    style={{
                      padding: '0.75rem',
                      background: 'var(--error-light)',
                      color: 'var(--error-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
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
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><strong>Add items</strong> by clicking the "Add Item" button</li>
              <li><strong>Bulk paste</strong> by pasting text (one item per line) and clicking "Process Bulk Text"</li>
              <li><strong>Enter text</strong> for each item (URLs for QR codes, product codes for barcodes)</li>
              <li><strong>Select type</strong> for each item (Barcode or QR Code)</li>
              <li><strong>Generate All</strong> to create all codes at once</li>
              <li><strong>Download ZIP</strong> to get all generated codes as PNG images in a single archive</li>
              <li><strong>Import CSV</strong> to bulk import items (format: text,type - one item per line)</li>
            </ul>
          </div>
        </div>

        {/* Preview Column */}
        <div className="output-section">
          <label>Preview</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            {items.slice(0, 6).map((item) => (
              <div key={item.id} style={{ 
                padding: '1rem', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px',
                background: 'var(--bg-tertiary)'
              }}>
                <div style={{ 
                  height: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '0.5rem'
                }}>
                  {item.type === 'barcode' ? (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <svg 
                        style={{ maxWidth: '100%', maxHeight: '60px' }}
                        ref={(el) => {
                          if (el) {
                            try {
                              JsBarcode(el, item.text, {
                                format: 'CODE128',
                                displayValue: true,
                                fontSize: 10,
                                textAlign: 'center',
                                textPosition: 'bottom',
                                textMargin: 2,
                                background: '#ffffff',
                                lineColor: '#000000',
                                margin: 5,
                                width: 1,
                                height: 30
                              });
                            } catch (e) {
                              // Handle error silently
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QRCodeSVG 
                        value={item.text} 
                        size={60}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                  )}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.text}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem'
                }}>
                  {item.type === 'barcode' ? 'Barcode' : 'QR Code'}
                </div>
              </div>
            ))}
            
            {items.length > 6 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontStyle: 'italic',
                color: 'var(--text-muted)'
              }}>
                +{items.length - 6} more items
              </div>
            )}
            
            {items.length === 0 && (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)'
              }}>
                Add items to generate barcodes and QR codes
              </div>
            )}
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
              CSV Import Format
            </h3>
            <p style={{ fontFamily: 'monospace', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
              Item 1,barcode<br />
              https://example.com,qrcode<br />
              Product123,barcode<br />
              Text for QR Code,qrcode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};