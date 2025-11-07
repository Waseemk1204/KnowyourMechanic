import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Garage } from '../context/JobContext';
import { MapIcon } from 'lucide-react';
// Fix for Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// Workaround for Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
interface MapProps {
  garages: Garage[];
  selectedGarage: Garage | null;
  onGarageSelect: (garage: Garage) => void;
  radiusKm?: number;
}
export const Map: React.FC<MapProps> = ({
  garages,
  selectedGarage,
  onGarageSelect,
  radiusKm = 10
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{
    [key: string]: L.Marker;
  }>({});
  const circleRef = useRef<L.Circle | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // Pune center coordinates
  const puneCenter: [number, number] = [18.5204, 73.8567];
  // Initialize map on component mount
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Create map instance
      const map = L.map(mapContainerRef.current).setView(puneCenter, 12);
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      // Add radius circle
      circleRef.current = L.circle(puneCenter, {
        radius: radiusKm * 1000,
        color: '#F2A900',
        fillColor: '#F2A90033',
        fillOpacity: 0.3
      }).addTo(map);
      // Store map instance
      mapRef.current = map;
      setIsMapLoaded(true);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  // Add garage markers when map is loaded and garages data changes
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};
    // Add new markers for each garage
    garages.forEach(garage => {
      const marker = L.marker([garage.lat, garage.lon]).addTo(mapRef.current!).bindPopup(`
          <div>
            <h3 class="font-bold">${garage.name}</h3>
            <p>${garage.address}</p>
            <p class="text-sm mt-1">Rating: ${garage.rating}/5</p>
          </div>
        `);
      marker.on('click', () => {
        onGarageSelect(garage);
      });
      markersRef.current[garage.id] = marker;
    });
    // Highlight selected garage if any
    if (selectedGarage) {
      const marker = markersRef.current[selectedGarage.id];
      if (marker) {
        marker.openPopup();
        mapRef.current.setView([selectedGarage.lat, selectedGarage.lon], 14);
      }
    }
  }, [isMapLoaded, garages, selectedGarage]);
  // Update circle radius when radiusKm changes
  useEffect(() => {
    if (circleRef.current && mapRef.current) {
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);
  return <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] rounded-lg overflow-hidden z-10" />
      {!isMapLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center">
            <MapIcon className="h-10 w-10 text-gray-400 animate-pulse" />
            <p className="mt-2 text-gray-500">Loading map...</p>
          </div>
        </div>}
    </div>;
};