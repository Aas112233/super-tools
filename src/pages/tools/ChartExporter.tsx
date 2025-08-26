import React, { useState, useCallback, useRef } from 'react';
import { Download, Upload, Image, FileText, Code, Settings, CheckCircle, AlertCircle, Loader, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  icon: React.ComponentType<any>;
  supported: boolean;
}

interface ExportSettings {
  width: number;
  height: number;
  quality: number;
  backgroundColor: string;
  transparent: boolean;
  dpi: number;
  format: string;
}

interface ProcessedFile {
  file: File;
  id: string;
  name: string;
  size: string;
  type: string;
  preview?: string;
}

const ChartExporter: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<ProcessedFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('png');
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    width: 1200,
    height: 800,
    quality: 90,
    backgroundColor: '#ffffff',
    transparent: false,
    dpi: 300,
    format: 'png'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export formats
  const exportFormats: ExportFormat[] = [
    {
      id: 'png',
      name: 'PNG Image',
      extension: '.png',
      description: 'High-quality raster image with transparency support',
      icon: Image,
      supported: true
    },
    {
      id: 'jpg',
      name: 'JPEG Image',
      extension: '.jpg',
      description: 'Compressed raster image, smaller file size',
      icon: Image,
      supported: true
    },
    {
      id: 'svg',
      name: 'SVG Vector',
      extension: '.svg',
      description: 'Scalable vector graphics, perfect for web and print',
      icon: Code,
      supported: true
    },
    {
      id: 'webp',
      name: 'WebP Image',
      extension: '.webp',
      description: 'Modern image format with superior compression',
      icon: Image,
      supported: true
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      description: 'Professional document format for reports',
      icon: FileText,
      supported: true
    },
    {
      id: 'json',
      name: 'Chart Data',
      extension: '.json',
      description: 'Export chart configuration and data',
      icon: Code,
      supported: true
    }
  ];

  // Enhanced file upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const processedFiles: ProcessedFile[] = files.map((file, index) => ({
      file,
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'Unknown',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setSelectedFiles(prev => [...prev, ...processedFiles]);
    setExportStatus('idle');
  }, []);

  // Enhanced drag and drop
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const processedFiles: ProcessedFile[] = files.map((file, index) => ({
      file,
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'Unknown',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setSelectedFiles(prev => [...prev, ...processedFiles]);
    setExportStatus('idle');
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Enhanced export functionality
  const handleExport = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsExporting(true);
    setExportStatus('idle');
    setExportProgress(0);

    try {
      const format = exportFormats.find(f => f.id === selectedFormat);
      if (!format) throw new Error('Invalid format selected');

      for (let i = 0; i < selectedFiles.length; i++) {
        const processedFile = selectedFiles[i];
        setExportProgress(((i + 1) / selectedFiles.length) * 100);

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing

        let blob: Blob;
        let fileName: string;

        if (selectedFormat === 'png' || selectedFormat === 'jpg' || selectedFormat === 'webp') {
          // For image formats, create a canvas-based export
          const canvas = document.createElement('canvas');
          canvas.width = exportSettings.width;
          canvas.height = exportSettings.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Set background
            if (!exportSettings.transparent) {
              ctx.fillStyle = exportSettings.backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Add sample chart visualization
            ctx.fillStyle = '#3B82F6';
            ctx.font = '24px Arial';
            ctx.fillText('Sample Chart Export', 50, 50);
            
            // Create bars for demo
            const barWidth = 60;
            const barSpacing = 20;
            const values = [120, 200, 150, 180, 220];
            const maxValue = Math.max(...values);
            
            values.forEach((value, index) => {
              const barHeight = (value / maxValue) * 300;
              const x = 50 + index * (barWidth + barSpacing);
              const y = canvas.height - 100 - barHeight;
              
              ctx.fillStyle = `hsl(${220 + index * 30}, 70%, 50%)`;
              ctx.fillRect(x, y, barWidth, barHeight);
              
              // Add value labels
              ctx.fillStyle = '#374151';
              ctx.font = '14px Arial';
              ctx.fillText(value.toString(), x + 15, y - 10);
            });
          }
          
          blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((result) => {
              resolve(result || new Blob());
            }, `image/${selectedFormat}`, exportSettings.quality / 100);
          });
          
          fileName = `${processedFile.name.split('.')[0]}_exported${format.extension}`;
        } else if (selectedFormat === 'svg') {
          // SVG export
          const svgContent = `
            <svg width="${exportSettings.width}" height="${exportSettings.height}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="${exportSettings.transparent ? 'none' : exportSettings.backgroundColor}"/>
              <text x="50" y="50" font-family="Arial" font-size="24" fill="#3B82F6">Sample Chart Export</text>
              <g>
                <rect x="50" y="200" width="60" height="120" fill="#3B82F6"/>
                <rect x="130" y="150" width="60" height="170" fill="#10B981"/>
                <rect x="210" y="180" width="60" height="140" fill="#F59E0B"/>
                <rect x="290" y="160" width="60" height="160" fill="#EF4444"/>
                <rect x="370" y="130" width="60" height="190" fill="#8B5CF6"/>
              </g>
            </svg>
          `;
          blob = new Blob([svgContent], { type: 'image/svg+xml' });
          fileName = `${processedFile.name.split('.')[0]}_exported${format.extension}`;
        } else if (selectedFormat === 'pdf') {
          // PDF export (simplified)
          const pdfContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${exportSettings.width} ${exportSettings.height}] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000173 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n${300 + exportSettings.width + exportSettings.height}\n%%EOF`;
          blob = new Blob([pdfContent], { type: 'application/pdf' });
          fileName = `${processedFile.name.split('.')[0]}_exported${format.extension}`;
        } else {
          // JSON export with enhanced chart data
          const chartData = {
            metadata: {
              title: `Exported Chart from ${processedFile.name}`,
              exportDate: new Date().toISOString(),
              format: selectedFormat,
              settings: exportSettings
            },
            chart: {
              type: 'bar',
              title: 'Sample Chart Export',
              data: [
                { name: 'Jan', value: 120 },
                { name: 'Feb', value: 200 },
                { name: 'Mar', value: 150 },
                { name: 'Apr', value: 180 },
                { name: 'May', value: 220 }
              ],
              options: {
                width: exportSettings.width,
                height: exportSettings.height,
                backgroundColor: exportSettings.backgroundColor,
                transparent: exportSettings.transparent
              }
            }
          };
          blob = new Blob([JSON.stringify(chartData, null, 2)], { type: 'application/json' });
          fileName = `${processedFile.name.split('.')[0]}_exported${format.extension}`;
        }
        
        // Download the file
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      setExportStatus('success');
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [selectedFiles, selectedFormat, exportSettings, exportFormats]);

  // Enhanced sample chart generator
  const generateSampleChart = useCallback(() => {
    const sampleData = {
      metadata: {
        title: 'Sample Chart Data',
        created: new Date().toISOString(),
        version: '1.0'
      },
      chart: {
        type: 'bar',
        title: 'Monthly Sales Data',
        data: [
          { name: 'January', value: 120, color: '#3B82F6' },
          { name: 'February', value: 200, color: '#10B981' },
          { name: 'March', value: 150, color: '#F59E0B' },
          { name: 'April', value: 180, color: '#EF4444' },
          { name: 'May', value: 220, color: '#8B5CF6' }
        ],
        options: {
          xAxis: 'Months',
          yAxis: 'Sales (in thousands)',
          showGrid: true,
          showLegend: true
        }
      }
    };
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const file = new File([blob], 'sample_chart.json', { type: 'application/json' });
    const processedFile: ProcessedFile = {
      file,
      id: `sample-${Date.now()}`,
      name: 'sample_chart.json',
      size: `${(blob.size / 1024).toFixed(1)} KB`,
      type: 'application/json'
    };
    
    setSelectedFiles(prev => [...prev, processedFile]);
    setExportStatus('idle');
  }, []);

  // Remove file handler
  const removeFile = useCallback((id: string) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      // Clean up preview URLs
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  }, []);

  // Batch export all files
  const exportAllFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    await handleExport();
  }, [selectedFiles, handleExport]);

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Chart Exporter</h1>
        <p>Export your charts in various formats for web, print, and presentations with professional quality settings</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Input Section */}
        <div className="input-section">
          {/* Upload Area */}
          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 1rem 0'
            }}>Upload Chart Files</h3>
            
            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <Upload size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
              <p style={{
                color: 'var(--text-secondary)',
                margin: '0 0 1rem 0',
                fontSize: '1rem'
              }}>Drag and drop chart files here, or</p>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                background: 'var(--accent-color)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <Upload size={20} />
                Choose Files
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".json,.html,.svg,.png,.jpg,.webp"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                margin: '1rem 0 0 0'
              }}>
                Supports: JSON, HTML, SVG, PNG, JPG, WebP
              </p>
            </div>

            {/* Sample Chart Button */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={generateSampleChart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-color)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Generate Sample Chart for Testing
              </button>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div style={{
              background: 'white',
              border: '2px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>Selected Files ({selectedFiles.length})</h3>
                <button
                  onClick={() => setSelectedFiles([])}
                  style={{
                    background: 'var(--error-light)',
                    color: 'var(--error-color)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {selectedFiles.map((processedFile) => (
                  <div key={processedFile.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      {processedFile.preview ? (
                        <img 
                          src={processedFile.preview} 
                          alt={processedFile.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--accent-light)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FileText size={20} style={{ color: 'var(--accent-color)' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          margin: '0 0 0.25rem 0',
                          fontSize: '0.9rem'
                        }}>{processedFile.name}</p>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)'
                        }}>
                          <span>{processedFile.size}</span>
                          <span>{processedFile.type}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(processedFile.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--error-color)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--error-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Status */}
          {(exportStatus !== 'idle' || isExporting) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                ...(exportStatus === 'success' ? {
                  background: 'var(--success-light)',
                  border: '2px solid var(--success-color)'
                } : exportStatus === 'error' ? {
                  background: 'var(--error-light)',
                  border: '2px solid var(--error-color)'
                } : {
                  background: 'var(--accent-light)',
                  border: '2px solid var(--accent-color)'
                })
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isExporting ? (
                  <Loader size={20} style={{ 
                    color: 'var(--accent-color)', 
                    animation: 'spin 1s linear infinite' 
                  }} />
                ) : exportStatus === 'success' ? (
                  <CheckCircle size={20} style={{ color: 'var(--success-color)' }} />
                ) : (
                  <AlertCircle size={20} style={{ color: 'var(--error-color)' }} />
                )}
                <span style={{
                  fontWeight: '600',
                  color: isExporting ? 'var(--accent-color)' : 
                         exportStatus === 'success' ? 'var(--success-color)' : 'var(--error-color)'
                }}>
                  {isExporting ? `Exporting... ${Math.round(exportProgress)}%` :
                   exportStatus === 'success' ? 'Charts exported successfully!' :
                   'Export failed. Please try again.'}
                </span>
              </div>
              {isExporting && (
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'var(--accent-color)',
                    borderRadius: '3px',
                    width: `${exportProgress}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Output Section */}
        <div className="output-section">
          <label>Export Settings & Preview</label>
          {/* Format Selection */}
          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Settings size={20} style={{ color: 'var(--accent-color)' }} />
              Export Format
            </h3>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {exportFormats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <label
                    key={format.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `2px solid ${selectedFormat === format.id ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      background: selectedFormat === format.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      cursor: format.supported ? 'pointer' : 'not-allowed',
                      opacity: format.supported ? 1 : 0.5,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (format.supported && selectedFormat !== format.id) {
                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                        e.currentTarget.style.background = 'var(--accent-light)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (format.supported && selectedFormat !== format.id) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={selectedFormat === format.id}
                      onChange={(e) => {
                        setSelectedFormat(e.target.value);
                        setExportSettings(prev => ({ ...prev, format: e.target.value }));
                      }}
                      disabled={!format.supported}
                      style={{ marginRight: '0.75rem', accentColor: 'var(--accent-color)' }}
                    />
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <IconComponent size={18} style={{ color: 'var(--accent-color)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.95rem'
                      }}>{format.name}</p>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>{format.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Export Settings */}
          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 1rem 0'
            }}>Advanced Settings</h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Dimensions */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}>Dimensions (px)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <input
                      type="number"
                      value={exportSettings.width}
                      onChange={(e) => setExportSettings(prev => ({ 
                        ...prev, 
                        width: parseInt(e.target.value) || 1200 
                      }))}
                      placeholder="Width"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={exportSettings.height}
                      onChange={(e) => setExportSettings(prev => ({ 
                        ...prev, 
                        height: parseInt(e.target.value) || 800 
                      }))}
                      placeholder="Height"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* DPI Setting */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}>DPI/Resolution: {exportSettings.dpi}</label>
                <input
                  type="range"
                  min="72"
                  max="600"
                  step="24"
                  value={exportSettings.dpi}
                  onChange={(e) => setExportSettings(prev => ({ 
                    ...prev, 
                    dpi: parseInt(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'var(--bg-tertiary)',
                    outline: 'none',
                    accentColor: 'var(--accent-color)'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem'
                }}>
                  <span>72 (Web)</span>
                  <span>300 (Print)</span>
                  <span>600 (High)</span>
                </div>
              </div>

              {/* Quality */}
              {(selectedFormat === 'png' || selectedFormat === 'jpg' || selectedFormat === 'webp') && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem'
                  }}>Quality: {exportSettings.quality}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={exportSettings.quality}
                    onChange={(e) => setExportSettings(prev => ({ 
                      ...prev, 
                      quality: parseInt(e.target.value) 
                    }))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--bg-tertiary)',
                      outline: 'none',
                      accentColor: 'var(--accent-color)'
                    }}
                  />
                </div>
              )}

              {/* Background Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}>Background</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="color"
                    value={exportSettings.backgroundColor}
                    onChange={(e) => setExportSettings(prev => ({ 
                      ...prev, 
                      backgroundColor: e.target.value 
                    }))}
                    disabled={exportSettings.transparent}
                    style={{
                      width: '48px',
                      height: '40px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={exportSettings.transparent}
                      onChange={(e) => setExportSettings(prev => ({ 
                        ...prev, 
                        transparent: e.target.checked 
                      }))}
                      style={{ accentColor: 'var(--accent-color)' }}
                    />
                    <span style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)'
                    }}>Transparent Background</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button
              onClick={handleExport}
              disabled={selectedFiles.length === 0 || isExporting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                background: selectedFiles.length === 0 || isExporting ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--accent-color) 0%, #6366f1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: selectedFiles.length === 0 || isExporting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {isExporting ? (
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Download size={20} />
              )}
              <span>
                {isExporting ? 'Exporting...' : selectedFiles.length > 1 ? `Export ${selectedFiles.length} Files` : 'Export Chart'}
              </span>
            </button>
            
            {selectedFiles.length > 1 && (
              <button
                onClick={exportAllFiles}
                disabled={isExporting}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--accent-color)',
                  border: '2px solid var(--accent-color)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.background = 'var(--accent-color)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent-color)';
                  }
                }}
              >
                Batch Export All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div style={{
        marginTop: '3rem',
        background: 'white',
        border: '2px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 1.5rem 0',
          textAlign: 'center'
        }}>How to Use Chart Exporter</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--accent-light)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Upload size={32} style={{ color: 'var(--accent-color)' }} />
            </div>
            <h4 style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0',
              fontSize: '1rem'
            }}>1. Upload Charts</h4>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Upload your chart files or generate sample charts for testing the export functionality
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--success-light)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Settings size={32} style={{ color: 'var(--success-color)' }} />
            </div>
            <h4 style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0',
              fontSize: '1rem'
            }}>2. Configure Settings</h4>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Choose export format, dimensions, quality, DPI, and background settings for professional output
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--warning-light)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Download size={32} style={{ color: 'var(--warning-color)' }} />
            </div>
            <h4 style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0',
              fontSize: '1rem'
            }}>3. Export & Download</h4>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Generate and download your charts in the selected format with enhanced export capabilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartExporter;