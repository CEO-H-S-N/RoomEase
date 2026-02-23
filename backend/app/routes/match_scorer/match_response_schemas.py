from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from routes.profiles.profiles_response_schemas import ProfileResponse

class ChecklistItem(BaseModel):
    suggestion: str
    category: str

class RichMatchResult(BaseModel):
    profile: ProfileResponse
    final_score: int
    base_score: int
    risk_level: str
    recommendation: str
    explanation: str
    negotiation_checklist: List[ChecklistItem]
    red_flags: List[Dict[str, Any]]
    score_reasons: List[str]
