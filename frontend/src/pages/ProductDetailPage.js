import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

var SHIRT_SHAPES = {
  'round-neck': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M90,40 Q100,20 120,18 Q150,30 180,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M120,18 Q150,45 180,18" fill="none" stroke={stroke} strokeWidth="2.5"/>
        <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={stroke} strokeWidth="2"/>
        <line x1="150" y1="50" x2="150" y2="280" stroke={stroke} strokeWidth="0.5" opacity="0.2"/>
      </svg>
    );
  },
  'polo': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M90,45 L85,30 L115,20 L130,40 L150,50 L170,40 L185,20 L215,30 L210,45 L260,85 L240,125 L210,110 L210,280 L90,280 L90,110 L60,125 L40,85 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M115,20 L130,40 L150,50 L145,20 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
        <path d="M185,20 L170,40 L150,50 L155,20 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
        <rect x="140" y="18" width="20" height="32" rx="2" fill={color} stroke={stroke} strokeWidth="1.5"/>
        <circle cx="150" cy="25" r="2" fill={stroke} opacity="0.5"/>
        <circle cx="150" cy="33" r="2" fill={stroke} opacity="0.5"/>
        <circle cx="150" cy="41" r="2" fill={stroke} opacity="0.5"/>
        <path d="M90,45 L40,85 L60,125 L90,110" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M210,45 L260,85 L240,125 L210,110" fill={color} stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  },
  'v-neck': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M90,40 Q100,20 115,18 L150,60 L185,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M115,18 L150,60 L185,18" fill="none" stroke={stroke} strokeWidth="2.5"/>
        <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  },
  'hoodie': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M85,55 L75,35 Q100,10 130,15 L150,35 L170,15 Q200,10 225,35 L215,55 L265,95 L245,135 L215,118 L215,295 L85,295 L85,118 L55,135 L35,95 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M115,18 Q150,5 185,18 L185,45 Q150,55 115,45 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <ellipse cx="150" cy="38" rx="24" ry="18" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M105,190 Q150,185 195,190 L195,230 Q150,235 105,230 Z" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5"/>
        <line x1="138" y1="55" x2="130" y2="90" stroke={stroke} strokeWidth="1.5" opacity="0.4"/>
        <line x1="162" y1="55" x2="170" y2="90" stroke={stroke} strokeWidth="1.5" opacity="0.4"/>
        <path d="M85,55 L35,95 L55,135 L85,118" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M215,55 L265,95 L245,135 L215,118" fill={color} stroke={stroke} strokeWidth="2"/>
        <rect x="35" y="125" width="28" height="12" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
        <rect x="237" y="125" width="28" height="12" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
        <rect x="85" y="283" width="130" height="14" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
      </svg>
    );
  },
  'tank-top': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M100,15 Q115,5 150,10 Q185,5 200,15 L220,55 L200,65 L200,265 L100,265 L100,65 L80,55 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M100,15 L80,55 L100,65 L115,45 Q118,18 120,15 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M200,15 L220,55 L200,65 L185,45 Q182,18 180,15 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M120,15 Q150,30 180,15" fill="none" stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  },
};

function isDark(hex) {
  if (!hex || hex.length < 4) return false;
  var h = hex.replace('#','');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var r = parseInt(h.slice(0,2),16);
  var g = parseInt(h.slice(2,4),16);
  var b = parseInt(h.slice(4,6),16);
  return (r*0.299 + g*0.587 + b*0.114) < 140;
}

function DraggableDesign({ element, selected, onSelect, onUpdate, canvasRef }) {
  var dragState = useRef(null);
  var resizeState = useRef(null);

  var handleMouseDown = useCallback(function(e) {
    e.stopPropagation();
    onSelect();
    var rect = canvasRef.current.getBoundingClientRect();
    dragState.current = { startX:e.clientX, startY:e.clientY, origX:element.x, origY:element.y, rect:rect };
    function onMove(ev) {
      if (!dragState.current) return;
      var dx = ((ev.clientX - dragState.current.startX) / dragState.current.rect.width) * 100;
      var dy = ((ev.clientY - dragState.current.startY) / dragState.current.rect.height) * 100;
      onUpdate({ x: Math.max(0, Math.min(90, dragState.current.origX + dx)), y: Math.max(0, Math.min(85, dragState.current.origY + dy)) });
    }
    function onUp() { dragState.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, onSelect, onUpdate, canvasRef]);

  var handleResizeDown = useCallback(function(e) {
    e.stopPropagation();
    var rect = canvasRef.current.getBoundingClientRect();
    resizeState.current = { startX:e.clientX, startY:e.clientY, origW:element.width, origH:element.height, rect:rect };
    function onMove(ev) {
      if (!resizeState.current) return;
      var dw = ((ev.clientX - resizeState.current.startX) / resizeState.current.rect.width) * 100;
      var dh = ((ev.clientY - resizeState.current.startY) / resizeState.current.rect.height) * 100;
      onUpdate({ width: Math.max(8, Math.min(80, resizeState.current.origW + dw)), height: Math.max(8, Math.min(70, resizeState.current.origH + dh)) });
    }
    function onUp() { resizeState.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, onUpdate, canvasRef]);

  return (
    <div
      style={{ position:'absolute', left:element.x+'%', top:element.y+'%', width:element.width+'%', height:element.height+'%', cursor:'move', userSelect:'none', boxSizing:'border-box' }}
      onMouseDown={handleMouseDown}
    >
      {element.type === 'image' && (
        <img src={element.src} alt="design" style={{ width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none' }} />
      )}
      {element.type === 'text' && (
        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:element.fontCss, fontWeight:'bold', textAlign:'center', wordBreak:'break-word', lineHeight:1.2, pointerEvents:'none', color:element.color||'#000', fontSize:'clamp(8px,3vw,28px)' }}>
          {element.text}
        </div>
      )}
      {selected && (
        <>
          <div style={{ position:'absolute', inset:-2, border:'2px dashed #e84545', borderRadius:4, pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-7, right:-7, width:14, height:14, background:'#e84545', borderRadius:3, cursor:'se-resize', zIndex:10 }} onMouseDown={handleResizeDown} />
          <div style={{ position:'absolute', top:'calc(100% + 4px)', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.7)', color:'white', fontSize:'0.6rem', padding:'2px 7px', borderRadius:4, whiteSpace:'nowrap', pointerEvents:'none', zIndex:20 }}>
            Drag to move · Corner to resize
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  var { id } = useParams();
  var navigate = useNavigate();
  var [searchParams] = useSearchParams();
  var { addToCart } = useCart();
  var canvasRef = useRef(null);

  var [product, setProduct] = useState(null);
  var [loading, setLoading] = useState(true);
  var [selectedColor, setSelectedColor] = useState(null);
  var [selectedSize, setSelectedSize] = useState(null);
  var [selectedPrintArea, setSelectedPrintArea] = useState('front');
  var [designText, setDesignText] = useState('');
  var [designNotes, setDesignNotes] = useState('');
  var [quantity, setQuantity] = useState(1);
  var [designFile, setDesignFile] = useState(null);
  var [designPreview, setDesignPreview] = useState(null);
  var [elements, setElements] = useState([]);
  var [selectedEl, setSelectedEl] = useState(null);
  var [activeTab, setActiveTab] = useState('details');

  var fromCustomizer = searchParams.get('fromCustomizer') === '1';

  useEffect(function() {
    api.get('/products/' + id).then(function(res) {
      var p = res.data.product;
      setProduct(p);
      setSelectedSize(p.sizes && p.sizes[0] && p.sizes[0].size);

      // Load customization from sessionStorage if coming from designer
      var pending = sessionStorage.getItem('pendingCustomization');
      if (pending && fromCustomizer) {
        try {
          var customization = JSON.parse(pending);
          sessionStorage.removeItem('pendingCustomization');

          // Match color
          if (customization.colorHex && p.colors) {
            var matched = p.colors.find(function(c) { return c.hex === customization.colorHex; });
            setSelectedColor(matched || p.colors[0]);
          } else {
            setSelectedColor(p.colors && p.colors[0]);
          }

          // Restore design elements
          if (customization.elements && customization.elements.length > 0) {
            setElements(customization.elements);
            setActiveTab('design');
            setTimeout(function() {
              toast.success('Your design has been loaded! 🎨 You can still edit it below.');
            }, 500);
          }
        } catch(e) {
          setSelectedColor(p.colors && p.colors[0]);
        }
      } else {
        setSelectedColor(p.colors && p.colors[0]);
      }
    }).catch(function() {
      navigate('/products');
    }).finally(function() { setLoading(false); });
  }, [id, navigate, fromCustomizer]);

  if (loading) return (
    <div className="page flex-center" style={{ minHeight:'60vh' }}>
      <div className="spinner" style={{ width:40, height:40 }} />
    </div>
  );
  if (!product) return null;

  var category = product.category || 'round-neck';
  var shirtFn = SHIRT_SHAPES[category] || SHIRT_SHAPES['round-neck'];
  var colorHex = selectedColor ? selectedColor.hex : '#FFFFFF';
  var strokeColor = isDark(colorHex) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';

  var sizeInfo = product.sizes && product.sizes.find(function(s) { return s.size === selectedSize; });
  var printAreaInfo = product.printAreas && product.printAreas.find(function(p) { return p.name === selectedPrintArea; });
  var unitPrice = product.basePrice + (sizeInfo ? sizeInfo.additionalPrice||0 : 0) + (printAreaInfo ? printAreaInfo.additionalPrice||0 : 0);
  var bulkTier = product.bulkPricing && product.bulkPricing.filter(function(b) { return quantity >= b.minQty; }).sort(function(a,b){ return b.minQty - a.minQty; })[0];
  var discount = bulkTier ? (unitPrice * bulkTier.discount) / 100 : 0;
  var finalPrice = unitPrice - discount;

  var handleAddText = function() {
    if (!designText.trim()) return;
    var newId = Date.now();
    setElements(function(prev) { return [...prev, { id:newId, type:'text', text:designText, color:'#000000', x:25, y:30, width:50, height:15 }]; });
    setSelectedEl(newId);
  };

  var handleFileChange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    setDesignFile(file);
    var reader = new FileReader();
    reader.onload = function(ev) {
      setDesignPreview(ev.target.result);
      var newId = Date.now();
      setElements(function(prev) { return [...prev, { id:newId, type:'image', src:ev.target.result, x:20, y:25, width:60, height:35 }]; });
      setSelectedEl(newId);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  var updateElement = function(elId, props) {
    setElements(function(prev) { return prev.map(function(el) { return el.id === elId ? Object.assign({}, el, props) : el; }); });
  };

  var deleteElement = function(elId) {
    setElements(function(prev) { return prev.filter(function(el) { return el.id !== elId; }); });
    if (selectedEl === elId) setSelectedEl(null);
  };

  var handleAddToCart = function() {
    if (!selectedSize) return toast.error('Please select a size');
    if (!selectedColor) return toast.error('Please select a color');
    addToCart({
      product: product._id,
      productName: product.name,
      productImage: product.images && product.images[0] && product.images[0].url,
      size: selectedSize,
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      customization: {
        designText: designText,
        printArea: selectedPrintArea,
        notes: designNotes,
        designFile: designFile || null,
        designPreview: designPreview || null,
      },
      unitPrice: finalPrice,
      quantity: quantity,
    });
    toast.success('Added to cart! 🛒');
  };

  return (
    <div className="page product-detail-page">
      <div className="container">

        {fromCustomizer && elements.length > 0 && (
          <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'var(--radius)', padding:'12px 18px', marginBottom:20, fontSize:'0.88rem', color:'#15803d', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:'1.2rem' }}>🎨</span>
            <span>Your design from the customizer has been loaded! Review it on the preview, adjust size/color, then add to cart.</span>
          </div>
        )}

        <div className="pdp-grid">

          {/* LEFT: Live Preview */}
          <div className="pdp-preview-col">
            <div className="pdp-preview-label">
              Live Preview · {selectedColor ? selectedColor.name : ''} · {category.replace('-',' ').replace(/\b\w/g, function(l){return l.toUpperCase();})}
            </div>

            <div className="pdp-canvas" ref={canvasRef} onClick={function() { setSelectedEl(null); }}>
              <div className="pdp-shirt-svg">
                {shirtFn(colorHex, strokeColor)}
              </div>

              {elements.length === 0 && (
                <div className="pdp-canvas-hint">
                  <div className="pdp-hint-box">Add design below</div>
                </div>
              )}

              {elements.map(function(el) {
                return (
                  <DraggableDesign
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

            <div className="pdp-color-strip">
              {product.colors && product.colors.map(function(c) {
                return (
                  <button key={c.hex} className={'pdp-color-dot' + (selectedColor && selectedColor.hex === c.hex ? ' active' : '')}
                    style={{ background: c.hex }} title={c.name}
                    onClick={function() { setSelectedColor(c); }}
                  />
                );
              })}
            </div>

            {elements.length > 0 && (
              <div className="pdp-layers">
                <div className="pdp-layers-title">Design Elements</div>
                {elements.map(function(el) {
                  return (
                    <div key={el.id} className={'pdp-layer' + (selectedEl === el.id ? ' active' : '')}
                      onClick={function(e) { e.stopPropagation(); setSelectedEl(el.id); }}>
                      <span>{el.type === 'image' ? '🖼️' : '✏️'}</span>
                      <span className="pdp-layer-label">{el.type === 'text' ? '"' + el.text.slice(0,20) + '"' : 'Image'}</span>
                      <button className="pdp-layer-del" onClick={function(e) { e.stopPropagation(); deleteElement(el.id); }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="pdp-info-col">
            <div className="product-detail-cat">{product.category}</div>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-desc">{product.description}</p>

            <div className="price-block">
              <div className="price-main">&#8377;{finalPrice.toFixed(0)}</div>
              {discount > 0 && (
                <div className="price-discount-info">
                  <span className="price-original">&#8377;{unitPrice.toFixed(0)}</span>
                  <span className="discount-badge">{bulkTier.discount}% bulk off</span>
                </div>
              )}
              <div className="price-note">Per piece · Inclusive of printing</div>
            </div>

            <div className="pdp-tabs">
              <button className={'pdp-tab' + (activeTab==='details'?' active':'')} onClick={function(){setActiveTab('details');}}>Details</button>
              <button className={'pdp-tab' + (activeTab==='design'?' active':'')} onClick={function(){setActiveTab('design');}}>✏️ Design</button>
              <button className={'pdp-tab' + (activeTab==='notes'?' active':'')} onClick={function(){setActiveTab('notes');}}>📝 Notes</button>
            </div>

            {activeTab === 'details' && (
              <div className="pdp-tab-content fade-in">
                <div className="option-group">
                  <div className="option-label">Color: <strong>{selectedColor && selectedColor.name}</strong></div>
                  <div className="color-options">
                    {product.colors && product.colors.map(function(c) {
                      return (
                        <button key={c.hex} className={'color-option' + (selectedColor && selectedColor.hex === c.hex ? ' active' : '')}
                          style={{ background: c.hex }} title={c.name}
                          onClick={function() { setSelectedColor(c); }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="option-group">
                  <div className="option-label">Size</div>
                  <div className="size-options">
                    {product.sizes && product.sizes.map(function(s) {
                      return (
                        <button key={s.size} className={'size-option' + (selectedSize === s.size ? ' active' : '')}
                          onClick={function() { setSelectedSize(s.size); }}>
                          {s.size}
                          {s.additionalPrice > 0 && <span className="size-extra">+&#8377;{s.additionalPrice}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {product.printAreas && product.printAreas.length > 0 && (
                  <div className="option-group">
                    <div className="option-label">Print Area</div>
                    <div className="print-area-options">
                      {product.printAreas.map(function(pa) {
                        return (
                          <button key={pa.name} className={'print-area-btn' + (selectedPrintArea === pa.name ? ' active' : '')}
                            onClick={function() { setSelectedPrintArea(pa.name); }}>
                            {pa.name.replace('-',' ')}
                            {pa.additionalPrice > 0 && <span> +&#8377;{pa.additionalPrice}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="option-group">
                  <div className="option-label">Quantity</div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={function(){setQuantity(function(q){return Math.max(1,q-1);});}}>&#8722;</button>
                    <span className="qty-val">{quantity}</span>
                    <button className="qty-btn" onClick={function(){setQuantity(function(q){return q+1;});}}>+</button>
                  </div>
                  {product.bulkPricing && product.bulkPricing.length > 0 && (
                    <div className="bulk-info" style={{ marginTop:8 }}>
                      {product.bulkPricing.map(function(b) {
                        return <span key={b.minQty} className="bulk-badge">{b.minQty}+ pieces: {b.discount}% off</span>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="pdp-tab-content fade-in">
                <div className="option-group">
                  <div className="option-label">Add Text to Preview</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <input className="input" placeholder="e.g. Your company name..." value={designText} maxLength={40}
                      onChange={function(e){ setDesignText(e.target.value); }}
                      onKeyDown={function(e){ if(e.key==='Enter') handleAddText(); }}
                      style={{ flex:1 }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={handleAddText} disabled={!designText.trim()}>Add</button>
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'var(--ink-muted)', marginTop:4 }}>{designText.length}/40 · Press Enter or click Add</div>
                </div>

                <div className="option-group">
                  <div className="option-label">Upload Design Image</div>
                  <input type="file" id="pdp-design-file" accept="image/*,.pdf" style={{display:'none'}} onChange={handleFileChange} />
                  <label htmlFor="pdp-design-file" className="pdp-upload-label">
                    {designPreview ? (
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <img src={designPreview} alt="design" style={{ width:56, height:56, objectFit:'contain', borderRadius:8, border:'1px solid var(--border)' }} />
                        <div>
                          <div style={{ fontWeight:600, fontSize:'0.85rem' }}>Design uploaded ✓</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--ink-muted)' }}>Click to change</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:'1.8rem', marginBottom:6 }}>🖼️</div>
                        <div style={{ fontWeight:600, fontSize:'0.88rem' }}>Click to upload design</div>
                        <div style={{ fontSize:'0.75rem', color:'var(--ink-muted)', marginTop:4 }}>PNG, JPG, PDF up to 10MB</div>
                      </div>
                    )}
                  </label>
                  {designPreview && (
                    <button className="btn btn-outline btn-sm" style={{ marginTop:8 }}
                      onClick={function(){ setDesignFile(null); setDesignPreview(null); setElements(function(prev){ return prev.filter(function(el){ return el.type !== 'image'; }); }); }}>
                      ✕ Remove Image
                    </button>
                  )}
                </div>

                {elements.length > 0 && (
                  <div className="design-tip-box">
                    <strong>🎨 Design is interactive!</strong><br/>
                    Drag elements on the preview to reposition. Drag the red corner to resize.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="pdp-tab-content fade-in">
                <div className="option-group">
                  <div className="option-label">Special Instructions for our team</div>
                  <textarea className="input" rows={5}
                    placeholder="Describe exact placement, colors, fonts, anything special about your design..."
                    value={designNotes}
                    onChange={function(e){ setDesignNotes(e.target.value); }}
                    style={{ resize:'vertical' }}
                  />
                  <div style={{ fontSize:'0.78rem', color:'var(--ink-muted)', marginTop:6 }}>Our design team reads every note before printing.</div>
                </div>
              </div>
            )}

            <div className="total-row">
              <div className="total-label">Total ({quantity} pc{quantity>1?'s':''})</div>
              <div className="total-val">&#8377;{(finalPrice * quantity).toFixed(0)}</div>
            </div>

            <button className="btn btn-primary btn-lg add-cart-btn" onClick={handleAddToCart}>
              &#128722; Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
