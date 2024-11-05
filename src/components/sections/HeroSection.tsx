import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Music } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

function HeroSection() {
    return (
        <Section
            variant="default"
            allowOverflow
            className="pt-32 sm:pt-36"
            id="hero"
        >
            <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full border px-4 py-1.5 mb-8 bg-background">
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium">
                        Version 1.0 is now live
                    </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
                    Curating Spotify Playlists with Precision
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                    Developed by Linards M., this app showcases advanced
                    filtering, responsive design, and seamless integration with
                    the Spotify API.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button size="lg" onClick={() => signIn("spotify")}>
                        <Music className="mr-2 h-5 w-5" />
                        Sign in with Spotify
                    </Button>
                    <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => {
                            document.getElementById("about")?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }}
                    >
                        Learn more
                    </Button>
                </div>

                <div className="relative w-[95vw] aspect-video max-w-[1440px] max-h-[700px] rounded-lg overflow-hidden shadow-xl mt-12">
                    <Image
                        src="/app-screenshot.webp"
                        alt="PurePlaylist App Screenshot"
                        width={1440}
                        height={810}
                        className="object-cover rounded-lg border-2 border-border"
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
                </div>
            </div>
        </Section>
    );
}

export default HeroSection;
