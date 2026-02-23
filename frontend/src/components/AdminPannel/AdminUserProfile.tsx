import React from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, Star, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import '../../styles/AdminPannel/AdminUserProfile.css';

interface AdminUserProfileProps {
    onLogout: () => void;
    onNavigateBack: () => void;
}

export const AdminUserProfile: React.FC<AdminUserProfileProps> = ({
    onLogout,
    onNavigateBack
}) => {
    const { id } = useParams<{ id: string }>();

    // Mock profiles based on AdminDashboard data
    const users = {
        "1": { name: 'Moiz', email: 'moiz@email.com', avatar: 'https://ui-avatars.com/api/?name=Moiz&background=random', status: 'Active', role: 'User', joined: '2024-11-15' },
        "2": { name: 'Talat', email: 'talat@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Talat&background=random', status: 'Suspended', role: 'User', joined: '2024-11-10' },
        "3": { name: 'Hassan', email: 'hasssan@email.com', avatar: 'https://ui-avatars.com/api/?name=Hassan&background=random', status: 'Pending', role: 'Owner', joined: '2024-11-20' },
        "4": { name: 'Huzaifa', email: 'Huzaifa@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Huzaifa&background=random', status: 'Active', role: 'User', joined: '2024-11-20' },
        "5": { name: 'Ali Rez', email: 'ali.rez@email.com', avatar: 'https://ui-avatars.com/api/?name=Ali+Rez&background=random', status: 'Pending', role: 'User', joined: '2024-11-21' },
        "6": { name: 'Sara Khan', email: 'sara.k@email.com', avatar: 'https://ui-avatars.com/api/?name=Sara+Khan&background=random', status: 'Active', role: 'Owner', joined: '2024-11-22' },
        "7": { name: 'John Doe', email: 'john.d@email.com', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random', status: 'Pending', role: 'User', joined: '2024-11-23' },
        "8": { name: 'Emma Watson', email: 'emma.w@email.com', avatar: 'https://ui-avatars.com/api/?name=Emma+Watson&background=random', status: 'Active', role: 'User', joined: '2024-11-24' },
        "9": { name: 'David Smith', email: 'david.s@email.com', avatar: 'https://ui-avatars.com/api/?name=David+Smith&background=random', status: 'Suspended', role: 'Owner', joined: '2024-11-25' },
        "10": { name: 'Ayesha Malik', email: 'ayesha.m@email.com', avatar: 'https://ui-avatars.com/api/?name=Ayesha+Malik&background=random', status: 'Pending', role: 'User', joined: '2024-11-26' },
        "11": { name: 'Bilal Ahmed', email: 'bilal.a@email.com', avatar: 'https://ui-avatars.com/api/?name=Bilal+Ahmed&background=random', status: 'Active', role: 'User', joined: '2024-11-27' },
        "12": { name: 'Charlie Brown', email: 'charlie.b@email.com', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=random', status: 'Active', role: 'Owner', joined: '2024-11-28' },
        "13": { name: 'Diana Prince', email: 'diana.p@email.com', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=random', status: 'Pending', role: 'User', joined: '2024-11-29' },
        "14": { name: 'Ethan Hunt', email: 'ethan.h@email.com', avatar: 'https://ui-avatars.com/api/?name=Ethan+Hunt&background=random', status: 'Active', role: 'User', joined: '2024-11-30' },
        "15": { name: 'Fiona Gallagher', email: 'fiona.g@email.com', avatar: 'https://ui-avatars.com/api/?name=Fiona+Gallagher&background=random', status: 'Suspended', role: 'User', joined: '2024-12-01' },
        "16": { name: 'George Martin', email: 'george.m@email.com', avatar: 'https://ui-avatars.com/api/?name=George+Martin&background=random', status: 'Pending', role: 'Owner', joined: '2024-12-02' },
        "17": { name: 'Hannah Baker', email: 'hannah.b@email.com', avatar: 'https://ui-avatars.com/api/?name=Hannah+Baker&background=random', status: 'Active', role: 'User', joined: '2024-12-03' },
        "18": { name: 'Ian Somerehalder', email: 'ian.s@email.com', avatar: 'https://ui-avatars.com/api/?name=Ian+S&background=random', status: 'Active', role: 'User', joined: '2024-12-04' },
        "19": { name: 'Jack Sparrow', email: 'jack.s@email.com', avatar: 'https://ui-avatars.com/api/?name=Jack+Sparrow&background=random', status: 'Pending', role: 'User', joined: '2024-12-05' },
        "20": { name: 'Kate Winslet', email: 'kate.w@email.com', avatar: 'https://ui-avatars.com/api/?name=Kate+Winslet&background=random', status: 'Active', role: 'Owner', joined: '2024-12-06' }
    };

    const userData = id ? users[id as keyof typeof users] : null;

    if (!userData) {
        return (
            <div className="admin-profile-error">
                <h2>User not found</h2>
                <button onClick={onNavigateBack}>Back to Dashboard</button>
            </div>
        );
    }

    // Mock Reviews
    const reviews = [
        { id: 1, author: "Ahmad", rating: 5, comment: "Great roommate, very clean and respectful.", date: "2024-12-01" },
        { id: 2, author: "Sarah", rating: 4, comment: "Quiet and keeps to himself. Recommended.", date: "2024-11-20" }
    ];

    // Mock History
    const history = [
        { id: 1, action: "Logged in", date: "2025-02-15 10:30 AM" },
        { id: 2, action: "Updated profile photo", date: "2025-02-10 03:45 PM" },
        { id: 3, action: "Viewed listing #102", date: "2025-02-08 11:20 PM" }
    ];

    // Mock Red Flags
    const redFlags = id === "2" ? [
        { id: 1, type: "Suspicious Payment", description: "Multiple failed credit card attempts.", date: "2025-01-05" },
        { id: 2, type: "Reported by User", description: "Inappropriate messaging reported by user Sarah.", date: "2024-12-25" }
    ] : [];

    return (
        <div className="admin-profile-container">
            <nav className="admin-dashboard-navbar">
                <div className="logo-section" onClick={onNavigateBack} style={{ cursor: 'pointer' }}>
                    <span className="logo-text">RoomEase Admin</span>
                </div>
                <div className="nav-right">
                    <button className="logout-btn" onClick={onLogout}>Logout</button>
                </div>
            </nav>

            <div className="admin-profile-content">
                <button className="back-link" onClick={onNavigateBack}>
                    <ChevronLeft size={18} /> Back to User Management
                </button>

                <div className="profile-header-card">
                    <div className="profile-main-info">
                        <img src={userData.avatar} alt={userData.name} className="detail-avatar" />
                        <div className="detail-text">
                            <h1>{userData.name}</h1>
                            <p>{userData.email}</p>
                            <div className="badge-row">
                                <span className={`status-badge status-${userData.status.toLowerCase()}`}>{userData.status}</span>
                                <span className="role-badge">{userData.role}</span>
                                {userData.status === 'Active' && <span className="verified-badge"><ShieldCheck size={14} /> Verified</span>}
                            </div>
                        </div>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Member Since</span>
                            <span className="stat-value">{userData.joined}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">User ID</span>
                            <span className="stat-value">#{id}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-details-grid">
                    {/* Left Column: Reviews & History */}
                    <div className="details-col-main">
                        <section className="detail-section">
                            <div className="section-header">
                                <Star size={20} className="section-icon star" />
                                <h2>User Reviews</h2>
                            </div>
                            <div className="reviews-list">
                                {reviews.map(review => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-top">
                                            <span className="review-author">{review.author}</span>
                                            <div className="review-stars">
                                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                                            </div>
                                            <span className="review-date">{review.date}</span>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="detail-section">
                            <div className="section-header">
                                <Clock size={20} className="section-icon history" />
                                <h2>Activity History</h2>
                            </div>
                            <div className="history-list">
                                {history.map(item => (
                                    <div key={item.id} className="history-item">
                                        <div className="history-dot"></div>
                                        <div className="history-info">
                                            <span className="history-action">{item.action}</span>
                                            <span className="history-date">{item.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Red Flags & Actions */}
                    <div className="details-col-side">
                        <section className="detail-section red-flag-section">
                            <div className="section-header">
                                <AlertTriangle size={20} className="section-icon alert" />
                                <h2>Red Flags</h2>
                            </div>
                            {redFlags.length > 0 ? (
                                <div className="red-flags-list">
                                    {redFlags.map(flag => (
                                        <div key={flag.id} className="red-flag-card">
                                            <div className="red-flag-type">{flag.type}</div>
                                            <p className="red-flag-desc">{flag.description}</p>
                                            <span className="red-flag-date">{flag.date}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-flags">No red flags detected for this user.</p>
                            )}
                        </section>

                        <section className="detail-section admin-actions">
                            <h2>Admin Actions</h2>
                            <div className="action-buttons">
                                <button className="admin-btn approve">Approve User</button>
                                <button className="admin-btn suspend">Suspend Account</button>
                                <button className="admin-btn ban">Ban Permanently</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
