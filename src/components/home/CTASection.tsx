import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-20 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Ready to Get Started?
                </h2>
                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                    Join thousands of car owners who trust us for their vehicle maintenance. Find a mechanic today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/#find-garages"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                    >
                        Find a Garage
                    </Link>
                    <Link
                        to="/auth"
                        className="inline-flex items-center justify-center px-8 py-4 bg-primary-hover text-white font-bold rounded-xl border-2 border-white/20 hover:bg-black/20 transition-colors"
                    >
                        Register Your Garage <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
