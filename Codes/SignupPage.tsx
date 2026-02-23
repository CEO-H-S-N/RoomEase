AnaylitcspAGE 
import React from "react";
import "../styles/AnalyticsReportPage.css";

interface AnalyticsReportPageProps {
    user: { fullName: string; email: string };
    onLogout: () => void;
    onNavigateToDashboard: () => void;
}

export const AnalyticsReportPage: React.FC<AnalyticsReportPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
}) => {
    return (
        <div className="dashboard-container">
            {/* Navbar - Same as Dashboard */}
            <nav className="dashboard-navbar">
                <div className="nav-left">
                    <div className="logo-section">
                        <span className="logo-text">RoomEase</span>
                    </div>
                </div>

                <div className="nav-center">
                    <button className="nav-link active" onClick={onNavigateToDashboard}>
                        Home
                    </button>
                    <a href="#" className="nav-link">
                        Create Profile
                    </a>
                    <a href="#" className="nav-link">
                        Match
                    </a>
                    <a href="#" className="nav-link">
                        Map
                    </a>
                    <a href="#" className="nav-link">
                        Listing
                    </a>
                    <a href="#" className="nav-link">
                        Message
                    </a>
                    <a href="#" className="nav-link">
                        Red Flag Alert
                    </a>
                </div>

                <div className="nav-right">
                    <a href="#" className="settings-link">
                        Setting
                    </a>
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <div className="dashboard-hero">
                    <header className="header">
                        <div className="header-left">
                            <h1 className="header-title">Analytics Report</h1>
                            <p className="header-subtitle">Detailed insights and compatibility metrics</p>
                        </div>
                    </header>
                </div>

                {/* Placeholder Content */}
                <div style={{ padding: "0 32px" }}>
                    <div className="section shadow border-0" style={{ minHeight: "300px" }}>
                        <p style={{ color: "#6b7280" }}>Detailed analytics content will go here...</p>
                    </div>
                </div>
            </main>
        </div>
    );
};
