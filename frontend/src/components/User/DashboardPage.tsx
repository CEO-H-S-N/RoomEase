import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, Briefcase, Search, X } from 'lucide-react';
import { api, type ProfileData } from '../../services/api';
import SharedNavbar from '../shared/SharedNavbar';
import './DashboardPage.css';

interface DashboardPageProps {
  user: { username: string; email: string; profile_id?: string } | null;
  onLogout: () => void;
  onNavigateToListing: () => void;
  onNavigateToMatches?: () => void;
  onNavigateToMessages?: () => void;
  onNavigateToProfiles?: () => void;
  onNavigateToProfile?: (id?: string) => void;
  onNavigateToSetting?: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToVerification?: () => void;
  onNavigateToMap?: () => void;
  onNavigateToListingDetails?: (id: string) => void;
  onNavigateToNotification?: () => void;
  onNavigateToWishlist?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onLogout,
  onNavigateToListing,
  onNavigateToMessages,
  onNavigateToProfiles,
  onNavigateToProfile,
  onNavigateToSetting,
  onNavigateToChangePassword,
  onNavigateToVerification,
  onNavigateToMap,
  onNavigateToListingDetails,
  onNavigateToNotification,
  onNavigateToWishlist
}) => {
  const [searchType, setSearchType] = useState<'housing' | 'people'>('housing');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Carousel Scroll States
  const [listingScroll, setListingScroll] = useState(0);
  const [profileScroll, setProfileScroll] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch independently so one failure doesn't blank the entire dashboard
        const [listingsResult, profilesResult] = await Promise.allSettled([
          api.getListings(),
          api.getAllProfiles()
        ]);

        if (listingsResult.status === 'fulfilled') {
          setListings(listingsResult.value.slice(0, 12));
        } else {
          console.error("Error fetching listings:", listingsResult.reason);
        }

        if (profilesResult.status === 'fulfilled') {
          setProfiles(profilesResult.value.slice(0, 12));
        } else {
          console.error("Error fetching profiles:", profilesResult.reason);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automation logic
  useEffect(() => {
    if (loading || listings.length === 0) return;
    const interval = setInterval(() => {
      nextSlide('listings');
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, listings.length]);

  useEffect(() => {
    if (loading || profiles.length === 0) return;
    const interval = setInterval(() => {
      nextSlide('profiles');
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, profiles.length]);

  const nextSlide = (type: 'listings' | 'profiles') => {
    if (type === 'listings') {
      const maxScroll = Math.max(0, listings.length - itemsPerPage);
      setListingScroll((prev: number) => (prev + 1 > maxScroll ? 0 : prev + 1));
    } else {
      const maxScroll = Math.max(0, profiles.length - itemsPerPage);
      setProfileScroll((prev: number) => (prev + 1 > maxScroll ? 0 : prev + 1));
    }
  };

  const prevSlide = (type: 'listings' | 'profiles') => {
    if (type === 'listings') {
      const maxScroll = Math.max(0, listings.length - itemsPerPage);
      setListingScroll((prev: number) => (prev - 1 < 0 ? maxScroll : prev - 1));
    } else {
      const maxScroll = Math.max(0, profiles.length - itemsPerPage);
      setProfileScroll((prev: number) => (prev - 1 < 0 ? maxScroll : prev - 1));
    }
  };

  // Search filtering
  const q = searchQuery.toLowerCase().trim();

  const filteredListings = q
    ? listings.filter(l =>
        l.city?.toLowerCase().includes(q) ||
        l.area?.toLowerCase().includes(q) ||
        String(l.monthly_rent_PKR).includes(q)
      )
    : [];

  const filteredProfiles = q
    ? profiles.filter(p =>
        p.full_name?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.area?.toLowerCase().includes(q) ||
        p.occupation?.toLowerCase().includes(q)
      )
    : [];

  const searchResults = searchType === 'housing' ? filteredListings : filteredProfiles;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.trim().length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        // Already on dashboard
        break;
      case 'ai-picks':
        onNavigateToListing();
        break;
      case 'chat':
        onNavigateToMessages?.();
        break;
      case 'profiles':
        onNavigateToProfiles?.();
        break;
      case 'profile':
        onNavigateToProfile?.();
        break;
      case 'edit-profile':
        onNavigateToSetting?.();
        break;
      case 'change-password':
        onNavigateToChangePassword?.();
        break;
      case 'verification':
        onNavigateToVerification?.();
        break;
      case 'map':
        onNavigateToMap?.();
        break;
      case 'notifications':
        onNavigateToNotification?.();
        break;
      case 'wishlist':
        onNavigateToWishlist?.();
        break;
      default:
        console.warn(`No navigation handler for page: ${page}`);
    }
  };


  return (
    <div className="dashboard-page-modern brown-gradient-bg">
      {/* Shared Navigation */}
      <SharedNavbar
        currentPage="dashboard"
        onNavigate={handleNavigate}
        onLogout={onLogout}
        userName={user?.username || 'User'}
      />

      {/* Main Content */}
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-container"
          >
            <h2 className="hero-subtitle">Explore local real estate</h2>
            <h1 className="hero-title">Find a home you'll love</h1>

            <div className="search-container-floating glass-morphism" ref={searchRef}>
              <div className="search-type-tabs">
                <button
                  className={`search-tab ${searchType === 'housing' ? 'active' : ''}`}
                  onClick={() => { setSearchType('housing'); if (q) setShowResults(true); }}
                >
                  Housing
                </button>
                <button
                  className={`search-tab ${searchType === 'people' ? 'active' : ''}`}
                  onClick={() => { setSearchType('people'); if (q) setShowResults(true); }}
                >
                  People
                </button>
              </div>
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder={searchType === 'housing' ? "City, area, or rent amount..." : "Search by name, occupation or city..."}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => { if (q) setShowResults(true); }}
                />
                {searchQuery && (
                  <button className="search-clear-btn" onClick={clearSearch}>
                    <X size={16} />
                  </button>
                )}
                <button className="search-submit-btn">
                  <Search size={18} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && q && (
                <div className="search-results-dropdown">
                  {searchResults.length === 0 ? (
                    <div className="search-no-results">
                      <p>No {searchType === 'housing' ? 'listings' : 'people'} found for "<strong>{searchQuery}</strong>"</p>
                    </div>
                  ) : (
                    <>
                      <div className="search-results-header">
                        <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="search-results-list">
                        {searchType === 'housing'
                          ? filteredListings.slice(0, 6).map((listing: any, index: number) => (
                              <div
                                key={listing.id || index}
                                className="search-result-item"
                                onClick={() => {
                                  setShowResults(false);
                                  onNavigateToListingDetails?.(listing.id);
                                }}
                              >
                                <img
                                  className="search-result-thumb"
                                  src={listing.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=80&q=60'}
                                  alt={listing.area}
                                />
                                <div className="search-result-info">
                                  <div className="search-result-title">
                                    {listing.rooms_available} Room{listing.rooms_available > 1 ? 's' : ''} in {listing.area}
                                  </div>
                                  <div className="search-result-meta">
                                    <MapPin size={12} /> {listing.area}, {listing.city}
                                    <span className="search-result-price">PKR {listing.monthly_rent_PKR?.toLocaleString()}/mo</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          : filteredProfiles.slice(0, 6).map((profile: ProfileData, index: number) => (
                              <div
                                key={profile.id || index}
                                className="search-result-item"
                                onClick={() => {
                                  setShowResults(false);
                                  onNavigateToProfile?.(profile.id);
                                }}
                              >
                                <img
                                  className="search-result-thumb search-result-avatar"
                                  src={profile.profile_photo || `https://i.pravatar.cc/80?u=${profile.id}`}
                                  alt={profile.full_name}
                                />
                                <div className="search-result-info">
                                  <div className="search-result-title">{profile.full_name}</div>
                                  <div className="search-result-meta">
                                    <Briefcase size={12} /> {profile.occupation || 'N/A'}
                                    <span>• {profile.city}</span>
                                    {profile.age && <span>• Age {profile.age}</span>}
                                  </div>
                                </div>
                              </div>
                            ))
                        }
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Recent Listings Precision Carousel */}
          <section className="dashboard-section precision-carousel-section">
            <div className="section-header">
              <h2 className="section-title">Recent RoomEase homes</h2>
            </div>

            <div className="carousel-wrapper">
              <button className="nav-btn prev" onClick={() => prevSlide('listings')}>
                <i className="bi bi-chevron-left"></i>
              </button>

              <div className="carousel-viewport">
                <motion.div
                  className="carousel-track"
                  animate={{ x: `-${listingScroll * (100 / itemsPerPage)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {loading ? (
                    <div className="loading-placeholder">Loading...</div>
                  ) : listings.map((listing: any, index: number) => (
                    <div
                      key={listing.id || index}
                      className="precision-card listing-card"
                      onClick={() => onNavigateToListingDetails?.(listing.id)}
                    >
                      <div className="card-image-container">
                        <img src={listing.thumbnail || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80"} alt={listing.city} />
                        <div className="card-badge new">New</div>
                        <button className="card-heart-btn" onClick={(e) => { e.stopPropagation(); }}><Heart size={18} /></button>
                        <div className="card-brand-label">ROOM EASE</div>
                      </div>
                      <div className="card-body">
                        <div className="card-price-row">
                          <span className="card-price">PKR {listing.monthly_rent_PKR?.toLocaleString()}</span>
                          <span className="card-status active"><span className="dot"></span> Active</span>
                        </div>
                        <div className="card-stats">
                          {listing.rooms_available} beds • 2 baths • 2,000 sq. ft.
                        </div>
                        <div className="card-address">
                          {listing.area}, {listing.city}
                        </div>
                        <div className="card-footer-info">
                          MLS# {listing.id?.substring(0, 8).toUpperCase() || '20261000'} <br />
                          Listed by: RoomEase Verified
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <button className="nav-btn next" onClick={() => nextSlide('listings')}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <div className="carousel-progress-container">
              <div
                className="carousel-progress-bar"
                style={{
                  width: `${(itemsPerPage / listings.length) * 100}%`,
                  left: `${(listingScroll / listings.length) * 100}%`
                }}
              ></div>
            </div>
          </section>

          {/* Recommended Profiles Precision Carousel */}
          <section className="dashboard-section precision-carousel-section mt-16">
            <div className="section-header">
              <h2 className="section-title">Recommended Roommates</h2>
            </div>

            <div className="carousel-wrapper">
              <button className="nav-btn prev" onClick={() => prevSlide('profiles')}>
                <i className="bi bi-chevron-left"></i>
              </button>

              <div className="carousel-viewport">
                <motion.div
                  className="carousel-track"
                  animate={{ x: `-${profileScroll * (100 / itemsPerPage)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {loading ? (
                    <div className="loading-placeholder">Loading...</div>
                  ) : profiles.map((profile: ProfileData, index: number) => (
                    <div
                      key={profile.id || index}
                      className="precision-card profile-card"
                      onClick={() => onNavigateToProfile?.(profile.id)}
                    >
                      <div className="card-image-container">
                        <img src={profile.profile_photo || `https://i.pravatar.cc/150?u=${profile.id}`} alt={profile.full_name} />
                        <div className="card-badge verified">Verified</div>
                        <button className="card-heart-btn" onClick={(e) => { e.stopPropagation(); }}><Star size={18} fill="gold" color="gold" /></button>
                        <div className="card-brand-label">PROFILE</div>
                      </div>
                      <div className="card-body">
                        <div className="card-price-row">
                          <span className="card-price">{profile.full_name}</span>
                          <span className="card-status active"><span className="dot"></span> Online</span>
                        </div>
                        <div className="card-stats">
                          {profile.occupation} • Age {profile.age}
                        </div>
                        <div className="card-address">
                          Located in {profile.city}
                        </div>
                        <div className="card-footer-info">
                          Rating: {profile.rating || 5.0} Stars <br />
                          Last active: Today
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <button className="nav-btn next" onClick={() => nextSlide('profiles')}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <div className="carousel-progress-container">
              <div
                className="carousel-progress-bar"
                style={{
                  width: `${(itemsPerPage / profiles.length) * 100}%`,
                  left: `${(profileScroll / profiles.length) * 100}%`
                }}
              ></div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} RoomEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;