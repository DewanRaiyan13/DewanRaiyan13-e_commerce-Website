import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../../app/slices/cartSlice';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shipping = total >= 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <div className="cart-page page-fade" style={{ paddingTop: 'var(--navbar-h)' }}>
      <div className="container">
        <h1 className="cart-page__title">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="cart-page__empty">
            <FiShoppingBag size={80} style={{ color: 'var(--clr-text-3)' }} />
            <h2>Your cart is empty</h2>
            <p>Add some amazing products to get started!</p>
            <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              {items.map((item) => (
                <motion.div key={item.key} className="cart-page__item glass-card" layout exit={{ opacity: 0, x: -20 }}>
                  <Link to={`/product/${item.product.slug}`}>
                    <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/120'} alt={item.product.name} className="cart-page__item-img" />
                  </Link>
                  <div className="cart-page__item-details">
                    <Link to={`/product/${item.product.slug}`} className="cart-page__item-name">{item.product.name}</Link>
                    {item.variant && <p className="cart-page__item-variant">{item.variant.size} {item.variant.color}</p>}
                    <p className="cart-page__item-price">৳{item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-page__item-qty">
                    <button className="qty-btn" onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}><FiMinus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))} disabled={item.quantity >= item.product.stock}><FiPlus size={14} /></button>
                  </div>
                  <p className="cart-page__item-total">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                  <button className="cart-page__remove" onClick={() => dispatch(removeFromCart(item.key))}><FiTrash2 size={18} /></button>
                </motion.div>
              ))}
            </div>

            <div className="cart-page__summary glass-card">
              <h2 className="cart-page__summary-title">Order Summary</h2>
              <div className="cart-page__summary-rows">
                <div className="summary-row"><span>Subtotal</span><span>৳{total.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--clr-success)' }}>FREE</span> : `৳${shipping.toFixed(2)}`}</span></div>
                <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="cart-page__summary-divider" />
                <div className="summary-row summary-row--total"><span>Total</span><span>৳{grandTotal.toFixed(2)}</span></div>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-lg w-full">
                Proceed to Checkout <FiArrowRight />
              </Link>
              <Link to="/shop" className="btn btn-outline w-full" style={{ marginTop: 'var(--sp-3)' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartPage;
