import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { type Movie, type MovieDetails } from '../types';
import { Button } from '../components/Button';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { useState } from 'react';
import { getMovieDetails } from '../services/api';

interface SelectedMoviesPageProps {
    selectedMovies: Movie[];
    onToggleSelect: (movie: Movie) => void;
    onClearSelection: () => void;
}

export const SelectedMoviesPage = ({ selectedMovies, onToggleSelect, onClearSelection }: SelectedMoviesPageProps) => {
    const [selectedDetailMovie, setSelectedDetailMovie] = useState<MovieDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDetailsClick = async (movie: Movie) => {
        const details = await getMovieDetails(movie.id);
        if (details) {
            setSelectedDetailMovie(details);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seçimlerim</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {selectedMovies.length} film seçildi. Önerilerini almak için hazır mısın?
                    </p>
                </div>

                {selectedMovies.length > 0 && (
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClearSelection} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-2 h-5 w-5" />
                            Tümünü Temizle
                        </Button>
                        <Link to="/recommendations" state={{ selectedMovies }}>
                            <Button size="lg" className="w-full md:w-auto shadow-indigo-200 shadow-lg">
                                Önerileri Göster
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {selectedMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {selectedMovies.map((movie) => (
                        <div key={movie.id} className="relative group">
                            <MovieCard
                                movie={movie}
                                isSelected={true}
                                // onToggleSelect passed as removing logic
                                // onToggleSelect passed as removing logic
                                onToggleSelect={onToggleSelect}
                                onDetailsClick={handleDetailsClick}
                            />
                            <div className="absolute top-2 right-2">
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-sm mb-4">
                        <Trash2 size={48} className="text-gray-300 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Listeniz Boş</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mt-2 mb-6">
                        Henüz hiç film seçmediniz. Ana sayfaya gidip hoşunuza giden filmleri ekleyin.
                    </p>
                    <Link to="/">
                        <Button variant="outline">Filmleri Keşfet</Button>
                    </Link>
                </div>
            )}
            <MovieDetailsModal
                movie={selectedDetailMovie}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
