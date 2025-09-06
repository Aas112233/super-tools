import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon, Loader, ZoomIn, ZoomOut, User, Cloud } from 'lucide-react';

const ImageBackgroundRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
      setZoomLevel(1);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.match('image.*')) {
        processFile(file);
      }
    }
  };

  const removeBackgroundWithHuggingFace = async (imageFile: File) => {
    try {
      const { Client } = await import('@gradio/client');
      const client = await Client.connect('not-lain/background-removal');
      
      // Simulate progress
      setProgress(20);
      
      // Use the /png endpoint which returns a file
      const result = await client.predict('/png', {
        f: imageFile
      });
      
      setProgress(70);
      
      console.log('API Response:', result);
      
      // The /png endpoint returns a file object
      if (result && result.data) {
        const data = result.data;
        
        // Handle file response
        if (Array.isArray(data) && data.length > 0) {
          const fileData = data[0];
          
          // Check if it's a file object with url or path
          if (fileData && (fileData.url || fileData.path)) {
            const fileUrl = fileData.url || fileData.path;
            
            // Make absolute URL if needed
            const absoluteUrl = fileUrl.startsWith('/') 
              ? `https://not-lain-background-removal.hf.space${fileUrl}`
              : fileUrl;
            
            const response = await fetch(absoluteUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch processed image: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            setProgress(100);
            return URL.createObjectURL(blob);
          }
        }
      }
      
      throw new Error('Invalid response format from Hugging Face model');
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const processImage = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const blob = await fetch(originalImage).then(r => r.blob());
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      const result = await removeBackgroundWithHuggingFace(file);
      setProcessedImage(result);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
    setZoomLevel(1);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>AI Background Remover</h1>
        <p>Remove backgrounds from images instantly using Hugging Face AI model. Free, fast, and powered by advanced machine learning.</p>
      </div>
      
      <div className="bionic-converter-layout">
        {/* Control Panel */}
        <div className="input-output-section">
          <div className="input-area">
            <label className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
              Upload Image:
            </label>
            
            {/* Drag and Drop Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP formats</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                  Select Image
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Processing image...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {originalImage && (
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      Remove Background
                    </>
                  )}
                </button>
              )}
              
              {processedImage && (
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download size={20} />
                  Download
                </button>
              )}
              
              {(originalImage || processedImage) && (
                <button
                  onClick={clearImages}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Trash2 size={20} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="input-section">
          <div className="case-options-header">
            <h3>Image Preview</h3>
            <p>View and compare your images</p>
          </div>
          
          <div className="space-y-6">
            {/* Original Image Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Original Image
                </h4>
                {originalImage && (
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))}
                      className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="px-2 py-0.5 text-xs font-medium min-w-[50px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
                      className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ZoomIn size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 min-h-[200px] flex items-center justify-center overflow-hidden">
                {originalImage ? (
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <ImageIcon size={24} className="text-blue-500" />
                    </div>
                    <p className="text-gray-500 text-sm">No image uploaded</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Processed Image Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Processed Image
                </h4>
                {processedImage && (
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Background Removed
                  </div>
                )}
              </div>
              
              <div className="relative bg-checkerboard rounded-xl border border-gray-200 min-h-[200px] flex items-center justify-center overflow-hidden">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <Cloud size={24} className="text-green-500" />
                    </div>
                    <p className="text-gray-500 text-sm">Processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
            linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
            linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
};

export default ImageBackgroundRemover;