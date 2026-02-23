import React from 'react';
import '../../styles/AdminPannel/AnalyticsPage.css';
import { Users, Home, UserCheck, BarChart3, TrendingUp } from 'lucide-react';

interface AnalyticsPageProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSetting: () => void;
    onLogout: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onNavigateToProfile,
    onNavigateToSetting,
    onLogout
}) => {
    return (
        <div className="analytics-page-container">
            {/* Top Navbar - Scoped to Analytics Page */}
            <nav className="analytics-page-navbar">
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
            <div className="analytics-content">


                <div className="analytics-header">
                    <h1 className="analytics-title">Welcome Admin</h1>
                </div>

                <div className="dashboard-section">
                    <h2 className="dashboard-section-title">Analytics Report</h2>
                    <p className="dashboard-section-subtitle">Platform performance and statistics</p>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        {/* Total Users */}
                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-purple">
                                    <Users size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">12,458</div>
                                <div className="stats-label">Total Users</div>
                                <div className="stats-trend text-success">+12% this month</div>
                            </div>
                        </div>

                        {/* Active Listings */}
                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-blue">
                                    <Home size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">3,247</div>
                                <div className="stats-label">Active Listings</div>
                                <div className="stats-trend text-success">+8% this month</div>
                            </div>
                        </div>

                        {/* Verified Users */}
                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-green">
                                    <UserCheck size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">8,945</div>
                                <div className="stats-label">Verified Users</div>
                                <div className="stats-trend text-success">+12% this month</div>
                            </div>
                        </div>

                        {/* Total Matches */}
                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-purple">
                                    <BarChart3 size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">42,891</div>
                                <div className="stats-label">Total Matches</div>
                                <div className="stats-trend text-success">+22% this month</div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="charts-grid">
                        {/* User Growth Chart Placeholder */}
                        <div className="chart-card">
                            <div className="chart-title">User Growth</div>
                            <div className="chart-placeholder">
                                {/* Simulated bars */}
                                <div className="chart-bar" style={{ height: '30%' }}></div>
                                <div className="chart-bar" style={{ height: '45%' }}></div>
                                <div className="chart-bar" style={{ height: '40%' }}></div>
                                <div className="chart-bar" style={{ height: '60%' }}></div>
                                <div className="chart-bar" style={{ height: '75%' }}></div>
                                <div className="chart-bar" style={{ height: '90%' }}></div>

                                <div className="chart-x-axis">
                                    <span className="chart-label">Jan</span>
                                    <span className="chart-label">Feb</span>
                                    <span className="chart-label">Mar</span>
                                    <span className="chart-label">Apr</span>
                                    <span className="chart-label">May</span>
                                    <span className="chart-label">Jun</span>
                                </div>
                            </div>
                        </div>

                        {/* Listing Activity Chart Placeholder */}
                        <div className="chart-card">
                            <div className="chart-title">Listing Activity</div>
                            <div className="chart-placeholder">
                                {/* Simulated bars */}
                                <div className="chart-bar" style={{ height: '20%' }}></div>
                                <div className="chart-bar" style={{ height: '35%' }}></div>
                                <div className="chart-bar" style={{ height: '50%' }}></div>
                                <div className="chart-bar" style={{ height: '45%' }}></div>
                                <div className="chart-bar" style={{ height: '65%' }}></div>
                                <div className="chart-bar" style={{ height: '80%' }}></div>

                                <div className="chart-x-axis">
                                    <span className="chart-label">Jan</span>
                                    <span className="chart-label">Feb</span>
                                    <span className="chart-label">Mar</span>
                                    <span className="chart-label">Apr</span>
                                    <span className="chart-label">May</span>
                                    <span className="chart-label">Jun</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
