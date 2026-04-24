import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './ProductsPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'round-neck', label: 'Round Neck' },
  { id: 'polo', label: 'Polo' },
  { id: 'v-neck', label: 'V-Neck' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'tank-top', label: 'Tank Top' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async function() {
    setLoading(true);
    try {
      var params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', 12);
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      var res = await api.get('/products?' + params.toString());
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  // Re-fetch whenever category, search or page changes
  useEffect(function() {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(function() {
    setPage(1);
  }, [category, search]);

  // Sync search input with URL param
  useEffect(function() {
    setSearchInput(search);
  }, [search]);

  var setCategory = function(cat) {
    var params = {};
    if (cat !== 'all') params.category = cat;
    if (search) params.search = search;
    setSearchParams(params);
  };

  var handleSearch = function(e) {
    e.preventDefault();
    var q = searchInput.trim();
    var params = {};
    if (category !== 'all') params.category = category;
    if (q) params.search = q;
    setSearchParams(params);
  };

  var handleClearSearch = function() {
    setSearchInput('');
    var params = {};
    if (category !== 'all') params.category = category;
    setSearchParams(params);
  };

  return (
    <div className="page products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {category !== 'all'
              ? category.replace('-', ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); })
              : 'All Products'
            }
          </h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : total + ' product' + (total !== 1 ? 's' : '') + ' available for customization'}
          </p>
        </div>

        {/* Search bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            name="q"
            className="input search-input"
            placeholder="Search products..."
            value={searchInput}
            onChange={function(e) { setSearchInput(e.target.value); }}
          />
          {searchInput && (
            <button type="button" className="btn btn-outline" onClick={handleClearSearch}>
              Clear
            </button>
          )}
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Category filters */}
        <div className="category-filters">
          {CATEGORIES.map(function(cat) {
            return (
              <button
                key={cat.id}
                className={'filter-btn' + (category === cat.id ? ' active' : '')}
                onClick={function() { setCategory(cat.id); }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(function(i) {
              return <div key={i} className="skeleton-card" />;
            })}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No products found</h3>
            <p>
              {search
                ? 'No results for "' + search + '". Try a different search.'
                : 'No products in this category yet.'
              }
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn btn-outline" onClick={function() { setSearchParams({}); }}>
                View All Products
              </button>
              {/* Only show seed button if no products at all */}
              {total === 0 && category === 'all' && !search && (
                <button
                  className="btn btn-primary"
                  onClick={async function() {
                    try {
                      await api.post('/products/seed/demo');
                      fetchProducts();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  Load Demo Products
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(function(p) {
              return <ProductCard key={p._id} product={p} />;
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="pagination">
            <button
              className="btn btn-outline btn-sm"
              disabled={page === 1}
              onClick={function() { setPage(function(p) { return p - 1; }); }}
            >
              ← Prev
            </button>
            <span className="page-info">Page {page} of {pages}</span>
            <button
              className="btn btn-outline btn-sm"
              disabled={page === pages}
              onClick={function() { setPage(function(p) { return p + 1; }); }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}