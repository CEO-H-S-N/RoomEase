import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Home, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { shakeAnimation } from '../../utils/animations';
import './UserLoginPage.css'; // Reuse the login styling

interface Props {
    onSubmitEmail: (email: string) => void;
}

export function UserForgotPasswordPage({ onSubmitEmail }: Props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            // Simulate API call for now (we trigger the state update visually)
            await new Promise(resolve => setTimeout(resolve, 800));
            onSubmitEmail(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
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
                        <button 
                            className="back-button" 
                            onClick={() => navigate('/user-login')}
                            style={{ 
                                background: 'none', border: 'none', cursor: 'pointer', 
                                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.9rem',
                                padding: 0
                            }}
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </button>

                        {!isSubmitted ? (
                            <>
                                <div className="card-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <h1 style={{ fontSize: '1.75rem', color: '#111827', marginBottom: '0.5rem' }}>Forgot Password?</h1>
                                    <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>No worries, we'll send you reset instructions.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="login-form">
                                    {error && (
                                        <motion.div
                                            className="error-banner"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={error ? shakeAnimation : { opacity: 1, x: 0 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="form-field">
                                        <label htmlFor="email">Email Address</label>
                                        <div className="input-wrapper">
                                            <Mail size={18} className="input-icon" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                placeholder="john@example.com"
                                                className="form-input"
                                                disabled={loading}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        isLoading={loading}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        Reset Password
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <motion.div 
                                className="success-state"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: 'center', padding: '2rem 0 1rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle size={32} color="#2ecc71" />
                                    </div>
                                </div>
                                <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '0.75rem', fontWeight: 'bold' }}>Check your email</h2>
                                <p style={{ color: '#6B7280', marginBottom: '2rem', lineHeight: '1.5' }}>
                                    We sent a password reset link to <br/>
                                    <strong style={{ color: '#111827' }}>{email}</strong>
                                </p>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => navigate('/user-login')}
                                >
                                    Return to log in
                                </Button>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
