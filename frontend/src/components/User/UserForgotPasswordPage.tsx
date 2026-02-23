import { useState } from "react";
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/User/UserForgotPassword.css';

interface Props {
    onSubmitEmail: (email: string) => void;
}

export function UserForgotPasswordPage({ onSubmitEmail }: Props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitEmail(email);
        setIsSubmitted(true);
    };

    return (
        <div className="animated-login-wrapper">
            <div className="box">
                <button
                    onClick={() => navigate('/user-login', { replace: true })}
                    className="absolute-back-btn"
                >
                    <ArrowLeft size={24} color="#14919B" />
                </button>
                <div className="form">
                    <form onSubmit={handleSubmit}>

                        {!isSubmitted ? (
                            <>
                                <h2>User Forgot Password</h2>
                                <p className="subtitle">Enter your email address and we'll send you a link to reset your password.</p>

                                <div className="inputBox">
                                    <label htmlFor="email">Enter your email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@roomease.com"
                                    />
                                </div>

                                <button type="submit" className="btn-standard" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
                                    Send Reset Link
                                </button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                    <CheckCircle size={48} className="text-success" color="#2ecc71" />
                                </div>
                                <h3 style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Check your email</h3>
                                <p>We've sent a password reset link to <strong>{email}</strong></p>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}
