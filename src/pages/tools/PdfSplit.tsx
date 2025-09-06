import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { Scissors, FileText, Eye, Download, Grid } from 'lucide-react';

interface SplitOptions {
  mode: 'pages' | 'count' | 'size' | 'bookmark';
  pageRanges: string;
  pagesPerFile: number;
  maxFileSize: number;
  outputFormat: 'separate' | 'zip';
}

const PdfSplit: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [splitOptions, setSplitOptions] = useState<SplitOptions>({
    mode: 'pages',
    pageRanges: '',
    pagesPerFile: 1,
    maxFileSize: 5,
    outputFormat: 'separate'
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [splitFiles, setSplitFiles] = useState<{ blob: Blob; filename: string }[]>([]);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setOriginalSize(file.size);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setSplitFiles([]);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setPdfPageCount(pageCount);
        setMessage(`PDF loaded with ${pageCount} pages (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setMessage('Failed to load PDF file');
      }
    }
  }, []);

  const parsePageRanges = (ranges: string): number[][] => {
    const splitRanges: number[][] = [];
    const parts = ranges.split(',').map(s => s.trim()).filter(s => s);
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()) - 1);
        if (!isNaN(start) && !isNaN(end) && start >= 0 && end < pdfPageCount && start <= end) {
          const pageArray = [];
          for (let i = start; i <= end; i++) {
            pageArray.push(i);
          }
          splitRanges.push(pageArray);
        }
      } else {
        const pageNum = parseInt(part) - 1;
        if (!isNaN(pageNum) && pageNum >= 0 && pageNum < pdfPageCount) {
          splitRanges.push([pageNum]);
        }
      }
    }
    
    return splitRanges;
  };

  const getSplitPreview = (): number[][] => {
    switch (splitOptions.mode) {
      case 'pages':
        return parsePageRanges(splitOptions.pageRanges);
      case 'count':
        const ranges: number[][] = [];
        for (let i = 0; i < pdfPageCount; i += splitOptions.pagesPerFile) {
          const end = Math.min(i + splitOptions.pagesPerFile - 1, pdfPageCount - 1);
          const range = [];
          for (let j = i; j <= end; j++) {
            range.push(j);
          }
          ranges.push(range);
        }
        return ranges;
      case 'size':
        // Simplified: assume equal page sizes for preview
        const avgPageSize = originalSize / pdfPageCount;
        const maxPages = Math.floor((splitOptions.maxFileSize * 1024 * 1024) / avgPageSize);
        const sizeRanges: number[][] = [];
        for (let i = 0; i < pdfPageCount; i += maxPages) {
          const end = Math.min(i + maxPages - 1, pdfPageCount - 1);
          const range = [];
          for (let j = i; j <= end; j++) {
            range.push(j);
          }
          sizeRanges.push(range);
        }
        return sizeRanges;
      default:
        return [];
    }
  };

  const splitPdf = async () => {
    if (!uploadedFile) {
      setStatus('error');
      setMessage('Please upload a PDF file first.');
      return;
    }

    const splitRanges = getSplitPreview();
    if (splitRanges.length === 0) {
      setStatus('error');
      setMessage('Please specify valid split parameters.');
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setMessage('Loading PDF document...');

      const arrayBuffer = await uploadedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      
      setProgress(20);
      setMessage('Splitting PDF...');

      const results: { blob: Blob; filename: string }[] = [];

      for (let i = 0; i < splitRanges.length; i++) {
        const pageIndices = splitRanges[i];
        const newPdf = await PDFDocument.create();
        
        // Copy pages to new PDF
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        const startPage = pageIndices[0] + 1;
        const endPage = pageIndices[pageIndices.length - 1] + 1;
        const filename = pageIndices.length === 1 
          ? `page-${startPage}-${uploadedFile.name}`
          : `pages-${startPage}-${endPage}-${uploadedFile.name}`;
          
        results.push({ blob, filename });
        
        setProgress(20 + ((i + 1) / splitRanges.length) * 60);
      }

      setProgress(80);
      setMessage('Finalizing split files...');

      if (splitOptions.outputFormat === 'zip' && results.length > 1) {
        // Create ZIP file
        const zip = new JSZip();
        results.forEach(({ blob, filename }) => {
          zip.file(filename, blob);
        });
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipFilename = `split-${uploadedFile.name.replace('.pdf', '.zip')}`;
        setSplitFiles([{ blob: zipBlob, filename: zipFilename }]);
      } else {
        setSplitFiles(results);
      }
      
      setProgress(100);
      setStatus('success');
      setMessage(`Successfully split PDF into ${results.length} files!`);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      setStatus('error');
      setMessage('Failed to split PDF. Please ensure the file is a valid PDF.');
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    saveAs(blob, filename);
  };

  const downloadAll = () => {
    splitFiles.forEach(({ blob, filename }) => {
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

      {/* Split Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Scissors className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Split Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Split Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Split Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="pages"
                    checked={splitOptions.mode === 'pages'}
                    onChange={(e) => setSplitOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Split by page ranges
                  </span>
                </label>
                
                {splitOptions.mode === 'pages' && (
                  <div className="ml-6">
                    <input
                      type="text"
                      value={splitOptions.pageRanges}
                      onChange={(e) => setSplitOptions(prev => ({ ...prev, pageRanges: e.target.value }))}
                      placeholder="e.g., 1-3,5,7-10"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter page ranges separated by commas (e.g., 1-3,5,7-10)
                    </p>
                  </div>
                )}
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="count"
                    checked={splitOptions.mode === 'count'}
                    onChange={(e) => setSplitOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Split by number of pages per file
                  </span>
                </label>
                
                {splitOptions.mode === 'count' && (
                  <div className="ml-6">
                    <input
                      type="number"
                      min="1"
                      max={pdfPageCount}
                      value={splitOptions.pagesPerFile}
                      onChange={(e) => setSplitOptions(prev => ({ ...prev, pagesPerFile: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of pages per output file
                    </p>
                  </div>
                )}
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="size"
                    checked={splitOptions.mode === 'size'}
                    onChange={(e) => setSplitOptions(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Split by maximum file size
                  </span>
                </label>
                
                {splitOptions.mode === 'size' && (
                  <div className="ml-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={splitOptions.maxFileSize}
                        onChange={(e) => setSplitOptions(prev => ({ ...prev, maxFileSize: parseFloat(e.target.value) || 1 }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">MB</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum size per output file
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="separate"
                    checked={splitOptions.outputFormat === 'separate'}
                    onChange={(e) => setSplitOptions(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Separate PDF files
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="zip"
                    checked={splitOptions.outputFormat === 'zip'}
                    onChange={(e) => setSplitOptions(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ZIP archive (recommended for multiple files)
                  </span>
                </label>
              </div>
            </div>

            {/* Split Button */}
            <button
              onClick={splitPdf}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Scissors className="w-5 h-5" />
              <span>Split PDF</span>
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
        downloadFileName={splitFiles.length > 0 ? splitFiles[0].filename : undefined}
      />

      {/* Download Section */}
      {splitFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Split Files ({splitFiles.length})
            </h3>
            {splitFiles.length > 1 && (
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
            {splitFiles.map((file, index) => (
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
          How to use PDF Split:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose split method: page ranges, page count, or file size</li>
          <li>• Configure split parameters based on your chosen method</li>
          <li>• Select output format (separate files or ZIP archive)</li>
          <li>• Click "Split PDF" to process the document</li>
          <li>• Download individual files or all files at once</li>
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
              Split Preview ({pdfPageCount} pages)
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Split Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              {(() => {
                const splitRanges = getSplitPreview();
                return (
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Will create {splitRanges.length} file{splitRanges.length !== 1 ? 's' : ''} from {pdfPageCount} pages
                  </p>
                );
              })()}
            </div>

            {/* Split Visualization */}
            <div className="space-y-3">
              {getSplitPreview().map((range, index) => (
                <div key={index} className="border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      File {index + 1}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {range.length} page{range.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {range.map((pageIndex) => (
                      <span
                        key={pageIndex}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      >
                        {pageIndex + 1}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Page Grid */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Assignment
              </h4>
              <div className="grid grid-cols-8 md:grid-cols-12 gap-1">
                {Array.from({ length: pdfPageCount }, (_, index) => {
                  const splitRanges = getSplitPreview();
                  const fileIndex = splitRanges.findIndex(range => range.includes(index));
                  const colors = [
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
                    'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200'
                  ];
                  const colorClass = fileIndex >= 0 ? colors[fileIndex % colors.length] : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
                  
                  return (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${colorClass}`}
                      title={fileIndex >= 0 ? `File ${fileIndex + 1}` : 'Not included'}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see split preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Split PDF"
      description="Split PDF documents by page ranges, number of pages, or file size"
      icon={<Scissors className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfSplit;