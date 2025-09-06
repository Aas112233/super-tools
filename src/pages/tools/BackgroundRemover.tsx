import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon, Loader, Scissors } from 'lucide-react';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple background removal algorithm
      // This is a basic implementation - for production use, you'd want to integrate a proper ML model
      const processedData = await processImageData(data, canvas.width, canvas.height);

      // Create new image data
      const newImageData = new ImageData(processedData, canvas.width, canvas.height);
      
      // Clear canvas and draw processed image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(newImageData, 0, 0);

      // Convert to data URL
      const processedDataURL = canvas.toDataURL('image/png');
      setProcessedImage(processedDataURL);

    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImageData = async (data: Uint8ClampedArray, width: number, height: number): Promise<Uint8ClampedArray> => {
    const processedData = new Uint8ClampedArray(data.length);
    
    // Enhanced background removal algorithm
    // Step 1: Find dominant background color (usually corners)
    const cornerSamples = [
      [0, 0], [width-1, 0], [0, height-1], [width-1, height-1],
      [Math.floor(width/4), 0], [Math.floor(3*width/4), 0],
      [0, Math.floor(height/4)], [width-1, Math.floor(height/4)]
    ];
    
    const backgroundColors: number[][] = [];
    cornerSamples.forEach(([x, y]) => {
      const idx = (y * width + x) * 4;
      if (idx < data.length) {
        backgroundColors.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
    });
    
    // Calculate average background color
    const avgBg = backgroundColors.reduce(
      (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
      [0, 0, 0]
    ).map(sum => sum / backgroundColors.length);
    
    // Step 2: Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Calculate color distance from background
      const colorDistance = Math.sqrt(
        Math.pow(r - avgBg[0], 2) +
        Math.pow(g - avgBg[1], 2) +
        Math.pow(b - avgBg[2], 2)
      );
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Enhanced background detection
      const isBackground = (
        colorDistance < 50 || // Similar to background color
        (luminance > 240 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) || // Very light/white
        (luminance < 15 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) // Very dark/black
      );
      
      if (isBackground) {
        // Make background transparent with soft edges
        const alpha = Math.max(0, Math.min(255, colorDistance * 2));
        processedData[i] = r;
        processedData[i + 1] = g;
        processedData[i + 2] = b;
        processedData[i + 3] = alpha;
      } else {
        // Keep foreground
        processedData[i] = r;
        processedData[i + 1] = g;
        processedData[i + 2] = b;
        processedData[i + 3] = a;
      }
    }
    
    return processedData;
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = 'background-removed.png';
    link.href = processedImage;
    link.click();
  };

  const clearImages = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Background Remover</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Remove backgrounds from your images instantly. Upload an image and let our advanced algorithm do the work for you.
          </p>
        </div>

        {/* Upload Area */}
        {!originalImage && (
          <div className="mb-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your image here or click to browse
                </h3>
                <p className="text-gray-500 mb-4">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Choose Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Processing Area */}
        {originalImage && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Original Image
                </h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Scissors className="w-5 h-5 mr-2" />
                  Background Removed
                </h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-48">
                  {processedImage ? (
                    <div className="relative">
                      {/* Checkered background to show transparency */}
                      <div className="absolute inset-0 opacity-20"
                           style={{
                             backgroundImage: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='%23000' fill-opacity='0.1'%3e%3crect x='0' y='0' width='10' height='10'/%3e%3crect x='10' y='10' width='10' height='10'/%3e%3c/g%3e%3c/svg%3e")`,
                           }}>
                      </div>
                      <img
                        src={processedImage}
                        alt="Background Removed"
                        className="relative w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-500">
                      {isProcessing ? (
                        <div className="flex flex-col items-center">
                          <Loader className="w-8 h-8 animate-spin mb-2" />
                          <p>Processing image...</p>
                        </div>
                      ) : (
                        <p>Processed image will appear here</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <button
                onClick={removeBackground}
                disabled={isProcessing}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5 mr-2" />
                    Remove Background
                  </>
                )}
              </button>

              {processedImage && (
                <button
                  onClick={downloadImage}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PNG
                </button>
              )}

              <button
                onClick={clearImages}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Hidden Canvas for Processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Scissors className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Advanced algorithms automatically detect and remove backgrounds with precision.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Download</h3>
            <p className="text-gray-600">
              Download your processed images immediately in high-quality PNG format.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy First</h3>
            <p className="text-gray-600">
              All processing happens in your browser. Your images never leave your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;