import React, { useState } from "react";
import {
    Home, Moon, Sun, Clock,
    Trash2, User as UserIcon, Volume2, Volume1, VolumeX,
    BookOpen, Coffee, Library, Laptop,
    Utensils, Leaf, Camera, CheckCircle, AlertCircle
} from 'lucide-react';
import "../../styles/User/CreateProfilePage.css";
import { api } from "../../services/api";
import type { ProfileData } from "../../services/api";

interface User {
    email: string;
    username: string;
    fullName: string;
    profile_id?: string;
}

interface CreateProfilePageProps {
    user: User;
    onNavigateToDashboard: () => void;
    onNavigateToListing: () => void;
    onNavigateToNotification?: () => void;
    onLogout: () => void;
    onProfileCreated?: (profileId: string) => void;
}

const CITY_AREAS: Record<string, string[]> = {
    "Islamabad": ["G-11", "G-10", "H-9", "F-8", "E-7", "I-8", "G-6"],
    "Karachi": ["Gulshan-e-Iqbal", "DHA", "Clifton", "Nazimabad", "North Nazimabad", "Korangi"],
    "Faisalabad": ["Peoples Colony", "Jaranwala Road", "D Ground", "Madina Town"],
    "Multan": ["Shah Rukn-e-Alam", "Gulgasht Colony", "Cantt", "Bosan Road"],
    "Rawalpindi": ["Chandni Chowk", "Satellite Town", "Saddar", "Bahria Town"],
    "Lahore": ["Gulberg", "Model Town", "Johar Town", "DHA", "Bahria Town", "Garden Town"],
    "Peshawar": ["University Town", "Saddar", "Hayatabad", "Board Bazaar"]
};

export const CreateProfilePage: React.FC<CreateProfilePageProps> = ({
    user,
    onNavigateToDashboard,
    onLogout,
    onProfileCreated
}) => {
    const [formData, setFormData] = useState<ProfileData>({
        full_name: user?.fullName || user?.username || '',
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
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMsg, setSuccessMsg] = useState('');

    // Update areas when city changes
    const handleCityChange = (city: string) => {
        setFormData(prev => ({ ...prev, city, area: '' }));
        setAvailableAreas(CITY_AREAS[city] || []);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'budget_PKR' || name === 'age' ? (value === '' ? 0 : parseInt(value)) : value
        }));
        // Clear error for this field on change
        if (errors[name]) {
            setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, profile_photo: 'Photo must be under 5MB' }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_photo: reader.result as string }));
                setErrors(prev => { const n = { ...prev }; delete n['profile_photo']; return n; });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelection = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
        if (!formData.city) newErrors.city = 'Please select a city';
        if (!formData.area) newErrors.area = 'Please select an area';
        if (!formData.budget_PKR || formData.budget_PKR < 1000) newErrors.budget_PKR = 'Enter a valid monthly budget (min PKR 1,000)';
        if (!formData.age || formData.age < 16 || formData.age > 80) newErrors.age = 'Age must be between 16 and 80';
        if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
        return newErrors;
    };

    const handleSaveProfile = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Scroll to first error
            const firstKey = Object.keys(validationErrors)[0];
            document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        try {
            setLoading(true);
            setErrors({});
            const response = await api.createProfile(formData);
            setSuccessMsg('Profile created successfully! Redirecting to dashboard...');
            if (onProfileCreated && response.id) {
                onProfileCreated(response.id);
            }
            setTimeout(() => onNavigateToDashboard(), 1200);
        } catch (error: any) {
            console.error('Failed to create profile:', error);
            setErrors({ _form: error.message || 'Failed to create profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cp-page">
            {/* Modern Navbar */}
            <nav className="cp-navbar">
                <button className="cp-brand" onClick={onNavigateToDashboard}>
                    <Home size={22} />
                    <span>RoomEase</span>
                </button>
                <div className="cp-nav-right">
                    {user?.username && (
                        <span className="cp-user-greeting">Hey, {user.username.split(' ')[0]}!</span>
                    )}
                    <button className="cp-logout-btn" onClick={onLogout}>Logout</button>
                </div>
            </nav>

            <div className="cp-body">
                {/* Page Header */}
                <div className="cp-header-banner">
                    <div className="cp-header-content">
                        <h1 className="cp-title">Create Your Profile</h1>
                        <p className="cp-subtitle">Set up your roommate profile to get the best AI-powered matches.</p>
                    </div>
                </div>

                {/* Success / Error Banners */}
                {successMsg && (
                    <div className="cp-alert cp-alert-success">
                        <CheckCircle size={18} />
                        <span>{successMsg}</span>
                    </div>
                )}
                {errors._form && (
                    <div className="cp-alert cp-alert-error">
                        <AlertCircle size={18} />
                        <span>{errors._form}</span>
                    </div>
                )}

                <div className="cp-card-container">
                    <div className="cp-card">

                        {/* ── Personal Details ── */}
                        <section className="cp-section">
                            <div className="cp-section-header">
                                <UserIcon size={20} />
                                <h2>Personal Details</h2>
                            </div>

                            {/* Photo Upload */}
                            <div className="cp-photo-wrap">
                                <label className="cp-photo-label" htmlFor="photo-input">
                                    {formData.profile_photo ? (
                                        <img src={formData.profile_photo} alt="Profile" className="cp-photo-img" />
                                    ) : (
                                        <div className="cp-photo-empty">
                                            <Camera size={36} />
                                            <span>Upload Photo</span>
                                        </div>
                                    )}
                                    <div className="cp-photo-overlay">
                                        <Camera size={20} />
                                        <span>Change</span>
                                    </div>
                                </label>
                                <input
                                    id="photo-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: 'none' }}
                                />
                                {errors.profile_photo && <p className="cp-field-error">{errors.profile_photo}</p>}
                                <p className="cp-photo-hint">Optional · Max 5 MB · JPG, PNG</p>
                            </div>

                            <div className="cp-fields-grid cp-fields-single">
                                <div className="cp-field-group">
                                    <label htmlFor="full_name" className="cp-label">Full Name *</label>
                                    <input
                                        id="full_name"
                                        name="full_name"
                                        type="text"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className={`cp-input ${errors.full_name ? 'cp-input-error' : ''}`}
                                        placeholder="e.g. Ahmed Hassan"
                                    />
                                    {errors.full_name && <p className="cp-field-error">{errors.full_name}</p>}
                                </div>
                            </div>

                            <div className="cp-fields-grid cp-fields-two">
                                <div className="cp-field-group">
                                    <label htmlFor="age" className="cp-label">Age *</label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        value={formData.age === 0 ? '' : formData.age}
                                        onChange={handleInputChange}
                                        className={`cp-input ${errors.age ? 'cp-input-error' : ''}`}
                                        min="16"
                                        max="80"
                                        placeholder="e.g. 22"
                                    />
                                    {errors.age && <p className="cp-field-error">{errors.age}</p>}
                                </div>
                                <div className="cp-field-group">
                                    <label htmlFor="occupation" className="cp-label">Occupation *</label>
                                    <input
                                        id="occupation"
                                        name="occupation"
                                        type="text"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        className={`cp-input ${errors.occupation ? 'cp-input-error' : ''}`}
                                        placeholder="Student, Engineer, Doctor..."
                                    />
                                    {errors.occupation && <p className="cp-field-error">{errors.occupation}</p>}
                                </div>
                            </div>
                        </section>

                        {/* ── Location & Budget ── */}
                        <section className="cp-section">
                            <div className="cp-section-header">
                                <Home size={20} />
                                <h2>Location &amp; Budget</h2>
                            </div>

                            <div className="cp-fields-grid cp-fields-two">
                                <div className="cp-field-group">
                                    <label htmlFor="city" className="cp-label">City *</label>
                                    <div className="cp-select-wrap">
                                        <select
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={(e) => handleCityChange(e.target.value)}
                                            className={`cp-select ${errors.city ? 'cp-input-error' : ''}`}
                                        >
                                            <option value="">Select City</option>
                                            {Object.keys(CITY_AREAS).map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.city && <p className="cp-field-error">{errors.city}</p>}
                                </div>
                                <div className="cp-field-group">
                                    <label htmlFor="area" className="cp-label">Area *</label>
                                    <div className="cp-select-wrap">
                                        <select
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            className={`cp-select ${errors.area ? 'cp-input-error' : ''}`}
                                            disabled={!formData.city}
                                        >
                                            <option value="">Select Area</option>
                                            {availableAreas.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.area && <p className="cp-field-error">{errors.area}</p>}
                                </div>
                            </div>

                            <div className="cp-fields-grid cp-fields-single">
                                <div className="cp-field-group">
                                    <label htmlFor="budget_PKR" className="cp-label">Monthly Budget (PKR) *</label>
                                    <div className="cp-input-prefix-wrap">
                                        <span className="cp-input-prefix">PKR</span>
                                        <input
                                            id="budget_PKR"
                                            name="budget_PKR"
                                            type="number"
                                            value={formData.budget_PKR === 0 ? '' : formData.budget_PKR}
                                            onChange={handleInputChange}
                                            className={`cp-input cp-input-with-prefix ${errors.budget_PKR ? 'cp-input-error' : ''}`}
                                            placeholder="e.g. 25000"
                                            min="0"
                                        />
                                    </div>
                                    {formData.budget_PKR > 0 && (
                                        <p className="cp-budget-display">PKR {formData.budget_PKR.toLocaleString()} / month</p>
                                    )}
                                    {errors.budget_PKR && <p className="cp-field-error">{errors.budget_PKR}</p>}
                                </div>
                            </div>
                        </section>

                        {/* ── Lifestyle Preferences ── */}
                        <section className="cp-section">
                            <div className="cp-section-header">
                                <Coffee size={20} />
                                <h2>Lifestyle Preferences</h2>
                            </div>
                            <p className="cp-section-note">These help our AI find your best roommate matches.</p>

                            <div className="cp-pref-group">
                                <label className="cp-label">Sleep Schedule</label>
                                <div className="cp-icon-grid">
                                    <IconOption label="Night Owl" value="Night owl" currentValue={formData.sleep_schedule} icon={Moon} onClick={(v) => handleSelection('sleep_schedule', v)} />
                                    <IconOption label="Early Riser" value="Early riser" currentValue={formData.sleep_schedule} icon={Sun} onClick={(v) => handleSelection('sleep_schedule', v)} />
                                    <IconOption label="Flexible" value="Flexible" currentValue={formData.sleep_schedule} icon={Clock} onClick={(v) => handleSelection('sleep_schedule', v)} />
                                </div>
                            </div>

                            <div className="cp-pref-group">
                                <label className="cp-label">Cleanliness</label>
                                <div className="cp-icon-grid">
                                    <IconOption label="Tidy" value="Tidy" currentValue={formData.cleanliness} icon={Leaf} onClick={(v) => handleSelection('cleanliness', v)} />
                                    <IconOption label="Average" value="Average" currentValue={formData.cleanliness} icon={UserIcon} onClick={(v) => handleSelection('cleanliness', v)} />
                                    <IconOption label="Messy" value="Messy" currentValue={formData.cleanliness} icon={Trash2} onClick={(v) => handleSelection('cleanliness', v)} />
                                </div>
                            </div>

                            <div className="cp-pref-group">
                                <label className="cp-label">Noise Tolerance</label>
                                <div className="cp-icon-grid">
                                    <IconOption label="Quiet" value="Quiet" currentValue={formData.noise_tolerance} icon={VolumeX} onClick={(v) => handleSelection('noise_tolerance', v)} />
                                    <IconOption label="Moderate" value="Moderate" currentValue={formData.noise_tolerance} icon={Volume1} onClick={(v) => handleSelection('noise_tolerance', v)} />
                                    <IconOption label="Loud OK" value="Loud ok" currentValue={formData.noise_tolerance} icon={Volume2} onClick={(v) => handleSelection('noise_tolerance', v)} />
                                </div>
                            </div>

                            <div className="cp-pref-group">
                                <label className="cp-label">Study / Work Habits</label>
                                <div className="cp-icon-grid cp-icon-grid-4">
                                    <IconOption label="Online" value="Online classes" currentValue={formData.study_habits} icon={Laptop} onClick={(v) => handleSelection('study_habits', v)} />
                                    <IconOption label="Late Night" value="Late-night study" currentValue={formData.study_habits} icon={Moon} onClick={(v) => handleSelection('study_habits', v)} />
                                    <IconOption label="Library" value="Library" currentValue={formData.study_habits} icon={Library} onClick={(v) => handleSelection('study_habits', v)} />
                                    <IconOption label="Room Study" value="Room study" currentValue={formData.study_habits} icon={BookOpen} onClick={(v) => handleSelection('study_habits', v)} />
                                </div>
                            </div>

                            <div className="cp-pref-group">
                                <label className="cp-label">Food Preferences</label>
                                <div className="cp-icon-grid">
                                    <IconOption label="Flexible" value="Flexible" currentValue={formData.food_pref} icon={Coffee} onClick={(v) => handleSelection('food_pref', v)} />
                                    <IconOption label="Vegetarian" value="Veg" currentValue={formData.food_pref} icon={Leaf} onClick={(v) => handleSelection('food_pref', v)} />
                                    <IconOption label="Non-Veg" value="Non-veg" currentValue={formData.food_pref} icon={Utensils} onClick={(v) => handleSelection('food_pref', v)} />
                                </div>
                            </div>

                            <div className="cp-field-group">
                                <label htmlFor="raw_profile_text" className="cp-label">Bio / Additional Info</label>
                                <textarea
                                    id="raw_profile_text"
                                    name="raw_profile_text"
                                    value={formData.raw_profile_text}
                                    onChange={handleInputChange}
                                    className="cp-textarea"
                                    placeholder="Tell potential roommates about yourself — your schedule, hobbies, what you're looking for..."
                                    rows={4}
                                />
                            </div>
                        </section>

                        {/* ── Save Button ── */}
                        <div className="cp-actions">
                            <button className="cp-cancel-btn" onClick={onNavigateToDashboard} disabled={loading}>
                                Back to Dashboard
                            </button>
                            <button className="cp-save-btn" onClick={handleSaveProfile} disabled={loading}>
                                {loading ? (
                                    <span className="cp-btn-loading">
                                        <span className="cp-btn-spinner" />
                                        Saving...
                                    </span>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Create Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="cp-footer">
                <p>© {new Date().getFullYear()} RoomEase. All rights reserved.</p>
            </footer>
        </div>
    );
};

// ── Reusable Icon Option ──
const IconOption = ({
    label, value, currentValue, icon: Icon, onClick
}: {
    label: string;
    value: string;
    currentValue: string;
    icon: any;
    onClick: (val: string) => void;
}) => (
    <button
        type="button"
        className={`cp-icon-option${currentValue === value ? ' cp-icon-selected' : ''}`}
        onClick={() => onClick(value)}
    >
        <Icon size={22} />
        <span>{label}</span>
    </button>
);
