import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import api from '../../api/axios';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import './ShopPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const page = parseInt(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const isFeatured = searchParams.get('isFeatured') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const isBestSeller = searchParams.get('isBestSeller') || '';

  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('minRating', minRating);
      if (isFeatured) params.set('isFeatured', isFeatured);
      if (isNewArrival) params.set('isNewArrival', isNewArrival);
      if (isBestSeller) params.set('isBestSeller', isBestSeller);

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } catch {
      setProducts(generateSampleProducts());
      setTotal(8);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, category, minPrice, maxPrice, minRating, isFeatured, isNewArrival, isBestSeller]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearAllFilters = () => setSearchParams(new URLSearchParams());

  const activeFiltersCount = [category, minPrice, maxPrice, minRating, isFeatured, isNewArrival, isBestSeller]
    .filter(Boolean).length;

  const pageTitle = search
    ? `Results for "${search}"`
    : isFeatured ? 'Featured Products'
    : isNewArrival ? 'New Arrivals'
    : isBestSeller ? 'Best Sellers'
    : 'All Products';

  return (
    <div className="shop-page page-fade" style={{ paddingTop: 'var(--navbar-h)' }}>
      {/* Page Header */}
      <div className="shop-header">
        <div className="container">
          <h1 className="shop-title">{pageTitle}</h1>
          <p className="shop-count">{loading ? '...' : `${total} products`}</p>
        </div>
      </div>

      <div className="container shop-layout">
        {/* ── SIDEBAR FILTERS ─────────────────────────── */}
        <aside className={`shop-filters ${filtersOpen ? 'open' : ''}`}>
          <div className="shop-filters__header">
            <h3>Filters</h3>
            {activeFiltersCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearAllFilters}>
                Clear all ({activeFiltersCount})
              </button>
            )}
            <button className="shop-filters__close" onClick={() => setFiltersOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {/* Category */}
          <FilterSection title="Category" defaultOpen>
            <div className="filter-list">
              <label className={`filter-option ${!category ? 'active' : ''}`}>
                <input type="radio" name="cat" checked={!category} onChange={() => updateParam('category', '')} />
                All Categories
              </label>
              {categories.map((c) => (
                <label key={c._id} className={`filter-option ${category === c.slug ? 'active' : ''}`}>
                  <input type="radio" name="cat" checked={category === c.slug} onChange={() => updateParam('category', c.slug)} />
                  {c.name}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="price-range">
              <div className="price-range__inputs">
                <input
                  type="number"
                  placeholder="Min"
                  className="form-input"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                  onBlur={() => updateParam('minPrice', priceRange.min)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="form-input"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                  onBlur={() => updateParam('maxPrice', priceRange.max)}
                />
              </div>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Min Rating">
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className={`filter-option ${minRating === String(r) ? 'active' : ''}`}>
                <input type="radio" name="rating" checked={minRating === String(r)} onChange={() => updateParam('minRating', r)} />
                {'★'.repeat(r)}{'☆'.repeat(5 - r)} & up
              </label>
            ))}
          </FilterSection>

          {/* Collections */}
          <FilterSection title="Collections">
            {[
              { key: 'isFeatured', val: isFeatured, label: '✦ Featured' },
              { key: 'isNewArrival', val: isNewArrival, label: '🆕 New Arrivals' },
              { key: 'isBestSeller', val: isBestSeller, label: '🔥 Best Sellers' },
            ].map(({ key, val, label }) => (
              <label key={key} className={`filter-option ${val ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!val}
                  onChange={(e) => updateParam(key, e.target.checked ? 'true' : '')}
                />
                {label}
              </label>
            ))}
          </FilterSection>
        </aside>

        {/* Mobile filter backdrop */}
        {filtersOpen && (
          <div className="shop-filters__backdrop" onClick={() => setFiltersOpen(false)} />
        )}

        {/* ── PRODUCTS AREA ──────────────────────────── */}
        <div className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <button className="btn btn-outline btn-sm shop-filter-toggle" onClick={() => setFiltersOpen(true)}>
              <FiSliders size={16} />
              Filters
              {activeFiltersCount > 0 && <span className="badge badge-primary">{activeFiltersCount}</span>}
            </button>

            <div className="shop-toolbar__right">
              <select
                className="form-input form-select shop-sort"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <div className="shop-view-toggle">
                <button
                  className={`shop-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  className={`shop-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="shop-active-filters">
              {search && <FilterChip label={`"${search}"`} onRemove={() => updateParam('search', '')} />}
              {category && <FilterChip label={category} onRemove={() => updateParam('category', '')} />}
              {minPrice && <FilterChip label={`From ৳${minPrice}`} onRemove={() => { updateParam('minPrice', ''); setPriceRange(p => ({ ...p, min: '' })); }} />}
              {maxPrice && <FilterChip label={`To ৳${maxPrice}`} onRemove={() => { updateParam('maxPrice', ''); setPriceRange(p => ({ ...p, max: '' })); }} />}
              {minRating && <FilterChip label={`${minRating}★ & up`} onRemove={() => updateParam('minRating', '')} />}
              {isFeatured && <FilterChip label="Featured" onRemove={() => updateParam('isFeatured', '')} />}
              {isNewArrival && <FilterChip label="New Arrivals" onRemove={() => updateParam('isNewArrival', '')} />}
              {isBestSeller && <FilterChip label="Best Sellers" onRemove={() => updateParam('isBestSeller', '')} />}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className={`products-grid ${viewMode === 'list' ? 'products-list' : ''}`}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--r-xl)' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <p>🔍</p>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="btn btn-primary" onClick={clearAllFilters}>Clear Filters</button>
            </div>
          ) : (
            <motion.div
              className={`products-grid ${viewMode === 'list' ? 'products-list' : ''}`}
              layout
            >
              <AnimatePresence>
                {products.map((p, i) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="shop-pagination">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  className={`shop-page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => updateParam('page', i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helpers
const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section__header" onClick={() => setOpen(!open)}>
        {title}
        <FiChevronDown className={`filter-chevron ${open ? 'open' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="filter-section__body"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <span className="filter-chip">
    {label}
    <button onClick={onRemove}><FiX size={12} /></button>
  </span>
);

const generateSampleProducts = () => Array.from({ length: 8 }, (_, i) => ({
  _id: `sample-${i}`,
  name: ['Luxury Silk Blouse', 'Premium Leather Jacket', 'Diamond Watch', 'Cashmere Sweater', 'Designer Handbag', 'Vintage Sunglasses', 'Running Sneakers', 'Minimalist Tote'][i],
  slug: `sample-${i}`,
  price: [89.99, 299.99, 499.99, 149.99, 399.99, 129.99, 179.99, 69.99][i],
  comparePrice: [129.99, 399.99, 699.99, 199.99, 549.99, 179.99, 229.99, 99.99][i],
  images: [{ url: `https://images.unsplash.com/photo-${['1558769132-cb1aea458c5e', '1551028719-00167b16eac5', '1523275335684-37898b6baf30', '1434389677669-e08b4cac3105', '1553062407-98eeb64c6a62', '1572635196237-14b3f281503f', '1542291026-7eec264c27ff', '1544716278-ca5e3f4abd8c'][i]}?w=400&auto=format&fit=crop&q=80` }],
  ratings: 4 + Math.random(),
  numReviews: Math.floor(Math.random() * 200),
  isFeatured: true,
  isNewArrival: i < 4,
  isBestSeller: i >= 4,
  stock: 50,
}));

export default ShopPage;
