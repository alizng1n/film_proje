export interface Movie {
    id: number;
    title: string;
    poster: string;
    year?: string;
    vote_average?: number;
}

export interface MovieDetails extends Movie {
    backdrop?: string | null;
    overview?: string;
    runtime?: number;
    vote_average?: number;
    genres?: string[];
    director?: string;
    cast?: string[];
}

export interface SequelGroup {
    title: string;
    movies: Movie[];
}

export interface RecommendationsResponse {
    sequels: SequelGroup[];
    recommendations: Movie[];
}
