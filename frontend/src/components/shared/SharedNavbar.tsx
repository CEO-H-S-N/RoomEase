import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, Edit, Lock, ShieldCheck, ChevronDown, Bell, Sparkles, Heart, Clock } from 'lucide-react';
import './SharedNavbar.css';

interface SharedNavbarProps {
    currentPage: 'dashboard' | 'listings' | 'ai-picks' | 'map' | 'chat' | 'profiles' | 'profile' | 'red-flag-alert' | 'wishlist' | 'other';
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
    const navigate = useNavigate();
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
                <div className="navbar-main-group">
                    <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
                        <Home size={32} className="logo-icon" />
                        <span className="logo-text">ROOMEASE</span>
                    </div>

                    <div className="navbar-links">
                        <button
                            className={`nav-link ${currentPage === 'ai-picks' ? 'active' : ''}`}
                            onClick={() => onNavigate('ai-picks')}
                        >
                            <Sparkles size={18} className="nav-icon-inline" />
                            <span>AI Picks</span>
                        </button>
                        <button
                            className={`nav-link ${currentPage === 'map' ? 'active' : ''}`}
                            onClick={() => onNavigate('map')}
                        >
                            <span>Map</span>
                            <ChevronDown size={14} className="nav-chevron" />
                        </button>
                        <button
                            className={`nav-link ${currentPage === 'profiles' ? 'active' : ''}`}
                            onClick={() => onNavigate('profiles')}
                        >
                            <span>People</span>
                            <ChevronDown size={14} className="nav-chevron" />
                        </button>
                        <button
                            className={`nav-link ${currentPage === 'chat' ? 'active' : ''}`}
                            onClick={() => onNavigate('chat')}
                        >
                            <span>Chats</span>
                            <ChevronDown size={14} className="nav-chevron" />
                        </button>
                    </div>
                </div>

                {/* User Section with Settings Dropdown */}
                <div className="navbar-user" ref={dropdownRef}>
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
                                    onNavigate('notifications');
                                }}
                            >
                                <Bell size={18} />
                                <span>Notifications</span>
                            </button>
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
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSettingsOpen(false);
                                    navigate('/wishlist');
                                }}
                            >
                                <Heart size={18} />
                                <span>Wishlist</span>
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSettingsOpen(false);
                                    navigate('/history');
                                }}
                            >
                                <Clock size={18} />
                                <span>History</span>
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
            </div>
        </nav>
    );
};

export default SharedNavbar;
