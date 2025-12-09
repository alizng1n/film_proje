import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { type Movie } from '../types';
import { searchMovies } from '../services/api';

interface HomePageProps {
    selectedMovies: Movie[];
    onToggleSelect: (movie: Movie) => void;
}

export const HomePage = ({ selectedMovies, onToggleSelect }: HomePageProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            if (searchTerm.length > 2) {
                setLoading(true);
                const results = await searchMovies(searchTerm);
                setMovies(results);
                setLoading(false);
            } else {
                setMovies([]);
            }
        };

        const timeoutId = setTimeout(fetchMovies, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero / Search Section */}
            <section className="relative py-20 px-4 text-center bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 mt-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Favori Filmlerini Keşfet
                    </h1>
                    <p className="text-lg text-gray-200">
                        Binlerce film arasından seçim yap ve sana özel önerileri yakala.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Film ara... (En az 3 karakter)"
                            className="block w-full pl-10 pr-3 py-4 border-none rounded-xl leading-5 bg-white/10 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 sm:text-lg transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Movie Grid */}
            <section className="container mx-auto px-4 pb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {searchTerm.length > 2 ? 'Arama Sonuçları' : 'Aramaya Başlayın'}
                    </h2>
                    <span className="text-sm text-gray-500">{movies.length} film bulundu</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {movies.map((movie) => {
                            const isSelected = selectedMovies.some(m => m.id === movie.id);
                            return (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    isSelected={isSelected}
                                    onToggleSelect={onToggleSelect}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">
                            {searchTerm.length > 2 ? 'Aradığınız kriterlere uygun film bulunamadı.' : 'Film aramak için yukarıya en az 3 harf yazın.'}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};
