import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface LoaderTemplate {
  id: string;
  name: string;
  html: string;
  css: string;
  tags: string[];
}

const LoadingAnimationGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<LoaderTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LoaderTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css'>('html');

  // Load loader templates from the galaxy repository
  useEffect(() => {
    // In a real implementation, we would load components from the galaxy repository
    // For this example, I'll create a few sample loader templates
    const sampleTemplates: LoaderTemplate[] = [
      {
        id: 'loader-001',
        name: 'Pulse Dots Loader',
        html: `<div class="pulse-loader">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>`,
        css: `.pulse-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.dot {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  background-color: #3498db;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.5s;
}

.dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}`,
        tags: ['loader', 'animated', 'pulse', 'dots']
      },
      {
        id: 'loader-002',
        name: 'Spinner Loader',
        html: `<div class="spinner-loader"></div>`,
        css: `.spinner-loader {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
        tags: ['loader', 'spinner', 'rotating', 'circle']
      },
      {
        id: 'loader-003',
        name: 'Bouncing Balls Loader',
        html: `<div class="bounce-loader">
  <div class="ball"></div>
  <div class="ball"></div>
  <div class="ball"></div>
</div>`,
        css: `.bounce-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.ball {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  background-color: #e74c3c;
  border-radius: 50%;
  animation: bounce 1.5s ease-in-out infinite;
}

.ball:nth-child(2) {
  animation-delay: 0.2s;
}

.ball:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}`,
        tags: ['loader', 'bouncing', 'balls', 'animated']
      },
      {
        id: 'loader-004',
        name: 'Flip Loader',
        html: `<div class="flip-loader">
  <div class="flipper"></div>
</div>`,
        css: `.flip-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.flipper {
  width: 40px;
  height: 40px;
  background-color: #9b59b6;
  animation: flip 1.5s infinite ease-in-out;
  border-radius: 5px;
}

@keyframes flip {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: perspective(120px) rotateX(-180deg) rotateY(0deg);
  }
  100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-180deg);
  }
}`,
        tags: ['loader', 'flip', '3d', 'animated']
      },
      {
        id: 'loader-005',
        name: 'Gradient Wave Loader',
        html: `<div class="wave-loader">
  <div class="wave-bar"></div>
  <div class="wave-bar"></div>
  <div class="wave-bar"></div>
  <div class="wave-bar"></div>
  <div class="wave-bar"></div>
</div>`,
        css: `.wave-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.wave-bar {
  width: 8px;
  height: 40px;
  background: linear-gradient(45deg, #3498db, #e74c3c);
  margin: 0 3px;
  border-radius: 4px;
  animation: wave 1.2s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: -1.2s; }
.wave-bar:nth-child(2) { animation-delay: -1.1s; }
.wave-bar:nth-child(3) { animation-delay: -1.0s; }
.wave-bar:nth-child(4) { animation-delay: -0.9s; }
.wave-bar:nth-child(5) { animation-delay: -0.8s; }

@keyframes wave {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}`,
        tags: ['loader', 'wave', 'gradient', 'bars']
      }
    ];

    setTemplates(sampleTemplates);
    if (sampleTemplates.length > 0) {
      setSelectedTemplate(sampleTemplates[0]);
    }
  }, []);

  const handleTemplateSelect = (template: LoaderTemplate) => {
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
        <title>Loading Animation Generator - Super Tools</title>
        <meta name="description" content="Create beautiful CSS loading animations with our generator. Choose from various templates and customize them to your needs." />
      </Helmet>

      <div className="tool-header">
        <h1>Loading Animation Generator</h1>
        <p>Create beautiful CSS loading animations with our generator. Choose from various templates and customize them to your needs.</p>
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
          
          <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg mb-6 dark:bg-gray-700">
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Loader Templates</h2>
        
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
              
              <div className="flex items-center justify-center min-h-[100px] bg-gray-50 rounded mb-3 dark:bg-gray-700">
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

export default LoadingAnimationGenerator;