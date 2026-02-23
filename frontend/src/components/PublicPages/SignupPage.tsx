import { useState } from 'react';
import { Eye, EyeOff, Check, Loader2, ArrowLeft } from 'lucide-react';
import '../../styles/PublicPagesCss/login.css';
import '../../styles/PublicPagesCss/signup.css';

interface SignupPageProps {
  onNavigateToLogin?: () => void;
  onBack?: () => void;
  onSignupSuccess?: (signupData: { email: string; fullName: string; password: string }) => void;
}

export function SignupPage({ onNavigateToLogin, onSignupSuccess, onBack }: SignupPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        onSignupSuccess?.({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="agent-login-page bg-user">
      {/* Toast Notification */}
      {showSuccessMessage && (
        <div className="toast-notification" style={{ top: '20px', background: 'rgba(46, 204, 113, 0.9)', backdropFilter: 'blur(5px)', color: 'white' }}>
          <span>Account created successfully!</span>
          <Check size={20} strokeWidth={3} />
        </div>
      )}

      <div className="glass-wrapper">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="back-button"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        )}
        <div className="login-header">
          <h2>Create Account</h2>
          <p className="subtitle">Please fill in your details</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group-custom">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="custom-input"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="custom-input"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="••••••••••••"
                className="custom-input"
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
              >
                {showPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
              </button>
            </div>
          </div>

          <div className="input-group-custom">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••••••"
                className="custom-input"
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle-btn"
              >
                {showConfirmPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
              </button>
            </div>
          </div>

          <div className="forget" style={{ margin: '15px 0', justifyContent: 'flex-start' }}>
            <label htmlFor="termsCheck" className="terms-label">
              <input
                type="checkbox"
                id="termsCheck"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                style={{ marginRight: '8px', accentColor: '#fbbf24' }}
              />
              <span>I agree to the <a href="#" className="terms-link">Terms</a> & <a href="#" className="terms-link">Privacy</a></span>
            </label>
          </div>

          <button type="submit" className="btn-dark-pill" disabled={isLoading}>
            {isLoading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Sign up'}
          </button>

        </form>

        <div className="register-link">
          <span>Already have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin?.(); }}>Login</a>
        </div>
      </div>
    </div>
  );
}