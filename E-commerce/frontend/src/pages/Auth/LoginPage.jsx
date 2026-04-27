import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { loginUser, clearError } from '../../app/slices/authSlice';
import './AuthPages.css';

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, from, dispatch]);

  const onSubmit = (data) => dispatch(loginUser(data));

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <motion.div
        className="auth-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-card__header">
          <Link to="/" className="auth-logo"><img src="/companylogo.png" alt="DoneShop" className="auth-logo-img" style={{ height: "40px", marginBottom: "1rem" }} /></Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <FiMail className="form-input-icon" size={18} />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                })}
                type="email"
                className={`form-input form-input--icon ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <FiLock className="form-input-icon" size={18} />
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type={showPass ? 'text' : 'password'}
                className={`form-input form-input--icon form-input--icon-right ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" className="form-input-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <div className="auth-form__options">
            <label className="auth-remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="auth-forgot">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : <>Sign In <FiArrowRight /></>}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="auth-socials">
          <button className="auth-social-btn">
            <span>G</span> Google
          </button>
          <button className="auth-social-btn">
            <span>f</span> Facebook
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
