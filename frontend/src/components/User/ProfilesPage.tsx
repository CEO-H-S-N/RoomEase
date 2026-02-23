import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { api } from '../../services/api';
import type { ProfileData } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import SharedNavbar from '../shared/SharedNavbar';
import { ProfileCard } from './ProfileCard';
import './ProfilesPage.css';

interface ProfilesPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToMap: () => void;
    onNavigateToListing: () => void;
    onNavigateToProfiles: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToProfileDetails?: (profileId: string) => void;
}

export const ProfilesPage: React.FC<ProfilesPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToListing,
    onNavigateToProfiles,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToMap,
    onNavigateToProfileDetails
}) => {
    const [profiles, setProfiles] = useState<ProfileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: '',
        maxBudget: '',
        occupation: ''
    });

    // Parse search query from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cityParam = params.get('city');
        const searchParam = params.get('q') || cityParam; // Support 'q' or 'city'

        if (searchParam) {
            // For profiles, a generic search could be city or occupation
            // We'll set it to city by default but also help the user out
            setFilters(prev => ({ ...prev, city: searchParam }));
            setShowFilters(true);
        }
    }, []);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const data = await api.getAllProfiles();
                setProfiles(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch profiles:", err);
                setError("Failed to load profiles. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const filteredProfiles = profiles.filter(profile => {
        const searchTerm = filters.city.toLowerCase();

        // If searching from dashboard, we might want to match city OR occupation
        const matchesCity = !filters.city || profile.city.toLowerCase().includes(searchTerm);
        const matchesOccupation = !filters.city || profile.occupation?.toLowerCase().includes(searchTerm);
        const matchesName = !filters.city || profile.full_name?.toLowerCase().includes(searchTerm);

        if (filters.city && !matchesCity && !matchesOccupation && !matchesName) {
            return false;
        }

        if (filters.maxBudget && profile.budget_PKR > parseInt(filters.maxBudget)) {
            return false;
        }
        if (filters.occupation && !profile.occupation?.toLowerCase().includes(filters.occupation.toLowerCase())) {
            return false;
        }
        return true;
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            city: '',
            maxBudget: '',
            occupation: ''
        });
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'profiles': onNavigateToProfiles(); break;
            case 'chat': window.location.href = '/messages'; break;
            case 'profile': onNavigateToSetting?.(); break;
            case 'edit-profile': onNavigateToSetting?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'map': onNavigateToMap(); break;
        }
    };

    return (
        <div className="profiles-page-modern brown-gradient-bg">
            <SharedNavbar
                currentPage="profiles"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName="User"
            />

            <main className="profiles-main" style={{ marginTop: '80px' }}>
                <div className="container">
                    {/* Header */}
                    <motion.div
                        className="profiles-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h1 className="page-title">Find Roommates</h1>
                            <p className="page-subtitle">
                                {filteredProfiles.length} people match your criteria
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            icon={<Filter size={18} />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                    </motion.div>

                    {/* Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                className="filter-panel glass"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="filter-grid">
                                    <div className="filter-field">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="e.g., Lahore"
                                            value={filters.city}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Max Budget (PKR)</label>
                                        <input
                                            type="number"
                                            name="maxBudget"
                                            placeholder="30000"
                                            value={filters.maxBudget}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Occupation</label>
                                        <input
                                            type="text"
                                            name="occupation"
                                            placeholder="e.g., Student"
                                            value={filters.occupation}
                                            onChange={handleFilterChange}
                                            className="filter-input"
                                        />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner-large" />
                            <p>Loading profiles...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <Card variant="elevated" className="error-card">
                            <p className="error-text">{error}</p>
                            <Button variant="primary" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </Card>
                    )}

                    {/* Profiles Grid */}
                    {!loading && !error && (
                        <motion.div
                            className="profiles-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredProfiles.length === 0 ? (
                                <Card variant="elevated" className="empty-state">
                                    <p>No profiles match your filters.</p>
                                </Card>
                            ) : (
                                filteredProfiles.map((profile, index) => (
                                    <motion.div key={profile.id || index} variants={staggerItem}>
                                        <ProfileCard
                                            profile={profile}
                                            onViewDetails={onNavigateToProfileDetails}
                                        />
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </div>
            </main>

            <footer className="footer-modern">
                <div className="container">
                    <p>© {new Date().getFullYear()} RoomEase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
