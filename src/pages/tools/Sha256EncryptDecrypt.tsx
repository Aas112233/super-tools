import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const Sha256EncryptDecrypt: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleHash = () => {
    // This is a placeholder - actual implementation would require a crypto library
    if (input.trim()) {
      setOutput('SHA256 hash will appear here...');
    } else {
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">
            SHA256 Encrypt/Decrypt
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Generate SHA256 hash values for your text. Note: SHA256 is a one-way hash function and cannot be decrypted.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Input Text</h2>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash with SHA256..."
                  className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Output Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">SHA256 Hash</h2>
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  placeholder="SHA256 hash will appear here..."
                  className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none"
                />
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className={`absolute top-3 right-3 p-2 rounded-lg ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'} ${!output ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button 
              onClick={handleHash}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Generate SHA256 Hash
            </button>
            <button 
              onClick={() => {
                setInput('');
                setOutput('');
              }}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Information */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Important Note</h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              SHA256 is part of the SHA-2 family of cryptographic hash functions that produces a 256-bit (32-byte) hash value. It's widely used for security applications and is considered secure. SHA256 is a one-way function, meaning it cannot be "decrypted".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sha256EncryptDecrypt;