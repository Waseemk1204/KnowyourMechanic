import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Star, List, Map as MapIcon, Building2, Loader2 } from 'lucide-react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import clsx from 'clsx';
import * as api from '../../services/api';

// Leaflet icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

interface Garage {
    _id: string;
    name: string;
    garageName: string;
    address: string;
    servicesOffered: string[];
    totalServices: number;
    rating: number;
    location?: { lat: number; lng: number };
}

export default function FindGarages() {
    const [garages, setGarages] = useState<Garage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

    useEffect(() => {
        const loadGarages = async () => {
            try {
                const response = await api.listGarages();
                setGarages(response.garages);
            } catch (error) {
                console.error('Failed to load garages:', error);
            } finally {
                setLoading(false);
            }
        };

        loadGarages();
    }, []);

    const filteredGarages = garages.filter(g =>
        g.garageName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Find Verified Garages</h1>
                    <p className="text-gray-500">Browse garages with verified service records</p>
                </div>

                {/* Search & View Toggle */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or location..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary shadow-sm"
                        />
                    </div>
                    <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={clsx("p-2 rounded-lg", viewMode === 'list' ? "bg-primary text-white" : "text-gray-500")}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={clsx("p-2 rounded-lg", viewMode === 'map' ? "bg-primary text-white" : "text-gray-500")}
                        >
                            <MapIcon size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-4 font-medium">{filteredGarages.length} verified garages</p>

                        {viewMode === 'list' ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredGarages.length === 0 && (
                                    <div className="col-span-full p-12 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
                                        <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="font-medium">No garages found</p>
                                    </div>
                                )}

                                {filteredGarages.map(garage => (
                                    <div key={garage._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{garage.garageName || garage.name}</h3>
                                                <p className="text-sm text-gray-500">{garage.address || 'Location not set'}</p>
                                            </div>
                                            {garage.rating > 0 && (
                                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                                                    <Star size={14} fill="currentColor" />
                                                    {garage.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                {garage.totalServices} verified services
                                            </span>
                                        </div>

                                        {garage.servicesOffered && garage.servicesOffered.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {garage.servicesOffered.slice(0, 3).map(s => (
                                                    <span key={s} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                        {s}
                                                    </span>
                                                ))}
                                                {garage.servicesOffered.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                        +{garage.servicesOffered.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <button className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors">
                                            View Portfolio
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Circle center={[18.5204, 73.8567]} radius={5000} pathOptions={{ color: '#F2A900', fillOpacity: 0.1 }} />
                                    {filteredGarages.filter(g => g.location?.lat).map(garage => (
                                        <Marker key={garage._id} position={[garage.location!.lat, garage.location!.lng]}>
                                            <Popup>
                                                <div className="p-1">
                                                    <h3 className="font-bold">{garage.garageName}</h3>
                                                    <p className="text-xs text-gray-600">{garage.totalServices} verified services</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
