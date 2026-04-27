import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { closeCart, removeFromCart, updateQuantity, selectCartItems, selectCartTotal, selectCartOpen } from '../../../app/slices/cartSlice';
import './CartSidebar.css';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartOpen);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') dispatch(closeCart()); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const shippingThreshold = 100;
  const freeShipping = total >= shippingThreshold;
  const progressPct = Math.min((total / shippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
          />

          {/* Sidebar */}
          <motion.div
            className="cart-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="cart-header">
              <div className="cart-header__title">
                <FiShoppingBag size={20} />
                <h2>Shopping Cart</h2>
                <span className="cart-count">{items.length}</span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => dispatch(closeCart())}>
                <FiX size={22} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="cart-shipping-progress">
                {freeShipping ? (
                  <p className="cart-shipping-progress__text success">🎉 You've earned <strong>FREE shipping!</strong></p>
                ) : (
                  <p className="cart-shipping-progress__text">
                    Add <strong>৳{(shippingThreshold - total).toFixed(2)}</strong> more for free shipping
                  </p>
                )}
                <div className="cart-shipping-bar">
                  <motion.div
                    className="cart-shipping-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="cart-items">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    className="cart-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="cart-empty__icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Discover our amazing products</p>
                    <Link to="/shop" className="btn btn-primary" onClick={() => dispatch(closeCart())}>
                      Start Shopping
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.key}
                      className="cart-item"
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to={`/product/${item.product.slug}`} onClick={() => dispatch(closeCart())}>
                        <img
                          src={item.product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                          alt={item.product.name}
                          className="cart-item__img"
                        />
                      </Link>
                      <div className="cart-item__details">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="cart-item__name"
                          onClick={() => dispatch(closeCart())}
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <p className="cart-item__variant">
                            {item.variant.size && `Size: ${item.variant.size}`}
                            {item.variant.color && ` · ${item.variant.color}`}
                          </p>
                        )}
                        <div className="cart-item__bottom">
                          <div className="cart-item__qty">
                            <button
                              className="cart-item__qty-btn"
                              onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                            >
                              <FiMinus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="cart-item__qty-btn"
                              onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                          <span className="cart-item__price">
                            ৳{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            className="cart-item__remove"
                            onClick={() => dispatch(removeFromCart(item.key))}
                            aria-label="Remove"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span className="cart-subtotal__amount">৳{total.toFixed(2)}</span>
                </div>
                <p className="cart-footer__note">Taxes and shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  className="btn btn-primary btn-lg w-full"
                  onClick={() => dispatch(closeCart())}
                >
                  Checkout · ৳{total.toFixed(2)}
                </Link>
                <Link
                  to="/cart"
                  className="btn btn-outline w-full"
                  style={{ marginTop: 'var(--sp-2)' }}
                  onClick={() => dispatch(closeCart())}
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
