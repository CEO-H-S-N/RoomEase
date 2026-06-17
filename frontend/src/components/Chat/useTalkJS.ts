import { useCallback } from 'react';
import Talk from 'talkjs';

const TALKJS_APP_ID = import.meta.env.VITE_TALKJS_APP_ID || 'tx1j8She';

export interface ChatUser {
  id: string;
  username: string;
  email: string;
  role?: 'seeker' | 'lister';
  photoUrl?: string;
}

/**
 * Creates a TalkJS User object from our MongoDB user data.
 * Maps the role field so TalkJS dashboard can manage permissions.
 */
export function createTalkUser(user: ChatUser): Talk.User {
  return new Talk.User({
    id: user.id,
    name: user.username,
    email: [user.email],
    role: user.role || 'seeker',
    photoUrl: user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=D4745E&color=fff`,
  });
}

/**
 * Generates a unique, deterministic conversation ID between two users.
 * Sorted so the same pair always gets the same conversation.
 */
export function getConversationId(userId1: string, userId2: string, context?: string): string {
  const sorted = [userId1, userId2].sort();
  const base = `${sorted[0]}_${sorted[1]}`;
  return context ? `${context}_${base}` : base;
}

/**
 * Generates a conversation ID for a specific listing/room.
 * e.g. room_6990dc86d70eb9f7427daafa_user1_user2
 */
export function getRoomConversationId(roomId: string, userId1: string, userId2: string): string {
  const sorted = [userId1, userId2].sort();
  return `room_${roomId}_${sorted[0]}_${sorted[1]}`;
}

/**
 * Hook to use TalkJS across the app.
 * Returns helper functions for creating users and conversation IDs.
 */
export function useTalkJS() {
  const appId = TALKJS_APP_ID;

  const buildUser = useCallback((user: ChatUser) => {
    return createTalkUser(user);
  }, []);

  const buildConversationId = useCallback((userId1: string, userId2: string, context?: string) => {
    return getConversationId(userId1, userId2, context);
  }, []);

  const buildRoomConversationId = useCallback((roomId: string, userId1: string, userId2: string) => {
    return getRoomConversationId(roomId, userId1, userId2);
  }, []);

  return {
    appId,
    buildUser,
    buildConversationId,
    buildRoomConversationId,
  };
}

export { TALKJS_APP_ID };
