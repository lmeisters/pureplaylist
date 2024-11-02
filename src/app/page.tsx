"use client";

import { useSession } from "next-auth/react";
import PlaylistManager from "@/components/PlaylistManager";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import FooterSection from "@/components/sections/FooterSection";

function HomeContent() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="h-screen overflow-hidden">
                <PlaylistManager />
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-auto">
                <HeroSection />
                <AboutSection />
                <HowItWorksSection />
                <FeaturesSection />
                <FAQSection />
                <CTASection />
                <FooterSection />
            </div>
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
