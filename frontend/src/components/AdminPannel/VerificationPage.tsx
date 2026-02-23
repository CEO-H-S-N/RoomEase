import React, { useState } from 'react';
import '../../styles/AdminPannel/VerificationPage.css';
import { Eye } from 'lucide-react';

interface VerificationRequest {
    id: number;
    name: string;
    avatar: string;
    type: string;
    docCount: number;
    time: string;
}

interface VerificationPageProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSetting: () => void;
    onLogout: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onNavigateToProfile,
    onNavigateToSetting,
    onLogout
}) => {
    // Mock Data based on Screenshot
    const [requests] = useState<VerificationRequest[]>([
        {
            id: 1,
            name: 'Khayyam',
            avatar: 'https://ui-avatars.com/api/?name=KH&background=008C9E&color=fff&size=128',
            type: 'ID Verification',
            docCount: 3,
            time: 'Submitted 2 hours ago'
        },
        {
            id: 2,
            name: 'Umar',
            avatar: 'https://ui-avatars.com/api/?name=UM&background=a3d900&color=fff&size=128',
            type: 'Property Ownership',
            docCount: 5,
            time: 'Submitted 5 hours ago'
        },
        {
            id: 3,
            name: 'Ali',
            avatar: 'https://ui-avatars.com/api/?name=AL&background=ff7f50&color=fff&size=128',
            type: 'ID Verification',
            docCount: 2,
            time: 'Submitted 1 day ago'
        }
    ]);

    return (
        <div className="verification-page-container">
            {/* Top Navbar - Scoped to Verification Page */}
            <nav className="verification-page-navbar">
                <div className="logo-section">
                    <span className="logo-text">RoomEase</span>
                </div>

                <div className="nav-center">
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToUser(); }}>
                        User
                    </a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToListing(); }}>
                        Listing
                    </a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToVerification(); }}>
                        Verification
                    </a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToAnalytics(); }}>
                        Analytics
                    </a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToProfile(); }}>
                        My Profile
                    </a>
                </div>

                <div className="nav-right">
                    <a href="#" className="nav-link" style={{ marginRight: '20px' }} onClick={(e) => { e.preventDefault(); onNavigateToSetting(); }}>
                        Setting
                    </a>
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="verification-content">
                <div className="verification-header-center">
                    <h1 className="verification-title">Welcome Admin</h1>
                </div>

                <div className="queue-section">
                    <h2 className="queue-section-title">Verification Queue</h2>
                    <p className="queue-section-subtitle">Review pending verification requests</p>

                    <div className="requests-list">
                        {requests.map((request) => (
                            <div key={request.id} className="verification-card">
                                <div className="user-info-section">
                                    <img src={request.avatar} alt={request.name} className="user-avatar-large" />
                                    <div className="user-details">
                                        <span className="user-name-large">{request.name}</span>
                                        <div className="verification-meta">
                                            <span>{request.type}</span>
                                            <span className="meta-divider">•</span>
                                            <span>{request.docCount} documents</span>
                                            <span className="meta-divider">•</span>
                                            <span>{request.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button className="btn-pill btn-approve-pill">Approve</button>
                                    <button className="btn-pill btn-reject-pill">Reject</button>
                                    <button className="btn-view-icon">
                                        <Eye size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
