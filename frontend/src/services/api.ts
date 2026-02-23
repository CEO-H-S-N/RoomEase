const API_BASE_URL = 'http://localhost:8000';

export interface User {
    id: string;
    username: string;
    email: string;
    profile_id?: string;
    is_admin?: boolean;
}

export interface ProfileData {
    id?: string;
    city: string;
    area: string;
    budget_PKR: number;
    sleep_schedule: 'Night owl' | 'Early riser' | 'Flexible';
    cleanliness: 'Tidy' | 'Average' | 'Messy';
    noise_tolerance: 'Quiet' | 'Moderate' | 'Loud ok';
    study_habits: 'Online classes' | 'Late-night study' | 'Room study' | 'Library';
    food_pref: 'Flexible' | 'Non-veg' | 'Veg';
    age: number;
    occupation: string;
    full_name: string;
    profile_photo?: string;
    raw_profile_text?: string;
    rating?: number;
    verified?: boolean;
    reviews?: {
        id: string;
        reviewerName: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    past_stays?: {
        id: string;
        location: string;
        duration: string;
        review: string;
        rating: number;
    }[];
}

export const api = {
    // Locations
    async getLocations(): Promise<Record<string, string[]>> {
        const response = await fetch(`${API_BASE_URL}/profiles/locations`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        return response.json();
    },

    // Auth
    async changePassword(currentPassword: string, newPassword: string) {
        const response = await fetch(`${API_BASE_URL}/users/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to change password');
        }

        return response.json();
    },

    async login(email: string, password: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data;
    },

    async register(username: string, email: string, password: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        return response.json();
    },

    // Profiles
    async getProfile(userId: string) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    async getProfileById(profileId: string): Promise<ProfileData> {
        const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profile details');
        return response.json();
    },

    async getAllProfiles(): Promise<ProfileData[]> {
        const response = await fetch(`${API_BASE_URL}/profiles/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profiles');
        return response.json();
    },

    // Matches
    async getBestMatches(topN: number = 5) {
        const response = await fetch(`${API_BASE_URL}/ai/best_matches?top_n=${topN}`);
        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch matches');
            } catch (e: any) {
                throw new Error(e.message || 'Failed to fetch matches');
            }
        }
        return response.json();
    },

    // Housing Listings
    async getListings() {
        const response = await fetch(`${API_BASE_URL}/ai/housing_listings`);
        if (!response.ok) throw new Error('Failed to fetch listings');
        return response.json();
    },

    async getBestHousingMatches(topN: number = 5) {
        const response = await fetch(`${API_BASE_URL}/ai/best_housing_matches?top_n=${topN}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch housing matches');
        return response.json();
    },

    // AI Features - Red Flags
    async getRedFlags(userId: string, matchId: string) {
        const response = await fetch(`${API_BASE_URL}/ai/red_flags?user_id=${userId}&match_id=${matchId}`);
        if (!response.ok) throw new Error('Failed to fetch red flags');
        return response.json();
    },

    // AI Features - Profile Parsing
    async parseProfile(bioText: string) {
        const response = await fetch(`${API_BASE_URL}/ai/parse_profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio_text: bioText }),
        });
        if (!response.ok) throw new Error('Failed to parse profile');
        return response.json();
    },

    // AI Features - Wingman Advice
    async getWingmanAdvice(matchId: string) {
        const response = await fetch(`${API_BASE_URL}/ai/wingman?match_id=${matchId}`);
        if (!response.ok) throw new Error('Failed to fetch wingman advice');
        return response.json();
    },

    // User Profile Management
    async createProfile(profileData: ProfileData) {
        const response = await fetch(`${API_BASE_URL}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to create profile');
        return response.json();
    },

    async updateProfile(profileId: string, profileData: Partial<ProfileData>) {
        const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update profile');
        }
        return response.json();
    },

    // Google OAuth
    async googleAuth(token: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!response.ok) throw new Error('Google authentication failed');
        const data = await response.json();
        return data.user;
    },

    async getMe(): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
    }
};
