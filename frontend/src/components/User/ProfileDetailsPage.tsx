import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    MapPin, Check, Star, MessageSquare,
    Clock, Coffee, BookOpen, Volume2, ArrowLeft
} from 'lucide-react';
import { api } from '../../services/api';
import type { ProfileData } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import SharedNavbar from '../shared/SharedNavbar';
import './ProfileDetailsPage.css';

interface ProfileDetailsPageProps {
    onLogout: () => void;
    // Navigation props matching App.tsx requirements
    onNavigateToDashboard: () => void;
    onNavigateToListing: () => void;
    onNavigateToProfiles: () => void;
    onNavigateToProfileDetails?: (id: string) => void;
    onNavigateToMap?: () => void;
    onNavigateToSetting?: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToMessages?: (id: string, name: string, data: any) => void;
    onNavigateToListingDetails?: (id: string) => void;
}

export const ProfileDetailsPage: React.FC<ProfileDetailsPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToListing,
    onNavigateToProfiles,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToMessages,
    onNavigateToListingDetails
}) => {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate(); // Unused
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRating, setUserRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [hasRated, setHasRated] = useState<boolean>(false);

    useEffect(() => {
        console.log("ProfileDetailsPage mounted. ID:", id);
        const fetchProfile = async () => {
            if (!id) {
                console.error("No profile ID found in URL parameters");
                setError("Invalid profile link.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                console.log("Fetching profile for ID:", id);
                const data = await api.getProfileById(id);
                console.log("Profile data received:", data);
                if (!data) {
                    throw new Error("Empty data received");
                }
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Could not load profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'profiles': onNavigateToProfiles(); break;
            case 'edit-profile': onNavigateToSetting?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'logout': onLogout(); break;
        }
    };

    if (loading) {
        return (
            <div className="loading-state" style={{ marginTop: '100px', textAlign: 'center' }}>
                <div className="spinner-large" />
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                <Card variant="elevated" className="error-card">
                    <h2>Profile Not Found</h2>
                    <p>{error || "The requested profile does not exist."}</p>
                    <Button variant="primary" onClick={onNavigateToProfiles}>
                        Back to Profiles
                    </Button>
                </Card>
            </div>
        );
    }

    const displayImage = profile.profile_photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop";

    // Fallbacks
    const displayName = profile.full_name || "Roommate Candidate";
    const displayOccupation = profile.occupation || "Member";

    // MOCK DATA FOR DEMONSTRATION
    const rating = profile.rating || 4.8;

    // Ensure we have reviews
    const reviews = profile.reviews && profile.reviews.length > 0 ? profile.reviews : [
        { id: '1', reviewerName: 'Sarah M.', rating: 5, comment: 'Great roommate! Very clean and quiet.', date: 'Oct 2023' },
        { id: '2', reviewerName: 'John D.', rating: 4, comment: 'Easy to get along with.', date: 'Sep 2023' },
        { id: '3', reviewerName: 'Emily R.', rating: 5, comment: 'Highly recommended.', date: 'Aug 2023' }
    ];

    // Ensure we have past stays
    const pastStays = (profile.past_stays && profile.past_stays.length > 0 ? profile.past_stays : [
        {
            id: '1',
            location: 'DHA Phase 5, Lahore',
            duration: '6 months',
            review: 'Excellent tenant, paid on time.',
            rating: 5,
            thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: '2',
            location: 'Gulberg III, Lahore',
            duration: '1 year',
            review: 'Very responsible and friendly.',
            rating: 5,
            thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
    ]).map((s: any) => {
        // Robust ID handling to prevent crashes
        const stayId = s.id || (s.listingId ? String(s.listingId) : String(Math.random()));

        return {
            ...s,
            listingId: stayId.length > 5 ? stayId : (stayId === '1' ? '6591231fe818f851503acad1' : '6591231fe818f851503acae2'),
            thumbnail: s.thumbnail || 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        };
    });

    console.log("Processed Past Stays:", pastStays); // Debug log

    return (
        <div className="profile-details-page brown-theme">
            <SharedNavbar
                currentPage="profiles"
                onNavigate={handleNavigate}
                userName="User"
                onLogout={onLogout}
            />

            <div className="profile-details-container" style={{ marginTop: '80px' }}>
                <Button variant="ghost" onClick={onNavigateToProfiles} style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Profiles
                </Button>

                {/* Hero Section */}
                <div className="profile-hero">
                    <div className="hero-image-wrapper">
                        <img
                            src={displayImage}
                            alt={profile.full_name}
                            className="hero-profile-image"
                        />
                        {profile.verified && (
                            <div className="hero-verified-badge" title="Verified User">
                                <Check size={20} strokeWidth={3} />
                            </div>
                        )}
                    </div>

                    <div className="hero-info">
                        <div className="hero-header">
                            <h1 className="hero-name">{displayName}</h1>
                            {profile.age && <span className="hero-age">, {profile.age}</span>}
                        </div>
                        <p className="hero-occupation">{displayOccupation}</p>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <Star
                                    size={20}
                                    fill="#FFB400"
                                    color="#FFB400"
                                />
                                <span className="stat-value">{hasRated ? ((rating * reviews.length + userRating) / (reviews.length + 1)).toFixed(1) : rating.toFixed(1)}</span>
                                <span className="stat-label">Avg Rating</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">{reviews.length}</span>
                                <span className="stat-label">Reviews</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">{pastStays.length}</span>
                                <span className="stat-label">Past Stays</span>
                            </div>
                        </div>

                        <div className="hero-location">
                            <MapPin size={18} />
                            {profile.city}, {profile.area}
                        </div>
                    </div>

                    <div className="hero-actions">
                        <Card variant="elevated" className="budget-card">
                            <div className="budget-info">
                                <span className="budget-label">Monthly Budget</span>
                                <h3 className="budget-amount">PKR {(profile.budget_PKR || 0).toLocaleString()}</h3>
                            </div>
                            <Button
                                variant="primary"
                                className="message-btn"
                                fullWidth
                                onClick={() => onNavigateToMessages?.(profile.id || id || '', displayName, {
                                    about: profile.raw_profile_text,
                                    city: profile.city,
                                    area: profile.area
                                })}
                            >
                                <MessageSquare size={18} style={{ marginRight: 8 }} />
                                Message
                            </Button>
                        </Card>
                    </div>
                </div>

                <div className="details-content-grid">
                    {/* Left Column */}
                    <div className="details-main-col">
                        <section className="detail-section">
                            <h2 className="section-title">About Me</h2>
                            <p className="about-text">{profile.raw_profile_text || "This user hasn't written a bio yet."}</p>

                            <div className="lifestyle-badges">
                                {[profile.sleep_schedule, profile.cleanliness, profile.noise_tolerance, profile.food_pref, profile.study_habits].filter(Boolean).map((tag, i) => (
                                    <span key={i} className="lifestyle-pill">{tag}</span>
                                ))}
                            </div>
                        </section>

                        <section className="detail-section">
                            <h2 className="section-title">Lifestyle & Habits</h2>
                            <div className="lifestyle-grid">
                                <div className="lifestyle-item">
                                    <div className="lifestyle-icon"><Clock size={20} /></div>
                                    <div>
                                        <span className="lifestyle-label">Sleep Schedule</span>
                                        <div className="lifestyle-value">{profile.sleep_schedule || "Flexible"}</div>
                                    </div>
                                </div>
                                <div className="lifestyle-item">
                                    <div className="lifestyle-icon"><Check size={20} /></div>
                                    <div>
                                        <span className="lifestyle-label">Cleanliness</span>
                                        <div className="lifestyle-value">{profile.cleanliness || "Average"}</div>
                                    </div>
                                </div>
                                <div className="lifestyle-item">
                                    <div className="lifestyle-icon"><Volume2 size={20} /></div>
                                    <div>
                                        <span className="lifestyle-label">Noise Tolerance</span>
                                        <div className="lifestyle-value">{profile.noise_tolerance || "Moderate"}</div>
                                    </div>
                                </div>
                                <div className="lifestyle-item">
                                    <div className="lifestyle-icon"><BookOpen size={20} /></div>
                                    <div>
                                        <span className="lifestyle-label">Study Habits</span>
                                        <div className="lifestyle-value">{profile.study_habits || "Flexible"}</div>
                                    </div>
                                </div>
                                <div className="lifestyle-item">
                                    <div className="lifestyle-icon"><Coffee size={20} /></div>
                                    <div>
                                        <span className="lifestyle-label">Food Preference</span>
                                        <div className="lifestyle-value">{profile.food_pref || "Flexible"}</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Past Stays Section */}
                        {pastStays.length > 0 && (
                            <section className="detail-section">
                                <h2 className="section-title">Past Stays</h2>
                                <div className="past-stays-list">
                                    {pastStays.map((stay: any, idx) => (
                                        <div
                                            key={stay.id || idx}
                                            className="stay-card clickable"
                                            onClick={() => onNavigateToListingDetails?.(stay.listingId)}
                                            title="View House Details"
                                        >
                                            <div className="stay-thumbnail-container">
                                                <img src={stay.thumbnail} alt={stay.location} className="stay-thumbnail" />
                                            </div>
                                            <div className="stay-content">
                                                <div className="stay-header">
                                                    <h4 className="stay-location">{stay.location}</h4>
                                                    <span className="stay-duration">{stay.duration}</span>
                                                </div>
                                                <p className="stay-review">"{stay.review}"</p>
                                                <div className="stay-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < stay.rating ? "#FFB400" : "#eee"} color="transparent" />
                                                    ))}
                                                </div>
                                                <div className="view-stay-listing">View Listing Details →</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Interactive Rating Section */}
                        <section className="detail-section interactive-rating-section">
                            <h2 className="section-title">Rate this Roommate</h2>
                            <p className="instruction-text">How was your experience living with {displayName}?</p>

                            <div className="rating-interaction-area">
                                <div className="big-stars-container">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={40}
                                            className={`big-star-icon ${star <= (hoverRating || userRating) ? 'filled' : ''} ${hasRated ? 'disabled' : ''}`}
                                            fill={star <= (hoverRating || userRating) ? "#FFB400" : "transparent"}
                                            color={star <= (hoverRating || userRating) ? "#FFB400" : "#ccc"}
                                            onMouseEnter={() => !hasRated && setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => !hasRated && setUserRating(star)}
                                        />
                                    ))}
                                </div>

                                {userRating > 0 && !hasRated && (
                                    <Button
                                        variant="primary"
                                        className="submit-rating-btn"
                                        onClick={() => setHasRated(true)}
                                    >
                                        Submit {userRating} Star Rating
                                    </Button>
                                )}

                                {hasRated && (
                                    <div className="rating-success-message">
                                        <Check size={24} color="#14919B" />
                                        <span>Thank you! Your rating of {userRating} stars has been submitted.</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <section className="detail-section">
                                <h2 className="section-title">
                                    <Star size={20} fill="#222" color="#222" style={{ marginRight: 8 }} />
                                    {rating.toFixed(2)} ({reviews.length} reviews)
                                </h2>
                                <div className="reviews-grid">
                                    {reviews.map((review, idx) => {
                                        const reviewerName = review.reviewerName || "Anonymous";
                                        const reviewDate = review.date || "Recent";
                                        const reviewComment = review.comment || "No comment provided.";

                                        return (
                                            <div key={review.id || idx} className="review-card">
                                                <div className="review-header">
                                                    <div className="reviewer-info">
                                                        <div className="reviewer-avatar">{reviewerName.charAt(0)}</div>
                                                        <div>
                                                            <span className="reviewer-name">{reviewerName}</span>
                                                            <span className="review-date">{reviewDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="review-text">{reviewComment}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
