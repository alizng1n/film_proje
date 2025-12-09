from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from services.tmdb_service import search_movies, get_recommendations

app = FastAPI()

# CORS
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
            "year": m.get("release_date", "")[:4] if m.get("release_date") else ""
        })
        
    return transformed_results

@app.get("/api/recommendations")
async def recommendations_endpoint(movie_ids: str):
    # Simple logic: get recommendations for the first selected movie for now
    if not movie_ids:
        return []
        
    try:
        ids_list = [int(id_str) for id_str in movie_ids.split(",") if id_str.strip()]
    except ValueError:
        return []
        
    results = await get_recommendations(ids_list)
    
    transformed_results = []
    for m in results:
        poster_path = m.get("poster_path")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else "https://via.placeholder.com/500x750?text=No+Image"
        
        transformed_results.append({
            "id": m.get("id"),
            "title": m.get("title"),
            "poster": poster_url,
            "year": m.get("release_date", "")[:4] if m.get("release_date") else ""
        })

    return transformed_results

