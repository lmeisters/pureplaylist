import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Music } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

function HeroSection() {
    return (
        <Section>
            <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
                    Curating Spotify Playlists with Precision
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                    Developed by Linards M., this app showcases advanced
                    filtering, responsive design, and seamless integration with
                    the Spotify API.
                </p>

                <div className="flex space-x-4">
                    <Button size="lg" onClick={() => signIn("spotify")}>
                        <Music className="mr-2 h-5 w-5" />
                        Sign in with Spotify
                    </Button>
                    <Button size="lg" variant="ghost">
                        Learn more
                    </Button>
                </div>

                <div className="relative w-full aspect-video max-w-[1280px] max-h-[720px] rounded-lg overflow-hidden shadow-xl mt-12">
                    <Image
                        src="/app-screenshot.webp"
                        alt="PurePlaylist App Screenshot"
                        width={1280}
                        height={720}
                        className="object-cover rounded-lg border-2 border-border"
                        priority
                    />
                </div>
            </div>
        </Section>
    );
}

export default HeroSection;
