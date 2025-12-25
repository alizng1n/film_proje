import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { SelectedMoviesPage } from '../pages/SelectedMoviesPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';

import { type Movie } from '../types';

interface AppRoutesProps {
    selectedMovies: Movie[];
    onToggleSelect: (movie: Movie) => void;
    onClearSelection: () => void;
}

export const AppRoutes = ({ selectedMovies, onToggleSelect, onClearSelection }: AppRoutesProps) => {
    return (
        <Routes>
            <Route
                path="/"
                element={<HomePage selectedMovies={selectedMovies} onToggleSelect={onToggleSelect} />}
            />
            <Route
                path="/selected"
                element={<SelectedMoviesPage selectedMovies={selectedMovies} onToggleSelect={onToggleSelect} onClearSelection={onClearSelection} />}
            />
            <Route path="/recommendations" element={<RecommendationsPage />} />
        </Routes>
    );
};
