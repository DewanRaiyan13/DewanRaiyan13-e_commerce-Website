import { useSelector } from 'react-redux';
import { Link, Routes, Route } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector((s) => s.auth);
  return (
    <div className="profile-page page-fade" style={{ paddingTop: 'var(--navbar-h)' }}>
      <div className="container">
        <div className="profile-layout">
          <aside className="profile-sidebar glass-card">
            <div className="profile-sidebar__header">
              <img src={user?.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt={user?.name} className="profile-sidebar__avatar" />
              <div>
                <p className="profile-sidebar__name">{user?.name}</p>
                <p className="profile-sidebar__email">{user?.email}</p>
                {user?.role === 'admin' && <span className="badge badge-primary">Admin</span>}
              </div>
            </div>
            <nav className="profile-nav">
              <Link to="/profile" className="profile-nav__link">👤 Account Info</Link>
              <Link to="/orders" className="profile-nav__link">📦 My Orders</Link>
              <Link to="/profile/wishlist" className="profile-nav__link">❤️ Wishlist</Link>
              <Link to="/profile/addresses" className="profile-nav__link">📍 Addresses</Link>
              <Link to="/profile/security" className="profile-nav__link">🔒 Security</Link>
              {user?.role === 'admin' && <Link to="/admin" className="profile-nav__link" style={{ color: 'var(--clr-primary-light)' }}>⚙️ Admin Panel</Link>}
            </nav>
          </aside>
          <div className="profile-content glass-card">
            <h2 className="profile-content__title">Account Information</h2>
            <div className="profile-info-grid">
              {[['Full Name', user?.name], ['Email', user?.email], ['Role', user?.role?.toUpperCase()], ['Member Since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Just now']].map(([k, v]) => (
                <div key={k} className="profile-info-item">
                  <span className="profile-info-item__label">{k}</span>
                  <span className="profile-info-item__value">{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--sp-6)' }}>
              <Link to="/orders" className="btn btn-primary">View My Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
