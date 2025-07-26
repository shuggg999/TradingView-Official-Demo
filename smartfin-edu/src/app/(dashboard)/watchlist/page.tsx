import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watchlist - SmartFin Technology',
  description: 'Track your favorite stocks and securities',
};

export default function WatchlistPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Watchlist</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Watchlist management interface coming soon...</p>
      </div>
    </div>
  );
}