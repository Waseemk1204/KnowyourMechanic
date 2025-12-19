import { useState } from 'react';
import { Camera } from 'lucide-react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const services = ['Brakes', 'Oil Change', 'Engine', 'Suspension', 'Electronics', 'Tires', 'Wheel Alignment', 'Batteries', 'Air Conditioning', 'Transmission', 'Diagnostics'];

export default function GarageSettings() {
    const [closedDays, setClosedDays] = useState<string[]>(['Sunday']);

    const toggleDay = (day: string) => {
        if (closedDays.includes(day)) {
            setClosedDays(closedDays.filter(d => d !== day));
        } else {
            setClosedDays([...closedDays, day]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Garage Settings</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Profile Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Garage Name</label>
                                    <input type="text" defaultValue="Shiv Auto Care" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" defaultValue="waseemk1204@gmail.com" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="text" defaultValue="+91-9876543210" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input type="text" placeholder="Enter your full address" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary bg-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Garage Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your garage services, specialties, etc."
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Garage Photo */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <Camera size={20} />
                                <h2 className="text-lg font-bold text-gray-900">Garage Photo</h2>
                            </div>
                            <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center relative group overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=300"
                                    alt="Garage"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button className="absolute bottom-4 left-4 right-4 py-2 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white transition-colors">
                                    <Camera size={16} />
                                    Change Photo
                                </button>
                            </div>
                            <p className="mt-3 text-xs text-blue-600 text-center bg-blue-50 py-2 rounded-lg">
                                A good garage photo helps build trust with customers.
                            </p>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-100" />

                    {/* Services Offered */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Services Offered</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {services.map((service) => (
                                <label key={service} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer sr-only" defaultChecked={['Brakes', 'Oil Change', 'Engine'].includes(service)} />
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="text-gray-700 group-hover:text-gray-900">{service}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h2 className="text-lg font-bold text-gray-900">Working Hours</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {days.map((day) => (
                                <div key={day} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                                    <span className="font-medium text-gray-700">{day}</span>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
                                        <input
                                            type="checkbox"
                                            checked={closedDays.includes(day)}
                                            onChange={() => toggleDay(day)}
                                            className="accent-red-500 rounded"
                                        />
                                        <span className={closedDays.includes(day) ? "text-red-500 font-medium" : ""}>Closed</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
