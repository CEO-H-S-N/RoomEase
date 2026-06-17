import React, { useState, useEffect } from 'react';
import { Home, Bell, MapPin, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../../styles/Property Owner/ViewAllListings.css';

interface ViewAllListingsProps {
    onLogout?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToSetting?: () => void;
}

export const ViewAllListings: React.FC<ViewAllListingsProps> = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All'); // 'All', 'Sell', 'Rent'

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const data = await api.getMyListings();
                setListings(data);
            } catch (error) {
                console.error("Failed to fetch listings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await api.deleteListing(id);
                setListings(listings.filter(l => l.id !== id));
            } catch (error) {
                alert('Failed to delete listing');
            }
        }
    };

    const filteredListings = listings.filter(listing => {
        if (filterType === 'All') return true;
        return listing.purpose === filterType;
    });

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top px-3">
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
                            <button className="btn btn-link text-secondary p-0 border-0" onClick={() => navigate('/property-owner-notifications')} title="Notifications">
                                <Bell size={22} />
                            </button>
                            <button className="btn-standard" onClick={() => navigate('/')}>
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
                        <p className="header-subtitle">Manage the properties you have listed on the platform.</p>
                    </div>
                    <button className="btn-standard" onClick={() => navigate('/property-owner-post-listing')}>
                        Add New Property
                    </button>
                </header>

                {/* Filter Section */}
                <div className="card filter-card border-0 shadow-sm p-4 mb-5 rounded-4">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold mb-2" style={{ color: 'var(--drood-text-muted)' }}>Filter by Purpose</label>
                            <select
                                className="form-select custom-select"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All">All Properties</option>
                                <option value="Sell">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-accent" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-secondary">Fetching your listings...</p>
                    </div>
                ) : filteredListings.length > 0 ? (
                    <div className="saved-listings-container">
                        {filteredListings.map((listing) => (
                            <div 
                                key={listing.id} 
                                className="listing-card-modern"
                                onClick={() => navigate(`/property-owner-detail-listing?id=${listing.id}`)}
                            >
                                <div className="listing-img-container">
                                    <img 
                                        src={listing.images && listing.images.length > 0 ? listing.images[0] : '/assets/images/placeholder.jpg'} 
                                        className="listing-img" 
                                        alt={listing.title} 
                                    />
                                    <span className={`listing-badge ${listing.purpose === 'Sell' ? 'badge-sale' : 'badge-rent'}`}>
                                        For {listing.purpose}
                                    </span>
                                </div>
                                <div className="listing-details">
                                    <h3 className="listing-title text-truncate">{listing.title}</h3>
                                    <div className="listing-location">
                                        <MapPin size={14} />
                                        <span>{listing.area}, {listing.city}</span>
                                    </div>
                                    <div className="listing-price">
                                        PKR {listing.monthly_rent_PKR?.toLocaleString() || listing.price_PKR?.toLocaleString()}
                                        {listing.purpose === 'Rent' && <span className="fs-6 fw-normal text-muted"> /mo</span>}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn-standard flex-grow-1">
                                            <Eye size={16} /> View
                                        </button>
                                        <button 
                                            className="btn-standard btn-danger-outline" 
                                            onClick={(e) => handleDelete(e, listing.id)}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 card filter-card border-0 rounded-4">
                        <div className="py-5">
                            <Home size={64} className="text-muted mb-4 opacity-25" />
                            <h3 className="fw-bold">No Listings Found</h3>
                            <p className="text-secondary mb-4">You haven't added any listings yet or none match your filter.</p>
                            <button className="btn-standard" onClick={() => navigate('/property-owner-post-listing')}>
                                Create Your First Listing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAllListings;
