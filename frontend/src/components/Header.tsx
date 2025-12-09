import { Link, useLocation } from 'react-router-dom';
import { Film, CheckCircle } from 'lucide-react';

export const Header = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
                        <Film size={24} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        FilmÖneri
                    </span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2">
                    <Link to="/">
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/')
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}>
                            Ana Sayfa
                        </span>
                    </Link>
                    <Link to="/selected">
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/selected')
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}>
                            <CheckCircle size={18} />
                            Seçimlerim
                        </span>
                    </Link>

                </nav>
            </div>
        </header>
    );
};
