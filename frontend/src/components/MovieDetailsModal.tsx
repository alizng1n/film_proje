import { X, Clock, Star, Calendar, User, Users } from 'lucide-react';
import { type MovieDetails } from '../types';
import { useEffect, useRef } from 'react';

interface MovieDetailsModalProps {
    movie: MovieDetails | null;
    isOpen: boolean;
    onClose: () => void;
}

export const MovieDetailsModal = ({ movie, isOpen, onClose }: MovieDetailsModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen || !movie) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Poster & Key Info */}
                <div className="w-full md:w-2/5 relative">
                    <div className="aspect-[2/3] w-full bg-gray-100 dark:bg-gray-700">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{movie.title}</h2>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {movie.year && (
                                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    <Calendar size={16} />
                                    {movie.year}
                                </span>
                            )}
                            {movie.runtime && (
                                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    <Clock size={16} />
                                    {movie.runtime} dk
                                </span>
                            )}
                            {movie.vote_average && (
                                <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded font-medium">
                                    <Star size={16} className="fill-amber-500 text-amber-500" />
                                    {movie.vote_average.toFixed(1)}/10
                                </span>
                            )}
                        </div>

                        {movie.genres && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genres.map((genre) => (
                                    <span key={genre} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Özet</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {movie.overview || "Bu film için özet bilgisi bulunmuyor."}
                            </p>
                        </div>

                        {movie.director && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <User size={20} className="text-gray-500 dark:text-gray-300" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Yönetmen</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{movie.director}</p>
                                </div>
                            </div>
                        )}

                        {movie.cast && movie.cast.length > 0 && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Users size={20} className="text-gray-500 dark:text-gray-300" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Oyuncular</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{movie.cast.join(", ")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
