import { Plus, Check, Star } from 'lucide-react';
import { type Movie } from '../types';
import { Button } from './Button';

interface MovieCardProps {
    movie: Movie;
    isSelected?: boolean;
    onToggleSelect?: (movie: Movie) => void;
}

export const MovieCard = ({ movie, isSelected, onToggleSelect }: MovieCardProps) => {
    return (
        <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            {/* Poster Image */}
            <div className="aspect-[2/3] w-full bg-gray-100 relative overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Right Action Button */}
                {onToggleSelect && (
                    <button
                        onClick={() => onToggleSelect(movie)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-110 ${isSelected
                            ? 'bg-green-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-indigo-600 hover:text-white'
                            }`}
                    >
                        {isSelected ? <Check size={20} /> : <Plus size={20} />}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2" title={movie.title}>
                        {movie.title}
                    </h3>
                    <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Star size={12} className="mr-1 fill-current" />
                        {(Math.random() * 2 + 7).toFixed(1)}
                    </span>
                </div>
                <p className="text-sm text-gray-500">{movie.year || '2023'}</p>

                {/* Card Footer action for mobile or additional interaction */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <Button size="sm" variant="ghost" className="text-xs px-2 h-7 w-full">
                        Detaylar
                    </Button>
                </div>
            </div>
        </div>
    );
};
