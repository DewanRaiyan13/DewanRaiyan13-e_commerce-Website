import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { addToCart } from '../../../app/slices/cartSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const { name, slug, price, comparePrice, images, ratings, numReviews, discount, isFeatured, isNewArrival, isBestSeller } = product;

  const img = images?.[imgIdx]?.url || 'https://via.placeholder.com/400x400?text=No+Image';
  const img2 = images?.[1]?.url;
  const discountPct = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : discount;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${slug}`} className="product-card__link">
        {/* Image */}
        <div className="product-card__image-wrap">
          <img
            src={img}
            alt={name}
            className="product-card__img product-card__img--main"
            onMouseEnter={() => img2 && setImgIdx(1)}
            onMouseLeave={() => setImgIdx(0)}
            loading="lazy"
          />
          {img2 && (
            <img src={img2} alt={name} className="product-card__img product-card__img--hover" loading="lazy" />
          )}

          {/* Badges */}
          <div className="product-card__badges">
            {discountPct > 0 && <span className="badge badge-sale">-{discountPct}%</span>}
            {isNewArrival && <span className="badge badge-new">New</span>}
            {isBestSeller && <span className="badge badge-primary">Hot 🔥</span>}
          </div>

          {/* Wishlist */}
          <motion.button
            className={`product-card__wishlist ${wishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            whileTap={{ scale: 0.8 }}
            aria-label="Add to wishlist"
          >
            <FiHeart size={16} />
          </motion.button>

          {/* Quick Actions Overlay */}
          <div className="product-card__overlay">
            <button className="product-card__action-btn" onClick={handleAddToCart}>
              <FiShoppingCart size={16} />
              Add to Cart
            </button>
            <Link to={`/product/${slug}`} className="product-card__action-btn product-card__action-btn--ghost">
              <FiEye size={16} />
              Quick View
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="product-card__info">
          <p className="product-card__name">{name}</p>

          <div className="product-card__rating">
            <FiStar size={13} />
            <span>{ratings?.toFixed(1) || '0.0'}</span>
            <span className="product-card__reviews">({numReviews || 0})</span>
          </div>

          <div className="product-card__price-row">
            <span className="product-card__price">৳{price?.toFixed(2)}</span>
            {comparePrice > price && (
              <span className="product-card__compare">৳{comparePrice?.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
