import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export const CodeToImageConverter: React.FC = () => {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [padding, setPadding] = useState(20);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [windowStyle, setWindowStyle] = useState('mac');
  const codeRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript', ext: '.js' },
    { id: 'typescript', name: 'TypeScript', ext: '.ts' },
    { id: 'python', name: 'Python', ext: '.py' },
    { id: 'java', name: 'Java', ext: '.java' },
    { id: 'cpp', name: 'C++', ext: '.cpp' },
    { id: 'html', name: 'HTML', ext: '.html' },
    { id: 'css', name: 'CSS', ext: '.css' },
    { id: 'json', name: 'JSON', ext: '.json' }
  ];

  const themes = [
    { id: 'dark', name: 'Dark', bg: '#1e1e1e', text: '#d4d4d4' },
    { id: 'light', name: 'Light', bg: '#ffffff', text: '#333333' },
    { id: 'monokai', name: 'Monokai', bg: '#272822', text: '#f8f8f2' },
    { id: 'dracula', name: 'Dracula', bg: '#282a36', text: '#f8f8f2' },
    { id: 'github', name: 'GitHub', bg: '#f6f8fa', text: '#24292e' }
  ];

  const getThemeColors = () => {
    const selectedTheme = themes.find(t => t.id === theme);
    return selectedTheme || themes[0];
  };

  const getSyntaxHighlighting = (code: string, lang: string) => {
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'console', 'log'],
      typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'interface', 'type'],
      python: ['def', 'if', 'else', 'return', 'print', 'import', 'from', 'class'],
      java: ['public', 'private', 'class', 'static', 'void', 'if', 'else', 'return'],
      cpp: ['#include', 'int', 'void', 'if', 'else', 'return', 'cout', 'cin']
    };

    let highlightedCode = code;
    const langKeywords = keywords[lang as keyof typeof keywords] || [];
    
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedCode = highlightedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    // Highlight strings
    highlightedCode = highlightedCode.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    highlightedCode = highlightedCode.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
    
    // Highlight numbers
    highlightedCode = highlightedCode.replace(/\b\d+\b/g, '<span class="number">$&</span>');
    
    // Highlight comments
    highlightedCode = highlightedCode.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
    
    return highlightedCode;
  };

  const generateScreenshot = async () => {
    if (!codeRef.current) return;

    try {
      const canvas = await html2canvas(codeRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `code-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating screenshot:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!codeRef.current) return;

    try {
      const canvas = await html2canvas(codeRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Code Screenshot Generator</h1>
        <p>Create beautiful screenshots of your code with syntax highlighting</p>
      </div>
      <div className="code-screenshot-layout">
        <div className="code-preview-section">
          <div className="preview-container">
            <h3>Preview</h3>
            <div className="code-screenshot-preview">
              <div 
                ref={codeRef}
                className={`code-window ${windowStyle}`}
                style={{
                  backgroundColor: themeColors.bg,
                  padding: `${padding}px`,
                  borderRadius: '12px',
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                  color: themeColors.text,
                  minWidth: '400px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                {windowStyle === 'mac' && (
                  <div className="window-controls" style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57' }}></div>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28ca42' }}></div>
                    </div>
                  </div>
                )}
                <div className="code-content">
                  {showLineNumbers && (
                    <div className="line-numbers" style={{ 
                      float: 'left', 
                      marginRight: '15px', 
                      color: 'rgba(255,255,255,0.4)',
                      userSelect: 'none'
                    }}>
                      {code.split('\n').map((_, index) => (
                        <div key={index}>{index + 1}</div>
                      ))}
                    </div>
                  )}
                  <div 
                    className="code-text"
                    dangerouslySetInnerHTML={{ 
                      __html: getSyntaxHighlighting(code, language).replace(/\n/g, '<br>') 
                    }}
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflow: 'hidden'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="code-controls-section">
          <div className="code-controls-header">
            <h3>Screenshot Settings</h3>
            <p>Customize your code screenshot</p>
          </div>
          <div className="code-controls">
            <div className="control-group">
              <label>Code:</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="code-textarea"
                rows={8}
                placeholder="Enter your code here..."
              />
            </div>
            <div className="control-group">
              <label>Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Theme:</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {themes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Window Style:</label>
              <select value={windowStyle} onChange={(e) => setWindowStyle(e.target.value)}>
                <option value="mac">macOS</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="control-group">
              <label>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>Padding: {padding}px</label>
              <input
                type="range"
                min="10"
                max="50"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                />
                Show Line Numbers
              </label>
            </div>
            <div className="action-buttons">
              <button className="action-btn" onClick={copyToClipboard}>
                📋 Copy Image
              </button>
              <button className="action-btn primary" onClick={generateScreenshot}>
                📥 Download PNG
              </button>
            </div>
            <div className="code-info">
              <h4>Features:</h4>
              <ul>
                <li>• Syntax highlighting for popular languages</li>
                <li>• Multiple themes (Dark, Light, Monokai, etc.)</li>
                <li>• macOS window style with traffic lights</li>
                <li>• Adjustable font size and padding</li>
                <li>• Line numbers toggle</li>
                <li>• High-resolution export (2x scale)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .keyword { color: #569cd6; font-weight: bold; }
        .string { color: #ce9178; }
        .number { color: #b5cea8; }
        .comment { color: #6a9955; font-style: italic; }
        .code-content { overflow: hidden; }
        .line-numbers { text-align: right; }
      `}</style>
    </div>
  );
};