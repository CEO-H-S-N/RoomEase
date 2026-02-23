import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Sparkles, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import SharedNavbar from '../shared/SharedNavbar';
import './MatchesPage.css';

interface Match {
    profile: {
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
}

interface MatchesPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToMessages?: () => void;
    onNavigateToRedFlagAlert?: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
}

export const MatchesPageAI: React.FC<MatchesPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToMessages,
    onNavigateToRedFlagAlert,
    onNavigateToChangePassword,
    onNavigateToVerification
}) => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        }
    };

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const data = await api.getBestMatches(10);
            setMatches(data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch matches:", err);
            setError("Failed to load matches. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

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
                                Your Matches (AI)
                            </h1>
                            <p className="page-subtitle">
                                AI-powered compatibility matches based on your preferences
                            </p>
                        </div>
                    </motion.div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner-large" />
                            <p>Finding your perfect matches...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <Card variant="elevated" className="error-card">
                            <p className="error-text">{error}</p>
                            <div className="error-actions">
                                <Button variant="primary" onClick={fetchMatches}>
                                    Retry
                                </Button>
                            </div>
                        </Card>
                    )}

                    {!loading && !error && (
                        <motion.div
                            className="matches-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {matches.length === 0 ? (
                                <Card variant="elevated" className="empty-state">
                                    <Sparkles size={48} className="empty-icon" />
                                    <h3>No matches yet</h3>
                                    <p>Complete your profile to get AI-powered roommate recommendations</p>
                                </Card>
                            ) : (
                                matches.map((match, index) => (
                                    <motion.div key={match.profile.id || index} variants={staggerItem}>
                                        <Card variant="glass" hover className="match-card">
                                            <div className="match-image">
                                                <img
                                                    src={match.profile.profile_photo || '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'}
                                                    alt={match.profile.full_name}
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
                                                    <h3 className="match-name">{match.profile.full_name}</h3>
                                                    <span className="match-age">{match.profile.age} yrs</span>
                                                </div>

                                                <p className="match-occupation">{match.profile.occupation} • {match.profile.area}, {match.profile.city}</p>

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
                                                        <span className="lifestyle-label">Cleanliness:</span>
                                                        <span className="lifestyle-value">{match.profile.cleanliness}</span>
                                                    </div>
                                                    <div className="lifestyle-item">
                                                        <span className="lifestyle-label">Noise:</span>
                                                        <span className="lifestyle-value">{match.profile.noise_tolerance}</span>
                                                    </div>
                                                </div>

                                                <div className="match-actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<X size={16} />}
                                                    >
                                                        Pass
                                                    </Button>
                                                    {onNavigateToRedFlagAlert && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<AlertTriangle size={16} />}
                                                            onClick={onNavigateToRedFlagAlert}
                                                        >
                                                            Red Flags
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        icon={<Heart size={16} />}
                                                    >
                                                        Like
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};
