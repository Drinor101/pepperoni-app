import React, { useState } from 'react';
import { User, Lock, ArrowLeft } from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onLogin(formData.username, formData.password);
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src={pepperoniLogo}
            alt="Pepperoni Pizza Logo" 
            className="h-12 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hyr në sistemin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zgjidh rolin tuaj për të hyrë në panelin përkatës
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Shkruaj përdoruesin"
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
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Shkruaj fjalëkalimin"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Duke hyrë...' : 'Hyr'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Kredencialet demo</span>
              </div>
            </div>

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

          <div className="mt-6">
            <button
              onClick={onBack}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kthehu në faqen kryesore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 