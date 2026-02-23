import React, { useState } from 'react';
import '../../styles/User/NotificationPage.css';
import SharedNavbar from '../shared/SharedNavbar';
import { Bell, CheckCircle, Clock } from 'lucide-react';

interface NotificationPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToMap: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification: () => void;
    onNavigateToMatches?: () => void;
}

export const NotificationPage: React.FC<NotificationPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToRedFlagAlert,
    onNavigateToMap,
    onNavigateToListing,
    onNavigateToNotification,
    onNavigateToMatches
}) => {
    const [notifications] = useState([
        {
            id: 1,
            title: "New Match Found!",
            description: "You have a new match with Ali Khan based on your preferences.",
            time: "2 mins ago",
            read: false,
            type: 'match'
        },
        {
            id: 2,
            title: "Message Received",
            description: "Sarah sent you a message about the apartment listing.",
            time: "1 hour ago",
            read: true,
            type: 'message'
        },
        {
            id: 3,
            title: "Profile Verified",
            description: "Your profile has been successfully verified by the admin.",
            time: "1 day ago",
            read: true,
            type: 'system'
        }
    ]);

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard':
                onNavigateToDashboard();
                break;
            case 'listings':
                onNavigateToListing();
                break;
            case 'map':
                onNavigateToMap();
                break;
            case 'red-flag-alert':
                onNavigateToRedFlagAlert();
                break;
            case 'edit-profile':
                onNavigateToSetting();
                break;
            case 'notification':
                onNavigateToNotification();
                break;
            case 'matches':
                onNavigateToMatches?.();
                break;
            case 'chat':
                // Assuming chat navigation is not passed in props yet or handled differently
                // onNavigateToMessages?.(); 
                break;
            case 'profiles':
                // onNavigateToProfiles?.();
                break;
        }
    };

    return (
        <div className="notification-page-modern">
            <SharedNavbar
                currentPage="other"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName="User"
            />

            <main className="notification-main-content">
                <div className="notification-container">
                    <div className="notification-header-section">
                        <h1 className="page-title">Notifications</h1>
                        <span className="notification-count">{notifications.filter(n => !n.read).length} new</span>
                    </div>

                    <div className="notification-grid">
                        {notifications.map(notification => (
                            <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                                <div className="notification-icon-box">
                                    <Bell size={20} />
                                </div>
                                <div className="notification-content-box">
                                    <div className="notification-top-row">
                                        <h3 className="notification-item-title">{notification.title}</h3>
                                        <span className="notification-timestamp">
                                            <Clock size={12} style={{ marginRight: '4px' }} />
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="notification-text">{notification.description}</p>
                                </div>
                                {!notification.read && <div className="unread-dot"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="dashboard-footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
