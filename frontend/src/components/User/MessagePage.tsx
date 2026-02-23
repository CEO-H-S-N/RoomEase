import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SharedNavbar from '../shared/SharedNavbar';
import './MessagePage.css';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
    imageUrl?: string;
}

interface Contact {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount?: number;
    about?: string;
    location?: string;
}

interface MessagePageProps {
    user: { fullName: string; profile_id?: string };
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
}

const MOCK_CONTACTS: Contact[] = [
    {
        id: "6991231fe818f851503acab7",
        name: "Saad Iqbal",
        avatar: "https://i.pravatar.cc/150?u=saad",
        status: 'online',
        lastMessage: "Is the room still available?",
        lastMessageTime: "10:30 AM",
        unreadCount: 2
    },
    {
        id: "6991231fe818f851503acae5",
        name: "Ali Ahmed",
        avatar: "https://i.pravatar.cc/150?u=ali",
        status: 'offline',
        lastMessage: "I'll be there by 5 PM.",
        lastMessageTime: "Yesterday",
        unreadCount: 0
    },
    {
        id: "6991231fe818f851503acaf3",
        name: "Usman Siddiqui",
        avatar: "https://i.pravatar.cc/150?u=usman",
        status: 'online',
        lastMessage: "Thanks for the info!",
        lastMessageTime: "2:15 PM",
        unreadCount: 1
    }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
    "6991231fe818f851503acab7": [
        { id: "101", senderId: "6991231fe818f851503acab7", text: "Hi there! I saw your listing for the room in Islamabad.", timestamp: "10:00 AM", isRead: true },
        { id: "102", senderId: "me", text: "Hello Saad! Yes, it's still available. Would you like to schedule a viewing?", timestamp: "10:15 AM", isRead: true },
        { id: "103", senderId: "6991231fe818f851503acab7", text: "Is the room still available?", timestamp: "10:30 AM", isRead: false }
    ],
    "6991231fe818f851503acae5": [
        { id: "201", senderId: "6991231fe818f851503acae5", text: "Hey, are we still on for today?", timestamp: "Yesterday", isRead: true },
        { id: "202", senderId: "me", text: "Yes, see you at the apartment.", timestamp: "Yesterday", isRead: true }
    ],
    "6991231fe818f851503acaf3": [
        { id: "301", senderId: "6991231fe818f851503acaf3", text: "I've sent the documents you requested.", timestamp: "2:00 PM", isRead: true },
        { id: "302", senderId: "me", text: "Great, I'll review them shortly.", timestamp: "2:10 PM", isRead: true }
    ]
};

export const MessagePage: React.FC<MessagePageProps> = ({
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
    onNavigateToProfile,
}) => {
    const location = useLocation();
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

    useEffect(() => {
        const state = location.state as {
            startChatWith?: string;
            name?: string;
            about?: string;
            city?: string;
            area?: string;
        };
        if (state?.startChatWith) {
            setSelectedContactId(state.startChatWith);

            // Check if contact already exists in sidebar
            const exists = contacts.some(c => c.id === state.startChatWith);
            if (!exists && state.name) {
                // Add temporary mock contact for the new chat
                const newContact: Contact = {
                    id: state.startChatWith,
                    name: state.name,
                    avatar: `https://i.pravatar.cc/150?u=${state.startChatWith}`,
                    status: 'online',
                    lastMessage: "Started a new conversation",
                    lastMessageTime: "Just now",
                    unreadCount: 0,
                    about: state.about,
                    location: state.city && state.area ? `${state.area}, ${state.city}` : undefined
                };
                setContacts([newContact, ...contacts]);
            }
        }
    }, [location.state, contacts]);

    useEffect(() => {
        if (selectedContactId) {
            setMessages(MOCK_MESSAGES[selectedContactId] || []);
        }
    }, [selectedContactId]);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: "me",
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
        };

        setMessages([...messages, newMessage]);
        setInputText("");
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'dashboard': onNavigateToDashboard(); break;
            case 'listings': onNavigateToListing(); break;
            case 'chat': /* Already here */ break;
            case 'profiles': onNavigateToMatches(); break; // Profiles link in navbar
            case 'edit-profile': onNavigateToSetting(); break;
            case 'change-password': onNavigateToChangePassword?.(); break;
            case 'verification': onNavigateToVerification?.(); break;
            case 'notification': onNavigateToNotification(); break;
            case 'map': onNavigateToMap(); break;
            case 'red-flag-alert': onNavigateToRedFlagAlert(); break;
            case 'analytics': onNavigateToAnalytics(); break;
            default: break;
        }
    };

    const activeContact = contacts.find(c => c.id === selectedContactId);

    // Helper to group messages by date
    const groupMessagesByDate = (msgList: Message[]) => {
        const groups: { [key: string]: Message[] } = {};
        msgList.forEach(msg => {
            // Simplified date grouping for mock data
            // In a real app, you'd parse msg.timestamp or use an actual date field
            const date = msg.timestamp.includes('Yesterday') ? 'Yesterday' : 'Today';
            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });
        return groups;
    };

    const groupedMessages = selectedContactId ? groupMessagesByDate(messages) : {};

    return (
        <div className="message-page brown-theme">
            <SharedNavbar
                currentPage="chat"
                onNavigate={handleNavigate}
                onLogout={onLogout}
                userName={user.fullName}
            />

            <div className="mp-content-container">
                {/* Sidebar - Left */}
                <div className="mp-sidebar">
                    <div className="mp-sidebar-header">
                        <div className="mp-search-container">
                            <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}></i>
                            <input
                                type="text"
                                className="mp-search-input"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="mp-tabs">
                            <div className="mp-tab active">All</div>
                            <div className="mp-tab">Unread</div>
                            <div className="mp-tab">Archived</div>
                        </div>
                    </div>

                    <div className="mp-contact-list">
                        {MOCK_CONTACTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((contact) => (
                            <div
                                key={contact.id}
                                className={`mp-contact-item ${contact.id === selectedContactId ? 'selected' : ''}`}
                                onClick={() => setSelectedContactId(contact.id)}
                            >
                                <div className="mp-avatar-container">
                                    <img src={contact.avatar} alt={contact.name} className="mp-avatar" />
                                    <span className={`mp-status-indicator ${contact.status}`} />
                                </div>
                                <div className="mp-contact-info">
                                    <div className="mp-contact-header">
                                        <span className="mp-contact-name">{contact.name}</span>
                                        <span className="mp-last-msg-time">{contact.lastMessageTime}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="mp-last-msg-preview">{contact.lastMessage}</div>
                                        {contact.unreadCount && contact.unreadCount > 0 ? (
                                            <div className="mp-unread-dot" />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area - Center */}
                <div className="mp-main-area">
                    {!selectedContactId ? (
                        <div className="mp-empty-state">
                            <i className="bi bi-chat-square-text"></i>
                            <h3>Select a conversation</h3>
                            <p>Choose a contact from the sidebar to start chatting</p>
                        </div>
                    ) : (
                        <div className="mp-chat-area">
                            <div className="mp-chat-header">
                                {activeContact && (
                                    <>
                                        <div className="mp-chat-header-user">
                                            <div className="mp-avatar-container" style={{ marginRight: '1rem' }}>
                                                <img src={activeContact.avatar} alt={activeContact.name} className="mp-avatar" style={{ width: '40px', height: '40px' }} />
                                                <span className={`mp-status-indicator ${activeContact.status}`} style={{ width: '10px', height: '10px', right: '0', bottom: '0' }} />
                                            </div>
                                            <div>
                                                <div className="mp-header-name">{activeContact.name}</div>
                                                <div className="mp-header-status">
                                                    {activeContact.status === 'online' ? 'Online' : 'Offline'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mp-header-actions">
                                            <i className="bi bi-telephone mp-header-icon" title="Call"></i>
                                            <i className="bi bi-camera-video mp-header-icon" title="Video Call"></i>
                                            <i className="bi bi-info-circle mp-header-icon" title="Info"></i>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mp-messages-list">
                                {Object.entries(groupedMessages).map(([date, msgs]) => (
                                    <React.Fragment key={date}>
                                        <div className="mp-date-divider">
                                            <span className="mp-date-text">{date}</span>
                                        </div>
                                        {msgs.map((msg) => {
                                            const isMe = msg.senderId === "me";
                                            const avatarUrl = isMe
                                                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=D4745E&color=fff`
                                                : (activeContact?.avatar || "");

                                            return (
                                                <div key={msg.id} className={`mp-message-row ${isMe ? 'sent' : 'received'}`}>
                                                    {!isMe && (
                                                        <img src={avatarUrl} alt="Avatar" className="mp-msg-avatar-small" />
                                                    )}

                                                    <div className="mp-msg-block">
                                                        <div className="mp-msg-bubble">
                                                            {msg.imageUrl && (
                                                                <img src={msg.imageUrl} alt="Att" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '0.5rem' }} />
                                                            )}
                                                            {msg.text}
                                                            <span className="mp-msg-time-footer">{msg.timestamp}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="mp-input-area">
                                <div className="mp-input-wrapper">
                                    <i className="bi bi-paperclip mp-input-icon"></i>
                                    <input
                                        type="text"
                                        className="mp-chat-input"
                                        placeholder="Type a message..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <i className="bi bi-emoji-smile mp-input-icon"></i>
                                </div>
                                <button className="mp-send-btn-custom" onClick={() => handleSendMessage()}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Sidebar - Right */}
                {selectedContactId && activeContact && (
                    <div className="mp-profile-sidebar">
                        <div className="mp-ps-header">
                            <img src={activeContact.avatar} alt={activeContact.name} className="mp-ps-avatar" />
                            <div className="mp-ps-name">{activeContact.name}</div>
                            <div className="mp-ps-status">
                                <i className={`bi bi-circle-fill`} style={{ fontSize: '0.5rem', color: activeContact.status === 'online' ? '#10B981' : '#6B7280' }}></i>
                                {activeContact.status === 'online' ? 'Online' : 'Offline'}
                            </div>
                        </div>

                        <div className="mp-ps-body">
                            <div className="mp-ps-section">
                                <span className="mp-ps-label">About</span>
                                <p className="mp-ps-text">
                                    {activeContact.about || "Looking for a roommate. I value cleanliness and mutual respect."}
                                </p>
                            </div>

                            <div className="mp-ps-section">
                                <span className="mp-ps-label">Location</span>
                                <div className="mp-ps-text">{activeContact.location || "Pakistan"}</div>
                            </div>

                            <div className="mp-ps-section">
                                <span className="mp-ps-label">Interests</span>
                                <div className="mp-ps-badge-list">
                                    <span className="mp-ps-badge">Technology</span>
                                    <span className="mp-ps-badge">Hiking</span>
                                    <span className="mp-ps-badge">Cooking</span>
                                </div>
                            </div>
                        </div>

                        <div className="mp-ps-footer">
                            <button
                                className="btn-ps-action btn-ps-view-profile"
                                onClick={() => onNavigateToProfile(activeContact.id)}
                            >
                                <i className="bi bi-person"></i> View Full Profile
                            </button>
                            <button className="btn-ps-action btn-ps-block">
                                <i className="bi bi-slash-circle"></i> Block User
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
