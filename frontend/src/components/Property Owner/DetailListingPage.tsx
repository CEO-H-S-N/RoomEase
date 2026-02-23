import { useNavigate, useParams } from 'react-router-dom';
import { Home, Bell, ArrowLeft, MapPin, Bed, Maximize2, Check, Share2, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../styles/Property Owner/DetailListingPage.css';

export const DetailListingPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any>(null);

    // Sample Data (Same as Dashboard)
    const listingsData = [
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
            type: "Rent",
            description: "A spacious 3-room apartment located in the heart of Gulgasht Colony. Features modern amenities and close proximity to markets and schools."
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
            type: "Rent",
            description: "Cozy 2-room unit in Shah Rukn-e-Alam. Ideal for small families or students. Includes dedicated parking and high-speed internet."
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
            type: "Rent",
            description: "Luxury 4-room apartment in Clifton with sea view. Building amenities include a gym and swimming pool. Secure and premium location."
        }
    ];

    useEffect(() => {
        if (id) {
            const foundHelper = listingsData.find(l => l.listing_id === id || l._id === id);
            setListing(foundHelper || null);
        }
    }, [id]);

    const handleLogout = () => {
        navigate('/');
    };

    if (!listing) {
        return (
            <div className="detail-listing-container d-flex align-items-center justify-content-center text-white">
                <div className="text-center">
                    <h2>Loading...</h2>
                    <button className="btn btn-link text-white" onClick={() => navigate('/property-owner-dashboard')}>Back to Dashboard</button>
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
                                        <div className="h2 fw-bold text-accent mb-0">PKR {listing.monthly_rent_PKR.toLocaleString()}</div>
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
                                    <button className="btn btn-prominent w-100">Edit Listing</button>
                                    <button className="btn btn-outline-light w-100">Mark as Unavailable</button>
                                    <button className="btn btn-outline-danger w-100">Delete Listing</button>
                                </div>
                                <hr className="border-secondary opacity-25 my-4" />
                                <div className="d-flex justify-content-between text-secondary small">
                                    <span>Listed ID</span>
                                    <span className="text-white mono">{listing.listing_id}</span>
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
