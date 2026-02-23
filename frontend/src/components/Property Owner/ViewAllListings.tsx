import { useState } from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Property Owner/ViewAllListings.css';

interface ViewAllListingsProps {
    onLogout?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToSetting?: () => void;
}

export const ViewAllListings: React.FC<ViewAllListingsProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [type, setType] = useState('All'); // 'All', 'Sale', 'Rent'

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
            type: "Rent",
            rating: 3.7,
            review_count: 2
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
            type: "Rent",
            rating: 5,
            review_count: 4
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
            type: "Rent",
            rating: 4.4,
            review_count: 3
        }
    ];

    const filteredListings = listings.filter(l => {
        if (type === 'All') return true;
        return l.type === type;
    });

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); navigate('/property-owner-dashboard'); }}>
                        <Home className="brand-icon" size={24} />
                        <span className="brand-text fw-bold" style={{ fontSize: '1.25rem' }}>RoomEase</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#viewAllNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="viewAllNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <button className="btn btn-link text-secondary p-0 border-0" onClick={() => navigate('/property-owner-setting')} title="Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>
                            <button className="btn-standard" onClick={() => { if (onLogout) onLogout(); else navigate('/'); }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="main-content">
                <header className="dashboard-header">
                    <div className="header-title-group">
                        <h1>All Listings</h1>
                        <p className="header-subtitle">View and manage all your properties.</p>
                    </div>
                </header>

                {/* Filter Section */}
                <div className="card border-0 shadow-sm p-4 mb-4 rounded-3 section-title-bg">
                    <div className="d-flex align-items-center">
                        <div className="col-md-3">
                            <label className="form-label text-white small fw-medium mb-1">Filter by Type</label>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="Sale">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="saved-listings-container">
                    {filteredListings.length === 0 ? (
                        <div className="text-white text-center py-5">No listings found for the selected type.</div>
                    ) : (
                        filteredListings.map(listing => (
                            <div
                                key={listing._id}
                                className="listing-card-modern hover-scale"
                                onClick={() => navigate(`/property-owner-detail-listing/${listing.listing_id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={listing.thumbnail} className="listing-img" alt={listing.city} />
                                <div className="listing-details">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="listing-title mb-0">{listing.area}, {listing.city}</div>
                                        <span className={`badge ${listing.type === 'Sale' ? 'bg-success' : 'bg-primary'}`}>
                                            For {listing.type}
                                        </span>
                                    </div>
                                    <div className="listing-price">
                                        PKR {listing.monthly_rent_PKR.toLocaleString()}
                                        {listing.type === 'Rent' && '/mo'}
                                    </div>
                                    <div className='d-flex align-items-center gap-1 mt-2' style={{ fontSize: '12px', color: 'var(--drood-text-muted)' }}>
                                        <span style={{ color: '#FBBF24' }}>★</span> {listing.rating} ({listing.review_count} reviews)
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            className="btn-standard flex-grow-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/property-owner-detail-listing/${listing.listing_id}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="btn-standard flex-grow-1"
                                            style={{ borderColor: '#dc3545', color: '#dc3545' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert('Delete Clicked');
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAllListings;
