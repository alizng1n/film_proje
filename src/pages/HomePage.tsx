import { useState } from 'react';
import { Search } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { type Movie } from '../types';

// Dummy Data
const MOCK_MOVIES: Movie[] = [
    { id: 1, title: 'Inception', year: '2010', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500' },
    { id: 2, title: 'Interstellar', year: '2014', poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=500' },
    { id: 3, title: 'The Dark Knight', year: '2008', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=500' },
    { id: 4, title: 'Avatar', year: '2009', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500' },
    { id: 5, title: 'Dune', year: '2021', poster: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=500' },
    { id: 6, title: 'Blade Runner 2049', year: '2017', poster: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=500' },
    { id: 7, title: 'The Matrix', year: '1999', poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500' },
    { id: 8, title: 'Arrival', year: '2016', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=500' },
];

interface HomePageProps {
    selectedMovies: Movie[];
    onToggleSelect: (movie: Movie) => void;
}

export const HomePage = ({ selectedMovies, onToggleSelect }: HomePageProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMovies = MOCK_MOVIES.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            placeholder="Film ara..."
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
                    <h2 className="text-2xl font-bold text-gray-800">Popüler Filmler</h2>
                    <span className="text-sm text-gray-500">{filteredMovies.length} film bulundu</span>
                </div>

                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMovies.map((movie) => {
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
                        <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun film bulunamadı.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
