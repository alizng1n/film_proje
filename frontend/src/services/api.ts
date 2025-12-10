import axios from 'axios';
import type { Movie, MovieDetails } from '../types';

const API_Base_URL = 'http://localhost:8000/api';

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    try {
        const response = await axios.get(`${API_Base_URL}/movies/search`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
};

export const getRecommendations = async (selectedMovieIds: number[]): Promise<Movie[]> => {
    if (selectedMovieIds.length === 0) return [];
    try {
        const response = await axios.get(`${API_Base_URL}/recommendations`, {
            params: { movie_ids: selectedMovieIds.join(',') }
        });
        return response.data;
    } catch (error) {
        console.error("Recommendation error:", error);
        return [];
    }
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
    try {
        const response = await axios.get(`${API_Base_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("Movie details error:", error);
        return null;
    }
};

export const getWeeklyTrends = async (): Promise<Movie[]> => {
    try {
        const response = await axios.get(`${API_Base_URL}/movies/trends`);
        return response.data;
    } catch (error) {
        console.error("Trends error:", error);
        return [];
    }
};

