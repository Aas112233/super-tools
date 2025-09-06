import React, { useState, useCallback } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { Droplets, FileText, Eye, Image as ImageIcon, Type } from 'lucide-react';

interface WatermarkOptions {
  type: 'text' | 'image';
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color: string;
  imageFile: File | null;
  imageScale: number;
}

const PdfAddWatermark: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<WatermarkOptions>({
    type: 'text',
    text: 'CONFIDENTIAL',
    fontSize: 48,
    opacity: 0.3,
    rotation: 0,
    position: 'center',
    color: '#FF0000',
    imageFile: null,
    imageScale: 1.0
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlob, setProcessedPdfBlob] = useState<Blob | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);

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
        setMessage(`PDF loaded with ${pageCount} pages`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setMessage('Failed to load PDF file');
      }
    }
  }, []);

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setOptions(prev => ({ ...prev, imageFile: file }));
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 0, b: 0 };
  };

  const getWatermarkPosition = (pageWidth: number, pageHeight: number, textWidth: number, textHeight: number) => {
    switch (options.position) {
      case 'top-left':
        return { x: 50, y: pageHeight - 50 };
      case 'top-right':
        return { x: pageWidth - textWidth - 50, y: pageHeight - 50 };
      case 'bottom-left':
        return { x: 50, y: 50 };
      case 'bottom-right':
        return { x: pageWidth - textWidth - 50, y: 50 };
      default: // center
        return { x: (pageWidth - textWidth) / 2, y: (pageHeight - textHeight) / 2 };
    }
  };

  const addWatermark = async () => {
    if (!uploadedFile) {
      setStatus('error');
      setMessage('Please upload a PDF file first.');
      return;
    }

    if (options.type === 'text' && !options.text.trim()) {
      setStatus('error');
      setMessage('Please enter watermark text.');
      return;
    }

    if (options.type === 'image' && !options.imageFile) {
      setStatus('error');
      setMessage('Please select an image file for watermark.');
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

      let embeddedImage = null;
      if (options.type === 'image' && options.imageFile) {
        setMessage('Embedding watermark image...');
        const imageBytes = await options.imageFile.arrayBuffer();
        
        if (options.imageFile.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }
        setProgress(40);
      }

      setMessage('Applying watermark to pages...');

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        if (options.type === 'text') {
          const color = hexToRgb(options.color);
          const textWidth = options.text.length * options.fontSize * 0.6;
          const position = getWatermarkPosition(pageWidth, pageHeight, textWidth, options.fontSize);

          page.drawText(options.text, {
            x: position.x,
            y: position.y,
            size: options.fontSize,
            color: rgb(color.r, color.g, color.b),
            opacity: options.opacity,
            rotate: degrees(options.rotation)
          });
        } else if (embeddedImage) {
          const imageDims = embeddedImage.scale(options.imageScale);
          const position = getWatermarkPosition(pageWidth, pageHeight, imageDims.width, imageDims.height);

          page.drawImage(embeddedImage, {
            x: position.x,
            y: position.y,
            width: imageDims.width,
            height: imageDims.height,
            opacity: options.opacity,
            rotate: degrees(options.rotation)
          });
        }

        setProgress(40 + ((i + 1) / pages.length) * 40);
      }

      setProgress(80);
      setMessage('Saving watermarked PDF...');

      const pdfBytes = await pdfDoc.save();
      
      setProgress(90);
      setMessage('Finalizing PDF...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdfBlob(blob);
      
      setProgress(100);
      setStatus('success');
      setMessage(`Successfully added watermark to ${pages.length} pages!`);
    } catch (error) {
      console.error('Error adding watermark:', error);
      setStatus('error');
      setMessage('Failed to add watermark. Please ensure the file is a valid PDF.');
    }
  };

  const downloadWatermarkedPdf = () => {
    if (processedPdfBlob) {
      const fileName = `watermarked-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const settingsContent = (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-red-500" />
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

      {/* Watermark Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Watermark Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Watermark Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Watermark Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOptions(prev => ({ ...prev, type: 'text' }))}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                    options.type === 'text'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-medium">Text</span>
                </button>
                <button
                  onClick={() => setOptions(prev => ({ ...prev, type: 'image' }))}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                    options.type === 'image'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Image</span>
                </button>
              </div>
            </div>

            {/* Text Settings */}
            {options.type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={options.text}
                    onChange={(e) => setOptions(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter watermark text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Size
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="200"
                      value={options.fontSize}
                      onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 48 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={options.color}
                      onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Image Settings */}
            {options.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Watermark Image
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImageSelected}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image Scale: {options.imageScale}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={options.imageScale}
                    onChange={(e) => setOptions(prev => ({ ...prev, imageScale: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Common Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opacity: {Math.round(options.opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={options.opacity}
                  onChange={(e) => setOptions(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rotation: {options.rotation}°
                </label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="15"
                  value={options.rotation}
                  onChange={(e) => setOptions(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <select
                value={options.position}
                onChange={(e) => setOptions(prev => ({ ...prev, position: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            {/* Add Watermark Button */}
            <button
              onClick={addWatermark}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Droplets className="w-5 h-5" />
              <span>Add Watermark</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadWatermarkedPdf}
        downloadFileName={processedPdfBlob ? `watermarked-${uploadedFile?.name}` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Add Watermark:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose between text or image watermark</li>
          <li>• Configure watermark appearance and position</li>
          <li>• Click "Add Watermark" to process the document</li>
          <li>• Download the watermarked PDF when processing is complete</li>
        </ul>
      </div>
    </div>
  );

  const previewContent = (
    <div className="space-y-6">
      {uploadedFile && pdfPageCount > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Watermark Preview
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Preview Box */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center relative h-64">
              <div className="relative bg-white border-2 border-gray-300 rounded-lg w-48 h-56 flex items-center justify-center shadow-lg">
                {options.type === 'text' && options.text ? (
                  <span 
                    className="absolute select-none font-bold"
                    style={{
                      color: options.color,
                      opacity: options.opacity,
                      fontSize: Math.max(8, options.fontSize / 4),
                      transform: `rotate(${options.rotation}deg)`
                    }}
                  >
                    {options.text}
                  </span>
                ) : options.type === 'image' && options.imageFile ? (
                  <div 
                    className="absolute"
                    style={{
                      opacity: options.opacity,
                      transform: `rotate(${options.rotation}deg) scale(${options.imageScale})`
                    }}
                  >
                    <img
                      src={URL.createObjectURL(options.imageFile)}
                      alt="Watermark preview"
                      className="max-w-16 max-h-16"
                    />
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <Droplets className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Watermark Preview</span>
                  </div>
                )}
                <div className="absolute bottom-2 text-xs text-gray-400 text-center w-full">
                  PDF Page
                </div>
              </div>
            </div>

            {/* Settings Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Watermark Settings
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="font-medium capitalize">{options.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="font-medium">{options.position}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Opacity:</span>
                    <span className="font-medium">{Math.round(options.opacity * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rotation:</span>
                    <span className="font-medium">{options.rotation}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see watermark preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Add Watermark"
      description="Add text or image watermarks to PDF documents with customizable positioning"
      icon={<Droplets className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfAddWatermark;