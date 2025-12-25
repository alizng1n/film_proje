import { useRef, useEffect, useState } from 'react';
import { type Movie } from '../types';
import { Plus, Check } from 'lucide-react';

interface FeaturedCarouselProps {
    movies: Movie[];
    selectedMovies?: Movie[];
    onToggleSelect?: (movie: Movie) => void;
    onMovieClick: (movie: Movie) => void;
    paused?: boolean;
}

export const FeaturedCarousel = ({ movies, selectedMovies = [], onToggleSelect, onMovieClick, paused = false }: FeaturedCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const isDragRef = useRef(false);

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        const speed = 0.5;

        const animate = () => {
            // Stop if externally paused, hovered, or dragging
            if (!paused && !isHovered && !isDragging && scrollContainer) {
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += speed;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [paused, isHovered, isDragging, movies]);

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        isDragRef.current = false;
        if (scrollRef.current) {
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsHovered(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Don't reset isDragRef here, we need it for the click event which fires after
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast

        // Only mark as drag if moved more than 5 pixels
        if (Math.abs(x - startX) > 5) {
            isDragRef.current = true;
        }

        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (movies.length === 0) return null;

    // Duplicate movies to create seamless infinite scroll
    const displayMovies = [...movies, ...movies];

    return (
        <div className="w-full overflow-hidden py-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-700 select-none">
            <div className="container mx-auto px-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">🔥</span> Haftanın Trendleri
                </h2>
            </div>

            <div
                className="relative w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={scrollRef}
                    className={`flex gap-6 overflow-x-hidden whitespace-nowrap px-4 pb-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ scrollBehavior: 'auto' }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {displayMovies.map((movie, index) => {
                        const isSelected = selectedMovies.some(m => m.id === movie.id);
                        return (
                            <div
                                key={`${movie.id}-${index}`}
                                className="inline-block w-48 shrink-0 cursor-pointer transform transition-transform hover:scale-105"
                                onClick={(e) => {
                                    if (isDragRef.current) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
                                    onMovieClick(movie);
                                }}
                            >
                                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-lg mb-2 relative group">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-full object-cover pointer-events-none"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                            İncele
                                        </span>
                                    </div>

                                    {/* Selection Button */}
                                    {onToggleSelect && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleSelect(movie);
                                            }}
                                            className={`absolute top-2 right-2 p-2 rounded-full shadow-md z-10 transition-all duration-200 transform hover:scale-110 ${isSelected
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white/90 text-gray-700 hover:bg-indigo-600 hover:text-white'
                                                } opacity-0 group-hover:opacity-100`}
                                        >
                                            {isSelected ? <Check size={16} /> : <Plus size={16} />}
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {movie.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {movie.year}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Fade edges */}
                <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};
