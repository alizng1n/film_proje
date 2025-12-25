import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/Header';
import { AppRoutes } from './routes/AppRoutes';
import { type Movie } from './types';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>(() => {
    // Initialize from local storage
    const saved = localStorage.getItem('selectedMovies');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
  }, [selectedMovies]);

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

  const handleClearSelection = () => {
    setSelectedMovies([]);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Header />
          <main className="flex-1 w-full">
            <AppRoutes
              selectedMovies={selectedMovies}
              onToggleSelect={handleToggleSelect}
              onClearSelection={handleClearSelection}
            />
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
