import React from 'react';
import { MessageSquare } from 'lucide-react';
import './ChatInbox.css';

interface ChatButtonProps {
  /** Navigate to /messages with query params to auto-open a conversation */
  onClick: () => void;
  /** Button label */
  label?: string;
  /** Use outline variant */
  outline?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Reusable "Message" button that navigates to the Messages page.
 * Place this on listing detail pages, profile pages, match cards, etc.
 */
export const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  label = 'Message',
  outline = false,
  className = '',
}) => {
  return (
    <button
      className={`chat-message-btn ${outline ? 'outline' : ''} ${className}`}
      onClick={onClick}
    >
      <MessageSquare size={18} />
      {label}
    </button>
  );
};

export default ChatButton;
