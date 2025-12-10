import { Link, useLocation } from 'react-router-dom';
import { Film, CheckCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Header = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
                        <Film size={24} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        FilmÖneri
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link to="/">
                            <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/')
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}>
                                Ana Sayfa
                            </span>
                        </Link>
                        <Link to="/selected">
                            <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/selected')
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}>
                                <CheckCircle size={18} />
                                Seçimlerim
                            </span>
                        </Link>
                    </nav>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Karanlık Modu Değiştir"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};
