import React, { useState, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { RotateCw, RotateCcw, Image as ImageIcon, Trash2, Eye } from 'lucide-react';

interface RotateOptions {
  angle: number;
  pages: 'all' | 'specific';
  pageNumbers: string;
}

const PdfRotate: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rotateOptions, setRotateOptions] = useState<RotateOptions>({
    angle: 90,
    pages: 'all',
    pageNumbers: ''
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlob, setProcessedPdfBlob] = useState<Blob | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [previewPages, setPreviewPages] = useState<string[]>([]);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setProcessedPdfBlob(null);
      
      // Load PDF to get page count and generate previews
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setPdfPageCount(pageCount);
        
        // Generate preview images (simplified for demo)
        setPreviewPages(Array(pageCount).fill(''));
        setMessage(`PDF loaded with ${pageCount} pages`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setMessage('Failed to load PDF file');
      }
    }
  }, []);

  const rotatePdf = async () => {
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
      const pageCount = pdfDoc.getPageCount();
      
      setProgress(20);
      setMessage('Rotating pages...');

      // Determine which pages to rotate
      let pagesToRotate: number[] = [];
      
      if (rotateOptions.pages === 'all') {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i);
      } else {
        // Parse page numbers
        const ranges = rotateOptions.pageNumbers.split(',').map(s => s.trim());
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(s => parseInt(s.trim()) - 1);
            if (!isNaN(start) && !isNaN(end) && start >= 0 && end < pageCount) {
              for (let i = start; i <= end; i++) {
                if (!pagesToRotate.includes(i)) {
                  pagesToRotate.push(i);
                }
              }
            }
          } else {
            const pageNum = parseInt(range) - 1;
            if (!isNaN(pageNum) && pageNum >= 0 && pageNum < pageCount) {
              if (!pagesToRotate.includes(pageNum)) {
                pagesToRotate.push(pageNum);
              }
            }
          }
        }
      }

      const pages = pdfDoc.getPages();
      
      setProgress(50);
      
      // Rotate specified pages
      for (let i = 0; i < pagesToRotate.length; i++) {
        const pageIndex = pagesToRotate[i];
        if (pageIndex < pages.length) {
          pages[pageIndex].setRotation(degrees(rotateOptions.angle));
        }
        setProgress(50 + ((i + 1) / pagesToRotate.length) * 30);
      }

      setProgress(80);
      setMessage('Saving rotated PDF...');

      const pdfBytes = await pdfDoc.save();
      
      setProgress(90);
      setMessage('Finalizing PDF...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdfBlob(blob);
      
      setProgress(100);
      setStatus('success');
      setMessage(`Successfully rotated ${pagesToRotate.length} pages!`);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      setStatus('error');
      setMessage('Failed to rotate PDF. Please ensure the file is a valid PDF.');
    }
  };

  const downloadRotatedPdf = () => {
    if (processedPdfBlob) {
      const fileName = `rotated-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const settingsContent = (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ImageIcon className="w-5 h-5 text-red-500" />
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

      {/* Rotation Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <RotateCw className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Rotation Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Rotation Angle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation Angle
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[90, 180, 270, -90].map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotateOptions(prev => ({ ...prev, angle }))}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1 ${
                      rotateOptions.angle === angle
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                    }`}
                  >
                    {angle > 0 ? <RotateCw className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                    <span className="text-xs font-medium">{Math.abs(angle)}°</span>
                    <span className="text-xs text-gray-500">
                      {angle > 0 ? 'Right' : 'Left'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Page Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pages to Rotate
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="all"
                    checked={rotateOptions.pages === 'all'}
                    onChange={(e) => setRotateOptions(prev => ({ ...prev, pages: e.target.value as 'all' | 'specific' }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    All pages ({pdfPageCount} pages)
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="specific"
                    checked={rotateOptions.pages === 'specific'}
                    onChange={(e) => setRotateOptions(prev => ({ ...prev, pages: e.target.value as 'all' | 'specific' }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Specific pages
                  </span>
                </label>
                
                {rotateOptions.pages === 'specific' && (
                  <div className="ml-6">
                    <input
                      type="text"
                      value={rotateOptions.pageNumbers}
                      onChange={(e) => setRotateOptions(prev => ({ ...prev, pageNumbers: e.target.value }))}
                      placeholder="e.g., 1,3,5-8,10"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter page numbers separated by commas. Use ranges like 5-8.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rotate Button */}
            <button
              onClick={rotatePdf}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <RotateCw className="w-5 h-5" />
              <span>Rotate PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadRotatedPdf}
        downloadFileName={processedPdfBlob ? `rotated-${uploadedFile?.name}` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Rotate:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose the rotation angle (90°, 180°, 270°, or -90°)</li>
          <li>• Select whether to rotate all pages or specific pages</li>
          <li>• For specific pages, enter page numbers (e.g., 1,3,5-8)</li>
          <li>• Click "Rotate PDF" to process the document</li>
          <li>• Download the rotated PDF when processing is complete</li>
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
              PDF Preview ({pdfPageCount} pages)
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: Math.min(pdfPageCount, 12) }, (_, index) => (
              <div
                key={index}
                className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Page {index + 1}</p>
                  {rotateOptions.pages === 'all' || (
                    rotateOptions.pages === 'specific' && 
                    rotateOptions.pageNumbers.split(',').some(range => {
                      if (range.includes('-')) {
                        const [start, end] = range.split('-').map(n => parseInt(n.trim()));
                        return (index + 1) >= start && (index + 1) <= end;
                      }
                      return parseInt(range.trim()) === (index + 1);
                    })
                  ) ? (
                    <div className="mt-1 flex items-center justify-center">
                      <RotateCw className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-500 ml-1">{rotateOptions.angle}°</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          
          {pdfPageCount > 12 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing first 12 pages of {pdfPageCount} total pages
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Rotate PDF"
      description="Rotate PDF pages by 90°, 180°, or 270° clockwise or counterclockwise"
      icon={<RotateCw className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfRotate;