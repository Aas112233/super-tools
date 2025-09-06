import React, { useState, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { Hash, FileText, Eye, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface PageNumberOptions {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: 'number' | 'roman' | 'letter' | 'custom';
  customFormat: string;
  fontSize: number;
  color: string;
  startNumber: number;
  margin: number;
  skipFirstPage: boolean;
  skipLastPage: boolean;
  prefix: string;
  suffix: string;
}

const formatPageNumber = (pageNum: number, format: string, customFormat?: string): string => {
  switch (format) {
    case 'roman':
      return toRoman(pageNum);
    case 'letter':
      return toLetter(pageNum);
    case 'custom':
      return customFormat?.replace('{n}', pageNum.toString()) || pageNum.toString();
    default:
      return pageNum.toString();
  }
};

const toRoman = (num: number): string => {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const literals = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
  let result = '';
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += literals[i];
      num -= values[i];
    }
  }
  return result;
};

const toLetter = (num: number): string => {
  let result = '';
  while (num > 0) {
    num--;
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
};

const PdfAddPageNumbers: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<PageNumberOptions>({
    position: 'bottom-center',
    format: 'number',
    customFormat: 'Page {n}',
    fontSize: 12,
    color: '#000000',
    startNumber: 1,
    margin: 20,
    skipFirstPage: false,
    skipLastPage: false,
    prefix: '',
    suffix: ''
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

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 0, g: 0, b: 0 };
  };

  const getPageNumberPosition = (pageWidth: number, pageHeight: number, textWidth: number) => {
    const margin = options.margin;
    
    switch (options.position) {
      case 'top-left':
        return { x: margin, y: pageHeight - margin };
      case 'top-center':
        return { x: (pageWidth - textWidth) / 2, y: pageHeight - margin };
      case 'top-right':
        return { x: pageWidth - textWidth - margin, y: pageHeight - margin };
      case 'bottom-left':
        return { x: margin, y: margin };
      case 'bottom-center':
        return { x: (pageWidth - textWidth) / 2, y: margin };
      case 'bottom-right':
        return { x: pageWidth - textWidth - margin, y: margin };
      default:
        return { x: (pageWidth - textWidth) / 2, y: margin };
    }
  };

  const addPageNumbers = async () => {
    if (!uploadedFile) {
      setStatus('error');
      setMessage('Please upload a PDF file first.');
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
      setMessage('Adding page numbers...');

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const color = hexToRgb(options.color);

      for (let i = 0; i < pages.length; i++) {
        // Skip pages if configured
        if ((i === 0 && options.skipFirstPage) || 
            (i === pages.length - 1 && options.skipLastPage)) {
          continue;
        }

        const page = pages[i];
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        const pageNum = options.startNumber + i;
        const formattedNumber = formatPageNumber(pageNum, options.format, options.customFormat);
        const pageText = `${options.prefix}${formattedNumber}${options.suffix}`;
        
        const textWidth = font.widthOfTextAtSize(pageText, options.fontSize);
        const position = getPageNumberPosition(pageWidth, pageHeight, textWidth);

        page.drawText(pageText, {
          x: position.x,
          y: position.y,
          size: options.fontSize,
          font: font,
          color: rgb(color.r, color.g, color.b)
        });

        setProgress(20 + ((i + 1) / pages.length) * 60);
      }

      setProgress(80);
      setMessage('Saving PDF with page numbers...');

      const pdfBytes = await pdfDoc.save();
      
      setProgress(90);
      setMessage('Finalizing PDF...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdfBlob(blob);
      
      setProgress(100);
      setStatus('success');
      setMessage(`Successfully added page numbers to ${pages.length} pages!`);
    } catch (error) {
      console.error('Error adding page numbers:', error);
      setStatus('error');
      setMessage('Failed to add page numbers. Please ensure the file is a valid PDF.');
    }
  };

  const downloadNumberedPdf = () => {
    if (processedPdfBlob) {
      const fileName = `numbered-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const getPreviewText = (pageNum: number): string => {
    const formattedNumber = formatPageNumber(pageNum, options.format, options.customFormat);
    return `${options.prefix}${formattedNumber}${options.suffix}`;
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

      {/* Page Number Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Hash className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Page Number Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'top-left', label: 'Top Left', icon: AlignLeft },
                  { value: 'top-center', label: 'Top Center', icon: AlignCenter },
                  { value: 'top-right', label: 'Top Right', icon: AlignRight },
                  { value: 'bottom-left', label: 'Bottom Left', icon: AlignLeft },
                  { value: 'bottom-center', label: 'Bottom Center', icon: AlignCenter },
                  { value: 'bottom-right', label: 'Bottom Right', icon: AlignRight }
                ].map((pos) => {
                  const Icon = pos.icon;
                  return (
                    <button
                      key={pos.value}
                      onClick={() => setOptions(prev => ({ ...prev, position: pos.value as any }))}
                      className={`p-2 rounded-lg border transition-all flex flex-col items-center space-y-1 text-xs ${
                        options.position === pos.value
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-600'
                          : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pos.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number Format
              </label>
              <select
                value={options.format}
                onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="number">Numbers (1, 2, 3, ...)</option>
                <option value="roman">Roman (i, ii, iii, ...)</option>
                <option value="letter">Letters (a, b, c, ...)</option>
                <option value="custom">Custom Format</option>
              </select>
            </div>

            {/* Custom Format */}
            {options.format === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Format
                </label>
                <input
                  type="text"
                  value={options.customFormat}
                  onChange={(e) => setOptions(prev => ({ ...prev, customFormat: e.target.value }))}
                  placeholder="Use {n} for page number, e.g., 'Page {n}'"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {`{n}`} as placeholder for page number
                </p>
              </div>
            )}

            {/* Prefix and Suffix */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prefix
                </label>
                <input
                  type="text"
                  value={options.prefix}
                  onChange={(e) => setOptions(prev => ({ ...prev, prefix: e.target.value }))}
                  placeholder="e.g., 'Page '"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suffix
                </label>
                <input
                  type="text"
                  value={options.suffix}
                  onChange={(e) => setOptions(prev => ({ ...prev, suffix: e.target.value }))}
                  placeholder="e.g., ' of ' + total"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Font Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={options.fontSize}
                  onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 12 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={options.color}
                  onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margin (px)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={options.margin}
                  onChange={(e) => setOptions(prev => ({ ...prev, margin: parseInt(e.target.value) || 20 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={options.startNumber}
                  onChange={(e) => setOptions(prev => ({ ...prev, startNumber: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.skipFirstPage}
                    onChange={(e) => setOptions(prev => ({ ...prev, skipFirstPage: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Skip first page
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.skipLastPage}
                    onChange={(e) => setOptions(prev => ({ ...prev, skipLastPage: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Skip last page
                  </span>
                </label>
              </div>
            </div>

            {/* Add Page Numbers Button */}
            <button
              onClick={addPageNumbers}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Hash className="w-5 h-5" />
              <span>Add Page Numbers</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadNumberedPdf}
        downloadFileName={processedPdfBlob ? `numbered-${uploadedFile?.name}` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Add Page Numbers:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose position and format for page numbers</li>
          <li>• Customize appearance with font size, color, and margins</li>
          <li>• Set prefix, suffix, and starting number if needed</li>
          <li>• Click "Add Page Numbers" to process the document</li>
          <li>• Download the numbered PDF when processing is complete</li>
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
              Page Numbers Preview
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Preview Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, Math.ceil(pdfPageCount / 2), pdfPageCount].map((pageNum) => (
                <div key={pageNum} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-sm text-center">
                      <Type className="w-8 h-8 mx-auto mb-2" />
                      Page {pageNum} Content
                    </div>
                  </div>
                  
                  {/* Skip logic */}
                  {!((pageNum === 1 && options.skipFirstPage) || 
                      (pageNum === pdfPageCount && options.skipLastPage)) && (
                    <div
                      className="absolute text-sm font-medium"
                      style={{
                        color: options.color,
                        fontSize: Math.max(8, options.fontSize / 2),
                        left: options.position.includes('left') ? '8px' : 
                              options.position.includes('center') ? '50%' : 'auto',
                        right: options.position.includes('right') ? '8px' : 'auto',
                        top: options.position.includes('top') ? '8px' : 'auto',
                        bottom: options.position.includes('bottom') ? '8px' : 'auto',
                        transform: options.position.includes('center') ? 'translateX(-50%)' : 'none'
                      }}
                    >
                      {getPreviewText(options.startNumber + pageNum - 1)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Format Examples */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format Examples
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-medium mb-1">First Page</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {getPreviewText(options.startNumber)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">Second Page</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {getPreviewText(options.startNumber + 1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">Third Page</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {getPreviewText(options.startNumber + 2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">Last Page</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {getPreviewText(options.startNumber + pdfPageCount - 1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Page Numbering Configuration
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-200">
                <div>Position: {options.position}</div>
                <div>Format: {options.format}</div>
                <div>Start: {options.startNumber}</div>
                <div>Font Size: {options.fontSize}px</div>
                <div>Skip First: {options.skipFirstPage ? 'Yes' : 'No'}</div>
                <div>Skip Last: {options.skipLastPage ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see page numbering preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Add Page Numbers"
      description="Add customizable page numbers to PDF documents with various formats and positions"
      icon={<Hash className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfAddPageNumbers;