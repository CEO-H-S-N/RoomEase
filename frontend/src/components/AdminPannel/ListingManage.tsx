import React, { useState } from 'react';
import '../../styles/AdminPannel/ListingManage.css';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Listing {
    id: number;
    title: string;
    owner: string;
    price: string;
    status: 'Active' | 'Pending' | 'Flagged';
    views: number;
    reports?: number;
}

interface ListingManageProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSetting: () => void;
    onLogout: () => void;
}

export const ListingManage: React.FC<ListingManageProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onNavigateToProfile,
    onNavigateToSetting,
    onLogout
}) => {
    // Mock Data based on Screenshot
    const [listings] = useState<Listing[]>([
        {
            id: 1,
            title: '2BR Apartment Downtown',
            owner: 'Wisal',
            price: 'PKR1200/mo',
            status: 'Active',
            views: 342
        },
        {
            id: 2,
            title: 'Flat',
            owner: 'Azan',
            price: 'PKR850/mo',
            status: 'Pending',
            views: 89
        },
        {
            id: 3,
            title: 'Ali House',
            owner: 'Ali',
            price: 'PKR1800/mo',
            status: 'Flagged',
            views: 156,
            reports: 2
        }
    ]);

    React.useEffect(() => {
        console.log('ListingManage mounted');
    }, []);

    return (
        <div className="listing-manage-container">
            {/* Top Navbar - Scoped to Listing Manage */}
            <nav className="listing-manage-navbar">
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
            <div className="listing-content">
                <div className="listing-header">
                    <h1 className="listing-title">Welcome Admin</h1>
                </div>

                <div className="listing-section-header">
                    <h2 className="listing-section-title">Listing Management</h2>
                    <p className="listing-section-subtitle">Review and moderate property listings</p>
                </div>

                <div className="listing-management-card">


                    <div className="table-container">
                        <table className="listings-table">
                            <thead>
                                <tr>
                                    <th>Listing</th>
                                    <th>Owner</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Stats</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((listing) => (
                                    <tr key={listing.id}>
                                        <td>
                                            <span className="listing-name">{listing.title}</span>
                                        </td>
                                        <td>{listing.owner}</td>
                                        <td>{listing.price}</td>
                                        <td>
                                            <span className={`status-badge status-${listing.status.toLowerCase()}`}>
                                                {listing.status === 'Active' && '● Active'}
                                                {listing.status === 'Pending' && '● Pending'}
                                                {listing.status === 'Flagged' && '⚠ Flagged'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="stats-cell">
                                                <span>{listing.views} views</span>
                                                {listing.reports && (
                                                    <span className="stats-reports">{listing.reports} reports</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <Eye className="action-icon action-view" size={18} />
                                                <CheckCircle className="action-icon action-approve" size={18} />
                                                <XCircle className="action-icon action-reject" size={18} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
