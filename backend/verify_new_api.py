import asyncio
import os
import sys
import httpx

# Add project root to python path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.tmdb_service import get_recommendations_with_sequels

async def test_api_logic():
    print("--- Test: Matrix (603) + Inception (27205) ---")
    data = await get_recommendations_with_sequels([603, 27205])
    
    print(f"Sequels Groups: {len(data['sequels'])}")
    for group in data['sequels']:
        print(f"Collection: {group['title']}")
        for m in group['movies']:
            print(f"  - {m['title']} ({m.get('release_date')})")
            
    print(f"\nRecommendations: {len(data['recommendations'])}")
    if data['recommendations']:
        print(f"First Rec: {data['recommendations'][0]['title']}")

    if not data['sequels']:
        print("\nERROR: Expected Matrix collection to be found.")
    else:
        print("\nSUCCESS: API logic seems correct.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_api_logic())
