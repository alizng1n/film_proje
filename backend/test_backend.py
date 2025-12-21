import asyncio
import os
import sys
from pathlib import Path

# Add backend directory to python path
sys.path.append(str(Path(__file__).resolve().parent))

from services.tmdb_service import get_weekly_trends, search_movies
from dotenv import load_dotenv

async def main():
    print("--- Backend Test Script ---")
    
    # Check Env
    env_path = Path(__file__).resolve().parent / ".env"
    print(f"Checking .env at: {env_path}")
    if env_path.exists():
        print("[OK] .env file found")
        load_dotenv(env_path)
    else:
        print("[FAIL] .env file NOT found")
        return

    api_key = os.getenv("TMDB_API_KEY")
    if api_key:
        print(f"[OK] API Key loaded: {api_key[:5]}...")
    else:
        print("[FAIL] API Key NOT loaded")
        return

    # Test Trends
    print("\nTesting Weekly Trends...")
    try:
        trends = await get_weekly_trends()
        if trends:
            print(f"[OK] Success! Found {len(trends)} trending movies.")
            print(f"   Sample: {trends[0].get('title', 'Unknown')}")
        else:
            print("[WARN] No trends found (returned empty list).")
    except Exception as e:
        print(f"[FAIL] Error fetching trends: {e}")

    # Test Search
    print("\nTesting Search (Query: 'Matrix')...")
    try:
        results = await search_movies("Matrix")
        if results:
            print(f"[OK] Success! Found {len(results)} movies matching 'Matrix'.")
            print(f"   Sample: {results[0].get('title', 'Unknown')}")
        else:
            print("[WARN] No search results found.")
    except Exception as e:
        print(f"[FAIL] Error searching movies: {e}")

if __name__ == "__main__":
    asyncio.run(main())
