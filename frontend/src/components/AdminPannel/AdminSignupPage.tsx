import { useState } from 'react';
import { Eye, EyeOff, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminPannel/AdminSignup.css';

interface AdminSignupPageProps {
    onSignupSuccess?: (signupData: { email: string; fullName: string; password: string }) => void;
}

export function AdminSignupPage({ onSignupSuccess }: AdminSignupPageProps) {
    const navigate = useNavigate();
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
        <div className="animated-login-wrapper">
            {/* Toast Notification */}
            {showSuccessMessage && (
                <div className="toast-notification" style={{ top: '20px', background: 'rgba(46, 204, 113, 0.9)', backdropFilter: 'blur(5px)', color: 'white' }}>
                    <span>Account created successfully!</span>
                    <Check size={20} strokeWidth={3} />
                </div>
            )}

            <div className="box">
                {/* Back Button */}
                <button onClick={() => navigate('/admin-login')} className="absolute-back-btn">
                    <ArrowLeft size={24} color="#14919B" />
                </button>
                <div className="form">
                    <h2>Create Admin Account</h2>
                    <p className="subtitle">Please fill in your details</p>

                    <form onSubmit={handleSubmit}>

                        <div className="inputBox">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={e => handleChange('fullName', e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="inputBox">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => handleChange('email', e.target.value)}
                                placeholder="admin@roomease.com"
                            />
                        </div>

                        <div className="inputBox">
                            <label htmlFor="password">Password</label>
                            <div className="password-container">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    placeholder="••••••••••••"
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-container">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={e => handleChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="forget">
                            <label htmlFor="termsCheck" className="terms-label">
                                <input
                                    type="checkbox"
                                    id="termsCheck"
                                    checked={acceptTerms}
                                    onChange={() => setAcceptTerms(!acceptTerms)}
                                />
                                <span>I agree to the <a href="#" className="terms-link">Terms</a> & <a href="#" className="terms-link">Privacy</a></span>
                            </label>
                        </div>

                        <button type="submit" className="btn-standard" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} disabled={isLoading}>
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign up'}
                        </button>

                        <div className="footer-links">
                            <span>Already have an account? </span>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin-login', { replace: true }); }}>Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
