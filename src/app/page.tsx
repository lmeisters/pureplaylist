"use client";

import { useSession } from "next-auth/react";
import PlaylistManager from "@/components/PlaylistManager";
import HeroSection from "@/components/sections/HeroSection";

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
        <div className="min-h-screen overflow-auto">
            <HeroSection />
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
