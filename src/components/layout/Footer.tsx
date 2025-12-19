import { Link } from 'react-router-dom';
import { Wrench, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <Wrench size={20} />
                            </div>
                            <span className="text-xl font-bold">KnowyourMechanic</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Connect with trusted mechanics and garages for all your vehicle needs. reliable, verified, and convenient.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/auth" className="text-gray-400 hover:text-primary transition-colors">Login / Register</Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Services</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">About Us</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary mt-1" size={20} />
                                <span className="text-gray-400">123 Mechanic Street, Auto City, AC 12345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary" size={20} />
                                <span className="text-gray-400">+1 234 567 8900</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary" size={20} />
                                <span className="text-gray-400">support@knowyourmechanic.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (Optional enhancement or just space filler per original design, I will add a simple text) */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Services</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Car Repair</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Video Consultation</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Part Replacement</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Routine Maintenance</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} KnowyourMechanic. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
