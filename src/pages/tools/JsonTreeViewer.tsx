import React, { useState } from 'react';
import { Copy, Check, FileJson } from 'lucide-react';

export const JsonTreeViewer: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleFormat = () => {
    if (!input.trim()) {
      setError('');
      return;
    }

    try {
      // Try to parse and re-stringify for formatting
      JSON.parse(input);
      setError('');
      // In a real implementation, this would update the tree view
    } catch (e) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const copyToClipboard = async () => {
    if (input) {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadSample = () => {
    setInput(`{
  "name": "John Doe",
  "age": 30,
  "isStudent": false,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001"
  },
  "hobbies": [
    "reading",
    "swimming",
    "coding"
  ],
  "spouse": null
}`);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            JSON Tree Viewer
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Visualize your JSON data in an interactive tree structure. Easily explore and navigate complex JSON objects.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">JSON Input</h2>
                <button
                  onClick={loadSample}
                  className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
                >
                  Load Sample
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="w-full h-96 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-amber-400 focus:outline-none resize-none font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  disabled={!input}
                  className={`absolute top-3 right-3 p-2 rounded-lg ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'} ${!input ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
              )}
            </div>

            {/* Tree View Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Tree View</h2>
              <div className="h-96 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-auto">
                {input ? (
                  <div className="text-slate-600 dark:text-slate-400">
                    <p>JSON tree visualization will appear here...</p>
                    <p className="mt-2 text-sm">In a full implementation, this would show an interactive tree structure of your JSON data.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                    <FileJson className="w-12 h-12 mb-3" />
                    <p>Enter JSON data to visualize</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button 
              onClick={handleFormat}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
            >
              Visualize JSON
            </button>
            <button 
              onClick={() => {
                setInput('');
                setError('');
              }}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Lines</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Keys</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Values</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300">Depth</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};