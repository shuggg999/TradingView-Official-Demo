import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - SmartFin Technology',
  description: 'Sign in to your SmartFin account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {/* Login form will be implemented here */}
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-600">Login form coming soon...</p>
        </div>
      </div>
    </div>
  );
}