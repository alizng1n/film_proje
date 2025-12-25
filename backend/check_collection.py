import asyncio
import os
import sys
from pathlib import Path
import httpx

# Add project root to python path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.tmdb_service import get_movie_details

async def check_collection():
    print("--- Checking Avatar (19995) ---")
    async with httpx.AsyncClient() as client:
        details = await get_movie_details(client, 19995)
        if details:
            print(f"Title: {details.get('title')}")
            collection = details.get("belongs_to_collection")
            print(f"Collection: {collection}")
            
            if collection:
                collection_id = collection.get("id")
                print(f"Collection ID: {collection_id}")
        else:
            print("Failed to get details.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_collection())
