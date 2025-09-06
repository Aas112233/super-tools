import React, { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { ToolPage } from '../../components/ToolPage';
import { PdfUpload, PdfProgress } from '../../components/pdf';
import { Info, FileText, User, Calendar, Tag } from 'lucide-react';

interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

const PdfMetadata: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalMetadata, setOriginalMetadata] = useState<PdfMetadata>({});
  const [editedMetadata, setEditedMetadata] = useState<PdfMetadata>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlob, setProcessedPdfBlob] = useState<Blob | null>(null);

  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setProcessedPdfBlob(null);
      setOriginalMetadata({});
      setEditedMetadata({});
      
      // Load metadata from the uploaded file
      loadMetadata(files[0]);
    }
  }, []);

  const loadMetadata = async (file: File) => {
    try {
      setMessage('Loading PDF metadata...');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const metadata: PdfMetadata = {
        title: pdfDoc.getTitle() || '',
        author: pdfDoc.getAuthor() || '',
        subject: pdfDoc.getSubject() || '',
        keywords: pdfDoc.getKeywords() || '',
        creator: pdfDoc.getCreator() || '',
        producer: pdfDoc.getProducer() || '',
        creationDate: pdfDoc.getCreationDate() || undefined,
        modificationDate: pdfDoc.getModificationDate() || undefined,
      };
      
      setOriginalMetadata(metadata);
      setEditedMetadata({ ...metadata });
      setMessage('');
    } catch (error) {
      console.error('Error loading metadata:', error);
      setStatus('error');
      setMessage('Failed to load PDF metadata. Please ensure the file is a valid PDF.');
    }
  };

  const updateMetadata = async () => {
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
      
      setProgress(30);
      setMessage('Updating metadata...');

      // Update metadata fields
      if (editedMetadata.title !== undefined) {
        pdfDoc.setTitle(editedMetadata.title);
      }
      if (editedMetadata.author !== undefined) {
        pdfDoc.setAuthor(editedMetadata.author);
      }
      if (editedMetadata.subject !== undefined) {
        pdfDoc.setSubject(editedMetadata.subject);
      }
      if (editedMetadata.keywords !== undefined) {
        // Convert keywords string to array if needed
        const keywordsArray = typeof editedMetadata.keywords === 'string' 
          ? editedMetadata.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
          : editedMetadata.keywords;
        pdfDoc.setKeywords(keywordsArray);
      }
      if (editedMetadata.creator !== undefined) {
        pdfDoc.setCreator(editedMetadata.creator);
      }
      if (editedMetadata.producer !== undefined) {
        pdfDoc.setProducer(editedMetadata.producer);
      }

      // Always update modification date to current time
      pdfDoc.setModificationDate(new Date());

      setProgress(70);
      setMessage('Saving PDF with updated metadata...');

      const pdfBytes = await pdfDoc.save();
      
      setProgress(90);
      setMessage('Finalizing PDF...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdfBlob(blob);
      
      setProgress(100);
      setStatus('success');
      setMessage('PDF metadata updated successfully!');
    } catch (error) {
      console.error('Error updating metadata:', error);
      setStatus('error');
      setMessage('Failed to update PDF metadata. Please ensure the file is a valid PDF.');
    }
  };

  const downloadUpdatedPdf = () => {
    if (processedPdfBlob) {
      const fileName = `updated-metadata-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const handleMetadataChange = (field: keyof PdfMetadata, value: string) => {
    setEditedMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetMetadata = () => {
    setEditedMetadata({ ...originalMetadata });
  };

  const clearAllMetadata = () => {
    setEditedMetadata({
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
    });
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Not set';
    return date.toLocaleString();
  };

  return (
    <ToolPage
      title="PDF Metadata"
      description="View and edit PDF document properties including title, author, subject, and keywords."
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
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

        {/* Metadata Editor */}
        {uploadedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Metadata */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Current Metadata
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Title:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100 break-words">
                    {originalMetadata.title || 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Author:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100 break-words">
                    {originalMetadata.author || 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Subject:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100 break-words">
                    {originalMetadata.subject || 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Keywords:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100 break-words">
                    {originalMetadata.keywords || 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Creator:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100 break-words">
                    {originalMetadata.creator || 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Producer:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100 break-words">
                    {originalMetadata.producer || 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Created:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100">
                    {formatDate(originalMetadata.creationDate)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Modified:</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-100">
                    {formatDate(originalMetadata.modificationDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Metadata */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Edit Metadata
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.title || ''}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    placeholder="Document title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.author || ''}
                    onChange={(e) => handleMetadataChange('author', e.target.value)}
                    placeholder="Document author"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.subject || ''}
                    onChange={(e) => handleMetadataChange('subject', e.target.value)}
                    placeholder="Document subject"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.keywords || ''}
                    onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                    placeholder="Comma-separated keywords"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Creator
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.creator || ''}
                    onChange={(e) => handleMetadataChange('creator', e.target.value)}
                    placeholder="Application that created the document"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Producer
                  </label>
                  <input
                    type="text"
                    value={editedMetadata.producer || ''}
                    onChange={(e) => handleMetadataChange('producer', e.target.value)}
                    placeholder="Application that produced the PDF"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={resetMetadata}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={clearAllMetadata}
                    className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Update Button */}
                <button
                  onClick={updateMetadata}
                  disabled={!uploadedFile || status === 'processing'}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Info className="w-5 h-5" />
                  <span>Update Metadata</span>
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
          onDownload={downloadUpdatedPdf}
          downloadFileName={processedPdfBlob ? `updated-metadata-${uploadedFile?.name}` : undefined}
        />

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            How to use PDF Metadata:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Upload a PDF file to view its current metadata</li>
            <li>• Edit any metadata fields in the form on the right</li>
            <li>• Use keywords to improve document searchability</li>
            <li>• Click "Update Metadata" to save changes</li>
            <li>• Download the updated PDF with new metadata</li>
            <li>• The modification date will be automatically updated</li>
          </ul>
        </div>
      </div>
    </ToolPage>
  );
};

export default PdfMetadata;