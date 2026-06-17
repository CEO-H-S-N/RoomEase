import React, { useState, useEffect } from 'react';
import '../../styles/AdminPannel/ListingManage.css';
import { Search, Trash2, Loader2, MapPin, Home } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { api } from '../../services/api';

interface Listing {
    id: string;
    city: string;
    area: string;
    monthly_rent_PKR: number;
    rooms_available: number;
    availability: string;
    amenities: string[];
    thumbnail?: string;
    rating?: number;
    created: string;
}

interface ListingManageProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onLogout: () => void;
}

export const ListingManage: React.FC<ListingManageProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onLogout
}) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.getAdminListings();
            setListings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (listingId: string, listingName: string) => {
        if (!window.confirm(`Are you sure you want to delete listing "${listingName}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await api.adminDeleteListing(listingId);
            setListings(listings.filter(l => l.id !== listingId));
        } catch (err: any) {
            alert('Error deleting listing: ' + err.message);
        }
    };

    const filteredListings = listings.filter(l => {
        const q = searchQuery.toLowerCase();
        return (
            l.city.toLowerCase().includes(q) ||
            l.area.toLowerCase().includes(q) ||
            l.availability.toLowerCase().includes(q)
        );
    });

    const formatRent = (rent: number) => {
        if (rent >= 1000) {
            return `PKR ${(rent / 1000).toFixed(rent % 1000 === 0 ? 0 : 1)}K`;
        }
        return `PKR ${rent}`;
    };

    return (
        <div className="listing-manage-container">
            <AdminNavbar
                activePage="listing"
                onNavigateToUser={onNavigateToUser}
                onNavigateToListing={onNavigateToListing}
                onNavigateToVerification={onNavigateToVerification}
                onNavigateToAnalytics={onNavigateToAnalytics}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <div className="listing-content">
                <div className="listing-header">
                    <h1 className="listing-title">Welcome Admin</h1>
                </div>

                <div className="listing-section-header">
                    <h2 className="listing-section-title">Listing Management</h2>
                    <p className="listing-section-subtitle">
                        Review and moderate property listings
                        {!loading && <span className="admin-count-badge">{listings.length} total</span>}
                    </p>
                </div>

                <div className="listing-management-card">
                    {/* Search */}
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search listings by city, area or availability..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-loading-state">
                            <Loader2 size={32} className="spinner" />
                            <span>Loading listings from database...</span>
                        </div>
                    ) : error ? (
                        <div className="admin-error-state">
                            <p>{error}</p>
                            <button onClick={fetchListings} className="retry-btn">Retry</button>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="admin-empty-state">
                            <p>{searchQuery ? 'No listings match your search.' : 'No listings found in the database.'}</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="listings-table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Rent</th>
                                        <th>Rooms</th>
                                        <th>Status</th>
                                        <th>Amenities</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredListings.map((listing) => (
                                        <tr key={listing.id}>
                                            <td>
                                                <div className="listing-cell">
                                                    <span className="listing-name">
                                                        <MapPin size={14} className="listing-icon" />
                                                        {listing.area}
                                                    </span>
                                                    <span className="listing-location">{listing.city}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="rent-text">{formatRent(listing.monthly_rent_PKR)}/mo</span>
                                            </td>
                                            <td>
                                                <span className="rooms-badge">
                                                    <Home size={13} />
                                                    {listing.rooms_available}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${listing.availability.toLowerCase() === 'available' ? 'active' : 'pending'}`}>
                                                    {listing.availability === 'Available' ? '● Available' : '● ' + listing.availability}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="amenities-cell">
                                                    {Array.isArray(listing.amenities) && listing.amenities.length > 0
                                                        ? listing.amenities.slice(0, 3).join(', ')
                                                        : '—'}
                                                    {Array.isArray(listing.amenities) && listing.amenities.length > 3 && (
                                                        <span className="amenities-more">+{listing.amenities.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{listing.created}</td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        className="action-btn btn-ban"
                                                        onClick={() => handleDeleteListing(listing.id, `${listing.area}, ${listing.city}`)}
                                                        title="Delete listing"
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
