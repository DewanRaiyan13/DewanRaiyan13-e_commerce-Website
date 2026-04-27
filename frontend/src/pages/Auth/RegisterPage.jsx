import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { registerUser, clearError } from '../../app/slices/authSlice';
import './AuthPages.css';

const RegisterPage = () => {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = (data) => dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <motion.div
        className="auth-card auth-card--wide glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-card__header">
          <Link to="/" className="auth-logo"><img src="/companylogo.png" alt="DoneShop" className="auth-logo-img" style={{ height: "40px", marginBottom: "1rem" }} /></Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join 500,000+ happy shoppers today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="form-input-wrap">
              <FiUser className="form-input-icon" size={18} />
              <input
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                type="text"
                className={`form-input form-input--icon ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <FiMail className="form-input-icon" size={18} />
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                type="email"
                className={`form-input form-input--icon ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
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
                placeholder="Min 6 characters"
              />
              <button type="button" className="form-input-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="form-input-wrap">
              <FiLock className="form-input-icon" size={18} />
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match'
                })}
                type="password"
                className={`form-input form-input--icon ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repeat password"
              />
            </div>
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>

          <p className="auth-terms">
            By creating an account, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : <>Create Account <FiArrowRight /></>}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
