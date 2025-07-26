export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">SmartFin</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* User menu will be implemented here */}
            <button className="text-gray-500 hover:text-gray-700">
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}