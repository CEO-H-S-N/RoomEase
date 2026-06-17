import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Star, Eye, Trash2, Heart, Bed, Users } from 'lucide-react';
import { api } from '../../services/api';
import SharedNavbar from '../shared/SharedNavbar';
import '../../styles/User/AiRecommendationsPage.css'; // Reusing existing housing card styles

interface WishlistPageProps {
    user: { fullName: string; username?: string };
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'homes' | 'roommates'>('homes');
    const [housingWishlist, setHousingWishlist] = useState<any[]>([]);
    const [roommateWishlist, setRoommateWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllSavedItems();
    }, []);

    const fetchAllSavedItems = async () => {
        try {
            setLoading(true);
            const [housingData, roommateData] = await Promise.all([
                api.getWishlist(),
                api.getLikedProfilesDetails()
            ]);
            setHousingWishlist(housingData);
            setRoommateWishlist(roommateData);
        } catch (err: any) {
            console.error('Failed to fetch wishlist data:', err);
            setError('Failed to load your wishlist. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveHome = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await api.toggleWishlist(id);
            setHousingWishlist(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert('Failed to remove from wishlist');
        }
    };

    const handleRemoveRoommate = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            // Check if api has unlikeProfile, otherwise use a placeholder
            if ((api as any).unlikeProfile) {
                await (api as any).unlikeProfile(id);
            } else {
                // Fallback to fetch if not in api service yet
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/users/unlike-profile/${id}`, {
                    method: 'POST',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error();
            }
            setRoommateWishlist(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert('Failed to remove from wishlist');
        }
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'ai-picks': navigate('/ai-picks'); break;
            case 'chat': navigate('/messages'); break;
            case 'profiles': navigate('/profiles'); break;
            case 'map': navigate('/map'); break;
            case 'edit-profile': onNavigateToSetting(); break;
            case 'wishlist': break;
            default: navigate(`/${page}`); break;
        }
    };

    return (
        <div className="ai-recs-page">
            <SharedNavbar
                currentPage="wishlist"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName || user.username || 'User'}
            />

            <div className="ai-hero" style={{ paddingTop: '100px', paddingBottom: '3rem', paddingLeft: '2rem', paddingRight: '2rem', background: 'linear-gradient(135deg, #D4745E 0%, #B65D48 100%)' }}>
                <div className="ai-hero-content">
                    <div className="ai-hero-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <Heart size={32} color="#fff" fill="#fff" />
                    </div>
                    <h1>My Wishlist</h1>
                    <p>Your saved homes and preferred roommates in one place.</p>
                </div>
            </div>

            <div className="ai-recs-main container" style={{ marginTop: '2rem' }}>
                <div className="wishlist-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('homes')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'homes' ? '3px solid #D4745E' : '3px solid transparent',
                            color: activeTab === 'homes' ? '#D4745E' : '#6B7280',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Home size={18} /> Saved Homes ({housingWishlist.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('roommates')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'roommates' ? '3px solid #D4745E' : '3px solid transparent',
                            color: activeTab === 'roommates' ? '#D4745E' : '#6B7280',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Users size={18} /> Saved Roommates ({roommateWishlist.length})
                    </button>
                </div>

                {loading ? (
                    <div className="ai-loading">
                        <div className="ai-spinner" />
                        <p>Loading your saved items...</p>
                    </div>
                ) : error ? (
                    <div className="ai-empty-state">
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                ) : activeTab === 'homes' ? (
                    housingWishlist.length === 0 ? (
                        <div className="ai-empty-state" style={{ padding: '4rem 0' }}>
                            <div className="ai-empty-icon" style={{ opacity: 0.3 }}>
                                <Home size={64} />
                            </div>
                            <h3>No saved homes yet</h3>
                            <p>Start browsing and save your favorite homes here!</p>
                            <button className="ai-action-btn primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/ai-picks')}>Browse Homes</button>
                        </div>
                    ) : (
                        <div className="ai-housing-grid">
                            {housingWishlist.map((listing) => (
                                <div key={listing.id} className="ai-housing-card" onClick={() => navigate(`/listing-details/${listing.id}`)} style={{ cursor: 'pointer' }}>
                                    <div className="ai-housing-image">
                                        <img src={listing.thumbnail || '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'} alt={listing.area} onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'; }} />
                                        <div className="ai-housing-badge">{listing.availability}</div>
                                        <div className="ai-housing-price-overlay">PKR {listing.monthly_rent_PKR.toLocaleString()}<span>/mo</span></div>
                                        <button className="wishlist-remove-btn" onClick={(e) => handleRemoveHome(e, listing.id)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '0.5rem', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            <Trash2 size={16} color="#EF4444" />
                                        </button>
                                    </div>
                                    <div className="ai-housing-body">
                                        <div className="ai-housing-title">{listing.rooms_available} Room{listing.rooms_available > 1 ? 's' : ''} in {listing.area}</div>
                                        <div className="ai-housing-location"><MapPin size={15} /> {listing.area}, {listing.city}</div>
                                        <div className="ai-housing-stats">
                                            <div className="ai-housing-stat"><Bed size={15} /> {listing.rooms_available} Room{listing.rooms_available > 1 ? 's' : ''}</div>
                                            {listing.rating && <div className="ai-housing-stat"><Star size={15} fill="#F59E0B" color="#F59E0B" /> {listing.rating.toFixed(1)}</div>}
                                        </div>
                                        <div className="ai-housing-actions">
                                            <button className="ai-action-btn primary" style={{ flex: 1 }}><Eye size={16} /> View Details</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    roommateWishlist.length === 0 ? (
                        <div className="ai-empty-state" style={{ padding: '4rem 0' }}>
                            <div className="ai-empty-icon" style={{ opacity: 0.3 }}>
                                <Users size={64} />
                            </div>
                            <h3>No saved roommates yet</h3>
                            <p>Discover potential roommates and save them for later!</p>
                            <button className="ai-action-btn primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/profiles')}>Browse People</button>
                        </div>
                    ) : (
                        <div className="ai-housing-grid">
                            {roommateWishlist.map((profile) => (
                                <div key={profile.id} className="ai-housing-card" onClick={() => navigate(`/view-profile/${profile.id}`)} style={{ cursor: 'pointer' }}>
                                    <div className="ai-housing-image" style={{ height: '220px' }}>
                                        <img src={profile.profile_photo || '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'} alt={profile.full_name} style={{ objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'; }} />
                                        <div className="ai-housing-badge" style={{ background: '#10B981' }}>Available</div>
                                        <button className="wishlist-remove-btn" onClick={(e) => handleRemoveRoommate(e, profile.id)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '0.5rem', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            <Trash2 size={16} color="#EF4444" />
                                        </button>
                                    </div>
                                    <div className="ai-housing-body">
                                        <div className="ai-housing-title">{profile.full_name}</div>
                                        <div className="ai-housing-location"><MapPin size={15} /> {profile.area}, {profile.city}</div>
                                        <div className="ai-housing-stats" style={{ margin: '1rem 0' }}>
                                            <div className="ai-housing-stat" style={{ color: '#4B5563', fontSize: '0.875rem' }}>{profile.occupation}</div>
                                            <div className="ai-housing-stat" style={{ color: '#4F46E5', fontWeight: 600 }}>Budget: {profile.budget_PKR.toLocaleString()}</div>
                                        </div>
                                        <div className="ai-housing-actions">
                                            <button className="ai-action-btn primary" style={{ flex: 1 }}><Eye size={16} /> View Profile</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
