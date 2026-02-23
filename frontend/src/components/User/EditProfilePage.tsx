import React, { useState, useEffect } from "react";
import {
    Home, Moon, Sun, Clock,
    Trash2, User as UserIcon, Volume2, Volume1, VolumeX,
    BookOpen, Coffee, Library, Laptop,
    Utensils, Leaf, Camera
} from 'lucide-react';
import "../../styles/User/CreateProfilePage.css"; // Reuse existing styles
import { api } from "../../services/api";
import type { ProfileData } from "../../services/api";

interface User {
    id: string;
    email: string;
    username: string;
    profile_id?: string;
}

interface EditProfilePageProps {
    user: User;
    onNavigateToDashboard: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification?: () => void;
    onLogout: () => void;
}

const CITY_AREAS: Record<string, string[]> = {
    "Islamabad": ["G-11", "G-10", "H-9", "F-8"],
    "Karachi": ["Gulshan-e-Iqbal", "DHA", "Clifton", "Nazimabad"],
    "Faisalabad": ["Peoples Colony", "Jaranwala Road", "D Ground"],
    "Multan": ["Shah Rukn-e-Alam", "Gulgasht Colony", "Cantt"],
    "Rawalpindi": ["Chandni Chowk", "Satellite Town", "Saddar"],
    "Lahore": ["Gulberg", "Model Town", "Johar Town", "DHA"],
    "Peshawar": ["University Town", "Saddar", "Hayatabad"]
};

export const EditProfilePage: React.FC<EditProfilePageProps> = ({
    user,
    onNavigateToDashboard,
    onLogout
}) => {
    const [formData, setFormData] = useState<ProfileData>({
        full_name: user?.username || '',
        city: '',
        area: '',
        budget_PKR: 0,
        sleep_schedule: 'Flexible',
        cleanliness: 'Average',
        noise_tolerance: 'Moderate',
        study_habits: 'Room study',
        food_pref: 'Flexible',
        age: 18,
        occupation: '',
        raw_profile_text: '',
        profile_photo: ''
    });

    const [availableAreas, setAvailableAreas] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // Start as loading to fetch data
    const [saving, setSaving] = useState(false);

    // Fetch existing profile data
    useEffect(() => {
        let isMounted = true;
        const fetchProfile = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const profile = await api.getProfile(user.id);
                if (isMounted && profile) {
                    setFormData({
                        full_name: profile.full_name || '',
                        city: profile.city || '',
                        area: profile.area || '',
                        budget_PKR: profile.budget_PKR || 0,
                        sleep_schedule: profile.sleep_schedule || 'Flexible',
                        cleanliness: profile.cleanliness || 'Average',
                        noise_tolerance: profile.noise_tolerance || 'Moderate',
                        study_habits: profile.study_habits || 'Room study',
                        food_pref: profile.food_pref || 'Flexible',
                        age: profile.age || 18,
                        occupation: profile.occupation || '',
                        raw_profile_text: profile.raw_profile_text || '',
                        profile_photo: profile.profile_photo || ''
                    });

                    if (profile.city && CITY_AREAS[profile.city]) {
                        setAvailableAreas(CITY_AREAS[profile.city]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                // Fail silently if no profile found - user might be redirected elsewhere anyway
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfile();
        return () => { isMounted = false; };
    }, [user?.id]);

    // Update areas when city changes (only if it's a manual change, not initial load)
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCity = e.target.value;
        setFormData(prev => ({ ...prev, city: newCity, area: '' }));
        if (newCity && CITY_AREAS[newCity]) {
            setAvailableAreas(CITY_AREAS[newCity]);
        } else {
            setAvailableAreas([]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'city') return; // Handled separately

        setFormData(prev => ({
            ...prev,
            [name]: name === 'budget_PKR' || name === 'age' ? (value === '' ? 0 : parseInt(value)) : value
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelection = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            if (!user.profile_id) {
                alert('No profile found to update.');
                return;
            }
            setSaving(true);
            await api.updateProfile(user.profile_id, formData);
            alert('Profile updated successfully!');
            onNavigateToDashboard();
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            alert(`Failed to update profile: ${error.message || 'Please try again.'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner-large" />
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container create-profile-page">
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); onNavigateToDashboard(); }}>
                        <Home className="text-primary" size={24} style={{ color: '#B85D47' }} />
                        <span className="fw-bold" style={{ color: '#B85D47', fontSize: '1.25rem' }}>RoomEase</span>
                    </a>
                    <button className="btn-standard ms-auto" onClick={onLogout}>Logout</button>
                </div>
            </nav>

            <div className="profile-container">
                <div className="profile-content-wrapper">
                    <div className="create-profile-header" style={{ marginBottom: '24px', textAlign: 'left' }}>
                        <h1 className="create-profile-title">Edit Profile</h1>
                        <p className="create-profile-subtitle">Update your profile to keep your matches accurate.</p>
                    </div>

                    <div className="profile-card">

                        {/* Profile Photo & Personal Details */}
                        <section className="form-section">
                            <h2 className="section-heading">Personal Details</h2>

                            {/* Profile Photo Upload */}
                            <div className="profile-photo-section">
                                <div className="photo-placeholder" style={{ position: 'relative', cursor: 'pointer' }}>
                                    {formData.profile_photo ? (
                                        <img src={formData.profile_photo} alt="Profile" className="profile-photo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        <div className="photo-empty">
                                            <Camera size={40} className="text-gray-400" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Tap to upload photo</p>
                            </div>

                            <div className="profile-input-group">
                                <label htmlFor="full_name" className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 profile-input-group">
                                    <label htmlFor="age" className="input-label">Age</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age === 0 ? '' : formData.age}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        min="18"
                                        placeholder="18"
                                    />
                                </div>
                                <div className="col-md-6 profile-input-group">
                                    <label htmlFor="occupation" className="input-label">Occupation</label>
                                    <input
                                        type="text"
                                        id="occupation"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Student, Engineer, etc."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Location & Budget */}
                        <section className="form-section">
                            <h2 className="section-heading">Location & Budget</h2>
                            <div className="row">
                                <div className="col-md-6 profile-input-group">
                                    <label htmlFor="city" className="input-label">City</label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        className="form-select"
                                    >
                                        <option value="">Select City</option>
                                        {Object.keys(CITY_AREAS).map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 profile-input-group">
                                    <label htmlFor="area" className="input-label">Area</label>
                                    <select
                                        id="area"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        disabled={!formData.city}
                                    >
                                        <option value="">Select Area</option>
                                        {availableAreas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="profile-input-group">
                                <label htmlFor="budget_PKR" className="input-label">Monthly Budget (PKR)</label>
                                <input
                                    type="number"
                                    id="budget_PKR"
                                    name="budget_PKR"
                                    value={formData.budget_PKR === 0 ? '' : formData.budget_PKR}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. 50000"
                                    min="0"
                                />
                            </div>
                        </section>

                        {/* Lifestyle Preferences - Icon Based */}
                        <section className="form-section">
                            <h2 className="section-heading">Lifestyle Preferences</h2>

                            {/* Sleep Schedule */}
                            <div className="preference-group">
                                <label className="input-label">Sleep Schedule</label>
                                <div className="icon-options-grid">
                                    <IconOption label="Night Owl" value="Night owl" currentValue={formData.sleep_schedule} icon={Moon} onClick={(val) => handleSelection('sleep_schedule', val)} />
                                    <IconOption label="Early Riser" value="Early riser" currentValue={formData.sleep_schedule} icon={Sun} onClick={(val) => handleSelection('sleep_schedule', val)} />
                                    <IconOption label="Flexible" value="Flexible" currentValue={formData.sleep_schedule} icon={Clock} onClick={(val) => handleSelection('sleep_schedule', val)} />
                                </div>
                            </div>

                            {/* Cleanliness */}
                            <div className="preference-group">
                                <label className="input-label">Cleanliness</label>
                                <div className="icon-options-grid">
                                    <IconOption label="Tidy" value="Tidy" currentValue={formData.cleanliness} icon={Leaf} onClick={(val) => handleSelection('cleanliness', val)} />
                                    <IconOption label="Average" value="Average" currentValue={formData.cleanliness} icon={UserIcon} onClick={(val) => handleSelection('cleanliness', val)} />
                                    <IconOption label="Messy" value="Messy" currentValue={formData.cleanliness} icon={Trash2} onClick={(val) => handleSelection('cleanliness', val)} />
                                </div>
                            </div>

                            {/* Noise Tolerance */}
                            <div className="preference-group">
                                <label className="input-label">Noise Tolerance</label>
                                <div className="icon-options-grid">
                                    <IconOption label="Quiet" value="Quiet" currentValue={formData.noise_tolerance} icon={VolumeX} onClick={(val) => handleSelection('noise_tolerance', val)} />
                                    <IconOption label="Moderate" value="Moderate" currentValue={formData.noise_tolerance} icon={Volume1} onClick={(val) => handleSelection('noise_tolerance', val)} />
                                    <IconOption label="Loud Ok" value="Loud ok" currentValue={formData.noise_tolerance} icon={Volume2} onClick={(val) => handleSelection('noise_tolerance', val)} />
                                </div>
                            </div>

                            {/* Study Habits */}
                            <div className="preference-group">
                                <label className="input-label">Study/Work Habits</label>
                                <div className="icon-options-grid">
                                    <IconOption label="Online Classes" value="Online classes" currentValue={formData.study_habits} icon={Laptop} onClick={(val) => handleSelection('study_habits', val)} />
                                    <IconOption label="Late Night" value="Late-night study" currentValue={formData.study_habits} icon={Moon} onClick={(val) => handleSelection('study_habits', val)} />
                                    <IconOption label="Library" value="Library" currentValue={formData.study_habits} icon={Library} onClick={(val) => handleSelection('study_habits', val)} />
                                    <IconOption label="Room Study" value="Room study" currentValue={formData.study_habits} icon={BookOpen} onClick={(val) => handleSelection('study_habits', val)} />
                                </div>
                            </div>

                            {/* Food Preferences */}
                            <div className="preference-group">
                                <label className="input-label">Food Preferences</label>
                                <div className="icon-options-grid">
                                    <IconOption label="Flexible" value="Flexible" currentValue={formData.food_pref} icon={Coffee} onClick={(val) => handleSelection('food_pref', val)} />
                                    <IconOption label="Veg" value="Veg" currentValue={formData.food_pref} icon={Leaf} onClick={(val) => handleSelection('food_pref', val)} />
                                    <IconOption label="Non-Veg" value="Non-veg" currentValue={formData.food_pref} icon={Utensils} onClick={(val) => handleSelection('food_pref', val)} />
                                </div>
                            </div>

                            <div className="profile-input-group">
                                <label htmlFor="raw_profile_text" className="input-label">Bio / Additional Details</label>
                                <input
                                    type="text"
                                    id="raw_profile_text"
                                    name="raw_profile_text"
                                    value={formData.raw_profile_text}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Any other preferences or details..."
                                />
                            </div>
                        </section>

                        <div className="button-group">
                            <button onClick={handleSaveProfile} className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// Extracted IconOption Component for clarity
const IconOption = ({
    label,
    value,
    currentValue,
    icon: Icon,
    onClick
}: {
    label: string,
    value: string,
    currentValue: string,
    icon: any,
    onClick: (val: string) => void
}) => (
    <div
        className={`icon-option ${currentValue === value ? 'selected' : ''}`}
        onClick={() => onClick(value)}
    >
        <Icon size={24} className="icon" />
        <span className="label">{label}</span>
    </div>
);
