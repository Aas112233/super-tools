import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface PdfUploadProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
  className?: string;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({
  onFilesSelected,
  multiple = false,
  maxFiles = 1,
  accept = { 'application/pdf': ['.pdf'] },
  disabled = false,
  className = ''
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.errors?.[0]?.code === 'file-invalid-type') {
        setError('Please select PDF files only');
      } else if (rejectedFile.errors?.[0]?.code === 'file-too-large') {
        setError('File size is too large. Maximum size is 100MB');
      } else {
        setError('Invalid file selected');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const newFiles = multiple ? [...uploadedFiles, ...acceptedFiles] : acceptedFiles;
      setUploadedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  }, [uploadedFiles, multiple, onFilesSelected]);

  const removeFile = useCallback((index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [uploadedFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className={`w-12 h-12 ${error ? 'text-red-400' : 'text-blue-400'}`} />
          
          <div className="space-y-1">
            <p className={`text-lg font-medium ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {isDragActive 
                ? 'Drop PDF files here...' 
                : multiple 
                  ? 'Drop PDF files here or click to browse'
                  : 'Drop a PDF file here or click to browse'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {multiple 
                ? `Maximum ${maxFiles} files, up to 100MB each`
                : 'Maximum file size: 100MB'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;