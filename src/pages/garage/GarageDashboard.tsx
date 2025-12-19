import { useState, useEffect } from 'react';
import { Plus, Filter, FileText, CheckCircle, Clock, IndianRupee, Loader2 } from 'lucide-react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import AddServiceModal from '../../components/garage/AddServiceModal';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

interface Stats {
    totalServices: number;
    totalEarnings: number;
    pendingCount: number;
    rating: number;
}

interface Service {
    _id: string;
    customerPhone: string;
    description: string;
    amount: number;
    status: string;
    completedAt?: string;
    createdAt: string;
}

const tabs = ['All', 'Completed', 'Pending'];

export default function GarageDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('All');
    const [showAddService, setShowAddService] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({ totalServices: 0, totalEarnings: 0, pendingCount: 0, rating: 0 });
    const [completedServices, setCompletedServices] = useState<Service[]>([]);
    const [pendingServices, setPendingServices] = useState<Service[]>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, portfolioRes, pendingRes] = await Promise.all([
                api.getGarageStats(),
                api.getPortfolio(),
                api.getPendingServices()
            ]);

            setStats(statsRes.stats);
            setCompletedServices(portfolioRes.services);
            setPendingServices(pendingRes.services);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const allServices = [...pendingServices, ...completedServices];
    const filteredServices = activeTab === 'All'
        ? allServices
        : activeTab === 'Completed'
            ? completedServices
            : pendingServices;

    const statCards = [
        { label: 'Total Services', value: stats.totalServices.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Earnings', value: `₹${stats.totalEarnings}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending', value: stats.pendingCount.toString(), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Rating', value: stats.rating ? stats.rating.toFixed(1) : 'New', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.garageName || user?.name}</h1>
                        <p className="text-gray-500">Manage your services and build your portfolio</p>
                    </div>
                    <button
                        onClick={() => setShowAddService(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={20} />
                        Add Service
                    </button>
                </div>

                {/* Stats */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {statCards.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                        <div className="space-y-3">
                            {filteredServices.length === 0 && (
                                <div className="p-12 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
                                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="font-medium">No services yet</p>
                                    <p className="text-sm">Click "Add Service" to record your first verified service</p>
                                </div>
                            )}

                            {filteredServices.map(service => (
                                <div key={service._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm text-gray-500">+91 {service.customerPhone}</p>
                                            <p className="font-medium text-gray-900">{service.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">₹{service.amount}</p>
                                            <span className={clsx(
                                                "inline-block px-2 py-0.5 text-xs font-medium rounded-full",
                                                service.status === 'completed' ? "bg-green-100 text-green-700" :
                                                    service.status === 'pending_payment' ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-gray-100 text-gray-700"
                                            )}>
                                                {service.status === 'completed' ? 'Verified' :
                                                    service.status === 'pending_payment' ? 'Awaiting Payment' :
                                                        service.status === 'pending_otp' ? 'Awaiting OTP' : service.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {service.completedAt
                                            ? new Date(service.completedAt).toLocaleDateString()
                                            : new Date(service.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {showAddService && (
                <AddServiceModal
                    onClose={() => setShowAddService(false)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
}
