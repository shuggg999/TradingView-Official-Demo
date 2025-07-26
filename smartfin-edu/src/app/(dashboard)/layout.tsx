import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - SmartFin Technology',
  description: 'Your personal financial dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard layout will include sidebar navigation */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            <nav className="mt-6 space-y-2">
              <a href="/portfolio" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Portfolio
              </a>
              <a href="/watchlist" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Watchlist
              </a>
              <a href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Settings
              </a>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}