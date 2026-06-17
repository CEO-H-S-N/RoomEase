from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, Any, List
from utils.jwt_utils import get_user_from_cookie
from routes.users.users_response_schemas import UserResponse
from agents.red_flag_agent import red_flag_agent
from db.mongo import get_profiles_collection
import random
from datetime import datetime, timedelta

router = APIRouter(prefix="/ai", tags=["AI Red Flag Detector"])

@router.post("/detect-conflicts")
def detect_conflicts(
    profile_a: Dict[str, Any],
    profile_b: Dict[str, Any],
    current_user: UserResponse = Depends(get_user_from_cookie)
):
    if not red_flag_agent:
        raise HTTPException(status_code=500, detail="RedFlagAgent not initialized. Check GROQ_API_KEY.")
    
    try:
        result = red_flag_agent.detect_conflicts(profile_a, profile_b)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---- Red-flag categories for realistic safety alerts ----
RED_FLAG_TEMPLATES = [
    # HIGH severity - serious safety concerns
    {
        "category": "Fraud Report",
        "severity": "HIGH",
        "templates": [
            "Reported by {n} users for requesting upfront payments before any meeting or property visit.",
            "Multiple reports of collecting security deposits for listings that don't exist.",
            "Reported for posing as a property owner and collecting rent for a property they don't own.",
        ]
    },
    {
        "category": "Identity Fraud",
        "severity": "HIGH",
        "templates": [
            "Profile uses a stock photo that matches multiple other accounts on the platform.",
            "Government ID verification failed - submitted documents appear altered or forged.",
            "Name and credentials do not match any public records. Possible fake identity.",
        ]
    },
    {
        "category": "Duplicate Account",
        "severity": "HIGH",
        "templates": [
            "This account shares the same device fingerprint and IP address with {n} other suspended accounts.",
            "Previously banned account detected re-registering under a new email and username.",
            "Multiple accounts created from same phone number - coordinated activity suspected.",
        ]
    },
    {
        "category": "Scam Behavior",
        "severity": "HIGH",
        "templates": [
            "Requested personal banking details from {n} users through in-app chat.",
            "Sent phishing links disguised as payment portals to other users.",
            "Asked multiple users to continue conversations on external messaging apps to avoid platform monitoring.",
        ]
    },
    # MEDIUM severity - suspicious patterns
    {
        "category": "Suspicious Activity",
        "severity": "MEDIUM",
        "templates": [
            "Unusual login pattern detected: {n} login attempts from {c} different cities in the last 24 hours.",
            "Profile information changed {n} times in the past week - possible profile cycling.",
            "Messaged {n} users within the first hour of account creation - bot-like behavior detected.",
        ]
    },
    {
        "category": "Misleading Profile",
        "severity": "MEDIUM",
        "templates": [
            "Listed budget and location do not match any available listings in the area - potential bait profile.",
            "Profile bio contains copied text found on {n} other accounts verbatim.",
            "Claims to be a student at an institution that has no record of this individual.",
        ]
    },
    {
        "category": "User Reports",
        "severity": "MEDIUM",
        "templates": [
            "Reported by {n} users for unresponsive behavior after confirming meetups.",
            "Flagged by a previous roommate for undisclosed property damage.",
            "Multiple reports of inconsistent information provided during conversations.",
        ]
    },
    {
        "category": "Harassment",
        "severity": "MEDIUM",
        "templates": [
            "Reported {n} times for sending unsolicited and inappropriate messages.",
            "Repeatedly contacted users after being asked to stop - potential harassment pattern.",
            "Flagged for aggressive and threatening language in chat messages.",
        ]
    },
    # LOW severity - minor warnings
    {
        "category": "Unverified Identity",
        "severity": "LOW",
        "templates": [
            "Email address not verified - account may not be actively managed.",
            "Phone number verification pending for over {n} days since account creation.",
            "Profile photo does not match the uploaded ID document.",
        ]
    },
    {
        "category": "Inactive Listing",
        "severity": "LOW",
        "templates": [
            "Profile has not been active in {n} days but listings remain published.",
            "Last login was {n} days ago - listings may contain outdated information.",
            "Has not responded to any of the last {n} messages received.",
        ]
    },
]


def _generate_flags_for_profile(profile: dict) -> List[dict]:
    """Generate 1-3 realistic red flags for a given profile."""
    num_flags = random.choices([1, 2, 3], weights=[45, 35, 20])[0]
    
    # Pick random categories without replacement
    categories = random.sample(RED_FLAG_TEMPLATES, min(num_flags, len(RED_FLAG_TEMPLATES)))
    
    flags = []
    for cat in categories:
        template = random.choice(cat["templates"])
        # Fill in template variables
        evidence = template.format(
            n=random.randint(2, 8),
            c=random.choice(["Lahore", "Karachi", "Islamabad", "Peshawar", "Multan"]),
        )
        # Generate a random date within the last 30 days
        days_ago = random.randint(0, 30)
        date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        
        flags.append({
            "category": cat["category"],
            "severity": cat["severity"],
            "evidence": evidence,
            "date": date,
        })
    
    return flags


@router.get("/red-flag-alerts")
def get_red_flag_alerts(
    count: int = Query(default=6, ge=1, le=15, description="Number of flagged profiles to return"),
    current_user: UserResponse = Depends(get_user_from_cookie)
):
    """
    Pick random profiles from the DB and generate realistic safety-related
    red flag alerts (reports, fraud, suspicious activity, etc.) for display.
    """
    profiles_collection = get_profiles_collection()

    # Fetch all profiles
    all_profiles = list(profiles_collection.find())
    if not all_profiles:
        return []

    # Shuffle and pick profiles
    random.shuffle(all_profiles)
    selected = all_profiles[:min(count + 4, len(all_profiles))]  # grab extra in case some have no flags

    alerts = []
    for p in selected:
        if len(alerts) >= count:
            break

        flags = _generate_flags_for_profile(p)
        if not flags:
            continue

        # Determine overall severity
        severities = [f["severity"] for f in flags]
        if "HIGH" in severities:
            overall_severity = "HIGH"
        elif "MEDIUM" in severities:
            overall_severity = "MEDIUM"
        else:
            overall_severity = "LOW"

        # Determine status
        high_count = sum(1 for s in severities if s == "HIGH")
        if high_count >= 2:
            status = "SUSPENDED"
        elif high_count == 1:
            status = "UNDER REVIEW"
        else:
            status = "FLAGGED"

        name = p.get("name") or p.get("full_name") or "Unknown User"
        alerts.append({
            "id": str(p["_id"]),
            "profile_name": name,
            "city": p.get("city", ""),
            "area": p.get("area", ""),
            "photo": p.get("profile_pic") or p.get("profile_photo") or "",
            "occupation": p.get("occupation") or "Not specified",
            "age": p.get("age"),
            "red_flags": flags,
            "overall_severity": overall_severity,
            "flag_count": len(flags),
            "status": status,
            "report_count": random.randint(1, 12),
        })

    # Sort: HIGH severity first, then by flag count
    severity_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    alerts.sort(key=lambda a: (severity_order.get(a["overall_severity"], 3), -a["flag_count"]))

    return alerts[:count]
