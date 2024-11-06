"use client";

import { useSession } from "next-auth/react";
import PlaylistManager from "@/components/features/playlist/PlaylistManager";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import FooterSection from "@/components/sections/FooterSection";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <ScrollArea className="h-full landing-scrollbar">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <FAQSection />
                <CTASection />
                <FooterSection />
            </ScrollArea>
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
