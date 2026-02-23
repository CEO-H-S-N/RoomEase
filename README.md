#  RoomEase

### **Smarter, Safer, Stress-Free Roommate Matching**

RoomEase is an AI-powered platform designed to transform how students and professionals find compatible roommates. By leveraging multi-agent intelligence, we provide a safer and more transparent matching experience, specifically addressing the housing crisis faced by students relocating to major cities.

---

##  Key Features

- **AI Multi-Agent Matching**: Advanced algorithms that go beyond simple filters to understand lifestyle and behavior.
- **Google OAuth Integration**: Safe and seamless authentication.
- **Interactive Housing Maps**: Visualize available rooms and matches using leaflet-powered mapping.
- **Responsive UI**: A premium user experience built with Framer Motion, Lucide icons, and modern design principles.
- **Dashboard for Owners**: Dedicated interface for property owners to manage their listings.

---

##  AI Multi-Agent Intelligence

RoomEase utilizes a sophisticated multi-agent system to ensure high-quality matches:

1.  **Profile Reader Agent**: Automatically extracts key lifestyle attributes from unstructured user data and advertisements.
2.  **Match Scorer Agent**: Computes deep compatibility scores based on preferences, habits, and personality.
3.  **Red Flag Detector**: Proactively identifies potential conflicts and safety concerns.
4.  **Wingman Advisor**: Provides transparent explanations for matches and suggests practical compromises.

---

##  Tech Stack

### **Frontend**
- **Framework**: [React](https://reactjs.org/) (v19) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Bootstrap 5, Bootstrap Icons
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Motor)
- **AI Core**: [Groq](https://groq.com/) (LPU™ Inference Engine) & Pydantic
- **Auth**: Google OAuth 2.0 & JWT-based session management

---

##  Setup Instructions

### Prerequisites
- **Python 3.13+**
- **Node.js 18+**
- **MongoDB Instance** (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
```
**Environment Variables**: Create a `.env` file in `backend/app/` with:
```env
MONGO_URI=your_mongodb_uri
DB_NAME=Flat-Waley
SECRET_KEY=your_secret_key
GROQ_API_KEY=your_groq_key
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
**Environment Variables**: Create a `.env` file in `frontend/` with:
```env
VITE_GOOGLE_CLIENT_ID=your_google_id
```

---

##  Running the Project

### Start Backend
```bash
cd backend/app
uvicorn main:app --reload
```
- **API Documentation**: [You'll have your own]

### Start Frontend
```bash
cd frontend
npm run dev
```
- **Local URL**: [You'll have your own]

---

**RoomEase** - Bridging the gap in student housing through AI.
