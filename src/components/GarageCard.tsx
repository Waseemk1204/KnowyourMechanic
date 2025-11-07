import React from 'react';
import { Garage } from '../context/JobContext';
import { StarIcon, PhoneIcon, VideoIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';
interface GarageCardProps {
  garage: Garage;
  isSelected: boolean;
  onSelect: (garage: Garage) => void;
  onQuestionnaireClick: (garage: Garage) => void;
  onVideoCallClick: (garage: Garage) => void;
}
export const GarageCard: React.FC<GarageCardProps> = ({
  garage,
  isSelected,
  onSelect,
  onQuestionnaireClick,
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
  const handleQuestionnaireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuestionnaireClick(garage);
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
      <div className="mt-4 flex space-x-2 justify-between">
        <button onClick={handleVideoCallClick} disabled={garage.distance && garage.distance > 10} className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm ${garage.distance && garage.distance <= 10 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700'}`}>
          <VideoIcon className="h-4 w-4" />
          <span>
            {garage.distance && garage.distance <= 10 ? 'Video Call' : 'Too Far'}
          </span>
        </button>
        <button onClick={handleQuestionnaireClick} className="flex items-center space-x-1 bg-[#F2A900] hover:bg-[#E09800] text-white px-3 py-1.5 rounded text-sm">
          <span>Send Questionnaire</span>
        </button>
      </div>
    </div>;
};