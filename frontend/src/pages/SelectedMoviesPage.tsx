import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { type Movie } from '../types';
import { Button } from '../components/Button';
import { MovieCard } from '../components/MovieCard';

interface SelectedMoviesPageProps {
    selectedMovies: Movie[];
    onToggleSelect: (movie: Movie) => void;
}

export const SelectedMoviesPage = ({ selectedMovies, onToggleSelect }: SelectedMoviesPageProps) => {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Seçimlerim</h1>
                    <p className="text-gray-500 mt-1">
                        {selectedMovies.length} film seçildi. Önerilerini almak için hazır mısın?
                    </p>
                </div>

                {selectedMovies.length > 0 && (
                    <Link to="/recommendations" state={{ selectedMovies }}>
                        <Button size="lg" className="w-full md:w-auto shadow-indigo-200 shadow-lg">
                            Önerileri Göster
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
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
                                onToggleSelect={onToggleSelect}
                            />
                            <div className="absolute top-2 right-2">
                                {/* Override the card button visually if needed, but the card handles it. 
                     Here we might want to make it look more like a delete action clearly?
                     The MovieCard uses toggle logic, so it will show 'Check' if selected.
                     We can let it be, or customize MovieCard to show X if selected?
                     For now standard card behavior is fine.
                 */}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Trash2 size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Listeniz Boş</h3>
                    <p className="text-gray-500 max-w-sm text-center mt-2 mb-6">
                        Henüz hiç film seçmediniz. Ana sayfaya gidip hoşunuza giden filmleri ekleyin.
                    </p>
                    <Link to="/">
                        <Button variant="outline">Filmleri Keşfet</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};
