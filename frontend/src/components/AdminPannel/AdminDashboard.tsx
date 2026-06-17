import React, { useState, useEffect } from 'react';
import '../../styles/AdminPannel/AdminDashboard.css';
import { CheckCircle, Search, Trash2, Loader2 } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { api } from '../../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: 'Active' | 'Suspended' | 'Pending';
    role: string;
    joined: string;
    verified: boolean;
    city?: string;
    area?: string;
    occupation?: string;
    age?: number;
    has_profile: boolean;
}

interface AdminDashboardProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onLogout: () => void;
    user: { fullName: string; email: string } | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onLogout,
    user
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.getAdminUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await api.adminDeleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err: any) {
            alert('Error deleting user: ' + err.message);
        }
    };

    const filteredUsers = users.filter(u => {
        const q = searchQuery.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.city && u.city.toLowerCase().includes(q)) ||
            (u.role && u.role.toLowerCase().includes(q))
        );
    });

    return (
        <div className="admin-dashboard-container">
            <AdminNavbar
                activePage="user"
                onNavigateToUser={onNavigateToUser}
                onNavigateToListing={onNavigateToListing}
                onNavigateToVerification={onNavigateToVerification}
                onNavigateToAnalytics={onNavigateToAnalytics}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <div className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Welcome {user?.fullName || 'Admin'}</h1>
                </div>

                <div className="admin-section-header">
                    <h2 className="admin-section-title">User Management</h2>
                    <p className="admin-section-subtitle">
                        Manage and moderate platform users
                        {!loading && <span className="admin-count-badge">{users.length} total</span>}
                    </p>
                </div>

                <div className="user-management-card">
                    {/* Search */}
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search users by name, email, city or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-loading-state">
                            <Loader2 size={32} className="spinner" />
                            <span>Loading users from database...</span>
                        </div>
                    ) : error ? (
                        <div className="admin-error-state">
                            <p>{error}</p>
                            <button onClick={fetchUsers} className="retry-btn">Retry</button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="admin-empty-state">
                            <p>{searchQuery ? 'No users match your search.' : 'No users found in the database.'}</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Role</th>
                                        <th>Location</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <img src={u.avatar} alt={u.name} className="user-avatar" />
                                                    <div className="user-info">
                                                        <span className="user-name">
                                                            {u.name}
                                                            {u.verified && <CheckCircle className="verified-icon" size={14} />}
                                                        </span>
                                                        <span className="user-email">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${u.status.toLowerCase()}`}>
                                                    {u.status === 'Active' && '● Active'}
                                                    {u.status === 'Suspended' && '● Suspended'}
                                                    {u.status === 'Pending' && '● Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`role-badge ${u.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="location-text">
                                                    {u.city && u.area ? `${u.area}, ${u.city}` : u.city || '—'}
                                                </span>
                                            </td>
                                            <td>{u.joined}</td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        className="action-btn btn-ban"
                                                        onClick={() => handleDeleteUser(u.id, u.name)}
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
