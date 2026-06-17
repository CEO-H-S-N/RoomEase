import { useNavigate, useParams } from 'react-router-dom';
import { Home, Bell, ArrowLeft, MapPin, Bed, Maximize2, Check, Share2, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import '../../styles/Property Owner/DetailListingPage.css';

export const DetailListingPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            if (id) {
                try {
                    const data = await api.getListing(id);
                    setListing(data);
                } catch (error) {
                    console.error("Failed to fetch listing", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchListing();
    }, [id]);

    const handleEditListing = () => {
        navigate(`/property-owner-edit-listing/${id}`);
    };

    const handleDeleteListing = async () => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await api.deleteListing(id!);
                alert("Listing deleted successfully!");
                navigate('/property-owner-dashboard');
            } catch (error: any) {
                alert(error.message || "Failed to delete listing");
            }
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="detail-listing-container d-flex align-items-center justify-content-center text-white min-vh-100">
                <div className="text-center">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="detail-listing-container d-flex align-items-center justify-content-center text-white min-vh-100">
                <div className="text-center">
                    <h2>Listing not found</h2>
                    <button className="btn btn-link text-white mt-3" onClick={() => navigate('/property-owner-dashboard')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-listing-container">
            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); navigate('/property-owner-dashboard'); }}>
                        <Home className="brand-icon" size={24} />
                        <span className="brand-text fw-bold" style={{ fontSize: '1.25rem' }}>RoomEase</span>
                    </a>

                    <div className="ms-auto d-flex align-items-center gap-3">
                        <button className="btn btn-link text-secondary p-0 border-0" onClick={() => alert('Notifications Coming Soon')} title="Notifications">
                            <Bell size={22} />
                        </button>
                        <button className="btn-standard" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content py-4">
                <div className="container">
                    {/* Back Button */}
                    <button className="btn btn-link text-secondary mb-3 ps-0 text-decoration-none" onClick={() => navigate('/property-owner-dashboard')}>
                        <ArrowLeft size={18} className="me-2" /> Back to Dashboard
                    </button>

                    <div className="row g-4">
                        {/* Left Column: Images & Details */}
                        <div className="col-lg-8">
                            {/* Hero Image */}
                            <div className="hero-image-container rounded-3 overflow-hidden mb-4 position-relative">
                                <img src={listing.thumbnail} alt={listing.city} className="w-100 object-fit-cover" style={{ height: '400px' }} />
                                <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                                    <button className="btn btn-light rounded-circle p-2 shadow-sm action-icon-btn"><Share2 size={18} /></button>
                                    <button className="btn btn-light rounded-circle p-2 shadow-sm action-icon-btn"><Heart size={18} /></button>
                                </div>
                                <div className="position-absolute bottom-0 start-0 m-3">
                                    <span className={`badge ${listing.type === 'For Sale' ? 'bg-success' : 'bg-primary'} px-3 py-2 fs-6`}>
                                        {listing.type === 'For Sale' ? 'For Sale' : 'For Rent'}
                                    </span>
                                </div>
                            </div>

                            {/* Title & Location */}
                            <div className="card border-0 p-4 mb-4 detail-card">
                                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                    <div>
                                        <h1 className="fw-bold mb-2 text-white">{listing.area}, {listing.city}</h1>
                                        <div className="d-flex align-items-center text-secondary">
                                            <MapPin size={18} className="me-1" />
                                            <span>{listing.area}, {listing.city}</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="h2 fw-bold text-accent mb-0">PKR {(listing.monthly_rent_PKR || 0).toLocaleString()}</div>
                                        <span className="text-secondary small">per month</span>
                                    </div>
                                </div>

                                <hr className="border-secondary opacity-25 my-4" />

                                {/* Key Stats */}
                                <div className="d-flex gap-5 mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="icon-box">
                                            <Bed size={20} />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white">{listing.rooms_available}</div>
                                            <span className="text-secondary small">Rooms</span>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="icon-box">
                                            <Maximize2 size={20} />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white">450</div>
                                            <span className="text-secondary small">Sq Ft</span>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="icon-box">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white">{listing.availability}</div>
                                            <span className="text-secondary small">Status</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <h4 className="fw-bold text-white mb-3">Description</h4>
                                <p className="text-secondary leading-relaxed mb-4">
                                    {listing.description}
                                </p>

                                {/* Amenities */}
                                <h4 className="fw-bold text-white mb-3">Amenities</h4>
                                <div className="row g-3">
                                    {listing.amenities.map((amenity: string, idx: number) => (
                                        <div key={idx} className="col-6 col-md-4">
                                            <div className="d-flex align-items-center gap-2 text-secondary">
                                                <div className="check-icon-sm">
                                                    <Check size={14} />
                                                </div>
                                                {amenity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Actions */}
                        <div className="col-lg-4">
                            <div className="card border-0 p-4 detail-card sticky-top" style={{ top: '100px', borderRadius: '16px' }}>
                                <h5 className="fw-bold text-white mb-4">Manage Listing</h5>
                                <div className="d-grid gap-3">
                                    <button className="btn-manage-light w-100" onClick={handleEditListing}>Edit Listing</button>
                                    <button className="btn-manage-light w-100">Mark as {listing.availability === 'Available' ? 'Unavailable' : 'Available'}</button>
                                    <button className="btn-manage-danger w-100" onClick={handleDeleteListing}>Delete Listing</button>
                                </div>
                                <hr className="border-secondary opacity-25 my-4" />
                                <div className="d-flex justify-content-between text-secondary small">
                                    <span>Listed ID</span>
                                    <span className="text-white mono">{listing.listing_id || listing._id || id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailListingPage;
