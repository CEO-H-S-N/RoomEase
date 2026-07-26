import React, { useState } from 'react';
import { Home, Bell, User, Settings, Lock, Camera, Trash2, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Property Owner/SettingPage.css';

interface UserData {
    email: string;
    fullName: string;
    id?: string;
}

interface SettingPageProps {
    user?: UserData;
    onLogout?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToNotification?: () => void;
}

export const SettingPage: React.FC<SettingPageProps> = ({
    user: initialUser = { email: 'owner@example.com', fullName: 'Property Owner' },
    onLogout: _onLogout,
    onNavigateToDashboard: _onNavigateToDashboard,
    onNavigateToNotification: _onNavigateToNotification
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'user-settings' | 'preferences' | 'change-password'>('user-settings');
    const [isSaving, setIsSaving] = useState(false);

    // User Settings State
    const [formData, setFormData] = useState({
        name: initialUser.fullName,
        email: initialUser.email,
        mobile: '',
        landline: '',
        mobileCountry: 'Pakistan',
        landlineCountry: 'Pakistan',
        address: ''
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        showPhoneOnListings: true
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Simulated backend call
            await new Promise(resolve => setTimeout(resolve, 800));
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert('Passwords do not match');
            return;
        }
        setIsSaving(true);
        try {
            // Simulated backend call
            await new Promise(resolve => setTimeout(resolve, 800));
            alert('Password changed successfully!');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            alert('Failed to update password');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreferenceSave = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            alert('Preferences saved!');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="setting-page-wrapper">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); navigate('/property-owner-dashboard'); }}>
                        <Home className="brand-icon" size={24} />
                        <span className="brand-text fw-bold" style={{ fontSize: '1.25rem' }}>RoomEase</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#settingNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="settingNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <button className="btn btn-link text-secondary p-0 border-0 active-icon" title="Settings">
                                <Settings size={22} className="brand-icon" />
                            </button>
                            <button className="btn btn-link text-secondary p-0 border-0" onClick={() => navigate('/property-owner-notifications')} title="Notifications">
                                <Bell size={22} />
                            </button>
                            <button className="btn-standard" onClick={() => navigate('/')}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                <header className="dashboard-header animate-fade-in-up">
                    <div className="header-title-group">
                        <h1>Profile Settings</h1>
                        <p className="header-subtitle">Manage your account information and preferences.</p>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div className="mb-5 animate-fade-in-up">
                    <ul className="nav nav-tabs gap-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 bg-transparent py-3 px-1 ${activeTab === 'user-settings' ? 'active-tab' : 'text-muted'}`}
                                onClick={() => setActiveTab('user-settings')}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <User size={18} /> Account Info
                                </div>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 bg-transparent py-3 px-1 ${activeTab === 'preferences' ? 'active-tab' : 'text-muted'}`}
                                onClick={() => setActiveTab('preferences')}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <Settings size={18} /> Preferences
                                </div>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 bg-transparent py-3 px-1 ${activeTab === 'change-password' ? 'active-tab' : 'text-muted'}`}
                                onClick={() => setActiveTab('change-password')}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <Lock size={18} /> Security
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Account Info Tab */}
                    {activeTab === 'user-settings' && (
                        <div className="animate-fade-in-up">
                            <div className="profile-card">
                                <div className="d-flex align-items-center justify-content-between mb-5">
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="avatar-container">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${formData.name}&background=D4745E&color=fff`}
                                                alt="Profile"
                                                className="avatar-img rounded-circle"
                                            />
                                            <button className="btn-camera-upload">
                                                <Camera size={14} />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="fw-bold mb-1">{formData.name}</h3>
                                            <p className="text-muted mb-0">{formData.email}</p>
                                        </div>
                                    </div>
                                    <button className="btn-delete-account d-flex align-items-center gap-2">
                                        <Trash2 size={16} /> Delete Account
                                    </button>
                                </div>

                                <form onSubmit={handleProfileSave}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Mobile Number</label>
                                            <div className="input-group">
                                                <select
                                                    className="form-select border-end-0"
                                                    style={{ maxWidth: '120px' }}
                                                    value={formData.mobileCountry}
                                                    onChange={(e) => handleInputChange('mobileCountry', e.target.value)}
                                                >
                                                    <option>Pakistan</option>
                                                    <option>USA</option>
                                                    <option>UK</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    placeholder="Enter mobile"
                                                    value={formData.mobile}
                                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your address"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <div className="custom-upload-box mt-3">
                                                <div className="d-flex align-items-center justify-content-center gap-3">
                                                    <UploadCloud size={24} className="brand-icon" />
                                                    <div>
                                                        <p className="mb-0 fw-bold">Update Profile Picture</p>
                                                        <p className="mb-0 text-muted small">Max size 2MB, .jpg or .png</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 text-center">
                                        <button type="submit" className="btn-standard" disabled={isSaving}>
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="animate-fade-in-up">
                            <div className="profile-card">
                                <h4 className="fw-bold mb-4">Communication Preferences</h4>
                                <div className="pref-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">Email Notifications</h6>
                                        <p className="text-muted small mb-0">Get updates about your property inquiries and matches via email.</p>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={preferences.emailNotifications}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                                        />
                                    </div>
                                </div>
                                <div className="pref-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">SMS Alerts</h6>
                                        <p className="text-muted small mb-0">Receive instant SMS alerts for critical platform updates.</p>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={preferences.smsNotifications}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                                        />
                                    </div>
                                </div>
                                <div className="pref-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">Privacy Controls</h6>
                                        <p className="text-muted small mb-0">Show your phone number on all active listings.</p>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={preferences.showPhoneOnListings}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, showPhoneOnListings: e.target.checked }))}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 text-center">
                                    <button className="btn-standard" onClick={handlePreferenceSave} disabled={isSaving}>
                                        {isSaving ? 'Updating...' : 'Update Preferences'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'change-password' && (
                        <div className="animate-fade-in-up">
                            <div className="profile-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <h4 className="fw-bold mb-4">Security Settings</h4>
                                <form onSubmit={handlePasswordUpdate}>
                                    <div className="mb-4">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="••••••••"
                                            value={passwordData.current}
                                            onChange={(e) => handlePasswordChange('current', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="••••••••"
                                            value={passwordData.new}
                                            onChange={(e) => handlePasswordChange('new', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="••••••••"
                                            value={passwordData.confirm}
                                            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-5 text-center">
                                        <button type="submit" className="btn-standard" disabled={isSaving}>
                                            {isSaving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingPage;
