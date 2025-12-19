import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import GarageDashboard from './pages/garage/GarageDashboard';
import GarageSettings from './pages/garage/GarageSettings';
import MyServices from './pages/customer/MyServices';
import FindGarages from './pages/customer/FindGarages';
import { useAuth } from './context/AuthContext';

// Protected Route wrapper
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'customer' | 'garage' }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'garage' ? '/garage/dashboard' : '/customer/find-garages'} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <div className="min-h-screen flex flex-col font-sans text-gray-900">
          <Navbar />
          <div className="flex-grow">
            <Home />
          </div>
          <Footer />
        </div>
      } />

      <Route path="/auth" element={<Auth />} />

      {/* Garage Routes */}
      <Route path="/garage/dashboard" element={
        <ProtectedRoute requiredRole="garage">
          <GarageDashboard />
        </ProtectedRoute>
      } />
      <Route path="/garage/settings" element={
        <ProtectedRoute requiredRole="garage">
          <GarageSettings />
        </ProtectedRoute>
      } />

      {/* Customer Routes */}
      <Route path="/customer/services" element={
        <ProtectedRoute requiredRole="customer">
          <MyServices />
        </ProtectedRoute>
      } />
      <Route path="/customer/find-garages" element={
        <ProtectedRoute requiredRole="customer">
          <FindGarages />
        </ProtectedRoute>
      } />

      {/* Legacy redirect */}
      <Route path="/customer/bookings" element={<Navigate to="/customer/services" replace />} />
    </Routes>
  );
}

export default App;
