import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PublicPagesCss/ResetPasswordPage.css';

interface Props {
  email: string;
  onResetPassword: (password: string) => void;
}

export function ResetPasswordPage({ email, onResetPassword }: Props) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    onResetPassword(password);
  };

  return (
    <div className="animated-login-wrapper">
      <div className="box">
        <div className="form">
          <h2>Reset Password</h2>
          <p className="subtitle">Set a new password for <strong>{email}</strong></p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            <div className="inputBox">
              <label>New Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="inputBox">
              <label>Confirm Password</label>
              <div className="password-container">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="password-toggle"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
              Update Password
            </button>

            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login-selection', { replace: true }); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <ArrowLeft size={16} /> Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
