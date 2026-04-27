import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiTag, FiBarChart2, FiLogOut, FiPlus } from 'react-icons/fi';
import api from '../../api/axios';
import { logoutUser } from '../../app/slices/authSlice';
import './AdminPage.css';

const AdminPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', icon: <FiBarChart2 />, label: 'Dashboard' },
    { to: '/admin/products', icon: <FiBox />, label: 'Products' },
    { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  ];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar__logo"><img src="/companylogo.png" alt="DoneShop" className="auth-logo-img" style={{ height: "40px", marginBottom: "1rem" }} /></Link>
        <p className="admin-sidebar__role">Admin Panel</p>
        <nav className="admin-nav">
          {navItems.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={`admin-nav__link ${location.pathname === to ? 'active' : ''}`}>
              {icon} {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <Link to="/" className="admin-nav__link"><FiHome /> Back to Store</Link>
          <button className="admin-nav__link" style={{ width: '100%' }} onClick={() => { dispatch(logoutUser()); navigate('/'); }}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    api.get('/orders/admin/analytics').then(({ data }) => setAnalytics(data.analytics)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Revenue', value: analytics ? `৳${analytics.totalRevenue?.toFixed(2)}` : '—', icon: '💰', color: '#7c3aed' },
    { label: 'Month Revenue', value: analytics ? `৳${analytics.monthRevenue?.toFixed(2)}` : '—', icon: '📈', color: '#10b981' },
    { label: 'Total Orders', value: analytics?.totalOrders ?? '—', icon: '📦', color: '#f59e0b' },
    { label: 'Pending Orders', value: analytics?.pendingOrders ?? '—', icon: '⏳', color: '#ec4899' },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats-grid">
        {cards.map((c, i) => (
          <motion.div key={c.label} className="admin-stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="admin-stat-card__icon" style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
            <div>
              <p className="admin-stat-card__label">{c.label}</p>
              <p className="admin-stat-card__value" style={{ color: c.color }}>{c.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {analytics?.topProducts?.length > 0 && (
        <div className="admin-section glass-card">
          <h2 className="admin-section__title">Top Products</h2>
          {analytics.topProducts.map((p) => (
            <div key={p._id} className="admin-list-row">
              <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--r-md)' }} />
              <span style={{ flex: 1 }}>{p.name}</span>
              <span style={{ color: 'var(--clr-text-3)', fontSize: 'var(--fs-sm)' }}>{p.soldCount} sold</span>
              <span style={{ fontWeight: 700 }}>৳{p.price}</span>
            </div>
          ))}
        </div>
      )}
      {analytics?.recentOrders?.length > 0 && (
        <div className="admin-section glass-card">
          <h2 className="admin-section__title">Recent Orders</h2>
          {analytics.recentOrders.map((o) => (
            <div key={o._id} className="admin-list-row">
              <span style={{ fontFamily: 'monospace', fontSize: 'var(--fs-sm)' }}>#{o._id?.slice(-8).toUpperCase()}</span>
              <span style={{ flex: 1, fontSize: 'var(--fs-sm)', color: 'var(--clr-text-2)' }}>{o.user?.name}</span>
              <span className={`badge badge-${o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'error' : 'primary'}`}>{o.status}</span>
              <span style={{ fontWeight: 700 }}>৳{o.totalPrice?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', category: '', brand: '', isFeatured: false, isNewArrival: false, isBestSeller: false });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/products/admin/all').then(({ data }) => setProducts(data.products || [])),
      api.get('/categories').then(({ data }) => setCategories(data.categories || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/products/admin', form);
      setProducts([data.product, ...products]);
      setShowForm(false);
      setForm({ name: '', price: '', stock: '', description: '', category: '', brand: '', isFeatured: false, isNewArrival: false, isBestSeller: false });
    } catch (err) { alert(err.response?.data?.message || 'Failed to create product'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/admin/${id}`); setProducts(products.filter(p => p._id !== id)); } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
        <h1 className="admin-page-title">Products</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> Add Product</button>
      </div>
      {showForm && (
        <form className="admin-form glass-card" onSubmit={handleCreate}>
          <h3 style={{ marginBottom: 'var(--sp-5)', fontWeight: 700 }}>New Product</h3>
          <div className="admin-form__grid">
            {[['name', 'Product Name', 'text'], ['price', 'Price', 'number'], ['stock', 'Stock', 'number'], ['brand', 'Brand', 'text']].map(([key, label, type]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input type={type} className="form-input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Category</label>
              <select className="form-input form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 'var(--sp-6)' }}>
              {['isFeatured', 'isNewArrival', 'isBestSeller'].map((key) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontSize: 'var(--fs-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                  {key.replace('is', '')}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-5)' }}>
            <button type="submit" className="btn btn-primary">Create Product</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="admin-table glass-card">
        <table>
          <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--sp-8)' }}>Loading...</td></tr> :
              products.map((p) => (
                <tr key={p._id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}><img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--r-md)' }} /><span style={{ fontWeight: 600 }}>{p.name}</span></div></td>
                  <td>৳{p.price}</td>
                  <td><span style={{ color: p.stock < 5 ? 'var(--clr-error)' : 'inherit' }}>{p.stock}</span></td>
                  <td><span className={`badge badge-${p.isActive ? 'success' : 'error'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/admin/all').then(({ data }) => setOrders(data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try { const { data } = await api.put(`/orders/admin/${id}/status`, { status }); setOrders(orders.map((o) => o._id === id ? data.order : o)); } catch {}
  };

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <div className="admin-table glass-card">
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--sp-8)' }}>Loading...</td></tr> :
              orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--fs-xs)' }}>#{o._id?.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name}</td>
                  <td style={{ fontWeight: 700 }}>৳{o.totalPrice?.toFixed(2)}</td>
                  <td>
                    <select className="form-input form-select" style={{ padding: '0.3rem 2rem 0.3rem 0.5rem', fontSize: 'var(--fs-xs)', width: 'auto' }}
                      value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td><Link to={`/orders/${o._id}`} className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/users/admin/all').then(({ data }) => setUsers(data.users || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  const deleteUser = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/users/admin/${id}`); setUsers(users.filter(u => u._id !== id)); } catch {} };
  return (
    <div><h1 className="admin-page-title">Users</h1>
      <div className="admin-table glass-card"><table>
        <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--sp-8)' }}>Loading...</td></tr> :
          users.map((u) => (<tr key={u._id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}><img src={u.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} style={{ width: 36, height: 36, borderRadius: '50%' }} /><span>{u.name}</span></div></td>
            <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-2)' }}>{u.email}</td>
            <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>{u.role}</span></td>
            <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
            <td><button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button></td>
          </tr>))
        }</tbody>
      </table></div>
    </div>
  );
};

const AdminCategories = () => {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  useEffect(() => { api.get('/categories').then(({ data }) => setCats(data.categories || [])).catch(() => {}); }, []);
  const create = async (e) => { e.preventDefault(); try { const { data } = await api.post('/categories/admin', { name }); setCats([...cats, data.category]); setName(''); } catch {} };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/categories/admin/${id}`); setCats(cats.filter(c => c._id !== id)); } catch {} };
  return (
    <div><h1 className="admin-page-title">Categories</h1>
      <form onSubmit={create} style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        <input className="form-input" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      <div className="admin-table glass-card"><table>
        <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
        <tbody>{cats.map((c) => (<tr key={c._id}><td style={{ fontWeight: 600 }}>{c.name}</td><td style={{ fontFamily: 'monospace', fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)' }}>{c.slug}</td><td><button className="btn btn-danger btn-sm" onClick={() => del(c._id)}>Delete</button></td></tr>))}</tbody>
      </table></div>
    </div>
  );
};

export default AdminPage;
