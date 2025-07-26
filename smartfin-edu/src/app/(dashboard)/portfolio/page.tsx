import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - SmartFin Technology',
  description: 'Manage your investment portfolio',
};

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Portfolio</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Portfolio management interface coming soon...</p>
      </div>
    </div>
  );
}