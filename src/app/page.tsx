"use client";

import { useSession, signIn } from "next-auth/react";
import PlaylistManager from "@/components/PlaylistManager";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import Image from "next/image";

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
            <div className="flex flex-col">
                {/* Hero Section */}
                <section className="flex items-center justify-center bg-gradient-to-b from-background to-secondary min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
                                Organize Your Spotify Playlists with Ease
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10">
                                PurePlaylist helps you sort, filter, and manage
                                your Spotify playlists effortlessly. Take
                                control of your music library today.
                            </p>

                            <Button size="lg" onClick={() => signIn("spotify")}>
                                <Music className="mr-2 h-5 w-5" />
                                Get Started with Spotify
                            </Button>
                        </div>

                        <div className="md:w-1/2">
                            <div className="relative w-full aspect-video max-w-[1920px] max-h-[1080px] rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src="/app-screenshot.png"
                                    alt="PurePlaylist App Screenshot"
                                    width={1920}
                                    height={1080}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
