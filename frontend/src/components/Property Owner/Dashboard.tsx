import { useNavigate } from 'react-router-dom';
import '../../styles/Property Owner/Dashboard.css';
import React from 'react';
import { CheckCircle, Home, Plus } from 'lucide-react';

interface DashboardProps {
    user?: {
        email: string;
        fullName: string;
    };
    onLogout: () => void;
    onNavigateToSetting?: () => void;
    onNavigateToListing?: (filter?: string) => void;
    onNavigateToNotification?: () => void;
    onNavigateToPostListing?: () => void;
    onNavigateToUserDashboard?: () => void;
    onNavigateToDetail?: (id: string) => void;
    onNavigateToMatches?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    user = { email: 'owner@example.com', fullName: 'Property Owner' },
    onLogout,
    onNavigateToListing = () => console.log('Navigate to Listing'),
    onNavigateToNotification = () => console.log('Navigate to Notification'),
    onNavigateToSetting = () => console.log('Navigate to Setting'),
    onNavigateToPostListing,
    onNavigateToDetail,
    onNavigateToMatches = () => console.log('Navigate to Matches')
}) => {
    const navigate = useNavigate();

    // Sample Data from Request
    const listings = [
        {
            _id: "6990dc86d70eb9f7427daafa",
            listing_id: "H-0019",
            city: "Multan",
            area: "Gulgasht Colony",
            monthly_rent_PKR: 17696,
            rooms_available: 3,
            amenities: ["WiFi", "Parking", "Kitchen", "AC", "Heating"],
            availability: "Not Available",
            thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            rating: 3.7,
            review_count: 2,
            type: "Rent" // Inferred from monthly_rent_PKR, assuming Rent if rent > 0
        },
        {
            _id: "6990dc86d70eb9f7427daafb",
            listing_id: "H-0020",
            city: "Multan",
            area: "Shah Rukn-e-Alam",
            monthly_rent_PKR: 16707,
            rooms_available: 2,
            amenities: ["WiFi", "Parking", "Kitchen", "AC", "Heating"],
            availability: "Available",
            thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            rating: 5,
            review_count: 4,
            type: "Rent"
        },
        {
            _id: "6990dc86d70eb9f7427daafc",
            listing_id: "H-0021",
            city: "Karachi",
            area: "Clifton",
            monthly_rent_PKR: 20032,
            rooms_available: 4,
            amenities: ["WiFi", "Parking", "Kitchen", "AC", "Heating", "Pool", "Gym"],
            availability: "Available",
            thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            rating: 4.4,
            review_count: 3,
            type: "Rent"
        }
    ];

    // Calculate Stats
    const activeListings = listings.filter(l => l.availability === "Available").length;
    const pendingListings = 0; // No data for pending
    const offlineListings = listings.filter(l => l.availability === "Not Available").length;

    // Derived stats
    const forRentCount = listings.filter(l => l.type === "Rent").length; // All 3

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); }}>
                        <Home className="brand-icon" size={24} />
                        <span className="brand-text fw-bold" style={{ fontSize: '1.25rem' }}>RoomEase</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardNavbar" aria-controls="dashboardNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="dashboardNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            {onNavigateToSetting && (
                                <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); onNavigateToSetting(); }} title="Settings">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                </button>
                            )}
                            <button className="btn-standard" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Layout */}
            <main className="main-content">

                <header className="dashboard-header">
                    <div className="header-title-group">
                        <h1>
                            Welcome, {user.fullName ? user.fullName.split(' ')[0] : 'Owner'}
                            <span className="verified-badge">
                                <CheckCircle size={14} /> Verified
                            </span>
                        </h1>
                        <p className="header-subtitle">Manage your property listings here.</p>
                    </div>

                    <div className="header-stats">
                        <button className="btn-standard" onClick={() => onNavigateToPostListing && onNavigateToPostListing()}>
                            <Plus size={18} strokeWidth={3} />
                            Add Property
                        </button>
                    </div>
                </header>

                {/* Listings Summary Card */}
                <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 animate-fade-in-up">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0 section-title">Listings</h5>
                    </div>
                    <div className="row g-0">
                        {/* Active Stats - Left Side */}
                        <div
                            className="col-md-3 border-end d-flex align-items-center justify-content-center rounded"
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 rounded-circle stat-icon-bg d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                    <Home className="stat-icon" size={32} />
                                </div>
                                <div>
                                    <div className="text-white mb-1">Active</div>
                                    <div className="fw-bold fs-4 text-white">{activeListings}</div>
                                </div>
                            </div>
                        </div>

                        {/* Other Stats - Right Side Grid */}
                        <div className="col-md-9 ps-md-5">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div
                                        className="d-flex align-items-center gap-3 hover-scale cursor-pointer p-2 rounded"
                                        onClick={() => onNavigateToListing && onNavigateToListing('rent')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="p-2 rounded-circle stat-mini-icon-bg d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-mini-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                        </div>
                                        <div>
                                            <div className="text-white small">For Rent</div>
                                            <div className="fw-bold text-white">{forRentCount}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className="d-flex align-items-center gap-3 hover-scale cursor-pointer p-2 rounded"
                                        onClick={() => onNavigateToListing && onNavigateToListing('pending')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="p-2 rounded-circle stat-mini-icon-bg d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-mini-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        </div>
                                        <div>
                                            <div className="text-white small">Pending</div>
                                            <div className="fw-bold text-white">{pendingListings}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className="d-flex align-items-center gap-3 hover-scale cursor-pointer p-2 rounded"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="p-2 rounded-circle stat-mini-icon-bg d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-mini-icon"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                                        </div>
                                        <div>
                                            <div className="text-white small">Offline</div>
                                            <div className="fw-bold text-white">{offlineListings}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold section-title">Your Listings</h5>
                            <button className="btn-standard" onClick={() => navigate('/property-owner-view-all-listings')}>View All</button>
                        </div>
                        <div className="saved-listings-container" style={{ padding: '0' }}>
                            {listings.map(listing => (
                                <div
                                    key={listing._id}
                                    className="listing-card-modern"
                                    onClick={() => onNavigateToDetail && onNavigateToDetail(listing.listing_id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={listing.thumbnail} className="listing-img" alt={listing.city} />
                                    <div className="listing-details">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="listing-title mb-0">{listing.area}, {listing.city}</div>
                                        </div>
                                        <div className="listing-price">PKR {listing.monthly_rent_PKR.toLocaleString()}/mo</div>

                                        {/* Optional: Add Rating Badge */}
                                        <div className='d-flex align-items-center gap-1 mt-2' style={{ fontSize: '12px', color: 'var(--drood-text-muted)' }}>
                                            <span style={{ color: '#FBBF24' }}>★</span> {listing.rating} ({listing.review_count} reviews)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

            </main >
            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; 2024 RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div >
    );
};

export default Dashboard;
