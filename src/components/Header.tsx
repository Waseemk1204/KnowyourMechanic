import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MenuIcon, XIcon, UserIcon, HistoryIcon, MapIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
export const Header: React.FC = () => {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 text-[#F2A900]" />
          <span className="text-xl font-bold">KnowyourMechanic</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? <>
              {user?.role === 'customer' ? <>
                  <Link to="/customer/explore" className={`text-gray-600 dark:text-gray-300 hover:text-[#F2A900] ${location.pathname === '/customer/explore' ? 'text-[#F2A900] font-medium' : ''}`}>
                    Find Garages
                  </Link>
                  <Link to="/customer/history" className={`text-gray-600 dark:text-gray-300 hover:text-[#F2A900] ${location.pathname === '/customer/history' ? 'text-[#F2A900] font-medium' : ''}`}>
                    My Bookings
                  </Link>
                </> : <>
                  <Link to="/garage/dashboard" className={`text-gray-600 dark:text-gray-300 hover:text-[#F2A900] ${location.pathname === '/garage/dashboard' ? 'text-[#F2A900] font-medium' : ''}`}>
                    Dashboard
                  </Link>
                  <Link to="/garage/settings" className={`text-gray-600 dark:text-gray-300 hover:text-[#F2A900] ${location.pathname === '/garage/settings' ? 'text-[#F2A900] font-medium' : ''}`}>
                    Settings
                  </Link>
                </>}
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <UserIcon className="h-5 w-5" />
                <span>{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#F2A900]">
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </> : <>
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#F2A900]">
                Home
              </Link>
              <Link to="/auth" className="bg-[#F2A900] text-white px-4 py-2 rounded-md hover:bg-[#E09800] transition">
                Login / Register
              </Link>
            </>}
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 dark:text-gray-300" onClick={toggleMenu} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg absolute top-full left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {isAuthenticated ? <>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-3">
                  <UserIcon className="h-5 w-5" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                {user?.role === 'customer' ? <>
                    <Link to="/customer/explore" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#F2A900] py-2" onClick={closeMenu}>
                      <MapIcon className="h-5 w-5" />
                      <span>Find Garages</span>
                    </Link>
                    <Link to="/customer/history" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#F2A900] py-2" onClick={closeMenu}>
                      <HistoryIcon className="h-5 w-5" />
                      <span>My Bookings</span>
                    </Link>
                  </> : <>
                    <Link to="/garage/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#F2A900] py-2" onClick={closeMenu}>
                      <div className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/garage/settings" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#F2A900] py-2" onClick={closeMenu}>
                      <SettingsIcon className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </>}
                <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#F2A900] py-2 border-t dark:border-gray-700 mt-2 pt-2">
                  <LogOutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </> : <>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#F2A900] py-2" onClick={closeMenu}>
                  Home
                </Link>
                <Link to="/auth" className="bg-[#F2A900] text-white px-4 py-2 rounded-md hover:bg-[#E09800] transition text-center mt-2" onClick={closeMenu}>
                  Login / Register
                </Link>
              </>}
          </div>
        </div>}
    </header>;
};