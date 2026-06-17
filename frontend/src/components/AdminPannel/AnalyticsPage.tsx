import React, { useState, useEffect } from 'react';
import '../../styles/AdminPannel/AnalyticsPage.css';
import { Users, Home, UserCheck, BarChart3, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { AdminNavbar } from './AdminNavbar';

interface AnalyticsData {
    stats: {
        totalUsers: number;
        activeListings: number;
        verifiedUsers: number;
        totalMatches: number;
    };
    userGrowth: { label: string; value: number }[];
    listingActivity: { label: string; value: number }[];
}

interface AnalyticsPageProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onLogout: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onLogout
}) => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const result = await api.getAnalytics();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="analytics-page-container">
                <div className="loading-state">Loading Analytics...</div>
            </div>
        );
    }

    const maxUserGrowth = Math.max(...(data?.userGrowth.map(d => d.value) || [1]));
    const maxListingActivity = Math.max(...(data?.listingActivity.map(d => d.value) || [1]));

    return (
        <div className="analytics-page-container">
            <AdminNavbar
                activePage="analytics"
                onNavigateToUser={onNavigateToUser}
                onNavigateToListing={onNavigateToListing}
                onNavigateToVerification={onNavigateToVerification}
                onNavigateToAnalytics={onNavigateToAnalytics}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <div className="analytics-content">
                <div className="analytics-header">
                    <h1 className="analytics-title">Welcome Admin</h1>
                </div>

                <div className="dashboard-section">
                    <h2 className="dashboard-section-title">Analytics Report</h2>
                    <p className="dashboard-section-subtitle">Real-time platform performance and statistics from the database</p>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-purple">
                                    <Users size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">{data?.stats.totalUsers.toLocaleString()}</div>
                                <div className="stats-label">Total Users</div>
                                <div className="stats-trend text-success">Live from database</div>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-blue">
                                    <Home size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">{data?.stats.activeListings.toLocaleString()}</div>
                                <div className="stats-label">Active Listings</div>
                                <div className="stats-trend text-success">Available properties</div>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-green">
                                    <UserCheck size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">{data?.stats.verifiedUsers.toLocaleString()}</div>
                                <div className="stats-label">Verified Users</div>
                                <div className="stats-trend text-success">Identity approved</div>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-header">
                                <div className="stats-icon-wrapper stats-icon-purple">
                                    <BarChart3 size={20} />
                                </div>
                                <TrendingUp size={16} className="text-success" />
                            </div>
                            <div>
                                <div className="stats-value">{data?.stats.totalMatches.toLocaleString()}</div>
                                <div className="stats-label">Total Likes/Matches</div>
                                <div className="stats-trend text-success">Community engagement</div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-title">User Registration Growth</div>
                            <div className="chart-placeholder">
                                {data?.userGrowth.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="chart-bar"
                                        style={{ height: `${(item.value / maxUserGrowth) * 90 + 10}%` }}
                                        title={`${item.value} users`}
                                    ></div>
                                ))}
                                <div className="chart-x-axis">
                                    {data?.userGrowth.map((item, idx) => (
                                        <span key={idx} className="chart-label">{item.label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-title">Listing Activity</div>
                            <div className="chart-placeholder">
                                {data?.listingActivity.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="chart-bar"
                                        style={{ height: `${(item.value / maxListingActivity) * 90 + 10}%` }}
                                        title={`${item.value} listings`}
                                    ></div>
                                ))}
                                <div className="chart-x-axis">
                                    {data?.listingActivity.map((item, idx) => (
                                        <span key={idx} className="chart-label">{item.label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
