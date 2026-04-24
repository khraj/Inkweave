import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './CustomizePage.css';

// ─── T-Shirt SVG Shapes per category ────────────────────────────────────────
const SHIRT_SHAPES = {
  'round-neck': {
    label: 'Round Neck',
    svg: (color, strokeColor) => (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        {/* Body */}
        <path d="M90,40 Q100,20 120,18 Q150,30 180,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z"
          fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Collar */}
        <path d="M120,18 Q150,45 180,18" fill="none" stroke={strokeColor} strokeWidth="2.5"/>
        {/* Sleeve left */}
        <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Sleeve right */}
        <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Fold lines for realism */}
        <line x1="150" y1="50" x2="150" y2="280" stroke={strokeColor} strokeWidth="0.5" opacity="0.2"/>
      </svg>
    ),
    printZone: { x: 95, y: 95, w: 110, h: 130 }
  },
  'polo': {
    label: 'Polo',
    svg: (color, strokeColor) => (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        {/* Body */}
        <path d="M90,45 L85,30 L115,20 L130,40 L150,50 L170,40 L185,20 L215,30 L210,45 L260,85 L240,125 L210,110 L210,280 L90,280 L90,110 L60,125 L40,85 Z"
          fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Collar left flap */}
        <path d="M115,20 L130,40 L150,50 L145,20 Z" fill={color} stroke={strokeColor} strokeWidth="1.5"/>
        {/* Collar right flap */}
        <path d="M185,20 L170,40 L150,50 L155,20 Z" fill={color} stroke={strokeColor} strokeWidth="1.5"/>
        {/* Collar band */}
        <rect x="140" y="18" width="20" height="32" rx="2" fill={color} stroke={strokeColor} strokeWidth="1.5"/>
        {/* Buttons */}
        <circle cx="150" cy="25" r="2" fill={strokeColor} opacity="0.5"/>
        <circle cx="150" cy="33" r="2" fill={strokeColor} opacity="0.5"/>
        <circle cx="150" cy="41" r="2" fill={strokeColor} opacity="0.5"/>
        {/* Sleeves */}
        <path d="M90,45 L40,85 L60,125 L90,110" fill={color} stroke={strokeColor} strokeWidth="2"/>
        <path d="M210,45 L260,85 L240,125 L210,110" fill={color} stroke={strokeColor} strokeWidth="2"/>
      </svg>
    ),
    printZone: { x: 95, y: 100, w: 110, h: 130 }
  },
  'v-neck': {
    label: 'V-Neck',
    svg: (color, strokeColor) => (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        {/* Body */}
        <path d="M90,40 Q100,20 115,18 L150,60 L185,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z"
          fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* V collar */}
        <path d="M115,18 L150,60 L185,18" fill="none" stroke={strokeColor} strokeWidth="2.5"/>
        {/* Sleeves */}
        <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={strokeColor} strokeWidth="2"/>
        <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={strokeColor} strokeWidth="2"/>
      </svg>
    ),
    printZone: { x: 95, y: 100, w: 110, h: 130 }
  },
  'hoodie': {
    label: 'Hoodie',
    svg: (color, strokeColor) => (
      <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        {/* Body */}
        <path d="M85,55 L75,35 Q100,10 130,15 L150,35 L170,15 Q200,10 225,35 L215,55 L265,95 L245,135 L215,118 L215,295 L85,295 L85,118 L55,135 L35,95 Z"
          fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Hood */}
        <path d="M115,18 Q150,5 185,18 L185,45 Q150,55 115,45 Z" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Hood opening */}
        <ellipse cx="150" cy="38" rx="24" ry="18" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Kangaroo pocket */}
        <path d="M105,190 Q150,185 195,190 L195,230 Q150,235 105,230 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.5"/>
        {/* Drawstrings */}
        <line x1="138" y1="55" x2="130" y2="90" stroke={strokeColor} strokeWidth="1.5" opacity="0.4"/>
        <line x1="162" y1="55" x2="170" y2="90" stroke={strokeColor} strokeWidth="1.5" opacity="0.4"/>
        {/* Sleeves */}
        <path d="M85,55 L35,95 L55,135 L85,118" fill={color} stroke={strokeColor} strokeWidth="2"/>
        <path d="M215,55 L265,95 L245,135 L215,118" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Cuffs */}
        <rect x="35" y="125" width="28" height="12" rx="4" fill={color} stroke={strokeColor} strokeWidth="1.5"/>
        <rect x="237" y="125" width="28" height="12" rx="4" fill={color} stroke={strokeColor} strokeWidth="1.5"/>
        {/* Bottom band */}
        <rect x="85" y="283" width="130" height="14" rx="4" fill={color} stroke={strokeColor} strokeWidth="1.5"/>
      </svg>
    ),
    printZone: { x: 95, y: 105, w: 110, h: 120 }
  },
  'tank-top': {
    label: 'Tank Top',
    svg: (color, strokeColor) => (
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        {/* Body */}
        <path d="M100,15 Q115,5 150,10 Q185,5 200,15 L220,55 L200,65 L200,265 L100,265 L100,65 L80,55 Z"
          fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Left strap */}
        <path d="M100,15 L80,55 L100,65 L115,45 Q118,18 120,15 Z" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Right strap */}
        <path d="M200,15 L220,55 L200,65 L185,45 Q182,18 180,15 Z" fill={color} stroke={strokeColor} strokeWidth="2"/>
        {/* Neckline */}
        <path d="M120,15 Q150,30 180,15" fill="none" stroke={strokeColor} strokeWidth="2"/>
        {/* Armhole left */}
        <path d="M100,65 Q88,80 80,55" fill="none" stroke={strokeColor} strokeWidth="2"/>
        {/* Armhole right */}
        <path d="M200,65 Q212,80 220,55" fill="none" stroke={strokeColor} strokeWidth="2"/>
      </svg>
    ),
    printZone: { x: 100, y: 80, w: 100, h: 140 }
  }
};

const TSHIRT_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Navy', hex: '#1a237e' },
  { name: 'Red', hex: '#c62828' },
  { name: 'Grey', hex: '#9e9e9e' },
  { name: 'Royal Blue', hex: '#1565c0' },
  { name: 'Green', hex: '#2e7d32' },
  { name: 'Maroon', hex: '#880e4f' },
  { name: 'Orange', hex: '#e65100' },
  { name: 'Yellow', hex: '#f9a825' },
];

const FONTS = [
  { id: 'bold', label: 'Bold', css: 'Impact, sans-serif' },
  { id: 'serif', label: 'Serif', css: 'Georgia, serif' },
  { id: 'hand', label: 'Handwritten', css: 'cursive' },
  { id: 'block', label: 'Block', css: 'Arial Black, sans-serif' },
  { id: 'script', label: 'Script', css: 'Palatino, serif' },
];

function isDark(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
}

// ─── Draggable Resizable Design Element ─────────────────────────────────────
function DesignElement({ element, selected, onSelect, onUpdate, canvasRef }) {
  const elRef = useRef(null);
  const dragState = useRef(null);
  const resizeState = useRef(null);

  const handleMouseDown = useCallback(function(e) {
    e.stopPropagation();
    onSelect();
    var rect = canvasRef.current.getBoundingClientRect();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      canvasRect: rect
    };
    function onMove(ev) {
      if (!dragState.current) return;
      var dx = ev.clientX - dragState.current.startX;
      var dy = ev.clientY - dragState.current.startY;
      var cw = dragState.current.canvasRect.width;
      var ch = dragState.current.canvasRect.height;
      var newX = Math.max(0, Math.min(100 - element.width, dragState.current.origX + (dx / cw) * 100));
      var newY = Math.max(0, Math.min(100 - element.height, dragState.current.origY + (dy / ch) * 100));
      onUpdate({ x: newX, y: newY });
    }
    function onUp() {
      dragState.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, onSelect, onUpdate, canvasRef]);

  const handleResizeDown = useCallback(function(e) {
    e.stopPropagation();
    var rect = canvasRef.current.getBoundingClientRect();
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: element.width,
      origH: element.height,
      canvasRect: rect
    };
    function onMove(ev) {
      if (!resizeState.current) return;
      var dx = ev.clientX - resizeState.current.startX;
      var dy = ev.clientY - resizeState.current.startY;
      var cw = resizeState.current.canvasRect.width;
      var ch = resizeState.current.canvasRect.height;
      var newW = Math.max(10, Math.min(80, resizeState.current.origW + (dx / cw) * 100));
      var newH = Math.max(10, Math.min(80, resizeState.current.origH + (dy / ch) * 100));
      onUpdate({ width: newW, height: newH });
    }
    function onUp() {
      resizeState.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, onUpdate, canvasRef]);

  return (
    <div
      ref={elRef}
      className={'design-element' + (selected ? ' selected' : '')}
      style={{
        position: 'absolute',
        left: element.x + '%',
        top: element.y + '%',
        width: element.width + '%',
        height: element.height + '%',
        cursor: 'move',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
      onMouseDown={handleMouseDown}
    >
      {element.type === 'image' && (
        <img
          src={element.src}
          alt="design"
          style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
        />
      )}
      {element.type === 'text' && (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: element.fontCss,
          fontSize: 'clamp(8px, ' + (element.fontSize || 3) + 'vw, 32px)',
          color: element.color,
          fontWeight: 'bold',
          textAlign: 'center',
          wordBreak: 'break-word',
          lineHeight: 1.2,
          pointerEvents: 'none',
          textShadow: element.color === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
        }}>
          {element.text}
        </div>
      )}
      {selected && (
        <>
          <div className="element-border" />
          <div
            className="resize-handle"
            onMouseDown={handleResizeDown}
          />
          <div className="element-hint">Drag to move · Corner to resize</div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CustomizePage() {
  const [selectedCategory, setSelectedCategory] = useState('round-neck');
  const [selectedColor, setSelectedColor] = useState(TSHIRT_COLORS[0]);
  const [elements, setElements] = useState([]);
  const [selectedEl, setSelectedEl] = useState(null);
  const [designText, setDesignText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(3);
  const [activeTab, setActiveTab] = useState('style');
  const canvasRef = useRef(null);

  var shirtShape = SHIRT_SHAPES[selectedCategory] || SHIRT_SHAPES['round-neck'];
  var strokeColor = isDark(selectedColor.hex) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';

  // Click on canvas deselects
  var handleCanvasClick = function() {
    setSelectedEl(null);
  };

  // Add text element
  var handleAddText = function() {
    if (!designText.trim()) return;
    var id = Date.now();
    var zone = shirtShape.printZone;
    var cw = 300; var ch = 320;
    setElements(function(prev) {
      return [...prev, {
        id: id,
        type: 'text',
        text: designText,
        color: textColor,
        fontCss: selectedFont.css,
        fontSize: fontSize,
        x: (zone.x / cw) * 100,
        y: (zone.y / ch) * 100,
        width: (zone.w / cw) * 100,
        height: 15,
      }];
    });
    setSelectedEl(id);
    setDesignText('');
  };

  // Add image element
  var handleImageUpload = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var id = Date.now();
      var zone = shirtShape.printZone;
      var cw = 300; var ch = 320;
      setElements(function(prev) {
        return [...prev, {
          id: id,
          type: 'image',
          src: ev.target.result,
          x: (zone.x / cw) * 100,
          y: (zone.y / ch) * 100,
          width: (zone.w / cw) * 100,
          height: ((zone.h * 0.5) / ch) * 100,
        }];
      });
      setSelectedEl(id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Update element props
  var updateElement = function(id, props) {
    setElements(function(prev) {
      return prev.map(function(el) {
        return el.id === id ? Object.assign({}, el, props) : el;
      });
    });
  };

  // Delete selected element
  var deleteSelected = function() {
    setElements(function(prev) { return prev.filter(function(el) { return el.id !== selectedEl; }); });
    setSelectedEl(null);
  };

  var selectedElement = elements.find(function(el) { return el.id === selectedEl; });

  // Update selected text element properties live
  useEffect(function() {
    if (selectedEl && selectedElement && selectedElement.type === 'text') {
      updateElement(selectedEl, { color: textColor, fontCss: selectedFont.css, fontSize: fontSize });
    }
  }, [textColor, selectedFont, fontSize]);

  return (
    <div className="page customize-page">
      <div className="container">
        <div className="page-header customize-header">
          <h1 className="page-title">T-Shirt Designer</h1>
          <p className="page-subtitle">Design your custom t-shirt — drag, resize and position your artwork</p>
        </div>

        <div className="designer-layout">

          {/* ── Left Panel: Controls ── */}
          <div className="designer-controls">

            {/* Tabs */}
            <div className="designer-tabs">
              {[
                { id: 'style', label: '👕 Style' },
                { id: 'color', label: '🎨 Color' },
                { id: 'text', label: '✏️ Text' },
                { id: 'image', label: '🖼️ Image' },
              ].map(function(tab) {
                return (
                  <button
                    key={tab.id}
                    className={'dtab' + (activeTab === tab.id ? ' active' : '')}
                    onClick={function() { setActiveTab(tab.id); }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Style Tab */}
            {activeTab === 'style' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Choose Style</div>
                <div className="style-list">
                  {Object.keys(SHIRT_SHAPES).map(function(catId) {
                    var cat = SHIRT_SHAPES[catId];
                    return (
                      <div
                        key={catId}
                        className={'style-item' + (selectedCategory === catId ? ' selected' : '')}
                        onClick={function() { setSelectedCategory(catId); }}
                      >
                        <div className="style-item-preview">
                          {cat.svg(selectedColor.hex, strokeColor)}
                        </div>
                        <span className="style-item-label">{cat.label}</span>
                        {selectedCategory === catId && <span className="style-item-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Tab */}
            {activeTab === 'color' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Shirt Color</div>
                <div className="color-palette">
                  {TSHIRT_COLORS.map(function(color) {
                    return (
                      <div
                        key={color.hex}
                        className={'palette-item' + (selectedColor.hex === color.hex ? ' selected' : '')}
                        onClick={function() { setSelectedColor(color); }}
                        title={color.name}
                      >
                        <div className="palette-swatch" style={{ background: color.hex }} />
                        <span className="palette-name">{color.name}</span>
                        {selectedColor.hex === color.hex && <span className="palette-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Text Tab */}
            {activeTab === 'text' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Add Text</div>
                <div className="input-group" style={{ marginBottom: 16 }}>
                  <label>Your Text</label>
                  <input
                    className="input"
                    placeholder="Enter text to add..."
                    value={designText}
                    maxLength={40}
                    onChange={function(e) { setDesignText(e.target.value); }}
                    onKeyDown={function(e) { if (e.key === 'Enter') handleAddText(); }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 4 }}>{designText.length}/40</div>
                </div>

                <div className="input-group" style={{ marginBottom: 16 }}>
                  <label>Font Style</label>
                  <div className="font-list">
                    {FONTS.map(function(font) {
                      return (
                        <button
                          key={font.id}
                          className={'font-item' + (selectedFont.id === font.id ? ' active' : '')}
                          style={{ fontFamily: font.css }}
                          onClick={function() { setSelectedFont(font); }}
                        >
                          {font.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 16 }}>
                  <label>Text Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="color"
                      value={textColor}
                      onChange={function(e) { setTextColor(e.target.value); }}
                      style={{ width: 44, height: 44, border: 'none', cursor: 'pointer', borderRadius: 8, padding: 2 }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{textColor}</span>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 20 }}>
                  <label>Font Size: {fontSize}</label>
                  <input
                    type="range" min="1" max="6" step="0.5"
                    value={fontSize}
                    onChange={function(e) { setFontSize(parseFloat(e.target.value)); }}
                    style={{ width: '100%' }}
                  />
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddText}>
                  + Add Text to Shirt
                </button>

                {selectedElement && selectedElement.type === 'text' && (
                  <div className="selected-hint">
                    <div className="selected-hint-title">✏️ Editing selected text</div>
                    <div>Change color, font or size above — updates live</div>
                  </div>
                )}
              </div>
            )}

            {/* Image Tab */}
            {activeTab === 'image' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Upload Design Image</div>
                <input
                  type="file"
                  id="design-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="design-upload" className="image-upload-zone">
                  <span style={{ fontSize: '2.5rem' }}>🖼️</span>
                  <span className="iuz-title">Click to upload your design</span>
                  <span className="iuz-hint">PNG with transparent background works best<br />JPG, WEBP also accepted · Max 10MB</span>
                </label>

                <div className="upload-tips">
                  <div className="tip-title">Tips for best results:</div>
                  <ul>
                    <li>Use PNG with transparent background</li>
                    <li>Minimum 300 DPI resolution</li>
                    <li>High contrast designs print clearest</li>
                    <li>You can add multiple images</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Selected element controls */}
            {selectedElement && (
              <div className="element-controls">
                <div className="ec-title">
                  Selected: {selectedElement.type === 'text' ? '"' + selectedElement.text + '"' : 'Image'}
                </div>
                <div className="ec-row">
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
                    Drag on canvas to move · Drag corner handle to resize
                  </div>
                  <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={deleteSelected}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}

            {elements.length > 0 && (
              <div className="layers-panel">
                <div className="layers-title">Layers ({elements.length})</div>
                {elements.map(function(el, i) {
                  return (
                    <div
                      key={el.id}
                      className={'layer-item' + (selectedEl === el.id ? ' active' : '')}
                      onClick={function() { setSelectedEl(el.id); }}
                    >
                      <span className="layer-icon">{el.type === 'image' ? '🖼️' : '✏️'}</span>
                      <span className="layer-label">
                        {el.type === 'text' ? (el.text.slice(0, 20) + (el.text.length > 20 ? '...' : '')) : 'Image ' + (i + 1)}
                      </span>
                      <button
                        className="layer-delete"
                        onClick={function(e) { e.stopPropagation(); setElements(function(prev) { return prev.filter(function(x) { return x.id !== el.id; }); }); if (selectedEl === el.id) setSelectedEl(null); }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right Panel: Canvas Preview ── */}
          <div className="designer-canvas-wrap">
            <div className="canvas-toolbar">
              <span className="canvas-info">
                {selectedColor.name} · {shirtShape.label}
                {elements.length > 0 && ' · ' + elements.length + ' element' + (elements.length > 1 ? 's' : '')}
              </span>
              {elements.length > 0 && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={function() { setElements([]); setSelectedEl(null); }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Canvas */}
            <div
              className="shirt-canvas"
              ref={canvasRef}
              onClick={handleCanvasClick}
            >
              {/* Shirt SVG */}
              <div className="shirt-svg-layer">
                {shirtShape.svg(selectedColor.hex, strokeColor)}
              </div>

              {/* Print zone indicator */}
              {elements.length === 0 && (
                <div className="print-zone-hint">
                  <div className="pz-label">Print Area</div>
                  <div className="pz-sub">Add text or image using the panel →</div>
                </div>
              )}

              {/* Design elements */}
              {elements.map(function(el) {
                return (
                  <DesignElement
                    key={el.id}
                    element={el}
                    selected={selectedEl === el.id}
                    onSelect={function() { setSelectedEl(el.id); }}
                    onUpdate={function(props) { updateElement(el.id, props); }}
                    canvasRef={canvasRef}
                  />
                );
              })}
            </div>

            {/* CTA */}
            <div className="canvas-cta">
              <div className="cta-note">
                Happy with your design? Head to the shop to place your order and upload your design file.
              </div>
              <Link
                to={'/products?category=' + selectedCategory}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Order This Style →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}