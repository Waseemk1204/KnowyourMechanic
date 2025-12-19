import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import clsx from 'clsx';

export default function DashboardNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isGarage = user?.role === 'garage';

    const navLinks = isGarage
        ? [
            { path: '/garage/dashboard', label: 'Dashboard' },
            { path: '/garage/settings', label: 'Settings' },
        ]
        : [
            { path: '/customer/find-garages', label: 'Find Garages' },
            { path: '/customer/services', label: 'My Services' },
        ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-gray-900">
                        KnowyourMechanic
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    "text-sm font-medium transition-colors",
                                    location.pathname === link.path ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700">
                                <UserIcon size={18} />
                                <span className="text-sm font-medium">
                                    {isGarage ? (user?.garageName || user?.name) : user?.name || `+91 ${user?.phone?.slice(-4)}`}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={clsx(
                                    "block py-3 text-sm font-medium",
                                    location.pathname === link.path ? 'text-primary' : 'text-gray-600'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full mt-4 py-3 text-left text-sm text-red-600 font-medium border-t border-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
