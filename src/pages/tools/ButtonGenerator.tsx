import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface ButtonTemplate {
  id: string;
  name: string;
  html: string;
  css: string;
  tags: string[];
}

const ButtonGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<ButtonTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ButtonTemplate | null>(null);
  const [customText, setCustomText] = useState('Button');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css'>('html');

  // Load button templates from the galaxy repository
  useEffect(() => {
    // In a real implementation, we would load components from the galaxy repository
    // For this example, I'll create a few sample button templates
    const sampleTemplates: ButtonTemplate[] = [
      {
        id: 'btn-001',
        name: 'Animated Contact Button',
        html: `<button class="cta">
  <span>Contact Us</span>
  <svg viewBox="0 0 13 10" height="10px" width="15px">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</button>`,
        css: `.cta {
  position: relative;
  margin: auto;
  padding: 11.5px 18px;
  transition: all 0.2s ease;
  border: 3px solid #552da8;
  border-radius: 50px;
  background: #552da8;
  cursor: pointer;
}

.cta:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  border-radius: 50px;
  background: white;
  width: 45px;
  height: 45px;
  transition: all 0.8s ease;
}

.cta span {
  position: relative;
  font-family: Montserrat;
  font-size: 18px;
  color: white;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.cta svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: white;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.cta:hover:before {
  background: #b14cff;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active {
  transform: scale(0.95);
}`,
        tags: ['button', 'hover', 'rounded', 'animated']
      },
      {
        id: 'btn-002',
        name: 'Neon Glow Button',
        html: `<button class="neon-btn">Neon Button</button>`,
        css: `.neon-btn {
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #000;
  border: 2px solid #00ff00;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
}

.neon-btn:hover {
  background-color: #00ff00;
  color: #000;
  box-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00;
  transform: translateY(-3px);
}

.neon-btn:active {
  transform: translateY(1px);
}`,
        tags: ['button', 'neon', 'glow', 'hover']
      },
      {
        id: 'btn-003',
        name: '3D Press Button',
        html: `<button class="btn-3d">3D Button</button>`,
        css: `.btn-3d {
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: linear-gradient(to bottom, #ff416c, #ff4b2b);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  box-shadow: 0 6px 0 #d13620, 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.1s ease;
}

.btn-3d:hover {
  box-shadow: 0 4px 0 #d13620, 0 8px 16px rgba(0, 0, 0, 0.3);
  transform: translateY(2px);
}

.btn-3d:active {
  box-shadow: 0 0 0 #d13620, 0 2px 10px rgba(0, 0, 0, 0.3);
  transform: translateY(6px);
}`,
        tags: ['button', '3d', 'press', 'gradient']
      },
      {
        id: 'btn-004',
        name: 'Glassmorphism Button',
        html: `<button class="glass-btn">Glass Button</button>`,
        css: `.glass-btn {
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.glass-btn:active {
  transform: translateY(1px);
}`,
        tags: ['button', 'glassmorphism', 'blur', 'transparent']
      },
      {
        id: 'btn-005',
        name: 'Ripple Effect Button',
        html: `<button class="ripple-btn">Ripple Button</button>`,
        css: `.ripple-btn {
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ripple-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple-btn:hover::before {
  width: 300px;
  height: 300px;
}

.ripple-btn:active {
  transform: scale(0.95);
}`,
        tags: ['button', 'ripple', 'hover', 'animated']
      }
    ];

    setTemplates(sampleTemplates);
    if (sampleTemplates.length > 0) {
      setSelectedTemplate(sampleTemplates[0]);
    }
  }, []);

  const handleTemplateSelect = (template: ButtonTemplate) => {
    setSelectedTemplate(template);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const updateButtonText = () => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        html: selectedTemplate.html.replace(
          />([^<>]*?)<\/span>|>([^<>]*)<\/button>/,
          customText ? `>${customText}</span>` : '$&'
        ).replace(
          /<span[^>]*>([^<>]*)<\/span>/,
          customText ? `<span>${customText}</span>` : '$&'
        )
      };
      setSelectedTemplate(updatedTemplate);
    }
  };

  return (
    <div className="tool-container">
      <Helmet>
        <title>Button Generator - Super Tools</title>
        <meta name="description" content="Create beautiful CSS buttons with our generator. Choose from various templates and customize them to your needs." />
      </Helmet>

      <div className="tool-header">
        <h1>Button Generator</h1>
        <p>Create beautiful CSS buttons with our generator. Choose from various templates and customize them to your needs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Customization Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Customization</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter button text"
                />
                <button
                  onClick={updateButtonText}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
            
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Button Templates</h2>
        
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

export default ButtonGenerator;