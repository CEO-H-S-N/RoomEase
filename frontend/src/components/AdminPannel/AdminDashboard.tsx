import React, { useState } from 'react';
import '../../styles/AdminPannel/AdminDashboard.css';
import { CheckCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    status: 'Active' | 'Suspended' | 'Pending';
    role: 'User' | 'Owner';
    joined: string;
    verified: boolean;
    documents?: string[];
}

interface AdminDashboardProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSetting: () => void;
    onNavigateToUserProfile: (id: number) => void;
    onLogout: () => void;
    user: { fullName: string; email: string } | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onNavigateToProfile,
    onNavigateToSetting,
    onNavigateToUserProfile,
    onLogout,
    user
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserForDocs, setSelectedUserForDocs] = useState<User | null>(null);

    // Mock Data Expansion
    const [users] = useState<User[]>([
        { id: 1, name: 'Moiz', email: 'moiz@email.com', avatar: 'https://ui-avatars.com/api/?name=Moiz&background=random', status: 'Active', role: 'User', joined: '2024-11-15', verified: true },
        { id: 2, name: 'Talat', email: 'talat@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Talat&background=random', status: 'Suspended', role: 'User', joined: '2024-11-10', verified: false },
        { id: 3, name: 'Hassan', email: 'hasssan@email.com', avatar: 'https://ui-avatars.com/api/?name=Hassan&background=random', status: 'Pending', role: 'Owner', joined: '2024-11-20', verified: false, documents: ['https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=600&q=80'] },
        { id: 4, name: 'Huzaifa', email: 'Huzaifa@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Huzaifa&background=random', status: 'Active', role: 'User', joined: '2024-11-20', verified: true },
        { id: 5, name: 'Ali Rez', email: 'ali.rez@email.com', avatar: 'https://ui-avatars.com/api/?name=Ali+Rez&background=random', status: 'Pending', role: 'User', joined: '2024-11-21', verified: false, documents: ['https://images.unsplash.com/photo-1548545931-419b7d8537b0?auto=format&fit=crop&w=600&q=80'] },
        { id: 6, name: 'Sara Khan', email: 'sara.k@email.com', avatar: 'https://ui-avatars.com/api/?name=Sara+Khan&background=random', status: 'Active', role: 'Owner', joined: '2024-11-22', verified: true },
        { id: 7, name: 'John Doe', email: 'john.d@email.com', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random', status: 'Pending', role: 'User', joined: '2024-11-23', verified: false, documents: ['https://images.unsplash.com/photo-1563725586617-64906d2cae8c?auto=format&fit=crop&w=600&q=80'] },
        { id: 8, name: 'Emma Watson', email: 'emma.w@email.com', avatar: 'https://ui-avatars.com/api/?name=Emma+Watson&background=random', status: 'Active', role: 'User', joined: '2024-11-24', verified: true },
        { id: 9, name: 'David Smith', email: 'david.s@email.com', avatar: 'https://ui-avatars.com/api/?name=David+Smith&background=random', status: 'Suspended', role: 'Owner', joined: '2024-11-25', verified: true },
        { id: 10, name: 'Ayesha Malik', email: 'ayesha.m@email.com', avatar: 'https://ui-avatars.com/api/?name=Ayesha+Malik&background=random', status: 'Pending', role: 'User', joined: '2024-11-26', verified: false, documents: ['https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80'] },
        { id: 11, name: 'Bilal Ahmed', email: 'bilal.a@email.com', avatar: 'https://ui-avatars.com/api/?name=Bilal+Ahmed&background=random', status: 'Active', role: 'User', joined: '2024-11-27', verified: false },
        { id: 12, name: 'Charlie Brown', email: 'charlie.b@email.com', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=random', status: 'Active', role: 'Owner', joined: '2024-11-28', verified: true },
        { id: 13, name: 'Diana Prince', email: 'diana.p@email.com', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=random', status: 'Pending', role: 'User', joined: '2024-11-29', verified: false, documents: ['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'] },
        { id: 14, name: 'Ethan Hunt', email: 'ethan.h@email.com', avatar: 'https://ui-avatars.com/api/?name=Ethan+Hunt&background=random', status: 'Active', role: 'User', joined: '2024-11-30', verified: true },
        { id: 15, name: 'Fiona Gallagher', email: 'fiona.g@email.com', avatar: 'https://ui-avatars.com/api/?name=Fiona+Gallagher&background=random', status: 'Suspended', role: 'User', joined: '2024-12-01', verified: false },
        { id: 16, name: 'George Martin', email: 'george.m@email.com', avatar: 'https://ui-avatars.com/api/?name=George+Martin&background=random', status: 'Pending', role: 'Owner', joined: '2024-12-02', verified: false, documents: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'] },
        { id: 17, name: 'Hannah Baker', email: 'hannah.b@email.com', avatar: 'https://ui-avatars.com/api/?name=Hannah+Baker&background=random', status: 'Active', role: 'User', joined: '2024-12-03', verified: true },
        { id: 18, name: 'Ian Somerehalder', email: 'ian.s@email.com', avatar: 'https://ui-avatars.com/api/?name=Ian+S&background=random', status: 'Active', role: 'User', joined: '2024-12-04', verified: true },
        { id: 19, name: 'Jack Sparrow', email: 'jack.s@email.com', avatar: 'https://ui-avatars.com/api/?name=Jack+Sparrow&background=random', status: 'Pending', role: 'User', joined: '2024-12-05', verified: false, documents: ['https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80'] },
        { id: 20, name: 'Kate Winslet', email: 'kate.w@email.com', avatar: 'https://ui-avatars.com/api/?name=Kate+Winslet&background=random', status: 'Active', role: 'Owner', joined: '2024-12-06', verified: true },
    ]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-dashboard-container">
            {/* Top Navbar */}
            <nav className="admin-dashboard-navbar">
                <div className="logo-section">
                    <span className="logo-text">RoomEase</span>
                </div>

                <div className="nav-center">
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToUser(); }}>User</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToListing(); }}>Listing</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToVerification(); }}>Verification</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToAnalytics(); }}>Analytics</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateToProfile(); }}>My Profile</a>
                </div>

                <div className="nav-right">
                    <a href="#" className="nav-link" style={{ marginRight: '20px' }} onClick={(e) => { e.preventDefault(); onNavigateToSetting(); }}>Setting</a>
                    <button className="logout-btn" onClick={onLogout}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Welcome {user?.fullName || 'Admin'}</h1>
                </div>

                <div className="admin-section-header">
                    <h2 className="admin-section-title">User Management</h2>
                    <p className="admin-section-subtitle">Manage and moderate platform users</p>
                </div>

                <div className="user-management-card">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Role</th>
                                    <th>Verification</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} onClick={() => onNavigateToUserProfile(user.id)} style={{ cursor: 'pointer' }}>
                                        <td>
                                            <div className="user-cell">
                                                <img src={user.avatar} alt={user.name} className="user-avatar" />
                                                <div className="user-info">
                                                    <span className="user-name">
                                                        {user.name}
                                                        {user.verified && <CheckCircle className="verified-icon" size={14} />}
                                                    </span>
                                                    <span className="user-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${user.status.toLowerCase()}`}>
                                                {user.status === 'Active' && '● Active'}
                                                {user.status === 'Suspended' && '● Suspended'}
                                                {user.status === 'Pending' && '● Pending'}
                                            </span>
                                        </td>
                                        <td>{user.role}</td>
                                        <td>
                                            {user.status === 'Pending' ? (
                                                <button
                                                    className="view-doc-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedUserForDocs(user);
                                                    }}
                                                >
                                                    View ID
                                                </button>
                                            ) : (
                                                <span className={`doc-status ${user.verified ? 'doc-verified' : 'doc-none'}`}>
                                                    {user.verified ? 'Verified' : 'No Docs'}
                                                </span>
                                            )}
                                        </td>
                                        <td>{user.joined}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="action-btn btn-approve" onClick={(e) => e.stopPropagation()}>Approve</button>
                                                <button className="action-btn btn-reject" onClick={(e) => e.stopPropagation()}>Reject</button>
                                                <button className="action-btn btn-ban" onClick={(e) => e.stopPropagation()}>Ban</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            {selectedUserForDocs && (
                <div className="verification-modal-overlay" onClick={() => setSelectedUserForDocs(null)}>
                    <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Identity Verification</h3>
                            <button className="close-btn" onClick={() => setSelectedUserForDocs(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="user-summary">
                                <img src={selectedUserForDocs.avatar} alt="User" className="modal-user-avatar" />
                                <div>
                                    <h4>{selectedUserForDocs.name}</h4>
                                    <p>{selectedUserForDocs.email}</p>
                                </div>
                            </div>
                            <div className="doc-preview">
                                <h5>Submitted Identity Document</h5>
                                {selectedUserForDocs.documents && selectedUserForDocs.documents.length > 0 ? (
                                    <img src={selectedUserForDocs.documents[0]} alt="ID Card" className="doc-image" />
                                ) : (
                                    <div className="no-doc">No document uploaded</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-modal-action reject" onClick={() => setSelectedUserForDocs(null)}>Reject</button>
                            <button className="btn-modal-action approve" onClick={() => setSelectedUserForDocs(null)}>Approve</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
