import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { isAuthenticated, user } = useAuth();

    // If authenticated, we link to the dashboard instead of login
    const dashboardLink = user?.role === 'garage' ? '/garage/dashboard' : '/customer/find-garages';

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Wrench size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">KnowyourMechanic</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Home
                        </Link>

                        {isAuthenticated ? (
                            <Link
                                to={dashboardLink}
                                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
