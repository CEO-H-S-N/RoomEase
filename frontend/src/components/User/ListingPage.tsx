import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Bed, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import SharedNavbar from '../shared/SharedNavbar';
import './ListingPage.css';

interface ListingPageProps {
    user: { fullName: string };
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToMap: () => void;
    onNavigateToListing: () => void;
    onNavigateToProfiles?: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToListingDetails?: (listingId: string) => void;
}

interface PropertyListing {
    id: string;
    listing_id?: string;
    city: string;
    area: string;
    monthly_rent_PKR: number;
    rooms_available: number;
    amenities: string[];
    availability: string;
    latitude?: number;
    longitude?: number;
    thumbnail?: string;
    images?: string[];
}

export const ListingPage: React.FC<ListingPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToListing,
    onNavigateToProfiles,
    onNavigateToMap,
    onNavigateToListingDetails
}) => {
    const [listings, setListings] = useState<PropertyListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: '',
        minPrice: '',
        maxPrice: '',
        minRooms: ''
    });

    // Parse search query from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cityParam = params.get('city');
        if (cityParam) {
            setFilters(prev => ({ ...prev, city: cityParam }));
            setShowFilters(true); // Optional: show filters if we are searching
        }
    }, []);

    // Fetch listings from backend
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const data = await api.getListings();
                setListings(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError("Failed to load listings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    // Filter listings based on user criteria
    const filteredListings = listings.filter(listing => {
        if (filters.city && !listing.city.toLowerCase().includes(filters.city.toLowerCase())) {
            return false;
        }
        if (filters.minPrice && listing.monthly_rent_PKR < parseInt(filters.minPrice)) {
            return false;
        }
        if (filters.maxPrice && listing.monthly_rent_PKR > parseInt(filters.maxPrice)) {
            return false;
        }
        if (filters.minRooms && listing.rooms_available < parseInt(filters.minRooms)) {
            return false;
        }
        return true;
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            city: '',
            minPrice: '',
            maxPrice: '',
            minRooms: ''
        });
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': window.location.href = '/messages'; break; // Workaround if onNavigateToMessages is missing
            case 'profiles': onNavigateToProfiles?.(); break;
            case 'profile': onNavigateToSetting?.(); break;
            case 'edit-profile': onNavigateToSetting?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'map': onNavigateToMap(); break;
        }
    };

    return (
        <div className="listing-page-modern brown-gradient-bg">
            <SharedNavbar
                currentPage="listings"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName}
            />

            {/* Main Content */}
            <main className="listing-main" style={{ marginTop: '80px' }}>
                <div className="container">
                    {/* Header */}
                    <motion.div
                        className="listing-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h1 className="page-title">Available Listings</h1>
                            <p className="page-subtitle">
                                {filteredListings.length} properties match your criteria
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            icon={<Filter size={18} />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                    </motion.div>

                    {/* Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                className="filter-panel glass"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="filter-grid">
                                    <div className="filter-field">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="e.g., Islamabad"
                                            value={filters.city}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Min Price (PKR)</label>
                                        <input
                                            type="number"
                                            name="minPrice"
                                            placeholder="10000"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Max Price (PKR)</label>
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            placeholder="50000"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Min Rooms</label>
                                        <input
                                            type="number"
                                            name="minRooms"
                                            placeholder="1"
                                            value={filters.minRooms}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner-large" />
                            <p>Loading listings...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <Card variant="elevated" className="error-card">
                            <p className="error-text">{error}</p>
                            <Button variant="primary" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </Card>
                    )}

                    {/* Listings Grid */}
                    {!loading && !error && (
                        <motion.div
                            className="listings-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredListings.length === 0 ? (
                                <Card variant="elevated" className="empty-state">
                                    <p>No listings match your filters. Try adjusting your criteria.</p>
                                </Card>
                            ) : (
                                filteredListings.map((listing, index) => (
                                    <motion.div key={listing.id || index} variants={staggerItem}>
                                        <Card variant="glass" hover className="listing-card">
                                            <div className="listing-image">
                                                <img
                                                    src={listing.thumbnail || "/assets/images/placeholder-connect.038828c91304f70020e5.jpg"}
                                                    alt={`${listing.area} property`}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/assets/images/placeholder-connect.038828c91304f70020e5.jpg";
                                                    }}
                                                />
                                                <div className="listing-badge">{listing.availability}</div>
                                            </div>

                                            <div className="listing-content">
                                                <h3 className="listing-title">
                                                    {listing.rooms_available} Room(s) in {listing.area}
                                                </h3>

                                                <div className="listing-location">
                                                    <MapPin size={16} />
                                                    <span>{listing.area}, {listing.city}</span>
                                                </div>

                                                <div className="listing-details">
                                                    <div className="detail-item">
                                                        <DollarSign size={16} />
                                                        <span>PKR {listing.monthly_rent_PKR.toLocaleString()}/mo</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <Bed size={16} />
                                                        <span>{listing.rooms_available} Rooms</span>
                                                    </div>
                                                </div>

                                                {listing.amenities && listing.amenities.length > 0 && (
                                                    <div className="listing-amenities">
                                                        {listing.amenities.slice(0, 3).map((amenity, i) => (
                                                            <span key={i} className="amenity-tag">{amenity}</span>
                                                        ))}
                                                        {listing.amenities.length > 3 && (
                                                            <span className="amenity-tag">+{listing.amenities.length - 3} more</span>
                                                        )}
                                                    </div>
                                                )}

                                                <Button
                                                    variant="primary"
                                                    fullWidth
                                                    onClick={() => onNavigateToListingDetails?.(listing.listing_id || listing.id)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="footer-modern">
                <div className="container">
                    <p>© {new Date().getFullYear()} RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
