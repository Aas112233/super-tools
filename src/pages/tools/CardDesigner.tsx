import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface CardTemplate {
  id: string;
  name: string;
  html: string;
  css: string;
  tags: string[];
}

const CardDesigner: React.FC = () => {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css'>('html');

  // Load card templates from the galaxy repository
  useEffect(() => {
    // In a real implementation, we would load components from the galaxy repository
    // For this example, I'll create a few sample card templates
    const sampleTemplates: CardTemplate[] = [
      {
        id: 'card-001',
        name: 'Glassmorphism Card',
        html: `<div class="glass-card">
  <div class="card-header">
    <h3>Glassmorphism Card</h3>
  </div>
  <div class="card-body">
    <p>This is a beautiful glassmorphism card with a blurred background effect.</p>
  </div>
  <div class="card-footer">
    <button class="card-btn">Action</button>
  </div>
</div>`,
        css: `.glass-card {
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.card-body {
  padding: 20px;
}

.card-body p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.card-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.card-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.card-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}`,
        tags: ['card', 'glassmorphism', 'blur', 'transparent']
      },
      {
        id: 'card-002',
        name: 'Neon Glow Card',
        html: `<div class="neon-card">
  <div class="card-header">
    <h3>Neon Glow Card</h3>
  </div>
  <div class="card-body">
    <p>This card features a vibrant neon glow effect that makes it stand out.</p>
  </div>
  <div class="card-footer">
    <button class="card-btn">Action</button>
  </div>
</div>`,
        css: `.neon-card {
  width: 300px;
  background: #000;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
  border: 2px solid #00ff00;
}

.card-header {
  padding: 20px;
  background: rgba(0, 255, 0, 0.1);
  border-bottom: 1px solid #00ff00;
}

.card-header h3 {
  margin: 0;
  color: #00ff00;
  font-size: 1.5rem;
  text-shadow: 0 0 5px #00ff00;
}

.card-body {
  padding: 20px;
}

.card-body p {
  margin: 0;
  color: #fff;
  line-height: 1.6;
}

.card-footer {
  padding: 20px;
  border-top: 1px solid #00ff00;
}

.card-btn {
  padding: 10px 20px;
  background: #00ff00;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background: #00cc00;
  box-shadow: 0 0 10px #00ff00;
}`,
        tags: ['card', 'neon', 'glow', 'vibrant']
      },
      {
        id: 'card-003',
        name: '3D Perspective Card',
        html: `<div class="perspective-card">
  <div class="card-content">
    <div class="card-header">
      <h3>3D Perspective Card</h3>
    </div>
    <div class="card-body">
      <p>This card has a 3D perspective effect that creates depth and dimension.</p>
    </div>
    <div class="card-footer">
      <button class="card-btn">Action</button>
    </div>
  </div>
</div>`,
        css: `.perspective-card {
  width: 300px;
  perspective: 1000px;
}

.card-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.perspective-card:hover .card-content {
  transform: rotateY(10deg) rotateX(10deg);
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.card-body {
  margin-bottom: 20px;
}

.card-body p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.card-footer {
  text-align: right;
}

.card-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.card-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}`,
        tags: ['card', '3d', 'perspective', 'gradient']
      },
      {
        id: 'card-004',
        name: 'Minimalist Card',
        html: `<div class="minimal-card">
  <div class="card-header">
    <h3>Minimalist Card</h3>
  </div>
  <div class="card-body">
    <p>Simplicity is the ultimate sophistication. This card focuses on clean design.</p>
  </div>
  <div class="card-footer">
    <button class="card-btn">Action</button>
  </div>
</div>`,
        css: `.minimal-card {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.minimal-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.card-body {
  padding: 20px;
}

.card-body p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.card-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.card-btn {
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.card-btn:hover {
  background: #555;
}`,
        tags: ['card', 'minimal', 'clean', 'simple']
      },
      {
        id: 'card-005',
        name: 'Gradient Border Card',
        html: `<div class="gradient-border-card">
  <div class="card-content">
    <div class="card-header">
      <h3>Gradient Border Card</h3>
    </div>
    <div class="card-body">
      <p>This card features a beautiful gradient border that adds visual interest.</p>
    </div>
    <div class="card-footer">
      <button class="card-btn">Action</button>
    </div>
  </div>
</div>`,
        css: `.gradient-border-card {
  width: 300px;
  background: #000;
  border-radius: 15px;
  padding: 3px;
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

.card-content {
  background: #000;
  border-radius: 12px;
  height: 100%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.card-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.card-body {
  padding: 20px;
}

.card-body p {
  margin: 0;
  color: #ccc;
  line-height: 1.6;
}

.card-footer {
  padding: 20px;
  border-top: 1px solid #333;
  text-align: right;
}

.card-btn {
  padding: 10px 20px;
  background: linear-gradient(45deg, #ff0000, #ff7300);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.card-btn:hover {
  transform: scale(1.05);
}`,
        tags: ['card', 'gradient', 'border', 'animated']
      }
    ];

    setTemplates(sampleTemplates);
    if (sampleTemplates.length > 0) {
      setSelectedTemplate(sampleTemplates[0]);
    }
  }, []);

  const handleTemplateSelect = (template: CardTemplate) => {
    setSelectedTemplate(template);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="tool-container">
      <Helmet>
        <title>Card Designer - Super Tools</title>
        <meta name="description" content="Design beautiful cards with our card designer. Choose from various templates and customize them to your needs." />
      </Helmet>

      <div className="tool-header">
        <h1>Card Designer</h1>
        <p>Design beautiful cards with our card designer. Choose from various templates and customize them to your needs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Customization Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Customization</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Selected Template</h3>
              {selectedTemplate && (
                <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-white">{selectedTemplate.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplate.tags.map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => copyToClipboard(selectedTemplate?.html || '')}
              >
                📋 Copy HTML
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => copyToClipboard(selectedTemplate?.css || '')}
              >
                📋 Copy CSS
              </button>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Preview</h2>
          
          <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg mb-6 dark:bg-gray-700">
            {selectedTemplate && (
              <>
                <style>{selectedTemplate.css}</style>
                <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html }} />
              </>
            )}
          </div>
          
          {/* Code Tabs */}
          <div>
            <div className="flex border-b border-gray-200 mb-4 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium text-sm ${activeCodeTab === 'html' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setActiveCodeTab('html')}
              >
                HTML
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeCodeTab === 'css' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setActiveCodeTab('css')}
              >
                CSS
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-gray-100 text-sm">
                {activeCodeTab === 'html' ? selectedTemplate?.html : selectedTemplate?.css}
              </pre>
            </div>
            
            <button
              className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              onClick={() => copyToClipboard(activeCodeTab === 'html' ? (selectedTemplate?.html || '') : (selectedTemplate?.css || ''), `${activeCodeTab}-${selectedTemplate?.id}`)}
            >
              {copiedId === `${activeCodeTab}-${selectedTemplate?.id}` ? 'Copied!' : `Copy ${activeCodeTab.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>

      {/* Template Library */}
      <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Card Templates</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-900/30 dark:border-blue-400 dark:ring-blue-400/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <h3 className="font-medium text-gray-800 mb-2 dark:text-white">{template.name}</h3>
              
              <div className="flex items-center justify-center min-h-[150px] bg-gray-50 rounded mb-3 dark:bg-gray-700">
                <style>{template.css}</style>
                <div dangerouslySetInnerHTML={{ __html: template.html }} />
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDesigner;