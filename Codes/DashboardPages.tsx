import '../styles/DashboardPage.css';

interface DashboardPageProps {
  user: {
    email: string;
    fullName: string;
  };
  onLogout: () => void;
  onNavigateToAnalytics: () => void;
}

export default function DashboardPage({ user, onLogout, onNavigateToAnalytics }: DashboardPageProps) {
  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-navbar">
        <div className="nav-left">
          <div className="logo-section">

            <span className="logo-text">RoomEase</span>
          </div>
        </div>

        <div className="nav-center">
          <a href="#" className="nav-link active">
            Home
          </a>
          <a href="#" className="nav-link">
            Create Profile
          </a>
          <a href="#" className="nav-link">
            Match
          </a>
          <a href="#" className="nav-link">
            Map
          </a>
          <a href="#" className="nav-link">
            Listing
          </a>
          <a href="#" className="nav-link">
            Message
          </a>
          <a href="#" className="nav-link">
            Red Flag Alert
          </a>
        </div>

        <div className="nav-right">
          <a href="#" className="nav-link" style={{ marginRight: '20px' }}>
            Setting
          </a>
          {/* Logout Button */}
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-hero">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <h1 className="header-title">Welcome {user.fullName}</h1>
              <p className="header-subtitle">Find Your Suitable Roommate</p>
            </div>

            <div className="header-right">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search listings, users..."
                  className="search-input"
                />
              </div>
              <button className="search-btn">Search</button>
              <button className="icon-btn">🔔</button>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="stats-grid">
            {/* Blue Card - Compatibility */}
            <div className="stat-card shadow border-0 stat-card-pastel-blue">
              <div className="stat-card-body">
                <div className="stat-header">
                  <span className="stat-label">Compatibility Score</span>
                </div>
                <div className="stat-value">88% Average</div>
                <div className="stat-subtext">+2 this month</div>
              </div>
              <div className="stat-card-footer-link" onClick={onNavigateToAnalytics} style={{ cursor: 'pointer' }}>
                <span>See details</span>
                <span>›</span>
              </div>
            </div>

            {/* Purple Card - New Matches */}
            <div className="stat-card shadow border-0 stat-card-pastel-purple">
              <div className="stat-card-body">
                <div className="stat-header">
                  <span className="stat-label">New Matches</span>
                </div>
                <div className="stat-value">3</div>
                <div className="stat-subtext">in last 7 days</div>
              </div>
              <div className="stat-card-footer-link">
                <span>See details</span>
                <span>›</span>
              </div>
            </div>

            {/* Pink Card - Listings */}
            <div className="stat-card shadow border-0 stat-card-pastel-pink">
              <div className="stat-card-body">
                <div className="stat-header">
                  <span className="stat-label">Available Listing</span>
                </div>
                <div className="stat-value">2</div>
                <div className="stat-subtext">in your area</div>
              </div>
              <div className="stat-card-footer-link">
                <span>See details</span>
                <span>›</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="section shadow border-0">
          <div className="section-header">
            <h2 className="section-title">Recent Matches</h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="table-container">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Budget</th>
                  <th>Compatibility</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ali Khan</td>
                  <td>PKR 50,000</td>
                  <td><span className="compatibility-badge">92%</span></td>
                </tr>
                <tr>
                  <td>Ahmed</td>
                  <td>PKR 45,000</td>
                  <td><span className="compatibility-badge">72%</span></td>
                </tr>
                <tr>
                  <td>Bilal Raza</td>
                  <td>PKR 60,000</td>
                  <td><span className="compatibility-badge">90%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Listing - Secondary Parallax Section */}
        <div className="dashboard-hero secondary-hero">
          <div className="section-header">
            <h2 className="section-title text-white">Featured Listing</h2>
            <p className="section-subtitle text-white-70">
              Check out the most popular properties
            </p>
          </div>

          <div className="classes-grid">
            <div className="class-card">
              <img
                src="assets/images/premium_photo-1684175656320-5c3f701c082c (appartemnt).avif"
                alt="Apartment"
                className="listing-image"
              />
              <div className="listing-info">
                <div className="listing-name">Apartment</div>
                <div className="listing-budget">PKR 120,000/month</div>
                <div className="listing-status">Available Now</div>
              </div>
            </div>

            <div className="class-card">
              <img
                src="assets/images/photo-1515263487990-61b07816b324 (flat).avif"
                alt="Modern Studio"
                className="listing-image"
              />
              <div className="listing-info">
                <div className="listing-name">DHA flats</div>
                <div className="listing-budget">PKR 80,000/month</div>
                <div className="listing-status">Available Now</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 

css

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f7;
  font-family: system-ui, -apple-system, sans-serif;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f7;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Navbar Styles */
.dashboard-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 70px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background-color: #008C9E;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #008C9E;
}

.nav-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 32px;
}

.nav-right {
  display: flex;
  align-items: center;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.nav-center::-webkit-scrollbar {
  display: none;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.nav-link:hover {
  color: #008C9E;
}

.nav-link.active {
  color: #008C9E;
  font-weight: 600;
  border-bottom: 2px solid #008C9E;
  padding-bottom: 4px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  background-color: #008C9E;
  /* Teal to match image reference */
  color: white;
  border: none;
  border-radius: 6px;
  /* Slightly rounded */
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.logout-btn:hover {
  background-color: #00707E;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 140, 158, 0.2);
}

/* User profile removed from nav, simplified */


/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 0;
}

.dashboard-hero {
  position: relative;
  padding: 32px;
  background-image: url('/assets/images/Securemessaging.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  margin-bottom: 32px;
}

.dashboard-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.dashboard-hero>* {
  position: relative;
  z-index: 2;
}

.dashboard-hero.secondary-hero {
  background-image: url('/assets/images/Messaging.jpg');
  margin: 0;
  margin-top: 32px;
  /* Ensure padding is consistent */
  padding: 48px 32px;
}

.text-white {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left {
  flex: 1;
}

.header-title {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
}

.search-icon {
  font-size: 16px;
  color: #9ca3af;
}

.search-input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 200px;
}



.icon-btn {
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s ease;
}

.icon-btn:hover {
  background-color: #f9fafb;
}

/* Stats Grid */
/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: white;
  border-radius: 16px;
  padding: 0;
  /* Updated to 0 for inner sections */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stat-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.stat-footer {
  font-size: 12px;
  color: #4f46e5;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Add a subtle indicator for positive growth if needed in future */
/* Pastel Stats Cards Design */
.stat-card-body {
  padding: 24px 24px 16px 24px;
  flex: 1;
}

.stat-card-pastel-blue {
  background-color: #E0F2FE;
  /* Light Blue */
}

.stat-card-pastel-purple {
  background-color: #F3E8FF;
  /* Light Purple */
}

.stat-card-pastel-pink {
  background-color: #FCE7F3;
  /* Light Pink */
}

/* Footer Link Section */
.stat-card-footer-link {
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.stat-card-pastel-blue .stat-card-footer-link {
  background-color: #BAE6FD;
  /* Darker Blue */
  color: #0369A1;
}

.stat-card-pastel-purple .stat-card-footer-link {
  background-color: #E9D5FF;
  /* Darker Purple */
  color: #7E22CE;
}

.stat-card-pastel-pink .stat-card-footer-link {
  background-color: #FBCFE8;
  /* Darker Pink */
  color: #BE185D;
}

/* Typography Overrides for Pastel Cards */
.stat-card-pastel-blue .stat-label,
.stat-card-pastel-purple .stat-label,
.stat-card-pastel-pink .stat-label,
.stat-card-pastel-blue .stat-subtext,
.stat-card-pastel-purple .stat-subtext,
.stat-card-pastel-pink .stat-subtext {
  color: #4b5563;
  /* Dark Grey */
  font-weight: 600;
}

.stat-card-pastel-blue .stat-value,
.stat-card-pastel-purple .stat-value,
.stat-card-pastel-pink .stat-value {
  color: #111827;
  /* Near Black */
}

.stat-subtext {
  font-size: 13px;
  margin-top: 4px;
}



/* Section Styles */
.section {
  background-color: white;
  border-radius: 16px;
  padding: 28px;
  margin: 0 32px 24px 32px;
  /* box-shadow handled by bootstrap 'shadow' class */
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Specific override for Secondary Hero Header to stack text */
.secondary-hero .section-header {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.secondary-hero .section-title {
  font-size: 36px;
  /* Bigger heading as requested */
  line-height: 1.2;
}

.secondary-hero .section-subtitle {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
}

.section-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
  font-weight: 700;
}

.view-all-btn {
  background-color: #008C9E;
  /* Teal to match Logout button */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-all-btn:hover {
  background-color: #00707E;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table thead {
  background-color: #f9fafb;
}

.activities-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activities-table td {
  padding: 16px;
  border-top: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-active {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

/* Compatibility Badge - glowing effect */
/* Compatibility Badge - glowing effect removed */
.compatibility-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #6d28d9);
  position: relative;
  overflow: hidden;
}

/* Search Button styled like Login Button */
.search-btn {
  padding: 8px 24px;
  background-color: #008C9E;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #00707E;
}

/* Classes Grid */
.classes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.class-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.class-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.listing-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.listing-info {
  padding: 20px;
}

.listing-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.listing-status {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.listing-budget {
  font-size: 13px;
  color: #4f46e5;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .classes-grid {
    grid-template-columns: 1fr;
  }
}