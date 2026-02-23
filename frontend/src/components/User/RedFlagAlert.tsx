import React, { useState } from 'react';
import SharedNavbar from '../shared/SharedNavbar';
import '../../styles/User/RedFlagAlert.css';

interface User {
    email: string;
    fullName: string;
}

interface RedFlagAlertProps {
    user: User;
    onLogout: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToMatches: () => void;
    onNavigateToMessages: () => void;
    onNavigateToMap: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToCreateProfile: () => void;
    onNavigateToListing: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToProfiles?: () => void;
    onNavigateToSetting?: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToNotification?: () => void;
}

export const RedFlagAlert: React.FC<RedFlagAlertProps> = ({
    user,
    onLogout,
    onNavigateToVerification,
    onNavigateToDashboard,
    onNavigateToListing,
    onNavigateToMap,
    onNavigateToProfiles,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToNotification,
    onNavigateToRedFlagAlert
}) => {

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': window.location.href = '/messages'; break;
            case 'profiles': onNavigateToProfiles?.(); break;
            case 'edit-profile': onNavigateToSetting?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
            case 'map': onNavigateToMap?.(); break;
            case 'notification': onNavigateToNotification?.(); break;
        }
    };

    const [alerts] = useState([
        { id: 1, title: 'Suspicious Activity Detected', reportedPerson: 'JohnDoe123', description: 'Requested money before meeting.', severity: 'High', date: '2025-01-01' },
        { id: 2, title: 'Profile Verification Failed', reportedPerson: 'Alex', description: 'Person upload wrong file and empty.', severity: 'Medium', date: '2024-12-30' },
        { id: 3, title: 'Document Missing', reportedPerson: 'Taylor', description: 'Person did not upload document.', severity: 'High', date: '2024-12-28' },
    ]);

    return (
        <div className="red-flag-container brown-gradient-bg">
            <SharedNavbar
                currentPage="other"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName}
            />

            {/* Main Content */}
            <main className="red-flag-content">
                <header className="red-flag-header">
                    <h1 className="red-flag-title">Red Flag Alerts & Safety</h1>
                    <p className="red-flag-subtitle">Stay informed about potential risks and safety updates.</p>
                </header>

                <div className="alerts-list">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert-card severity-${alert.severity.toLowerCase()}`}>
                            <div className="alert-header">
                                <h3 className="alert-title">{alert.title}</h3>
                                <span className="alert-date">{alert.date}</span>
                            </div>

                            <div className="alert-details">
                                <div className="detail-row">
                                    <span className="detail-label">Person:</span>
                                    <span className="detail-value">{alert.reportedPerson}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Description:</span>
                                    <p className="detail-value description-text">{alert.description}</p>
                                </div>
                            </div>

                            <div className="alert-footer">
                                <span className="alert-severity">{alert.severity} Priority</span>
                                <button className="report-btn">Report</button>
                            </div>
                        </div>
                    ))}
                </div>


            </main>

        </div>
    );
};
