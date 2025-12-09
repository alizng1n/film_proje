import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';
import { type Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Button } from '../components/Button';
import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';

export const RecommendationsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                // Get selected movie IDs mostly likely passed via state or local storage logic
                // For this app, we can check location state or maybe just a global store, 
                // but checking the previous flows, we might need to rely on how data is passed.
                // Looking at AppRoutes, no props are passed to RecommendationsPage.
                // So we will expect the movies to be in location state or we need to fix Route passing.

                // Correction: The AppRoutes definition was: <Route path="/recommendations" element={<RecommendationsPage />} />
                // It doesn't receive props.
                // We should parse the movie IDs from the query string or expect them via navigation state.
                // Let's assume we will pass them via state for now, or use localStorage.
                // BUT, looking at `SelectedMoviesPage`, how does it navigate?
                // We need to check SelectedMoviesPage.tsx to see how it navigates.

                // For now, let's look for state. If not found, show empty.
                const state = location.state as { selectedMovies: Movie[] } | null;
                if (state && state.selectedMovies && state.selectedMovies.length > 0) {
                    const ids = state.selectedMovies.map(m => m.id);
                    const data = await getRecommendations(ids);
                    setRecommendations(data);
                } else {
                    // Fallback or empty
                    setRecommendations([]);
                }
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [location.state]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600 font-medium">Size özel öneriler hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="text-center space-y-4 mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm tracking-wide uppercase">
                    Analiz Tamamlandı
                </span>
                <h1 className="text-4xl font-bold text-gray-900">Sizin İçin Önerilenler</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Seçtiğiniz filmlere dayanarak, bu yapımları da seveceğinizi düşünüyoruz.
                </p>
            </div>

            {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recommendations.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-12">
                    <p>Öneri bulunamadı veya hiç film seçmediniz.</p>
                </div>
            )}

            <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
                <Button variant="outline" onClick={() => window.location.reload()} >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Yenile
                </Button>
                <Button onClick={() => navigate('/')}>
                    <Home className="mr-2 h-4 w-4" />
                    Ana Sayfaya Dön
                </Button>
            </div>
        </div>
    );
};
