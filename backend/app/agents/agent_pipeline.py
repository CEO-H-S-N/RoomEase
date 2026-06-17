import os
import json
import time
import hashlib
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from agents.match_scorer_agent import match_scorer_agent
from agents.red_flag_agent import red_flag_agent
from agents.wingman_agent import match_explainer_agent

# ---------------------------------------------------------------------------
# In-memory result cache: keyed by (user_profile_id, top_n)
# Cache expires after CACHE_TTL_SECONDS
# ---------------------------------------------------------------------------
_CACHE: Dict[str, tuple] = {}  # key -> (timestamp, results)
CACHE_TTL_SECONDS = 300        # 5 minutes

# Max candidates to score (city-filtered first; then this hard cap)
MAX_CANDIDATES = 15

# Parallelism: score this many candidates simultaneously
MAX_WORKERS = 6


class MatchPipeline:
    """
    Orchestrates the 3-agent roommate matching flow with parallel execution and caching:
    1. Compatibility Scoring  (MatchScorerAgent)
    2. Red Flag Detection     (RedFlagAgent)
    3. Aggregation & Summary  (MatchExplainerAgent / wingman)
    """

    def __init__(self):
        self.scoring_agent   = match_scorer_agent
        self.security_agent  = red_flag_agent
        self.aggregator_agent = match_explainer_agent

    # ------------------------------------------------------------------
    # Single pair pipeline (runs in a thread for each candidate)
    # ------------------------------------------------------------------
    def _run_pair(self, seeker: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        """Score one seeker-candidate pair with all 3 agents."""
        # Step 1: Compatibility score
        base_scoring = self.scoring_agent.score_profiles(seeker, candidate)
        base_score   = base_scoring.get("score", 0)
        reasons      = base_scoring.get("reasons", [])

        # Step 2: Red flag detection
        security_report = self.security_agent.detect_conflicts(seeker, candidate)
        red_flags        = security_report.get("red_flags", [])

        # Step 3: Explanation & negotiation checklist
        explanation_report = self.aggregator_agent.generate_explanation(
            match_score=base_score,
            match_reasons=reasons,
            red_flags=red_flags,
        )

        # Apply risk penalties
        final_score = base_score
        risk_level  = "low"
        has_high    = any(f.get("severity") == "HIGH"   for f in red_flags)
        has_med     = any(f.get("severity") == "MEDIUM" for f in red_flags)

        if has_high:
            final_score = max(0, final_score - 20)
            risk_level  = "high"
        elif has_med:
            final_score = max(0, final_score - 10)
            risk_level  = "medium"

        # Recommendation label
        recommendation = "Not Recommended"
        if final_score >= 80 and risk_level == "low":
            recommendation = "Highly Recommended"
        elif final_score >= 60:
            recommendation = "Recommended"
        elif final_score >= 40:
            recommendation = "Consider"

        return {
            "final_score":          final_score,
            "base_score":           base_score,
            "risk_level":           risk_level,
            "recommendation":       recommendation,
            "explanation":          explanation_report.get("summary_explanation"),
            "negotiation_checklist":explanation_report.get("negotiation_checklist", []),
            "red_flags":            red_flags,
            "score_reasons":        reasons,
            "profile":              candidate,
        }

    # ------------------------------------------------------------------
    # Main entry point
    # ------------------------------------------------------------------
    def get_best_matches(self, user_profile: Dict[str, Any], top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve, score in parallel, and return the top-N best roommate matches.
        Results are cached per user for CACHE_TTL_SECONDS.
        """
        # --- Cache check ---
        cache_key = f"{user_profile.get('id')}:{top_n}"
        if cache_key in _CACHE:
            ts, cached_results = _CACHE[cache_key]
            if time.time() - ts < CACHE_TTL_SECONDS:
                print(f"[INFO] Returning cached matches for user {user_profile.get('id')}")
                return cached_results
            else:
                del _CACHE[cache_key]

        # --- Fetch & pre-filter candidates ---
        from db.mongo import get_profiles_collection
        profiles_col = get_profiles_collection()

        # City-level pre-filter to shrink candidate pool
        query: Dict[str, Any] = {}
        user_city = user_profile.get("city", "").strip()
        if user_city:
            query["city"] = {"$regex": f"^{user_city}$", "$options": "i"}

        candidate_docs = list(profiles_col.find(query))

        # Hard-cap to avoid runaway costs / latency
        candidates = [
            {
                "id":              str(doc["_id"]),
                "raw_profile_text":doc.get("raw_profile_text", ""),
                "city":            doc.get("city", ""),
                "area":            doc.get("area", ""),
                "budget_PKR":      doc.get("budget_PKR", 0),
                "sleep_schedule":  doc.get("sleep_schedule"),
                "cleanliness":     doc.get("cleanliness"),
                "noise_tolerance": doc.get("noise_tolerance"),
                "study_habits":    doc.get("study_habits"),
                "food_pref":       doc.get("food_pref"),
                "age":             doc.get("age"),
                "occupation":      doc.get("occupation"),
                "full_name":       doc.get("full_name"),
                "profile_photo":   doc.get("profile_photo"),
            }
            for doc in candidate_docs
            if str(doc["_id"]) != user_profile.get("id")        # skip self
            and doc.get("full_name") and doc.get("city")         # skip invalid
        ][:MAX_CANDIDATES]

        print(f"[INFO] Scoring {len(candidates)} candidates in parallel (workers={MAX_WORKERS})")
        t0 = time.time()

        # --- Parallel scoring ---
        results: List[Dict[str, Any]] = []
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
            futures = {
                pool.submit(self._run_pair, user_profile, cand): cand
                for cand in candidates
            }
            for future in as_completed(futures):
                try:
                    results.append(future.result())
                except Exception as exc:
                    cand = futures[future]
                    print(f"[WARNING] Pipeline failed for candidate {cand.get('id')}: {exc}")

        # Sort descending by final score
        results.sort(key=lambda x: x["final_score"], reverse=True)
        top_results = results[:top_n]

        elapsed = time.time() - t0
        print(f"[INFO] Pipeline finished in {elapsed:.1f}s — {len(results)} scored, returning top {len(top_results)}")

        # --- Cache store ---
        _CACHE[cache_key] = (time.time(), top_results)

        return top_results


# Singleton
match_pipeline = MatchPipeline()
