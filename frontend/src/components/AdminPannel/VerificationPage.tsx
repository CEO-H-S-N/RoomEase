import React, { useState, useEffect } from 'react';
import '../../styles/AdminPannel/VerificationPage.css';
import { Eye, CheckCircle, XCircle, FileText, X } from 'lucide-react';
import { api } from '../../services/api';
import { AdminNavbar } from './AdminNavbar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface VerificationRequest {
    id: string;
    name: string;
    email: string;
    avatar: string;
    type: string;
    docCount: number;
    time: string;
    documents: Record<string, string>;
}

interface VerificationPageProps {
    onNavigateToUser: () => void;
    onNavigateToListing: () => void;
    onNavigateToVerification: () => void;
    onNavigateToAnalytics: () => void;
    onLogout: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
    onNavigateToUser,
    onNavigateToListing,
    onNavigateToVerification,
    onNavigateToAnalytics,
    onLogout
}) => {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const data = await api.getPendingVerifications();
            setRequests(data);
        } catch (err: any) {
            setError(err.message || "Failed to load verifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.approveVerification(id);
            setRequests(requests.filter(r => r.id !== id));
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch (err: any) {
            alert("Error approving: " + err.message);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await api.rejectVerification(id);
            setRequests(requests.filter(r => r.id !== id));
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch (err: any) {
            alert("Error rejecting: " + err.message);
        }
    };

    const renderDocumentViewer = () => {
        if (!selectedRequest) return null;

        return (
            <div className="doc-modal-overlay">
                <div className="doc-modal">
                    <div className="doc-modal-header">
                        <h2>Review Documents for {selectedRequest.name}</h2>
                        <button className="close-btn" onClick={() => setSelectedRequest(null)}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className="doc-modal-content">
                        <div className="doc-grid">
                            {Object.entries(selectedRequest.documents).map(([key, path]) => {
                                const url = `${API_BASE_URL}${path}`;
                                const isPdf = url.toLowerCase().endsWith('.pdf');
                                return (
                                    <div key={key} className="doc-item">
                                        <h4>{key.replace('_', ' ').toUpperCase()}</h4>
                                        <div className="doc-preview">
                                            {isPdf ? (
                                                <div className="pdf-preview">
                                                    <FileText size={48} color="#D4745E" />
                                                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-pill">View PDF</a>
                                                </div>
                                            ) : (
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    <img src={url} alt={key} className="img-preview" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="doc-modal-footer">
                        <button className="btn-reject-pill" onClick={() => handleReject(selectedRequest.id)}>
                            <XCircle size={18} /> Reject
                        </button>
                        <button className="btn-approve-pill" onClick={() => handleApprove(selectedRequest.id)}>
                            <CheckCircle size={18} /> Approve
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="verification-page-container">
            <AdminNavbar
                activePage="verification"
                onNavigateToUser={onNavigateToUser}
                onNavigateToListing={onNavigateToListing}
                onNavigateToVerification={onNavigateToVerification}
                onNavigateToAnalytics={onNavigateToAnalytics}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <div className="verification-content">
                <div className="verification-header-center">
                    <h1 className="verification-title">Document Verification</h1>
                </div>

                <div className="queue-section">
                    <h2 className="queue-section-title">Verification Queue</h2>
                    <p className="queue-section-subtitle">Review pending verification requests to ensure community safety.</p>

                    {loading ? (
                        <div className="loading-state">Loading pending requests...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : requests.length === 0 ? (
                        <div className="empty-state">
                            <CheckCircle size={48} color="#14919B" />
                            <h3>All Caught Up!</h3>
                            <p>There are no pending verification requests.</p>
                        </div>
                    ) : (
                        <div className="requests-list">
                            {requests.map((request) => (
                                <div key={request.id} className="verification-card">
                                    <div className="user-info-section">
                                        <img src={request.avatar} alt={request.name} className="user-avatar-large" />
                                        <div className="user-details">
                                            <span className="user-name-large">{request.name}</span>
                                            <div className="verification-meta">
                                                <span>{request.email}</span>
                                                <span className="meta-divider">•</span>
                                                <span>{request.docCount} documents submitted</span>
                                                <span className="meta-divider">•</span>
                                                <span>{request.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        <button className="btn-approve-pill" onClick={() => handleApprove(request.id)}>Approve</button>
                                        <button className="btn-reject-pill" onClick={() => handleReject(request.id)}>Reject</button>
                                        <button className="btn-view-icon" onClick={() => setSelectedRequest(request)}>
                                            <Eye size={20} /> View Docs
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {renderDocumentViewer()}
        </div>
    );
};
