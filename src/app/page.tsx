"use client";

import { useSession, signIn } from "next-auth/react";
import PlaylistManager from "@/components/PlaylistManager";
import { Button } from "@/components/ui/button";
import { Music, Shield, Star, ArrowRight } from "lucide-react";
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
                <section className="flex items-center justify-center bg-gradient-to-b from-background to-secondary py-16">
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

                {/* Features Section */}
                <section className="flex items-center bg-background py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Key Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Music className="h-8 w-8" />}
                                title="Smart Playlist Management"
                                description="Easily organize and sort your playlists with intuitive tools."
                            />
                            <FeatureCard
                                icon={<Shield className="h-8 w-8" />}
                                title="Secure Integration"
                                description="Safely connect with Spotify using industry-standard authentication."
                            />
                            <FeatureCard
                                icon={<Star className="h-8 w-8" />}
                                title="Personalized Experience"
                                description="Get tailored recommendations based on your listening habits."
                            />
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="flex items-center bg-primary text-primary-foreground py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            Ready to Enhance Your Music Experience?
                        </h2>
                        <p className="text-xl mb-8">
                            Join thousands of users who have transformed their
                            playlist management.
                        </p>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => signIn("spotify")}
                        >
                            Get Started Now{" "}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
            <div className="mb-4 text-primary">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
