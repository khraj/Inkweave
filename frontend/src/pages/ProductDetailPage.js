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

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      setSelectedColor(data.product.colors?.[0]);
      setSelectedSize(data.product.sizes?.[0]?.size);
    }).catch(() => navigate('/products')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="page flex-center" style={{minHeight:'60vh'}}><div className="spinner" style={{width:40,height:40}} /></div>;
  if (!product) return null;

  const sizeInfo = product.sizes?.find(s => s.size === selectedSize);
  const printAreaInfo = product.printAreas?.find(p => p.name === selectedPrintArea);
  const unitPrice = product.basePrice + (sizeInfo?.additionalPrice || 0) + (printAreaInfo?.additionalPrice || 0);
  
  const bulkTier = product.bulkPricing?.filter(b => quantity >= b.minQty).sort((a, b) => b.minQty - a.minQty)[0];
  const discount = bulkTier ? (unitPrice * bulkTier.discount) / 100 : 0;
  const finalPrice = unitPrice - discount;

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Please select a size');
    if (!selectedColor) return toast.error('Please select a color');
    addToCart({
      product: product._id,
      productName: product.name,
      productImage: product.images?.[0]?.url,
      size: selectedSize,
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      customization: { designText, printArea: selectedPrintArea, notes: designNotes },
      unitPrice: finalPrice,
      quantity,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="page product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img-wrap">
            <img
              src={product.images?.[0]?.url || `https://via.placeholder.com/600x600/f0efe9/888?text=${encodeURIComponent(product.name)}`}
              alt={product.name} className="product-detail-img"
            />
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
              <div className="price-main">₹{finalPrice.toFixed(0)}</div>
              {discount > 0 && (
                <div className="price-discount-info">
                  <span className="price-original">₹{unitPrice.toFixed(0)}</span>
                  <span className="discount-badge">{bulkTier.discount}% bulk off</span>
                </div>
              )}
              <div className="price-note">Per piece · Inclusive of printing</div>
            </div>

            {/* Colors */}
            <div className="option-group">
              <div className="option-label">Color: <strong>{selectedColor?.name}</strong></div>
              <div className="color-options">
                {product.colors?.map(c => (
                  <button
                    key={c.hex}
                    className={`color-option ${selectedColor?.hex === c.hex ? 'active' : ''}`}
                    style={{ background: c.hex }}
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="option-group">
              <div className="option-label">Size</div>
              <div className="size-options">
                {product.sizes?.map(s => (
                  <button
                    key={s.size}
                    className={`size-option ${selectedSize === s.size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s.size)}
                  >
                    {s.size}
                    {s.additionalPrice > 0 && <span className="size-extra">+₹{s.additionalPrice}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Area */}
            {product.printAreas?.length > 0 && (
              <div className="option-group">
                <div className="option-label">Print Area</div>
                <div className="print-area-options">
                  {product.printAreas.map(pa => (
                    <button
                      key={pa.name}
                      className={`print-area-btn ${selectedPrintArea === pa.name ? 'active' : ''}`}
                      onClick={() => setSelectedPrintArea(pa.name)}
                    >
                      {pa.name.replace('-', ' ')}
                      {pa.additionalPrice > 0 && <span> +₹{pa.additionalPrice}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization */}
            <div className="option-group">
              <div className="option-label">Design Text (optional)</div>
              <input
                className="input" placeholder="e.g. Your company name, slogan..."
                value={designText} onChange={e => setDesignText(e.target.value)}
              />
            </div>
            <div className="option-group">
              <div className="option-label">Special Instructions</div>
              <textarea
                className="input" rows={3} placeholder="Describe your design, colors, placement..."
                value={designNotes} onChange={e => setDesignNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Quantity */}
            <div className="option-group">
              <div className="option-label">Quantity</div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              {product.bulkPricing?.length > 0 && (
                <div className="bulk-info">
                  {product.bulkPricing.map(b => (
                    <span key={b.minQty} className="bulk-badge">
                      {b.minQty}+ pieces: {b.discount}% off
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Total + Add to cart */}
            <div className="total-row">
              <div className="total-label">Total</div>
              <div className="total-val">₹{(finalPrice * quantity).toFixed(0)}</div>
            </div>
            <button className="btn btn-primary btn-lg add-cart-btn" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
