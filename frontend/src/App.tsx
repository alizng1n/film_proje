import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/Header';
import { AppRoutes } from './routes/AppRoutes';
import { type Movie } from './types';

function App() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);

  const handleToggleSelect = (movie: Movie) => {
    setSelectedMovies(prev => {
      const isSelected = prev.some(m => m.id === movie.id);
      if (isSelected) {
        return prev.filter(m => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <Header />
        <main className="flex-1 w-full">
          <AppRoutes
            selectedMovies={selectedMovies}
            onToggleSelect={handleToggleSelect}
          />
        </main>

        <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-200 mt-20">
          <p>© 2024 Film Öneri Sistemi. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
