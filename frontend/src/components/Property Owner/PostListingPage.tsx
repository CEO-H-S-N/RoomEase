import React, { useState } from 'react';
import { Home, MapPin, Building, CheckCircle, DollarSign, Layers, Bed, Bath, Star, X, FileText, Type, AlignLeft, Image, Video, Phone, Smartphone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Property Owner/PostListingPage.css';

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
                        <Home className="text-primary" size={24} style={{ color: '#14919B' }} />
                        <span className="fw-bold" style={{ color: '#14919B', fontSize: '1.25rem' }}>RoomEase</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#postListingNavbar" aria-controls="postListingNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="postListingNavbar">
                        <div className="ms-auto d-flex align-items-center gap-3">
                            {/* Settings Icon */}
                            <button className="btn btn-link text-secondary p-0 border-0" onClick={(e) => { e.preventDefault(); alert('Settings Coming Soon'); }} title="Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>
                            {/* Notification Icon */}
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
                {/* Left Sidebar */}
                <div className="listing-sidebar">
                    <div className="sidebar-step active">
                        <div className="sidebar-icon-box">
                            <MapPin size={24} />
                        </div>
                        <div className="sidebar-label">Location and<br />Purpose</div>
                    </div>

                    <div className="sidebar-step active">
                        <div className="sidebar-icon-box">
                            <DollarSign size={24} />
                        </div>
                        <div className="sidebar-label">Price and<br />Area</div>
                    </div>

                    <div className="sidebar-step active">
                        <div className="sidebar-icon-box">
                            <Star size={24} />
                        </div>
                        <div className="sidebar-label">Feature and<br />Amenities</div>
                    </div>

                    <div className="sidebar-step active">
                        <div className="sidebar-icon-box">
                            <FileText size={24} />
                        </div>
                        <div className="sidebar-label">Ad<br />Information</div>
                    </div>

                    <div className="sidebar-step active">
                        <div className="sidebar-icon-box">
                            <Image size={24} />
                        </div>
                        <div className="sidebar-label">Property Images<br />and Videos</div>
                    </div>

                    <div className="sidebar-step active">
                        <div className="sidebar-icon-box">
                            <Phone size={24} />
                        </div>
                        <div className="sidebar-label">Contact<br />Information</div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="listing-form-content">

                    {/* Card 1: Location and Purpose */}
                    <div className="form-card">
                        <div className="form-section-header">
                            <CheckCircle size={20} className="section-icon-small" />
                            <div>
                                <label className="section-label">Select Purpose</label>
                                <div className="purpose-pills">
                                    <button className={`pill-btn ${purpose === 'Sell' ? 'active' : ''}`} onClick={() => setPurpose('Sell')}>Sell</button>
                                    <button className={`pill-btn ${purpose === 'Rent' ? 'active' : ''}`} onClick={() => setPurpose('Rent')}>Rent</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-section-header">
                            <Building size={20} className="section-icon-small" />
                            <div style={{ width: '100%' }}>
                                <label className="section-label">Select Property Type</label>
                                <div className="property-type-tabs">
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
                                <select className="custom-input">
                                    <option>Select City</option>
                                    <option>Lahore</option>
                                    <option>Islamabad</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: '10px' }}>
                            <div className="input-icon-wrapper"><MapPin size={20} style={{ opacity: 0.5 }} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Location</label>
                                <input type="text" className="custom-input" placeholder="Search Location" style={{ background: '#F8F9FA' }} />
                            </div>
                        </div>

                        <div style={{ paddingLeft: '40px' }}>
                            <div className="map-placeholder">
                                <div className="map-pin-center"><MapPin size={32} color="#00A651" fill="#00A651" /></div>
                                <button className="btn-set-location"><MapPin size={16} /> Set Location on Map</button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Price and Area */}
                    <div className="form-card">
                        <div className="input-group">
                            <div className="input-icon-wrapper"><Layers size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Area Size</label>
                                <div className="d-flex gap-2">
                                    <input type="number" className="custom-input" placeholder="Enter Unit" style={{ flex: 2 }} />
                                    <select className="custom-input" style={{ flex: 1 }}>
                                        <option>Marla</option>
                                        <option>Sq. Ft.</option>
                                        <option>Kanal</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><DollarSign size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Price</label>
                                <div className="d-flex gap-2">
                                    <input type="number" className="custom-input" placeholder="Enter Price" style={{ flex: 2 }} />
                                    <select className="custom-input" style={{ flex: 1, backgroundColor: '#f0f0f0' }} disabled><option>PKR</option></select>
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingLeft: '40px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <div className="section-label" style={{ marginBottom: '4px' }}>Installment available</div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>Enable if listing is available on installments</div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" checked={installment} onChange={(e) => setInstallment(e.target.checked)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="section-label" style={{ marginBottom: '4px' }}>Ready for Possession</div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>Enable if listing is ready for possession</div>
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
                        <div className="form-section-header" style={{ marginBottom: '0' }}>
                            <div className="section-icon-small" style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginRight: '5px' }}>
                                <Star size={24} color="#00A651" />
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Feature and Amenities</h3>
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

                        <div className="input-group">
                            <div className="input-icon-wrapper"><Home size={20} /></div>
                            <div className="input-field-wrapper">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <label className="section-label" style={{ marginBottom: '4px' }}>Feature and Amenities</label>
                                        <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Add additional features e.g. parking spaces, waste disposal, internet etc.</p>
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
                            <div className="selected-amenities-tags" style={{ marginTop: '20px' }}>
                                <label className="section-label" style={{ fontSize: '13px' }}>Selected Amenities</label>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {Object.entries(selectedAmenities).map(([key, value]) => (
                                        <div key={key} className="amenity-tag">
                                            <span>{key}: {value === true ? 'Yes' : value}</span>
                                            <button
                                                onClick={() => handleAmenityChange(key, false)}
                                                style={{ background: 'none', border: 'none', color: '#00a651', cursor: 'pointer', padding: '0 0 0 6px', fontWeight: 'bold' }}
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
                            <div className="section-icon-small" style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginRight: '5px' }}>
                                <FileText size={24} color="#00A651" />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Ad Information</h3>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '30px' }}>
                            <div className="input-icon-wrapper"><Type size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Title</label>
                                <input type="text" className="custom-input" placeholder="Enter property title e.g. Beautiful House in DHA Phase 5" />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><AlignLeft size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Description</label>
                                <textarea
                                    className="custom-input"
                                    placeholder="Describe your property, it's features, area it is in etc."
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Property Images and Videos */}
                    <div className="form-card">
                        <div className="form-section-header">
                            <div className="section-icon-small" style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginRight: '5px' }}>
                                <Image size={24} color="#00A651" />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Property Images and Videos</h3>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '30px' }}>
                            <div className="input-icon-wrapper"><Image size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '15px' }}>Upload Images of your Property</label>

                                <div className="upload-box-dashed">
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="upload-placeholder-icon">
                                            <Image size={32} color="#00A651" />
                                        </div>
                                        <div className="d-flex flex-column gap-2">
                                            <button className="btn-upload-green">Upload Images</button>
                                            <button className="btn-image-bank">Image Bank</button>
                                        </div>
                                        <div className="upload-tips">
                                            <div className="tip-item"><CheckCircle size={14} color="#00A651" /> Ads with pictures get 5x more views.</div>
                                            <div className="tip-item"><CheckCircle size={14} color="#00A651" /> Upload good quality pictures with proper lighting.</div>
                                            <div className="tip-item"><CheckCircle size={14} color="#00A651" /> Double click to set cover image.</div>
                                        </div>
                                    </div>
                                    <div className="upload-footer-text">Max size 5MB, .jpg .png only</div>
                                </div>


                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '30px' }}>
                            <div className="input-icon-wrapper"><Video size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Add Videos of your Property</label>
                                <div style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                                    Add videos of your property from Youtube. Upload on Youtube and paste the link below.
                                </div>
                                <button className="btn-add-video" style={{
                                    background: '#fff',
                                    color: '#00A651',
                                    border: '1px solid #00A651',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    fontWeight: 600
                                }}>Add Video</button>
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Contact Information */}
                    <div className="form-card">
                        <div className="form-section-header">
                            <div className="section-icon-small" style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginRight: '5px' }}>
                                <Phone size={24} color="#00A651" />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Contact Information</h3>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '30px' }}>
                            <div className="input-icon-wrapper"><Mail size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Email</label>
                                <input type="email" className="custom-input" value="mhassamse@gmail.com" readOnly style={{ backgroundColor: '#fff' }} />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-icon-wrapper"><Smartphone size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Mobile</label>
                                <input type="text" className="custom-input" placeholder="Enter Mobile Number" style={{ flex: 1 }} />
                            </div>
                        </div>


                        <div className="input-group">
                            <div className="input-icon-wrapper"><Phone size={20} /></div>
                            <div className="input-field-wrapper">
                                <label className="section-label" style={{ marginBottom: '8px' }}>Landline</label>
                                <input type="text" className="custom-input" placeholder="Enter Landline" />
                            </div>
                        </div>

                    </div>
                    {/* End Card 6 */}

                    <div className="d-flex justify-content-end mt-4 mb-5">
                        <button className="btn-submit-listing">Submit</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

