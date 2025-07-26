import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - SmartFin Technology',
  description: 'Reset your SmartFin account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
        </div>
        {/* Password reset form will be implemented here */}
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-600">Password reset form coming soon...</p>
        </div>
      </div>
    </div>
  );
}