import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { api } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { shakeAnimation } from '../../utils/animations';
import './UserLoginPage.css';

interface UserLoginPageProps {
    onLoginSuccess: (email: string, password: string, backendUser?: any) => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            // Call backend API to login
            const userData = await api.login(formData.email, formData.password);

            // Call parent success handler with backend user data
            onLoginSuccess(formData.email, formData.password, userData);
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            setError('');
            const user = await api.googleAuth(credentialResponse.credential);

            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');

            // Use window.location for full page reload to properly initialize state
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <div className="login-page-modern">
                {/* Background */}
                <div className="login-bg">
                    <div className="bg-overlay" />
                </div>

                {/* Content */}
                <div className="login-container">
                    {/* Logo */}
                    <motion.div
                        className="login-logo"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        <Home size={32} color="#B85D47" />
                        <span className="logo-text" style={{
                            background: 'none',
                            WebkitBackgroundClip: 'unset',
                            WebkitTextFillColor: 'unset',
                            color: '#B85D47'
                        }}>RoomEase</span>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card variant="glass" className="login-card">
                            <div className="card-header">
                                <h1>Welcome Back</h1>
                                <p>Sign in to continue your journey</p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form">
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        className="error-banner"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={error ? shakeAnimation : { opacity: 1, x: 0 }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Email */}
                                <div className="form-field">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="form-input"
                                            disabled={loading}
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-field">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="form-input"
                                            disabled={loading}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="form-options">
                                    <a href="#" className="link">Forgot password?</a>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={loading}
                                >
                                    Sign In
                                </Button>

                                {/* Divider */}
                                <div className="divider">
                                    <span>or</span>
                                </div>

                                {/* Google Sign In */}
                                <div className="google-signin-wrapper">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google sign-in failed')}
                                        useOneTap
                                        theme="outline"
                                        size="large"
                                        text="signin_with"
                                        width="100%"
                                    />
                                </div>

                                {/* Signup Link */}
                                <div className="form-footer">
                                    Don't have an account?{' '}
                                    <a onClick={() => navigate('/user-signup')} className="link">
                                        Create one
                                    </a>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};
