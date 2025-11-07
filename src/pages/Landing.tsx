import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map } from '../components/Map';
import { useJob } from '../context/JobContext';
import { GarageCard } from '../components/GarageCard';
import { CheckCircleIcon, ShieldCheckIcon, ClockIcon, CarIcon } from 'lucide-react';
export const Landing: React.FC = () => {
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    garages,
    setSelectedGarage
  } = useJob();
  const navigate = useNavigate();
  const featuredGarages = garages.slice(0, 3);
  const handleGarageSelect = (garage: any) => {
    setSelectedGarage(garage);
    if (isAuthenticated && user?.role === 'customer') {
      navigate('/customer/explore');
    }
  };
  const handleQuestionnaireClick = () => {
    if (isAuthenticated && user?.role === 'customer') {
      navigate('/customer/explore');
    } else {
      navigate('/auth');
    }
  };
  const handleVideoCallClick = () => {
    if (isAuthenticated && user?.role === 'customer') {
      navigate('/customer/explore');
    } else {
      navigate('/auth');
    }
  };
  return <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1632823471565-1fa0e49e1e6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" alt="Car Repair Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Connect with Verified Garages in Pune
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Find reliable garages, get instant quotes, and book repairs with
              confidence.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to={isAuthenticated && user?.role === 'customer' ? '/customer/explore' : '/auth'} className="bg-[#F2A900] hover:bg-[#E09800] text-white px-6 py-3 rounded-md text-center font-medium">
                Find a Garage
              </Link>
              <Link to={isAuthenticated && user?.role === 'garage' ? '/garage/dashboard' : '/auth?role=garage'} className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md text-center font-medium">
                Register Your Garage
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <CarIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Garage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse verified garages near you on our interactive map or list
                view.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Submit Questionnaire
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fill a simple questionnaire describing your issue and the
                estimated cost.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Service</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pay securely, get your vehicle serviced, and leave a review
                after completion.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Map Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Find Garages in Pune
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our network of verified garages across Pune. Filter by
            distance, services, and ratings to find the perfect match for your
            vehicle needs.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px] rounded-lg overflow-hidden shadow-md">
              <Map garages={garages} selectedGarage={null} onGarageSelect={handleGarageSelect} />
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
              {featuredGarages.map(garage => <GarageCard key={garage.id} garage={garage} isSelected={false} onSelect={handleGarageSelect} onQuestionnaireClick={handleQuestionnaireClick} onVideoCallClick={handleVideoCallClick} />)}
              <Link to={isAuthenticated && user?.role === 'customer' ? '/customer/explore' : '/auth'} className="block text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-3 rounded-md text-gray-600 dark:text-gray-300 font-medium">
                View All Garages
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Garages</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All garages on our platform are thoroughly vetted and verified.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Integrated payment gateway ensures your transactions are secure.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Video Consultations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get expert advice through video calls before visiting the
                garage.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All reviews are from verified customers who completed service.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-16 bg-[#F2A900] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found reliable garage
            services through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={isAuthenticated && user?.role === 'customer' ? '/customer/explore' : '/auth'} className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium">
              Find a Garage
            </Link>
            <Link to={isAuthenticated && user?.role === 'garage' ? '/garage/dashboard' : '/auth?role=garage'} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Register Your Garage
            </Link>
          </div>
        </div>
      </section>
    </div>;
};