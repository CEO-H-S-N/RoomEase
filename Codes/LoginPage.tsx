Login
import { useState } from 'react';
import { Home, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import '../styles/login.css';

interface LoginPageProps {
  onNavigateToSignup?: () => void;
  onNavigateToForgotPassword?: () => void;
  onLoginSuccess?: (email: string, password: string) => void;
}

export function LoginPage({
  onNavigateToSignup,
  onNavigateToForgotPassword,
  onLoginSuccess
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation ONLY
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    // ❌ DO NOT validate password length here
    // ✅ Let App.tsx handle correctness

    onLoginSuccess?.(email, password);
  };

  return (
    <div className="container-fluid vh-100 p-0 login-container-modern">
      <div className="row g-0 h-100">

        {/* Left Side - Visual/Brand */}
        <div className="col-lg-6 d-none d-lg-flex position-relative bg-teal p-0 login-visual-side animated fade-in-left">
          <div className="visual-overlay"></div>
          <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-white z-2 p-5 text-center">
            <div className="mb-4 d-flex align-items-center gap-2">
              <Home size={48} strokeWidth={2.5} />
              <span className="h1 fw-bold mb-0">RoomEase</span>
            </div>
            <h1 className="display-4 fw-bold mb-3">Welcome Back!</h1>
            <p className="lead px-4 opacity-75">
              Join thousands of specialized roommates connecting every day.
              Your perfect match is just a few clicks away.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white animated fade-in-right">
          <div className="login-form-wrapper w-100 p-4 p-md-5" style={{ maxWidth: '480px' }}>

            <div className="d-lg-none text-center mb-4 text-teal">
              <Home size={40} className="mb-2" />
              <h2 className="fw-bold">RoomEase</h2>
            </div>

            <div className="mb-5">
              <h2 className="fw-bold text-dark mb-2">Sign In to your Account</h2>
              <p className="text-muted">Welcome back! Please enter your details.</p>
            </div>

            {error && <div className="alert alert-danger mb-4 border-0 rounded-3 shadow-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold text-dark">Email</label>
                <div className="position-relative">
                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg bg-light border-0 ps-5"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontSize: '0.95rem' }}
                  />
                  <Mail size={20} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label htmlFor="password" className="form-label fw-semibold text-dark mb-0">Password</label>
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="btn btn-link text-teal text-decoration-none p-0 fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="position-relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-lg bg-light border-0 ps-5"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontSize: '0.95rem', paddingRight: '40px' }}
                  />
                  <Lock size={20} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn border-0 position-absolute top-50 end-0 translate-middle-y text-muted pe-3"
                    style={{ zIndex: 10 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-teal btn-lg w-100 mb-4 shadow-sm hover-elevate">
                Login
              </button>
            </form>

            <div className="d-flex align-items-center mb-4">
              <hr className="flex-grow-1 text-muted opacity-25" />
              <span className="px-3 text-muted small fw-medium">Or continue with</span>
              <hr className="flex-grow-1 text-muted opacity-25" />
            </div>

            <button className="btn btn-teal btn-lg w-100 mb-4 shadow-sm hover-elevate d-flex align-items-center justify-content-center gap-2">

              <span>Sign in with Google</span>
            </button>

            <div className="text-center text-muted">
              Don&apos;t have an account?{' '}
              <button
                onClick={onNavigateToSignup}
                className="btn btn-link text-teal fw-bold text-decoration-none p-0"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Css
import { useState } from 'react';
import { Home, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import '../styles/login.css';

interface LoginPageProps {
  onNavigateToSignup?: () => void;
  onNavigateToForgotPassword?: () => void;
  onLoginSuccess?: (email: string, password: string) => void;
}

export function LoginPage({
  onNavigateToSignup,
  onNavigateToForgotPassword,
  onLoginSuccess
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation ONLY
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    // ❌ DO NOT validate password length here
    // ✅ Let App.tsx handle correctness

    onLoginSuccess?.(email, password);
  };

  return (
    <div className="container-fluid vh-100 p-0 login-container-modern">
      <div className="row g-0 h-100">

        {/* Left Side - Visual/Brand */}
        <div className="col-lg-6 d-none d-lg-flex position-relative bg-teal p-0 login-visual-side animated fade-in-left">
          <div className="visual-overlay"></div>
          <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-white z-2 p-5 text-center">
            <div className="mb-4 d-flex align-items-center gap-2">
              <Home size={48} strokeWidth={2.5} />
              <span className="h1 fw-bold mb-0">RoomEase</span>
            </div>
            <h1 className="display-4 fw-bold mb-3">Welcome Back!</h1>
            <p className="lead px-4 opacity-75">
              Join thousands of specialized roommates connecting every day.
              Your perfect match is just a few clicks away.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white animated fade-in-right">
          <div className="login-form-wrapper w-100 p-4 p-md-5" style={{ maxWidth: '480px' }}>

            <div className="d-lg-none text-center mb-4 text-teal">
              <Home size={40} className="mb-2" />
              <h2 className="fw-bold">RoomEase</h2>
            </div>

            <div className="mb-5">
              <h2 className="fw-bold text-dark mb-2">Sign In to your Account</h2>
              <p className="text-muted">Welcome back! Please enter your details.</p>
            </div>

            {error && <div className="alert alert-danger mb-4 border-0 rounded-3 shadow-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold text-dark">Email</label>
                <div className="position-relative">
                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg bg-light border-0 ps-5"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontSize: '0.95rem' }}
                  />
                  <Mail size={20} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label htmlFor="password" className="form-label fw-semibold text-dark mb-0">Password</label>
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="btn btn-link text-teal text-decoration-none p-0 fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="position-relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-lg bg-light border-0 ps-5"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontSize: '0.95rem', paddingRight: '40px' }}
                  />
                  <Lock size={20} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn border-0 position-absolute top-50 end-0 translate-middle-y text-muted pe-3"
                    style={{ zIndex: 10 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-teal btn-lg w-100 mb-4 shadow-sm hover-elevate">
                Login
              </button>
            </form>

            <div className="d-flex align-items-center mb-4">
              <hr className="flex-grow-1 text-muted opacity-25" />
              <span className="px-3 text-muted small fw-medium">Or continue with</span>
              <hr className="flex-grow-1 text-muted opacity-25" />
            </div>

            <button className="btn btn-teal btn-lg w-100 mb-4 shadow-sm hover-elevate d-flex align-items-center justify-content-center gap-2">

              <span>Sign in with Google</span>
            </button>

            <div className="text-center text-muted">
              Don&apos;t have an account?{' '}
              <button
                onClick={onNavigateToSignup}
                className="btn btn-link text-teal fw-bold text-decoration-none p-0"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
