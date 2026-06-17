import React, { useCallback } from 'react';
import { Session, Inbox } from '@talkjs/react';
import { useLocation } from 'react-router-dom';
import Talk from 'talkjs';
import { createTalkUser, TALKJS_APP_ID, getConversationId, type ChatUser } from './useTalkJS';
import SharedNavbar from '../shared/SharedNavbar';
import './ChatInbox.css';

interface ChatInboxProps {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    profile_id?: string;
  };
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToMatches: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToSetting: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToVerification?: () => void;
  onNavigateToRedFlagAlert: () => void;
  onNavigateToMap: () => void;
  onNavigateToListing: () => void;
  onNavigateToNotification: () => void;
  onNavigateToProfile: (id: string) => void;
  /** Optional: pre-select a conversation when navigating from a chat button */
  conversationId?: string;
  /** Optional: the other user to create a conversation with */
  otherUser?: ChatUser;
}

export const ChatInbox: React.FC<ChatInboxProps> = ({
  user,
  onLogout,
  onNavigateToDashboard,
  onNavigateToMatches,
  onNavigateToAnalytics,
  onNavigateToSetting,
  onNavigateToChangePassword,
  onNavigateToVerification,
  onNavigateToRedFlagAlert,
  onNavigateToMap,
  onNavigateToListing,
  onNavigateToNotification,
}) => {

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard': onNavigateToDashboard(); break;
      case 'ai-picks': onNavigateToListing(); break;
      case 'chat': /* Already here */ break;
      case 'profiles': onNavigateToMatches(); break;
      case 'edit-profile': onNavigateToSetting(); break;
      case 'change-password': onNavigateToChangePassword?.(); break;
      case 'verification': onNavigateToVerification?.(); break;
      case 'notification': onNavigateToNotification(); break;
      case 'map': onNavigateToMap(); break;
      case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
      case 'analytics': onNavigateToAnalytics(); break;
      case 'wishlist': window.location.href = '/wishlist'; break;
      default: break;
    }
  };

  const location = useLocation();
  const { targetUserId, targetUserName, targetUserRole, targetUserPhoto } = location.state || {};

  // Build the TalkJS user from our app user
  const chatUser: ChatUser = {
    id: user.id,
    username: user.fullName || user.username,
    email: user.email,
    role: 'seeker',
  };

  const syncUser = useCallback(() => {
    return createTalkUser(chatUser);
  }, [chatUser.id, chatUser.username, chatUser.email]);

  const syncConversation = useCallback((session: Talk.Session) => {
    // Create the other user
    const other = new Talk.User({
      id: targetUserId!,
      name: targetUserName || 'User',
      role: targetUserRole || 'lister',
      photoUrl: targetUserPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUserName || 'User')}&background=D4745E&color=fff`,
    });

    // Create conversation
    const conversationId = getConversationId(chatUser.id, targetUserId!);
    const conversation = session.getOrCreateConversation(conversationId);
    conversation.setParticipant(session.me);
    conversation.setParticipant(other);

    return conversation;
  }, [targetUserId, targetUserName, targetUserRole, targetUserPhoto, chatUser.id]);

  return (
    <div className="chat-inbox-page brown-theme">
      <SharedNavbar
        currentPage="chat"
        onNavigate={handleNavigate}
        onLogout={onLogout}
        userName={user.fullName}
      />

      <div className="chat-inbox-container">
        <div className="chat-premium-header">
          <div className="header-icon-wrapper">
            <i className="bi bi-chat-quote-fill"></i>
          </div>
          <div className="header-text-wrapper">
            <h1>Your Messages</h1>
            <p>Connect securely with your matches and property owners.</p>
          </div>
        </div>

        <div className="chat-inbox-body">
          <Session appId={TALKJS_APP_ID} syncUser={syncUser}>
            <Inbox
              style={{ width: '100%', height: '100%' }}
              className="talkjs-inbox"
              syncConversation={targetUserId ? syncConversation : undefined}
            />
          </Session>
        </div>
      </div>
    </div>
  );
};

export default ChatInbox;
