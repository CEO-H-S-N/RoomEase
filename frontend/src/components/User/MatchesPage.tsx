import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import SharedNavbar from '../shared/SharedNavbar';
import { api } from '../../services/api';
import './MatchesPage.css';

interface Match {
    profile?: {
        id: string;
        full_name: string;
        age: number;
        occupation: string;
        profile_photo?: string;
        city: string;
        area: string;
        sleep_schedule: string;
        cleanliness: string;
        noise_tolerance: string;
        study_habits: string;
        food_pref: string;
    };
    final_score: number;
    base_score: number;
    risk_level: string;
    recommendation: string;
    explanation: string;
    negotiation_checklist: Array<{ suggestion: string; category: string }>;
    red_flags: Array<{ type: string; severity: string; evidence: string }>;
    housing?: {
        id: string;
        city: string;
        area: string;
        monthly_rent_PKR: number;
        rooms_available: number;
        thumbnail?: string;
        short_reason?: string;
    };
}

interface MatchesPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToMessages?: () => void;
    onNavigateToRedFlagAlert?: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToMap?: () => void;
    onNavigateToListingDetails?: (id: string) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToMessages,
    onNavigateToRedFlagAlert,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToMap,
    onNavigateToListingDetails
}) => {
    const navigate = useNavigate();
    const [allProfiles, setAllProfiles] = useState<any[]>([]);
    const [allListings, setAllListings] = useState<any[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchMode, setMatchMode] = useState<'people' | 'housing'>('people');

    const mapProfileToMatch = useCallback((p: any, index: number) => {
        const mockDetail = getHardcodedDetails(index);
        return {
            profile: {
                id: p.id || `M00${index + 1}`,
                full_name: p.full_name,
                age: p.age,
                occupation: p.occupation,
                profile_photo: p.profile_photo,
                city: p.city,
                area: p.area,
                sleep_schedule: p.sleep_schedule,
                cleanliness: p.cleanliness,
                noise_tolerance: p.noise_tolerance,
                study_habits: p.study_habits,
                food_pref: p.food_pref
            },
            final_score: mockDetail.score,
            base_score: mockDetail.score - 5,
            risk_level: mockDetail.score > 80 ? "low" : "medium",
            recommendation: mockDetail.recommendation,
            explanation: mockDetail.explanation,
            negotiation_checklist: mockDetail.checklist,
            red_flags: []
        };
    }, []);

    const mapHousingToMatch = useCallback((h: any, index: number) => {
        return {
            housing: {
                id: h.id || `H00${index + 1}`,
                city: h.city,
                area: h.area,
                monthly_rent_PKR: h.monthly_rent_PKR,
                rooms_available: h.rooms_available,
                thumbnail: h.thumbnail,
                short_reason: h.short_reason
            },
            final_score: Math.min(100, (h.score || 85) + (index % 10)), // Mix of DB score and variation
            base_score: (h.score || 80),
            risk_level: "low",
            recommendation: "Compatible Space",
            explanation: h.short_reason || "This listing aligns with your preferred location and budget.",
            negotiation_checklist: [
                { category: "Verification", suggestion: "Verify utility bill inclusion in the rent." },
                { category: "Agreement", suggestion: "Confirm move-in date and deposit policy." }
            ],
            red_flags: []
        };
    }, []);

    const getHardcodedDetails = (index: number) => {
        const details = [
            {
                score: 98,
                recommendation: "Highly Recommended",
                explanation: "Perfect alignment in lifestyle and professional background. Both value quiet study environments and maintain high cleanliness standards.",
                checklist: [
                    { category: "Kitchen", suggestion: "Discuss shared grocery shopping and meal prep schedules." },
                    { category: "Guests", suggestion: "Align on weekend visitor policies to maintain quiet hours." }
                ]
            },
            {
                score: 92,
                recommendation: "Strong Match",
                explanation: "Great compatibility despite different sleep schedules. The focus on academic excellence provides a strong foundation for a shared living space.",
                checklist: [{ category: "Noise", suggestion: "Set guidelines for late-night study sessions in common areas." }]
            },
            {
                score: 88,
                recommendation: "Great Match",
                explanation: "Shared appreciation for aesthetics and cleanliness. Potential creative collaboration and a balanced social life.",
                checklist: [{ category: "Shared Items", suggestion: "Decide on sharing kitchen appliances and cleaning supplies." }]
            },
            {
                score: 84,
                recommendation: "Compatible",
                explanation: "Professional lifestyle match. Reliable and structured routine aligns well with your preference for order and quiet.",
                checklist: [{ category: "Bills", suggestion: "Formalize energy and maintenance bill splitting process." }]
            },
            {
                score: 79,
                recommendation: "Good Match",
                explanation: "Good personality match, though habits may require adjustment. Creativity brings life to the home, but organization needs discussion.",
                checklist: [{ category: "Common Areas", suggestion: "Establish daily 'clearance' times for shared spaces." }]
            },
            {
                score: 75,
                recommendation: "Good Match",
                explanation: "Outgoing personality that complements a standard student/professional life. Vibrant and helpful nature.",
                checklist: [{ category: "Events", suggestion: "Discuss frequency of hosting friends or small gatherings." }]
            },
            {
                score: 68,
                recommendation: "Moderate Match",
                explanation: "Very disciplined environment. If you value silence and strict rules, this is a very stable long-term option.",
                checklist: [{ category: "Rules", suggestion: "Review the 'Home Protocol' document together." }]
            },
            {
                score: 62,
                recommendation: "Potential Match",
                explanation: "Steady and predictable routine. A 'no-fuss' roommate who stays out of the way and handles responsibilities efficiently.",
                checklist: [{ category: "Communication", suggestion: "Agree on a monthly check-in to discuss house matters." }]
            },
            {
                score: 55,
                recommendation: "Needs Discussion",
                explanation: "While lifestyle matches are good, different social expectations might cause friction. Requires clear boundary setting.",
                checklist: [{ category: "Social", suggestion: "Discuss 'quiet hours' and personal space expectations." }]
            },
            {
                score: 48,
                recommendation: "Low Compatibility",
                explanation: "Busy lifestyle might not align with your need for a settled home environment. Good as a social contact, but living habits differ significantly.",
                checklist: [{ category: "Presence", suggestion: "Clarify expectations regarding physical presence in the home." }]
            }
        ];
        return details[index % details.length];
    };

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                if (matchMode === 'people') {
                    if (allProfiles.length === 0) {
                        const profiles = await api.getAllProfiles();
                        setAllProfiles(profiles);
                        const mapped = profiles.slice(0, 10).map((p, i) => mapProfileToMatch(p, i));
                        setMatches(mapped);
                    } else {
                        const mapped = allProfiles.slice(0, 10).map((p, i) => mapProfileToMatch(p, i));
                        setMatches(mapped);
                    }
                } else {
                    if (allListings.length === 0) {
                        try {
                            const listings = await api.getBestHousingMatches();
                            setAllListings(listings);
                            const mapped = listings.slice(0, 10).map((h: any, i: number) => mapHousingToMatch(h, i));
                            setMatches(mapped);
                        } catch (err) {
                            console.error("Error fetching housing matches:", err);
                            // Fallback to static if endpoint fails
                            const fallback = await api.getListings();
                            setAllListings(fallback);
                            const mapped = fallback.slice(0, 10).map((h: any, i: number) => mapHousingToMatch(h, i));
                            setMatches(mapped);
                        }
                    } else {
                        const mapped = allListings.slice(0, 10).map((h: any, i: number) => mapHousingToMatch(h, i));
                        setMatches(mapped);
                    }
                }
            } catch (error) {
                console.error("Error fetching matches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [matchMode, mapProfileToMatch, mapHousingToMatch]);

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': navigate('/listing'); break;
            case 'chat': onNavigateToMessages?.(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert?.(); break;
            case 'profile': navigate('/create-profile'); break;
            case 'edit-profile': navigate('/edit-profile'); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'map': onNavigateToMap?.(); break;
        }
    };

    const handlePass = (id: string) => {
        if (matchMode === 'people') {
            const currentIds = new Set(matches.map(m => m.profile?.id));
            const availablePool = allProfiles.filter(p => !currentIds.has(p.id));

            if (availablePool.length > 0) {
                const nextProfile = availablePool[0];
                const nextMatch = mapProfileToMatch(nextProfile, matches.length + Math.floor(Math.random() * 100));
                setMatches(prev => prev.map(m => m.profile?.id === id ? nextMatch : m));
            } else {
                setMatches(prev => prev.filter(m => m.profile?.id !== id));
            }
        } else {
            const currentIds = new Set(matches.map(m => m.housing?.id));
            const availablePool = allListings.filter(h => !currentIds.has(h.id));

            if (availablePool.length > 0) {
                const nextListing = availablePool[0];
                const nextMatch = mapHousingToMatch(nextListing, matches.length + Math.floor(Math.random() * 100));
                setMatches(prev => prev.map(m => m.housing?.id === id ? nextMatch : m));
            } else {
                setMatches(prev => prev.filter(m => m.housing?.id !== id));
            }
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    return (
        <div className="matches-page-modern brown-gradient-bg">
            <SharedNavbar
                currentPage="other"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName="User"
            />

            <main className="matches-main" style={{ marginTop: '80px' }}>
                <div className="container">
                    <motion.div
                        className="matches-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h1 className="page-title">
                                <Sparkles className="title-icon" size={32} />
                                Your Matches
                            </h1>
                            <p className="page-subtitle">
                                Top picks from our database based on your lifestyle
                            </p>
                        </div>
                        <div className="match-mode-toggle">
                            <button
                                className={`mode-btn ${matchMode === 'people' ? 'active' : ''}`}
                                onClick={() => setMatchMode('people')}
                            >
                                People
                            </button>
                            <button
                                className={`mode-btn ${matchMode === 'housing' ? 'active' : ''}`}
                                onClick={() => setMatchMode('housing')}
                            >
                                Housing
                            </button>
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large" />
                            <p>Calculating compatibility scores...</p>
                        </div>
                    ) : (
                        <motion.div
                            className="matches-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence mode="popLayout">
                                {matches.map((match) => (
                                    <motion.div
                                        key={match.profile?.id || match.housing?.id}
                                        variants={staggerItem}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card
                                            variant="glass"
                                            hover
                                            className="match-card"
                                            onClick={() => {
                                                if (matchMode === 'people') navigate(`/profile/${match.profile?.id}`);
                                                else if (match.housing?.id) onNavigateToListingDetails?.(match.housing.id);
                                            }}
                                        >
                                            <div className="match-image">
                                                <img
                                                    src={match.profile?.profile_photo || match.housing?.thumbnail || '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'}
                                                    alt={match.profile?.full_name || match.housing?.area}
                                                />
                                                <div className={`compatibility-badge ${getScoreColor(match.final_score)}`}>
                                                    {match.final_score}% Match
                                                </div>
                                                <div className={`recommendation-badge ${match.risk_level}`}>
                                                    {match.recommendation}
                                                </div>
                                            </div>

                                            <div className="match-content">
                                                <div className="match-header">
                                                    <h3 className="match-name">{match.profile?.full_name || `${match.housing?.area}, ${match.housing?.city}`}</h3>
                                                    {match.profile && <span className="match-age">{match.profile.age} yrs</span>}
                                                </div>

                                                {match.profile ? (
                                                    <p className="match-occupation">{match.profile.occupation} • {match.profile.area}, {match.profile.city}</p>
                                                ) : (
                                                    <p className="match-occupation">Rent: PKR {match.housing?.monthly_rent_PKR.toLocaleString()} • {match.housing?.rooms_available} Rooms</p>
                                                )}

                                                <div className="compatibility-reason">
                                                    <Sparkles size={16} className="reason-icon" />
                                                    <p>{match.explanation}</p>
                                                </div>

                                                {match.negotiation_checklist.length > 0 && (
                                                    <div className="negotiation-checklist">
                                                        <h4 className="checklist-title">AI Tips for Compatibility:</h4>
                                                        <ul>
                                                            {match.negotiation_checklist.map((item, i) => (
                                                                <li key={i}>
                                                                    <span className="category">[{item.category}]</span> {item.suggestion}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="lifestyle-info">
                                                    <div className="lifestyle-item">
                                                        <span className="lifestyle-label">{match.profile ? 'Cleanliness:' : 'Location:'}</span>
                                                        <span className="lifestyle-value">{match.profile?.cleanliness || match.housing?.city}</span>
                                                    </div>
                                                    <div className="lifestyle-item">
                                                        <span className="lifestyle-label">{match.profile ? 'Noise:' : 'Area:'}</span>
                                                        <span className="lifestyle-value">{match.profile?.noise_tolerance || match.housing?.area}</span>
                                                    </div>
                                                </div>

                                                <div className="match-actions" onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        icon={match.profile ? <Heart size={16} /> : <Sparkles size={16} />}
                                                        onClick={() => {
                                                            if (matchMode === 'people') navigate('/messages', { state: { startChatWith: match.profile?.id, name: match.profile?.full_name } });
                                                            else if (match.housing?.id) onNavigateToListingDetails?.(match.housing.id);
                                                        }}
                                                        fullWidth
                                                    >
                                                        {match.profile ? 'Like' : 'View Space'}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<X size={16} />}
                                                        fullWidth
                                                        onClick={() => handlePass(match.profile?.id || match.housing?.id || '')}
                                                    >
                                                        Pass
                                                    </Button>
                                                    {match.profile && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<AlertTriangle size={16} />}
                                                            onClick={() => navigate('/red-flag-alert')}
                                                            fullWidth
                                                        >
                                                            Red Flags
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};
