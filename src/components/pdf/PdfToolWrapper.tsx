import React, { useState } from 'react';
import { Settings, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PdfToolWrapperProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  settingsContent: React.ReactNode;
  previewContent: React.ReactNode;
  className?: string;
}

export const PdfToolWrapper: React.FC<PdfToolWrapperProps> = ({
  title,
  description,
  icon,
  settingsContent,
  previewContent,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="tool-container">
        {/* Tool Header */}
        <div className="tool-header">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 justify-center ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 justify-center ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'settings' && (
            <div className="input-section">
              {settingsContent}
            </div>
          )}
          {activeTab === 'preview' && (
            <div className="output-section">
              {previewContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfToolWrapper;