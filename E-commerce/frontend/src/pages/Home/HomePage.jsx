import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiStar, FiShoppingBag, FiTruck, FiShield, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../api/axios';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import './HomePage.css';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'New Collection 2025',
    title: 'Elevate Your\nStyle Game',
    subtitle: 'Discover curated luxury fashion that speaks to your soul. Premium pieces for the discerning individual.',
    cta: 'Shop Now',
    ctaLink: '/shop',
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0a0a0f 100%)',
    accent: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    tag: 'Exclusive Deals',
    title: 'Up to 60% Off\nPremium Brands',
    subtitle: 'Limited time offers on world-class products. Shop before they\'re gone.',
    cta: 'View Deals',
    ctaLink: '/shop?sort=price_asc',
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #330d1a 50%, #0a0a0f 100%)',
    accent: '#ec4899',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    tag: 'Best Sellers',
    title: 'Most Loved\nProducts',
    subtitle: 'Handpicked by our community. The products everyone can\'t stop talking about.',
    cta: 'Explore',
    ctaLink: '/shop?isBestSeller=true',
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #1a2a0f 50%, #0a0a0f 100%)',
    accent: '#10b981',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  },
];

const FEATURES = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On all orders over ৳100', color: '#7c3aed' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure transactions', color: '#10b981' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy', color: '#f59e0b' },
  { icon: <FiStar />, title: 'Premium Quality', desc: 'Curated luxury products', color: '#ec4899' },
];

const CATEGORIES = [
  { name: "Women's Fashion", slug: 'womens-fashion', emoji: '👗', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80' },
  { name: "Men's Fashion", slug: 'mens-fashion', emoji: '👔', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80' },
  { name: 'Electronics', slug: 'electronics', emoji: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=80' },
  { name: 'Home & Living', slug: 'home-living', emoji: '🏠', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80' },
  { name: 'Sports', slug: 'sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&auto=format&fit=crop&q=80' },
  { name: 'Beauty', slug: 'beauty', emoji: '💄', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80' },
];

const STATS = [
  { value: '500K+', label: 'Happy Customers' },
  { value: '50K+', label: 'Products' },
  { value: '120+', label: 'Brands' },
  { value: '4.9★', label: 'Average Rating' },
];

const HomePage = () => {
  const [heroSlide, setHeroSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-advance hero
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [feat, newArr, best] = await Promise.all([
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?isNewArrival=true&limit=8'),
          api.get('/products?isBestSeller=true&limit=8'),
        ]);
        setFeaturedProducts(feat.data.products || []);
        setNewArrivals(newArr.data.products || []);
        setBestSellers(best.data.products || []);
      } catch (err) {
        // Use sample data if API fails
        const sample = generateSampleProducts();
        setFeaturedProducts(sample);
        setNewArrivals(sample.slice(4));
        setBestSellers(sample.slice(2, 6));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const slide = HERO_SLIDES[heroSlide];

  return (
    <div className="home-page">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero" ref={heroRef} style={{ background: slide.bg }}>
        <div className="hero__bg-glow" style={{ background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${slide.accent}33, transparent)` }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlide}
            className="container hero__inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="hero__content"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <span className="hero__tag">
                <span className="hero__tag-dot" style={{ background: slide.accent }} />
                {slide.tag}
              </span>
              <h1 className="hero__title" style={{ '--accent': slide.accent }}>
                {slide.title.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </h1>
              <p className="hero__subtitle">{slide.subtitle}</p>
              <div className="hero__actions">
                <Link to={slide.ctaLink} className="btn btn-primary btn-xl">
                  {slide.cta} <FiArrowRight />
                </Link>
                <Link to="/shop" className="btn btn-outline btn-xl">
                  Browse All
                </Link>
              </div>

              {/* Stats */}
              <div className="hero__stats">
                {STATS.map((s) => (
                  <div key={s.label} className="hero__stat">
                    <span className="hero__stat-value">{s.value}</span>
                    <span className="hero__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="hero__image-wrap"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="hero__image-frame">
                <img src={slide.image} alt="Hero" className="hero__image" loading="eager" />
                <div className="hero__image-glow" style={{ background: slide.accent }} />
              </div>

              {/* Floating badges */}
              <motion.div
                className="hero__float-badge"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                style={{ top: '15%', right: '-10%' }}
              >
                <FiShoppingBag />
                <div>
                  <p className="hero__float-value">50K+</p>
                  <p className="hero__float-label">Products</p>
                </div>
              </motion.div>

              <motion.div
                className="hero__float-badge"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                style={{ bottom: '20%', left: '-10%' }}
              >
                <FiStar style={{ color: '#f59e0b' }} />
                <div>
                  <p className="hero__float-value">4.9/5</p>
                  <p className="hero__float-label">Rating</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Navigation */}
        <div className="hero__nav">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__nav-dot ${i === heroSlide ? 'active' : ''}`}
              onClick={() => setHeroSlide(i)}
            />
          ))}
        </div>

        <button className="hero__arrow hero__arrow--left" onClick={() => setHeroSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>
          <FiChevronLeft size={20} />
        </button>
        <button className="hero__arrow hero__arrow--right" onClick={() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length)}>
          <FiChevronRight size={20} />
        </button>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="features-bar section-sm">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-card__icon" style={{ color: f.color, background: `${f.color}18` }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tag">✦ Browse by Category</p>
            <h2 className="section-title">Shop Your Style</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Explore our curated collections across every lifestyle.
            </p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`category-card ${i === 0 ? 'category-card--large' : ''}`}
              >
                <Link to={`/shop?category=${cat.slug}`} className="category-card__link">
                  <img src={cat.image} alt={cat.name} className="category-card__img" loading="lazy" />
                  <div className="category-card__overlay" />
                  <div className="category-card__content">
                    <span className="category-card__emoji">{cat.emoji}</span>
                    <h3 className="category-card__name">{cat.name}</h3>
                    <p className="category-card__cta">Shop Now <FiArrowRight size={14} /></p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--clr-bg-2)' }}>
        <div className="container">
          <div className="section-header flex items-center justify-between">
            <div>
              <p className="section-tag">✦ Featured Collection</p>
              <h2 className="section-title">Hand-Picked For You</h2>
            </div>
            <Link to="/shop?isFeatured=true" className="btn btn-outline">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <EmptyProductsPlaceholder />
          )}
        </div>
      </section>

      {/* ── PROMO BANNER ──────────────────────────────────── */}
      <section className="promo-banner">
        <div className="container">
          <motion.div
            className="promo-card"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="promo-card__content">
              <span className="promo-card__tag">⚡ Limited Time Offer</span>
              <h2 className="promo-card__title">Summer Sale<br />Up to 60% Off</h2>
              <p className="promo-card__subtitle">Shop the biggest sale of the year. Premium brands, unbeatable prices.</p>
              <Link to="/shop?sort=price_asc" className="btn btn-gold btn-lg">
                Shop the Sale <FiArrowRight />
              </Link>
            </div>
            <div className="promo-card__visual">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80"
                alt="Sale"
                className="promo-card__img"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header flex items-center justify-between">
            <div>
              <p className="section-tag">✦ Fresh Drop</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop?isNewArrival=true" className="btn btn-outline">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="products-grid">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <EmptyProductsPlaceholder />
          )}
        </div>
      </section>

      {/* ── BEST SELLERS ──────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--clr-bg-2)' }}>
        <div className="container">
          <div className="section-header flex items-center justify-between">
            <div>
              <p className="section-tag">✦ Community Favorites</p>
              <h2 className="section-title">Best Sellers 🔥</h2>
            </div>
            <Link to="/shop?isBestSeller=true" className="btn btn-outline">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : bestSellers.length > 0 ? (
            <div className="products-grid">
              {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <EmptyProductsPlaceholder />
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────── */}
      <section className="newsletter-section section">
        <div className="container">
          <motion.div
            className="newsletter-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-card__content">
              <h2 className="newsletter-card__title">Stay in the Loop</h2>
              <p className="newsletter-card__sub">Get exclusive deals, new arrivals, and insider tips delivered straight to your inbox.</p>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); }}>
                <input type="email" placeholder="Enter your email address" className="form-input newsletter-input" required />
                <button type="submit" className="btn btn-primary">
                  Subscribe <FiArrowRight />
                </button>
              </form>
              <p className="newsletter-card__note">No spam. Unsubscribe anytime. 🔒</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <Link to="/" className="footer__logo"><img src="/companylogo.png" alt="DoneShop" className="auth-logo-img" style={{ height: "70px", marginBottom: "1rem" }} /></Link>
              <p className="footer__brand-desc">Your destination for premium products. Curated luxury for the modern lifestyle.</p>
              <div className="footer__socials">
                {['Twitter', 'Instagram', 'Facebook', 'YouTube'].map((s) => (
                  <a key={s} href="#" className="footer__social">{s[0]}</a>
                ))}
              </div>
            </div>
            <div className="footer__links-group">
              <h4>Shop</h4>
              <Link to="/shop">All Products</Link>
              <Link to="/shop?isFeatured=true">Featured</Link>
              <Link to="/shop?isNewArrival=true">New Arrivals</Link>
              <Link to="/shop?isBestSeller=true">Best Sellers</Link>
            </div>
            <div className="footer__links-group">
              <h4>Account</h4>
              <Link to="/profile">My Profile</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/profile/wishlist">Wishlist</Link>
              <Link to="/cart">Cart</Link>
            </div>
            <div className="footer__links-group">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Track Order</a>
              <a href="#">Returns</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© 2025 DoneShop. All rights reserved.</p>
            <div className="footer__bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sample products when API is down (for demo)
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

const ProductCardSkeleton = () => (
  <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--r-xl)' }} />
);

const EmptyProductsPlaceholder = () => (
  <div style={{ textAlign: 'center', padding: 'var(--sp-16)', color: 'var(--clr-text-3)' }}>
    <p style={{ fontSize: '3rem', marginBottom: 'var(--sp-4)' }}>🏪</p>
    <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--sp-2)', color: 'var(--clr-text-2)' }}>Products coming soon</h3>
    <p>Start adding products from the admin panel!</p>
    <Link to="/admin" className="btn btn-primary" style={{ marginTop: 'var(--sp-4)' }}>Go to Admin</Link>
  </div>
);

export default HomePage;
