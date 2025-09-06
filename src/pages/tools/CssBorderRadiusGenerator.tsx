import React, { useState } from 'react';
import { Copy, Download } from 'lucide-react';

const CssBorderRadiusGenerator: React.FC = () => {
  const [topLeft, setTopLeft] = useState(10);
  const [topRight, setTopRight] = useState(10);
  const [bottomRight, setBottomRight] = useState(10);
  const [bottomLeft, setBottomLeft] = useState(10);
  const [unit, setUnit] = useState('px');

  const generateCSS = () => {
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS());
  };

  const downloadCSS = () => {
    const element = document.createElement('a');
    const file = new Blob([generateCSS()], { type: 'text/css' });
    element.href = URL.createObjectURL(file);
    element.download = 'border-radius.css';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">CSS Border Radius Generator</h1>
          <p className="text-gray-600">Create custom border radius styles with live preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top Left: {topLeft}{unit}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={topLeft}
                  onChange={(e) => setTopLeft(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top Right: {topRight}{unit}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={topRight}
                  onChange={(e) => setTopRight(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bottom Right: {bottomRight}{unit}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bottomRight}
                  onChange={(e) => setBottomRight(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bottom Left: {bottomLeft}{unit}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bottomLeft}
                  onChange={(e) => setBottomLeft(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="px">px</option>
                  <option value="%">%</option>
                  <option value="em">em</option>
                  <option value="rem">rem</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Preview</h2>
            
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div
                className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600"
                style={{
                  borderRadius: `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
                }}
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Generated CSS</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                {generateCSS()}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy size={16} />
                  Copy CSS
                </button>
                <button
                  onClick={downloadCSS}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssBorderRadiusGenerator;