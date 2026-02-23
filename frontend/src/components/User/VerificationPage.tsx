import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import SharedNavbar from '../shared/SharedNavbar';
import './VerificationPage.css';

interface User {
    email: string;
    fullName: string;
}

interface VerificationPageProps {
    user: User;
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToMatches: () => void;
    onNavigateToMessages: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToCreateProfile: () => void;
    onNavigateToSetting: () => void;
    onNavigateToChangePassword?: () => void;
    onNavigateToMap: () => void;
    onNavigateToRedFlagAlert: () => void;
    onNavigateToListing: () => void;
    onNavigateToProfiles?: () => void;
    onNavigateToNotification?: () => void;
}

type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export const VerificationPage: React.FC<VerificationPageProps> = ({
    user,
    onLogout,
    onNavigateToDashboard,
    onNavigateToListing,
    onNavigateToProfiles,
    onNavigateToSetting,
    onNavigateToChangePassword,
    onNavigateToMap,
    onNavigateToNotification,
    onNavigateToRedFlagAlert
}) => {
    const [cnicFront, setCnicFront] = useState<File | null>(null);
    const [cnicBack, setCnicBack] = useState<File | null>(null);
    const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
    const [studentId, setStudentId] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [verificationStatus] = useState<VerificationStatus>('none');

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': window.location.href = '/messages'; break;
            case 'profiles': onNavigateToProfiles?.(); break;
            case 'edit-profile': onNavigateToSetting?.(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': /* Already here */ break;
            case 'map': onNavigateToMap(); break;
            case 'notification': onNavigateToNotification?.(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            // Validate file type
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                setError('Only images and PDF files are allowed');
                return;
            }
            setter(file);
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!cnicFront || !cnicBack || !proofOfAddress) {
            setError('CNIC (front & back) and Proof of Address are required');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('cnic_front', cnicFront);
            formData.append('cnic_back', cnicBack);
            formData.append('proof_of_address', proofOfAddress);
            if (studentId) {
                formData.append('student_id', studentId);
            }

            const response = await fetch('http://localhost:8000/api/verification/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to submit verification');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        switch (verificationStatus) {
            case 'pending':
                return (
                    <div className="status-badge pending">
                        <AlertCircle size={20} />
                        <span>Verification Pending</span>
                    </div>
                );
            case 'approved':
                return (
                    <div className="status-badge approved">
                        <CheckCircle size={20} />
                        <span>Verified</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="status-badge rejected">
                        <XCircle size={20} />
                        <span>Verification Rejected</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="verification-page brown-gradient-bg">
            <SharedNavbar
                currentPage="other"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName}
            />
            <div className="verification-container">
                <div className="verification-hero-section">
                    <div className="hero-icon-wrapper">
                        <ShieldCheck size={48} />
                    </div>
                    <h1>Get Verified</h1>
                    <p className="hero-description">Complete your profile by uploading authentic documents to build trust within our community.</p>
                    {getStatusBadge()}
                </div>

                <div className="verification-content-wrapper">

                    {success && (
                        <div className="success-message">
                            <CheckCircle size={20} />
                            <span>Documents submitted successfully! We'll review them within 24-48 hours.</span>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <XCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="verification-form">
                        {/* CNIC Front */}
                        <div className="form-group">
                            <label htmlFor="cnicFront">
                                CNIC / ID Card (Front) <span className="required">*</span>
                            </label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="cnicFront"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, setCnicFront)}
                                    disabled={loading || success}
                                />
                                <div className="file-upload-display">
                                    {cnicFront ? (
                                        <>
                                            <FileText size={24} />
                                            <span>{cnicFront.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} />
                                            <span>Click to upload or drag and drop</span>
                                            <span className="file-hint">PNG, JPG, PDF (max 5MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CNIC Back */}
                        <div className="form-group">
                            <label htmlFor="cnicBack">
                                CNIC / ID Card (Back) <span className="required">*</span>
                            </label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="cnicBack"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, setCnicBack)}
                                    disabled={loading || success}
                                />
                                <div className="file-upload-display">
                                    {cnicBack ? (
                                        <>
                                            <FileText size={24} />
                                            <span>{cnicBack.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} />
                                            <span>Click to upload or drag and drop</span>
                                            <span className="file-hint">PNG, JPG, PDF (max 5MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Proof of Address */}
                        <div className="form-group">
                            <label htmlFor="proofOfAddress">
                                Proof of Address <span className="required">*</span>
                            </label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="proofOfAddress"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, setProofOfAddress)}
                                    disabled={loading || success}
                                />
                                <div className="file-upload-display">
                                    {proofOfAddress ? (
                                        <>
                                            <FileText size={24} />
                                            <span>{proofOfAddress.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} />
                                            <span>Click to upload or drag and drop</span>
                                            <span className="file-hint">Utility bill, bank statement, etc.</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Student ID (Optional) */}
                        <div className="form-group">
                            <label htmlFor="studentId">
                                Student ID (Optional)
                            </label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="studentId"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, setStudentId)}
                                    disabled={loading || success}
                                />
                                <div className="file-upload-display">
                                    {studentId ? (
                                        <>
                                            <FileText size={24} />
                                            <span>{studentId.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} />
                                            <span>Click to upload or drag and drop</span>
                                            <span className="file-hint">For students only</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="info-box">
                            <AlertCircle size={20} />
                            <div>
                                <h4>Verification Process</h4>
                                <ul>
                                    <li>All documents will be reviewed by our admin team</li>
                                    <li>Verification typically takes 24-48 hours</li>
                                    <li>You'll be notified once your verification is complete</li>
                                    <li>Verified users get priority in listings and chat</li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || success || !cnicFront || !cnicBack || !proofOfAddress}
                                style={{ maxWidth: '300px' }}
                            >
                                {loading ? 'Submitting...' : 'Submit for Verification'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
