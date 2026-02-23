import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LandingPage } from "./components/PublicPages/Landingpage";
import DashboardPage from "./components/User/DashboardPage";
import { AnalyticsReportPage } from "./components/User/AnalyticsReportPage";
import { ResetPasswordPage } from "./components/PublicPages/ResetPasswordPage";
import { LoginSelectionPage } from "./components/PublicPages/LoginSelectionPage";
import { MessagePage } from "./components/User/MessagePage";
import { CreateProfilePage } from "./components/User/CreateProfilePage";
import { VerificationPage } from "./components/User/VerificationPage";
import ChangePasswordPage from "./components/User/ChangePasswordPage";
import { RedFlagAlert } from "./components/User/RedFlagAlert";
import "./styles/theme.css";
import { AdminDashboard } from "./components/AdminPannel/AdminDashboard";
import { ListingManage } from "./components/AdminPannel/ListingManage";
import { VerificationPage as AdminVerificationPage } from "./components/AdminPannel/VerificationPage";
import { AnalyticsPage } from "./components/AdminPannel/AnalyticsPage";
import { AdminUserProfile } from "./components/AdminPannel/AdminUserProfile";
import { AdminLoginPage } from "./components/AdminPannel/AdminLoginPage";
import { AdminSignupPage } from "./components/AdminPannel/AdminSignupPage";
import { AdminForgotPasswordPage } from "./components/AdminPannel/AdminForgotPasswordPage";
import { UserLoginPage } from "./components/User/UserLoginPage";
import { UserSignupPage } from "./components/User/UserSignupPage";
import { UserForgotPasswordPage } from "./components/User/UserForgotPasswordPage";
// Property Owner(User) folder was deleted - imports commented out
// import { PropertyOwnerLoginPage } from "./components/Property Owner(User)/PropertyOwnerLoginPage";
// import { PropertyOwnerSignupPage } from "./components/Property Owner(User)/PropertyOwnerSignupPage";
// import { PropertyOwnerForgotPasswordPage } from "./components/Property Owner(User)/PropertyOwnerForgotPasswordPage";
// import PropertyOwnerHomePage from "./components/Property Owner(User)/HomePage";

// New Property Owner imports
import PropertyOwnerDashboard from "./components/Property Owner/Dashboard";
import { PostListingPage as PropertyOwnerPostListingPage } from "./components/Property Owner/PostListingPage";
import { PropertyOwnerLoginPage } from "./components/Property Owner/LoginPage";
import { PropertyOwnerSignupPage } from "./components/Property Owner/SignupPage";

import { SettingPage as PropertyOwnerSettingPage } from "./components/Property Owner/SettingPage";
import { ForSale as PropertyOwnerForSalePage } from "./components/Property Owner/ForSale";
import { ForRent as PropertyOwnerForRentPage } from "./components/Property Owner/ForRent";
import PropertyOwnerForRentViewListing from "./components/Property Owner/ForRentViewListing";
import PropertyOwnerViewAllListings from "./components/Property Owner/ViewAllListings";
import PropertyOwnerDetailListingPage from "./components/Property Owner/DetailListingPage";



// ... existing imports ...


import { MapPage } from "./components/User/MapPage";
import { ListingPage } from "./components/User/ListingPage";
import ListingDetailsPage from "./components/User/ListingDetailsPage";
import { NotificationPage } from "./components/User/NotificationPage";
import ViewProfile from "./components/User/ViewProfile";

// Property Owner(User) imports - folder deleted, commented out
// import { AnalyticsReportPage as PropertyOwnerAnalyticsReportPage } from "./components/Property Owner(User)/AnalyticsReportPage";
// import { MessagePage as PropertyOwnerMessagePage } from "./components/Property Owner(User)/MessagePage";
// import { CreateProfilePage as PropertyOwnerCreateProfilePage } from "./components/Property Owner(User)/CreateProfilePage";
// import { Setting as PropertyOwnerSetting } from "./components/Property Owner(User)/Setting";
// import { RedFlagAlert as PropertyOwnerRedFlagAlert } from "./components/Property Owner(User)/RedFlagAlert";
// import { MapPage as PropertyOwnerMapPage } from "./components/Property Owner(User)/MapPage";
// import { ListingPage as PropertyOwnerListingPage } from "./components/Property Owner(User)/ListingPage";
// import { NotificationPage as PropertyOwnerNotificationPage } from "./components/Property Owner(User)/NotificationPage";
// import PropertyOwnerViewProfile from "./components/Property Owner(User)/ViewProfile";
// import PropertyOwnerNewMatchCrt from "./components/Property Owner(User)/NewMatchCrt";

import NewMatchCrt from "./components/User/NewMatchCrt";
import { MatchesPage } from "./components/User/MatchesPage";
import { EditProfilePage } from "./components/User/EditProfilePage";
import { ProfilesPage } from "./components/User/ProfilesPage";
import { ProfileDetailsPage } from "./components/User/ProfileDetailsPage";
import { api } from "./services/api";


// Types
interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  profile_id?: string;
  is_admin?: boolean;
}


const Preloader = () => (
  <div className="swm-loader-holder">
    <div className="swm-loader-inner">
      <div className="swm-circular-spin"></div>
    </div>
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Start true to check auth
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await api.getMe();
        setUser({
          ...currentUser,
          fullName: currentUser.username // Fallback to username
        });
        // Only redirect to dashboard if we are currently on the landing page (root)
        if (window.location.pathname === '/') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.log("Not authenticated", error);
        // Optional: Redirect to login if needed, or stay on public pages
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Sync profile_id from backend if missing
  React.useEffect(() => {
    const syncProfileId = async () => {
      if (user && user.id && !user.profile_id) {
        try {
          const profile = await api.getProfile(user.id);
          if (profile && profile.id) {
            setUser(prev => prev ? { ...prev, profile_id: profile.id } : null);
          }
        } catch (error) {
          // Profile might genuinely not exist, ignore error
        }
      }
    };
    syncProfileId();
  }, [user?.id]);

  // Unused params prefixed with underscore
  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 1000);
  };

  /* =========================
     LOGIN
  ========================== */
  const handleLoginSuccess = (_email: string, _password: string, backendUser?: any) => {
    if (backendUser) {
      setUser({
        id: backendUser.id,
        email: backendUser.email,
        username: backendUser.username,
        fullName: backendUser.username,
        profile_id: backendUser.profile_id,
        is_admin: backendUser.is_admin
      });
      handleNavigation("/dashboard");
    }
  };

  /* =========================
     SIGNUP
  ========================== */
  const handleSignupSuccess = (data: any) => {
    // Auto-login after signup with backend data
    setUser({
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.username,
      profile_id: data.profile_id
    });

    // Redirect directly to profile creation
    handleNavigation("/create-profile");
  };

  /* =========================
     FORGOT PASSWORD
  ========================== */
  const handleForgotPassword = (_email: string) => {
    // TODO: Connect to backend password reset
    const emailToReset = _email; // Keep ref for now if needed or remove
    setResetEmail(emailToReset);
    handleNavigation("/reset-password");
  };

  /* =========================
     RESET PASSWORD
  ========================== */
  const handleResetPassword = (_newPassword: string) => {
    // TODO: Connect to backend password reset
    alert("Password reset functionality coming soon with backend integration.");
    setResetEmail(null);
    handleNavigation("/login-selection");
  };

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = () => {
    setUser(null);
    handleNavigation("/");
  };

  /* =========================
     ADMIN AUTH HANDLERS
  ========================== */
  const handleAdminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const backendUser = await api.login(email, password);

      if (backendUser.is_admin) {
        // Correctly set user state with admin flag
        setUser({
          id: backendUser.id,
          email: backendUser.email,
          username: backendUser.username,
          fullName: backendUser.username, // Using username as fallback for fullName
          profile_id: backendUser.profile_id,
          is_admin: true
        });
        handleNavigation("/admin-dashboard");
      } else {
        alert("Access Denied: You do not have administrator privileges.");
      }
    } catch (error: any) {
      alert(error.message || "Admin login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSignup = (_data: any) => {
    // setAccounts((prev) => [...prev, data]);
    alert("Admin signup not fully implemented in this refactor.");
    handleNavigation("/admin-login");
  };

  /* =========================
     PROPERTY OWNER AUTH HANDLERS
  ========================== */
  const handleOwnerLogin = (_email: string, _password: string, backendUser?: any) => {
    if (backendUser) {
      setUser({
        id: backendUser.id,
        email: backendUser.email,
        username: backendUser.username,
        fullName: backendUser.username,
        profile_id: backendUser.profile_id,
        is_admin: backendUser.is_admin
      });
      handleNavigation("/property-owner-dashboard");
    }
  };

  const handleOwnerSignup = (data: any) => {
    setUser({
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.fullName || data.username,
      profile_id: data.profile_id
    });
    alert("Property Owner account created successfully!");
    handleNavigation("/property-owner-dashboard");
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <>
      {isLoading && <Preloader />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-selection" element={<LoginSelectionPage />} />

        {/* User Auth */}
        <Route path="/user-login" element={
          <UserLoginPage
            onLoginSuccess={handleLoginSuccess}
          />
        } />
        <Route path="/user-signup" element={
          <UserSignupPage
            onSignupSuccess={handleSignupSuccess}
          />
        } />
        <Route path="/user-forgot-password" element={
          <UserForgotPasswordPage onSubmitEmail={handleForgotPassword} />
        } />
        <Route path="/reset-password" element={
          resetEmail ? (
            <ResetPasswordPage
              email={resetEmail}
              onResetPassword={handleResetPassword}
            />
          ) : <Navigate to="/login-selection" />
        } />

        {/* Admin Auth */}
        {/* Admin Auth */}
        <Route path="/admin-login" element={
          <AdminLoginPage
            onLoginSuccess={handleAdminLogin}
          />
        } />
        <Route path="/admin-signup" element={
          <AdminSignupPage
            onSignupSuccess={(data) => handleAdminSignup({ ...data, username: data.fullName })}
          />
        } />
        <Route path="/admin-forgot-password" element={
          <AdminForgotPasswordPage
            onSubmitEmail={(email) => console.log("Admin forgot password", email)}
          />
        } />

        {/* Property Owner Auth */}
        <Route path="/property-owner-login" element={
          <PropertyOwnerLoginPage
            onLoginSuccess={handleOwnerLogin}
          />
        } />
        <Route path="/property-owner-signup" element={
          <PropertyOwnerSignupPage
            onSignupSuccess={(data) => handleOwnerSignup({ ...data, username: data.fullName })}
          />
        } />
        {/* TODO: Create Forgot Password page
        <Route path="/property-owner-forgot-password" element={...} />
        */}

        {/* Property Owner Dashboard - Using new Dashboard component */}
        <Route path="/property-owner-dashboard" element={
          <ProtectedRoute>
            <PropertyOwnerDashboard
              user={user!}
              onLogout={handleLogout}
              onNavigateToPostListing={() => navigate('/property-owner-post-listing')}

              onNavigateToListing={(filter: string | undefined) => {
                if (filter === 'sale') navigate('/property-owner-for-sale');
                else if (filter === 'rent') navigate('/property-owner-for-rent');
                else navigate('/property-owner-for-sale');
              }}
              onNavigateToDetail={(_id: string) => navigate(`/property-owner-detail-listing/${_id}`)}
              onNavigateToNotification={() => navigate('/property-owner-notification')}
              onNavigateToMatches={() => navigate('/matches')}
              onNavigateToSetting={() => navigate('/property-owner-setting')}
            />
          </ProtectedRoute>
        } />

        {/* Property Owner Pages */}
        <Route path="/property-owner-setting" element={
          <ProtectedRoute>
            <PropertyOwnerSettingPage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/property-owner-dashboard')}
              onNavigateToNotification={() => alert('Notifications Coming Soon')}
            />
          </ProtectedRoute>
        } />

        {/* Other Property Owner Pages - TODO: Create these in Property Owner folder */}
        {/* Routes temporarily disabled - components deleted
        <Route path="/property-owner-analytics" element={...} />
        <Route path="/property-owner-messages" element={...} />
        <Route path="/property-owner-create-profile" element={...} />
        <Route path="/property-owner-red-flag-alert" element={...} />
        <Route path="/property-owner-map" element={...} />
        <Route path="/property-owner-listing" element={...} />
        <Route path="/property-owner-notification" element={...} />
        <Route path="/property-owner-view-profile" element={...} />
        <Route path="/property-owner-new-matches" element={...} />
        */}



        <Route path="/property-owner-view-rent-listing" element={
          <ProtectedRoute>
            <PropertyOwnerForRentViewListing />
          </ProtectedRoute>
        } />
        <Route path="/property-owner-view-all-listings" element={
          <ProtectedRoute>
            <PropertyOwnerViewAllListings />
          </ProtectedRoute>
        } />

        <Route path="/property-owner-detail-listing/:id" element={
          <ProtectedRoute>
            <PropertyOwnerDetailListingPage />
          </ProtectedRoute>
        } />


        <Route path="/property-owner-post-listing" element={
          <ProtectedRoute>
            <PropertyOwnerPostListingPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/property-owner-dashboard')}
              onNavigateToListing={() => navigate('/property-owner-for-sale')}
              onNavigateToNotification={() => alert('Notifications Coming Soon')}
              onNavigateToMap={() => alert('Map Coming Soon')}
              onNavigateToSetting={() => navigate('/property-owner-setting')}
              onNavigateToRedFlagAlert={() => alert('Red Flag Coming Soon')}
            />
          </ProtectedRoute>
        } />

        <Route path="/property-owner-for-sale" element={
          <ProtectedRoute>
            <PropertyOwnerForSalePage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/property-owner-dashboard')}
              onNavigateToNotification={() => alert('Notifications Coming Soon')}
              onNavigateToSetting={() => navigate('/property-owner-setting')}
            />
          </ProtectedRoute>
        } />

        <Route path="/property-owner-for-rent" element={
          <ProtectedRoute>
            <PropertyOwnerForRentPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/property-owner-dashboard')}
              onNavigateToNotification={() => alert('Notifications Coming Soon')}
              onNavigateToSetting={() => navigate('/property-owner-setting')}
            />
          </ProtectedRoute>
        } />

        <Route path="/property-owner-notification" element={
          <ProtectedRoute>
            <NotificationPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/property-owner-dashboard')}
              onNavigateToSetting={() => navigate('/property-owner-setting')}
              onNavigateToRedFlagAlert={() => alert('Red Flag Coming Soon')}
              onNavigateToMap={() => alert('Map Coming Soon')}
              onNavigateToListing={() => navigate('/property-owner-for-sale')}
              onNavigateToNotification={() => navigate('/property-owner-notification')}
              onNavigateToMatches={() => navigate('/matches')}
            />
          </ProtectedRoute>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage
              user={user!}
              onLogout={handleLogout}
              onNavigateToMatches={() => navigate('/matches')}
              onNavigateToMessages={() => navigate('/messages')}
              onNavigateToProfiles={() => navigate('/profiles')}
              onNavigateToProfile={(id?: string) => id && navigate(`/profile/${id}`)}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToListingDetails={(listingId: string) => {
                setSelectedListingId(listingId);
                navigate('/listing-details');
              }}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToMap={() => navigate('/map')}
            />
          </ProtectedRoute>
        } />

        {/* Protected Sub-pages */}
        <Route path="/analytics-report" element={
          <ProtectedRoute>
            <AnalyticsReportPage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/matches" element={
          <ProtectedRoute>
            <MatchesPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToMessages={() => navigate('/messages')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToListingDetails={(id: string) => {
                setSelectedListingId(id);
                navigate('/listing-details');
              }}
            />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagePage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToMatches={() => navigate('/matches')}
              onNavigateToAnalytics={() => navigate('/analytics-report')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToProfile={(id) => navigate(`/profile/${id}`)}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/new-matches" element={
          <ProtectedRoute>
            <NewMatchCrt
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
              onNavigateToProfiles={() => navigate('/profiles')}
            />
          </ProtectedRoute>
        } />
        <Route path="/view-profile" element={
          <ProtectedRoute>
            <ViewProfile
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToProfiles={() => navigate('/profiles')}
              onNavigateToMessages={() => navigate('/messages')}
              onNavigateToProfile={(id) => navigate(`/profile/${id}`)}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/create-profile" element={
          <ProtectedRoute>
            <CreateProfilePage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
              onProfileCreated={(profileId) => {
                setUser(prev => prev ? { ...prev, profile_id: profileId } : null);
              }}
            />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfilePage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToListing={() => navigate('/listing')}
            />
          </ProtectedRoute>
        } />
        <Route path="/verification" element={
          <ProtectedRoute>
            <VerificationPage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToMatches={() => navigate('/matches')}
              onNavigateToMessages={() => navigate('/messages')}
              onNavigateToAnalytics={() => navigate('/analytics-report')}
              onNavigateToCreateProfile={() => navigate('/create-profile')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePasswordPage
              onNavigateBack={() => navigate('/dashboard')}
            />
          </ProtectedRoute>
        } />
        <Route path="/red-flag-alert" element={
          <ProtectedRoute>
            <RedFlagAlert
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToMatches={() => navigate('/matches')}
              onNavigateToMessages={() => navigate('/messages')}
              onNavigateToAnalytics={() => navigate('/analytics-report')}
              onNavigateToCreateProfile={() => navigate('/create-profile')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToProfiles={() => navigate('/profiles')}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <MapPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/listing" element={
          <ProtectedRoute>
            <ListingPage
              user={user!}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToProfiles={() => navigate('/profiles')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToListingDetails={(listingId) => {
                setSelectedListingId(listingId);
                navigate('/listing-details');
              }}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/profiles" element={
          <ProtectedRoute>
            <ProfilesPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToProfiles={() => navigate('/profiles')}
              onNavigateToProfileDetails={(profileId: string) => navigate(`/profile/${profileId}`)}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <ProtectedRoute>
            <ProfileDetailsPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToProfiles={() => navigate('/profiles')}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
              onNavigateToMessages={(id, name, data) => navigate('/messages', { state: { startChatWith: id, name, ...data } })}
              onNavigateToListingDetails={(listingId) => {
                setSelectedListingId(listingId);
                navigate('/listing-details');
              }}
            />
          </ProtectedRoute>
        } />
        <Route path="/listing-details" element={
          <ProtectedRoute>
            <ListingDetailsPage
              user={user!}
              listingId={selectedListingId || undefined}
              onNavigateBack={() => navigate('/listing')}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToChangePassword={() => navigate('/change-password')}
              onNavigateToVerification={() => navigate('/verification')}
            />
          </ProtectedRoute>
        } />
        <Route path="/notification" element={
          <ProtectedRoute>
            <NotificationPage
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToSetting={() => navigate('/edit-profile')}
              onNavigateToRedFlagAlert={() => navigate('/red-flag-alert')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToListing={() => navigate('/listing')}
              onNavigateToNotification={() => navigate('/notification')}
              onNavigateToMatches={() => navigate('/matches')}
            />
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard
              user={user!}
              onLogout={handleLogout}
              onNavigateToUser={() => navigate('/admin-dashboard')}
              onNavigateToListing={() => navigate('/listing-manage')}
              onNavigateToVerification={() => navigate('/verification-manage')}
              onNavigateToAnalytics={() => navigate('/admin-analytics')}
              onNavigateToProfile={() => alert("Profile Coming Soon")}
              onNavigateToSetting={() => alert("Settings Coming Soon")}
              onNavigateToUserProfile={(id: number) => navigate(`/admin-user-profile/${id}`)}
            />
          </ProtectedRoute>
        } />
        <Route path="/admin-user-profile/:id" element={
          <ProtectedRoute>
            <AdminUserProfile
              onLogout={handleLogout}
              onNavigateBack={() => navigate('/admin-dashboard')}
            />
          </ProtectedRoute>
        } />
        <Route path="/listing-manage" element={
          <ProtectedRoute>
            <ListingManage
              onLogout={handleLogout}
              onNavigateToUser={() => navigate('/admin-dashboard')}
              onNavigateToListing={() => navigate('/listing-manage')}
              onNavigateToVerification={() => navigate('/verification-manage')}
              onNavigateToAnalytics={() => navigate('/admin-analytics')}
              onNavigateToProfile={() => alert("Profile Coming Soon")}
              onNavigateToSetting={() => alert("Settings Coming Soon")}
            />
          </ProtectedRoute>
        } />
        <Route path="/verification-manage" element={
          <ProtectedRoute>
            <AdminVerificationPage
              onLogout={handleLogout}
              onNavigateToUser={() => navigate('/admin-dashboard')}
              onNavigateToListing={() => navigate('/listing-manage')}
              onNavigateToVerification={() => navigate('/verification-manage')}
              onNavigateToAnalytics={() => navigate('/admin-analytics')}
              onNavigateToProfile={() => alert("Profile Coming Soon")}
              onNavigateToSetting={() => alert("Settings Coming Soon")}
            />
          </ProtectedRoute>
        } />
        <Route path="/admin-analytics" element={
          <ProtectedRoute>
            <AnalyticsPage
              onLogout={handleLogout}
              onNavigateToUser={() => navigate('/admin-dashboard')}
              onNavigateToListing={() => navigate('/listing-manage')}
              onNavigateToVerification={() => navigate('/verification-manage')}
              onNavigateToAnalytics={() => navigate('/admin-analytics')}
              onNavigateToProfile={() => alert("Profile Coming Soon")}
              onNavigateToSetting={() => alert("Settings Coming Soon")}
            />
          </ProtectedRoute>
        } />

      </Routes>
    </>
  );
}
