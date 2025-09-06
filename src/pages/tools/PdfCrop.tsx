import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { Crop, Eye, Move, RotateCw } from 'lucide-react';

interface CropSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
  units: 'points' | 'inches' | 'mm';
  presetMode: 'custom' | 'margin' | 'center';
  marginSize: number;
  centerWidth: number;
  centerHeight: number;
}

interface CropPreset {
  name: string;
  settings: Partial<CropSettings>;
}

const CROP_PRESETS: CropPreset[] = [
  { name: 'Remove 0.5" margins', settings: { presetMode: 'margin', marginSize: 36, units: 'points' } },
  { name: 'Remove 1" margins', settings: { presetMode: 'margin', marginSize: 72, units: 'points' } },
  { name: 'Letter to A4', settings: { presetMode: 'center', centerWidth: 595, centerHeight: 842, units: 'points' } },
  { name: 'A4 to Letter', settings: { presetMode: 'center', centerWidth: 612, centerHeight: 792, units: 'points' } },
];

const PdfCrop: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    units: 'points',
    presetMode: 'custom',
    marginSize: 36,
    centerWidth: 612,
    centerHeight: 792
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlob, setProcessedPdfBlob] = useState<Blob | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [originalPageSize, setOriginalPageSize] = useState<{ width: number; height: number } | null>(null);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setProcessedPdfBlob(null);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setPdfPageCount(pageCount);
        
        if (pageCount > 0) {
          const firstPage = pdfDoc.getPage(0);
          const { width, height } = firstPage.getSize();
          setOriginalPageSize({ width, height });
          setMessage(`PDF loaded with ${pageCount} pages (${Math.round(width)} × ${Math.round(height)} points)`);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        setMessage('Failed to load PDF file');
      }
    }
  }, []);

  const convertUnitsToPoints = (value: number, units: string): number => {
    switch (units) {
      case 'inches':
        return value * 72;
      case 'mm':
        return value * 2.83465;
      default:
        return value;
    }
  };

  const getCropBox = () => {
    if (!originalPageSize) return null;

    let cropBox = {
      x: convertUnitsToPoints(cropSettings.left, cropSettings.units),
      y: convertUnitsToPoints(cropSettings.bottom, cropSettings.units),
      width: originalPageSize.width - convertUnitsToPoints(cropSettings.left + cropSettings.right, cropSettings.units),
      height: originalPageSize.height - convertUnitsToPoints(cropSettings.top + cropSettings.bottom, cropSettings.units)
    };

    // Apply preset modes
    if (cropSettings.presetMode === 'margin') {
      const margin = convertUnitsToPoints(cropSettings.marginSize, cropSettings.units);
      cropBox = {
        x: margin,
        y: margin,
        width: originalPageSize.width - (margin * 2),
        height: originalPageSize.height - (margin * 2)
      };
    } else if (cropSettings.presetMode === 'center') {
      const newWidth = convertUnitsToPoints(cropSettings.centerWidth, cropSettings.units);
      const newHeight = convertUnitsToPoints(cropSettings.centerHeight, cropSettings.units);
      cropBox = {
        x: (originalPageSize.width - newWidth) / 2,
        y: (originalPageSize.height - newHeight) / 2,
        width: newWidth,
        height: newHeight
      };
    }

    return cropBox;
  };

  const cropPdf = async () => {
    if (!uploadedFile || !originalPageSize) {
      setStatus('error');
      setMessage('Please upload a PDF file first.');
      return;
    }

    const cropBox = getCropBox();
    if (!cropBox || cropBox.width <= 0 || cropBox.height <= 0) {
      setStatus('error');
      setMessage('Invalid crop dimensions. Please check your settings.');
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setMessage('Loading PDF document...');

      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      setProgress(20);
      setMessage('Cropping pages...');

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Set the crop box
        page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
        
        setProgress(20 + ((i + 1) / pages.length) * 60);
      }

      setProgress(80);
      setMessage('Saving cropped PDF...');

      const pdfBytes = await pdfDoc.save();
      
      setProgress(90);
      setMessage('Finalizing PDF...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdfBlob(blob);
      
      setProgress(100);
      setStatus('success');
      setMessage(`Successfully cropped ${pages.length} pages!`);
    } catch (error) {
      console.error('Error cropping PDF:', error);
      setStatus('error');
      setMessage('Failed to crop PDF. Please ensure the file is a valid PDF.');
    }
  };

  const downloadCroppedPdf = () => {
    if (processedPdfBlob) {
      const fileName = `cropped-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const applyPreset = (preset: CropPreset) => {
    setCropSettings(prev => ({ ...prev, ...preset.settings }));
  };

  const settingsContent = (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Crop className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upload PDF File
          </h2>
        </div>
        
        <PdfUpload
          onFilesSelected={handleFileSelected}
          multiple={false}
          accept={{ 'application/pdf': ['.pdf'] }}
          disabled={status === 'processing'}
        />
      </div>

      {/* Crop Settings */}
      {uploadedFile && originalPageSize && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Move className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Crop Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Current Page Size */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Original page size: {Math.round(originalPageSize.width)} × {Math.round(originalPageSize.height)} points
                ({(originalPageSize.width / 72).toFixed(2)}" × {(originalPageSize.height / 72).toFixed(2)}")
              </p>
            </div>

            {/* Preset Modes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Crop Mode
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="custom"
                    checked={cropSettings.presetMode === 'custom'}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, presetMode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Custom margins
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="margin"
                    checked={cropSettings.presetMode === 'margin'}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, presetMode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remove equal margins
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="center"
                    checked={cropSettings.presetMode === 'center'}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, presetMode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Crop to specific size
                  </span>
                </label>
              </div>
            </div>

            {/* Units Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Units
              </label>
              <select
                value={cropSettings.units}
                onChange={(e) => setCropSettings(prev => ({ ...prev, units: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="points">Points</option>
                <option value="inches">Inches</option>
                <option value="mm">Millimeters</option>
              </select>
            </div>

            {/* Custom Margins */}
            {cropSettings.presetMode === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margins to Remove
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Top</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cropSettings.top}
                      onChange={(e) => setCropSettings(prev => ({ ...prev, top: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bottom</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cropSettings.bottom}
                      onChange={(e) => setCropSettings(prev => ({ ...prev, bottom: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Left</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cropSettings.left}
                      onChange={(e) => setCropSettings(prev => ({ ...prev, left: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Right</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cropSettings.right}
                      onChange={(e) => setCropSettings(prev => ({ ...prev, right: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Margin Mode */}
            {cropSettings.presetMode === 'margin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margin Size
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={cropSettings.marginSize}
                  onChange={(e) => setCropSettings(prev => ({ ...prev, marginSize: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {/* Center Mode */}
            {cropSettings.presetMode === 'center' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Size
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Width</label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      value={cropSettings.centerWidth}
                      onChange={(e) => setCropSettings(prev => ({ ...prev, centerWidth: parseFloat(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Height</label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      value={cropSettings.centerHeight}
                      onChange={(e) => setCropSettings(prev => ({ ...prev, centerHeight: parseFloat(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CROP_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Button */}
            <button
              onClick={cropPdf}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Crop className="w-5 h-5" />
              <span>Crop PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadCroppedPdf}
        downloadFileName={processedPdfBlob ? `cropped-${uploadedFile?.name}` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Crop:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose a crop mode: custom margins, equal margins, or specific size</li>
          <li>• Set the units and specify the crop dimensions</li>
          <li>• Use quick presets for common cropping tasks</li>
          <li>• Click "Crop PDF" to process all pages</li>
          <li>• Download the cropped PDF when processing is complete</li>
        </ul>
      </div>
    </div>
  );

  const previewContent = (
    <div className="space-y-6">
      {uploadedFile && originalPageSize ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Crop Preview
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Size Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h4>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <div 
                    className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 mx-auto"
                    style={{
                      width: '120px',
                      height: `${(120 * originalPageSize.height) / originalPageSize.width}px`,
                      maxHeight: '160px'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {Math.round(originalPageSize.width)} × {Math.round(originalPageSize.height)}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After Crop</h4>
                <div className="border-2 border-red-300 rounded-lg p-4 bg-white">
                  {(() => {
                    const cropBox = getCropBox();
                    if (!cropBox) return null;
                    
                    return (
                      <div>
                        <div 
                          className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 mx-auto"
                          style={{
                            width: '120px',
                            height: `${(120 * cropBox.height) / cropBox.width}px`,
                            maxHeight: '160px'
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {Math.round(cropBox.width)} × {Math.round(cropBox.height)}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Page Grid Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pages Preview ({pdfPageCount} pages will be cropped)
              </h4>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {Array.from({ length: Math.min(pdfPageCount, 16) }, (_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded flex items-center justify-center"
                  >
                    <span className="text-xs text-red-600">{index + 1}</span>
                  </div>
                ))}
              </div>
              {pdfPageCount > 16 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Showing first 16 pages of {pdfPageCount} total pages
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Crop className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see crop preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Crop PDF"
      description="Remove margins and crop PDF pages to specific dimensions"
      icon={<Crop className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfCrop;