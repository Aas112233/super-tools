import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const LoremIpsumGenerator: React.FC = () => {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(false);
  const [output, setOutput] = useState('');

  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];

  const generateLorem = () => {
    let result = '';
    
    if (type === 'words') {
      const selectedWords = [];
      for (let i = 0; i < count; i++) {
        selectedWords.push(words[Math.floor(Math.random() * words.length)]);
      }
      result = selectedWords.join(' ');
    } else if (type === 'sentences') {
      for (let i = 0; i < count; i++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let j = 0; j < sentenceLength; j++) {
          sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        result += sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '. ';
      }
    } else {
      for (let i = 0; i < count; i++) {
        const paragraph = [];
        const sentenceCount = Math.floor(Math.random() * 5) + 3;
        for (let j = 0; j < sentenceCount; j++) {
          const sentenceLength = Math.floor(Math.random() * 10) + 5;
          const sentence = [];
          for (let k = 0; k < sentenceLength; k++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
          }
          paragraph.push(sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '.');
        }
        result += paragraph.join(' ') + '\n\n';
      }
    }
    
    if (startWithLorem && !result.toLowerCase().startsWith('lorem')) {
      result = 'Lorem ipsum ' + result;
    }
    
    setOutput(result.trim());
  };

  useEffect(() => {
    generateLorem();
  }, [count, type, startWithLorem]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Lorem Ipsum Generator</h1>
        <p>Generate placeholder text for your designs</p>
      </div>
      <div className="lorem-generator-layout">
        <div className="lorem-output-section">
          <label className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            Generated Text:
          </label>
          <textarea 
            value={output} 
            readOnly 
            className="lorem-output-textarea"
          />
          <button className="copy-btn" onClick={copyToClipboard}>
            📋 Copy Text
          </button>
        </div>
        <div className="lorem-controls-section">
          <div className="lorem-controls-header">
            <h3>Generator Settings</h3>
            <p>Customize your text</p>
          </div>
          <div className="lorem-controls">
            <div className="control-group">
              <label>Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="paragraphs">📄 Paragraphs</option>
                <option value="words">🔤 Words</option>
                <option value="sentences">📝 Sentences</option>
              </select>
            </div>
            <div className="control-group">
              <label>Amount: {count}</label>
              <div className="volume-slider">
                <input
                  type="range"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  min="1"
                  max={type === 'words' ? '200' : type === 'sentences' ? '50' : '20'}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1</span>
                  <span>{type === 'words' ? '200' : type === 'sentences' ? '50' : '20'}</span>
                </div>
              </div>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                />
                <span>Start with "Lorem ipsum"</span>
              </label>
            </div>
            <div className="text-stats">
              <span>{output.length} chars</span>
              <span>{output.split(/\s+/).filter(word => word.length > 0).length} words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};