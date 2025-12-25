import { Plus, Check, Star } from 'lucide-react';
import { type Movie } from '../types';
import { Button } from './Button';

interface MovieCardProps {
    movie: Movie;
    isSelected?: boolean;
    onToggleSelect?: (movie: Movie) => void;
    onDetailsClick?: (movie: Movie) => void;
}

export const MovieCard = ({ movie, isSelected, onToggleSelect, onDetailsClick }: MovieCardProps) => {
    return (
        <div className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            {/* Poster Image */}
            <div className="aspect-[2/3] w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Right Action Button */}
                {onToggleSelect && (
                    <button
                        onClick={() => onToggleSelect(movie)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-110 ${isSelected
                            ? 'bg-green-500 text-white shadow-green-500/30'
                            : 'bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500'
                            }`}
                    >
                        {isSelected ? <Check size={20} /> : <Plus size={20} />}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={movie.title}>
                        {movie.title}
                    </h3>
                    <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-900/30">
                        <Star size={12} className="mr-1 fill-current" />
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{movie.year || '2023'}</p>

                {/* Card Footer action */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs px-2 h-8 w-full font-medium text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => onDetailsClick?.(movie)}
                    >
                        Detayları İncele
                    </Button>
                </div>
            </div>
        </div>
    );
};
