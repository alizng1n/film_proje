import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';
import { type Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Button } from '../components/Button';
import { useState, useEffect } from 'react';

// Mock Recommendations not in the original list to seem "new"
const RECOMMENDATIONS: Movie[] = [
    { id: 101, title: 'The Prestige', year: '2006', poster: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=500' },
    { id: 102, title: 'Memento', year: '2000', poster: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=500' },
    { id: 103, title: 'Source Code', year: '2011', poster: 'https://images.unsplash.com/photo-1550100136-e074fa9d6bfd?auto=format&fit=crop&q=80&w=500' },
    { id: 104, title: 'Looper', year: '2012', poster: 'https://images.unsplash.com/photo-1533230678601-5e8cd6555125?auto=format&fit=crop&q=80&w=500' },
];

export const RecommendationsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Fake loading effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600 font-medium">Size özel öneriler hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="text-center space-y-4 mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm tracking-wide uppercase">
                    Analiz Tamamlandı
                </span>
                <h1 className="text-4xl font-bold text-gray-900">Sizin İçin Önerilenler</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Seçtiğiniz filmlere dayanarak, bu yapımları da seveceğinizi düşünüyoruz.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {RECOMMENDATIONS.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
                <Button variant="outline" onClick={() => window.location.reload()} >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Farklı Öneriler
                </Button>
                <Button onClick={() => navigate('/')}>
                    <Home className="mr-2 h-4 w-4" />
                    Ana Sayfaya Dön
                </Button>
            </div>
        </div>
    );
};
