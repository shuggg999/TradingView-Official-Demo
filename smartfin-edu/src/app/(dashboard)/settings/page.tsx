import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - SmartFin Technology',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Account settings interface coming soon...</p>
      </div>
    </div>
  );
}