from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from services.tmdb_service import search_movies, get_recommendations, get_full_movie_details

app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Movie Recommendation API is running"}

@app.get("/api/movies/search")
async def search_movies_endpoint(query: str):
    results = await search_movies(query)
    # Transform to match frontend Movie type if needed, but TMDB returns similar fields.
    # TMDB returns: id, title, poster_path, release_date
    # Frontend expects: id, title, poster, year
    
    transformed_results = []
    for m in results:
        poster_path = m.get("poster_path")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else "https://via.placeholder.com/500x750?text=No+Image"
        
        transformed_results.append({
            "id": m.get("id"),
            "title": m.get("title"),
            "poster": poster_url,
            "year": m.get("release_date", "")[:4] if m.get("release_date") else "",
            "vote_average": m.get("vote_average", 0)
        })
        
    return transformed_results

@app.get("/api/recommendations")
async def recommendations_endpoint(movie_ids: str):
    from services.tmdb_service import get_recommendations_with_sequels
    
    if not movie_ids:
        return {"sequels": [], "recommendations": []}
        
    try:
        ids_list = [int(id_str) for id_str in movie_ids.split(",") if id_str.strip()]
    except ValueError:
        return {"sequels": [], "recommendations": []}
        
    data = await get_recommendations_with_sequels(ids_list)
    
    # Helper to transform movie data
    def transform_movie(m):
        poster_path = m.get("poster_path")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else "https://via.placeholder.com/500x750?text=No+Image"
        return {
            "id": m.get("id"),
            "title": m.get("title"),
            "poster": poster_url,
            "year": m.get("release_date", "")[:4] if m.get("release_date") else "",
            "vote_average": m.get("vote_average", 0)
        }

    # Transform recommendations
    transformed_recs = [transform_movie(m) for m in data["recommendations"]]
    
    # Transform sequels
    transformed_sequels = []
    for seq_group in data["sequels"]:
        transformed_sequels.append({
            "title": seq_group["title"],
            "movies": [transform_movie(m) for m in seq_group["movies"]]
        })

    return {
        "sequels": transformed_sequels,
        "recommendations": transformed_recs
    }

@app.get("/api/movies/trends")
async def get_weekly_trends_endpoint():
    from services.tmdb_service import get_weekly_trends
    results = await get_weekly_trends()
    
    transformed_results = []
    for m in results:
        poster_path = m.get("poster_path")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else "https://via.placeholder.com/500x750?text=No+Image"
        
        transformed_results.append({
            "id": m.get("id"),
            "title": m.get("title"),
            "poster": poster_url,
            "year": m.get("release_date", "")[:4] if m.get("release_date") else "",
            "vote_average": m.get("vote_average", 0)
        })
        
    return transformed_results

@app.get("/api/movies/{movie_id}")
async def get_movie_details_endpoint(movie_id: int):
    details = await get_full_movie_details(movie_id)
    if not details:
        return {"error": "Movie not found"}
    
    # Transform for frontend consistency if needed
    poster_path = details.get("poster_path")
    poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else "https://via.placeholder.com/500x750?text=No+Image"
    
    backdrop_path = details.get("backdrop_path")
    backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None

    return {
        **details,
        "poster": poster_url,
        "backdrop": backdrop_url,
        "year": details.get("release_date", "")[:4] if details.get("release_date") else "",
        "vote_average": details.get("vote_average", 0)
    }

