import React from 'react';
import SharedNavbar from '../shared/SharedNavbar';
import '../../styles/User/NewMatchCrt.css'; // Import the specific CSS

interface NewMatchCrtProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToMap: () => void;
    onNavigateToSetting: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToProfiles?: () => void;
}

import { useNavigate } from 'react-router-dom';

export default function NewMatchCrt({
    onLogout,
    onNavigateToDashboard,
    onNavigateToListing,

    onNavigateToNotification,
    onNavigateToMap,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToProfiles,
    onNavigateToRedFlagAlert
}: NewMatchCrtProps) {
    const [hoveredMatch, setHoveredMatch] = React.useState<string | null>(null);

    const navigate = useNavigate();

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': window.location.href = '/messages'; break;
            case 'profiles': onNavigateToProfiles?.(); break;
            case 'edit-profile': onNavigateToSetting?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'map': onNavigateToMap(); break;
            case 'notification': onNavigateToNotification?.(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
        }
    };

    const matchesData = [
        { id: '1', name: 'Ali Khan', role: 'Student', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400' },
        { id: '2', name: 'Bilal Raza', role: 'Professional', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=400&h=400' },
        { id: '3', name: 'Moiz', role: 'Designer', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?fit=crop&w=400&h=400' },
        { id: '4', name: 'Usman Khan', role: 'Researcher', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=400&h=400' },
        { id: '5', name: 'Omar Farooq', role: 'Developer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=400&h=400' },
        { id: '6', name: 'Hassam', role: 'Artist', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=400&h=400' },
    ];

    return (
        <div className="new-match-container brown-gradient-bg">
            <SharedNavbar
                currentPage="other"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName="User"
            />

            <main className="new-match-content">
                <div className="new-match-card">
                    <div className="new-match-header">
                        <h2 className="new-match-title">New Matches</h2>
                        <p className="text-muted">Discover people who match your preferences.</p>
                    </div>

                    <div className="matches-interactive-list">
                        {matchesData.map((match) => (
                            <div
                                key={match.id}
                                className="match-list-item"
                                onMouseEnter={() => setHoveredMatch(match.id)}
                                onMouseLeave={() => setHoveredMatch(null)}
                                onClick={() => navigate('/view-profile')}
                            >
                                <div className="match-info-group">
                                    <span className="match-name">{match.name}</span>
                                    <span className="match-role">/ {match.role}</span>
                                </div>
                                <div className="match-action-arrow">
                                    <span className="about-text">VIEW PROFILE</span> ↗
                                </div>

                                {/* Hover Image Display - Inside Item for Relative Positioning */}
                                <div className={`match-hover-image-container ${hoveredMatch === match.id ? 'visible' : ''}`}>
                                    <img
                                        src={match.image}
                                        alt="Match"
                                        className="match-hover-img"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
