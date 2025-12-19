import { useState, useEffect } from 'react';
import { Filter, Loader2, Building2, CheckCircle } from 'lucide-react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import clsx from 'clsx';
import * as api from '../../services/api';

interface Service {
    _id: string;
    garageId: {
        _id: string;
        name: string;
        garageName: string;
        address: string;
    };
    description: string;
    amount: number;
    status: string;
    completedAt?: string;
}

const tabs = ['All', 'Verified', 'Reported'];

export default function MyServices() {
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await api.getMyServices();
                setServices(response.services);
            } catch (error) {
                console.error('Failed to load services:', error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    const filteredServices = services.filter(s => {
        if (activeTab === 'Verified') return s.status === 'completed';
        if (activeTab === 'Reported') return s.status === 'reported';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
                    <p className="text-gray-500">Services you've received from verified garages</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <Filter size={16} className="text-gray-500" />
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                                activeTab === tab ? "bg-primary text-white" : "bg-white border text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Service List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredServices.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
                                <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="font-medium">No services yet</p>
                                <p className="text-sm">Services from garages will appear here</p>
                            </div>
                        )}

                        {filteredServices.map(service => (
                            <div key={service._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {service.garageId?.garageName || service.garageId?.name || 'Unknown Garage'}
                                        </h3>
                                        <p className="text-sm text-gray-500">{service.garageId?.address || ''}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">₹{service.amount}</p>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                            <CheckCircle size={12} /> Verified
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-3">{service.description}</p>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">
                                        {service.completedAt && new Date(service.completedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <button className="text-sm text-red-500 hover:text-red-700">
                                        Report Issue
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
