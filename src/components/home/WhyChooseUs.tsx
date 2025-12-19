import { ShieldCheck, CreditCard, Video, ThumbsUp } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Mechanics",
        description: "Every mechanic and garage is vetted and verified to ensure top-quality service."
    },
    {
        icon: CreditCard,
        title: "Secure Payments",
        description: "Pay securely online with protection guarantees for all booked services."
    },
    {
        icon: Video,
        title: "Remote Diagnostics",
        description: "Save time with initial video consultations before driving to a garage."
    },
    {
        icon: ThumbsUp,
        title: "Verified Reviews",
        description: "Read real reviews from confirmed customers to make informed decisions."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We are revolutionizing the way you maintain your vehicle. quality, trust, and convenience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-primary transition-colors">
                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-6">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
