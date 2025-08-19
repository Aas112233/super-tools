import React from 'react';

export const JavascriptFormatter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-4">
            JavaScript Formatter
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Format and prettify your JavaScript code with proper indentation and structure for better readability.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Input JavaScript</h2>
              <div className="relative">
                <textarea
                  placeholder="Paste your JavaScript code here..."
                  className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-yellow-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Output Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Formatted JavaScript</h2>
              <div className="relative">
                <textarea
                  placeholder="Formatted JavaScript will appear here..."
                  readOnly
                  className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors">
              Format JavaScript
            </button>
            <button className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors">
              Copy to Clipboard
            </button>
            <button className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors">
              Clear All
            </button>
          </div>

          {/* Options */}
          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Formatting Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Indent Size</label>
                <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <option>2 spaces</option>
                  <option>4 spaces</option>
                  <option>Tab</option>
                </select>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="semi-colons" className="mr-2" defaultChecked />
                <label htmlFor="semi-colons" className="text-slate-700 dark:text-slate-300">Semicolons</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="single-quotes" className="mr-2" />
                <label htmlFor="single-quotes" className="text-slate-700 dark:text-slate-300">Single quotes</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};