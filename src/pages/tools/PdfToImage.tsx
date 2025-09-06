import React, { useState, useCallback } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ToolPage } from '../../components/ToolPage';
import { PdfUpload, PdfPreview, PdfProgress } from '../../components/pdf';
import { Image, Settings, Download, Grid } from 'lucide-react';

// Set up PDF.js worker
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

type ImageFormat = 'png' | 'jpeg' | 'webp';

interface ConversionSettings {
  format: ImageFormat;
  quality: number;
  scale: number;
  convertAllPages: boolean;
  selectedPages: string;
}

const PdfToImage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [convertedImages, setConvertedImages] = useState<Blob[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'png',
    quality: 0.9,
    scale: 2.0,
    convertAllPages: true,
    selectedPages: '1'
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setConvertedImages([]);
      setTotalPages(0);
    }
  }, []);

  const parsePageNumbers = (pageString: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const parts = pageString.split(',').map(part => part.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(num => parseInt(num.trim()));
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPages && start <= end) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const convertPdfToImages = async () => {
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
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      setProgress(10);
      setMessage(`PDF loaded with ${numPages} page(s)`);

      // Determine which pages to convert
      let pagesToConvert: number[];
      if (settings.convertAllPages) {
        pagesToConvert = Array.from({ length: numPages }, (_, i) => i + 1);
      } else {
        pagesToConvert = parsePageNumbers(settings.selectedPages, numPages);
        if (pagesToConvert.length === 0) {
          setStatus('error');
          setMessage('Invalid page selection. Please check your page numbers.');
          return;
        }
      }

      setMessage(`Converting ${pagesToConvert.length} page(s) to ${settings.format.toUpperCase()}...`);
      
      const images: Blob[] = [];
      const totalProgressPerPage = 80 / pagesToConvert.length;

      for (let i = 0; i < pagesToConvert.length; i++) {
        const pageNum = pagesToConvert[i];
        setMessage(`Converting page ${pageNum} of ${numPages}...`);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: settings.scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (!context) {
          throw new Error('Could not get canvas context');
        }

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            },
            `image/${settings.format}`,
            settings.format === 'jpeg' ? settings.quality : undefined
          );
        });

        images.push(blob);
        setProgress(10 + (i + 1) * totalProgressPerPage);
      }

      setConvertedImages(images);
      setProgress(95);
      setMessage('Finalizing conversion...');

      setProgress(100);
      setStatus('success');
      setMessage(`Successfully converted ${images.length} page(s) to ${settings.format.toUpperCase()} format!`);
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      setStatus('error');
      setMessage('Failed to convert PDF to images. Please ensure the file is a valid PDF.');
    }
  };

  const downloadImages = async () => {
    if (convertedImages.length === 0) return;

    if (convertedImages.length === 1) {
      // Download single image
      const fileName = `page-1.${settings.format}`;
      saveAs(convertedImages[0], fileName);
    } else {
      // Create ZIP file for multiple images
      setMessage('Creating ZIP archive...');
      const zip = new JSZip();
      
      convertedImages.forEach((blob, index) => {
        const fileName = `page-${index + 1}.${settings.format}`;
        zip.file(fileName, blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const fileName = `pdf-images-${Date.now()}.zip`;
      saveAs(zipBlob, fileName);
    }
  };

  const getImagePreview = (blob: Blob): string => {
    return URL.createObjectURL(blob);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            PDF to Image
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Convert PDF pages to high-quality images in PNG, JPEG, or WebP format.
          </p>
        </div>
        
        <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Image className="w-5 h-5 text-blue-500" />
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

        {/* PDF Preview and Settings */}
        {uploadedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  PDF Preview
                </h3>
              </div>
              
              <div className="p-4">
                <PdfPreview
                  file={uploadedFile}
                  maxWidth={400}
                />
              </div>
            </div>

            {/* Conversion Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Conversion Settings
                  </h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Output Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Format
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as ImageFormat }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="png">PNG (Lossless, supports transparency)</option>
                    <option value="jpeg">JPEG (Compressed, smaller file size)</option>
                    <option value="webp">WebP (Modern format, good compression)</option>
                  </select>
                </div>

                {/* Quality (for JPEG) */}
                {settings.format === 'jpeg' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quality: {Math.round(settings.quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={settings.quality}
                      onChange={(e) => setSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Scale/Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resolution Scale: {settings.scale}x
                  </label>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.5"
                    value={settings.scale}
                    onChange={(e) => setSettings(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Higher scale = better quality but larger file size
                  </p>
                </div>

                {/* Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pages to Convert
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={settings.convertAllPages}
                        onChange={() => setSettings(prev => ({ ...prev, convertAllPages: true }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Convert all pages
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={!settings.convertAllPages}
                        onChange={() => setSettings(prev => ({ ...prev, convertAllPages: false }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Specific pages
                      </span>
                    </label>
                  </div>
                  
                  {!settings.convertAllPages && (
                    <input
                      type="text"
                      value={settings.selectedPages}
                      onChange={(e) => setSettings(prev => ({ ...prev, selectedPages: e.target.value }))}
                      placeholder="e.g., 1-3,5,7-10"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                {/* Convert Button */}
                <button
                  onClick={convertPdfToImages}
                  disabled={!uploadedFile || status === 'processing'}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Image className="w-5 h-5" />
                  <span>Convert to Images</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <PdfProgress
          status={status}
          progress={progress}
          message={message}
          onDownload={downloadImages}
          downloadFileName={convertedImages.length === 1 ? `page-1.${settings.format}` : `pdf-images.zip`}
        />

        {/* Image Preview */}
        {convertedImages.length > 0 && status === 'success' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Grid className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Converted Images ({convertedImages.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {convertedImages.slice(0, 8).map((blob, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <img
                    src={getImagePreview(blob)}
                    alt={`Page ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Page {index + 1}
                    </p>
                  </div>
                </div>
              ))}
              
              {convertedImages.length > 8 && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    +{convertedImages.length - 8} more
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            How to use PDF to Image:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Upload a PDF file using the upload area above</li>
            <li>• Choose your output format: PNG for transparency, JPEG for smaller files</li>
            <li>• Adjust quality and resolution settings as needed</li>
            <li>• Select which pages to convert (all pages or specific ranges)</li>
            <li>• Click "Convert to Images" to start the conversion</li>
            <li>• Download individual image or ZIP file with all images</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PdfToImage;