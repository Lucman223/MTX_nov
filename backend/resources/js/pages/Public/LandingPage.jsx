import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';

// New Landing Components
import MotoHero from '../../components/Landing/MotoHero';
import BenefitsGrid from '../../components/Landing/BenefitsGrid';
import HowItWorksSteps from '../../components/Landing/HowItWorksSteps';
import RoadmapSection from '../../components/Landing/RoadmapSection';
import DriverBanner from '../../components/Landing/DriverBanner';

// Expanded Content Components
import StatsBar from '../../components/Landing/StatsBar';
import SafetyProtocol from '../../components/Landing/SafetyProtocol';
import ForfaitsModern from '../../components/Landing/ForfaitsModern';
import Testimonials from '../../components/Landing/Testimonials';
import FAQSection from '../../components/Landing/FAQSection';
import ModernContact from '../../components/Landing/ModernContact';

/**
 * LandingPage Component
 * Rebuilt to focus on passenger transport with a modern, high-conversion structure.
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);

    // Consolidated system colors
    const colors = {
        primary: '#2563eb',
        secondary: '#059669',
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
            <SEO
                title={t('seo.landing_title') || "MotoTX - Tu viaje seguro en Bamako"}
                description={t('seo.landing_desc') || "La forma más rápida y segura de moverte por Bamako."}
            />

            {/* Modern Transparent Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                }`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <img src="/logo_clean.png" alt="MotoTX Logo" className="h-10 w-10 object-contain transition-transform group-hover:rotate-12" />
                        <span className="text-2xl font-black tracking-tighter text-blue-600">MotoTX</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            {t('common.login')}
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <MotoHero colors={colors} />
                <StatsBar />
                <BenefitsGrid />
                <HowItWorksSteps />
                <SafetyProtocol />
                <ForfaitsModern />
                <Testimonials />
                <RoadmapSection />
                <DriverBanner />
                <FAQSection />
                <ModernContact />
            </main>

            {/* Basic Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img src="/logo_clean.png" alt="MotoTX" className="h-8 w-8 grayscale opacity-50" />
                            <span className="text-lg font-bold text-gray-400">MotoTX</span>
                        </div>

                        <div className="flex gap-8 text-sm font-medium text-gray-500">
                            <a href="/privacy" className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px]">Privacidad</a>
                            <a href="/terms" className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px]">Términos</a>
                            <a href="/contact" className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px]">Soporte</a>
                        </div>

                        <p className="text-gray-400 text-xs">
                            © {new Date().getFullYear()} MotoTX. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
