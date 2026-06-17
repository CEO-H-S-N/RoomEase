import React, { useState, useEffect } from 'react';
import { Home, MapPin, Building, CheckCircle, DollarSign, Layers, Bed, Bath, Star, X, FileText, Type, AlignLeft, Image, Video, Phone, Smartphone, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../../services/api';
import '../../styles/Property Owner/PostListingPage.css';

// Fix Leaflet Default Icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PostListingPageProps {
    onLogout?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToHome?: () => void;
    onNavigateToListing?: () => void;
    onNavigateToNotification?: () => void;
    onNavigateToSetting?: () => void;
    onNavigateToMap?: () => void;
    onNavigateToRedFlagAlert?: () => void;
}

interface AmenityConfig {
    label: string;
    type: 'number' | 'select' | 'checkbox' | 'text';
    options?: string[];
}

export const PostListingPage: React.FC<PostListingPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToHome
}) => {
    const navigate = useNavigate();
    const handleHome = onNavigateToHome || onNavigateToDashboard || (() => navigate('/property-owner-dashboard'));

    // State
    const [purpose, setPurpose] = useState('Sell');
    const [propertyCategory, setPropertyCategory] = useState('Home');
    const [propertyType, setPropertyType] = useState('House');
    const [installment, setInstallment] = useState(false);
    const [possession, setPossession] = useState(false);
    const [bedrooms, setBedrooms] = useState('3');
    const [bathrooms, setBathrooms] = useState('3');

    // Modal State
    const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Main Features');
    const [selectedAmenities, setSelectedAmenities] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    // Form Data State
    const [formData, setFormData] = useState({
        city: 'Lahore',
        area: '',
        monthly_rent_PKR: '',
        area_size: '',
        area_unit: 'Marla',
        title: '',
        description: '',
        mobile: '',
        landline: '',
        thumbnail: '',
        images: [] as string[],
        latitude: 31.5204,
        longitude: 74.3587
    });
    const [showLocationModal, setShowLocationModal] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchListing = async () => {
            if (isEditMode && id) {
                try {
                    const listing = await api.getListing(id);
                    setFormData({
                        city: listing.city || 'Lahore',
                        area: listing.area || '',
                        monthly_rent_PKR: listing.monthly_rent_PKR?.toString() || '',
                        area_size: listing.area_size || '',
                        area_unit: listing.area_unit || 'Marla',
                        title: listing.title || '',
                        description: listing.description || '',
                        mobile: listing.mobile || '',
                        landline: listing.landline || '',
                        thumbnail: listing.thumbnail || '',
                        images: listing.images || []
                    });
                    setPurpose(listing.purpose || 'Sell');
                    setPropertyCategory(listing.propertyCategory || 'Home');
                    setPropertyType(listing.propertyType || 'House');
                    setBedrooms(listing.rooms_available?.toString() || '3');
                    // Convert amenities array back to Record for the modal
                    if (listing.amenities) {
                        const ams: Record<string, any> = {};
                        listing.amenities.forEach((a: string) => ams[a] = true);
                        setSelectedAmenities(ams);
                    }
                } catch (error) {
                    console.error("Failed to fetch listing for edit", error);
                    alert("Failed to load listing data");
                }
            }
        };
        fetchListing();
    }, [isEditMode, id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const newImages: string[] = [];

        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                if (newImages.length === fileArray.length) {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...newImages],
                        thumbnail: prev.thumbnail || newImages[0]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const listingData = {
                city: formData.city,
                area: formData.area,
                monthly_rent_PKR: parseInt(formData.monthly_rent_PKR) || 0,
                rooms_available: parseInt(bedrooms) || 0,
                amenities: Object.keys(selectedAmenities),
                availability: "Available",
                thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3",
                images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3"],
                purpose,
                propertyCategory,
                propertyType,
                title: formData.title,
                description: formData.description,
                latitude: formData.latitude,
                longitude: formData.longitude,
            };

            if (isEditMode && id) {
                await api.updateListing(id, listingData);
                alert("Listing updated successfully!");
            } else {
                await api.createListing(listingData);
                alert("Listing created successfully!");
            }
            
            if (onNavigateToDashboard) onNavigateToDashboard();
            else navigate('/property-owner-dashboard');
        } catch (error: any) {
            alert(error.message || "Failed to save listing");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Amenity Configuration
    const AMENITY_TABS: Record<string, AmenityConfig[]> = {
        'Main Features': [
            { label: 'Built in year', type: 'number' },
            { label: 'Parking Spaces', type: 'number' },
            { label: 'Flooring', type: 'select', options: ['Tiles', 'Marble', 'Wooden', 'Chip', 'Other'] },
            { label: 'Electricity Backup', type: 'select', options: ['None', 'Generator', 'Solar', 'Ups'] },
            { label: 'Double Glazed Windows', type: 'checkbox' },
            { label: 'Central Air Conditioning', type: 'checkbox' },
            { label: 'Central Heating', type: 'checkbox' },
            { label: 'Floors', type: 'number' },
        ],
        'Rooms': [
            { label: 'Bedrooms', type: 'number' },
            { label: 'Bathrooms', type: 'number' },
            { label: 'Servant Quarters', type: 'number' },
            { label: 'Drawing Room', type: 'checkbox' },
            { label: 'Dining Room', type: 'checkbox' },
            { label: 'Kitchens', type: 'number' },
            { label: 'Study Room', type: 'checkbox' },
            { label: 'Prayer Room', type: 'checkbox' },
            { label: 'Powder Room', type: 'checkbox' },
            { label: 'Gym', type: 'checkbox' },
            { label: 'Steam Room', type: 'checkbox' },
            { label: 'Lounge or Sitting Room', type: 'checkbox' },
            { label: 'Laundry Room', type: 'checkbox' },
        ],
        'Business and Communication': [
            { label: 'Broadband Internet Access', type: 'checkbox' },
            { label: 'Satellite or Cable TV Ready', type: 'checkbox' },
            { label: 'Intercom', type: 'checkbox' },
            { label: 'Business Center or Media Room', type: 'checkbox' },
            { label: 'Conference Room', type: 'checkbox' },
            { label: 'ATM Machine', type: 'checkbox' },
        ],
        'Community Features': [
            { label: 'Community Lawn or Garden', type: 'checkbox' },
            { label: 'Community Pool', type: 'checkbox' },
            { label: 'Community Gym', type: 'checkbox' },
            { label: 'First Aid or Medical Centre', type: 'checkbox' },
            { label: 'Day Care Centre', type: 'checkbox' },
            { label: 'Kids Play Area', type: 'checkbox' },
            { label: 'Barbeque Area', type: 'checkbox' },
            { label: 'Mosque', type: 'checkbox' },
            { label: 'Community Centre', type: 'checkbox' },
        ],
        'Healthcare Recreational': [
            { label: 'Lawn or Garden', type: 'checkbox' },
            { label: 'Swimming Pool', type: 'checkbox' },
            { label: 'Sauna', type: 'checkbox' },
            { label: 'Jacuzzi', type: 'checkbox' },
        ],
        'Nearby Locations': [
            { label: 'Nearby Schools', type: 'checkbox' },
            { label: 'Nearby Hospitals', type: 'checkbox' },
            { label: 'Nearby Shopping Malls', type: 'checkbox' },
            { label: 'Nearby Restaurants', type: 'checkbox' },
            { label: 'Nearby Public Transport Service', type: 'checkbox' },
        ]
    };

    const handleAmenityChange = (label: string, value: any) => {
        const newAmenities = { ...selectedAmenities };
        if (value === false || value === '' || value === 'Select') {
            delete newAmenities[label];
        } else {
            newAmenities[label] = value;
        }
        setSelectedAmenities(newAmenities);
    };



    // Modal Component
    const AmenitiesModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Feature and Amenities</h3>
                    <button className="btn-close-modal" onClick={() => setShowAmenitiesModal(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    {Object.keys(AMENITY_TABS).map(tab => (
                        <button
                            key={tab}
                            className={`modal-tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="modal-body">
                    <div className="features-grid">
                        {AMENITY_TABS[activeTab].map((item) => (
                            <div key={item.label} className={item.type === 'checkbox' ? "feature-group checkbox-group" : "feature-group"}>
                                <label className="feature-label" style={{ flex: item.type === 'checkbox' ? 1 : 'unset' }}>{item.label}</label>

                                {item.type === 'select' && (
                                    <select
                                        className="feature-select"
                                        value={selectedAmenities[item.label] || ''}
                                        onChange={(e) => handleAmenityChange(item.label, e.target.value)}
                                    >
                                        <option>Select</option>
                                        {item.options?.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                )}

                                {item.type === 'number' && (
                                    item.label === 'Built in year' || item.label === 'Flooring' || item.label === 'Floors' || item.label === 'Parking Spaces' ?
                                        <input
                                            type="number"
                                            className="feature-input"
                                            value={selectedAmenities[item.label] || ''}
                                            onChange={(e) => handleAmenityChange(item.label, e.target.value)}
                                        /> :
                                        <div className="d-flex justify-content-end">
                                            <input
                                                type="number"
                                                className="feature-input-small"
                                                value={selectedAmenities[item.label] || ''}
                                                onChange={(e) => handleAmenityChange(item.label, e.target.value)}
                                            />
                                        </div>
                                )}

                                {item.type === 'checkbox' && (
                                    <input
                                        type="checkbox"
                                        className="feature-checkbox"
                                        checked={!!selectedAmenities[item.label]}
                                        onChange={(e) => handleAmenityChange(item.label, e.target.checked)}
                                    />
                                )}

                                {item.type === 'text' && (
                                    <input
                                        type="text"
                                        className="feature-input"
                                        value={selectedAmenities[item.label] || ''}
                                        onChange={(e) => handleAmenityChange(item.label, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer" style={{ padding: '20px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn-cancel-amenities" onClick={() => setShowAmenitiesModal(false)}>Cancel</button>
                    <button className="btn-submit-amenities" onClick={() => setShowAmenitiesModal(false)}>Add Amenities</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="post-listing-container">
            {showAmenitiesModal && <AmenitiesModal />}

            {/* Header / Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); handleHome(); }}>
                        <Home className="brand-icon" size={24} />
                        <span className="brand-text fw-bold" style={{ fontSize: '1.25rem' }}>RoomEase</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#postListingNavbar" aria-controls="postListingNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="postListingNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); alert('Settings Coming Soon'); }} title="Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>
                            <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); alert('Notifications Coming Soon'); }} title="Notifications">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            </button>
                            <button className="btn-standard" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="post-listing-body">


                {/* Right Content */}
                <div className="listing-form-content">

                    {/* Card 1: Location and Purpose */}
                    <div className="form-card">
                        <div className="form-section-header">
                            <div className="section-icon-container">
                                <CheckCircle size={24} />
                            </div>
                            <div className="ms-1 pt-1">
                                <label className="section-label mb-0">Select Purpose</label>
                                <div className="purpose-pills mt-2">
                                    <button className={`pill-btn ${purpose === 'Sell' ? 'active' : ''}`} onClick={() => setPurpose('Sell')}>Sell</button>
                                    <button className={`pill-btn ${purpose === 'Rent' ? 'active' : ''}`} onClick={() => setPurpose('Rent')}>Rent</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-section-header mt-4">
                            <div className="section-icon-container">
                                <Building size={24} />
                            </div>
                            <div className="ms-1 pt-1 w-100">
                                <label className="section-label mb-0">Select Property Type</label>
                                <div className="property-type-tabs mt-2">
                                    {['Home', 'Plots', 'Commercial'].map(cat => (
                                        <div key={cat} className={`type-tab ${propertyCategory === cat ? 'active' : ''}`} onClick={() => setPropertyCategory(cat)}>{cat}</div>
                                    ))}
                                </div>
                                <div className="subtype-pills">
                                    {['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse'].map(type => (
                                        <button key={type} className={`pill-btn ${propertyType === type ? 'active' : ''}`} onClick={() => setPropertyType(type)}>
                                            {type === 'House' && <Home size={16} />}
                                            {type === 'Flat' && <Building size={16} />}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><MapPin size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>City</label>
                                <select className="custom-input" name="city" value={formData.city} onChange={handleInputChange}>
                                    <option value="">Select City</option>
                                    <option value="Lahore">Lahore</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="Karachi">Karachi</option>
                                    <option value="Multan">Multan</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><MapPin size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label">Location</label>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="custom-input" placeholder="e.g. DHA Phase 5" />
                            </div>
                        </div>

                        <div className="mt-3" style={{ paddingLeft: '40px' }}>
                            <div className="map-placeholder">
                                <div className="map-pin-center"><MapPin size={32} className="text-accent" /></div>
                                <button className="btn-set-location" onClick={() => setShowLocationModal(true)}>
                                    <MapPin size={16} /> 
                                    {formData.latitude !== 31.5204 ? 'Location Set' : 'Set Location on Map'}
                                </button>
                                {formData.latitude !== 31.5204 && (
                                    <div className="text-muted small mt-1">Coords: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Price and Area */}
                    <div className="form-card">
                        <div className="form-section-header mb-4">
                            <div className="section-icon-container">
                                <Layers size={24} />
                            </div>
                            <div className="ms-1 pt-1">
                                <h3 className="fw-bold fs-5 mb-0">Price and Area</h3>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-icon-wrapper"><Layers size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Area Size</label>
                                <div className="d-flex gap-2">
                                    <input type="number" name="area_size" value={formData.area_size} onChange={handleInputChange} className="custom-input" placeholder="Enter Unit" style={{ flex: 2 }} />
                                    <select name="area_unit" value={formData.area_unit} onChange={handleInputChange} className="custom-input" style={{ flex: 1 }}>
                                        <option value="Marla">Marla</option>
                                        <option value="Sq. Ft.">Sq. Ft.</option>
                                        <option value="Kanal">Kanal</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><DollarSign size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label">Price / Rent (PKR)</label>
                                <div className="d-flex gap-2">
                                    <input type="number" name="monthly_rent_PKR" value={formData.monthly_rent_PKR} onChange={handleInputChange} className="custom-input" placeholder="Enter Price" style={{ flex: 2 }} />
                                    <div className="custom-input d-flex align-items-center justify-content-center" style={{ flex: 1, opacity: 0.7 }}>PKR</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingLeft: '40px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <div className="section-label mb-1">Installment available</div>
                                    <div className="section-subheader mb-0">Enable if listing is available on installments</div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" checked={installment} onChange={(e) => setInstallment(e.target.checked)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="section-label mb-1">Ready for Possession</div>
                                    <div className="section-subheader mb-0">Enable if listing is ready for possession</div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" checked={possession} onChange={(e) => setPossession(e.target.checked)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Feature and Amenities */}
                    <div className="form-card">
                        <div className="form-section-header mb-4">
                            <div className="section-icon-container">
                                <Star size={24} />
                            </div>
                            <div className="ms-1 pt-1">
                                <h3 className="fw-bold fs-5 mb-0">Feature and Amenities</h3>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '30px' }}>
                            <div className="input-icon-wrapper"><Bed size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '15px' }}>Bedrooms</label>
                                <div className="number-selector">
                                    {['Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'].map(num => (
                                        <button
                                            key={num}
                                            className={`number-btn ${bedrooms === num ? 'active' : ''}`}
                                            onClick={() => setBedrooms(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><Bath size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '15px' }}>Bathrooms</label>
                                <div className="number-selector">
                                    {['1', '2', '3', '4', '5', '6', '6+'].map(num => (
                                        <button
                                            key={num}
                                            className={`number-btn ${bathrooms === num ? 'active' : ''}`}
                                            onClick={() => setBathrooms(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="input-group mt-4">
                            <div className="input-icon-wrapper"><Home size={20} /></div>
                            <div className="input-field-wrapper">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <label className="section-label">Feature and Amenities</label>
                                        <p className="section-subheader mb-0">Add additional features e.g. parking spaces, waste disposal, internet etc.</p>
                                    </div>
                                    <button
                                        className="btn-add-amenities"
                                        onClick={() => setShowAmenitiesModal(true)}
                                    >
                                        Add Amenities
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Selected Amenities Tags */}
                        {Object.keys(selectedAmenities).length > 0 && (
                            <div className="selected-amenities-tags mt-4 ms-5">
                                <label className="section-label fs-6 mb-2">Selected Amenities</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {Object.entries(selectedAmenities).map(([key, value]) => (
                                        <div key={key} className="amenity-tag">
                                            <span>{key}: {value === true ? 'Yes' : value}</span>
                                            <button
                                                onClick={() => handleAmenityChange(key, false)}
                                                className="btn btn-link text-accent p-0 ms-1 fw-bold text-decoration-none"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                    </div>
                    {/* End Card 3 */}

                    {/* Card 4: Ad Information */}
                    <div className="form-card">
                        <div className="form-section-header">
                            <div className="section-icon-container">
                                <FileText size={24} />
                            </div>
                            <div className="ms-1 pt-1">
                                <h3 className="fw-bold fs-5 mb-0">Ad Information</h3>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '30px' }}>
                            <div className="input-icon-wrapper"><Type size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="custom-input" placeholder="Enter property title e.g. Beautiful House in DHA Phase 5" />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><AlignLeft size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                    placeholder="Describe your property, it's features, area it is in etc."
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Property Images and Videos */}
                    <div className="form-card">
                        <div className="form-section-header mb-4">
                            <div className="section-icon-container">
                                <Image size={24} />
                            </div>
                            <div className="ms-1 pt-1">
                                <h3 className="fw-bold fs-5 mb-0">Property Images and Videos</h3>
                            </div>
                        </div>

                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleImageUpload}
                        />

                        <div className="upload-box-dashed" onClick={() => fileInputRef.current?.click()}>
                            <div className="upload-icon-circle"><Image size={32} /></div>
                            <div className="upload-text">Click or drag to upload property images</div>
                            <div className="upload-hint">Upload at least 5-10 high quality photos</div>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="image-preview-grid mt-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="preview-item">
                                        <img src={img} alt={`Preview ${idx}`} />
                                        <button className="remove-img-btn" onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="input-group mt-5">
                            <div className="input-icon-wrapper"><Video size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label">Add Videos of your Property</label>
                                <p className="section-subheader">
                                    Add videos of your property from Youtube. Paste the link below.
                                </p>
                                <button className="btn-add-video">Add Video</button>
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Contact Information */}
                    <div className="form-card">
                        <div className="form-section-header">
                            <div className="section-icon-container">
                                <Phone size={24} />
                            </div>
                            <div className="ms-1 pt-1">
                                <h3 className="fw-bold fs-5 mb-0">Contact Information</h3>
                            </div>
                        </div>

                        <div className="input-group mt-4">
                            <div className="input-icon-wrapper"><Mail size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label">Email</label>
                                <input type="email" className="custom-input" value="mhassamse@gmail.com" readOnly style={{ opacity: 0.7 }} />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><Smartphone size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Mobile</label>
                                <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="custom-input" placeholder="Enter Mobile Number" style={{ flex: 1 }} />
                            </div>
                        </div>


                        <div className="input-group">
                            <div className="input-icon-wrapper"><Phone size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Landline</label>
                                <input type="text" name="landline" value={formData.landline} onChange={handleInputChange} className="custom-input" placeholder="Enter Landline" />
                            </div>
                        </div>

                    </div>
                    {/* End Card 6 */}

                    <div className="d-flex justify-content-end mt-4 mb-5">
                        <button className="btn-submit-listing" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Listing' : 'Submit')}
                        </button>
                    </div>

                </div>
            </div>

            {/* Location Picker Modal */}
            {showLocationModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content map-modal">
                        <div className="modal-header">
                            <h5 className="modal-title">Select Property Location</h5>
                            <button className="btn-close-custom" onClick={() => setShowLocationModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body p-0" style={{ height: '450px' }}>
                            <MapContainer 
                                center={[formData.latitude, formData.longitude]} 
                                zoom={13} 
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationPicker 
                                    position={{ lat: formData.latitude, lng: formData.longitude }} 
                                    onPick={(pos) => setFormData(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))} 
                                />
                            </MapContainer>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-standard" onClick={() => setShowLocationModal(false)}>Confirm Location</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LocationPicker = ({ position, onPick }: { position: { lat: number, lng: number }, onPick: (pos: { lat: number, lng: number }) => void }) => {
    useMapEvents({
        click(e) {
            onPick(e.latlng);
        },
    });

    return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

export default PostListingPage;
