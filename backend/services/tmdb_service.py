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
