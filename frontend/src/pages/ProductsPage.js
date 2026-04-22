import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['all', 'round-neck', 'polo', 'v-neck', 'hoodie', 'tank-top'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, [category, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [category, search]);

  const setCategory = (cat) => {
    const params = {};
    if (cat !== 'all') params.category = cat;
    if (search) params.search = search;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    const params = {};
    if (category !== 'all') params.category = category;
    if (q) params.search = q;
    setSearchParams(params);
  };

  return (
    <div className="page products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">{total} products available for customization</p>
        </div>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input name="q" defaultValue={search} className="input search-input" placeholder="Search products..." />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Category filter */}
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'All Styles' : cat.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="page-info">Page {page} of {pages}</span>
            <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
