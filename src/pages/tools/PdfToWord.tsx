import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { FileText, Download, Eye, Type, FileType } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

interface ConversionOptions {
  format: 'docx' | 'rtf' | 'txt';
  preserveFormatting: boolean;
  extractImages: boolean;
  includeHeaders: boolean;
  includeFooters: boolean;
  pageBreaks: boolean;
}

const PdfToWord: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ConversionOptions>({
    format: 'docx',
    preserveFormatting: true,
    extractImages: false,
    includeHeaders: true,
    includeFooters: true,
    pageBreaks: true
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [convertedFileBlob, setConvertedFileBlob] = useState<Blob | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setConvertedFileBlob(null);
      setExtractedText('');
      setPreviewText('');
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setPdfPageCount(pageCount);
        
        // Extract preview text from first page
        await extractPreviewText(arrayBuffer);
        
        setMessage(`PDF loaded with ${pageCount} pages`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setMessage('Failed to load PDF file');
      }
    }
  }, []);

  const extractPreviewText = async (arrayBuffer: ArrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      
      const text = textContent.items
        .filter((item): item is any => 'str' in item)
        .map(item => item.str)
        .join(' ');
      
      setPreviewText(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
    } catch (error) {
      console.error('Error extracting preview text:', error);
    }
  };

  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .filter((item): item is any => 'str' in item)
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText;
      
      if (options.pageBreaks && pageNum < pdf.numPages) {
        fullText += '\n\n--- Page Break ---\n\n';
      }
      
      setProgress(20 + (pageNum / pdf.numPages) * 60);
    }
    
    return fullText;
  };

  const generateDocxContent = (text: string): string => {
    // Basic DOCX XML structure
    const docxHeader = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>`;
    
    const docxFooter = `  </w:body>
</w:document>`;

    // Split text into paragraphs and wrap in DOCX XML
    const paragraphs = text.split('\n\n').map(paragraph => {
      if (paragraph.trim()) {
        return `    <w:p>
      <w:r>
        <w:t>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</w:t>
      </w:r>
    </w:p>`;
      }
      return '';
    }).join('\n');

    return docxHeader + '\n' + paragraphs + '\n' + docxFooter;
  };

  const generateRtfContent = (text: string): string => {
    // Basic RTF structure
    const rtfHeader = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}`;
    const rtfFooter = `}`;
    
    // Escape RTF special characters and format paragraphs
    const formattedText = text
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .split('\n\n')
      .map(paragraph => paragraph.trim() ? `\\par ${paragraph}` : '')
      .join('\n');

    return rtfHeader + '\n' + formattedText + '\n' + rtfFooter;
  };

  const convertToWord = async () => {
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
      
      setProgress(10);
      setMessage('Extracting text from PDF...');

      const extractedText = await extractTextFromPdf(arrayBuffer);
      setExtractedText(extractedText);
      
      setProgress(80);
      setMessage('Converting to Word format...');

      let fileContent: string;
      let mimeType: string;
      let extension: string;

      switch (options.format) {
        case 'docx':
          fileContent = generateDocxContent(extractedText);
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          extension = 'docx';
          break;
        case 'rtf':
          fileContent = generateRtfContent(extractedText);
          mimeType = 'application/rtf';
          extension = 'rtf';
          break;
        case 'txt':
          fileContent = extractedText;
          mimeType = 'text/plain';
          extension = 'txt';
          break;
        default:
          throw new Error('Unsupported format');
      }

      setProgress(90);
      setMessage('Finalizing conversion...');

      const blob = new Blob([fileContent], { type: mimeType });
      setConvertedFileBlob(blob);
      
      setProgress(100);
      setStatus('success');
      setMessage(`Successfully converted PDF to ${options.format.toUpperCase()}!`);
    } catch (error) {
      console.error('Error converting PDF:', error);
      setStatus('error');
      setMessage('Failed to convert PDF. Please ensure the file is a valid PDF with text content.');
    }
  };

  const downloadConvertedFile = () => {
    if (convertedFileBlob) {
      const extension = options.format;
      const fileName = `converted-${uploadedFile?.name?.replace('.pdf', '')}.${extension}`;
      saveAs(convertedFileBlob, fileName);
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

      {/* Conversion Settings */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileType className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conversion Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'docx', label: 'DOCX', desc: 'Word Document' },
                  { value: 'rtf', label: 'RTF', desc: 'Rich Text Format' },
                  { value: 'txt', label: 'TXT', desc: 'Plain Text' }
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setOptions(prev => ({ ...prev, format: format.value as any }))}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      options.format === format.value
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conversion Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.preserveFormatting}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveFormatting: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Preserve formatting (where possible)
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.pageBreaks}
                    onChange={(e) => setOptions(prev => ({ ...prev, pageBreaks: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include page breaks
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeHeaders}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include headers
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeFooters}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeFooters: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include footers
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.extractImages}
                    onChange={(e) => setOptions(prev => ({ ...prev, extractImages: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    disabled
                  />
                  <span className="text-sm text-gray-500">
                    Extract images (coming soon)
                  </span>
                </label>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={convertToWord}
              disabled={!uploadedFile || status === 'processing'}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Convert to {options.format.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadConvertedFile}
        downloadFileName={convertedFileBlob ? `converted.${options.format}` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF to Word:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload a PDF file using the upload area above</li>
          <li>• Choose output format (DOCX, RTF, or TXT)</li>
          <li>• Configure conversion options as needed</li>
          <li>• Click "Convert" to extract text from PDF</li>
          <li>• Download the converted file when processing is complete</li>
          <li>• Note: Only text content is extracted, complex layouts may not be preserved</li>
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
              Conversion Preview
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Document Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{pdfPageCount}</div>
                <div className="text-sm text-blue-800 dark:text-blue-200">Pages</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{options.format.toUpperCase()}</div>
                <div className="text-sm text-green-800 dark:text-green-200">Output Format</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(1)}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200">MB Size</div>
              </div>
            </div>

            {/* Text Preview */}
            {previewText && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text Preview (First Page)
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono">
                    {previewText}
                  </pre>
                </div>
              </div>
            )}

            {/* Conversion Settings Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conversion Settings
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Format:</span>
                  <span className="font-medium">{options.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Page breaks:</span>
                  <span className="font-medium">{options.pageBreaks ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Preserve formatting:</span>
                  <span className="font-medium">{options.preserveFormatting ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Include headers:</span>
                  <span className="font-medium">{options.includeHeaders ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Conversion Process Visualization */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-center">
                <FileText className="w-8 h-8 text-red-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">PDF Input</div>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <div className="text-center">
                <Type className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Text Extraction</div>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <div className="text-center">
                <FileType className="w-8 h-8 text-green-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">{options.format.toUpperCase()} Output</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <FileType className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload a PDF to see conversion preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="PDF to Word"
      description="Convert PDF documents to Word, RTF, or plain text formats"
      icon={<FileType className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfToWord;