import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SharedNavbar from '../shared/SharedNavbar';
import '../../styles/User/ViewProfile.css';

interface ViewProfileProps {
    user: { fullName: string; email: string; profile_id?: string } | null;
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToListing: () => void;
    onNavigateToSetting: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToProfiles: () => void;
    onNavigateToMessages: () => void;
    onNavigateToProfile: (id?: string) => void;
    onNavigateToNotification?: () => void;
    onNavigateToMap?: () => void;
    onNavigateToRedFlagAlert?: () => void;
}

export default function ViewProfile({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToListing,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToProfiles,
    onNavigateToMessages,
    onNavigateToProfile,
    onNavigateToNotification,
    onNavigateToMap,
    onNavigateToRedFlagAlert
}: ViewProfileProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': onNavigateToMessages(); break;
            case 'profiles': onNavigateToProfiles(); break;
            case 'edit-profile': onNavigateToSetting(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'notification': onNavigateToNotification?.(); break;
            case 'map': onNavigateToMap?.(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert?.(); break;
            case 'profile': onNavigateToProfile(user?.profile_id); break;
        }
    };

    const profiles = [
        {
            name: "Usman Khan",
            verified: true,
            location: "Islamabad, Pakistan",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=400&h=400",
            bio: "I am a quiet and organized researcher looking for a peaceful place to stay. I enjoy reading, coffee, and early morning runs. Ideally looking for a shared apartment with professionals who respect privacy.",
            age: "24",
            gender: "Male",
            occupation: "Researcher",
            organization: "NUST University",
            languages: "English, Urdu",
            zodiac: "Libra",
            preferences: {
                smoking: "No",
                petFriendly: "Yes (Cat)",
                cleanliness: "Very Clean",
                dietary: "Halal",
                expectations: [
                    "Prefer a quiet environment after 10 PM.",
                    "Looking for someone who cleans up after cooking.",
                    "No overnight guests without prior notice."
                ]
            },
            financial: {
                budget: "PKR 30,000 - 50,000",
                moveIn: "Nov 1, 2026",
                duration: "12 Months (Long Term)",
                location: "DHA Phase 6, Clifton"
            }
        },
        {
            name: "Hassam",
            verified: true,
            location: "Lahore, Pakistan",
            image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=400&h=400",
            bio: "Creative artist who loves to explore the city. I'm social but also value my downtime. Looking for a roommate who is chill and easygoing.",
            age: "26",
            gender: "Male",
            occupation: "Artist",
            organization: "NCA",
            languages: "English, Punjabi",
            zodiac: "Gemini",
            preferences: {
                smoking: "Occasional",
                petFriendly: "No Pets",
                cleanliness: "Organized",
                dietary: "Flexible",
                expectations: [
                    "Open to socializing on weekends.",
                    "Respect for personal space.",
                    "Slightly flexible on cleaning schedules."
                ]
            },
            financial: {
                budget: "PKR 25,000 - 40,000",
                moveIn: "Dec 15, 2026",
                duration: "6 Months",
                location: "Gulberg, Model Town"
            }
        },
        {
            name: "Ali Khan",
            verified: false,
            location: "Karachi, Pakistan",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400",
            bio: "Final year student focused on studies. Need a quiet place near campus.",
            age: "22",
            gender: "Male",
            occupation: "Student",
            organization: "IBA",
            languages: "Urdu, Sindhi",
            zodiac: "Virgo",
            preferences: {
                smoking: "No",
                petFriendly: "Yes (Dog)",
                cleanliness: "Standard",
                dietary: "Vegetarian",
                expectations: [
                    "Study hours are quiet time.",
                    "Shared grocery expenses.",
                    "Weekly cleaning rotation."
                ]
            },
            financial: {
                budget: "PKR 20,000 - 35,000",
                moveIn: "Jan 1, 2027",
                duration: "Semester (4 Months)",
                location: "Clifton, Defense"
            }
        }
    ];

    const currentProfile = profiles[currentProfileIndex];

    const handleNextProfile = () => {
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const handlePrevProfile = () => {
        setCurrentProfileIndex((prevIndex) => (prevIndex - 1 + profiles.length) % profiles.length);
    };

    return (
        <div className="view-profile-container brown-theme">
            <SharedNavbar
                currentPage="profiles"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user?.fullName || 'User'}
            />

            <main className="view-profile-content">
                <div className="profile-container-fluid">
                    <div className="profile-main-layout">
                        {/* Bootstrap Tabs Header (Matched to Settings) */}
                        <div className="border-bottom mb-4">
                            <ul className="nav nav-tabs border-bottom-0 gap-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link border-0 bg-transparent py-2 px-1 ${activeTab === 'profile' ? 'active-tab' : 'text-muted'}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link border-0 bg-transparent py-2 px-1 ${activeTab === 'habits' ? 'active-tab' : 'text-muted'}`}
                                        onClick={() => setActiveTab('habits')}
                                    >
                                        Preferences
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link border-0 bg-transparent py-2 px-1 ${activeTab === 'budget' ? 'active-tab' : 'text-muted'}`}
                                        onClick={() => setActiveTab('budget')}
                                    >
                                        Budget & More
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Tab Content Panels */}
                        <div className="profile-tab-content">
                            {/* Personal Details Tab */}
                            {activeTab === 'profile' && (
                                <div className="animate-fade-in-up">
                                    <div className="profile-header-section">
                                        <div className="d-flex align-items-center gap-3">
                                            {/* Left Arrow (Back) */}
                                            <button className="nav-arrow-btn" onClick={handlePrevProfile}>
                                                <ChevronLeft size={24} />
                                            </button>

                                            <div className="profile-identity-group">
                                                <img
                                                    src={currentProfile.image}
                                                    alt="Profile"
                                                    className="profile-large-avatar"
                                                />
                                                <div className="profile-identity">
                                                    <h1>{currentProfile.name} {currentProfile.verified && <span className="verified-badge-large">✓ Verified</span>}</h1>
                                                    <p className="profile-location">{currentProfile.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3">
                                            {/* Message Button */}
                                            <button className="btn-prominent">
                                                Message
                                            </button>

                                            {/* Right Arrow (Forward) */}
                                            <button className="nav-arrow-btn" onClick={handleNextProfile}>
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="section-block">
                                        <h3>About Me</h3>
                                        <p className="profile-bio">
                                            {currentProfile.bio}
                                        </p>
                                    </div>

                                    <div className="info-grid-section">
                                        <h3>Personal Info</h3>
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <span className="label">Age</span>
                                                <span className="value">{currentProfile.age} Years</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Gender</span>
                                                <span className="value">{currentProfile.gender}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Occupation</span>
                                                <span className="value">{currentProfile.occupation}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Organization</span>
                                                <span className="value">{currentProfile.organization}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Languages</span>
                                                <span className="value">{currentProfile.languages}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Zodiac Sign</span>
                                                <span className="value">{currentProfile.zodiac}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Habits Tab */}
                            {activeTab === 'habits' && (
                                <div className="animate-fade-in-up">
                                    <div className="section-block">
                                        <h3>Preferences</h3>
                                        {/* Moved Habits Here */}
                                        <div className="info-grid mb-4">
                                            <div className="info-item">
                                                <span className="label">Smoking</span>
                                                <span className="value">{currentProfile.preferences.smoking}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Pet Friendly</span>
                                                <span className="value">{currentProfile.preferences.petFriendly}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Cleanliness</span>
                                                <span className="value">{currentProfile.preferences.cleanliness}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Dietary</span>
                                                <span className="value">{currentProfile.preferences.dietary}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section-block mt-4">
                                        <h3>Roommate Expectations</h3>
                                        <ul className="preference-list">
                                            {currentProfile.preferences.expectations.map((exp: string, index: number) => (
                                                <li key={index}>{exp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Budget Tab */}
                            {activeTab === 'budget' && (
                                <div className="animate-fade-in-up">
                                    <div className="info-grid-section">
                                        <h3>Financial & Logistics</h3>
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <span className="label">Monthly Budget</span>
                                                <span className="value highlight">{currentProfile.financial.budget}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Move-in Date</span>
                                                <span className="value">{currentProfile.financial.moveIn}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Duration</span>
                                                <span className="value">{currentProfile.financial.duration}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Preferred Location</span>
                                                <span className="value">{currentProfile.financial.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
