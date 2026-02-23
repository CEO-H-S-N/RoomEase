import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Home } from "lucide-react";
import "../../styles/PublicPagesCss/LoginSelection.css";

interface LoginSelectionPageProps {
    // Add props if needed
}

export const LoginSelectionPage = ({ }: LoginSelectionPageProps) => {
    const navigate = useNavigate();

    // Secret Admin Access: Type 'admin' to go to admin login
    useEffect(() => {
        let buffer = '';
        const handleKeyDown = (e: KeyboardEvent) => {
            buffer += e.key;
            if (buffer.length > 5) buffer = buffer.slice(-5);

            if (buffer.toLowerCase() === 'admin') {
                navigate('/admin-login');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    return (
        <div className="login-selection-wrapper">
            <h1 className="selection-title">Select Login Type</h1>

            <div className="cards-container">

                {/* User Card */}
                <div className="role-card user" onClick={() => navigate('/user-login')}>
                    <div className="card-content">
                        <div className="icon-wrapper">
                            <User size={64} />
                        </div>
                        <h3 className="card-role-title">User</h3>
                        <p className="card-desc">Login to find your perfect room</p>
                    </div>
                </div>


                {/* Property Owner Card */}
                <div className="role-card owner" onClick={() => navigate('/property-owner-login')}>
                    <div className="card-content">
                        <div className="icon-wrapper">
                            <Home size={64} />
                        </div>
                        <h3 className="card-role-title">Owner</h3>
                        <p className="card-desc">List your properties and manage bookings</p>
                    </div>
                </div>

            </div>
        </div>
    );
};
