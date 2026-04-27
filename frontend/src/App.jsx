import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';

import store from './app/store';
import { fetchMe } from './app/slices/authSlice';
import Navbar from './components/layout/Navbar/Navbar';
import CartSidebar from './components/shared/CartSidebar/CartSidebar';
import './styles/globals.css';

// Synchronous imports for critical pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
// Lazy pages
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ShopPage = lazy(() => import('./pages/Shop/ShopPage'));

// Simple pages (not lazy to avoid flash)
const NotFoundPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: 'var(--navbar-h)' }}>
    <p style={{ fontSize: '6rem' }}>404</p>
    <h1 style={{ fontSize: 'var(--fs-3xl)', fontFamily: 'var(--font-display)' }}>Page Not Found</h1>
    <a href="/" className="btn btn-primary btn-lg">Go Home</a>
  </div>
);

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useSelector((s) => s.auth);
  if (!initialized) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, initialized } = useSelector((s) => s.auth);
  if (!initialized) return <LoadingSpinner />;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);
  const [theme, setTheme] = useState(() => localStorage.getItem('doneshop_theme') || 'dark');

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('doneshop_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  if (!initialized) return <LoadingSpinner />;

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <CartSidebar />
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Product Detail */}
            <Route
              path="/product/:slug"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  {/* ProductDetailPage loaded dynamically */}
                  <ProductDetailPageDynamic />
                </Suspense>
              }
            />

            {/* Protected */}
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/profile/*" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--clr-bg-2)',
            color: 'var(--clr-text)',
            border: '1px solid var(--clr-border)',
            borderRadius: 'var(--r-lg)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
          },
        }}
      />
    </>
  );
};

// Dynamic imports for additional pages (created separately)
const ProductDetailPageDynamic = lazy(() =>
  import('./pages/Product/ProductDetailPage').catch(() => ({ default: () => <NotFoundPage /> }))
);
const CartPage = lazy(() =>
  import('./pages/Cart/CartPage').catch(() => ({ default: () => <Navigate to="/" /> }))
);
const CheckoutPage = lazy(() =>
  import('./pages/Checkout/CheckoutPage').catch(() => ({ default: () => <Navigate to="/" /> }))
);
const OrdersPage = lazy(() =>
  import('./pages/Orders/OrdersPage').catch(() => ({ default: () => <Navigate to="/" /> }))
);
const OrderDetailPage = lazy(() =>
  import('./pages/Orders/OrderDetailPage').catch(() => ({ default: () => <Navigate to="/" /> }))
);
const ProfilePage = lazy(() =>
  import('./pages/Profile/ProfilePage').catch(() => ({ default: () => <Navigate to="/" /> }))
);
const AdminPage = lazy(() =>
  import('./pages/Admin/AdminPage').catch(() => ({ default: () => <Navigate to="/" /> }))
);

const App = () => (
  <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  </HelmetProvider>
);

export default App;
