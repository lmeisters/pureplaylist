import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Music } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { AnimatedElement } from "@/components/ui/animated-element";

function HeroSection() {
    return (
        <Section
            variant="default"
            allowOverflow
            className="pt-32 sm:pt-36"
            id="hero"
        >
            <div className="flex flex-col items-center text-center">
                <AnimatedElement
                    index={0}
                    className="inline-flex items-center rounded-full border px-4 py-1.5 mb-8 bg-background"
                >
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium">
                        Version 1.0 is now live
                    </span>
                </AnimatedElement>

                <AnimatedElement
                    as="h1"
                    index={1}
                    className="text-4xl font-bold tracking-tight sm:text-6xl mb-4"
                >
                    Curating Spotify Playlists with Precision
                </AnimatedElement>

                <AnimatedElement
                    as="p"
                    index={2}
                    className="text-xl text-muted-foreground mb-6"
                >
                    Developed by Linards M., this app showcases advanced
                    filtering, responsive design, and seamless integration with
                    the Spotify API.
                </AnimatedElement>

                <AnimatedElement
                    index={3}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Button size="lg" onClick={() => signIn("spotify")}>
                        <Music className="mr-2 h-5 w-5" />
                        Sign in with Spotify
                    </Button>
                    <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => {
                            document
                                .getElementById("features")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                        }}
                    >
                        Learn more
                    </Button>
                </AnimatedElement>

                <AnimatedElement
                    index={4}
                    className="relative w-[95vw] aspect-video max-w-[1440px] max-h-[700px] rounded-lg overflow-hidden shadow-2xl mt-12 border-2 border-white/20 ring-4 ring-offset-2 ring-white/[0.03] ring-offset-background before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-gray-900/10 after:absolute after:inset-0 after:ring-1 after:ring-gray-900/10"
                    variants={{
                        hidden: { y: -20, opacity: 0 },
                        visible: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                stiffness: 50,
                                damping: 20,
                            },
                        },
                    }}
                >
                    <Image
                        src="/app-screenshot.webp"
                        alt="PurePlaylist App Screenshot"
                        width={2880}
                        height={1620}
                        className="object-cover"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
                </AnimatedElement>
            </div>
        </Section>
    );
}

export default HeroSection;
