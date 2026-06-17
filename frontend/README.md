[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

# 🖥️ RoomEase — Frontend

React + TypeScript + Vite single-page application for the RoomEase platform.

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── App.tsx                  # Root component: routing, auth state
│   ├── main.tsx                 # React DOM entry point
│   ├── components/
│   │   ├── PublicPages/         # Landing, login selection, password reset
│   │   ├── User/                # Student dashboard, matches, profiles, map, chat…
│   │   ├── Property Owner/      # Owner dashboard, post listing, for-rent/sale views
│   │   ├── AdminPannel/         # Admin dashboard, listing & verification management
│   │   ├── Chat/                # ChatInbox (student) + ListerChatInbox (owner)
│   │   └── shared/              # Shared/reusable components
│   ├── services/
│   │   └── api.ts               # All fetch calls to the FastAPI backend
│   ├── styles/
│   │   └── theme.css            # Global design tokens & theme
│   ├── utils/                   # Helper functions
│   ├── App.css                  # App-level styles
│   └── index.css                # Base/reset styles
├── public/                      # Static assets
├── index.html                   # HTML entry point (Google Fonts loaded here)
├── vite.config.ts               # Vite configuration
├── tsconfig.app.json
└── package.json
```

---

## ⚙️ Setup

### Prerequisites
- Node.js ≥ 18 and npm

### Install & run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

App runs at **[http://localhost:5173](http://localhost:5173)**

### Environment variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_TALKJS_APP_ID=your_talkjs_app_id
```

> The backend API base URL is hard-coded to `http://localhost:8000` in `src/services/api.ts`. Change this if your backend runs on a different host/port.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

---

## 🗺️ Page Routing

All routing is handled client-side via **React Router DOM v7**.

### Public routes
| Path | Component |
|---|---|
| `/` | `LandingPage` |
| `/login-selection` | `LoginSelectionPage` |
| `/user-login` | `UserLoginPage` |
| `/user-signup` | `UserSignupPage` |
| `/user-forgot-password` | `UserForgotPasswordPage` |
| `/reset-password` | `ResetPasswordPage` |
| `/property-owner-login` | `PropertyOwnerLoginPage` |
| `/property-owner-signup` | `PropertyOwnerSignupPage` |
| `/admin-login` | `AdminLoginPage` |
| `/admin-signup` | `AdminSignupPage` |

### Student routes (protected — requires login)
| Path | Component |
|---|---|
| `/dashboard` | `DashboardPage` |
| `/matches` | `MatchesPage` |
| `/ai-picks` | `AiRecommendationsPage` |
| `/profiles` | `ProfilesPage` |
| `/profile/:id` | `ProfileDetailsPage` |
| `/messages` | `ChatInbox` |
| `/map` | `MapPage` |
| `/listing-details/:id` | `ListingDetailsPage` |
| `/create-profile` | `CreateProfilePage` |
| `/edit-profile` | `EditProfilePage` |
| `/verification` | `VerificationPage` |
| `/red-flag-alert` | `RedFlagAlert` |
| `/wishlist` | `WishlistPage` |
| `/history` | `HistoryPage` |
| `/notifications` | `NotificationsPage` |
| `/analytics-report` | `AnalyticsReportPage` |
| `/change-password` | `ChangePasswordPage` |

### Property Owner routes (protected)
| Path | Component |
|---|---|
| `/property-owner-dashboard` | `PropertyOwnerDashboard` |
| `/property-owner-post-listing` | `PostListingPage` |
| `/property-owner-edit-listing/:id` | `PostListingPage` (edit mode) |
| `/property-owner-for-sale` | `ForSale` |
| `/property-owner-for-rent` | `ForRent` |
| `/property-owner-view-rent-listing` | `ForRentViewListing` |
| `/property-owner-view-all-listings` | `ViewAllListings` |
| `/property-owner-detail-listing/:id` | `DetailListingPage` |
| `/property-owner-messages` | `ListerChatInbox` |
| `/property-owner-setting` | `SettingPage` |

### Admin routes (protected)
| Path | Component |
|---|---|
| `/admin-dashboard` | `AdminDashboard` |
| `/listing-manage` | `ListingManage` |
| `/verification-manage` | `VerificationPage` (Admin) |
| `/admin-analytics` | `AnalyticsPage` |

---

## 🔌 API Layer

All backend communication is centralised in [`src/services/api.ts`](src/services/api.ts).

Key API categories:

| Category | Methods |
|---|---|
| Auth | `login`, `register`, `getMe`, `googleAuth` |
| Profiles | `getProfile`, `getProfileById`, `getAllProfiles`, `createProfile`, `updateProfile` |
| AI Matching | `getBestMatches`, `parseProfile`, `getRedFlagAlerts`, `getWingmanAdvice` |
| Housing | `getListings`, `getRecommendedHousing`, `createListing`, `getMyListings`, `updateListing`, `deleteListing` |
| Wishlist | `toggleWishlist`, `getWishlist` |
| Likes | `toggleLikeProfile`, `getLikedProfilesDetails` |
| History | `getStayHistory`, `addToHistory`, `rateTarget` |
| Admin | `getPendingVerifications`, `approveVerification`, `rejectVerification`, `getAdminUsers`, `adminDeleteUser`, `getAdminListings`, `adminDeleteListing`, `getAnalytics` |

All requests use `credentials: 'include'` to send the session cookie set by FastAPI on login.

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `react-router-dom` v7 | Client-side routing |
| `framer-motion` | Page/component animations |
| `leaflet` + `react-leaflet` | Interactive map |
| `talkjs` + `@talkjs/react` | Real-time chat |
| `@react-oauth/google` | Google OAuth2 login |
| `bootstrap` 5 + `bootstrap-icons` | UI layout & icons |
| `lucide-react` | Additional icon set |
| `aos` | Scroll-triggered animations |
