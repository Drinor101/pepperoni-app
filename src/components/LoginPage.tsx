import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';
import { authService } from '../services/database';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For now, we'll use the existing mock authentication
      // In production, you'd use: await authService.login(username, password)
      onLogin(username, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src={pepperoniLogo}
            alt="Pepperoni Pizza Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hyr në sistemin e dorëzimeve
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Përdor kredencialet tuaja për të hyrë në panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Përdoruesi
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Shkruani përdoruesin"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Fjalëkalimi
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Shkruani fjalëkalimin"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Duke u kyçur...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Kyçu
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-xs text-gray-600 mb-1">Përdoruesi: <span className="font-mono">admin</span></p>
              <p className="text-xs text-gray-600">Fjalëkalimi: <span className="font-mono">admin</span></p>
              <p className="text-xs text-gray-500 mt-1">Menaxhim i plotë i sistemit</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Staff Panel</h3>
              <p className="text-xs text-gray-600 mb-1">Përdoruesi: <span className="font-mono">staff</span></p>
              <p className="text-xs text-gray-600">Fjalëkalimi: <span className="font-mono">staff</span></p>
              <p className="text-xs text-gray-500 mt-1">Menaxhim i porosive për pikën</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Driver Panel</h3>
              <p className="text-xs text-gray-600 mb-1">Përdoruesi: <span className="font-mono">driver</span></p>
              <p className="text-xs text-gray-600">Fjalëkalimi: <span className="font-mono">driver</span></p>
              <p className="text-xs text-gray-500 mt-1">Menaxhim i dorëzimeve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 