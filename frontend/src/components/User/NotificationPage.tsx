import React, { useState } from 'react';
import '../../styles/User/NotificationPage.css';
import { Bell, Home } from 'lucide-react';

interface NotificationPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToMap: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification: () => void;
}

export const NotificationPage: React.FC<NotificationPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToRedFlagAlert,
    onNavigateToMap,
    onNavigateToListing,
    onNavigateToNotification
}) => {
    const [notifications] = useState([
        {
            id: 1,
            title: "New Match Found!",
            description: "You have a new match with Ali Khan based on your preferences.",
            time: "2 mins ago",
            read: false
        },
        {
            id: 2,
            title: "Message Received",
            description: "Sarah sent you a message about the apartment listing.",
            time: "1 hour ago",
            read: true
        },
        {
            id: 3,
            title: "Profile Verified",
            description: "Your profile has been successfully verified by the admin.",
            time: "1 day ago",
            read: true
        }
    ]);

    return (
        <div className="notification-page-container">
            {/* Navbar */}
            {/* Navbar (Bootstrap Standardized) */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    {/* Logo Section */}
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); onNavigateToDashboard(); }}>
                        <Home className="text-primary" size={24} style={{ color: '#14919B' }} />
                        <span className="fw-bold" style={{ color: '#14919B', fontSize: '1.25rem' }}>RoomEase</span>
                    </a>

                    {/* Toggle Button for Mobile */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardNavbar" aria-controls="dashboardNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse" id="dashboardNavbar">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-3">
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-medium"
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onNavigateToDashboard(); }}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-medium"
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onNavigateToMap(); }}
                                >
                                    Map
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-medium"
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onNavigateToListing(); }}
                                >
                                    Listing
                                </a>
                            </li>
                            {onNavigateToRedFlagAlert && (
                                <li className="nav-item">
                                    <a className="nav-link fw-medium" href="#" onClick={(e) => { e.preventDefault(); onNavigateToRedFlagAlert(); }}>
                                        Red Flag Alert
                                    </a>
                                </li>
                            )}
                        </ul>

                        <div className="d-flex align-items-center gap-3">
                            {onNavigateToSetting && (
                                <a className="nav-link text-secondary fw-medium" href="#" onClick={(e) => { e.preventDefault(); onNavigateToSetting(); }}>Setting</a>
                            )}
                            {onNavigateToNotification && (
                                <button
                                    className="btn btn-link text-secondary p-0 border-0"
                                    onClick={(e) => { e.preventDefault(); onNavigateToNotification(); }}
                                >
                                    <Bell size={20} />
                                </button>
                            )}
                            <button className="btn-standard" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="notification-content">
                <div className="notification-header">
                    <h1 className="notification-title">Notifications</h1>
                </div>

                <div className="notification-list">
                    {notifications.map(notification => (
                        <div key={notification.id} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>

                            <div className="notification-details">
                                <div className="notification-card-header">
                                    <h3 className="notification-card-title">{notification.title}</h3>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                                <p className="notification-description">{notification.description}</p>
                            </div>
                            {!notification.read && <div className="unread-dot"></div>}
                        </div>
                    ))}
                </div>
            </main>
            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
