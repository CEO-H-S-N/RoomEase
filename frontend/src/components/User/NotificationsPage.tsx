import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import SharedNavbar from '../shared/SharedNavbar';
import { Card } from '../shared/Card';
import './DashboardPage.css'; // For the brown-gradient-bg

interface NotificationsPageProps {
  user: any;
  onLogout: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Profile Approved',
      message: 'Your roommate profile has been approved and is now visible to others.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'New Match!',
      message: 'You have a new potential roommate match. Check out their profile.',
      time: '5 hours ago',
      read: true,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Listing Update',
      message: 'A property you saved has recently updated its pricing.',
      time: '1 day ago',
      read: true,
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={24} color="#2ecc71" />;
      case 'warning': return <AlertTriangle size={24} color="#f39c12" />;
      case 'info':
      default:
        return <Info size={24} color="#3498db" />;
    }
  };

  return (
    <div className="dashboard-page-modern brown-gradient-bg" style={{ minHeight: '100vh' }}>
      <SharedNavbar
        currentPage="other"
        onNavigate={(page) => {
          if (page === 'dashboard') navigate('/dashboard');
          else if (page === 'notifications') return; // Already here
          else navigate(`/${page}`);
        }}
        onLogout={onLogout}
        userName={user?.fullName || user?.username || 'User'}
      />

      <main className="dashboard-content" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(212, 116, 94, 0.1) 0%, rgba(212, 116, 94, 0.2) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#D4745E'
          }}>
            <Bell size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#1A1A1A' }}>Notifications</h1>
            <p style={{ margin: 0, color: '#6B7280' }}>Stay updated on your matches and properties.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notification) => (
            <Card key={notification.id} variant="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
              {!notification.read && (
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D4745E' }} />
              )}
              <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#111827' }}>
                  {notification.title}
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', color: '#4B5563', fontSize: '0.95rem' }}>
                  {notification.message}
                </p>
                <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>{notification.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};
