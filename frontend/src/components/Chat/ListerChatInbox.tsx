import React, { useCallback } from 'react';
import { Session, Inbox } from '@talkjs/react';
import { useNavigate } from 'react-router-dom';
import { createTalkUser, TALKJS_APP_ID, type ChatUser } from './useTalkJS';
import { Home, Bell, MessageSquare } from 'lucide-react';
import './ChatInbox.css';

interface ListerChatInboxProps {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
  };
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToSetting?: () => void;
  onNavigateToNotification?: () => void;
}

export const ListerChatInbox: React.FC<ListerChatInboxProps> = ({
  user,
  onLogout,
  onNavigateToDashboard,
  onNavigateToSetting,
  onNavigateToNotification,
}) => {
  const navigate = useNavigate();

  // Build the TalkJS user with "lister" role
  const chatUser: ChatUser = {
    id: user.id,
    username: user.fullName || user.username,
    email: user.email,
    role: 'lister',
  };

  const syncUser = useCallback(() => {
    return createTalkUser(chatUser);
  }, [chatUser.id, chatUser.username, chatUser.email]);

  return (
    <div className="lister-chat-page dashboard-container">
      {/* Navbar - matches Property Owner Dashboard navbar */}
      <nav className="navbar navbar-expand-lg border-bottom shadow-sm sticky-top px-3">
        <div className="container-fluid">
          <a
            className="navbar-brand d-flex align-items-center gap-2"
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigateToDashboard(); }}
          >
            <Home className="brand-icon" size={24} />
            <span className="brand-text fw-bold" style={{ fontSize: '1.25rem' }}>RoomEase</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#listerChatNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="listerChatNavbar">
            <div className="ms-auto d-flex align-items-center gap-3">
              <button
                className="btn btn-link text-secondary p-0 border-0"
                onClick={() => navigate('/property-owner-messages')}
                title="Messages"
                style={{ color: 'var(--primary-color)' }}
              >
                <MessageSquare size={22} />
              </button>
              {onNavigateToSetting && (
                <button
                  className="btn btn-link text-secondary p-0 border-0"
                  onClick={onNavigateToSetting}
                  title="Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
              )}
              {onNavigateToNotification && (
                <button
                  className="btn btn-link text-secondary p-0 border-0"
                  onClick={onNavigateToNotification}
                  title="Notifications"
                >
                  <Bell size={22} />
                </button>
              )}
              <button className="btn-standard" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="lister-chat-content">
        <div className="chat-premium-header">
          <div className="header-icon-wrapper">
            <i className="bi bi-chat-quote-fill"></i>
          </div>
          <div className="header-text-wrapper">
            <h1>Property Messages</h1>
            <p>Connect with potential tenants and roommates.</p>
          </div>
        </div>

        <div className="lister-chat-body">
          <Session appId={TALKJS_APP_ID} syncUser={syncUser}>
            <Inbox
              style={{ width: '100%', height: '100%' }}
              className="talkjs-inbox-lister"
            />
          </Session>
        </div>
      </main>
    </div>
  );
};

export default ListerChatInbox;
