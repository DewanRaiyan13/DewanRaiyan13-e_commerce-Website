import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_COLORS = { pending: 'warning', processing: 'primary', shipped: 'primary', delivered: 'success', cancelled: 'error', refunded: 'error' };

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--navbar-h)' }}><div className="spinner" style={{ width: 48, height: 48 }} /></div>;
  if (!order) return <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: 'var(--navbar-h)' }}><h2>Order not found</h2><Link to="/orders" className="btn btn-primary">My Orders</Link></div>;

  return (
    <div className="page-fade" style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh', paddingBottom: 'var(--sp-16)' }}>
      <div className="container">
        <div style={{ padding: 'var(--sp-8) 0 var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <Link to="/orders" className="btn btn-ghost">← Back</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-3xl)', fontWeight: 800 }}>Order Details</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-8)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {/* Header Card */}
            <div className="glass-card" style={{ padding: 'var(--sp-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>#{order._id?.slice(-8).toUpperCase()}</p>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`badge badge-${STATUS_COLORS[order.status] || 'primary'}`} style={{ fontSize: 'var(--fs-sm)', padding: '0.4rem 1rem' }}>{order.status?.toUpperCase()}</span>
              </div>
            </div>

            {/* Items */}
            <div className="glass-card" style={{ padding: 'var(--sp-6)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-4)' }}>Order Items</h3>
              {order.orderItems?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) 0', borderBottom: '1px solid var(--clr-border)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--r-md)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{item.name}</p>
                    {item.variant && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{item.variant.size} {item.variant.color}</p>}
                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-2)' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 700 }}>৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="glass-card" style={{ padding: 'var(--sp-6)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-4)' }}>Shipping Address</h3>
              <p style={{ fontWeight: 600 }}>{order.shippingAddress?.fullName}</p>
              <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--fs-sm)' }}>{order.shippingAddress?.street}</p>
              <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--fs-sm)' }}>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--fs-sm)' }}>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>{order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card" style={{ padding: 'var(--sp-6)', position: 'sticky', top: 'calc(var(--navbar-h) + var(--sp-4))' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-5)' }}>Payment Summary</h3>
            {[['Subtotal', `৳${order.itemsPrice?.toFixed(2)}`], ['Shipping', order.shippingPrice === 0 ? 'FREE' : `৳${order.shippingPrice?.toFixed(2)}`], ['Tax', `৳${order.taxPrice?.toFixed(2)}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)', fontSize: 'var(--fs-sm)', color: 'var(--clr-text-2)' }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--clr-border)', margin: 'var(--sp-3) 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 'var(--fs-xl)' }}>
              <span>Total</span><span>৳{order.totalPrice?.toFixed(2)}</span>
            </div>
            <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'var(--clr-surface)', borderRadius: 'var(--r-md)', fontSize: 'var(--fs-sm)', color: 'var(--clr-text-2)' }}>
              Payment: {order.paymentMethod?.toUpperCase()}
              {order.isPaid ? <span style={{ color: 'var(--clr-success)', marginLeft: 8 }}>✓ Paid</span> : <span style={{ color: 'var(--clr-warning)', marginLeft: 8 }}>Pending</span>}
            </div>
            {order.trackingNumber && (
              <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-3)', background: 'var(--clr-primary-glow)', borderRadius: 'var(--r-md)', fontSize: 'var(--fs-sm)', color: 'var(--clr-primary-light)', fontFamily: 'monospace' }}>
                Tracking: {order.trackingNumber}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailPage;
