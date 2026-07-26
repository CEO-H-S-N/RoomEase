import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Sparkles } from 'lucide-react';
// ... rest of imports
import { api } from '../../services/api';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import SharedNavbar from '../shared/SharedNavbar';
import './MatchesPage.css';

interface MatchesPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToMessages?: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
}

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

export const MatchesPage: React.FC<MatchesPageProps> = ({
    onLogout,
    onNavigateToDashboard,
    onNavigateToMessages,
    onNavigateToChangePassword,
    onNavigateToVerification
}) => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const LOADING_STEPS = [
        '🔍 Fetching profiles from your city...',
        '🧠 Running AI compatibility analysis...',
        '🚩 Checking for potential red flags...',
        '✨ Generating personalised summaries...',
        '🏆 Ranking your top matches...',
    ];

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'ai-picks': navigate('/ai-picks'); break;
            case 'chat': onNavigateToMessages?.(); break;
            case 'profile': navigate('/create-profile'); break;
            case 'edit-profile': navigate('/edit-profile'); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
        }
    };

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setLoadingStep(0);
            setError(null);

            // Cycle through loading step labels while waiting
            const stepInterval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
            }, 3000);

            try {
                const data = await api.getBestMatches(10);
                clearInterval(stepInterval);
                setMatches(data);
            } catch (err) {
                clearInterval(stepInterval);
                throw err;
            }
        } catch (err: any) {
            console.error('Failed to fetch matches:', err);
            setError(
                err.message?.includes('504') || err.message?.includes('timeout')
                    ? 'The AI pipeline timed out — your city may have many profiles. Please try again.'
                    : 'Failed to load matches. Please check your connection and try again.'
            );
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

            {/* Main Content */}
            <main className="matches-main" style={{ marginTop: '80px' }}>
                <div className="container">
                    {/* Header */}
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
                                AI-powered compatibility matches based on your preferences
                            </p>
                        </div>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <motion.div
                            className="loading-state"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', padding: '4rem 2rem' }}
                        >
                            <div className="spinner-large" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1A1A1A' }}>
                                AI is finding your matches
                            </h3>
                            <motion.p
                                key={loadingStep}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '2rem' }}
                            >
                                {LOADING_STEPS[loadingStep]}
                            </motion.p>
                            {/* Step progress dots */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                {LOADING_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: i === loadingStep ? '24px' : '8px',
                                            height: '8px',
                                            borderRadius: '9999px',
                                            background: i === loadingStep ? '#D4745E' : '#E5E7EB',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                ))}
                            </div>
                            <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                                This usually takes 10–30 seconds on first load (results are then cached)
                            </p>
                        </motion.div>
                    )}

                    {/* Error State */}
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

                    {/* Matches Grid */}
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
                                            {/* Match Image */}
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

                                            {/* Match Content */}
                                            <div className="match-content">
                                                <div className="match-header">
                                                    <h3 className="match-name">{match.profile.full_name}</h3>
                                                    <span className="match-age">{match.profile.age} yrs</span>
                                                </div>

                                                <p className="match-occupation">{match.profile.occupation} • {match.profile.area}, {match.profile.city}</p>

                                                {/* AI Explanation */}
                                                <div className="compatibility-reason">
                                                    <Sparkles size={16} className="reason-icon" />
                                                    <p>{match.explanation}</p>
                                                </div>

                                                {/* Negotiation Checklist */}
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

                                                {/* Lifestyle Check */}
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

                                                {/* Actions */}
                                                <div className="match-actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<X size={16} />}
                                                    >
                                                        Pass
                                                    </Button>
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
