import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SaveIcon, CameraIcon, ClockIcon, UserIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
export const GarageSettings: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    showToast
  } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    description: '',
    services: {
      brakes: true,
      'oil-change': true,
      engine: false,
      suspension: false,
      electronics: false,
      tires: false,
      'wheel-alignment': false,
      batteries: false,
      'air-conditioning': false,
      transmission: false,
      diagnostics: false
    },
    workingHours: {
      monday: {
        open: '09:00',
        close: '18:00',
        closed: false
      },
      tuesday: {
        open: '09:00',
        close: '18:00',
        closed: false
      },
      wednesday: {
        open: '09:00',
        close: '18:00',
        closed: false
      },
      thursday: {
        open: '09:00',
        close: '18:00',
        closed: false
      },
      friday: {
        open: '09:00',
        close: '18:00',
        closed: false
      },
      saturday: {
        open: '10:00',
        close: '16:00',
        closed: false
      },
      sunday: {
        open: '10:00',
        close: '14:00',
        closed: true
      }
    }
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service as keyof typeof prev.services]
      }
    }));
  };
  const handleWorkingHourChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the garage profile
    showToast('Profile updated successfully!', 'success');
  };
  const handleImageUpload = () => {
    showToast('Image upload feature coming soon!', 'info');
  };
  return <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Garage Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-[#F2A900]" />
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Garage Name
                    </label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter your full address" />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Garage Description
                  </label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Describe your garage services, specialties, etc." />
                </div>
              </div>
              {/* Garage Photo */}
              <div>
                <h2 className="text-xl font-semibold flex items-center mb-4">
                  <CameraIcon className="h-5 w-5 mr-2 text-[#F2A900]" />
                  Garage Photo
                </h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <div className="mb-4">
                    <img src="https://images.unsplash.com/photo-1632823471565-1fa0e49e1e6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Garage" className="w-full h-40 object-cover rounded-md" />
                  </div>
                  <button type="button" onClick={handleImageUpload} className="flex items-center justify-center space-x-2 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 rounded-md">
                    <CameraIcon className="h-5 w-5" />
                    <span>Change Photo</span>
                  </button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-md text-sm text-blue-800 dark:text-blue-200">
                  <p>A good garage photo helps build trust with customers.</p>
                </div>
              </div>
            </div>
            {/* Services */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <div className="h-5 w-5 mr-2 text-[#F2A900]" />
                Services Offered
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(formData.services).map(([service, isChecked]) => <div key={service} className="flex items-center">
                      <input id={`service-${service}`} type="checkbox" checked={isChecked} onChange={() => handleServiceToggle(service)} className="h-4 w-4 text-[#F2A900] border-gray-300 rounded focus:ring-[#F2A900]" />
                      <label htmlFor={`service-${service}`} className="ml-2 text-sm">
                        {service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                    </div>)}
              </div>
            </div>
            {/* Working Hours */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <ClockIcon className="h-5 w-5 mr-2 text-[#F2A900]" />
                Working Hours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(formData.workingHours).map(([day, hours]) => <div key={day} className="border rounded-md p-3 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{day}</span>
                      <div className="flex items-center">
                        <input id={`closed-${day}`} type="checkbox" checked={hours.closed} onChange={e => handleWorkingHourChange(day, 'closed', e.target.checked)} className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500" />
                        <label htmlFor={`closed-${day}`} className="ml-2 text-sm text-red-500">
                          Closed
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor={`open-${day}`} className="block text-xs mb-1">
                          Open
                        </label>
                        <input id={`open-${day}`} type="time" value={hours.open} onChange={e => handleWorkingHourChange(day, 'open', e.target.value)} disabled={hours.closed} className="w-full px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50" />
                      </div>
                      <div>
                        <label htmlFor={`close-${day}`} className="block text-xs mb-1">
                          Close
                        </label>
                        <input id={`close-${day}`} type="time" value={hours.close} onChange={e => handleWorkingHourChange(day, 'close', e.target.value)} disabled={hours.closed} className="w-full px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50" />
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Location */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <MapPinIcon className="h-5 w-5 mr-2 text-[#F2A900]" />
                Location
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 h-60 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Map feature coming soon
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Set your exact location on the map to help customers find you
                easily.
              </p>
            </div>
            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button type="submit" className="bg-[#F2A900] hover:bg-[#E09800] text-white px-6 py-2 rounded-md flex items-center space-x-2">
                <SaveIcon className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};