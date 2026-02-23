import React, { useState } from 'react';
import { Home, Bell, User, Settings, Lock, Camera, Trash2, UploadCloud } from 'lucide-react';
import '../../styles/Property Owner/SettingPage.css';

interface UserData {
    email: string;
    fullName: string;
}

interface SettingPageProps {
    user?: UserData;
    onLogout?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToNotification?: () => void;
}

export const SettingPage: React.FC<SettingPageProps> = ({
    user = { email: 'owner@example.com', fullName: 'Property Owner' },
    onLogout,
    onNavigateToDashboard,
    onNavigateToNotification
}) => {
    const [activeTab, setActiveTab] = useState<'user-settings' | 'preferences' | 'change-password'>('user-settings');

    // User Settings State
    const [formData, setFormData] = useState({
        name: user.fullName,
        email: user.email,
        mobile: '',
        landline: '',
        mobileCountry: 'Pakistan',
        landlineCountry: 'Pakistan',
        address: ''
    });

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Preferences State
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [showPhoneOnListings, setShowPhoneOnListings] = useState(true);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    return (
        <div className="setting-page-wrapper">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); onNavigateToDashboard?.(); }}>
                        <Home className="text-primary" size={24} style={{ color: '#14919B' }} />
                        <span className="fw-bold" style={{ color: '#14919B', fontSize: '1.25rem' }}>RoomEase</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#settingNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="settingNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <button className="btn btn-link text-secondary p-0 border-0 active-icon" title="Settings" onClick={(e) => e.preventDefault()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14919B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>
                            {onNavigateToNotification && (
                                <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); onNavigateToNotification(); }} title="Notifications">
                                    <Bell size={22} />
                                </button>
                            )}
                            <button className="btn-standard" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-fluid py-3 px-3">
                <header className="dashboard-header">
                    <div className="header-title-group">
                        <h1>Profolio</h1>
                        <p className="header-subtitle">Manage your profile and account settings.</p>
                    </div>
                </header>

                {/* Bootstrap Tabs */}
                <div className="">
                    <div className="border-bottom mb-0">
                        <ul className="nav nav-tabs border-bottom-0 gap-4">
                            <li className="nav-item">
                                <button
                                    className={`nav-link border-0 bg-transparent py-3 px-1 ${activeTab === 'user-settings' ? 'active-tab' : 'text-muted'}`}
                                    onClick={() => setActiveTab('user-settings')}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <User size={18} /> User Settings
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
                                        <Lock size={18} /> Change Password
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Tab Content */}
                    <div className="pt-0">
                        {/* User Settings Tab */}
                        {activeTab === 'user-settings' && (
                            <div className="animate-fade-in-up">
                                {/* Profile Header */}
                                <div className="py-4 pb-0 position-relative">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="position-relative hover-scale">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${formData.name}&background=random`}
                                                alt="Profile"
                                                className="rounded-circle"
                                                width="60"
                                                height="60"
                                            />
                                            <button className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm border p-1">
                                                <Camera size={12} />
                                            </button>
                                        </div>
                                        <div>
                                            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                                {formData.name}
                                                <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                    <User size={10} /> Individual
                                                </span>
                                            </h4>
                                            <p className="text-muted mb-0 small">{formData.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-standard d-flex align-items-center gap-2 position-absolute top-50 end-0 translate-middle-y me-4 hover-scale"
                                        onClick={() => alert('Delete account functionality coming soon')}
                                        style={{ borderColor: '#dc3545', color: '#dc3545' }}
                                    >
                                        <Trash2 size={16} /> Delete Account
                                    </button>
                                </div>

                                {/* Additional Information Form */}
                                <div className="py-4">
                                    <h5 className="fw-bold mb-4">Additional Information</h5>
                                    <form onSubmit={handleSave}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control bg-light"
                                                    value={formData.email}
                                                    disabled
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Mobile</label>
                                                <div className="input-group">
                                                    <select
                                                        className="form-select"
                                                        style={{ maxWidth: '120px' }}
                                                        value={formData.mobileCountry}
                                                        onChange={(e) => handleInputChange('mobileCountry', e.target.value)}
                                                    >
                                                        <option>Pakistan</option>
                                                        <option>USA</option>
                                                        <option>UK</option>
                                                        <option>UAE</option>
                                                    </select>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Enter mobile number"
                                                        value={formData.mobile}
                                                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Landline</label>
                                                <div className="input-group">
                                                    <select
                                                        className="form-select"
                                                        style={{ maxWidth: '120px' }}
                                                        value={formData.landlineCountry}
                                                        onChange={(e) => handleInputChange('landlineCountry', e.target.value)}
                                                    >
                                                        <option>Pakistan</option>
                                                        <option>USA</option>
                                                        <option>UK</option>
                                                        <option>UAE</option>
                                                    </select>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Enter landline number"
                                                        value={formData.landline}
                                                        onChange={(e) => handleInputChange('landline', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 mt-4">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Address</label>
                                                        <input
                                                            type="text"
                                                            className="form-control bg-light"
                                                            placeholder="Flat 23 Beside U block near CUST"
                                                            value={formData.address}
                                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                                        />
                                                        <div className="form-check mt-3">
                                                            <input className="form-check-input" type="checkbox" id="updateListings" />
                                                            <label className="form-check-label text-muted small" htmlFor="updateListings">
                                                                Update details in all property listings
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Upload a picture</label>
                                                        <div
                                                            className="rounded d-flex align-items-center justify-content-center"
                                                            style={{
                                                                border: '1px dashed #28a745', // Green dashed border
                                                                backgroundColor: '#f0fff4',   // Very light green background
                                                                cursor: 'pointer',
                                                                height: '50px',               // Sim height
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-2" style={{ color: '#00a884', fontWeight: 500 }}>
                                                                <UploadCloud size={20} />
                                                                <span>Browse and Upload</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center mt-4">
                                            <button type="submit" className="btn-standard">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="animate-fade-in-up">
                                <div className="py-4 pb-0">
                                    <h4 className="fw-bold mb-0">Preferences</h4>
                                    <p className="text-muted small">Manage your notification and privacy preferences.</p>
                                </div>
                                <div className="py-4">
                                    <div className="form-check form-switch mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
                                        <div>
                                            <label className="form-check-label fw-medium" htmlFor="emailNotif">Email Notifications</label>
                                            <p className="text-muted small mb-0">Receive email updates about your listings and matches</p>
                                        </div>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="emailNotif"
                                            checked={emailNotifications}
                                            onChange={(e) => setEmailNotifications(e.target.checked)}
                                            style={{ width: '3rem', height: '1.5rem' }}
                                        />
                                    </div>
                                    <div className="form-check form-switch mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
                                        <div>
                                            <label className="form-check-label fw-medium" htmlFor="smsNotif">SMS Notifications</label>
                                            <p className="text-muted small mb-0">Receive SMS alerts for important updates</p>
                                        </div>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="smsNotif"
                                            checked={smsNotifications}
                                            onChange={(e) => setSmsNotifications(e.target.checked)}
                                            style={{ width: '3rem', height: '1.5rem' }}
                                        />
                                    </div>
                                    <div className="form-check form-switch mb-4 d-flex justify-content-between align-items-center">
                                        <div>
                                            <label className="form-check-label fw-medium" htmlFor="showPhone">Show Phone on Listings</label>
                                            <p className="text-muted small mb-0">Display your phone number on property listings</p>
                                        </div>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="showPhone"
                                            checked={showPhoneOnListings}
                                            onChange={(e) => setShowPhoneOnListings(e.target.checked)}
                                            style={{ width: '3rem', height: '1.5rem' }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mt-4">
                                        <button type="button" className="btn-standard" onClick={() => alert('Preferences saved!')}>
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Change Password Tab */}
                        {activeTab === 'change-password' && (
                            <div className="animate-fade-in-up">
                                <div className="py-4 pb-0">
                                    <h4 className="fw-bold mb-0">Change Password</h4>
                                    <p className="text-muted small">Update your password for better security.</p>
                                </div>
                                <div className="py-4">
                                    <form onSubmit={handleSave} style={{ maxWidth: '500px' }}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter current password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-medium">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-center mt-4">
                                            <button type="submit" className="btn-standard">
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;
