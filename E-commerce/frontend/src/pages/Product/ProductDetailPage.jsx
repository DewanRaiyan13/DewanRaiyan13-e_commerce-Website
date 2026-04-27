import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import api from '../../api/axios';
import { addToCart } from '../../app/slices/cartSlice';
import './ProductDetailPage.css';

const getDemoProduct = (slug) => ({
  _id: 'demo', name: 'Premium Luxury Item', slug, price: 299.99, comparePrice: 399.99,
  description: 'Experience unparalleled luxury with this premium product. Crafted from the finest materials, combining timeless elegance with modern sophistication.',
  shortDescription: 'Premium quality, timeless design.', brand: 'DoneShop Exclusive',
  ratings: 4.8, numReviews: 124, reviews: [], stock: 10, variants: [],
  specifications: [{ key: 'Material', value: 'Premium Quality' }, { key: 'Warranty', value: '1 Year' }],
  images: [
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop' },
  ],
});

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setProduct(getDemoProduct(slug)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--navbar-h)' }}><div className="spinner" style={{ width: 48, height: 48 }} /></div>;
  if (!product) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--navbar-h)' }}><button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button></div>;

  const { name, price, comparePrice, images = [], description, shortDescription, ratings, numReviews, reviews = [], variants = [], stock, brand, specifications = [] } = product;
  const discountPct = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];

  return (
    <div className="product-detail page-fade" style={{ paddingTop: 'var(--navbar-h)' }}>
      <div className="container">
        <nav className="breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/shop">Shop</a> <span>/</span> <span>{name}</span></nav>
        <div className="product-detail__grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__thumbnails">
              {images.map((img, i) => (
                <button key={i} className={`product-gallery__thumb ${i === mainImg ? 'active' : ''}`} onClick={() => setMainImg(i)}>
                  <img src={img.url} alt={`${name} ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="product-gallery__main">
              <AnimatePresence mode="wait">
                <motion.img key={mainImg} src={images[mainImg]?.url || 'https://via.placeholder.com/600'} alt={name} className="product-gallery__img"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
              </AnimatePresence>
              {discountPct > 0 && <div className="product-gallery__badge badge badge-sale">-{discountPct}%</div>}
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            {brand && <p className="product-info__brand">{brand}</p>}
            <h1 className="product-info__name">{name}</h1>
            <div className="product-info__rating">
              <div className="stars">
                {[1,2,3,4,5].map((s) => <FiStar key={s} size={16} fill={s <= Math.round(ratings) ? '#f59e0b' : 'none'} stroke={s <= Math.round(ratings) ? '#f59e0b' : '#64748b'} />)}
              </div>
              <span className="product-info__rating-val">{ratings?.toFixed(1)}</span>
              <span className="product-info__reviews">({numReviews} reviews)</span>
            </div>
            <div className="product-info__price-block">
              <span className="product-info__price">৳{price?.toFixed(2)}</span>
              {comparePrice > price && <span className="product-info__compare">৳{comparePrice?.toFixed(2)}</span>}
              {discountPct > 0 && <span className="badge badge-sale">Save {discountPct}%</span>}
            </div>
            <p className="product-info__short">{shortDescription || description?.slice(0, 150)}</p>
            <div className="product-info__divider" />

            {sizes.length > 0 && (
              <div className="product-info__option">
                <p className="product-info__option-label">Size</p>
                <div className="product-info__sizes">
                  {sizes.map((s) => (
                    <button key={s} className={`size-btn ${selectedVariant?.size === s ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variants.find(v => v.size === s) || null)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-info__option">
              <p className="product-info__option-label">Quantity</p>
              <div className="product-info__qty">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><FiMinus size={16} /></button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(Math.min(stock, qty + 1))}><FiPlus size={16} /></button>
                <span className="product-info__stock">{stock > 0 ? `${stock} in stock` : 'Out of Stock'}</span>
              </div>
            </div>

            <div className="product-info__actions">
              <button className="btn btn-primary btn-xl" onClick={() => dispatch(addToCart({ product, quantity: qty, variant: selectedVariant }))} disabled={stock === 0}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-gold btn-xl" onClick={() => { dispatch(addToCart({ product, quantity: qty })); navigate('/checkout'); }} disabled={stock === 0}>
                Buy Now
              </button>
              <button className={`btn btn-outline btn-icon${wishlisted ? ' wishlisted' : ''}`} style={{ width: 52, height: 52 }} onClick={() => setWishlisted(!wishlisted)}>
                <FiHeart size={20} fill={wishlisted ? '#ef4444' : 'none'} stroke={wishlisted ? '#ef4444' : 'currentColor'} />
              </button>
            </div>

            <div className="product-trust">
              {[{ icon: <FiTruck />, text: 'Free shipping over ৳100' }, { icon: <FiShield />, text: 'Secure checkout' }, { icon: <FiRefreshCw />, text: '30-day returns' }]
                .map(({ icon, text }) => <div key={text} className="product-trust__item">{icon} {text}</div>)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="product-tabs__nav">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button key={tab} className={`product-tabs__tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === 'reviews' && ` (${numReviews})`}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} className="product-tabs__content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {activeTab === 'description' && <div className="product-description"><p>{description}</p></div>}
              {activeTab === 'specifications' && (
                <div className="product-specs">
                  {specifications.length > 0 ? specifications.map(({ key, value }) => (
                    <div key={key} className="product-specs__row"><span className="product-specs__key">{key}</span><span className="product-specs__val">{value}</span></div>
                  )) : <p style={{ color: 'var(--clr-text-3)' }}>No specifications available.</p>}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="product-reviews">
                  {reviews.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--clr-text-3)', padding: 'var(--sp-8)' }}>No reviews yet.</p> :
                    reviews.map((r) => (
                      <div key={r._id} className="review-card glass-card">
                        <div className="review-card__header">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.name}`} alt={r.name} className="review-card__avatar" />
                          <div><p className="review-card__name">{r.name}</p>
                            <div className="stars">{[1,2,3,4,5].map((s) => <FiStar key={s} size={12} fill={s <= r.rating ? '#f59e0b' : 'none'} stroke={s <= r.rating ? '#f59e0b' : '#64748b'} />)}</div>
                          </div>
                          <span className="review-card__date">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="review-card__comment">{r.comment}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;
