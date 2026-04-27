import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiEye } from 'react-icons/fi';
import api from '../../api/axios';
import './OrdersPage.css';

const STATUS_COLORS = { pending: 'warning', processing: 'primary', shipped: 'primary', delivered: 'success', cancelled: 'error', refunded: 'error' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data.orders || [])).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page page-fade" style={{ paddingTop: 'var(--navbar-h)' }}>
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-16)' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <FiPackage size={80} style={{ color: 'var(--clr-text-3)' }} />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, i) => (
              <motion.div key={order._id} className="order-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="order-card__header">
                  <div>
                    <p className="order-card__id">Order #{order._id?.slice(-8).toUpperCase()}</p>
                    <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className={`badge badge-${STATUS_COLORS[order.status] || 'primary'}`}>{order.status?.toUpperCase()}</span>
                </div>
                <div className="order-card__items">
                  {order.orderItems?.slice(0, 3).map((item, j) => (
                    <img key={j} src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="order-card__thumb" title={item.name} />
                  ))}
                  {order.orderItems?.length > 3 && <div className="order-card__more">+{order.orderItems.length - 3}</div>}
                </div>
                <div className="order-card__footer">
                  <div>
                    <p className="order-card__total">৳{order.totalPrice?.toFixed(2)}</p>
                    <p className="order-card__count">{order.orderItems?.reduce((a, i) => a + i.quantity, 0)} items</p>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                    <FiEye size={14} /> View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default OrdersPage;
