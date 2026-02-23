import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Home, Wifi, Car, Utensils, Droplet, Zap, Shield, Wind, X, ChevronLeft, ChevronRight, Star, AlertCircle, ThumbsUp } from 'lucide-react';
import SharedNavbar from '../shared/SharedNavbar';
import './ListingDetailsPage.css';

interface ListingDetailsPageProps {
    user: { fullName: string };
    listingId?: string;
    onNavigateBack: () => void;
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToListing: () => void;
    onNavigateToSetting: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
}

interface Review {
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
}

interface Listing {
    id: string;
    listing_id?: string;
    city: string;
    area: string;
    monthly_rent_PKR: number;
    rooms_available: number;
    amenities: string[];
    availability: string;
    thumbnail: string;
    images: string[];
    rating?: number;
    reviews?: Review[];
}

const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi size={20} />,
    'Parking': <Car size={20} />,
    'Mess facility': <Utensils size={20} />,
    'Shared kitchen': <Utensils size={20} />,
    'Attached bathroom': <Droplet size={20} />,
    'AC room': <Wind size={20} />,
    'Laundry service': <Droplet size={20} />,
    'Security guard': <Shield size={20} />,
    'Electricity backup': <Zap size={20} />,
};

const ListingDetailsPage: React.FC<ListingDetailsPageProps> = ({
    user,
    listingId,
    onNavigateBack,
    onLogout,
    onNavigateToDashboard,
    onNavigateToListing,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToVerification
}) => {
    const [listing, setListing] = useState<Listing | null>(null);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        fetchListingDetails();
    }, [listingId]);

    const fetchListingDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/ai/housing_listings');
            const data = await response.json();

            setAllListings(data);

            const foundListing = listingId
                ? data.find((l: Listing) => l.id === listingId)
                : data[0];

            if (foundListing) {
                setListing(foundListing);
                setSelectedImage(foundListing.thumbnail || foundListing.images?.[0] || '');
            }
        } catch (error) {
            console.error('Error fetching listing details:', error);
        } finally {
            setLoading(false);
        }
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        if (!listing) return;
        const allImages = [listing.thumbnail, ...(listing.images || [])].filter(Boolean);
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        if (!listing) return;
        const allImages = [listing.thumbnail, ...(listing.images || [])].filter(Boolean);
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': window.location.href = '/messages'; break;
            case 'profiles': window.location.href = '/profiles'; break;
            case 'edit-profile': onNavigateToSetting(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            default: break;
        }
    };

    if (loading) {
        return (
            <div className="listing-details-page brown-theme">
                <SharedNavbar
                    currentPage="listings"
                    onNavigate={handleNavigate}
                    onLogout={onLogout}
                    userName={user.fullName}
                />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading listing details...</p>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="listing-details-page brown-theme">
                <SharedNavbar
                    currentPage="listings"
                    onNavigate={handleNavigate}
                    onLogout={onLogout}
                    userName={user.fullName}
                />
                <div className="error-container">
                    <p>Listing not found</p>
                    <button onClick={onNavigateBack} className="back-button">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const allImages = [listing.thumbnail, ...(listing.images || [])].filter(Boolean);
    const similarListings = allListings.filter(
        (l) => l.city === listing.city && l.id !== listing.id
    ).slice(0, 4);

    return (
        <div className="listing-details-page brown-theme">
            <SharedNavbar
                currentPage="listings"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName}
            />
            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={32} />
                    </button>
                    <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        <ChevronLeft size={40} />
                    </button>
                    <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        <ChevronRight size={40} />
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={allImages[lightboxIndex]}
                            alt={`View ${lightboxIndex + 1}`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/images/placeholder-connect.038828c91304f70020e5.jpg";
                            }}
                        />
                        <div className="lightbox-counter">
                            {lightboxIndex + 1} / {allImages.length}
                        </div>
                    </div>
                </div>
            )}

            <div className="ld-content-wrapper">
                {/* Header with Back Button */}
                <div className="details-header">
                    <button onClick={onNavigateBack} className="back-btn">
                        <ArrowLeft size={20} />
                        <span>Back to Listings</span>
                    </button>
                </div>

                {/* Image Gallery */}
                <div className="image-gallery">
                    <div className="main-image" onClick={() => openLightbox(0)}>
                        <img
                            src={selectedImage}
                            alt={`${listing.area} property`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/images/placeholder-connect.038828c91304f70020e5.jpg";
                            }}
                        />
                        <div className="image-overlay">Click to view fullscreen</div>
                    </div>

                    {allImages.length > 1 && (
                        <div className="image-thumbnails">
                            {allImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedImage(img);
                                        openLightbox(index);
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`View ${index + 1}`}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/assets/images/placeholder-connect.038828c91304f70020e5.jpg";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Property Details */}
                <div className="property-details">
                    <div className="details-content">
                        {/* Title and Location */}
                        <div className="property-header">
                            <div className="title-section">
                                <h1>{listing.rooms_available} Room{listing.rooms_available > 1 ? 's' : ''} in {listing.area}</h1>
                                <div className="location">
                                    <MapPin size={18} />
                                    <span>{listing.area}, {listing.city}</span>
                                </div>
                            </div>
                            <div className={`availability-badge ${listing.availability.toLowerCase().replace(' ', '-')}`}>
                                {listing.availability}
                            </div>
                        </div>

                        {/* Ratings Section */}
                        {listing.rating && (
                            <div className="ratings-section">
                                <div className="rating-summary">
                                    <div className="rating-score-large">
                                        <Star size={32} fill="#14919B" color="#14919B" />
                                        <span className="score">{listing.rating.toFixed(1)}</span>
                                        <span className="reviews-count">({listing.reviews?.length || 0} review{(listing.reviews?.length || 0) !== 1 ? 's' : ''})</span>
                                    </div>
                                    <div className="rating-breakdown">
                                        <div className="rating-bar">
                                            <span>Cleanliness</span>
                                            <div className="bar"><div className="fill" style={{ width: `${(listing.rating / 5) * 100}%` }}></div></div>
                                            <span>{listing.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="rating-bar">
                                            <span>Communication</span>
                                            <div className="bar"><div className="fill" style={{ width: `${Math.min((listing.rating + 0.3) / 5 * 100, 100)}%` }}></div></div>
                                            <span>{Math.min(listing.rating + 0.3, 5).toFixed(1)}</span>
                                        </div>
                                        <div className="rating-bar">
                                            <span>Location</span>
                                            <div className="bar"><div className="fill" style={{ width: `${Math.max((listing.rating - 0.2) / 5 * 100, 0)}%` }}></div></div>
                                            <span>{Math.max(listing.rating - 0.2, 0).toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="divider"></div>

                        {/* Quick Info */}
                        <div className="quick-info">
                            <div className="info-item">
                                <Home size={24} />
                                <div>
                                    <span className="info-label">Rooms Available</span>
                                    <span className="info-value">{listing.rooms_available}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <MapPin size={24} />
                                <div>
                                    <span className="info-label">Location</span>
                                    <span className="info-value">{listing.city}</span>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Amenities */}
                        <div className="amenities-section">
                            <h2>What this place offers</h2>
                            <div className="amenities-grid">
                                {listing.amenities.map((amenity, index) => (
                                    <div key={index} className="amenity-item">
                                        <div className="amenity-icon">
                                            {amenityIcons[amenity] || <Home size={20} />}
                                        </div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Description */}
                        <div className="description-section">
                            <h2>About this place</h2>
                            <p>
                                This {listing.rooms_available}-room accommodation is located in the heart of {listing.area}, {listing.city}.
                                The property offers excellent amenities including {listing.amenities.slice(0, 3).join(', ').toLowerCase()},
                                and more. Perfect for students and professionals looking for comfortable living spaces in a prime location.
                            </p>
                            <p>
                                The area is well-connected with public transportation, nearby markets, restaurants, and essential services.
                                This property is currently {listing.availability.toLowerCase()} and ready for immediate occupancy.
                            </p>
                        </div>

                        <div className="divider"></div>

                        {/* Things to Know */}
                        <div className="things-to-know-section">
                            <h2>Things to know</h2>
                            <div className="rules-grid">
                                <div className="rule-category">
                                    <h3><AlertCircle size={20} /> House Rules</h3>
                                    <ul>
                                        <li>No smoking inside the property</li>
                                        <li>No pets allowed</li>
                                        <li>Quiet hours: 10 PM - 7 AM</li>
                                        <li>Maximum occupancy as per room capacity</li>
                                    </ul>
                                </div>
                                <div className="rule-category">
                                    <h3><Shield size={20} /> Safety & Property</h3>
                                    <ul>
                                        <li>No unauthorized guests</li>
                                        <li>Respect common areas</li>
                                        <li>No illegal activities</li>
                                        <li>Follow building security protocols</li>
                                    </ul>
                                </div>
                                <div className="rule-category">
                                    <h3><ThumbsUp size={20} /> Cancellation Policy</h3>
                                    <ul>
                                        <li>One month notice required</li>
                                        <li>Security deposit refundable</li>
                                        <li>Advance rent non-refundable</li>
                                        <li>Property inspection before checkout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Reviews Section */}
                        <div className="reviews-section">
                            <h2><Star size={24} /> Reviews</h2>
                            {listing.reviews && listing.reviews.length > 0 ? (
                                <div className="reviews-list">
                                    {listing.reviews.map((review, index) => (
                                        <div key={index} className="review-card">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <div className="reviewer-avatar">{review.reviewer.charAt(0).toUpperCase()}</div>
                                                    <div>
                                                        <h4>{review.reviewer}</h4>
                                                        <span className="review-date">{review.date}</span>
                                                    </div>
                                                </div>
                                                <div className="review-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < review.rating ? "#14919B" : "none"}
                                                            color="#14919B"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="reviews-empty-state">
                                    <Star size={48} color="#14919B" />
                                    <p>No reviews yet</p>
                                    <span>Be the first to review this property after booking!</span>
                                </div>
                            )}
                        </div>

                        {/* Similar Listings */}
                        {similarListings.length > 0 && (
                            <>
                                <div className="divider"></div>
                                <div className="similar-listings-section">
                                    <h2>More places in {listing.city}</h2>
                                    <div className="similar-listings-grid">
                                        {similarListings.map((similarListing) => (
                                            <div key={similarListing.id} className="similar-listing-card">
                                                <img
                                                    src={similarListing.thumbnail}
                                                    alt={similarListing.area}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/assets/images/placeholder-connect.038828c91304f70020e5.jpg";
                                                    }}
                                                />
                                                <div className="similar-listing-info">
                                                    <h4>{similarListing.rooms_available} Room(s) in {similarListing.area}</h4>
                                                    <p className="similar-price">PKR {similarListing.monthly_rent_PKR.toLocaleString()}/mo</p>
                                                    <div className="similar-rating">
                                                        <Star size={14} fill="#14919B" color="#14919B" />
                                                        <span>{similarListing.rating?.toFixed(1) || 'New'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="booking-card">
                        <div className="price-section">
                            <div className="price">
                                <span className="amount">PKR {listing.monthly_rent_PKR.toLocaleString()}</span>
                                <span className="period">/ month</span>
                            </div>
                            {listing.rating && (
                                <div className="rating-small">
                                    <Star size={16} fill="#14919B" color="#14919B" />
                                    <span>{listing.rating.toFixed(1)}</span>
                                    <span className="reviews">({listing.reviews?.length || 0} review{(listing.reviews?.length || 0) !== 1 ? 's' : ''})</span>
                                </div>
                            )}
                        </div>

                        <div className="booking-details">
                            <div className="detail-row">
                                <span>Monthly Rent</span>
                                <span>PKR {listing.monthly_rent_PKR.toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Rooms</span>
                                <span>{listing.rooms_available}</span>
                            </div>
                            <div className="detail-row">
                                <span>Status</span>
                                <span className={`status ${listing.availability.toLowerCase().replace(' ', '-')}`}>
                                    {listing.availability}
                                </span>
                            </div>
                        </div>

                        <button className="reserve-button">
                            Contact Owner
                        </button>

                        <p className="booking-note">You won't be charged yet</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsPage;
