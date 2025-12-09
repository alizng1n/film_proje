import httpx
import os
from dotenv import load_dotenv

load_dotenv()

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

async def get_movie_details(client: httpx.AsyncClient, movie_id: int):
    response = await client.get(
        f"{BASE_URL}/movie/{movie_id}",
        params={"api_key": TMDB_API_KEY, "language": "tr-TR"}
    )
    if response.status_code == 200:
        return response.json()
    return None

async def get_recommendations(movie_ids: list[int]):
    if not TMDB_API_KEY or not movie_ids:
        return []

    async with httpx.AsyncClient() as client:
        # 1. Get genres for all selected movies
        genre_ids = set()
        for mid in movie_ids:
            details = await get_movie_details(client, mid)
            if details and "genres" in details:
                for g in details["genres"]:
                    genre_ids.add(str(g["id"]))
        
        if not genre_ids:
            return []

        # 2. Discover movies with these genres
        # Using pipe (|) for OR logic (matches any of the genres)
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
        data = response.json()
        
        # Filter out the selected movies themselves
        results = data.get("results", [])
        return [m for m in results if m["id"] not in movie_ids]
