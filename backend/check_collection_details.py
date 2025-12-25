import asyncio
import os
import sys
from pathlib import Path
import httpx

# Add project root to python path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.tmdb_service import TMDB_API_KEY, BASE_URL

async def check_collection_details(collection_id):
    print(f"--- Checking Collection Details ({collection_id}) ---")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/collection/{collection_id}",
            params={"api_key": TMDB_API_KEY, "language": "tr-TR"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"Name: {data.get('name')}")
            parts = data.get("parts", [])
            print(f"Parts Found: {len(parts)}")
            for part in parts:
                print(f"- {part.get('title')} ({part.get('release_date')})")
        else:
            print(f"Failed to get collection details. Status: {response.status_code}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_collection_details(87096))
