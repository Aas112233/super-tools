import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

const JwtEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('decode');

  const handleProcess = () => {
    // This is a placeholder - actual implementation would require a JWT library
    if (input.trim()) {
      if (mode === 'decode') {
        setHeader('Header will appear here...');
        setPayload('Payload will appear here...');
        setSignature('Signature will appear here...');
      } else {
        // Encode mode
        // Implementation would go here
      }
    } else {
      setHeader('');
      setPayload('');
      setSignature('');
    }
  };

  const copyToClipboard = async () => {
    if (input) {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4">
            JWT Encoder/Decoder
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Encode or decode JSON Web Tokens (JWT) to view or create token headers, payloads, and signatures.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 w-fit">
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Decode JWT
            </button>
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Encode JWT
            </button>
          </div>

          {mode === 'decode' ? (
            <>
              {/* Input Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">JWT Token</h2>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter JWT token to decode..."
                    className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-rose-400 focus:outline-none resize-none"
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
              </div>

              {/* Decoded Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
                  <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Header</h3>
                  <textarea
                    value={header}
                    readOnly
                    placeholder="Header will appear here..."
                    className="w-full h-32 p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg resize-none text-sm"
                  />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
                  <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Payload</h3>
                  <textarea
                    value={payload}
                    readOnly
                    placeholder="Payload will appear here..."
                    className="w-full h-32 p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg resize-none text-sm"
                  />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">Signature</h3>
                    <button
                      onClick={() => setShowSignature(!showSignature)}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {showSignature ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <textarea
                    value={showSignature ? signature : signature ? '*'.repeat(signature.length) : ''}
                    readOnly
                    placeholder="Signature will appear here..."
                    className="w-full h-32 p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg resize-none text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Encode Mode Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Header (JSON)</h2>
                  <textarea
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder='{"alg": "HS256", "typ": "JWT"}'
                    className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-rose-400 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Payload (JSON)</h2>
                  <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder='{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
                    className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-rose-400 focus:outline-none resize-none"
                  />
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Secret</h2>
                <input
                  type="password"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">JWT Token</h2>
                <div className="relative">
                  <textarea
                    value={input}
                    readOnly
                    placeholder="Generated JWT token will appear here..."
                    className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none"
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
              </div>
            </>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleProcess}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-colors"
            >
              {mode === 'decode' ? 'Decode JWT' : 'Encode JWT'}
            </button>
            <button 
              onClick={() => {
                setInput('');
                setHeader('');
                setPayload('');
                setSignature('');
              }}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Information */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">About JWT</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              JSON Web Tokens (JWT) are an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtEncoderDecoder;