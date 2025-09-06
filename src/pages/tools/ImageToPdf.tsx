import React, { useState, useCallback } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { Image, Grid, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

interface UploadedImage {
  file: File;
  id: string;
  name: string;
  size: string;
  url: string;
}

type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | 'Custom';
type PageOrientation = 'portrait' | 'landscape';

interface ConversionSettings {
  pageSize: PageSize;
  orientation: PageOrientation;
  margin: number;
  imagePerPage: number;
  maintainAspectRatio: boolean;
  customWidth?: number;
  customHeight?: number;
}

const ImageToPdf: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    imagePerPage: 1,
    maintainAspectRatio: true
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleFilesSelected = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newImages: UploadedImage[] = imageFiles.map(file => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      url: URL.createObjectURL(file)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setPdfBlob(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  }, []);

  const moveImage = useCallback((id: string, direction: 'up' | 'down') => {
    setUploadedImages(prev => {
      const index = prev.findIndex(img => img.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newImages = [...prev];
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      return newImages;
    });
  }, []);

  const getPageDimensions = () => {
    let dimensions;
    
    switch (settings.pageSize) {
      case 'A4':
        dimensions = PageSizes.A4;
        break;
      case 'Letter':
        dimensions = PageSizes.Letter;
        break;
      case 'Legal':
        dimensions = PageSizes.Legal;
        break;
      case 'A3':
        dimensions = PageSizes.A3;
        break;
      case 'A5':
        dimensions = PageSizes.A5;
        break;
      case 'Custom':
        dimensions = [settings.customWidth || 612, settings.customHeight || 792];
        break;
      default:
        dimensions = PageSizes.A4;
    }
    
    if (settings.orientation === 'landscape') {
      return [dimensions[1], dimensions[0]];
    }
    return dimensions;
  };

  const convertToPdf = async () => {
    if (uploadedImages.length === 0) {
      setStatus('error');
      setMessage('Please upload at least one image.');
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setMessage('Creating PDF document...');

      const pdfDoc = await PDFDocument.create();
      const [pageWidth, pageHeight] = getPageDimensions();
      const margin = settings.margin;
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);

      setProgress(10);

      for (let i = 0; i < uploadedImages.length; i += settings.imagePerPage) {
        setMessage(`Processing page ${Math.floor(i / settings.imagePerPage) + 1}...`);
        setProgress(10 + (i / uploadedImages.length) * 80);

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const imagesOnThisPage = uploadedImages.slice(i, i + settings.imagePerPage);

        for (let j = 0; j < imagesOnThisPage.length; j++) {
          const imageFile = imagesOnThisPage[j];
          
          try {
            const imageBytes = await imageFile.file.arrayBuffer();
            let image;
            
            if (imageFile.file.type === 'image/jpeg' || imageFile.file.type === 'image/jpg') {
              image = await pdfDoc.embedJpg(imageBytes);
            } else if (imageFile.file.type === 'image/png') {
              image = await pdfDoc.embedPng(imageBytes);
            } else {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const img = new window.Image();
              
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageFile.url;
              });
              
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              
              const pngDataUrl = canvas.toDataURL('image/png');
              const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
              image = await pdfDoc.embedPng(pngBytes);
            }

            const { width: imgWidth, height: imgHeight } = image.scale(1);
            
            let finalWidth, finalHeight;
            
            if (settings.maintainAspectRatio) {
              const widthScale = availableWidth / imgWidth;
              const heightScale = (availableHeight / settings.imagePerPage) / imgHeight;
              const scale = Math.min(widthScale, heightScale);
              
              finalWidth = imgWidth * scale;
              finalHeight = imgHeight * scale;
            } else {
              finalWidth = availableWidth;
              finalHeight = availableHeight / settings.imagePerPage;
            }

            const yPosition = pageHeight - margin - (j + 1) * (availableHeight / settings.imagePerPage) + (availableHeight / settings.imagePerPage - finalHeight) / 2;
            const xPosition = margin + (availableWidth - finalWidth) / 2;

            page.drawImage(image, {
              x: xPosition,
              y: yPosition,
              width: finalWidth,
              height: finalHeight,
            });
          } catch (error) {
            console.error(`Error processing image ${imageFile.name}:`, error);
          }
        }
      }

      setProgress(90);
      setMessage('Finalizing PDF...');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlob(blob);

      setProgress(100);
      setStatus('success');
      setMessage('PDF created successfully!');
    } catch (error) {
      console.error('Error converting to PDF:', error);
      setStatus('error');
      setMessage('Failed to convert images to PDF. Please try again.');
    }
  };

  const downloadPdf = () => {
    if (pdfBlob) {
      const fileName = `images-to-pdf-${Date.now()}.pdf`;
      saveAs(pdfBlob, fileName);
    }
  };

  const clearAll = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setPdfBlob(null);
  };

  const settingsContent = (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Image className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upload Images
          </h2>
        </div>
        
        <PdfUpload
          onFilesSelected={handleFilesSelected}
          multiple={true}
          maxFiles={50}
          accept={{ 
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
          }}
          disabled={status === 'processing'}
        />
      </div>

      {/* Conversion Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            PDF Settings
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Page Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Size
            </label>
            <select
              value={settings.pageSize}
              onChange={(e) => setSettings(prev => ({ ...prev, pageSize: e.target.value as PageSize }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
              <option value="Legal">Legal (8.5 × 14 in)</option>
              <option value="A3">A3 (297 × 420 mm)</option>
              <option value="A5">A5 (148 × 210 mm)</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orientation
            </label>
            <select
              value={settings.orientation}
              onChange={(e) => setSettings(prev => ({ ...prev, orientation: e.target.value as PageOrientation }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Custom dimensions */}
          {settings.pageSize === 'Custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Width (points)
                </label>
                <input
                  type="number"
                  value={settings.customWidth || 612}
                  onChange={(e) => setSettings(prev => ({ ...prev, customWidth: parseInt(e.target.value) || 612 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Height (points)
                </label>
                <input
                  type="number"
                  value={settings.customHeight || 792}
                  onChange={(e) => setSettings(prev => ({ ...prev, customHeight: parseInt(e.target.value) || 792 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </>
          )}

          {/* Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Margin: {settings.margin}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.margin}
              onChange={(e) => setSettings(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Images per page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images per page
            </label>
            <select
              value={settings.imagePerPage}
              onChange={(e) => setSettings(prev => ({ ...prev, imagePerPage: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value={1}>1 image per page</option>
              <option value={2}>2 images per page</option>
              <option value={4}>4 images per page</option>
            </select>
          </div>
        </div>

        {/* Maintain aspect ratio */}
        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.maintainAspectRatio}
              onChange={(e) => setSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
              className="text-red-600 focus:ring-red-500 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Maintain aspect ratio
            </span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={convertToPdf}
          disabled={uploadedImages.length === 0 || status === 'processing'}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Image className="w-5 h-5" />
          <span>Convert to PDF</span>
        </button>
      </div>

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadPdf}
        downloadFileName={pdfBlob ? `images-to-pdf-${Date.now()}.pdf` : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use Image to PDF:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload multiple images (JPG, PNG, GIF, BMP, WebP)</li>
          <li>• Adjust PDF settings like page size, orientation, and layout</li>
          <li>• Choose how many images per page</li>
          <li>• Click "Convert to PDF" to create your document</li>
          <li>• Download the generated PDF file</li>
        </ul>
      </div>
    </div>
  );

  const previewContent = (
    <div className="space-y-6">
      {uploadedImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => moveImage(image.id, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-black/70 hover:bg-black/90 text-white rounded disabled:opacity-50"
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveImage(image.id, 'down')}
                    disabled={index === uploadedImages.length - 1}
                    className="p-1 bg-black/70 hover:bg-black/90 text-white rounded disabled:opacity-50"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-1 bg-red-600/70 hover:bg-red-600/90 text-white rounded"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {image.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {image.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload images to see preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Image to PDF"
      description="Convert multiple images into a single PDF document"
      icon={<Image className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default ImageToPdf;