import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Video, ClipboardList, Star, MapPin } from 'lucide-react';

// Fix for default Leaflet markers in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const garages = [
    {
        id: 1,
        name: "AutoFix Premium Garage",
        rating: 4.8,
        reviews: 124,
        address: "123 Main St, Downtown",
        distance: "0.8 miles",
        lat: 51.505,
        lng: -0.09,
        image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 2,
        name: "QuickStop Mechanics",
        rating: 4.5,
        reviews: 89,
        address: "456 Oak Avenue, Westside",
        distance: "1.2 miles",
        lat: 51.515,
        lng: -0.1,
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 3,
        name: "Reliable Motors",
        rating: 4.9,
        reviews: 215,
        address: "789 Pine Rd, North Hills",
        distance: "2.5 miles",
        lat: 51.51,
        lng: -0.08,
        image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 4,
        name: "City Center Auto",
        rating: 4.6,
        reviews: 67,
        address: "321 Market St, City Center",
        distance: "3.1 miles",
        lat: 51.52,
        lng: -0.095,
        image: "https://images.unsplash.com/photo-1632823471565-1ec2a1ad4015?auto=format&fit=crop&q=80&w=300"
    }
];

export default function GarageMap() {
    return (
        <section id="find-garages" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Garages Nearby</h2>
                    <p className="text-gray-600">Discover top-rated mechanics in your area.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    {/* List View */}
                    <div className="lg:col-span-1 bg-white overflow-y-auto custom-scrollbar border-r border-gray-100 p-4 space-y-4">
                        {garages.map((garage) => (
                            <div key={garage.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                                <div className="flex gap-4 mb-3">
                                    <img src={garage.image} alt={garage.name} className="w-20 h-20 object-cover rounded-lg" />
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{garage.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-medium">{garage.rating}</span>
                                            <span className="text-gray-400 font-normal">({garage.reviews})</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <MapPin size={14} />
                                            <span>{garage.distance}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <button className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                                        <Video size={16} />
                                        Video Call
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors">
                                        <ClipboardList size={16} />
                                        Quote
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map View */}
                    <div className="lg:col-span-2 relative z-0">
                        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {garages.map((garage) => (
                                <Marker key={garage.id} position={[garage.lat, garage.lng]}>
                                    <Popup>
                                        <div className="p-1">
                                            <h3 className="font-bold text-sm">{garage.name}</h3>
                                            <p className="text-xs text-gray-600">{garage.address}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={12} className="text-yellow-500" fill="currentColor" />
                                                <span className="text-xs font-bold">{garage.rating}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}
