import React from 'react';

const ImageColorPicker: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            Image Color Picker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Pick colors from any image
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">This tool is currently under development. Please check back soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ImageColorPicker;