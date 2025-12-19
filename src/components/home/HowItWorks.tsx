import { Search, Video, CalendarCheck } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "Search Nearby",
        description: "Find verified garages and mechanics in your local area based on ratings and services."
    },
    {
        icon: Video,
        title: "Video Consultation",
        description: "Connect with mechanics via video call to diagnose issues before you visit."
    },
    {
        icon: CalendarCheck,
        title: "Book Service",
        description: "Schedule your appointment online and track the status of your repair."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get your car fixed in three simple steps. We make car maintenance hassle-free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 mx-auto">
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
