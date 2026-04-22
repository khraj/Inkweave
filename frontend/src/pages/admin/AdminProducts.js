import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminPages.css';

const EMPTY_PRODUCT = {
  name: '', description: '', basePrice: '', category: 'round-neck',
  colors: [{ name: 'White', hex: '#FFFFFF', stock: 50 }],
  sizes: [
    { size: 'S', additionalPrice: 0 }, { size: 'M', additionalPrice: 0 },
    { size: 'L', additionalPrice: 20 }, { size: 'XL', additionalPrice: 30 }
  ],
  printAreas: [{ name: 'front', additionalPrice: 0 }],
  customizable: true, minQuantity: 1,
  tags: ''
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=50');
      setProducts(data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ ...p, tags: p.tags?.join(', ') || '' });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), basePrice: Number(form.basePrice) };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      fetchProducts(); setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Product deactivated'); fetchProducts(); }
    catch { toast.error('Failed'); }
  };

  const handleSeed = async () => {
    try { const { data } = await api.post('/products/seed/demo'); toast.success(data.message); fetchProducts(); }
    catch { toast.error('Seed failed'); }
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
        <div className="form-panel fade-in">
          <div className="update-panel-header">
            <h3>{editProduct ? 'Edit Product' : 'New Product'}</h3>
            <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSave} className="product-form">
            <div className="form-row">
              <div className="input-group">
                <label>Product Name</label>
                <input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['round-neck','polo','v-neck','hoodie','tank-top'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Base Price (₹)</label>
                <input type="number" className="input" required value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} />
              </div>
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="input" rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <div className="input-group">
              <label>Tags (comma separated)</label>
              <input className="input" placeholder="cotton, casual, summer" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving...</> : (editProduct ? 'Update Product' : 'Create Product')}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading"><span className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Colors</th><th>Sizes</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-muted text-sm">{p.description?.slice(0, 60)}...</div>
                  </td>
                  <td><span className="badge badge-info">{p.category}</span></td>
                  <td className="font-bold">₹{p.basePrice}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {p.colors?.slice(0, 4).map(c => <span key={c.hex} style={{ width: 16, height: 16, borderRadius: '50%', background: c.hex, border: '1px solid #ddd', display: 'inline-block' }} />)}
                    </div>
                  </td>
                  <td>{p.sizes?.map(s => s.size).join(', ')}</td>
                  <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="table-empty">No products. Use "Seed Demo Products" to add sample data.</div>}
        </div>
      )}
    </div>
  );
}
