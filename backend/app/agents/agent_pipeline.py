import os
import json
from typing import List, Dict, Any, Optional
from agents.profile_reader_agent import profile_reader
from agents.match_scorer_agent import match_scorer_agent
from agents.red_flag_agent import red_flag_agent
from agents.wingman_agent import match_explainer_agent

class MatchPipeline:
    """
    Orchestrates the 4-agent roommate matching flow:
    1. Profile Analysis (Normalization)
    2. Compatibility Scoring
    3. Red Flag Detection
    4. Aggregator (Final Score & Explanation)
    """

    def __init__(self):
        # The individual agents are imported from their respective modules
        self.analysis_agent = profile_reader
        self.scoring_agent = match_scorer_agent
        self.security_agent = red_flag_agent
        self.aggregator_agent = match_explainer_agent

    def run_pipeline(self, seeker_profile: Dict[str, Any], candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs the full 4-agent pipeline for a seeker-candidate pair.
        """
        # Step 1: Compatibility Scoring
        base_scoring = self.scoring_agent.score_profiles(seeker_profile, candidate_profile)
        base_score = base_scoring.get("score", 0)
        reasons = base_scoring.get("reasons", [])

        # Step 2: Red Flag Detection
        security_report = self.security_agent.detect_conflicts(seeker_profile, candidate_profile)
        red_flags = security_report.get("red_flags", [])

        # Step 3: Aggregation & Explanation
        explanation_report = self.aggregator_agent.generate_explanation(
            match_score=base_score,
            match_reasons=reasons,
            red_flags=red_flags
        )

        # Apply Risk Penalties
        final_score = base_score
        risk_level = "low"
        
        has_high_risk = any(f.get("severity") == "HIGH" for f in red_flags)
        has_med_risk = any(f.get("severity") == "MEDIUM" for f in red_flags)

        if has_high_risk:
            final_score = max(0, final_score - 20)
            risk_level = "high"
        elif has_med_risk:
            final_score = max(0, final_score - 10)
            risk_level = "medium"

        # Determine Recommendation Label
        recommendation = "Not Recommended"
        if final_score >= 80 and risk_level == "low":
            recommendation = "Highly Recommended"
        elif final_score >= 60:
            recommendation = "Recommended"
        elif final_score >= 40:
            recommendation = "Consider"

        return {
            "final_score": final_score,
            "base_score": base_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "explanation": explanation_report.get("summary_explanation"),
            "negotiation_checklist": explanation_report.get("negotiation_checklist", []),
            "red_flags": red_flags,
            "score_reasons": reasons
        }

    def get_best_matches(self, user_profile: Dict[str, Any], top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves, scores, and ranks all potential candidates from the database.
        """
        from db.mongo import get_profiles_collection
        from concurrent.futures import ThreadPoolExecutor, as_completed

        profiles_collection = get_profiles_collection()
        # Find raw candidates
        candidate_docs = list(profiles_collection.find())
        
        # Pre-filter to remove self and ensure valid data
        valid_candidates = []
        user_id = user_profile.get("id")
        
        for doc in candidate_docs:
            if str(doc["_id"]) == user_id:
                continue
            # Simple validation to skip broken profiles
            if not doc.get("full_name") or not doc.get("city"):
                continue
            valid_candidates.append(doc)

        print(f"⚡ Scoring {len(valid_candidates)} candidates in parallel...")

        results = []

        def process_candidate(doc):
            try:
                candidate_profile = {
                    "id": str(doc["_id"]),
                    "raw_profile_text": doc.get("raw_profile_text", ""),
                    "city": doc.get("city", ""),
                    "area": doc.get("area", ""),
                    "budget_PKR": doc.get("budget_PKR", 0),
                    "sleep_schedule": doc.get("sleep_schedule"),
                    "cleanliness": doc.get("cleanliness"),
                    "noise_tolerance": doc.get("noise_tolerance"),
                    "study_habits": doc.get("study_habits"),
                    "food_pref": doc.get("food_pref"),
                    "age": doc.get("age"),
                    "occupation": doc.get("occupation"),
                    "full_name": doc.get("full_name"),
                    "profile_photo": doc.get("profile_photo")
                }

                # Run the pipeline for this candidate
                pipeline_result = self.run_pipeline(user_profile, candidate_profile)
                
                # Augment result with the full profile for the frontend
                pipeline_result["profile"] = candidate_profile
                return pipeline_result
            except Exception as e:
                print(f"❌ Error processing candidate {doc.get('_id')}: {e}")
                return None

        # Execute in parallel
        # Using 10 workers to speed up I/O bound LLM calls
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_candidate = {executor.submit(process_candidate, doc): doc for doc in valid_candidates}
            
            for future in as_completed(future_to_candidate):
                result = future.result()
                if result:
                    results.append(result)

        # Sort by final score descending
        results.sort(key=lambda x: x["final_score"], reverse=True)
        return results[:top_n]

# Singleton instance
match_pipeline = MatchPipeline()

