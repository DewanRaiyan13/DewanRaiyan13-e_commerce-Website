import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiPackage, FiSettings, FiChevronDown } from 'react-icons/fi';
import { toggleCart, selectCartCount } from '../../../app/slices/cartSlice';
import { logoutUser } from '../../../app/slices/authSlice';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const cartCount = useSelector(selectCartCount);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/shop?isFeatured=true', label: 'Featured' },
    { to: '/shop?isNewArrival=true', label: 'New Arrivals' },
    { to: '/shop?isBestSeller=true', label: 'Best Sellers' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src="/companylogo.png" alt="DoneShop" className="navbar__logo-img" style={{ height: "70px" }} />
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar__links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`navbar__link ${location.pathname === to ? 'active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar__actions">
            {/* Search */}
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <FiSearch size={20} />
            </button>

            {/* Theme toggle */}
            <button className="navbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/profile/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
                <FiHeart size={20} />
              </Link>
            )}

            {/* Cart */}
            <button
              className="navbar__icon-btn navbar__cart-btn"
              onClick={() => dispatch(toggleCart())}
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="count"
                    className="navbar__cart-count"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="navbar__user-menu" ref={userMenuRef}>
                <button
                  className="navbar__user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <img
                    src={user?.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="navbar__avatar"
                  />
                  <span className="navbar__user-name">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={14} className={`navbar__chevron ${userMenuOpen ? 'open' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="navbar__dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="navbar__dropdown-header">
                        <p className="navbar__dropdown-name">{user?.name}</p>
                        <p className="navbar__dropdown-email">{user?.email}</p>
                      </div>
                      <div className="navbar__dropdown-items">
                        <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                          <FiUser size={16} /> Profile
                        </Link>
                        <Link to="/orders" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                          <FiPackage size={16} /> My Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                            <FiSettings size={16} /> Admin Panel
                          </Link>
                        )}
                        <div className="navbar__dropdown-divider" />
                        <button className="navbar__dropdown-item danger" onClick={handleLogout}>
                          <FiLogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="navbar__icon-btn navbar__mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="navbar__mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="navbar__mobile-inner">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className="navbar__mobile-link">
                    {label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="navbar__mobile-auth">
                    <Link to="/login" className="btn btn-primary w-full">Sign In</Link>
                    <Link to="/register" className="btn btn-outline w-full">Create Account</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="search-modal"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="search-form">
                <FiSearch size={22} className="search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                  <FiX size={22} />
                </button>
              </form>
              <p className="search-hint">Press Enter to search · ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
