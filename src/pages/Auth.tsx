import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { UserIcon, LoaderIcon } from 'lucide-react';
export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    register,
    isAuthenticated,
    user
  } = useAuth();
  // Check URL params for role
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'garage') {
      setRole('garage');
    }
  }, [location]);
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'customer') {
        navigate('/customer/explore');
      } else if (user?.role === 'garage') {
        navigate('/garage/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password, role);
      } else {
        if (!name) {
          throw new Error('Name is required');
        }
        await register(name, email, password, role);
      }
      // Redirect based on role
      if (role === 'customer') {
        navigate('/customer/explore');
      } else {
        navigate('/garage/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  const handleContinueAsGuest = () => {
    navigate('/');
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 text-[#F2A900]" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">
              {isLogin ? 'Login to KnowyourMechanic' : 'Create an Account'}
            </h1>
            {/* Role Selector */}
            <div className="flex mb-6 border rounded-md overflow-hidden">
              <button className={`flex-1 py-3 flex justify-center items-center space-x-2 ${role === 'customer' ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`} onClick={() => setRole('customer')}>
                <UserIcon className="h-5 w-5" />
                <span>Customer</span>
              </button>
              <button className={`flex-1 py-3 flex justify-center items-center space-x-2 ${role === 'garage' ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`} onClick={() => setRole('garage')}>
                <div className="h-5 w-5" />
                <span>Garage</span>
              </button>
            </div>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>}
            <form onSubmit={handleSubmit}>
              {!isLogin && <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    {role === 'garage' ? 'Garage Name' : 'Full Name'}
                  </label>
                  <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={role === 'garage' ? 'Enter garage name' : 'Enter your name'} required />
                </div>}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter your email" required />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter your password" required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#F2A900] hover:bg-[#E09800] text-white py-2 rounded-md font-medium flex justify-center items-center">
                {isLoading ? <LoaderIcon className="h-5 w-5 animate-spin" /> : isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-[#F2A900] hover:underline">
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <button onClick={handleContinueAsGuest} className="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};