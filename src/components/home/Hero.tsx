import { Link } from 'react-router-dom';
import { Search, Store } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="mb-12 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Find Trusted <span className="text-primary">Mechanics</span> & Garages Near You
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg">
                            Book video consultations, get quotes, and find the best rated garages in your area. Simple, transparent, and reliable.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/#find-garages"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors gap-2"
                            >
                                <Search size={20} />
                                Find a Garage
                            </Link>
                            <Link
                                to="/auth?role=garage"
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors gap-2"
                            >
                                <Store size={20} />
                                Register Your Garage
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Decorative blob or shape could go here */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&q=80&w=1600"
                                alt="Mechanic working on car"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                        </div>
                        {/* Floating badge example */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <Store size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Verified Garages</p>
                                    <p className="text-lg font-bold text-gray-900">500+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
