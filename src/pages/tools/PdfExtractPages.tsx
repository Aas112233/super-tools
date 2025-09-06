import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { FileText, Scissors, Eye, Download } from 'lucide-react';

interface ExtractOptions {
  mode: 'specific' | 'range' | 'even' | 'odd';
  pageNumbers: string;
  startPage: number;
  endPage: number;
  outputMode: 'single' | 'separate';
}

const PdfExtractPages: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractOptions, setExtractOptions] = useState<ExtractOptions>({
    mode: 'specific',
    pageNumbers: '',
    startPage: 1,
    endPage: 1,
    outputMode: 'single'
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlobs, setProcessedPdfBlobs] = useState<{ blob: Blob; filename: string }[]>([]);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setProcessedPdfBlobs([]);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setPdfPageCount(pageCount);
        setExtractOptions(prev => ({
          ...prev,
          endPage: pageCount
        }));
        setMessage(`PDF loaded with ${pageCount} pages`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setMessage('Failed to load PDF file');
      }
    }
  }, []);

  const getPageIndices = (): number[] => {
    const indices: number[] = [];
    
    switch (extractOptions.mode) {
      case 'specific':
        const ranges = extractOptions.pageNumbers.split(',').map(s => s.trim());
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(s => parseInt(s.trim()) - 1);
            if (!isNaN(start) && !isNaN(end) && start >= 0 && end < pdfPageCount) {
              for (let i = start; i <= end; i++) {
                if (!indices.includes(i)) {
                  indices.push(i);
                }
              }
            }
          } else {
            const pageNum = parseInt(range) - 1;
            if (!isNaN(pageNum) && pageNum >= 0 && pageNum < pdfPageCount) {
              if (!indices.includes(pageNum)) {
                indices.push(pageNum);
              }
            }
          }
        }
        break;
        
      case 'range':
        const start = Math.max(0, extractOptions.startPage - 1);
        const end = Math.min(pdfPageCount - 1, extractOptions.endPage - 1);
        for (let i = start; i <= end; i++) {
          indices.push(i);
        }
        break;
        
      case 'even':
        for (let i = 1; i < pdfPageCount; i += 2) {
          indices.push(i);
        }
        break;
        
      case 'odd':
        for (let i = 0; i < pdfPageCount; i += 2) {
          indices.push(i);
        }
        break;
    }
    
    return indices.sort((a, b) => a - b);
  };

  const extractPages = async () => {
    if (!uploadedFile) {
      setStatus('error');
      setMessage('Please upload a PDF file first.');
      return;
    }

    const pageIndices = getPageIndices();
    if (pageIndices.length === 0) {
      setStatus('error');
      setMessage('Please specify valid pages to extract.');
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setMessage('Loading PDF document...');

      const arrayBuffer = await uploadedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      
      setProgress(20);
      setMessage('Extracting pages...');

      const results: { blob: Blob; filename: string }[] = [];

      if (extractOptions.outputMode === 'single') {
        // Extract all pages into a single PDF
        const newPdf = await PDFDocument.create();
        
        for (let i = 0; i < pageIndices.length; i++) {
          const pageIndex = pageIndices[i];
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
          newPdf.addPage(copiedPage);
          
          setProgress(20 + ((i + 1) / pageIndices.length) * 60);
        }

        setProgress(80);
        setMessage('Saving extracted pages...');

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        const filename = `extracted-pages-${uploadedFile.name}`;
        results.push({ blob, filename });
        
      } else {
        // Extract each page as a separate PDF
        for (let i = 0; i < pageIndices.length; i++) {
          const pageIndex = pageIndices[i];
          const newPdf = await PDFDocument.create();
          
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
          newPdf.addPage(copiedPage);
          
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          
          const filename = `page-${pageIndex + 1}-${uploadedFile.name}`;
          results.push({ blob, filename });
          
          setProgress(20 + ((i + 1) / pageIndices.length) * 70);
        }
      }

      setProgress(100);
      setProcessedPdfBlobs(results);
      setStatus('success');
      setMessage(`Successfully extracted ${pageIndices.length} pages!`);
    } catch (error) {
      console.error('Error extracting pages:', error);
      setStatus('error');
      setMessage('Failed to extract pages. Please ensure the file is a valid PDF.');
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    saveAs(blob, filename);
  };

  const downloadAll = () => {
    processedPdfBlobs.forEach(({ blob, filename }) => {
      setTimeout(() => downloadFile(blob, filename), 100);
    });
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

      {/* Extraction Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Scissors className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Extraction Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Extraction Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Pages to Extract
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="specific"
                    checked={extractOptions.mode === 'specific'}
                    onChange={(e) => setExtractOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Specific pages
                  </span>
                </label>
                
                {extractOptions.mode === 'specific' && (
                  <div className="ml-6">
                    <input
                      type="text"
                      value={extractOptions.pageNumbers}
                      onChange={(e) => setExtractOptions(prev => ({ ...prev, pageNumbers: e.target.value }))}
                      placeholder="e.g., 1,3,5-8,10"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter page numbers separated by commas. Use ranges like 5-8.
                    </p>
                  </div>
                )}
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="range"
                    checked={extractOptions.mode === 'range'}
                    onChange={(e) => setExtractOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page range
                  </span>
                </label>
                
                {extractOptions.mode === 'range' && (
                  <div className="ml-6 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From page</label>
                      <input
                        type="number"
                        min="1"
                        max={pdfPageCount}
                        value={extractOptions.startPage}
                        onChange={(e) => setExtractOptions(prev => ({ ...prev, startPage: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To page</label>
                      <input
                        type="number"
                        min="1"
                        max={pdfPageCount}
                        value={extractOptions.endPage}
                        onChange={(e) => setExtractOptions(prev => ({ ...prev, endPage: parseInt(e.target.value) || pdfPageCount }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                )}
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="odd"
                    checked={extractOptions.mode === 'odd'}
                    onChange={(e) => setExtractOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Odd pages (1, 3, 5, ...)
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="even"
                    checked={extractOptions.mode === 'even'}
                    onChange={(e) => setExtractOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Even pages (2, 4, 6, ...)
                  </span>
                </label>
              </div>
            </div>

            {/* Output Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="single"
                    checked={extractOptions.outputMode === 'single'}
                    onChange={(e) => setExtractOptions(prev => ({ ...prev, outputMode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Single PDF with all extracted pages
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="separate"
                    checked={extractOptions.outputMode === 'separate'}
                    onChange={(e) => setExtractOptions(prev => ({ ...prev, outputMode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Separate PDF for each page
                  </span>
                </label>
              </div>
            </div>

            {/* Extract Button */}
            <button
              onClick={extractPages}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Scissors className="w-5 h-5" />
              <span>Extract Pages</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadAll}
        downloadFileName={processedPdfBlobs.length > 0 ? 'extracted-pages.pdf' : undefined}
      />

      {/* Download Section */}
      {processedPdfBlobs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Extracted Files ({processedPdfBlobs.length})
            </h3>
            {processedPdfBlobs.length > 1 && (
              <button
                onClick={downloadAll}
                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {processedPdfBlobs.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {file.filename}
                  </span>
                </div>
                <button
                  onClick={() => downloadFile(file.blob, file.filename)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Extract Pages:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose which pages to extract (specific, range, odd, or even)</li>
          <li>• Select output format (single PDF or separate files)</li>
          <li>• Click "Extract Pages" to process the document</li>
          <li>• Download the extracted pages when processing is complete</li>
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
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pages to extract: <span className="font-medium text-red-600">{getPageIndices().map(i => i + 1).join(', ')}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: Math.min(pdfPageCount, 12) }, (_, index) => {
              const willBeExtracted = getPageIndices().includes(index);
              return (
                <div
                  key={index}
                  className={`aspect-[3/4] rounded-lg flex items-center justify-center border-2 transition-all ${
                    willBeExtracted
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <FileText className={`w-8 h-8 mx-auto mb-2 ${willBeExtracted ? 'text-red-500' : 'text-gray-400'}`} />
                    <p className={`text-sm ${willBeExtracted ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      Page {index + 1}
                    </p>
                    {willBeExtracted && (
                      <p className="text-xs text-red-500 mt-1">Will extract</p>
                    )}
                  </div>
                </div>
              );
            })}
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
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
      title="Extract Pages"
      description="Extract specific pages, ranges, or patterns from PDF documents"
      icon={<Scissors className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfExtractPages;