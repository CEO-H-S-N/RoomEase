import sys
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

# Force UTF-8 output so Unicode characters in print() never crash on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

app = FastAPI(
    title="FlatWalay API",
    description="API for FlatWalay project.",
    version="1.0.0",
    openapi_tags=[
        {"name": "Auth", "description": "Authentication related endpoints"},
        {"name": "Match", "description": "Roommate matching endpoints"},
        {"name": "Housing", "description": "Housing matching endpoints"},
    ],
    openapi_security=[{
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }]
)

# ------------------ CORS ------------------
# Allow localhost for development + production frontend from env
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",  # Frontend origin (Vite default)
    "http://localhost:5174",  # Frontend alternative port
    "http://localhost:9002",  # Legacy frontend origin
    "https://roomease.net",   # Production custom domain
    "https://www.roomease.net",  # www variant
    "https://roomease-one.vercel.app",  # Vercel deployment
]

if FRONTEND_URL:
    origins.append(FRONTEND_URL)
    # Also allow without trailing slash
    origins.append(FRONTEND_URL.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ------------------ MongoDB Check ------------------
from db.mongo import check_connection

@app.on_event("startup")
def startup_db_check():
    if check_connection():
        print("[OK] MongoDB connected successfully")
    else:
        print("[ERROR] Failed to connect to MongoDB")

# ------------------ Routers ------------------
from routes.users.routes import router as users_router
from routes.profiles.routes import router as profiles_router
from routes.parse_profile.routes import router as parse_router
from routes.match_scorer.routes import router as match_router
from routes.red_flag.route import router as flag_router
from routes.room_hunt.routes import router as room_hunter_router  
from routes.wingman.routes import router as wingman_router
from routes.auth.google_auth import router as google_auth_router
from routes.verification.routes import router as verification_router
from routes.housing.routes import router as housing_router
from fastapi.staticfiles import StaticFiles

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(verification_router)
app.include_router(users_router)
app.include_router(profiles_router)
app.include_router(parse_router)
app.include_router(match_router)
app.include_router(flag_router)
app.include_router(room_hunter_router)  # NEW: Housing matches
app.include_router(wingman_router)
app.include_router(google_auth_router)  # NEW: Google OAuth
app.include_router(housing_router)

# ------------------ Entry Point ------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)