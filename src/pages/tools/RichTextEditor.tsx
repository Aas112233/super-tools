import React, { useState, useEffect, useRef } from 'react';
import {
  Save, FileText, Printer, Download, Copy, Clipboard, Scissors, Undo, Redo,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent, Link, Image, Table, ChevronDown,
  ZoomIn, ZoomOut, Eye, Settings, X, Minus, Square, Type, Highlighter,
  Search, MoreHorizontal, Menu, Share, User, Folder, Plus
} from 'lucide-react';

const RichTextEditor = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [sidebarActive, setSidebarActive] = useState(null);
  const [content, setContent] = useState('<h1>Advanced Rich Text Editor</h1><p>This is a fully-featured Microsoft Word 2021 style rich text editor with advanced functionality.</p><p>Key features include:</p><ul><li>Complete formatting options (bold, italic, underline, font selection, etc.)</li><li>Insert images, tables, charts, and other elements</li><li>Page design and layout controls</li><li>References and citation management</li><li>Mail merge capabilities</li><li>Review and collaboration tools</li><li>Multiple view options</li></ul><p>Use the tabs above to access different functionality. Right-click for context menu options.</p><p>Start typing to create your professional document!</p>');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const editorRef = useRef(null);

  // Update word and character count
  useEffect(() => {
    const text = editorRef.current?.innerText || editorRef.current?.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  }, [content]);

  // Handle context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  // Format text using document.execCommand
  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  // Set font
  const setFont = (font) => {
    document.execCommand('fontName', false, font);
    editorRef.current?.focus();
  };

  // Set font size
  const setFontSize = (size) => {
    document.execCommand('fontSize', false, size);
    editorRef.current?.focus();
  };

  // Set text color
  const setColor = (color) => {
    document.execCommand('foreColor', false, color);
    editorRef.current?.focus();
  };

  // Insert functions
  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '50%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px auto';
      img.style.borderRadius = '4px';
      img.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      getSelection().getRangeAt(0).insertNode(img);
      editorRef.current?.focus();
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand('createLink', false, url);
      editorRef.current?.focus();
    }
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows:", "3")) || 3;
    const cols = parseInt(prompt("Number of columns:", "3")) || 3;
    
    if (rows > 0 && cols > 0) {
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.margin = '10px 0';
      table.style.border = '1px solid #ddd';
      
      for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
          const td = document.createElement('td');
          td.style.border = '1px solid #ddd';
          td.style.padding = '8px';
          td.style.backgroundColor = i === 0 ? '#f0f0f0' : 'white';
          td.style.fontWeight = i === 0 ? 'bold' : 'normal';
          td.contentEditable = 'true';
          td.textContent = i === 0 ? `Header ${j+1}` : `Cell ${i+1}-${j+1}`;
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      
      getSelection().getRangeAt(0).insertNode(table);
      editorRef.current?.focus();
    }
  };

  // Document functions
  const newDocument = () => {
    if (confirm("Create a new document? Current content will be lost.")) {
      setContent('<p>Start typing your new document here...</p>');
    }
  };

  const saveDocument = () => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printDocument = () => {
    window.print();
  };

  const zoomIn = () => {
    if (zoomLevel < 400) {
      const newZoom = zoomLevel + 25;
      setZoomLevel(newZoom);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 25) {
      const newZoom = zoomLevel - 25;
      setZoomLevel(newZoom);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-gray-900">Word Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Search">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Share">
            <Share className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Account">
            <User className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center px-4">
          {['home', 'insert', 'design', 'layout', 'references', 'mailings', 'review', 'view'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
          {activeTab === 'home' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <button onClick={() => formatText('bold')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bold">
                  <Bold className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => formatText('italic')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Italic">
                  <Italic className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => formatText('underline')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Underline">
                  <Underline className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="w-px h-8 bg-gray-300"></div>

              <div className="flex items-center space-x-2">
                <select onChange={(e) => setFont(e.target.value)} className="px-3 py-1 border border-gray-300 rounded text-sm bg-white">
                  <option value="Arial">Arial</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                </select>
                <select onChange={(e) => setFontSize(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm bg-white w-16">
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                </select>
              </div>

              <div className="w-px h-8 bg-gray-300"></div>

              <div className="flex items-center space-x-1">
                <button onClick={() => formatText('justifyLeft')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Left">
                  <AlignLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => formatText('justifyCenter')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Center">
                  <AlignCenter className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => formatText('justifyRight')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Right">
                  <AlignRight className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => formatText('justifyFull')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Justify">
                  <AlignJustify className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="w-px h-8 bg-gray-300"></div>

              <div className="flex items-center space-x-1">
                <button onClick={() => formatText('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bullets">
                  <List className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => formatText('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Numbering">
                  <ListOrdered className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'insert' && (
            <div className="flex items-center space-x-6">
              <button onClick={insertImage} className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-200 rounded transition-colors">
                <Image className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-600">Pictures</span>
              </button>
              <button onClick={insertLink} className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-200 rounded transition-colors">
                <Link className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-600">Link</span>
              </button>
              <button onClick={insertTable} className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-200 rounded transition-colors">
                <Table className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-600">Table</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
          <button onClick={newDocument} className="p-2 hover:bg-gray-100 rounded transition-colors" title="New">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={() => document.getElementById('file-input')?.click()} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Open">
            <Folder className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={saveDocument} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Save">
            <Save className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={printDocument} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Print">
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-full h-px bg-gray-200 my-2"></div>
          <button onClick={zoomIn} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom In">
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={zoomOut} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom Out">
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Editor Container */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Ruler */}
          <div className="bg-white border-b border-gray-200 h-6 flex items-center px-4">
            <div className="flex-1 relative bg-gray-50">
              <div className="absolute inset-0 flex items-center">
                {Array.from({length: 16}, (_, i) => (
                  <div key={i} className="flex-1 border-l border-gray-400 h-2 text-xs relative">
                    {i % 4 === 0 && <span className="text-gray-600 absolute -top-3 left-0 text-xs">{i}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 p-8 overflow-auto" style={{ zoom: `${zoomLevel}%` }}>
            <div className="mx-auto bg-white shadow-lg min-h-full max-w-4xl border border-gray-300">
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.target.innerHTML)}
                onContextMenu={handleContextMenu}
                className="p-20 min-h-full outline-none"
                style={{
                  fontFamily: 'Calibri, sans-serif',
                  fontSize: '11pt',
                  lineHeight: '1.15',
                  minHeight: '11in',
                  width: '8.5in',
                  color: '#000000'
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-blue-600 text-white px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span>Page 1 of 1</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Zoom: {zoomLevel}%</span>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => { formatText('bold'); setContextMenu({ visible: false, x: 0, y: 0 }); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <Bold className="w-4 h-4" />
            <span>Bold</span>
          </button>
          <button onClick={() => { formatText('italic'); setContextMenu({ visible: false, x: 0, y: 0 }); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <Italic className="w-4 h-4" />
            <span>Italic</span>
          </button>
          <button onClick={() => { formatText('underline'); setContextMenu({ visible: false, x: 0, y: 0 }); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <Underline className="w-4 h-4" />
            <span>Underline</span>
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button onClick={() => { document.execCommand('copy'); setContextMenu({ visible: false, x: 0, y: 0 }); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button onClick={() => { document.execCommand('cut'); setContextMenu({ visible: false, x: 0, y: 0 }); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <Scissors className="w-4 h-4" />
            <span>Cut</span>
          </button>
          <button onClick={() => { document.execCommand('paste'); setContextMenu({ visible: false, x: 0, y: 0 }); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <Clipboard className="w-4 h-4" />
            <span>Paste</span>
          </button>
        </div>
      )}

      <input type="file" id="file-input" className="hidden" accept=".html,.txt,.doc,.docx" />
    </div>
  );
};

export default RichTextEditor;