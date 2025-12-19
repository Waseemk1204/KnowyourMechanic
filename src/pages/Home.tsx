import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import GarageMap from '../components/home/GarageMap';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CTASection from '../components/home/CTASection';

export default function Home() {
    return (
        <main>
            <Hero />
            <HowItWorks />
            <GarageMap />
            <WhyChooseUs />
            <CTASection />
        </main>
    );
}
