import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrintArea, setSelectedPrintArea] = useState('front');
  const [designText, setDesignText] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);

  useEffect(() => {
    api.get('/products/' + id).then(function(res) {
      var data = res.data;
      setProduct(data.product);
      setSelectedColor(data.product.colors && data.product.colors[0]);
      setSelectedSize(data.product.sizes && data.product.sizes[0] && data.product.sizes[0].size);
    }).catch(function() {
      navigate('/products');
    }).finally(function() {
      setLoading(false);
    });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!product) return null;

  var sizeInfo = product.sizes && product.sizes.find(function(s) { return s.size === selectedSize; });
  var printAreaInfo = product.printAreas && product.printAreas.find(function(p) { return p.name === selectedPrintArea; });
  var unitPrice = product.basePrice
    + (sizeInfo ? sizeInfo.additionalPrice || 0 : 0)
    + (printAreaInfo ? printAreaInfo.additionalPrice || 0 : 0);

  var bulkTier = product.bulkPricing && product.bulkPricing
    .filter(function(b) { return quantity >= b.minQty; })
    .sort(function(a, b) { return b.minQty - a.minQty; })[0];
  var discount = bulkTier ? (unitPrice * bulkTier.discount) / 100 : 0;
  var finalPrice = unitPrice - discount;

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
    toast.success('Added to cart!');
  };

  var handleFileChange = function(e) {
    var file = e.target.files[0];
    if (file) {
      setDesignFile(file);
      setDesignPreview(URL.createObjectURL(file));
    }
  };

  var handleRemoveDesign = function() {
    setDesignFile(null);
    setDesignPreview(null);
  };

  var imgUrl = (product.images && product.images[0] && product.images[0].url)
    || ('https://via.placeholder.com/600x600/f0efe9/888?text=' + encodeURIComponent(product.name));

  return (
    <div className="page product-detail-page">
      <div className="container">
        <div className="product-detail-grid">

          {/* Image */}
          <div className="product-detail-img-wrap">
            <img src={imgUrl} alt={product.name} className="product-detail-img" />
            {selectedColor && (
              <div className="selected-color-preview" style={{ background: selectedColor.hex }}>
                <span>{selectedColor.name}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info fade-in">
            <div className="product-detail-cat">{product.category}</div>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-desc">{product.description}</p>

            {/* Price */}
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

            {/* Colors */}
            <div className="option-group">
              <div className="option-label">
                Color: <strong>{selectedColor && selectedColor.name}</strong>
              </div>
              <div className="color-options">
                {product.colors && product.colors.map(function(c) {
                  return (
                    <button
                      key={c.hex}
                      className={'color-option' + (selectedColor && selectedColor.hex === c.hex ? ' active' : '')}
                      style={{ background: c.hex }}
                      title={c.name}
                      onClick={function() { setSelectedColor(c); }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="option-group">
              <div className="option-label">Size</div>
              <div className="size-options">
                {product.sizes && product.sizes.map(function(s) {
                  return (
                    <button
                      key={s.size}
                      className={'size-option' + (selectedSize === s.size ? ' active' : '')}
                      onClick={function() { setSelectedSize(s.size); }}
                    >
                      {s.size}
                      {s.additionalPrice > 0 && (
                        <span className="size-extra">+&#8377;{s.additionalPrice}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Print Area */}
            {product.printAreas && product.printAreas.length > 0 && (
              <div className="option-group">
                <div className="option-label">Print Area</div>
                <div className="print-area-options">
                  {product.printAreas.map(function(pa) {
                    return (
                      <button
                        key={pa.name}
                        className={'print-area-btn' + (selectedPrintArea === pa.name ? ' active' : '')}
                        onClick={function() { setSelectedPrintArea(pa.name); }}
                      >
                        {pa.name.replace('-', ' ')}
                        {pa.additionalPrice > 0 && <span> +&#8377;{pa.additionalPrice}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Design Text */}
            <div className="option-group">
              <div className="option-label">Design Text (optional)</div>
              <input
                className="input"
                placeholder="e.g. Your company name, slogan..."
                value={designText}
                onChange={function(e) { setDesignText(e.target.value); }}
              />
            </div>

            {/* Design Image Upload */}
            <div className="option-group">
              <div className="option-label">Upload Your Design Image (optional)</div>
              <div className="design-upload-wrap">
                <input
                  type="file"
                  id="design-image"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="design-image" className="design-upload-label">
                  {designPreview ? (
                    <img src={designPreview} alt="Your design" className="design-preview-img" />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '2rem' }}>&#127912;</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click to upload your design</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>PNG, JPG, PDF up to 10MB</span>
                    </div>
                  )}
                </label>
                {designPreview && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={handleRemoveDesign}
                  >
                    &#x2715; Remove Design
                  </button>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="option-group">
              <div className="option-label">Special Instructions</div>
              <textarea
                className="input"
                rows={3}
                placeholder="Describe your design, colors, placement..."
                value={designNotes}
                onChange={function(e) { setDesignNotes(e.target.value); }}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Quantity */}
            <div className="option-group">
              <div className="option-label">Quantity</div>
              <div className="qty-control">
                <button className="qty-btn" onClick={function() { setQuantity(function(q) { return Math.max(1, q - 1); }); }}>&#8722;</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={function() { setQuantity(function(q) { return q + 1; }); }}>+</button>
              </div>
              {product.bulkPricing && product.bulkPricing.length > 0 && (
                <div className="bulk-info">
                  {product.bulkPricing.map(function(b) {
                    return (
                      <span key={b.minQty} className="bulk-badge">
                        {b.minQty}+ pieces: {b.discount}% off
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="total-row">
              <div className="total-label">Total</div>
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