import { Button } from '../components/Button';
import { MovieCard } from '../components/MovieCard';
import { type Movie } from '../types';

export const UITestPage = () => {
    const sampleMovie: Movie = {
        id: 999,
        title: 'Example Movie Title That Is Quite Long to Test Wrap',
        year: '2024',
        poster: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=500'
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-8">UI Component Test Page</h1>

                <section className="space-y-6 mb-12">
                    <h2 className="text-xl font-semibold border-b pb-2">Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="primary">Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="outline">Outline Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Movie Cards</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <MovieCard movie={sampleMovie} />
                        <MovieCard movie={sampleMovie} isSelected={true} onToggleSelect={() => console.log('click')} />
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-semibold border-b pb-2">Typography & Colors</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h1 className="text-4xl text-gray-900 font-bold">Heading 1</h1>
                        <h2 className="text-3xl text-gray-800 font-bold">Heading 2</h2>
                        <h3 className="text-2xl text-gray-700 font-semibold">Heading 3</h3>
                        <p className="text-gray-600">Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-indigo-600 rounded-lg shadow-lg"></div>
                            <div className="w-16 h-16 bg-violet-600 rounded-lg shadow-lg"></div>
                            <div className="w-16 h-16 bg-pink-500 rounded-lg shadow-lg"></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
