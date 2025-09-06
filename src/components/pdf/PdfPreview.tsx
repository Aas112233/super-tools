import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Eye } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
  file: File | string | null;
  className?: string;
  showControls?: boolean;
  maxWidth?: number;
  onPageChange?: (pageNumber: number) => void;
  selectedPages?: number[];
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  file,
  className = '',
  showControls = true,
  maxWidth = 600,
  onPageChange,
  selectedPages = []
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);
    setError(null);
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please make sure the file is a valid PDF document.');
    setLoading(false);
  };

  const changePage = (offset: number) => {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
      onPageChange?.(newPageNumber);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
      onPageChange?.(page);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  if (!file) {
    return (
      <div className={`flex items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg ${className}`}>
        <div className="text-center space-y-2">
          <Eye className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">No PDF file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Controls */}
      {showControls && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1 || loading}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  of {numPages || '—'}
                </span>
              </div>
              
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages || loading}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Zoom and Rotation Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={zoomIn}
                disabled={scale >= 2.0}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              
              <button
                onClick={rotate}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                title="Rotate"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading PDF...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center p-8 text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex justify-center">
            <div 
              className={`border border-gray-300 dark:border-gray-600 shadow-lg ${
                selectedPages.includes(pageNumber) ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ maxWidth: `${maxWidth}px` }}
            >
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
                error=""
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  width={maxWidth}
                  loading=""
                  error=""
                />
              </Document>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;