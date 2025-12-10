export interface Movie {
    id: number;
    title: string;
    poster: string;
    year?: string;
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

