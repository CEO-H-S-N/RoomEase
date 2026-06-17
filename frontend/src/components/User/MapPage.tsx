import React, { useState } from 'react';
import { Search, Navigation, Plus, Minus, MapPin, Share2, Edit2, Map as MapIcon, Star, Globe, Phone, Smartphone, Tag, RotateCcw, X, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/User/MapPage.css';
import SharedNavbar from '../shared/SharedNavbar';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const pakLocations = [
  { id: 1, name: 'Luxury Apartment in F-8', city: 'Islamabad', coords: [33.7104, 73.0432], price: 'Rs 120,000/mo', rating: 4.8, type: 'Apartment' },
  { id: 2, name: 'Cozy Room in DHA Phase 5', city: 'Lahore', coords: [31.4650, 74.4021], price: 'Rs 45,000/mo', rating: 4.5, type: 'Room' },
  { id: 3, name: 'Studio near Sea View', city: 'Karachi', coords: [24.7955, 67.0336], price: 'Rs 85,000/mo', rating: 4.2, type: 'Studio' },
  { id: 4, name: 'Shared Room in Bahria Town', city: 'Rawalpindi', coords: [33.5230, 73.1118], price: 'Rs 25,000/mo', rating: 4.0, type: 'Room' },
  { id: 5, name: 'Furnished Flat in Hayatabad', city: 'Peshawar', coords: [33.9856, 71.4391], price: 'Rs 60,000/mo', rating: 4.6, type: 'Apartment' },
  { id: 6, name: 'Kazani Heights Penthouse', city: 'Islamabad', coords: [33.6844, 73.0479], price: 'Rs 250,000/mo', rating: 4.9, type: 'Penthouse' },
  { id: 7, name: 'Gulberg House Share', city: 'Lahore', coords: [31.5204, 74.3587], price: 'Rs 35,000/mo', rating: 4.3, type: 'House' },
  { id: 8, name: 'Clifton Beachfront Condo', city: 'Karachi', coords: [24.8138, 67.0326], price: 'Rs 150,000/mo', rating: 4.7, type: 'Condo' },
];

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface MapPageProps {
    user: any;
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification?: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToRedFlagAlert,
    onNavigateToListing,
    onNavigateToNotification
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(''); // Stores the confirmed search result
    const [showLocationDetail, setShowLocationDetail] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');

    const [mapCenter, setMapCenter] = useState<[number, number]>([30.3753, 69.3451]); // Center of Pakistan
    const [mapZoom, setMapZoom] = useState(6);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const foundLocation = pakLocations.find(loc => 
              loc.name.toLowerCase().includes(query) || 
              loc.city.toLowerCase().includes(query) ||
              loc.type.toLowerCase().includes(query)
            );

            if (foundLocation) {
                setMapCenter([foundLocation.coords[0], foundLocation.coords[1]]);
                setMapZoom(13);
                setSelectedPlace(foundLocation.name);
            } else {
                setSelectedPlace(searchQuery);
            }
            setShowLocationDetail(true);
            setActiveTab('Overview');
        }
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'ai-picks': onNavigateToListing(); break;
            case 'map': break; // Already here
            case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
            case 'notifications': onNavigateToNotification?.(); break;
            case 'edit-profile': onNavigateToSetting(); break;
            // Add other cases if needed, using the existing callbacks
        }
    };

    return (
        <div className="map-page-container">
            {/* Shared Navigation */}
            <SharedNavbar
                currentPage="map"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user?.username || user?.fullName || 'User'}
            />

            <div className="map-content-wrapper">
                {/* Search Bar Overlay - Wraps sidebar when active */}

                {/* Sidebar Detail Card */}
                {showLocationDetail && (
                    <div className="location-detail-sidebar">
                        <div className="sidebar-header-image">
                            <img src="/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif" alt="Location" />
                            <button className="close-sidebar-btn" onClick={() => setShowLocationDetail(false)}>
                                <Minus size={20} />
                            </button>
                        </div>

                        <div className="sidebar-content">
                            <h1 className="location-title">{selectedPlace || "Kazani Heights"}</h1>

                            <div className="location-rating-row">
                                <span className="rating-score">4.0</span>
                                <div className="stars">
                                    <Star size={14} fill="#fbbc04" color="#fbbc04" />
                                    <Star size={14} fill="#fbbc04" color="#fbbc04" />
                                    <Star size={14} fill="#fbbc04" color="#fbbc04" />
                                    <Star size={14} fill="#fbbc04" color="#fbbc04" />
                                    <Star size={14} fill="#e6e6e6" color="#e6e6e6" />
                                </div>
                                <span className="rating-count">(126)</span>
                            </div>
                            <div className="location-category">Serviced accommodation</div>

                            <div className="location-tabs">
                                <div
                                    className={`tab-item ${activeTab === 'Overview' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('Overview')}
                                >
                                    Overview
                                </div>
                                <div
                                    className={`tab-item ${activeTab === 'Reviews' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('Reviews')}
                                >
                                    Reviews
                                </div>
                            </div>
                            <hr className="sidebar-divider" style={{ marginTop: 0 }} />

                            {activeTab === 'Overview' ? (
                                <>
                                    {/* Action Buttons */}
                                    <div className="action-buttons-row">
                                        <div className="action-btn-item">
                                            <button className="circle-btn active-btn">
                                                <Navigation size={20} fill="#fff" />
                                            </button>
                                            <span>Directions</span>
                                        </div>
                                        <div className="action-btn-item">
                                            <button className="circle-btn">
                                                <div className="save-icon-placeholder" style={{ border: '2px solid #1a73e8', height: '14px', width: '10px' }}></div>
                                            </button>
                                            <span>Save</span>
                                        </div>
                                        <div className="action-btn-item">
                                            <button className="circle-btn">
                                                <MapIcon size={20} color="#1a73e8" />
                                            </button>
                                            <span>Nearby</span>
                                        </div>
                                        <div className="action-btn-item">
                                            <button className="circle-btn">
                                                <Smartphone size={20} color="#1a73e8" />
                                            </button>
                                            <span>Send to phone</span>
                                        </div>
                                        <div className="action-btn-item">
                                            <button className="circle-btn">
                                                <Share2 size={20} color="#1a73e8" />
                                            </button>
                                            <span>Share</span>
                                        </div>
                                    </div>

                                    <hr className="sidebar-divider" />

                                    {/* Details List */}
                                    <div className="details-list">
                                        <div className="detail-item">
                                            <MapPin size={20} className="detail-icon" />
                                            <span>{selectedPlace || "Kazani Heights"}, Service Road, Islamabad Expy, Block H Extension Islamabad, Pakistan</span>
                                        </div>
                                        <div className="detail-item">
                                            <Globe size={20} className="detail-icon" />
                                            <span>kazaniheights.com</span>
                                        </div>
                                        <div className="detail-item">
                                            <Phone size={20} className="detail-icon" />
                                            <span>+92 317 7709892</span>
                                        </div>
                                        <div className="detail-item">
                                            <Plus size={20} className="detail-icon" />
                                            <span>H548+4C Islamabad, Pakistan</span>
                                        </div>
                                        <div className="detail-item">
                                            <RotateCcw size={20} className="detail-icon" />
                                            <span>Your Maps activity</span>
                                        </div>
                                        <div className="detail-item">
                                            <Tag size={20} className="detail-icon" />
                                            <span>Add a label</span>
                                        </div>
                                    </div>

                                    <hr className="sidebar-divider" />

                                    {/* Photos & Videos Section */}
                                    <div className="section-header">Photos & videos</div>
                                    <div className="photos-scroll-container">
                                        <div className="photo-card" style={{ backgroundImage: 'url(/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif)' }}>
                                            <span className="photo-label">All</span>
                                        </div>
                                        <div className="photo-card" style={{ backgroundImage: 'url(/assets/images/placeholder-connect.038828c91304f70020e5.jpg)' }}>
                                            <span className="photo-label">Latest</span>
                                        </div>
                                        <div className="photo-card" style={{ backgroundImage: 'url(/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif)' }}>
                                            <span className="photo-label">Videos</span>
                                        </div>
                                        <div className="photo-card view-more-card">
                                            <ChevronRight size={24} color="#1a73e8" />
                                        </div>
                                    </div>
                                    <div className="add-photos-btn-container">
                                        <button className="add-photos-btn">
                                            <Plus size={18} />
                                            <span>Add photos & videos</span>
                                        </button>
                                    </div>

                                    <hr className="sidebar-divider" />

                                    {/* At this place Section */}
                                    <div className="section-header">At this place</div>
                                    <div className="places-list">
                                        <div className="place-item">
                                            <div className="place-info">
                                                <div className="place-name">Barasti Club</div>
                                                <div className="place-rating">
                                                    <span>4.0</span>
                                                    <div className="stars-small">
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#e6e6e6" color="#e6e6e6" />
                                                    </div>
                                                    <span className="rating-count-small">(183)</span>
                                                </div>
                                                <div className="place-type">Fine dining restaurant</div>
                                                <div className="place-hours"><span className="closed-text">Closed</span> · Opens 10 AM</div>
                                            </div>
                                            <div className="place-thumbnail">
                                                <img src="/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif" alt="Place" />
                                            </div>
                                        </div>

                                        <div className="place-item">
                                            <div className="place-info">
                                                <div className="place-name">Logics Capital</div>
                                                <div className="place-rating">
                                                    <span>4.4</span>
                                                    <div className="stars-small">
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                    </div>
                                                    <span className="rating-count-small">(22)</span>
                                                </div>
                                                <div className="place-type">Website designer</div>
                                                <div className="place-hours"><span className="closed-text">Closed</span> · Opens 10 AM</div>
                                            </div>
                                            <div className="place-thumbnail">
                                                <img src="/assets/images/placeholder-connect.038828c91304f70020e5.jpg" alt="Place" />
                                            </div>
                                        </div>

                                        <div className="place-item">
                                            <div className="place-info">
                                                <div className="place-name">Pds Inc</div>
                                                <div className="place-rating">
                                                    <span>5.0</span>
                                                    <div className="stars-small">
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                        <Star size={10} fill="#fbbc04" color="#fbbc04" />
                                                    </div>
                                                    <span className="rating-count-small">(17)</span>
                                                </div>
                                                <div className="place-type">Logistics service</div>
                                                <div className="place-hours"><span className="closed-text">Closed</span> · Opens 5 PM</div>
                                            </div>
                                            <div className="place-thumbnail">
                                                <img src="/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif" alt="Place" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="reviews-section">
                                    <div className="rating-breakdown-container">
                                        <div className="rating-left-col">
                                            {[5, 4, 3, 2, 1].map((num) => (
                                                <div className="rating-bar-row" key={num}>
                                                    <span className="rating-num">{num}</span>
                                                    <div className="rating-bar-bg">
                                                        <div
                                                            className="rating-bar-fill"
                                                            style={{ width: num === 5 ? '80%' : num === 4 ? '40%' : num === 3 ? '10%' : num === 1 ? '30%' : '5%' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="rating-right-col">
                                            <div className="big-rating">4.0</div>
                                            <div className="stars">
                                                <Star size={16} fill="#fbbc04" color="#fbbc04" />
                                                <Star size={16} fill="#fbbc04" color="#fbbc04" />
                                                <Star size={16} fill="#fbbc04" color="#fbbc04" />
                                                <Star size={16} fill="#fbbc04" color="#fbbc04" />
                                                <Star size={16} fill="#e6e6e6" color="#e6e6e6" />
                                            </div>
                                            <div className="rating-count-text">126 reviews</div>
                                        </div>
                                    </div>

                                    <div className="write-review-container">
                                        <button className="write-review-btn">
                                            <Edit2 size={16} style={{ marginRight: '8px' }} />
                                            Write a review
                                        </button>
                                    </div>

                                    <div className="review-keywords">
                                        <div className="keyword-chip active">All</div>
                                        <div className="keyword-chip">Newest</div>
                                        <div className="keyword-chip">Oldest</div>
                                    </div>

                                    <div className="reviews-list">
                                        {[
                                            {
                                                name: "Nishat Saleem",
                                                reviews: "1 review",
                                                date: "Edited 2 months ago",
                                                rating: 1,
                                                text: "Not recommended for families or female residents.\n\nMy experience living in this building has been extremely disappointing and ...",
                                                img: "/assets/images/placeholder-connect.038828c91304f70020e5.jpg"
                                            },
                                            {
                                                name: "John Doe",
                                                reviews: "5 reviews",
                                                date: "1 week ago",
                                                rating: 5,
                                                text: "Great place to stay! The view is amazing and the amenities are top notch. Highly recommended for short stays.",
                                                img: "/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif"
                                            },
                                            {
                                                name: "Sarah Smith",
                                                reviews: "12 reviews",
                                                date: "3 weeks ago",
                                                rating: 4,
                                                text: "Good location, close to everything. The tracking service was a bit slow but overall a pleasant experience.",
                                                img: "/assets/images/placeholder-connect.038828c91304f70020e5.jpg"
                                            },
                                            {
                                                name: "Ali Khan",
                                                reviews: "3 reviews",
                                                date: "1 month ago",
                                                rating: 3,
                                                text: "Decent apartments but the pricing is on the higher side. Access to the main road is convenient though.",
                                                img: "/assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif"
                                            },
                                            {
                                                name: "Maria Rodriguez",
                                                reviews: "8 reviews",
                                                date: "2 months ago",
                                                rating: 5,
                                                text: "Absolutely loved it! The staff was very helpful and the room was clean and spacious. Will definitely come back.",
                                                img: "/assets/images/placeholder-connect.038828c91304f70020e5.jpg"
                                            }
                                        ].map((review, index) => (
                                            <div className="review-card" key={index}>
                                                <div className="review-header">
                                                    <img src={review.img} alt="User" className="reviewer-img" />
                                                    <div className="reviewer-info">
                                                        <div className="reviewer-name">{review.name}</div>
                                                        <div className="review-meta">{review.reviews}</div>
                                                    </div>
                                                    <button className="review-menu-btn">
                                                        <div className="dots-icon">⋮</div>
                                                    </button>
                                                </div>
                                                <div className="review-stars-row">
                                                    <div className="stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                fill={i < review.rating ? "#fbbc04" : "#e6e6e6"}
                                                                color={i < review.rating ? "#fbbc04" : "#e6e6e6"}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="review-date">{review.date}</span>
                                                </div>
                                                <div className="review-text">
                                                    {review.text.split('\n').map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}
                                                            {i < review.text.split('\n').length - 1 && <br />}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Search Bar Overlay - Always on top left */}
                <div className="map-search-container">
                    <div className="search-box-card">

                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search Google Maps"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <div className="search-actions">
                            <button className="action-icon-btn">
                                <Search size={20} color="#1a73e8" />
                            </button>
                            <span className="search-divider"></span>
                            <button className="action-icon-btn" onClick={() => {
                                setSearchQuery('');
                                setSelectedPlace(''); // Clear title on X
                                setShowLocationDetail(false);
                            }}>
                                <X size={20} color="#5f6368" />
                            </button>
                        </div>
                    </div>
                </div>



                {/* React Leaflet Map */}
                <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <ChangeView center={mapCenter} zoom={mapZoom} />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        {pakLocations.map((loc) => (
                            <Marker 
                                key={loc.id} 
                                position={[loc.coords[0], loc.coords[1]]}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedPlace(loc.name);
                                        setShowLocationDetail(true);
                                        setActiveTab('Overview');
                                        setMapCenter([loc.coords[0], loc.coords[1]]);
                                        setMapZoom(14);
                                    },
                                }}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>{loc.name}</h3>
                                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>{loc.city} • {loc.type}</p>
                                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#1a73e8' }}>{loc.price}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Star size={14} fill="#fbbc04" color="#fbbc04" />
                                            <span>{loc.rating}</span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

        </div >
    );
};
