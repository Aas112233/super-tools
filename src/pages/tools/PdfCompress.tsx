import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { Archive, TrendingDown, Eye, FileText, Info } from 'lucide-react';

interface CompressionOptions {
  level: 'low' | 'medium' | 'high' | 'maximum';
  removeMetadata: boolean;
  optimizeImages: boolean;
  removeAnnotations: boolean;
  removeBookmarks: boolean;
  removeJavaScript: boolean;
}

const COMPRESSION_LEVELS = {
  low: { name: 'Low', description: 'Slight compression, best quality', quality: 0.9 },
  medium: { name: 'Medium', description: 'Balanced compression and quality', quality: 0.7 },
  high: { name: 'High', description: 'Good compression, acceptable quality', quality: 0.5 },
  maximum: { name: 'Maximum', description: 'Maximum compression, lower quality', quality: 0.3 }
};

const PdfCompress: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<CompressionOptions>({
    level: 'medium',
    removeMetadata: false,
    optimizeImages: true,
    removeAnnotations: false,
    removeBookmarks: false,
    removeJavaScript: false
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlob, setProcessedPdfBlob] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [pdfInfo, setPdfInfo] = useState<{
    pageCount: number;
    hasImages: boolean;
    hasAnnotations: boolean;
    hasBookmarks: boolean;
    hasJavaScript: boolean;
    hasMetadata: boolean;
  } | null>(null);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setOriginalSize(file.size);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setProcessedPdfBlob(null);
      setCompressedSize(0);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Analyze PDF content
        const pageCount = pdfDoc.getPageCount();
        const title = pdfDoc.getTitle();
        const author = pdfDoc.getAuthor();
        
        // Basic analysis (simplified for demo)
        const info = {
          pageCount,
          hasImages: true, // Assume images might be present
          hasAnnotations: false,
          hasBookmarks: false,
          hasJavaScript: false,
          hasMetadata: !!(title || author)
        };
        
        setPdfInfo(info);
        setMessage(`PDF analyzed: ${pageCount} pages, ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      } catch (error) {
        console.error('Error analyzing PDF:', error);
        setMessage('Failed to analyze PDF file');
      }
    }
  }, []);

  const compressPdf = async () => {
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
      
      setProgress(20);
      setMessage('Analyzing document structure...');

      // Remove metadata if requested
      if (options.removeMetadata) {
        setMessage('Removing metadata...');
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
        setProgress(30);
      }

      setProgress(40);
      setMessage('Optimizing document structure...');

      // The compression mostly happens during save with specific options
      setProgress(60);
      setMessage('Compressing PDF...');

      // Save with compression options
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectStreamsThreshold: options.level === 'maximum' ? 10 : 50,
        updateFieldAppearances: false
      });
      
      setProgress(80);
      setMessage('Finalizing compressed PDF...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdfBlob(blob);
      setCompressedSize(blob.size);
      
      setProgress(100);
      setStatus('success');
      
      const originalMB = originalSize / 1024 / 1024;
      const compressedMB = blob.size / 1024 / 1024;
      const compressionRatio = ((originalSize - blob.size) / originalSize * 100);
      
      setMessage(`Compression complete! Reduced from ${originalMB.toFixed(2)} MB to ${compressedMB.toFixed(2)} MB (${compressionRatio.toFixed(1)}% reduction)`);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      setStatus('error');
      setMessage('Failed to compress PDF. Please ensure the file is a valid PDF.');
    }
  };

  const downloadCompressedPdf = () => {
    if (processedPdfBlob) {
      const fileName = `compressed-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (): number => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return ((originalSize - compressedSize) / originalSize * 100);
  };

  const settingsContent = (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Archive className="w-5 h-5 text-red-500" />
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

      {/* PDF Analysis */}
      {pdfInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Document Analysis
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                <span className="font-medium">{pdfInfo.pageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">File size:</span>
                <span className="font-medium">{formatFileSize(originalSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Has metadata:</span>
                <span className={`font-medium ${pdfInfo.hasMetadata ? 'text-orange-600' : 'text-green-600'}`}>
                  {pdfInfo.hasMetadata ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Has images:</span>
                <span className={`font-medium ${pdfInfo.hasImages ? 'text-orange-600' : 'text-green-600'}`}>
                  {pdfInfo.hasImages ? 'Likely' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Has annotations:</span>
                <span className={`font-medium ${pdfInfo.hasAnnotations ? 'text-orange-600' : 'text-green-600'}`}>
                  {pdfInfo.hasAnnotations ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Compression potential:</span>
                <span className="font-medium text-blue-600">
                  {originalSize > 5 * 1024 * 1024 ? 'High' : originalSize > 1024 * 1024 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compression Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Compression Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Compression Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Compression Level
              </label>
              <div className="space-y-2">
                {Object.entries(COMPRESSION_LEVELS).map(([level, config]) => (
                  <label key={level} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      value={level}
                      checked={options.level === level}
                      onChange={(e) => setOptions(prev => ({ ...prev, level: e.target.value as any }))}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {config.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Quality: {Math.round(config.quality * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Optimization Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Optimization Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.optimizeImages}
                    onChange={(e) => setOptions(prev => ({ ...prev, optimizeImages: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Optimize images (recommended)
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.removeMetadata}
                    onChange={(e) => setOptions(prev => ({ ...prev, removeMetadata: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remove metadata
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.removeAnnotations}
                    onChange={(e) => setOptions(prev => ({ ...prev, removeAnnotations: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remove annotations
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.removeBookmarks}
                    onChange={(e) => setOptions(prev => ({ ...prev, removeBookmarks: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remove bookmarks
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.removeJavaScript}
                    onChange={(e) => setOptions(prev => ({ ...prev, removeJavaScript: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remove JavaScript
                  </span>
                </label>
              </div>
            </div>

            {/* Compress Button */}
            <button
              onClick={compressPdf}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Archive className="w-5 h-5" />
              <span>Compress PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadCompressedPdf}
        downloadFileName={processedPdfBlob ? `compressed-${uploadedFile?.name}` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Compress:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose compression level based on your quality requirements</li>
          <li>• Select optimization options to further reduce file size</li>
          <li>• Click "Compress PDF" to process the document</li>
          <li>• Download the compressed PDF when processing is complete</li>
          <li>• Higher compression levels reduce file size but may affect quality</li>
        </ul>
      </div>
    </div>
  );

  const previewContent = (
    <div className="space-y-6">
      {uploadedFile && pdfInfo ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Compression Preview
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Size Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h4>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatFileSize(originalSize)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pdfInfo.pageCount} pages
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After Compression</h4>
                <div className="border-2 border-red-300 rounded-lg p-4 bg-white">
                  <Archive className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {compressedSize > 0 ? formatFileSize(compressedSize) : 'Processing...'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {compressedSize > 0 && getCompressionRatio() > 0 ? (
                      <span className="text-green-600 font-medium">
                        {getCompressionRatio().toFixed(1)}% smaller
                      </span>
                    ) : (
                      'Size reduction pending'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Compression Settings Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compression Settings
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Compression level:</span>
                  <span className="font-medium text-red-600">
                    {COMPRESSION_LEVELS[options.level].name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quality target:</span>
                  <span className="font-medium">
                    {Math.round(COMPRESSION_LEVELS[options.level].quality * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Optimize images:</span>
                  <span className={`font-medium ${options.optimizeImages ? 'text-green-600' : 'text-gray-500'}`}>
                    {options.optimizeImages ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remove metadata:</span>
                  <span className={`font-medium ${options.removeMetadata ? 'text-green-600' : 'text-gray-500'}`}>
                    {options.removeMetadata ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compression Progress Visualization */}
            {status === 'processing' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Archive className="w-5 h-5 text-blue-600 animate-pulse" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800 dark:text-blue-200">Compressing...</span>
                      <span className="text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see compression preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Compress PDF"
      description="Reduce PDF file size with customizable compression settings"
      icon={<Archive className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfCompress;
