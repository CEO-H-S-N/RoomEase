import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { api } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { shakeAnimation } from '../../utils/animations';
import './UserSignupPage.css';

interface UserSignupPageProps {
    onSignupSuccess: (user: any) => void;
}

export const UserSignupPage: React.FC<UserSignupPageProps> = ({ onSignupSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!agreedToTerms) {
            setError('You must agree to the terms and conditions');
            return;
        }

        try {
            setLoading(true);
            // Call backend API to register user
            const user = await api.register(formData.username, formData.email, formData.password);

            // Call parent success handler with backend user data
            onSignupSuccess(user);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            setError('');
            console.log('Google credential received:', credentialResponse);

            const user = await api.googleAuth(credentialResponse.credential);
            console.log('Backend response:', user);

            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            console.log('User stored in localStorage, redirecting...');

            // Use window.location for full page reload to properly initialize state
            window.location.href = '/dashboard';
        } catch (err: any) {
            console.error('Google sign-in error:', err);
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <div className="signup-page-modern">
                {/* Background */}
                <div className="signup-bg">
                    <div className="bg-overlay" />
                </div>

                {/* Content */}
                <div className="signup-container">
                    {/* Logo */}
                    <motion.div
                        className="signup-logo"
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
                        <Card variant="glass" className="signup-card">
                            <div className="card-header">
                                <h1>Create Account</h1>
                                <p>Join RoomEase and find your perfect match</p>
                            </div>

                            <form onSubmit={handleSubmit} className="signup-form">
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

                                {/* Username */}
                                <div className="form-field">
                                    <label htmlFor="username">Full Name</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="form-input"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

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

                                {/* Confirm Password */}
                                <div className="form-field">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="form-input"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms Checkbox */}
                                <div className="checkbox-field">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <label htmlFor="terms">
                                        I agree to the <a href="#" className="link">Terms & Conditions</a>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={loading}
                                >
                                    Create Account
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
                                        text="signup_with"
                                        width="100%"
                                    />
                                </div>

                                {/* Login Link */}
                                <div className="form-footer">
                                    Already have an account?{' '}
                                    <a onClick={() => navigate('/user-login')} className="link">
                                        Sign in
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
