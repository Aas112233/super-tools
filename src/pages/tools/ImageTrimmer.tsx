import React, { useState, useRef } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

export const ImageTrimmer: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState('free');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const cropTemplates = [
    { id: 'free', label: 'Free Crop', ratio: null },
    { id: 'square', label: 'Square (1:1)', ratio: 1 },
    { id: 'instagram', label: 'Instagram Post', ratio: 1 },
    { id: 'instagram-story', label: 'Instagram Story', ratio: 9/16 },
    { id: 'facebook-post', label: 'Facebook Post', ratio: 16/9 },
    { id: 'facebook-cover', label: 'Facebook Cover', ratio: 851/315 },
    { id: 'twitter-post', label: 'Twitter Post', ratio: 16/9 },
    { id: 'twitter-header', label: 'Twitter Header', ratio: 3/1 },
    { id: 'youtube-thumbnail', label: 'YouTube Thumbnail', ratio: 16/9 },
    { id: 'linkedin-post', label: 'LinkedIn Post', ratio: 1.91/1 },
    { id: 'pinterest', label: 'Pinterest Pin', ratio: 2/3 },
    { id: 'tiktok', label: 'TikTok Video', ratio: 9/16 }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setCroppedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = cropTemplates.find(t => t.id === templateId);
    if (cropperRef.current && template) {
      cropperRef.current.setCoordinates({
        width: 300,
        height: template.ratio ? 300 / template.ratio : 200,
        left: 50,
        top: 50
      });
    }
  };

  const cropImage = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        setCroppedImage(canvas.toDataURL('image/png', 1.0));
      }
    }
  };

  const downloadImage = () => {
    if (croppedImage) {
      const link = document.createElement('a');
      link.download = `cropped-${selectedTemplate}-${Date.now()}.png`;
      link.href = croppedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setImageSrc('');
    setCroppedImage('');
    setSelectedTemplate('free');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedTemplateData = cropTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Image Trimmer</h1>
        <p>Professional image cropping with social media templates</p>
      </div>
      <div className="image-trimmer-layout">
        <div className="image-preview-section">
          {!imageSrc ? (
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">📁</div>
              <p>Click to upload an image</p>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>
          ) : croppedImage ? (
            <div className="result-container">
              <img src={croppedImage} alt="Cropped" className="result-image" />
              <div className="download-actions">
                <button className="download-btn" onClick={downloadImage}>📥 Download</button>
                <button className="new-btn" onClick={resetTool}>🔄 New Image</button>
              </div>
            </div>
          ) : (
            <div className="advanced-cropper-container">
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                className="advanced-cropper"
                stencilProps={{
                  handlers: true,
                  lines: true,
                  movable: true,
                  resizable: true,
                  aspectRatio: selectedTemplateData?.ratio || undefined
                }}
                backgroundWrapperProps={{
                  scaleImage: true,
                  moveImage: true,
                }}
              />
            </div>
          )}
        </div>
        <div className="trimmer-controls-section">
          <div className="trimmer-controls-header">
            <h3>Crop Templates</h3>
            <p>Choose social media format</p>
          </div>
          <div className="trimmer-controls">
            <div className="control-group">
              <label>Template:</label>
              <select 
                value={selectedTemplate} 
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="template-select"
              >
                {cropTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
            {imageSrc && !croppedImage && (
              <button className="action-btn primary" onClick={cropImage}>
                ✂️ Crop Image
              </button>
            )}
            <div className="trimmer-info">
              <h4>Social Media Templates:</h4>
              <ul>
                <li>• Instagram: Square & Story formats</li>
                <li>• Facebook: Post & Cover sizes</li>
                <li>• Twitter: Post & Header dimensions</li>
                <li>• YouTube: Thumbnail format</li>
                <li>• LinkedIn: Post format</li>
                <li>• Pinterest: Pin format</li>
                <li>• TikTok: Video format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};