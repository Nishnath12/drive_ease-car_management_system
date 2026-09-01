import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/auth.css';
import logo from '../assets/drivee.jpg';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!formData.email || !formData.password) return setError('Enter your email and password to continue.');
    setLoading(true);
    try { await AuthService.login(formData.email.trim(), formData.password); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(err.response?.data?.message || err.response?.data?.error || 'We could not sign you in. Check your details and try again.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-glow" />
        <div className="auth-brand"><img src={logo} alt="DriveEase" /><strong>DriveEase</strong></div>
        <div className="auth-visual-copy"><span className="auth-eyebrow"><Sparkles size={13}/> Smart mobility, simplified</span><h1>Your journey,<br/><em>beautifully managed.</em></h1><p>Explore vehicles, schedule test drives, book service and stay on top of every request from one focused workspace.</p></div>
        <div className="auth-trust"><ShieldCheck size={18}/><span><strong>Secure by design</strong><small>Protected role-based access</small></span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand"><img src={logo} alt="DriveEase"/><strong>DriveEase</strong></div>
          <span className="auth-kicker">Welcome back</span>
          <h2>Sign in to your workspace</h2>
          <p className="auth-subtitle">Use your DriveEase account to continue.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            <div className="password-label"><label htmlFor="login-password">Password</label></div>
            <div className="password-field"><input id="login-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required/><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
            <button className="auth-button" type="submit" disabled={loading}>{loading ? <><span className="button-spinner"/> Signing in…</> : <>Sign in <ArrowRight size={17}/></>}</button>
          </form>
          <p className="auth-footer">New to DriveEase? <Link to="/register">Create a customer account</Link></p>
        </div>
      </section>
    </main>
  );
}
export default Login;
