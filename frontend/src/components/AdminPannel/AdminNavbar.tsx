import React from 'react';
import '../../styles/AdminPannel/AdminNavbar.css';

export type AdminPage = 'user' | 'listing' | 'verification' | 'analytics';

interface AdminNavbarProps {
    activePage: AdminPage;
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onLogout: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
    activePage,
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onLogout
}) => {
    return (
        <nav className="admin-shared-navbar">
            <div className="admin-nav-logo">
                <span className="admin-nav-logo-text">RoomEase</span>
            </div>

            <div className="admin-nav-links">
                <a
                    href="#"
                    className={`admin-nav-link${activePage === 'user' ? ' active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigateToUser(); }}
                >
                    User
                </a>
                <a
                    href="#"
                    className={`admin-nav-link${activePage === 'listing' ? ' active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigateToListing(); }}
                >
                    Listing
                </a>
                <a
                    href="#"
                    className={`admin-nav-link${activePage === 'verification' ? ' active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigateToVerification(); }}
                >
                    Verification
                </a>
                <a
                    href="#"
                    className={`admin-nav-link${activePage === 'analytics' ? ' active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigateToAnalytics(); }}
                >
                    Analytics
                </a>
            </div>

            <div className="admin-nav-right">
                <button className="admin-nav-logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};
