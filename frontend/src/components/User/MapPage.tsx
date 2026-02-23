import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Home } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../../styles/User/MapPage.css';
import SharedNavbar from '../shared/SharedNavbar';
import { api } from '../../services/api';
import { Button } from '../shared/Button';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Listing {
    id: string;
    listing_id: string;
    lat: number;
    lng: number;
    thumbnail: string;
    monthly_rent_PKR: number;
    area: string;
    city: string;
}

interface MapPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
}

// Center the map and handle updates
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

export const MapPage: React.FC<MapPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToRedFlagAlert,
    onNavigateToListing,
    onNavigateToNotification,
    onNavigateToChangePassword,
    onNavigateToVerification
}) => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapCenter] = useState<[number, number]>([30.3753, 69.3451]);
    const [zoom] = useState(5);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const data = await api.getListings();
                // Filter out invalid coordinates
                const validListings = data.filter((l: any) =>
                    l.lat && l.lng &&
                    l.lat !== 0 && l.lng !== 0 &&
                    !isNaN(l.lat) && !isNaN(l.lng)
                );
                setListings(validListings);
            } catch (error) {
                console.error("Error fetching listings for map:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
            case 'edit-profile': onNavigateToSetting(); break;
            case 'notification': onNavigateToNotification?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'profiles': navigate('/profiles'); break;
            case 'matches': navigate('/matches'); break;
            case 'chat': navigate('/messages'); break;
        }
    };

    const markers = useMemo(() => (
        listings.map((listing) => (
            <Marker
                key={listing.id}
                position={[listing.lat, listing.lng]}
            >
                <Popup className="room-ease-popup">
                    <div className="map-popup-content">
                        <div className="popup-image-container">
                            <img
                                src={listing.thumbnail || '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'}
                                alt={listing.area}
                                className="popup-thumb"
                            />
                            <div className="popup-price">
                                Rs. {listing.monthly_rent_PKR.toLocaleString()}
                            </div>
                        </div>
                        <div className="popup-info">
                            <h4 className="popup-area">{listing.area}</h4>
                            <p className="popup-city">
                                <MapPin size={12} className="inline-icon" />
                                {listing.city}
                            </p>
                            <Button
                                variant="primary"
                                size="sm"
                                fullWidth
                                className="popup-view-btn"
                                onClick={() => navigate(`/listing-details`, { state: { listingId: listing.id } })}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </Popup>
            </Marker>
        ))
    ), [listings, navigate]);

    return (
        <div className="map-page-modern">
            <SharedNavbar
                currentPage="map"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName="User"
            />

            <main className="map-main">
                {loading && (
                    <div className="map-loading-overlay">
                        <div className="spinner-medium" />
                        <p>Loading markers...</p>
                    </div>
                )}

                <div className="map-container-wrapper">
                    <MapContainer
                        center={mapCenter}
                        zoom={zoom}
                        scrollWheelZoom={true}
                        style={{ height: 'calc(100vh - 80px)', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController center={mapCenter} zoom={zoom} />

                        <MarkerClusterGroup
                            chunkedLoading
                            spiderfyOnMaxZoom={true}
                            showCoverageOnHover={false}
                        >
                            {markers}
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>

                {/* Legend/Info Overlay */}
                <div className="map-legend">
                    <div className="legend-item">
                        <Home size={16} />
                        <span>{listings.length} Listings Found</span>
                    </div>
                </div>
            </main>
        </div>
    );
};
