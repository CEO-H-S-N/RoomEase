[![FastAPI](https://img.shields.io/badge/FastAPI-00C7B7?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logoColor=white)](https://groq.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

# 🔧 RoomEase — Backend API

FastAPI-powered backend for the RoomEase platform. Handles authentication, user/profile management, property listings, and the multi-agent AI roommate matching pipeline.

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point, CORS, router registration
│   ├── agents/              # AI agent implementations
│   │   ├── agent_pipeline.py        # Orchestrates the 3-agent match pipeline
│   │   ├── match_scorer_agent.py    # Compatibility scoring (0–100)
│   │   ├── red_flag_agent.py        # Conflict & safety detection
│   │   ├── wingman_agent.py         # Match explanation & negotiation tips
│   │   ├── profile_reader_agent.py  # Parses free-text bios into structured data
│   │   └── room_hunter_agent.py     # Housing recommendation agent
│   ├── db/
│   │   └── mongo.py         # MongoDB connection, collection helpers
│   ├── models/              # Pydantic data models
│   │   ├── user.py
│   │   ├── profile.py
│   │   └── housing.py
│   ├── routes/              # FastAPI routers
│   │   ├── auth/            # Google OAuth2
│   │   ├── users/           # Registration, login, likes, history, ratings
│   │   ├── profiles/        # Profile CRUD + location lookup
│   │   ├── housing/         # Property listing CRUD
│   │   ├── match_scorer/    # /ai/best_matches endpoint
│   │   ├── parse_profile/   # /ai/parse_profile endpoint
│   │   ├── red_flag/        # /ai/red-flag-alerts endpoint
│   │   ├── room_hunt/       # /ai/recommended_housing + housing listings
│   │   ├── wingman/         # /ai/wingman endpoint
│   │   └── verification/    # Admin verification queue
│   ├── services/
│   │   └── matchmaker.py    # Shared matching utilities
│   └── utils/               # Helper utilities
├── data/                    # Seed data files
├── uploads/                 # Static file storage (user-uploaded images)
├── uploadHouses.py          # Bulk housing seeder script
├── uploadPRofiles.py        # Bulk profile seeder script
└── requirements.txt
```

---

## ⚙️ Setup

### 1. Create and activate a virtual environment

```bash
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate      # macOS/Linux
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create `app/.env` with the following:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=Flat-Waley
SECRET_KEY=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Run the development server

```bash
cd app
uvicorn main:app --reload --port 8000
```

Interactive API docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🤖 Multi-Agent AI Pipeline

The `MatchPipeline` class in `agents/agent_pipeline.py` orchestrates three agents in parallel using `ThreadPoolExecutor` (6 workers):

1. **Match Scorer Agent** — Produces a 0–100 compatibility score with reasons  
2. **Red Flag Agent** — Detects HIGH/MEDIUM/LOW severity conflicts  
3. **Wingman Agent** — Generates a plain-English summary and negotiation checklist  

Results are **cached in memory** for 5 minutes per user to reduce LLM API calls. A city-level MongoDB pre-filter shrinks the candidate pool before scoring (hard cap: 15 candidates).

### Score → Recommendation mapping

| Final Score | Risk Level | Recommendation |
|---|---|---|
| ≥ 80 | low | Highly Recommended |
| ≥ 60 | any | Recommended |
| ≥ 40 | any | Consider |
| < 40 | any | Not Recommended |

Risk penalties: HIGH flag → −20 pts; MEDIUM flag → −10 pts.

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Login (returns session cookie) |
| GET | `/users/me` | Get current authenticated user |
| GET | `/users/{id}/profile` | Get profile for a user |
| POST | `/users/like-profile/{id}` | Toggle like on a profile |
| GET | `/users/liked-profiles-details` | Get liked profiles |
| GET | `/users/stay-history` | Get stay history |
| POST | `/users/stay-history` | Add to stay history |
| POST | `/users/rate` | Rate a roommate or housing |
| GET | `/profiles/` | List all profiles |
| POST | `/profiles` | Create a profile |
| GET | `/profiles/{id}` | Get profile by ID |
| PATCH | `/profiles/{id}` | Update profile |
| GET | `/profiles/locations` | City/area lookup |
| GET | `/housing/` | List all housing |
| POST | `/housing/` | Create listing (owner) |
| GET | `/housing/my-listings` | Owner's listings |
| GET | `/housing/{id}` | Get listing by ID |
| PUT | `/housing/{id}` | Update listing |
| DELETE | `/housing/{id}` | Delete listing |
| GET | `/ai/best_matches` | AI roommate matches for current user |
| GET | `/ai/housing_listings` | All housing listings (normalised) |
| GET | `/ai/recommended_housing` | AI-recommended housing for current user |
| POST | `/ai/parse_profile` | Parse free-text bio into profile attributes |
| GET | `/ai/red-flag-alerts` | Red flag alerts for current user's matches |
| GET | `/ai/wingman` | Wingman advice for a specific match |
| POST | `/ai/wishlist/{id}` | Toggle listing in wishlist |
| GET | `/ai/wishlist` | Get user's wishlist |
| POST | `/auth/google` | Google OAuth2 sign-in |
| GET | `/api/admin/verifications` | Pending verification requests |
| POST | `/api/admin/verifications/{id}/approve` | Approve verification |
| POST | `/api/admin/verifications/{id}/reject` | Reject verification |
| GET | `/api/admin/users` | All users (admin) |
| DELETE | `/api/admin/users/{id}` | Delete a user (admin) |
| GET | `/api/admin/listings` | All listings (admin) |
| DELETE | `/api/admin/listings/{id}` | Delete a listing (admin) |
| GET | `/api/admin/analytics` | Platform analytics |

Static files are served from `/uploads/`.

---

## 🗄️ MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | User accounts (email, hashed password, role flags) |
| `profiles` | Student lifestyle profiles |
| `housing` | Property listings |
| `wishlist` | User-saved housing listings |
| `user_likes` | Profile like/match tracking |
| `stay_history` | Historical roommate/housing stays |
| `ratings` | Ratings and reviews |

---

## 🛠️ Utility Scripts

Run from the `backend/` directory:

```bash
# Bulk-seed housing listings
python uploadHouses.py

# Bulk-seed user profiles
python uploadPRofiles.py

# Promote a user to admin
python app/make_admin.py

# Check MongoDB image records
python app/check_images.py
```
