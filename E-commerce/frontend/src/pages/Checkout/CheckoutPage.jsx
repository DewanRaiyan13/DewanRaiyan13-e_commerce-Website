import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiCheck, FiLock, FiCreditCard } from 'react-icons/fi';
import api from '../../api/axios';
import { selectCartItems, selectCartTotal, clearCart } from '../../app/slices/cartSlice';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Review', 'Payment'];

const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images?.[0]?.url || '',
        price: i.product.price,
        quantity: i.quantity,
        variant: i.variant,
      }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: shippingData,
        paymentMethod: 'cod',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      });
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="checkout-page page-fade" style={{ paddingTop: 'var(--navbar-h)' }}>
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Step Indicator */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="checkout-step__circle">
                {i < step ? <FiCheck size={16} /> : i + 1}
              </div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="checkout-step__line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            <AnimatePresence mode="wait">
              {/* Step 0: Shipping */}
              {step === 0 && (
                <motion.div key="shipping" className="checkout-card glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="checkout-card__title">Shipping Address</h2>
                  <form onSubmit={handleSubmit(handleShippingSubmit)} className="checkout-form">
                    <div className="checkout-form__row">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input {...register('fullName', { required: 'Required' })} className={`form-input ${errors.fullName ? 'error' : ''}`} placeholder="John Doe" />
                        {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input {...register('phone', { required: 'Required' })} className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+1 234 567 8900" />
                        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input {...register('street', { required: 'Required' })} className={`form-input ${errors.street ? 'error' : ''}`} placeholder="123 Main Street" />
                      {errors.street && <p className="form-error">{errors.street.message}</p>}
                    </div>
                    <div className="checkout-form__row checkout-form__row--3">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input {...register('city', { required: 'Required' })} className={`form-input ${errors.city ? 'error' : ''}`} placeholder="New York" />
                        {errors.city && <p className="form-error">{errors.city.message}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input {...register('state', { required: 'Required' })} className={`form-input ${errors.state ? 'error' : ''}`} placeholder="NY" />
                        {errors.state && <p className="form-error">{errors.state.message}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">ZIP Code</label>
                        <input {...register('zip', { required: 'Required' })} className={`form-input ${errors.zip ? 'error' : ''}`} placeholder="10001" />
                        {errors.zip && <p className="form-error">{errors.zip.message}</p>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <select {...register('country', { required: 'Required' })} className="form-input form-select">
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="BD">Bangladesh</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg">Continue to Review</button>
                  </form>
                </motion.div>
              )}

              {/* Step 1: Review */}
              {step === 1 && (
                <motion.div key="review" className="checkout-card glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="checkout-card__title">Order Review</h2>
                  <div className="checkout-items">
                    {items.map((item) => (
                      <div key={item.key} className="checkout-item">
                        <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/64'} alt={item.product.name} className="checkout-item__img" />
                        <div className="checkout-item__info">
                          <p className="checkout-item__name">{item.product.name}</p>
                          {item.variant && <p className="checkout-item__variant">{item.variant.size} {item.variant.color}</p>}
                          <p className="checkout-item__qty">Qty: {item.quantity}</p>
                        </div>
                        <p className="checkout-item__price">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-address">
                    <h3>Shipping to:</h3>
                    <p>{shippingData?.fullName}</p>
                    <p>{shippingData?.street}, {shippingData?.city}, {shippingData?.state} {shippingData?.zip}</p>
                    <p>{shippingData?.country}</p>
                  </div>
                  <div className="checkout-card__actions">
                    <button className="btn btn-outline" onClick={() => setStep(0)}>← Edit Shipping</button>
                    <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>Continue to Payment</button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div key="payment" className="checkout-card glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="checkout-card__title">Payment</h2>
                  <div className="payment-methods">
                    <div className="payment-method active">
                      <FiCreditCard size={20} />
                      <span>Cash on Delivery</span>
                      <span className="payment-method__badge">Available</span>
                    </div>
                    <div className="payment-method disabled">
                      <span>💳</span>
                      <span>Credit/Debit Card</span>
                      <span className="payment-method__badge">Coming Soon</span>
                    </div>
                  </div>
                  <div className="checkout-card__actions">
                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-gold btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : <><FiLock size={16} /> Place Order · ৳{total.toFixed(2)}</>}
                    </button>
                  </div>
                  <p className="checkout-secure"><FiLock size={12} /> Your information is secure and encrypted</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary glass-card">
            <h3>Order Summary</h3>
            <div className="checkout-summary__rows">
              <div className="summary-row"><span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span><span>৳{subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--clr-success)' }}>FREE</span> : `৳${shipping.toFixed(2)}`}</span></div>
              <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="checkout-summary__divider" />
              <div className="summary-row summary-row--total"><span>Total</span><span>৳{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
