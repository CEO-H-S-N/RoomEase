import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Property Owner/LoginPage.css';

interface PropertyOwnerLoginPageProps {
    onLoginSuccess?: (email: string, password: string, user?: any) => void;
}

export function PropertyOwnerLoginPage({ onLoginSuccess }: PropertyOwnerLoginPageProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { api } = await import('../../services/api');
            const user = await api.login(email, password);
            if (onLoginSuccess) {
                // Pass user object as third argument if needed, or update parent to accept it
                // Checking App.tsx: handleOwnerLogin(email, password, backendUser)
                onLoginSuccess(email, password, user);
            } else {
                navigate('/property-owner-dashboard');
            }
        } catch (err: any) {
            // setError(err.message); // Need to add setError to state if not present
            alert(err.message || 'Login failed');
        }
    };

    return (
        <div className="animated-login-wrapper bg-owner-login">
            <div className="box">
                {/* Back Button matching User Login */}
                <button
                    onClick={() => navigate('/login-selection')}
                    className="absolute-back-btn"
                >
                    <ArrowLeft size={24} color="#14919B" />
                </button>
                <div className="form">
                    <h2>Property Owner Login</h2>
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
                                placeholder="owner@roomease.com"
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
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/property-owner-forgot-password'); }}>
                                Forgot password?
                            </a>
                        </div>

                        {/* Two Buttons in Same Row */}
                        <div className="d-flex gap-3" style={{ width: '100%', gap: '1rem' }}>
                            <button
                                type="submit"
                                className="btn-standard"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Login
                            </button>

                        </div>

                        <div className="footer-links" style={{ marginTop: '1.5rem' }}>
                            <span>Are you new?</span>
                            <button
                                type="button"
                                className="btn-standard"
                                style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                                onClick={() => navigate('/property-owner-signup', { replace: true })}
                            >
                                Create an Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}