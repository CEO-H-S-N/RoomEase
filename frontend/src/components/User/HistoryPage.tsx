import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, MapPin, User as UserIcon, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import SharedNavbar from '../shared/SharedNavbar';
import { Card } from '../shared/Card';
import './HistoryPage.css';

interface StayHistoryItem {
    target_id: string;
    target_type: 'housing' | 'roommate';
    target_name: string;
    target_image?: string;
    target_location?: string;
    duration?: string;
    move_in?: string;
    move_out?: string;
    user_rating: number | null;
    user_comment: string;
}

interface HistoryPageProps {
    user: any;
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToSetting: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToSetting
}) => {
    const [history, setHistory] = useState<StayHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'housing' | 'roommate'>('housing');
    const [ratingLoading, setRatingLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await api.getStayHistory();
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (targetId: string, targetType: 'housing' | 'roommate', rating: number) => {
        try {
            setRatingLoading(targetId);
            await api.rateTarget({
                target_id: targetId,
                target_type: targetType,
                rating: rating
            });
            // Update local state
            setHistory(prev => prev.map(item =>
                (item.target_id === targetId && item.target_type === targetType)
                    ? { ...item, user_rating: rating }
                    : item
            ));
        } catch (err) {
            alert("Failed to save rating");
        } finally {
            setRatingLoading(null);
        }
    };

    const filteredHistory = history.filter(item => item.target_type === activeTab);

    const StarRating = ({ rating, onRate, disabled }: { rating: number | null, onRate: (r: number) => void, disabled: boolean }) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={20}
                        className={`star ${star <= (rating || 0) ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
                        onClick={() => !disabled && onRate(star)}
                        fill={star <= (rating || 0) ? "#FFB400" : "none"}
                        color={star <= (rating || 0) ? "#FFB400" : "#ccc"}
                        style={{ cursor: disabled ? 'default' : 'pointer' }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="history-page brown-theme">
            <SharedNavbar
                currentPage="other"
                onNavigate={(page) => {
                    if (page === 'dashboard') onNavigateToDashboard();
                    if (page === 'profile' || page === 'edit-profile') onNavigateToSetting();
                }}
                onLogout={onLogout}
                userName={user?.username || 'User'}
            />

            <div className="history-container">
                <header className="history-header">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Your Stay History
                    </motion.h1>
                    <p>Review your past experiences and help the community by rating them.</p>
                </header>

                <div className="history-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'housing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('housing')}
                    >
                        <HomeIcon size={18} />
                        Past Houses
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'roommate' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roommate')}
                    >
                        <UserIcon size={18} />
                        Past Roommates
                    </button>
                </div>

                <div className="history-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading your history...</p>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <motion.div
                            className="empty-history"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Clock size={48} className="empty-icon" />
                            <h3>No history found</h3>
                            <p>You haven't completed any {activeTab === 'housing' ? 'stays' : 'roommate agreements'} yet.</p>
                        </motion.div>
                    ) : (
                        <div className="history-grid">
                            <AnimatePresence mode="wait">
                                {filteredHistory.map((item, index) => (
                                    <motion.div
                                        key={item.target_id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="history-item-card">
                                            <div className="history-item-image">
                                                <img
                                                    src={item.target_image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop"}
                                                    alt={item.target_name}
                                                />
                                            </div>
                                            <div className="history-item-details">
                                                <div className="item-header">
                                                    <h3>{item.target_name}</h3>
                                                    <span className="duration-badge">{item.duration || '6 Months'}</span>
                                                </div>

                                                {item.target_location && (
                                                    <div className="item-meta">
                                                        <MapPin size={14} />
                                                        <span>{item.target_location}</span>
                                                    </div>
                                                )}

                                                <div className="item-dates">
                                                    <div className="date-box">
                                                        <span className="date-label">Moved In</span>
                                                        <span className="date-val">{item.move_in || 'Jan 2023'}</span>
                                                    </div>
                                                    <ChevronRight size={16} className="date-arrow" />
                                                    <div className="date-box">
                                                        <span className="date-label">Moved Out</span>
                                                        <span className="date-val">{item.move_out || 'Jun 2023'}</span>
                                                    </div>
                                                </div>

                                                <div className="item-rating-section">
                                                    <span className="rating-prompt">
                                                        {item.user_rating ? 'Your Rating' : 'Rate this stay'}
                                                    </span>
                                                    <StarRating
                                                        rating={item.user_rating}
                                                        onRate={(r) => handleRate(item.target_id, item.target_type, r)}
                                                        disabled={ratingLoading === item.target_id}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
