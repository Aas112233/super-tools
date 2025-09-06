import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ToolErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  toolName?: string;
}

const ToolErrorFallback: React.FC<ToolErrorFallbackProps> = ({ 
  error, 
  resetError, 
  toolName = 'Tool' 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 space-y-6">
        {/* Error Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {toolName} Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This tool encountered an error and couldn't load properly.
          </p>
        </div>

        {/* Error Details */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Error Details:
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
              {error.message || error.toString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {resetError && (
            <button
              onClick={resetError}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/tools/dashboard')}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Dashboard
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          If this problem persists, try refreshing the page or clearing your browser cache.
        </div>
      </div>
    </div>
  );
};

export default ToolErrorFallback;