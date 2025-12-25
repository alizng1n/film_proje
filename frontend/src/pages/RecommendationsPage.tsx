import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';
import { type Movie, type MovieDetails, type SequelGroup } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Button } from '../components/Button';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { useState, useEffect } from 'react';
import { getRecommendations, getMovieDetails } from '../services/api';

export const RecommendationsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [sequels, setSequels] = useState<SequelGroup[]>([]);
    const [selectedDetailMovie, setSelectedDetailMovie] = useState<MovieDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMovieClick = async (movie: Movie) => {
        try {
            // First set what we have to show immediate feedback if needed, 
            // but for full details we fetch
            const details = await getMovieDetails(movie.id);
            if (details) {
                setSelectedDetailMovie(details);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const state = location.state as { selectedMovies: Movie[] } | null;
                if (state && state.selectedMovies && state.selectedMovies.length > 0) {
                    const ids = state.selectedMovies.map(m => m.id);
                    const data = await getRecommendations(ids);
                    setRecommendations(data.recommendations);
                    setSequels(data.sequels);
                } else {
                    setRecommendations([]);
                    setSequels([]);
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
        <div className="container mx-auto px-4 py-8 space-y-12 animate-fade-in">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm tracking-wide uppercase">
                    Analiz Tamamlandı
                </span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Film Önerileriniz</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Seçimlerinize göre hazırladığımız özel listeler.
                </p>
            </div>

            {/* Sequels Section */}
            {sequels.length > 0 && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Seçilen yapımların devam filmlerini izlediniz mi?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Seçtiğiniz filmlerin dahil olduğu seriler kronolojik sırayla listelenmiştir.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {sequels.map((group) => (
                            <div key={group.title} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                                    {group.title}
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {group.movies.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onDetailsClick={handleMovieClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Sizin İçin Önerilenler
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Benzer tür ve temadaki diğer yapımlar.
                    </p>
                </div>

                {recommendations.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {recommendations.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onDetailsClick={handleMovieClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <p>Öneri bulunamadı veya hiç film seçmediniz.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" onClick={() => window.location.reload()} >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Yenile
                </Button>
                <Button onClick={() => navigate('/')}>
                    <Home className="mr-2 h-4 w-4" />
                    Ana Sayfaya Dön
                </Button>
            </div>

            <MovieDetailsModal
                movie={selectedDetailMovie}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
