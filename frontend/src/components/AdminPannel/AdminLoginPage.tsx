import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminPannel/AdminLogin.css';

interface AdminLoginPageProps {
    onLoginSuccess?: (email: string, password: string) => void;
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        onLoginSuccess?.(email, password);
    };

    return (
        <div className="animated-login-wrapper bg-admin">
            <div className="box">
                {/* Back Button matching User Login */}
                <button
                    onClick={() => navigate('/login-selection')}
                    className="absolute-back-btn"
                >
                    <ArrowLeft size={24} color="#14919B" />
                </button>
                <div className="form">
                    <h2>Admin Login</h2>
                    <p className="subtitle">Please enter your details</p>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-msg">
                                {error}
                            </div>
                        )}

                        <div className="inputBox">
                            <label>Email</label>
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@roomease.com"
                            />
                        </div>

                        <div className="inputBox">
                            <label>Password</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="forgot-password">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin-forgot-password'); }}>
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="btn-standard"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Login
                        </button>

                        <div className="footer-links" style={{ marginTop: '1.5rem' }}>
                            <span>Are you new?</span>
                            <button
                                type="button"
                                className="btn-standard"
                                style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                                onClick={() => navigate('/admin-signup', { replace: true })}
                            >
                                Create an Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
