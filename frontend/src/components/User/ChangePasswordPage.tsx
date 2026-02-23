import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import './ChangePasswordPage.css';

interface ChangePasswordPageProps {
    onNavigateBack: () => void;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ onNavigateBack }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
        };
    };

    const passwordStrength = validatePassword(newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (!passwordStrength.isValid) {
            setError('New password does not meet requirements');
            return;
        }

        if (currentPassword === newPassword) {
            setError('New password must be different from current password');
            return;
        }

        try {
            setLoading(true);

            await api.changePassword(currentPassword, newPassword);

            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Redirect after 2 seconds
            setTimeout(() => {
                onNavigateBack();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page brown-gradient-bg">
            <div className="change-password-container">
                <div className="change-password-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <Lock size={32} />
                        </div>
                        <h1>Change Password</h1>
                        <p>Update your password to keep your account secure</p>
                    </div>

                    {success && (
                        <div className="success-message">
                            <CheckCircle size={20} />
                            <span>Password changed successfully! Redirecting...</span>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <XCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="password-form">
                        {/* Current Password */}
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            {newPassword && (
                                <div className="password-requirements">
                                    <div className={`requirement ${passwordStrength.minLength ? 'met' : ''}`}>
                                        {passwordStrength.minLength ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        <span>At least 8 characters</span>
                                    </div>
                                    <div className={`requirement ${passwordStrength.hasUpperCase ? 'met' : ''}`}>
                                        {passwordStrength.hasUpperCase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        <span>One uppercase letter</span>
                                    </div>
                                    <div className={`requirement ${passwordStrength.hasLowerCase ? 'met' : ''}`}>
                                        {passwordStrength.hasLowerCase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        <span>One lowercase letter</span>
                                    </div>
                                    <div className={`requirement ${passwordStrength.hasNumber ? 'met' : ''}`}>
                                        {passwordStrength.hasNumber ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        <span>One number</span>
                                    </div>
                                    <div className={`requirement ${passwordStrength.hasSpecialChar ? 'met' : ''}`}>
                                        {passwordStrength.hasSpecialChar ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        <span>One special character</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your new password"
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <span className="error-text">Passwords do not match</span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={onNavigateBack}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || success || !passwordStrength.isValid}
                            >
                                {loading ? 'Changing Password...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
