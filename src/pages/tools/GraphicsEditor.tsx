import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image, Line, Transformer } from 'react-konva';
// import useImage from 'use-image';

interface Element {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'image' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  src?: string;
  points?: number[];
}

const ImageElement: React.FC<{ element: Element; isSelected: boolean; onSelect: () => void; onChange: (attrs: any) => void }> = ({ element, isSelected, onSelect, onChange }) => {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  React.useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = element.src || '';
  }, [element.src]);

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        ref={shapeRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export const GraphicsEditor: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(24);
  const [textValue, setTextValue] = useState('');
  const stageRef = useRef<any>();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addElement = useCallback((type: Element['type'], props: Partial<Element> = {}) => {
    const newElement: Element = {
      id: generateId(),
      type,
      x: 100,
      y: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth,
      ...props,
    };

    if (type === 'rect') {
      newElement.width = 100;
      newElement.height = 100;
    } else if (type === 'circle') {
      newElement.radius = 50;
    } else if (type === 'text') {
      newElement.text = textValue || 'Sample Text';
      newElement.fontSize = fontSize;
      newElement.width = 200;
    } else if (type === 'line') {
      newElement.points = [0, 0, 100, 0];
    }

    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
  }, [fillColor, strokeColor, strokeWidth, fontSize, textValue]);

  const updateElement = useCallback((id: string, attrs: Partial<Element>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...attrs } : el));
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedId) {
      setElements(prev => prev.filter(el => el.id !== selectedId));
      setSelectedId(null);
    }
  }, [selectedId]);

  const addOnlineImage = useCallback((imageUrl: string) => {
    addElement('image', {
      src: imageUrl,
      width: 200,
      height: 150,
    });
  }, [addElement]);

  const loadTemplate = useCallback((templateType: string) => {
    setElements([]);
    setSelectedId(null);

    switch (templateType) {
      case 'poster':
        const bg = {
          id: generateId(),
          type: 'rect' as const,
          x: 0, y: 0, width: 800, height: 600,
          fill: '#667eea', stroke: '', strokeWidth: 0
        };
        const title = {
          id: generateId(),
          type: 'text' as const,
          x: 50, y: 100, width: 700,
          text: 'YOUR TITLE HERE',
          fontSize: 48, fill: '#ffffff'
        };
        setElements([bg, title]);
        break;
      case 'social':
        const socialBg = {
          id: generateId(),
          type: 'rect' as const,
          x: 0, y: 0, width: 800, height: 600,
          fill: '#f093fb', stroke: '', strokeWidth: 0
        };
        const socialText = {
          id: generateId(),
          type: 'text' as const,
          x: 100, y: 250, width: 600,
          text: 'Social Media Post',
          fontSize: 32, fill: '#ffffff'
        };
        setElements([socialBg, socialText]);
        break;
    }
  }, []);

  const downloadCanvas = useCallback(() => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `design-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedId(null);
  }, []);

  const selectedElement = elements.find(el => el.id === selectedId);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <div className="konva-editor">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1>Konva Editor</h1>
        </div>
        <div className="header-center">
          <button onClick={() => setActiveTool('select')} className={activeTool === 'select' ? 'active' : ''}>
            Select
          </button>
          <button onClick={() => setActiveTool('text')} className={activeTool === 'text' ? 'active' : ''}>
            Text
          </button>
          <button onClick={() => setActiveTool('shapes')} className={activeTool === 'shapes' ? 'active' : ''}>
            Shapes
          </button>
          <button onClick={() => setActiveTool('images')} className={activeTool === 'images' ? 'active' : ''}>
            Images
          </button>
          <button onClick={() => setActiveTool('templates')} className={activeTool === 'templates' ? 'active' : ''}>
            Templates
          </button>
        </div>
        <div className="header-right">
          <button onClick={downloadCanvas} className="download-btn">Download</button>
          <button onClick={clearCanvas} className="clear-btn">Clear</button>
        </div>
      </div>

      <div className="main-content">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          {activeTool === 'text' && (
            <div className="tool-panel">
              <h3>Text Tools</h3>
              <input
                type="text"
                placeholder="Enter text..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                className="text-input"
              />
              <button onClick={() => addElement('text')} className="add-btn">Add Text</button>
              
              <div className="property-group">
                <label>Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {activeTool === 'shapes' && (
            <div className="tool-panel">
              <h3>Shapes</h3>
              <div className="shapes-grid">
                <button onClick={() => addElement('rect')} className="shape-btn">Rectangle</button>
                <button onClick={() => addElement('circle')} className="shape-btn">Circle</button>
                <button onClick={() => addElement('line')} className="shape-btn">Line</button>
              </div>
            </div>
          )}

          {activeTool === 'images' && (
            <div className="tool-panel">
              <h3>Images</h3>
              <div className="online-images">
                <h4>Free Photos</h4>
                <div className="image-grid">
                  {['nature', 'business', 'technology', 'people', 'food', 'travel'].map(category => (
                    <div key={category} className="image-category">
                      <img 
                        src={`https://source.unsplash.com/200x150/?${category}`}
                        alt={category}
                        className="online-image"
                        onClick={() => addOnlineImage(`https://source.unsplash.com/400x300/?${category}`)}
                      />
                      <span className="category-label">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTool === 'templates' && (
            <div className="tool-panel">
              <h3>Templates</h3>
              <div className="template-grid">
                <div className="template-item" onClick={() => loadTemplate('poster')}>
                  <div className="template-preview poster-template">POSTER</div>
                  <span>Poster</span>
                </div>
                <div className="template-item" onClick={() => loadTemplate('social')}>
                  <div className="template-preview social-template">POST</div>
                  <span>Social Media</span>
                </div>
              </div>
            </div>
          )}

          <div className="color-panel">
            <h3>Colors</h3>
            <div className="color-group">
              <label>Fill Color:</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </div>
            <div className="color-group">
              <label>Stroke Color:</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
              />
            </div>
            <div className="color-group">
              <label>Stroke Width: {strokeWidth}px</label>
              <input
                type="range"
                min="0"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="canvas-area">
          <Stage
            ref={stageRef}
            width={800}
            height={600}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
          >
            <Layer>
              {elements.map((element) => {
                const isSelected = element.id === selectedId;
                const commonProps = {
                  key: element.id,
                  onClick: () => setSelectedId(element.id),
                  onTap: () => setSelectedId(element.id),
                  draggable: true,
                  onDragEnd: (e: any) => updateElement(element.id, { x: e.target.x(), y: e.target.y() }),
                };

                if (element.type === 'rect') {
                  return (
                    <Rect
                      {...commonProps}
                      x={element.x}
                      y={element.y}
                      width={element.width}
                      height={element.height}
                      fill={element.fill}
                      stroke={element.stroke}
                      strokeWidth={element.strokeWidth}
                    />
                  );
                } else if (element.type === 'circle') {
                  return (
                    <Circle
                      {...commonProps}
                      x={element.x}
                      y={element.y}
                      radius={element.radius}
                      fill={element.fill}
                      stroke={element.stroke}
                      strokeWidth={element.strokeWidth}
                    />
                  );
                } else if (element.type === 'text') {
                  return (
                    <Text
                      {...commonProps}
                      x={element.x}
                      y={element.y}
                      text={element.text}
                      fontSize={element.fontSize}
                      fill={element.fill}
                      width={element.width}
                    />
                  );
                } else if (element.type === 'line') {
                  return (
                    <Line
                      {...commonProps}
                      x={element.x}
                      y={element.y}
                      points={element.points}
                      stroke={element.stroke}
                      strokeWidth={element.strokeWidth}
                    />
                  );
                } else if (element.type === 'image') {
                  return (
                    <ImageElement
                      key={element.id}
                      element={element}
                      isSelected={isSelected}
                      onSelect={() => setSelectedId(element.id)}
                      onChange={(attrs) => updateElement(element.id, attrs)}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="properties-panel">
            <h3>Properties</h3>
            {selectedElement ? (
              <div className="property-controls">
                <div className="property-item">
                  <label>X Position:</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                  />
                </div>
                <div className="property-item">
                  <label>Y Position:</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                  />
                </div>
                {selectedElement.width && (
                  <div className="property-item">
                    <label>Width:</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.width)}
                      onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                    />
                  </div>
                )}
                {selectedElement.height && (
                  <div className="property-item">
                    <label>Height:</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.height)}
                      onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                    />
                  </div>
                )}
                {selectedElement.fill && (
                  <div className="property-item">
                    <label>Fill Color:</label>
                    <input
                      type="color"
                      value={selectedElement.fill}
                      onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                    />
                  </div>
                )}
              </div>
            ) : (
              <p>Select an element to edit properties</p>
            )}
          </div>

          <div className="actions-panel">
            <h3>Actions</h3>
            <button onClick={deleteSelected} disabled={!selectedId} className="action-btn delete">
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};