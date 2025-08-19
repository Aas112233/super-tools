import React from 'react';

export const HtmlMinifier: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4">
            HTML Minifier
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Compress your HTML code by removing unnecessary characters, whitespace, and comments while preserving functionality.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Input HTML</h2>
              <div className="relative">
                <textarea
                  placeholder="Paste your HTML code here..."
                  className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-rose-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Output Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Minified HTML</h2>
              <div className="relative">
                <textarea
                  placeholder="Minified HTML will appear here..."
                  readOnly
                  className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-colors">
              Minify HTML
            </button>
            <button className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors">
              Copy to Clipboard
            </button>
            <button className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors">
              Clear All
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Original Size</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0 bytes</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Minified Size</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0 bytes</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Compression</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};