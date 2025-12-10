import { useRef, useEffect, useState } from 'react';
import { type Movie } from '../types';

interface FeaturedCarouselProps {
    movies: Movie[];
    onMovieClick: (movie: Movie) => void;
}

export const FeaturedCarousel = ({ movies, onMovieClick }: FeaturedCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        let scrollPos = 0;
        const speed = 0.5; // Pixels per frame

        const animate = () => {
            if (!isPaused && scrollContainer) {
                scrollPos += speed;

                // Reset when we've scrolled past the first set of items
                // (We will duplicate items to create infinite effect)
                if (scrollPos >= scrollContainer.scrollWidth / 2) {
                    scrollPos = 0;
                }

                scrollContainer.scrollLeft = scrollPos;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, movies]);

    if (movies.length === 0) return null;

    // Duplicate movies to create seamless infinite scroll
    const displayMovies = [...movies, ...movies];

    return (
        <div className="w-full overflow-hidden py-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">🔥</span> Haftanın Trendleri
                </h2>
            </div>

            <div
                className="relative w-full"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-hidden whitespace-nowrap px-4 pb-4"
                    style={{ scrollBehavior: 'auto' }} // Disable smooth scroll for JS animation
                >
                    {displayMovies.map((movie, index) => (
                        <div
                            key={`${movie.id}-${index}`}
                            className="inline-block w-48 shrink-0 cursor-pointer transform transition-transform hover:scale-105"
                            onClick={() => onMovieClick(movie)}
                        >
                            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-lg mb-2 relative group">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                        İncele
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {movie.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {movie.year}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Fade edges */}
                <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};
