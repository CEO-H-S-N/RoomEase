import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SharedNavbar from '../shared/SharedNavbar';
import { api } from '../../services/api';
import {
    AlertTriangle, Shield, Users, UserX, Ban,
    ShieldAlert, ShieldOff, Fingerprint, MessageSquareWarning,
    Bot, FileWarning, Clock, RefreshCw, ChevronDown,
    ChevronUp, Eye, XCircle, CheckCircle2, Loader2,
    Flag, UserCheck, CircleSlash
} from 'lucide-react';
import '../../styles/User/RedFlagAlert.css';

interface User {
    email: string;
    fullName: string;
}

interface RedFlag {
    category: string;
    severity: string;
    evidence: string;
    date: string;
}

interface AlertData {
    id: string;
    profile_name: string;
    city: string;
    area: string;
    photo: string;
    occupation: string;
    age: number | null;
    red_flags: RedFlag[];
    overall_severity: string;
    flag_count: number;
    status: string;
    report_count: number;
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

const severityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    HIGH: {
        color: '#DC2626',
        bg: 'rgba(220, 38, 38, 0.06)',
        border: 'rgba(220, 38, 38, 0.25)',
        label: 'High Risk',
    },
    MEDIUM: {
        color: '#D97706',
        bg: 'rgba(217, 119, 6, 0.06)',
        border: 'rgba(217, 119, 6, 0.25)',
        label: 'Medium Risk',
    },
    LOW: {
        color: '#2563EB',
        bg: 'rgba(37, 99, 235, 0.06)',
        border: 'rgba(37, 99, 235, 0.25)',
        label: 'Low Risk',
    },
};

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    'SUSPENDED': { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', icon: <Ban size={13} /> },
    'UNDER REVIEW': { color: '#D97706', bg: 'rgba(217,119,6,0.08)', icon: <Eye size={13} /> },
    'FLAGGED': { color: '#6B7280', bg: 'rgba(107,114,128,0.08)', icon: <Flag size={13} /> },
};

const categoryIcons: Record<string, React.ReactNode> = {
    'Fraud Report': <ShieldOff size={17} />,
    'Identity Fraud': <Fingerprint size={17} />,
    'Duplicate Account': <UserX size={17} />,
    'Scam Behavior': <CircleSlash size={17} />,
    'Suspicious Activity': <Bot size={17} />,
    'Misleading Profile': <FileWarning size={17} />,
    'User Reports': <MessageSquareWarning size={17} />,
    'Harassment': <ShieldAlert size={17} />,
    'Unverified Identity': <UserCheck size={17} />,
    'Inactive Listing': <Clock size={17} />,
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [refreshing, setRefreshing] = useState(false);
    const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.getRedFlagAlerts(8);
            setAlerts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load red flag alerts');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setExpandedCards(new Set());
        try {
            const data = await api.getRedFlagAlerts(8);
            setAlerts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh');
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'ai-picks': onNavigateToListing(); break;
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

    // Stats
    const highCount = alerts.filter(a => a.overall_severity === 'HIGH').length;
    const mediumCount = alerts.filter(a => a.overall_severity === 'MEDIUM').length;
    const lowCount = alerts.filter(a => a.overall_severity === 'LOW').length;
    const totalReports = alerts.reduce((sum, a) => sum + a.report_count, 0);

    // Filter
    const filtered = filterSeverity === 'ALL'
        ? alerts
        : alerts.filter(a => a.overall_severity === filterSeverity);

    return (
        <div className="rf-page">
            <SharedNavbar
                currentPage="red-flag-alert"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName}
            />

            <main className="rf-main">
                {/* Header Section */}
                <div className="rf-header-section">
                    <div className="rf-header-content">
                        <div className="rf-header-text">
                            <div className="rf-badge">
                                <Shield size={14} />
                                <span>Trust & Safety</span>
                            </div>
                            <h1 className="rf-title">Red Flag Alerts</h1>
                            <p className="rf-subtitle">
                                Monitor flagged accounts for suspicious activity, fraud reports, and safety concerns
                                to keep the community secure.
                            </p>
                        </div>
                        <button
                            className="rf-refresh-btn"
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                        >
                            <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
                            <span>{refreshing ? 'Scanning...' : 'Refresh'}</span>
                        </button>
                    </div>

                    {/* Stats Row */}
                    {!loading && alerts.length > 0 && (
                        <motion.div
                            className="rf-stats-row"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="rf-stat-card" onClick={() => setFilterSeverity(filterSeverity === 'HIGH' ? 'ALL' : 'HIGH')} style={{ cursor: 'pointer', outline: filterSeverity === 'HIGH' ? '2px solid #DC2626' : 'none' }}>
                                <div className="rf-stat-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
                                    <XCircle size={20} />
                                </div>
                                <div className="rf-stat-info">
                                    <span className="rf-stat-value">{highCount}</span>
                                    <span className="rf-stat-label">High Risk</span>
                                </div>
                            </div>
                            <div className="rf-stat-card" onClick={() => setFilterSeverity(filterSeverity === 'MEDIUM' ? 'ALL' : 'MEDIUM')} style={{ cursor: 'pointer', outline: filterSeverity === 'MEDIUM' ? '2px solid #D97706' : 'none' }}>
                                <div className="rf-stat-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="rf-stat-info">
                                    <span className="rf-stat-value">{mediumCount}</span>
                                    <span className="rf-stat-label">Medium Risk</span>
                                </div>
                            </div>
                            <div className="rf-stat-card" onClick={() => setFilterSeverity(filterSeverity === 'LOW' ? 'ALL' : 'LOW')} style={{ cursor: 'pointer', outline: filterSeverity === 'LOW' ? '2px solid #2563EB' : 'none' }}>
                                <div className="rf-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                                    <Eye size={20} />
                                </div>
                                <div className="rf-stat-info">
                                    <span className="rf-stat-value">{lowCount}</span>
                                    <span className="rf-stat-label">Low Risk</span>
                                </div>
                            </div>
                            <div className="rf-stat-card">
                                <div className="rf-stat-icon" style={{ background: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' }}>
                                    <Users size={20} />
                                </div>
                                <div className="rf-stat-info">
                                    <span className="rf-stat-value">{totalReports}</span>
                                    <span className="rf-stat-label">Total Reports</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Active Filter Indicator */}
                    {filterSeverity !== 'ALL' && (
                        <div className="rf-filter-active">
                            <span>Showing: <strong>{filterSeverity}</strong> severity only</span>
                            <button onClick={() => setFilterSeverity('ALL')}>Clear filter</button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="rf-loading">
                        <div className="rf-loading-inner">
                            <Loader2 size={40} className="spin" style={{ color: '#B85D47' }} />
                            <h3>Scanning for Red Flags...</h3>
                            <p>Analyzing user reports, activity patterns, and trust signals</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="rf-error">
                        <AlertTriangle size={32} />
                        <h3>Unable to Load Alerts</h3>
                        <p>{error}</p>
                        <button onClick={fetchAlerts} className="rf-retry-btn">Try Again</button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="rf-empty">
                        <CheckCircle2 size={48} style={{ color: '#059669' }} />
                        <h3>{filterSeverity !== 'ALL' ? `No ${filterSeverity} Risk Alerts` : 'All Clear!'}</h3>
                        <p>{filterSeverity !== 'ALL' ? 'Try clearing the filter to see all alerts.' : 'No flagged accounts found in the current scan.'}</p>
                        {filterSeverity !== 'ALL' ? (
                            <button onClick={() => setFilterSeverity('ALL')} className="rf-retry-btn">Show All</button>
                        ) : (
                            <button onClick={handleRefresh} className="rf-retry-btn">Scan Again</button>
                        )}
                    </div>
                )}

                {/* Alert Cards */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="rf-alerts-grid">
                        <AnimatePresence>
                            {filtered.map((alert, index) => {
                                const config = severityConfig[alert.overall_severity] || severityConfig.LOW;
                                const sConfig = statusConfig[alert.status] || statusConfig.FLAGGED;
                                const isExpanded = expandedCards.has(alert.id);

                                return (
                                    <motion.div
                                        key={alert.id}
                                        className="rf-alert-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.06, duration: 0.35 }}
                                        style={{ borderLeft: `4px solid ${config.color}` }}
                                    >
                                        {/* Card Header */}
                                        <div className="rf-card-header">
                                            <div className="rf-card-profile">
                                                <div className="rf-avatar" style={{ background: alert.overall_severity === 'HIGH' ? '#F9E0DC' : '#E8E0D5' }}>
                                                    {alert.photo ? (
                                                        <img src={alert.photo} alt={alert.profile_name} />
                                                    ) : (
                                                        <span>{getInitials(alert.profile_name)}</span>
                                                    )}
                                                </div>
                                                <div className="rf-profile-info">
                                                    <span className="rf-profile-name">{alert.profile_name}</span>
                                                    <span className="rf-profile-loc">{alert.area}, {alert.city}</span>
                                                </div>
                                            </div>

                                            <div className="rf-card-meta">
                                                <div
                                                    className="rf-status-badge"
                                                    style={{ color: sConfig.color, background: sConfig.bg }}
                                                >
                                                    {sConfig.icon}
                                                    <span>{alert.status}</span>
                                                </div>
                                                <div className="rf-meta-row">
                                                    <span className="rf-report-count">
                                                        <Flag size={12} /> {alert.report_count} report{alert.report_count !== 1 ? 's' : ''}
                                                    </span>
                                                    <span
                                                        className="rf-severity-pill"
                                                        style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}
                                                    >
                                                        {config.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Red Flags */}
                                        <div className="rf-flags-section">
                                            {alert.red_flags.slice(0, isExpanded ? undefined : 2).map((flag, fi) => {
                                                const fConfig = severityConfig[flag.severity] || severityConfig.LOW;
                                                return (
                                                    <div key={fi} className="rf-flag-item" style={{ background: fConfig.bg }}>
                                                        <div className="rf-flag-header">
                                                            <div className="rf-flag-type">
                                                                <span className="rf-flag-icon" style={{ color: fConfig.color }}>
                                                                    {categoryIcons[flag.category] || <AlertTriangle size={17} />}
                                                                </span>
                                                                <span className="rf-flag-type-text">{flag.category}</span>
                                                            </div>
                                                            <div className="rf-flag-meta">
                                                                <span className="rf-flag-date">{formatDate(flag.date)}</span>
                                                                <span
                                                                    className="rf-flag-severity-pill"
                                                                    style={{ color: fConfig.color, background: `${fConfig.color}12`, border: `1px solid ${fConfig.border}` }}
                                                                >
                                                                    {flag.severity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="rf-flag-evidence">{flag.evidence}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Expand/Collapse */}
                                        {alert.red_flags.length > 2 && (
                                            <button className="rf-expand-btn" onClick={() => toggleExpand(alert.id)}>
                                                {isExpanded ? (
                                                    <><ChevronUp size={16} /><span>Show Less</span></>
                                                ) : (
                                                    <><ChevronDown size={16} /><span>Show {alert.red_flags.length - 2} More</span></>
                                                )}
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Info Footer */}
                <div className="rf-info-footer">
                    <Shield size={16} />
                    <span>
                        Red flag alerts are generated from user reports, activity monitoring, and trust verification systems.
                        All flagged accounts undergo manual review before any action is taken.
                    </span>
                </div>
            </main>
        </div>
    );
};
