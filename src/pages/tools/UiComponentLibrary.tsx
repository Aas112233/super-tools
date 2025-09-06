import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface Component {
  id: string;
  name: string;
  category: string;
  html: string;
  css: string;
  tags: string[];
}

const UiComponentLibrary: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css'>('html');

  // Categories based on the galaxy repository structure
  const categories = ['All', 'Buttons', 'Cards', 'Loaders', 'Forms', 'Toggle Switches'];

  // Load components from the galaxy repository
  useEffect(() => {
    // In a real implementation, we would load components from the galaxy repository
    // For this example, I'll create a few sample components
    const sampleComponents: Component[] = [
      {
        id: 'btn-001',
        name: 'Animated Contact Button',
        category: 'Buttons',
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
        id: 'card-001',
        name: 'Glassmorphism Card',
        category: 'Cards',
        html: `<div class="card">
  <div class="card-content">
    <h3>Card Title</h3>
    <p>This is a sample card with glassmorphism effect.</p>
  </div>
</div>`,
        css: `.card {
  width: 300px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-content h3 {
  color: #fff;
  margin-top: 0;
}

.card-content p {
  color: rgba(255, 255, 255, 0.8);
}`,
        tags: ['card', 'glassmorphism', 'blur']
      },
      {
        id: 'loader-001',
        name: 'Pulse Dots Loader',
        category: 'Loaders',
        html: `<div class="loader">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>`,
        css: `.loader {
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
        tags: ['loader', 'animated', 'pulse']
      },
      {
        id: 'form-001',
        name: 'Modern Login Form',
        category: 'Forms',
        html: `<form class="login-form">
  <h2>Login</h2>
  <div class="input-group">
    <input type="text" required>
    <label>Username</label>
  </div>
  <div class="input-group">
    <input type="password" required>
    <label>Password</label>
  </div>
  <button type="submit" class="submit-btn">Sign In</button>
</form>`,
        css: `.login-form {
  width: 300px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #333;
  text-align: center;
}

.input-group {
  position: relative;
  margin-bottom: 30px;
}

.input-group input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #333;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  background: transparent;
}

.input-group label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #999;
  pointer-events: none;
  transition: 0.5s;
}

.input-group input:focus ~ label,
.input-group input:valid ~ label {
  top: -20px;
  left: 0;
  color: #3498db;
  font-size: 12px;
}

.submit-btn {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #3498db;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  letter-spacing: 4px;
  background: transparent;
  border: 2px solid #3498db;
  cursor: pointer;
}

.submit-btn:hover {
  background: #3498db;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #3498db, 0 0 25px #3498db, 0 0 50px #3498db, 0 0 100px #3498db;
}`,
        tags: ['form', 'login', 'animated']
      },
      {
        id: 'toggle-001',
        name: 'Modern Toggle Switch',
        category: 'Toggle Switches',
        html: `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`,
        css: `.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3498db;
}

input:checked + .slider:before {
  transform: translateX(26px);
}`,
        tags: ['toggle', 'switch', 'checkbox']
      }
    ];

    setComponents(sampleComponents);
    setFilteredComponents(sampleComponents);
  }, []);

  // Filter components based on search term and category
  useEffect(() => {
    let result = components;
    
    if (selectedCategory !== 'All') {
      result = result.filter(component => component.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(component => 
        component.name.toLowerCase().includes(term) ||
        component.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredComponents(result);
  }, [searchTerm, selectedCategory, components]);

  const handleComponentClick = (component: Component) => {
    setSelectedComponent(component);
  };

  const handleCloseModal = () => {
    setSelectedComponent(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="tool-container">
      <Helmet>
        <title>UI Component Library - Super Tools</title>
        <meta name="description" content="Browse and use beautiful UI components from the uiverse-io/galaxy repository" />
      </Helmet>

      <div className="tool-header">
        <h1>UI Component Library</h1>
        <p>Browse and use beautiful UI components from the uiverse-io/galaxy repository</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Customization Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Filters</h2>
          
          <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search components..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Selected Component</h3>
              {selectedComponent && (
                <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-white">{selectedComponent.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedComponent.tags.map(tag => (
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
                onClick={() => copyToClipboard(selectedComponent?.html || '')}
              >
                📋 Copy HTML
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => copyToClipboard(selectedComponent?.css || '')}
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
            {selectedComponent ? (
              <>
                <style>{selectedComponent.css}</style>
                <div dangerouslySetInnerHTML={{ __html: selectedComponent.html }} />
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Select a component to preview</p>
            )}
          </div>
          
          {/* Code Tabs */}
          {selectedComponent && (
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
                  {activeCodeTab === 'html' ? selectedComponent.html : selectedComponent.css}
                </pre>
              </div>
              
              <button
                className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => copyToClipboard(activeCodeTab === 'html' ? (selectedComponent?.html || '') : (selectedComponent?.css || ''), `${activeCodeTab}-${selectedComponent?.id}`)}
              >
                {copiedId === `${activeCodeTab}-${selectedComponent?.id}` ? 'Copied!' : `Copy ${activeCodeTab.toUpperCase()}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Library */}
      <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">UI Components</h2>
        
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No components found. Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredComponents.map(component => (
              <div
                key={component.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedComponent?.id === component.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-900/30 dark:border-blue-400 dark:ring-blue-400/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedComponent(component)}
              >
                <h3 className="font-medium text-gray-800 mb-2 dark:text-white">{component.name}</h3>
                
                <div className="flex items-center justify-center min-h-[100px] bg-gray-50 rounded mb-3 dark:bg-gray-700">
                  <style>{component.css}</style>
                  <div 
                    dangerouslySetInnerHTML={{ __html: component.html }} 
                    className="component-preview"
                  />
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {component.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold dark:text-white">{selectedComponent.name}</h2>
                <button 
                  onClick={() => setSelectedComponent(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Preview</h3>
                <div className="border border-gray-200 rounded p-6 bg-gray-50 min-h-[200px] flex items-center justify-center dark:border-gray-700 dark:bg-gray-700">
                  <style>{selectedComponent.css}</style>
                  <div dangerouslySetInnerHTML={{ __html: selectedComponent.html }} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold dark:text-white">HTML</h3>
                    <button
                      onClick={() => copyToClipboard(selectedComponent.html, `html-${selectedComponent.id}`)}
                      className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      {copiedId === `html-${selectedComponent.id}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm dark:bg-gray-900">
                    {selectedComponent.html}
                  </pre>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold dark:text-white">CSS</h3>
                    <button
                      onClick={() => copyToClipboard(selectedComponent.css, `css-${selectedComponent.id}`)}
                      className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      {copiedId === `css-${selectedComponent.id}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm dark:bg-gray-900">
                    {selectedComponent.css}
                  </pre>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedComponent.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UiComponentLibrary;