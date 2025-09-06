import React, { useState, useRef, useEffect } from 'react';

const LetterCounter: React.FC = () => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(120, textareaRef.current.scrollHeight) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [text]);

  const getStats = () => {
    const charCount = text.length;
    const charNoSpaceCount = text.replace(/\s/g, '').length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim()).length;

    return { charCount, charNoSpaceCount, wordCount, sentenceCount, paragraphCount };
  };

  const stats = getStats();

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Letter Counter</h1>
        <p>Count characters, words, sentences, and paragraphs in real-time</p>
      </div>
      <div className="letter-counter-layout">
        <div className="input-section">
          <label className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            Enter your text:
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to see live statistics..."
            className="letter-counter-textarea"
          />
        </div>
        <div className="stats-section">
          <div className="stats-header">
            <h3>Text Statistics</h3>
            <p>Live analysis of your text</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🔤</div>
              <div className="stat-number">{stats.charCount.toLocaleString()}</div>
              <div className="stat-label">Characters</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✂️</div>
              <div className="stat-number">{stats.charNoSpaceCount.toLocaleString()}</div>
              <div className="stat-label">No Spaces</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-number">{stats.wordCount.toLocaleString()}</div>
              <div className="stat-label">Words</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <div className="stat-number">{stats.sentenceCount.toLocaleString()}</div>
              <div className="stat-label">Sentences</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-number">{stats.paragraphCount.toLocaleString()}</div>
              <div className="stat-label">Paragraphs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterCounter;