import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles, MapPin, Briefcase, Home, Wifi, Shield, Star,
    MessageSquare, Eye, AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
    Bed, Zap, Car, Droplet, Utensils, Wind, Heart, Brain, Flag, Users
} from 'lucide-react';
import { api } from '../../services/api';
import SharedNavbar from '../shared/SharedNavbar';
import '../../styles/User/AiRecommendationsPage.css';

interface AiRecommendationsPageProps {
    user: { fullName: string; username?: string };
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToVerification?: () => void;
    onNavigateToProfiles?: () => void;
    onNavigateToMap?: () => void;
}

interface MatchProfile {
    id?: string;
    full_name: string;
    city: string;
    area: string;
    age?: number;
    occupation?: string;
    budget_PKR?: number;
    profile_photo?: string;
    sleep_schedule?: string;
    cleanliness?: string;
    noise_tolerance?: string;
}

interface ChecklistItem {
    suggestion: string;
    category: string;
}

interface RedFlag {
    type?: string;
    severity: string;
    description?: string;
    reason?: string;
}

interface RoommateMatch {
    profile: MatchProfile;
    final_score: number;
    base_score: number;
    risk_level: string;
    recommendation: string;
    explanation: string;
    negotiation_checklist: ChecklistItem[];
    red_flags: RedFlag[];
    score_reasons: string[];
}

interface HousingMatch {
    id?: string;
    _id?: string;
    city: string;
    area: string;
    monthly_rent_PKR: number;
    rooms_available: number;
    amenities: string[];
    availability: string;
    latitude?: number;
    longitude?: number;
    thumbnail?: string;
    images?: string[];
    rating?: number;
    short_reason?: string;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi size={14} />,
    'Parking': <Car size={14} />,
    'Mess facility': <Utensils size={14} />,
    'Shared kitchen': <Utensils size={14} />,
    'Attached bathroom': <Droplet size={14} />,
    'AC room': <Wind size={14} />,
    'Laundry service': <Droplet size={14} />,
    'Security guard': <Shield size={14} />,
    'Electricity backup': <Zap size={14} />,
};

const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
};

const getBadgeClass = (recommendation: string) => {
    switch (recommendation) {
        case 'Highly Recommended': return 'badge-highly-recommended';
        case 'Recommended': return 'badge-recommended';
        case 'Consider': return 'badge-consider';
        default: return 'badge-not-recommended';
    }
};

/* =========================================================
   AGENT PIPELINE LOADER
========================================================= */
const agentSteps = [
    {
        id: 'profiler',
        label: 'Profile Reader',
        sublabel: 'Parsing your lifestyle & preferences',
        icon: Users,
        messages: [
            'Reading bio & habits',
            'Structuring your data',
            'Profile analysis done',
        ],
    },
    {
        id: 'scorer',
        label: 'Match Scorer',
        sublabel: 'Computing compatibility across candidates',
        icon: Brain,
        messages: [
            'Scanning candidate pool',
            'Running compatibility scores',
            'Scores locked in',
        ],
    },
    {
        id: 'redflag',
        label: 'Red Flag Detector',
        sublabel: 'Checking for conflicts & safety signals',
        icon: Flag,
        messages: [
            'Analysing conflict signals',
            'Applying risk penalties',
            'Safety check complete',
        ],
    },
    {
        id: 'wingman',
        label: 'Wingman',
        sublabel: 'Crafting your personalised summary',
        icon: Sparkles,
        messages: [
            'Writing match explanation',
            'Building negotiation checklist',
            'Results almost ready',
        ],
    },
];

const AgentPipelineLoader: React.FC<{ label: string }> = ({ label }) => {
    const [activeAgent, setActiveAgent] = useState(0);
    const [msgIndex, setMsgIndex] = useState(0);
    const [dots, setDots] = useState('');
    const agentRef = useRef(0);
    const msgRef = useRef(0);

    useEffect(() => {
        const dotTimer = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 450);

        const msgTimer = setInterval(() => {
            const step = agentSteps[agentRef.current];
            const nextMsg = msgRef.current + 1;
            if (nextMsg < step.messages.length) {
                msgRef.current = nextMsg;
                setMsgIndex(nextMsg);
            } else {
                const nextAgent = (agentRef.current + 1) % agentSteps.length;
                agentRef.current = nextAgent;
                msgRef.current = 0;
                setActiveAgent(nextAgent);
                setMsgIndex(0);
            }
        }, 1200);

        return () => {
            clearInterval(dotTimer);
            clearInterval(msgTimer);
        };
    }, []);

    // Calculate percentage based on current agent and active message index
    const totalMessages = agentSteps[activeAgent]?.messages.length || 3;
    const progressPercent = Math.min(
        Math.round(((activeAgent + msgIndex / totalMessages) / agentSteps.length) * 100),
        100
    );

    return (
        <div className="agent-pipeline-loader">
            <div className="apl-header">
                <div className="apl-sparkle-ring">
                    <Sparkles size={20} color="var(--primary-color)" />
                </div>
                <div className="apl-header-info">
                    <span className="apl-title">{label}</span>
                    <div className="apl-subtitle">AI Multi-Agent Pipeline Running</div>
                </div>
            </div>

            <div className="apl-steps">
                {agentSteps.map((agent, i) => {
                    const AgentIcon = agent.icon;
                    const isDone = i < activeAgent;
                    const isActive = i === activeAgent;
                    const isIdle = !isDone && !isActive;

                    return (
                        <div key={agent.id} className={`apl-step ${
                            isDone ? 'apl-step--done' : isActive ? 'apl-step--active' : 'apl-step--idle'
                        }`}>
                            {/* Vertical line connector */}
                            {i < agentSteps.length - 1 && (
                                <div className={`apl-vline ${isDone ? 'apl-vline--done' : isActive ? 'apl-vline--active' : ''}`} />
                            )}

                            {/* Icon */}
                            <div className="apl-step-icon">
                                {isDone
                                    ? <CheckCircle size={16} color="var(--primary-color)" />
                                    : <AgentIcon size={16} color={isActive ? 'var(--primary-color)' : 'var(--text-light)'} />
                                }
                            </div>

                            {/* Text */}
                            <div className="apl-step-text">
                                <span className={`apl-step-label ${isActive ? 'apl-step-label--active' : ''}`}>
                                    {agent.label}
                                </span>
                                {isActive && (
                                    <span key={`${i}-${msgIndex}`} className="apl-step-msg">
                                        {agent.messages[msgIndex]}{dots}
                                    </span>
                                )}
                                {isDone && (
                                    <span className="apl-step-done">Complete</span>
                                )}
                                {isIdle && (
                                    <span className="apl-step-idle">{agent.sublabel}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="apl-progress-container">
                <div className="apl-progress-track">
                    <div 
                        className="apl-progress-fill" 
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="apl-progress-percentage">
                    {progressPercent}%
                </div>
            </div>
        </div>
    );
};

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score);

    return (
        <div className="ai-score-ring">
            <svg width="72" height="72" viewBox="0 0 72 72">
                <circle className="ring-bg" cx="36" cy="36" r={radius} />
                <circle
                    className="ring-fill"
                    cx="36" cy="36" r={radius}
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <span className="score-text" style={{ color }}>{score}</span>
        </div>
    );
};

export const AiRecommendationsPage: React.FC<AiRecommendationsPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToVerification,
    onNavigateToProfiles,
    onNavigateToMap,
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'roommates' | 'housing'>('roommates');
    const [roommateMatches, setRoommateMatches] = useState<RoommateMatch[]>([]);
    const [housingMatches, setHousingMatches] = useState<HousingMatch[]>([]);
    const [loadingRoommates, setLoadingRoommates] = useState(true);
    const [loadingHousing, setLoadingHousing] = useState(true);
    const [roommateError, setRoommateError] = useState<string | null>(null);
    const [housingError, setHousingError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchUserProfile();
        fetchRoommateMatches();
        fetchHousingMatches();
        fetchWishlist();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const p = await api.getMyProfile();
            setUserProfile(p);
        } catch (e) {
            console.error('Failed to fetch user profile:', e);
        }
    };

    const fetchWishlist = async () => {
        try {
            const data = await api.getWishlist();
            setWishlistIds(new Set(data.map((item: any) => item.id)));
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
        }
    };

    const fetchRoommateMatches = async () => {
        try {
            setLoadingRoommates(true);
            setRoommateError(null);
            const data = await api.getBestMatches(5);
            setRoommateMatches(data);
        } catch (err: any) {
            console.error('Failed to fetch roommate matches:', err);
            setRoommateError(err.message || 'Failed to load AI roommate recommendations. Make sure your profile is set up.');
        } finally {
            setLoadingRoommates(false);
        }
    };

    const fetchHousingMatches = async () => {
        try {
            setLoadingHousing(true);
            setHousingError(null);
            const data = await api.getListings();
            setHousingMatches(data);
        } catch (err: any) {
            console.error('Failed to fetch housing:', err);
            setHousingError(err.message || 'Failed to load housing listings.');
        } finally {
            setLoadingHousing(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'ai-picks': break;
            case 'chat': navigate('/messages'); break;
            case 'profiles': onNavigateToProfiles?.(); break;
            case 'map': onNavigateToMap?.(); break;
            case 'edit-profile': onNavigateToSetting(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'red-flag-alert': navigate('/red-flag-alert'); break;
            case 'notifications': navigate('/notifications'); break;
            case 'wishlist': navigate('/wishlist'); break;
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent, listingId: string) => {
        e.stopPropagation();
        try {
            const result = await api.toggleWishlist(listingId);
            setWishlistIds(prev => {
                const next = new Set(prev);
                if (result.status === 'added') next.add(listingId);
                else next.delete(listingId);
                return next;
            });
        } catch (err) {
            alert('Failed to update wishlist');
        }
    };

    return (
        <div className="ai-recs-page">
            <SharedNavbar
                currentPage="ai-picks"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName || user.username || 'User'}
            />

            {/* Hero */}
            <div className="ai-hero">
                <div className="ai-hero-content">
                    <div className="ai-hero-icon">
                        <Sparkles size={32} color="#fff" />
                    </div>
                    <h1>AI-Powered Recommendations</h1>
                    <p>
                        Our multi-agent pipeline analyzes compatibility scores, red flags,
                        and lifestyle preferences to find your perfect roommate and housing matches.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="ai-recs-main">
                {/* Tab Switcher */}
                <div className="ai-section-tabs">
                    <button
                        className={`ai-tab ${activeTab === 'roommates' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roommates')}
                    >
                        <Sparkles size={16} />
                        Roommates
                    </button>
                    <button
                        className={`ai-tab ${activeTab === 'housing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('housing')}
                    >
                        <Home size={16} />
                        Housing
                    </button>
                </div>

                {/* ===================== ROOMMATES TAB ===================== */}
                {activeTab === 'roommates' && (
                    <>
                        {loadingRoommates && (
                            <AgentPipelineLoader label="Analyzing roommate profiles for you…" />
                        )}

                        {roommateError && !loadingRoommates && (
                            <div className="ai-empty-state">
                                <div className="ai-empty-icon">
                                    <AlertTriangle size={36} color="var(--primary-color)" />
                                </div>
                                <h3>Unable to Load Matches</h3>
                                <p>{roommateError}</p>
                            </div>
                        )}

                        {!loadingRoommates && !roommateError && roommateMatches.length === 0 && (() => {
                            const checklist = [
                                { key: 'full_name', label: 'Full Name', done: !!(userProfile?.full_name && userProfile.full_name.trim()) },
                                { key: 'city', label: 'Preferred City', done: !!(userProfile?.city && userProfile.city.trim()) },
                                { key: 'area', label: 'Preferred Area', done: !!(userProfile?.area && userProfile.area.trim()) },
                                { key: 'budget_PKR', label: 'Monthly Budget (PKR)', done: !!(userProfile?.budget_PKR && userProfile.budget_PKR > 0) },
                                { key: 'occupation', label: 'Occupation', done: !!(userProfile?.occupation && userProfile.occupation.trim()) },
                                { key: 'age', label: 'Age', done: !!(userProfile?.age && userProfile.age >= 16) },
                                { key: 'sleep_schedule', label: 'Sleep Schedule', done: !!userProfile?.sleep_schedule },
                                { key: 'cleanliness', label: 'Cleanliness Preference', done: !!userProfile?.cleanliness },
                                { key: 'noise_tolerance', label: 'Noise Tolerance', done: !!userProfile?.noise_tolerance },
                                { key: 'study_habits', label: 'Study / Work Habits', done: !!userProfile?.study_habits },
                                { key: 'food_pref', label: 'Food Preference', done: !!userProfile?.food_pref },
                            ];
                            const completedCount = checklist.filter(f => f.done).length;
                            const percent = Math.round((completedCount / checklist.length) * 100);
                            const missingCount = checklist.length - completedCount;

                            return (
                                <div className="ai-empty-state ai-profile-checklist-card">
                                    <div className="ai-empty-icon">
                                        <Sparkles size={36} color="var(--primary-color)" />
                                    </div>
                                    <h3>
                                        {missingCount === 0
                                            ? "Profile 100% Complete — AI Match Engine Active"
                                            : `Profile Completion Needed (${percent}%)`
                                        }
                                    </h3>
                                    <p>
                                        {missingCount === 0
                                            ? "Your profile is set up! AI agents are scanning the candidate pool for your best matches."
                                            : `Please complete the ${missingCount} missing field${missingCount > 1 ? 's' : ''} below so our AI multi-agent pipeline can compute your compatibility scores:`
                                        }
                                    </p>

                                    <div className="ai-profile-progress-bar">
                                        <div className="ai-profile-progress-fill" style={{ width: `${percent}%` }} />
                                    </div>

                                    <div className="ai-checklist-grid">
                                        {checklist.map(item => (
                                            <div key={item.key} className={`ai-checklist-item ${item.done ? 'done' : 'missing'}`}>
                                                {item.done ? (
                                                    <CheckCircle size={16} color="#10B981" />
                                                ) : (
                                                    <AlertTriangle size={16} color="#EF4444" />
                                                )}
                                                <span>{item.label}</span>
                                                <span className={`ai-item-tag ${item.done ? 'tag-done' : 'tag-missing'}`}>
                                                    {item.done ? '✓ Done' : 'Missing'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="ai-complete-profile-btn" onClick={() => onNavigateToSetting()}>
                                        <Sparkles size={16} />
                                        {missingCount === 0 ? "Edit Profile Settings" : "Update Profile Details"}
                                    </button>
                                </div>
                            );
                        })()}

                        {!loadingRoommates && !roommateError && roommateMatches.map((match, index) => {
                            const cardId = match.profile.id || `match-${index}`;
                            const isExpanded = expandedCards.has(cardId);

                            return (
                                <div key={cardId} className="ai-match-card">
                                    {/* Header */}
                                    <div className="ai-match-header">
                                        <img
                                            className="ai-match-avatar"
                                            src={match.profile.profile_photo || `https://i.pravatar.cc/150?u=${cardId}`}
                                            alt={match.profile.full_name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?u=${cardId}`;
                                            }}
                                        />
                                        <div className="ai-match-info">
                                            <h3>{match.profile.full_name}</h3>
                                            <div className="ai-match-meta">
                                                <span><MapPin size={14} /> {match.profile.area}, {match.profile.city}</span>
                                                {match.profile.occupation && (
                                                    <span><Briefcase size={14} /> {match.profile.occupation}</span>
                                                )}
                                                {match.profile.age && <span>Age {match.profile.age}</span>}
                                            </div>
                                            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span className={`ai-recommendation-badge ${getBadgeClass(match.recommendation)}`}>
                                                    {match.recommendation}
                                                </span>
                                                <span className={`ai-risk-indicator risk-${match.risk_level}`}>
                                                    <span className="risk-dot" />
                                                    {match.risk_level} risk
                                                </span>
                                            </div>
                                        </div>
                                        <ScoreRing score={match.final_score} />
                                    </div>

                                    {/* Body */}
                                    <div className="ai-match-body">
                                        {/* AI Explanation */}
                                        {match.explanation && (
                                            <div className="ai-explanation">
                                                <Sparkles size={14} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle', color: 'var(--primary-color)' }} />
                                                {match.explanation}
                                            </div>
                                        )}

                                        {/* Score Reasons */}
                                        {match.score_reasons && match.score_reasons.length > 0 && (
                                            <div className="ai-detail-section">
                                                <h4><CheckCircle size={14} color="#10B981" /> Compatibility Factors</h4>
                                                <div>
                                                    {match.score_reasons.map((reason, i) => (
                                                        <span key={i} className="ai-reason-tag">
                                                            <CheckCircle size={12} /> {reason}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Expandable Details */}
                                        <button
                                            onClick={() => toggleExpand(cardId)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.85rem',
                                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                padding: '0.5rem 0'
                                            }}
                                        >
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            {isExpanded ? 'Show Less' : 'Show Full Analysis'}
                                        </button>

                                        {isExpanded && (
                                            <>
                                                {/* Red Flags */}
                                                {match.red_flags && match.red_flags.length > 0 && (
                                                    <div className="ai-detail-section">
                                                        <h4><AlertTriangle size={14} color="#EF4444" /> Red Flags Detected</h4>
                                                        {match.red_flags.map((flag, i) => (
                                                            <div key={i} className={`ai-flag-item flag-${flag.severity?.toLowerCase() || 'low'}`}>
                                                                <AlertTriangle size={14} />
                                                                <div>
                                                                    <strong>{flag.type || 'Issue'}</strong> ({flag.severity})
                                                                    {(flag.description || flag.reason) && (
                                                                        <div style={{ fontSize: '0.8rem', marginTop: '0.15rem', opacity: 0.85 }}>
                                                                            {flag.description || flag.reason}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Negotiation Checklist */}
                                                {match.negotiation_checklist && match.negotiation_checklist.length > 0 && (
                                                    <div className="ai-detail-section">
                                                        <h4><CheckCircle size={14} color="var(--primary-color)" /> Negotiation Checklist</h4>
                                                        {match.negotiation_checklist.map((item, i) => (
                                                            <div key={i} className="ai-checklist-item">
                                                                <CheckCircle size={16} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                                                                <div>
                                                                    <span className="checklist-category">{item.category}</span>
                                                                    <div style={{ marginTop: '0.2rem' }}>{item.suggestion}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Score Breakdown */}
                                                <div className="ai-detail-section" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    Base Score: <strong>{match.base_score}</strong> →
                                                    Final Score: <strong>{match.final_score}</strong>
                                                    {match.base_score !== match.final_score && (
                                                        <span style={{ color: '#EF4444' }}> (−{match.base_score - match.final_score} risk penalty)</span>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Actions */}
                                        <div className="ai-match-actions">
                                            <button
                                                className="ai-action-btn primary"
                                                onClick={() => navigate('/messages', {
                                                    state: {
                                                        targetUserId: match.profile.id,
                                                        targetUserName: match.profile.full_name,
                                                    }
                                                })}
                                            >
                                                <MessageSquare size={16} /> Message
                                            </button>
                                            <button
                                                className="ai-action-btn secondary"
                                                onClick={() => navigate(`/profile/${match.profile.id}`)}
                                            >
                                                <Eye size={16} /> View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}

                {/* ===================== HOUSING TAB ===================== */}
                {activeTab === 'housing' && (
                    <>
                        {loadingHousing && (
                            <AgentPipelineLoader label="Scanning housing listings for you…" />
                        )}

                        {housingError && !loadingHousing && (
                            <div className="ai-empty-state">
                                <div className="ai-empty-icon">
                                    <AlertTriangle size={36} color="var(--primary-color)" />
                                </div>
                                <h3>Unable to Load Listings</h3>
                                <p>{housingError}</p>
                            </div>
                        )}

                        {!loadingHousing && !housingError && housingMatches.length === 0 && (
                            <div className="ai-empty-state">
                                <div className="ai-empty-icon">
                                    <Home size={36} color="var(--primary-color)" />
                                </div>
                                <h3>No Listings Available</h3>
                                <p>Check back later for new housing options.</p>
                            </div>
                        )}

                        {!loadingHousing && !housingError && (
                            <div className="ai-housing-grid">
                                {housingMatches.map((listing, index) => {
                                    const listingId = listing.id || listing._id || `housing-${index}`;
                                    return (
                                        <div key={listingId} className="ai-housing-card">
                                            {/* Image */}
                                            <div className="ai-housing-image">
                                                <img
                                                    src={listing.thumbnail || '/assets/images/placeholder-connect.038828c91304f70020e5.jpg'}
                                                    alt={`${listing.area} property`}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/assets/images/placeholder-connect.038828c91304f70020e5.jpg';
                                                    }}
                                                />
                                                <div className="ai-housing-badge">{listing.availability}</div>
                                                <div className="ai-housing-price-overlay">
                                                    PKR {listing.monthly_rent_PKR.toLocaleString()}
                                                    <span>/mo</span>
                                                </div>
                                                <button 
                                                    className="wishlist-toggle-btn"
                                                    onClick={(e) => handleToggleWishlist(e, listingId)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0.75rem',
                                                        right: '0.75rem',
                                                        background: 'rgba(255,255,255,0.9)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        padding: '0.5rem',
                                                        display: 'flex',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <Heart 
                                                        size={18} 
                                                        color={wishlistIds.has(listingId) ? '#EF4444' : '#6B7280'} 
                                                        fill={wishlistIds.has(listingId) ? '#EF4444' : 'none'} 
                                                    />
                                                </button>
                                            </div>

                                            {/* Body */}
                                            <div className="ai-housing-body">
                                                <div className="ai-housing-title">
                                                    {listing.rooms_available} Room{listing.rooms_available > 1 ? 's' : ''} in {listing.area}
                                                </div>
                                                <div className="ai-housing-location">
                                                    <MapPin size={15} /> {listing.area}, {listing.city}
                                                </div>

                                                <div className="ai-housing-stats">
                                                    <div className="ai-housing-stat">
                                                        <Bed size={15} /> {listing.rooms_available} Room{listing.rooms_available > 1 ? 's' : ''}
                                                    </div>
                                                    {listing.rating && (
                                                        <div className="ai-housing-stat">
                                                            <Star size={15} fill="#F59E0B" color="#F59E0B" /> {listing.rating.toFixed(1)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Amenities */}
                                                {listing.amenities && listing.amenities.length > 0 && (
                                                    <div className="ai-housing-amenities">
                                                        {listing.amenities.slice(0, 5).map((amenity, i) => (
                                                            <span key={i} className="ai-amenity-chip">
                                                                {amenityIcons[amenity] || <Home size={12} />} {amenity}
                                                            </span>
                                                        ))}
                                                        {listing.amenities.length > 5 && (
                                                            <span className="ai-amenity-chip">+{listing.amenities.length - 5}</span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* AI Reason */}
                                                {listing.short_reason && (
                                                    <div className="ai-housing-reason">
                                                        <div className="reason-label">
                                                            <Sparkles size={12} /> AI Match Reason
                                                        </div>
                                                        {listing.short_reason}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="ai-housing-actions">
                                                    <button
                                                        className="ai-action-btn primary"
                                                        onClick={() => navigate(`/listing-details/${listingId}`)}
                                                    >
                                                        <Eye size={16} /> View Details
                                                    </button>
                                                    {(listing.latitude != null && listing.longitude != null) && (
                                                        <button
                                                            className="ai-action-btn secondary"
                                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`, '_blank')}
                                                        >
                                                            <MapPin size={16} /> View on Map
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AiRecommendationsPage;
