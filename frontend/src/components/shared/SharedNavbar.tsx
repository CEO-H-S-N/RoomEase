import React, { useState, useRef, useEffect } from 'react';
import { Home, LogOut, Edit, Lock, ShieldCheck, ChevronDown, AlertTriangle, Bell, MapPin } from 'lucide-react';
import './SharedNavbar.css';

interface SharedNavbarProps {
    currentPage: 'dashboard' | 'listings' | 'map' | 'chat' | 'profiles' | 'matches' | 'profile' | 'red-flag-alert' | 'other';
    onNavigate: (page: string) => void;
    onLogout: () => void;
    userName?: string;
    userAvatar?: string;
}

const SharedNavbar: React.FC<SharedNavbarProps> = ({
    currentPage,
    onNavigate,
    onLogout,
    userName = 'User',
    userAvatar
}) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="shared-navbar">
            <div className="navbar-container">
                {/* Center Cluster: Logo + Links */}
                {/* Left: Logo */}
                <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
                    <Home size={32} className="logo-icon" />
                    <span className="logo-text">ROOMEASE</span>
                </div>

                {/* Center: Links */}
                <div className="navbar-links">
                    <button
                        className={`nav-link ${currentPage === 'listings' ? 'active' : ''}`}
                        onClick={() => onNavigate('listings')}
                    >
                        <span>Listings</span>
                        <ChevronDown size={14} className="nav-chevron" />
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'map' ? 'active' : ''}`}
                        onClick={() => onNavigate('map')}
                    >
                        <MapPin size={18} className="nav-icon-inline" />
                        <span>Map</span>
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'profiles' ? 'active' : ''}`}
                        onClick={() => onNavigate('profiles')}
                    >
                        <span>People</span>
                        <ChevronDown size={14} className="nav-chevron" />
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'matches' ? 'active' : 'pulse-link'}`}
                        onClick={() => onNavigate('matches')}
                    >
                        <span>Matches</span>
                        <ChevronDown size={14} className="nav-chevron" />
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'chat' ? 'active' : ''}`}
                        onClick={() => onNavigate('chat')}
                    >
                        <span>Chats</span>
                        <ChevronDown size={14} className="nav-chevron" />
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'red-flag-alert' ? 'active' : ''}`}
                        onClick={() => onNavigate('red-flag-alert')}
                    >
                        <AlertTriangle size={18} className="nav-icon-inline" />
                        <span>Red Flags</span>
                    </button>
                </div>

                {/* User Section with Settings Dropdown */}
                <div className="navbar-user" ref={dropdownRef}>
                    <button
                        className="user-button"
                        style={{ marginRight: '12px', padding: '8px', border: 'none' }}
                        onClick={() => onNavigate('notification')}
                        title="Notifications"
                    >
                        <Bell size={22} color="white" />
                    </button>

                    <button
                        className="user-button"
                        onClick={() => setSettingsOpen(!settingsOpen)}
                    >
                        <div className="user-avatar">
                            {userAvatar ? (
                                <img src={userAvatar} alt={userName} />
                            ) : (
                                <span>{getInitials(userName)}</span>
                            )}
                        </div>
                        <span className="user-name">{userName}</span>
                        <ChevronDown
                            size={16}
                            className={`dropdown-icon ${settingsOpen ? 'open' : ''}`}
                        />
                    </button>

                    {/* Settings Dropdown */}
                    {settingsOpen && (
                        <div className="settings-dropdown">
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSettingsOpen(false);
                                    onNavigate('edit-profile');
                                }}
                            >
                                <Edit size={18} />
                                <span>Edit Profile</span>
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSettingsOpen(false);
                                    onNavigate('change-password');
                                }}
                            >
                                <Lock size={18} />
                                <span>Change Password</span>
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSettingsOpen(false);
                                    onNavigate('verification');
                                }}
                            >
                                <ShieldCheck size={18} />
                                <span>Get Verified</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button
                                className="dropdown-item logout"
                                onClick={() => {
                                    setSettingsOpen(false);
                                    onLogout();
                                }}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div >
        </nav >
    );
};

export default SharedNavbar;
