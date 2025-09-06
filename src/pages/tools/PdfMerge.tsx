import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { PdfUpload, PdfToolWrapper, PdfProgress } from '../../components/pdf';
import { FileText, Merge, Eye, ArrowUpDown, Trash2, Plus } from 'lucide-react';

interface PdfFile {
  file: File;
  id: string;
  pageCount: number;
}

const PdfMerge: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<PdfFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [mergedPdfBlob, setMergedPdfBlob] = useState<Blob | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newPdfFiles: PdfFile[] = [];
    
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        newPdfFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          pageCount
        });
      } catch (error) {
        console.error(`Error loading PDF ${file.name}:`, error);
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newPdfFiles]);
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setMergedPdfBlob(null);
  }, []);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...uploadedFiles];
    const [moved] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, moved);
    setUploadedFiles(newFiles);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveFile(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const mergePdfs = async () => {
    if (uploadedFiles.length < 2) {
      setStatus('error');
      setMessage('Please upload at least 2 PDF files to merge.');
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setMessage('Loading PDF documents...');

      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const pdfFile = uploadedFiles[i];
        setMessage(`Processing ${pdfFile.file.name}...`);
        
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        
        const pageCount = sourcePdf.getPageCount();
        const pageIndices = Array.from({ length: pageCount }, (_, index) => index);
        
        const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(page => mergedPdf.addPage(page));
        
        setProgress(((i + 1) / uploadedFiles.length) * 80);
      }

      setProgress(90);
      setMessage('Saving merged PDF...');

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedPdfBlob(blob);
      
      setProgress(100);
      setStatus('success');
      
      const totalPages = uploadedFiles.reduce((sum, file) => sum + file.pageCount, 0);
      setMessage(`Successfully merged ${uploadedFiles.length} PDFs into one document with ${totalPages} pages!`);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setStatus('error');
      setMessage('Failed to merge PDFs. Please ensure all files are valid PDFs.');
    }
  };

  const downloadMergedPdf = () => {
    if (mergedPdfBlob) {
      const fileName = `merged-${Date.now()}.pdf`;
      saveAs(mergedPdfBlob, fileName);
    }
  };

  const settingsContent = (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Plus className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upload PDF Files
          </h2>
        </div>
        
        <PdfUpload
          onFilesSelected={handleFilesSelected}
          multiple={true}
          accept={{ 'application/pdf': ['.pdf'] }}
          disabled={status === 'processing'}
        />
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Upload multiple PDF files to merge them into a single document
        </p>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                PDF Files ({uploadedFiles.length})
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag to reorder
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {uploadedFiles.map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {pdfFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pdfFile.pageCount} pages • {(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>#{index + 1}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(pdfFile.id)}
                  disabled={status === 'processing'}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Merge Button */}
          <button
            onClick={mergePdfs}
            disabled={uploadedFiles.length < 2 || status === 'processing'}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Merge className="w-5 h-5" />
            <span>Merge PDFs</span>
          </button>
        </div>
      )}

      {/* Progress Section */}
      <PdfProgress
        status={status}
        progress={progress}
        message={message}
        onDownload={downloadMergedPdf}
        downloadFileName={mergedPdfBlob ? 'merged.pdf' : undefined}
      />

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
          How to use PDF Merge:
        </h3>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• Upload multiple PDF files using the upload area above</li>
          <li>• Drag and drop files to reorder them as needed</li>
          <li>• Remove unwanted files using the trash icon</li>
          <li>• Click "Merge PDFs" to combine all files into one document</li>
          <li>• The merged PDF will maintain the order you've arranged</li>
          <li>• Download the merged PDF when processing is complete</li>
        </ul>
      </div>
    </div>
  );

  const previewContent = (
    <div className="space-y-6">
      {uploadedFiles.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Merge Preview
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Merge Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{uploadedFiles.length}</div>
                <div className="text-sm text-blue-800 dark:text-blue-200">PDF Files</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {uploadedFiles.reduce((sum, file) => sum + file.pageCount, 0)}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">Total Pages</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">
                  {(uploadedFiles.reduce((sum, file) => sum + file.file.size, 0) / 1024 / 1024).toFixed(1)}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200">Total Size (MB)</div>
              </div>
            </div>

            {/* File Order Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Merge Order (drag files in settings to reorder)
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((pdfFile, index) => (
                  <div
                    key={pdfFile.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 text-sm font-medium rounded-full">
                      {index + 1}
                    </div>
                    <FileText className="w-5 h-5 text-red-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {pdfFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pdfFile.pageCount} pages
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pages {index === 0 ? 1 : uploadedFiles.slice(0, index).reduce((sum, f) => sum + f.pageCount, 0) + 1}-
                      {uploadedFiles.slice(0, index + 1).reduce((sum, f) => sum + f.pageCount, 0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Distribution Visualization */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Distribution
              </h4>
              <div className="flex h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {uploadedFiles.map((file, index) => {
                  const totalPages = uploadedFiles.reduce((sum, f) => sum + f.pageCount, 0);
                  const percentage = (file.pageCount / totalPages) * 100;
                  const colors = [
                    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
                  ];
                  
                  return (
                    <div
                      key={file.id}
                      className={`${colors[index % colors.length]} flex items-center justify-center text-white text-xs font-medium`}
                      style={{ width: `${percentage}%` }}
                      title={`${file.file.name}: ${file.pageCount} pages (${percentage.toFixed(1)}%)`}
                    >
                      {percentage > 5 && file.pageCount}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Start</span>
                <span>End ({uploadedFiles.reduce((sum, f) => sum + f.pageCount, 0)} pages total)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Merge className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload PDF files to see merge preview
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PdfToolWrapper
      title="Merge PDFs"
      description="Combine multiple PDF documents into a single file with custom ordering"
      icon={<Merge className="w-6 h-6 text-red-600" />}
      settingsContent={settingsContent}
      previewContent={previewContent}
    />
  );
};

export default PdfMerge;