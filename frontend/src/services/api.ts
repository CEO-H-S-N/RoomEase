const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Global fetch interceptor to inject Authorization header if access_token is in localStorage
// This bypasses Safari/Chrome third-party cookie blocking for cross-origin setups.
const originalFetch = window.fetch;
window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url.startsWith(API_BASE_URL)) {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (token) {
            init = init || {};
            const headers = new Headers(init.headers || {});
            if (!headers.has('Authorization')) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            init.headers = headers;
        }
    }
    return originalFetch(input, init);
};


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
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Login failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('access_token', data.token);
        }
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

    async searchProfiles(q: string): Promise<ProfileData[]> {
        if (!q || !q.trim()) return [];
        const response = await fetch(`${API_BASE_URL}/profiles/search?q=${encodeURIComponent(q.trim())}&limit=10`, {
            credentials: 'include'
        });
        if (!response.ok) return [];
        return response.json();
    },

    async searchListings(q: string): Promise<any[]> {
        if (!q || !q.trim()) return [];
        // Filter client-side from all listings since there is no dedicated search endpoint
        try {
            const allListings = await api.getListings();
            const lower = q.trim().toLowerCase();
            return allListings.filter((l: any) =>
                l.city?.toLowerCase().includes(lower) ||
                l.area?.toLowerCase().includes(lower) ||
                String(l.monthly_rent_PKR).includes(lower)
            ).slice(0, 10);
        } catch {
            return [];
        }
    },

    // Matches
    async getBestMatches(topN: number = 5) {
        const response = await fetch(`${API_BASE_URL}/ai/best_matches?top_n=${topN}`, {
            credentials: 'include',
        });
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
        const data = await response.json();
        // Normalize backend data: amenities/images may be strings, lat/lng vs latitude/longitude
        return data.map((listing: any) => ({
            ...listing,
            amenities: Array.isArray(listing.amenities)
                ? listing.amenities
                : typeof listing.amenities === 'string' && listing.amenities.trim()
                    ? listing.amenities.split(/\s{2,}|\n|,/).map((s: string) => s.trim()).filter(Boolean)
                    : [],
            images: Array.isArray(listing.images)
                ? listing.images
                : typeof listing.images === 'string' && listing.images.trim()
                    ? listing.images.split(/\s+/).filter(Boolean)
                    : [],
            latitude: listing.latitude ?? listing.lat ?? null,
            longitude: listing.longitude ?? listing.lng ?? null,
        }));
    },

    async getRecommendedHousing(topN: number = 10) {
        const response = await fetch(`${API_BASE_URL}/ai/recommended_housing?top_n=${topN}`, {
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Failed to fetch recommended housing');
        }
        return response.json();
    },

    // Housing CRUD for Property Owners
    async createListing(listingData: any) {
        const response = await fetch(`${API_BASE_URL}/housing/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listingData),
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Failed to create listing');
        }
        return response.json();
    },

    async getMyListings() {
        const response = await fetch(`${API_BASE_URL}/housing/my-listings`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch your listings');
        return response.json();
    },

    async getListing(listingId: string) {
        const response = await fetch(`${API_BASE_URL}/housing/${listingId}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch listing details');
        return response.json();
    },

    async updateListing(listingId: string, listingData: any) {
        const response = await fetch(`${API_BASE_URL}/housing/${listingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listingData),
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Failed to update listing');
        }
        return response.json();
    },

    async deleteListing(listingId: string) {
        const response = await fetch(`${API_BASE_URL}/housing/${listingId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to delete listing');
        return response.json();
    },

    // AI Features - Red Flag Alerts
    async getRedFlagAlerts(count: number = 5) {
        const response = await fetch(`${API_BASE_URL}/ai/red-flag-alerts?count=${count}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch red flag alerts');
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
        const response = await fetch(`${API_BASE_URL}/profiles/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMessage = 'Failed to create profile';
            if (errorData?.detail) {
                if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail.map((e: any) => `${e.loc.join('.')} - ${e.msg}`).join('\n');
                } else {
                    errorMessage = String(errorData.detail);
                }
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();
        // The backend re-issues a JWT with the new profile_id in Set-Cookie.
        // We also need to update localStorage so the global fetch interceptor
        // sends the correct token immediately (without requiring a re-login).
        // Parse the new token from the cookie that was just set:
        const newToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];
        if (newToken) {
            localStorage.setItem('access_token', newToken);
        }
        return data;
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
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
        }
        return data.user;
    },

    async getMe(): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
    },

    // Admin Verifications
    async getPendingVerifications(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/admin/verifications`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch pending verifications');
        return response.json();
    },

    async approveVerification(userId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/admin/verifications/${userId}/approve`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to approve verification');
        return response.json();
    },

    async rejectVerification(userId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/admin/verifications/${userId}/reject`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to reject verification');
        return response.json();
    },

    async getAnalytics(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/admin/analytics`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    },

    // Admin: Users management
    async getAdminUsers(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
            credentials: 'include',
        });
        if (!response.ok) {
            let errorDetail = 'Failed to fetch admin users';
            try {
                const errorData = await response.json();
                if (errorData.detail) errorDetail = errorData.detail;
            } catch (e) {}
            throw new Error(errorDetail);
        }
        return response.json();
    },

    async adminDeleteUser(userId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            let errorDetail = 'Failed to delete user';
            try {
                const errorData = await response.json();
                if (errorData.detail) errorDetail = errorData.detail;
            } catch (e) {}
            throw new Error(errorDetail);
        }
        return response.json();
    },

    // Admin: Listings management
    async getAdminListings(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/admin/listings`, {
            credentials: 'include',
        });
        if (!response.ok) {
            let errorDetail = 'Failed to fetch admin listings';
            try {
                const errorData = await response.json();
                if (errorData.detail) errorDetail = errorData.detail;
            } catch (e) {}
            throw new Error(errorDetail);
        }
        return response.json();
    },

    async adminDeleteListing(listingId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/admin/listings/${listingId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            let errorDetail = 'Failed to delete listing';
            try {
                const errorData = await response.json();
                if (errorData.detail) errorDetail = errorData.detail;
            } catch (e) {}
            throw new Error(errorDetail);
        }
        return response.json();
    },

    // Wishlist
    async toggleWishlist(listingId: string): Promise<{ status: 'added' | 'removed' }> {
        const response = await fetch(`${API_BASE_URL}/ai/wishlist/${listingId}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to toggle wishlist');
        return response.json();
    },

    async getWishlist(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/ai/wishlist`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        return response.json();
    },

    async getLikedProfilesDetails(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/users/liked-profiles-details`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch liked profiles');
        return response.json();
    },

    async toggleLikeProfile(profileId: string): Promise<{ status: string }> {
        const response = await fetch(`${API_BASE_URL}/users/like-profile/${profileId}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to toggle like');
        return response.json();
    },

    // History
    async getStayHistory(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/users/stay-history`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    },

    async addToHistory(data: {
        target_id: string;
        target_type: 'housing' | 'roommate';
        target_name: string;
        target_image?: string;
        target_location?: string;
        duration?: string;
        move_in?: string;
        move_out?: string;
    }): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/users/stay-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to add to history');
        return response.json();
    },

    async rateTarget(data: {
        target_id: string;
        target_type: 'housing' | 'roommate';
        rating: number;
        comment?: string;
    }): Promise<{ message: string; rating: number }> {
        const response = await fetch(`${API_BASE_URL}/users/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to submit rating');
        return response.json();
    }
};
