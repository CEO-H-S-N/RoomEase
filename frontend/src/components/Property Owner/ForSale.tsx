import React, { useState } from 'react';
import { Home, Bell, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Property Owner/ForSale.css';

interface ForSaleProps {
    onLogout?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToSetting?: () => void;
}

export const ForSale: React.FC<ForSaleProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToNotification,
    onNavigateToSetting
}) => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = () => {
        console.log('Searching with:', { location, minPrice, maxPrice });
        // Implement filtering logic here
    };

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); onNavigateToDashboard?.(); }}>
                        <Home className="text-primary" size={24} style={{ color: '#14919B' }} />
                        <span className="fw-bold" style={{ color: '#14919B', fontSize: '1.25rem' }}>RoomEase</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#saleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="saleNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            {onNavigateToSetting && (
                                <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); onNavigateToSetting(); }} title="Settings">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14919B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                </button>
                            )}
                            {onNavigateToNotification && (
                                <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); onNavigateToNotification(); }} title="Notifications">
                                    <Bell size={22} />
                                </button>
                            )}
                            <button className="btn-standard" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="main-content">
                <header className="dashboard-header">
                    <div className="header-title-group">
                        <h1>For Sale Listings</h1>
                        <p className="header-subtitle">View and manage properties currently for sale.</p>
                    </div>
                </header>

                {/* Filter Section */}
                <div className="card border-0 shadow-sm p-4 mb-4 rounded-3 bg-white">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label text-secondary small fw-medium mb-1">Location</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0 text-muted">
                                    <MapPin size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 ps-0"
                                    placeholder="Enter location (e.g. DHA, Blue Area)"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-secondary small fw-medium mb-1">Min Price</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-secondary small fw-medium mb-1">Max Price</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-prominent w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleSearch}>
                                <Search size={18} />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="saved-listings-container">
                    {/* Placeholder Cards */}
                    <div className="listing-card-modern hover-scale">
                        <img src="/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif" className="listing-img" alt="Listing" />
                        <div className="listing-details">
                            <div className="listing-title">Modern Apartment in F-10</div>
                            <div className="listing-price">PKR 4.5 Crore</div>
                            <button className="btn-standard w-100 mt-2" onClick={() => navigate('/property-owner-view-sale-listing?id=sale-1')}>View</button>
                        </div>
                    </div>
                    <div className="listing-card-modern hover-scale">
                        <img src="/assets/images/photo-1515263487990-61b07816b324 (flat).avif" className="listing-img" alt="Listing" />
                        <div className="listing-details">
                            <div className="listing-title">Luxury Villa in DHA</div>
                            <div className="listing-price">PKR 12 Crore</div>
                            <button className="btn-standard w-100 mt-2" onClick={() => navigate('/property-owner-view-sale-listing?id=sale-2')}>View</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
