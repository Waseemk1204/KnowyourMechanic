import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { CustomerExplore } from './pages/customer/Explore';
import { CustomerHistory } from './pages/customer/History';
import { GarageDashboard } from './pages/garage/Dashboard';
import { GarageSettings } from './pages/garage/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';
export function App() {
  return <AuthProvider>
      <JobProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                {/* Customer Routes */}
                <Route path="/customer/explore" element={<ProtectedRoute role="customer">
                      <CustomerExplore />
                    </ProtectedRoute>} />
                <Route path="/customer/history" element={<ProtectedRoute role="customer">
                      <CustomerHistory />
                    </ProtectedRoute>} />
                {/* Garage Routes */}
                <Route path="/garage/dashboard" element={<ProtectedRoute role="garage">
                      <GarageDashboard />
                    </ProtectedRoute>} />
                <Route path="/garage/settings" element={<ProtectedRoute role="garage">
                      <GarageSettings />
                    </ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </ToastProvider>
      </JobProvider>
    </AuthProvider>;
}