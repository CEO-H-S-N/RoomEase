import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import type { ProfileData } from '../../services/api';
import './ProfileCard.css';

interface ProfileCardProps {
    profile: ProfileData;
    onViewDetails?: (id: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onViewDetails }) => {
    // Default image if none provided
    const displayImage = profile.profile_photo || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop";

    return (
        <Card variant="glass" hover className="profile-card">
            <div className="profile-card-header">
                <div className="profile-image-container">
                    <img
                        src={displayImage}
                        alt={profile.full_name || "User Profile"}
                        className="profile-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop";
                        }}
                    />
                </div>
                <div className="profile-badge">{profile.occupation || "Member"}</div>
            </div>

            <div className="profile-content">
                <h3 className="profile-name">
                    {profile.full_name || "Roommate Candidate"}
                    {profile.age && <span className="profile-age">, {profile.age}</span>}
                </h3>

                <div className="profile-details">
                    <div className="detail-row">
                        <MapPin size={16} className="icon" />
                        <span>{profile.area}, {profile.city}</span>
                    </div>

                    <div className="detail-row">
                        <DollarSign size={16} className="icon" />
                        <span>Budget: {profile.budget_PKR ? `PKR ${profile.budget_PKR.toLocaleString()}` : 'N/A'}</span>
                    </div>

                    <div className="tags-container">
                        {[profile.cleanliness, profile.sleep_schedule, profile.food_pref].filter(Boolean).slice(0, 3).map((tag, i) => (
                            <span key={i} className="profile-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                <Button
                    variant="primary"
                    fullWidth
                    className="view-profile-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Button clicked for profile:", profile.id);
                        if (profile.id) {
                            onViewDetails?.(profile.id);
                        } else {
                            console.warn("Profile ID is missing!");
                        }
                    }}
                >
                    View Profile
                </Button>
            </div>
        </Card>
    );
};
