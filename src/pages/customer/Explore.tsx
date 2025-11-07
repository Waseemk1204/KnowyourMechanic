import React, { useEffect, useState } from 'react';
import { Map } from '../../components/Map';
import { GarageCard } from '../../components/GarageCard';
import { VideoCallModal } from '../../components/VideoCallModal';
import { CustomerApprovalModal } from '../../components/CustomerApprovalModal';
import { useJob, Garage } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { SearchIcon, FilterIcon, MapIcon, ListIcon, QrCodeIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { StarIcon, VideoIcon } from 'lucide-react';
export const CustomerExplore: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    garages,
    selectedGarage,
    setSelectedGarage
  } = useJob();
  const [filteredGarages, setFilteredGarages] = useState<Garage[]>(garages);
  const [searchTerm, setSearchTerm] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  // Get unique services from all garages
  const allServices = Array.from(new Set(garages.flatMap(garage => garage.services))).sort();
  // Filter garages based on search term, radius and selected service
  useEffect(() => {
    let filtered = [...garages];
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(garage => garage.name.toLowerCase().includes(term) || garage.address?.toLowerCase().includes(term) || garage.services.some(service => service.toLowerCase().includes(term)));
    }
    // Filter by radius
    filtered = filtered.filter(garage => garage.distance !== undefined && garage.distance <= radiusKm);
    // Filter by selected service
    if (selectedService) {
      filtered = filtered.filter(garage => garage.services.includes(selectedService));
    }
    setFilteredGarages(filtered);
  }, [garages, searchTerm, radiusKm, selectedService]);
  const handleGarageSelect = (garage: Garage) => {
    setSelectedGarage(garage);
  };
  const handleVideoCallClick = (garage: Garage) => {
    setSelectedGarage(garage);
    setIsVideoCallModalOpen(true);
  };
  const handleServiceSelect = (service: string | null) => {
    setSelectedService(service);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Find Garages Near You</h1>
        <button onClick={() => setIsApprovalModalOpen(true)} className="bg-[#F2A900] hover:bg-[#E09800] text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <QrCodeIcon className="h-5 w-5" />
          <span>Scan Questionnaire</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input type="text" placeholder="Search by garage name, address or service..." className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setViewMode('map')} className={`p-2 rounded-md ${viewMode === 'map' ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`} aria-label="Map view">
            <MapIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`} aria-label="List view">
            <ListIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <h2 className="font-medium">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="radius" className="block text-sm font-medium mb-1">
              Distance: {radiusKm} km
            </label>
            <input id="radius" type="range" min="1" max="20" value={radiusKm} onChange={e => setRadiusKm(parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Service Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleServiceSelect(null)} className={`text-xs px-3 py-1 rounded-full ${selectedService === null ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                All
              </button>
              {allServices.map(service => <button key={service} onClick={() => handleServiceSelect(service)} className={`text-xs px-3 py-1 rounded-full ${selectedService === service ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>)}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-4">
        Found {filteredGarages.length} garage
        {filteredGarages.length !== 1 ? 's' : ''} within {radiusKm} km
      </p>

      {/* Map View */}
      {viewMode === 'map' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden shadow-md">
            <Map garages={filteredGarages} selectedGarage={selectedGarage} onGarageSelect={handleGarageSelect} radiusKm={radiusKm} />
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {filteredGarages.length > 0 ? filteredGarages.map(garage => <GarageCardUpdated key={garage.id} garage={garage} isSelected={selectedGarage?.id === garage.id} onSelect={handleGarageSelect} onVideoCallClick={handleVideoCallClick} />) : <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No garages found matching your criteria
                </p>
                <button onClick={() => {
            setSearchTerm('');
            setRadiusKm(10);
            setSelectedService(null);
          }} className="mt-2 text-[#F2A900] hover:underline">
                  Reset filters
                </button>
              </div>}
          </div>
        </div>}

      {/* List View */}
      {viewMode === 'list' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGarages.length > 0 ? filteredGarages.map(garage => <GarageCardUpdated key={garage.id} garage={garage} isSelected={selectedGarage?.id === garage.id} onSelect={handleGarageSelect} onVideoCallClick={handleVideoCallClick} />) : <div className="col-span-full text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No garages found matching your criteria
              </p>
              <button onClick={() => {
          setSearchTerm('');
          setRadiusKm(10);
          setSelectedService(null);
        }} className="mt-2 text-[#F2A900] hover:underline">
                Reset filters
              </button>
            </div>}
        </div>}

      {/* Video Call Modal */}
      <VideoCallModal isOpen={isVideoCallModalOpen} onClose={() => setIsVideoCallModalOpen(false)} garage={selectedGarage} />

      {/* Customer Approval Modal */}
      <CustomerApprovalModal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} customerId={user?.id || ''} />
    </div>;
};
// Updated GarageCard component without questionnaire button
interface GarageCardUpdatedProps {
  garage: Garage;
  isSelected: boolean;
  onSelect: (garage: Garage) => void;
  onVideoCallClick: (garage: Garage) => void;
}
const GarageCardUpdated: React.FC<GarageCardUpdatedProps> = ({
  garage,
  isSelected,
  onSelect,
  onVideoCallClick
}) => {
  const {
    showToast
  } = useToast();
  const handleVideoCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (garage.distance && garage.distance <= 10) {
      onVideoCallClick(garage);
    } else {
      showToast(`Video call is only available for garages within 10km distance.`, 'info');
    }
  };
  const formatServices = (services: string[]) => {
    return services.map(service => service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ');
  };
  return <div className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-[#F2A900] bg-yellow-50 dark:bg-gray-800 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-[#F2A900]'}`} onClick={() => onSelect(garage)}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{garage.name}</h3>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          <StarIcon className="h-4 w-4 text-[#F2A900]" />
          <span className="text-sm font-medium">{garage.rating}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {garage.address}
      </p>
      <div className="mt-3 flex items-center space-x-2">
        <span className="text-xs bg-blue-100 dark:bg-blue-900 dark:text-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {garage.distance?.toFixed(1)} km away
        </span>
        {garage.services.map((service, index) => <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>)}
      </div>
      <p className="text-sm mt-3">
        <span className="font-medium">Services:</span>{' '}
        {formatServices(garage.services)}
      </p>
      <div className="mt-4 flex justify-end">
        <button onClick={handleVideoCallClick} disabled={garage.distance && garage.distance > 10} className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm ${garage.distance && garage.distance <= 10 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700'}`}>
          <VideoIcon className="h-4 w-4" />
          <span>
            {garage.distance && garage.distance <= 10 ? 'Video Call' : 'Too Far'}
          </span>
        </button>
      </div>
    </div>;
};