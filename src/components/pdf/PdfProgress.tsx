import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';

interface PdfProgressProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress?: number;
  message?: string;
  onDownload?: () => void;
  downloadFileName?: string;
  className?: string;
}

export const PdfProgress: React.FC<PdfProgressProps> = ({
  status,
  progress = 0,
  message,
  onDownload,
  downloadFileName,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return message || 'Processing PDF...';
      case 'success':
        return message || 'PDF processed successfully!';
      case 'error':
        return message || 'An error occurred while processing the PDF.';
      default:
        return message || 'Ready to process';
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} ${className}`}>
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              status === 'error' 
                ? 'text-red-700 dark:text-red-300' 
                : status === 'success'
                ? 'text-green-700 dark:text-green-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {getStatusText()}
            </p>
            
            {status === 'success' && onDownload && (
              <button
                onClick={onDownload}
                className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </button>
            )}
          </div>
          
          {downloadFileName && status === 'success' && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              File: {downloadFileName}
            </p>
          )}
          
          {status === 'processing' && progress > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {status === 'processing' && progress === 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '30%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfProgress;