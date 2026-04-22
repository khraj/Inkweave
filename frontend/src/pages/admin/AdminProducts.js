import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminPages.css';
 
const DEFAULT_COLORS = [
  { name: 'White', hex: '#FFFFFF', stock: 50 },
  { name: 'Black', hex: '#000000', stock: 50 },
  { name: 'Navy Blue', hex: '#1a237e', stock: 50 },
  { name: 'Red', hex: '#c62828', stock: 50 },
  { name: 'Royal Blue', hex: '#1565c0', stock: 50 },
  { name: 'Grey', hex: '#9e9e9e', stock: 50 },
  { name: 'Green', hex: '#2e7d32', stock: 50 },
  { name: 'Yellow', hex: '#f9a825', stock: 50 },
  { name: 'Maroon', hex: '#880e4f', stock: 50 },
  { name: 'Orange', hex: '#e65100', stock: 50 },
];
 
const DEFAULT_SIZES = [
  { size: 'XS', additionalPrice: 0 },
  { size: 'S', additionalPrice: 0 },
  { size: 'M', additionalPrice: 0 },
  { size: 'L', additionalPrice: 20 },
  { size: 'XL', additionalPrice: 30 },
  { size: 'XXL', additionalPrice: 50 },
];
 
const DEFAULT_PRINT_AREAS = [
  { name: 'front', additionalPrice: 0 },
  { name: 'back', additionalPrice: 50 },
  { name: 'left-sleeve', additionalPrice: 30 },
  { name: 'right-sleeve', additionalPrice: 30 },
];
 
const EMPTY_PRODUCT = {
  name: '',
  description: '',
  basePrice: '',
  category: 'round-neck',
  colors: [
    { name: 'White', hex: '#FFFFFF', stock: 50 },
    { name: 'Black', hex: '#000000', stock: 50 },
  ],
  sizes: DEFAULT_SIZES,
  printAreas: DEFAULT_PRINT_AREAS,
  customizable: true,
  minQuantity: 1,
  tags: '',
  imageUrls: '',
};
 
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
 
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=50');
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
 
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      ...p,
      tags: p.tags ? p.tags.join(', ') : '',
      imageUrls: p.images ? p.images.map(i => i.url).join(', ') : '',
    });
    setImageFiles([]);
    setImagePreviews(p.images ? p.images.map(i => i.url) : []);
    setShowForm(true);
  };
 
  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setImageFiles([]);
    setImagePreviews([]);
    setShowForm(true);
  };
 
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(files);
    const previews = new Array(files.length).fill(null);
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        previews[idx] = ev.target.result;
        if (previews.every(function(p) { return p !== null; })) {
          setImagePreviews(previews.slice());
        }
      };
      reader.readAsDataURL(file);
    });
  };
 
  const removePreview = (index) => {
    setImagePreviews(function(prev) { return prev.filter(function(_, i) { return i !== index; }); });
    setImageFiles(function(prev) { return prev.filter(function(_, i) { return i !== index; }); });
  };
 
  const toggleColor = (color) => {
    const exists = form.colors.find(function(c) { return c.hex === color.hex; });
    if (exists) {
      if (form.colors.length === 1) { toast.error('At least one color required'); return; }
      setForm({ ...form, colors: form.colors.filter(function(c) { return c.hex !== color.hex; }) });
    } else {
      setForm({ ...form, colors: [...form.colors, Object.assign({}, color)] });
    }
  };
 
  const toggleSize = (size) => {
    const exists = form.sizes.find(function(s) { return s.size === size.size; });
    if (exists) {
      if (form.sizes.length === 1) { toast.error('At least one size required'); return; }
      setForm({ ...form, sizes: form.sizes.filter(function(s) { return s.size !== size.size; }) });
    } else {
      setForm({ ...form, sizes: [...form.sizes, Object.assign({}, size)] });
    }
  };
 
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('basePrice', form.basePrice);
      formData.append('category', form.category);
      formData.append('customizable', form.customizable);
      formData.append('minQuantity', form.minQuantity || 1);
      formData.append('tags', form.tags);
      formData.append('colors', JSON.stringify(form.colors));
      formData.append('sizes', JSON.stringify(form.sizes));
      formData.append('printAreas', JSON.stringify(form.printAreas));
 
      if (imageFiles.length > 0) {
        imageFiles.forEach(function(file) { formData.append('images', file); });
      } else if (form.imageUrls && form.imageUrls.trim()) {
        formData.append('imageUrls', form.imageUrls);
      }
 
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
 
      if (editProduct) {
        await api.put('/products/' + editProduct._id, formData, config);
        toast.success('Product updated!');
      } else {
        await api.post('/products', formData, config);
        toast.success('Product created!');
      }
      fetchProducts();
      setShowForm(false);
    } catch (err) {
      toast.error((err.response && err.response.data && err.response.data.message) || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await api.delete('/products/' + id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch (err) {
      toast.error('Failed');
    }
  };
 
  const handleSeed = async () => {
    try {
      const { data } = await api.post('/products/seed/demo');
      toast.success(data.message);
      fetchProducts();
    } catch (err) {
      toast.error('Seed failed');
    }
  };
 
  return (
    <div className="admin-section fade-in">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Manage Products</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={handleSeed}>Seed Demo Products</button>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Product</button>
        </div>
      </div>
 
      {showForm && (
        <div className="form-panel fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="update-panel-header">
            <h3>{editProduct ? 'Edit Product' : 'New Product'}</h3>
            <button className="close-btn" onClick={() => setShowForm(false)}>&#x2715;</button>
          </div>
 
          <form onSubmit={handleSave} className="product-form">
 
            <div className="form-row-3">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Classic Round Neck"
                  value={form.name}
                  onChange={function(e) { setForm({ ...form, name: e.target.value }); }}
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={function(e) { setForm({ ...form, category: e.target.value }); }}
                >
                  <option value="round-neck">Round Neck</option>
                  <option value="polo">Polo</option>
                  <option value="v-neck">V-Neck</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="tank-top">Tank Top</option>
                </select>
              </div>
              <div className="input-group">
                <label>Base Price (&#8377;)</label>
                <input
                  type="number"
                  className="input"
                  required
                  placeholder="e.g. 299"
                  min="1"
                  value={form.basePrice}
                  onChange={function(e) { setForm({ ...form, basePrice: e.target.value }); }}
                />
              </div>
            </div>
 
            <div className="input-group">
              <label>Description</label>
              <textarea
                className="input"
                rows={3}
                required
                placeholder="Describe the product, material, GSM..."
                value={form.description}
                onChange={function(e) { setForm({ ...form, description: e.target.value }); }}
                style={{ resize: 'vertical' }}
              />
            </div>
 
            <div className="input-group">
              <label>Tags <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>- comma separated</span></label>
              <input
                className="input"
                placeholder="cotton, casual, summer, unisex"
                value={form.tags}
                onChange={function(e) { setForm({ ...form, tags: e.target.value }); }}
              />
            </div>
 
            <div className="input-group">
              <label>Available Colors <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>- click to toggle</span></label>
              <div className="color-picker-grid">
                {DEFAULT_COLORS.map(function(color) {
                  const selected = form.colors.find(function(c) { return c.hex === color.hex; });
                  return (
                    <div
                      key={color.hex}
                      className={selected ? 'color-picker-item selected' : 'color-picker-item'}
                      onClick={function() { toggleColor(color); }}
                    >
                      <div className="color-swatch" style={{ background: color.hex }} />
                      <span className="color-name">{color.name}</span>
                      {selected ? <span className="color-check">&#10003;</span> : null}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
                Selected: {form.colors.map(function(c) { return c.name; }).join(', ')}
              </div>
            </div>
 
            <div className="input-group">
              <label>Available Sizes <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>- click to toggle</span></label>
              <div className="size-picker-grid">
                {DEFAULT_SIZES.map(function(s) {
                  const selected = form.sizes.find(function(sz) { return sz.size === s.size; });
                  return (
                    <div
                      key={s.size}
                      className={selected ? 'size-picker-item selected' : 'size-picker-item'}
                      onClick={function() { toggleSize(s); }}
                    >
                      {s.size}
                    </div>
                  );
                })}
              </div>
            </div>
 
            <div className="input-group">
              <label>Product Images</label>
              <div className="image-upload-box">
                <input
                  type="file"
                  id="product-images"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="product-images" className="image-upload-label">
                  <span className="upload-icon">&#128444;</span>
                  <span className="upload-text">Click to upload images from your computer</span>
                  <span className="upload-hint">PNG, JPG, WEBP - up to 5MB each. Multiple allowed.</span>
                </label>
              </div>
 
              <div className="image-url-row">
                <span className="or-divider">- or paste image URLs instead -</span>
                <input
                  className="input"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  value={form.imageUrls}
                  onChange={function(e) {
                    setForm({ ...form, imageUrls: e.target.value });
                    if (e.target.value.trim()) {
                      setImageFiles([]);
                      setImagePreviews([]);
                    }
                  }}
                />
              </div>
 
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map(function(src, i) {
                    return (
                      <div key={i} className="image-preview-item">
                        <img src={src} alt={'preview ' + (i + 1)} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={function() { removePreview(i); }}
                        >
                          &#x2715;
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
 
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (editProduct ? 'Update Product' : '+ Create Product')}
              </button>
              <button type="button" className="btn btn-outline" onClick={function() { setShowForm(false); }}>
                Cancel
              </button>
            </div>
 
          </form>
        </div>
      )}
 
      {loading ? (
        <div className="admin-loading">
          <span className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Colors</th>
                <th>Sizes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(function(p) {
                return (
                  <tr key={p._id}>
                    <td>
                      {p.images && p.images[0] && p.images[0].url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--paper-off)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          &#128085;
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-muted text-sm">{p.description ? p.description.slice(0, 50) + '...' : ''}</div>
                    </td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td className="font-bold">&#8377;{p.basePrice}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        {p.colors && p.colors.slice(0, 5).map(function(c) {
                          return (
                            <span
                              key={c.hex}
                              title={c.name}
                              style={{ width: 18, height: 18, borderRadius: '50%', background: c.hex, border: '1px solid #ddd', display: 'inline-block' }}
                            />
                          );
                        })}
                        {p.colors && p.colors.length > 5 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>+{p.colors.length - 5}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{p.sizes ? p.sizes.map(function(s) { return s.size; }).join(', ') : ''}</td>
                    <td>
                      <span className={p.isActive ? 'badge badge-success' : 'badge badge-danger'}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={function() { openEdit(p); }}>Edit</button>
                        <button
                          className="btn btn-sm"
                          style={{ background: '#fee2e2', color: '#991b1b' }}
                          onClick={function() { handleDelete(p._id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="table-empty">
              No products yet. Click <strong>Seed Demo Products</strong> to add sample data or <strong>+ Add Product</strong> to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}