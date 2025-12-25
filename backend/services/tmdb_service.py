import httpx
import os
from dotenv import load_dotenv

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

async def search_movies(query: str):
    if not TMDB_API_KEY:
        return []
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/search/movie",
            params={"api_key": TMDB_API_KEY, "query": query, "language": "tr-TR"}
        )
        return response.json().get("results", [])

async def get_collection_details(client: httpx.AsyncClient, collection_id: int):
    response = await client.get(
        f"{BASE_URL}/collection/{collection_id}",
        params={"api_key": TMDB_API_KEY, "language": "tr-TR"}
    )
    if response.status_code == 200:
        return response.json()
    return None

async def get_movie_sequels(client: httpx.AsyncClient, movie_id: int):
    details = await get_movie_details(client, movie_id)
    if not details:
        return None
        
    collection_info = details.get("belongs_to_collection")
    if not collection_info:
        return None
        
    collection_id = collection_info.get("id")
    collection_details = await get_collection_details(client, collection_id)
    
    if not collection_details:
        return None
        
    parts = collection_details.get("parts", [])
    # Sort by release date
    parts.sort(key=lambda x: x.get("release_date") or "9999-12-31")
    
    # Clean up collection name
    raw_name = collection_details.get("name", "")
    clean_name = raw_name
    
    # Common suffixes to remove (case insensitive)
    suffixes = [
        " Serisi", " Koleksiyonu", " Collection", " Series", 
        " - Seri", " - Koleksiyon", " [Seri]", " [Koleksiyon]"
    ]
    
    for suffix in suffixes:
        if clean_name.lower().endswith(suffix.lower()):
            clean_name = clean_name[:-len(suffix)].strip()
            # Try one more time in case of multiple suffixes or spaces
            break 
            
    # Fallback: if user specifically mentioned brackets like [Seri], handle that content removal if needed
    # But usually TMDB returns "X Serisi". 
    
    return {
        "id": collection_details.get("id"),
        "name": clean_name,
        "parts": parts
    }

async def get_movie_details(client: httpx.AsyncClient, movie_id: int):
    response = await client.get(
        f"{BASE_URL}/movie/{movie_id}",
        params={"api_key": TMDB_API_KEY, "language": "tr-TR"}
    )
    if response.status_code == 200:
        return response.json()
    return None

async def get_movie_recommendations(client: httpx.AsyncClient, movie_id: int):
    """
    Get native recommendations from TMDB for a specific movie.
    """
    response = await client.get(
        f"{BASE_URL}/movie/{movie_id}/recommendations",
        params={"api_key": TMDB_API_KEY, "language": "tr-TR", "page": 1}
    )
    if response.status_code == 200:
        return response.json().get("results", [])
    return []

async def get_recommendations(movie_ids: list[int]):
    if not TMDB_API_KEY or not movie_ids:
        return []

    async with httpx.AsyncClient() as client:
        # Strategy 1: If only one movie, use TMDB's native recommendations
        if len(movie_ids) == 1:
            return await get_movie_recommendations(client, movie_ids[0])

        # Strategy 2: If multiple movies, get recommendations for each and find common ones
        all_recommendations = []
        seen_ids = set(movie_ids) # Don't recommend the movies themselves
        
        # We'll use a dictionary to count how many times a movie is recommended
        # { movie_id: { 'count': int, 'movie': dict } }
        rec_counts = {}

        for mid in movie_ids:
            recs = await get_movie_recommendations(client, mid)
            for rec in recs:
                rid = rec["id"]
                if rid in seen_ids:
                    continue
                
                if rid not in rec_counts:
                    rec_counts[rid] = {'count': 1, 'movie': rec}
                else:
                    rec_counts[rid]['count'] += 1

        # Sort by count (descending) to prioritize common recommendations
        sorted_recs = sorted(
            rec_counts.values(), 
            key=lambda x: x['count'], 
            reverse=True
        )
        
        results = [item['movie'] for item in sorted_recs]

        # Strategy 3: Fallback/Supplement with Genre Discovery if we have too few results
        if len(results) < 5:
             # 1. Get genres for all selected movies
            genre_ids = set()
            for mid in movie_ids:
                details = await get_movie_details(client, mid)
                if details and "genres" in details:
                    for g in details["genres"]:
                        genre_ids.add(str(g["id"]))
            
            if genre_ids:
                joined_genres = "|".join(genre_ids)
                response = await client.get(
                    f"{BASE_URL}/discover/movie",
                    params={
                        "api_key": TMDB_API_KEY, 
                        "language": "tr-TR",
                        "sort_by": "popularity.desc",
                        "with_genres": joined_genres,
                        "page": 1
                    }
                )
                genre_results = response.json().get("results", [])
                
                # Append genre results that aren't already in the list
                existing_ids = set(r['id'] for r in results) | seen_ids
                for m in genre_results:
                    if m['id'] not in existing_ids:
                        results.append(m)

        return results

async def get_recommendations_with_sequels(movie_ids: list[int]):
    """
    Fetches both sequels (if any) and regular recommendations.
    Returns:
    {
        "sequels": [ { "title": "X Collection", "movies": [...] } ],
        "recommendations": [...]
    }
    """
    if not TMDB_API_KEY or not movie_ids:
        return {"sequels": [], "recommendations": []}

    async with httpx.AsyncClient() as client:
        # 1. Fetch sequels for each movie
        sequels_list = []
        seen_collection_ids = set()
        
        for mid in movie_ids:
            sequel_data = await get_movie_sequels(client, mid)
            if sequel_data:
                cid = sequel_data["id"]
                if cid not in seen_collection_ids:
                    seen_collection_ids.add(cid)
                    sequels_list.append({
                        "id": cid,
                        "title": sequel_data["name"],
                        "movies": sequel_data["parts"]
                    })
        
        # 2. Get regular recommendations (reusing existing logic)
        # We can call the existing function, but we need to pass a client or refactor.
        # Since get_recommendations creates its own client, we'll just call it.
        # Optimization: Refactor get_recommendations to accept an optional client? 
        # For now, calling it directly is fine, it just creates another connection.
        
        recommendations = await get_recommendations(movie_ids)
        
        # Filter out movies that are already in sequels
        sequel_movie_ids = set()
        for group in sequels_list:
            for m in group["movies"]:
                sequel_movie_ids.add(m["id"])
                
        filtered_recommendations = [
            m for m in recommendations 
            if m["id"] not in sequel_movie_ids
        ]
        
        return {
            "sequels": sequels_list,
            "recommendations": filtered_recommendations
        }

async def get_movie_credits(client: httpx.AsyncClient, movie_id: int):
    response = await client.get(
        f"{BASE_URL}/movie/{movie_id}/credits",
        params={"api_key": TMDB_API_KEY, "language": "tr-TR"}
    )
    if response.status_code == 200:
        return response.json()
    return None

async def get_full_movie_details(movie_id: int):
    if not TMDB_API_KEY:
        return None

    # Use a single client for concurrent requests if needed, but sequential is fine for a single detail view
    async with httpx.AsyncClient() as client:
        details_resp = await get_movie_details(client, movie_id)
        credits_resp = await get_movie_credits(client, movie_id)

        if not details_resp:
            return None

        # Process data
        director = "Bilinmiyor"
        cast = []
        
        if credits_resp:
            # Find director
            crew = credits_resp.get("crew", [])
            directors = [member["name"] for member in crew if member.get("job") == "Director"]
            if directors:
                director = ", ".join(directors)
            
            # Get top 5 cast
            cast_members = credits_resp.get("cast", [])
            cast = [member["name"] for member in cast_members[:5]]

        return {
            "id": details_resp.get("id"),
            "title": details_resp.get("title"),
            "poster_path": details_resp.get("poster_path"),
            "backdrop_path": details_resp.get("backdrop_path"),
            "overview": details_resp.get("overview"),
            "release_date": details_resp.get("release_date"),
            "runtime": details_resp.get("runtime"), # in minutes
            "vote_average": details_resp.get("vote_average"),
            "genres": [g["name"] for g in details_resp.get("genres", [])],
            "director": director,
            "cast": cast
        }

async def get_weekly_trends():
    if not TMDB_API_KEY:
        return []

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/trending/movie/week",
            params={"api_key": TMDB_API_KEY, "language": "tr-TR"}
        )
        if response.status_code == 200:
            return response.json().get("results", [])
        return []
