import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { signIn } from "next-auth/react";
import { AnimatedElement } from "@/components/ui/animated-element";

function CTASection() {
    return (
        <Section containerWidth="wide" size="half" variant="gray">
            <div className="relative">
                <AnimatedElement
                    index={0}
                    className="relative flex flex-col items-start text-left space-y-4 rounded-2xl py-16 px-12 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] isolate overflow-hidden"
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-16 w-64 h-64 opacity-5 transform rotate-12">
                        <img
                            src="/icon.png"
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <AnimatedElement
                        as="h2"
                        index={1}
                        className="text-2xl font-semibold tracking-tighter sm:text-3xl md:text-4xl"
                    >
                        See PurePlaylist in Action
                    </AnimatedElement>

                    <AnimatedElement
                        as="p"
                        index={2}
                        className="text-lg text-muted-foreground max-w-[25rem]"
                    >
                        Effortlessly organize your playlists with powerful
                        filtering tools for a clean, tailored music experience.
                    </AnimatedElement>

                    <AnimatedElement
                        index={3}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            size="default"
                            onClick={() => signIn("spotify")}
                        >
                            <Music className="mr-2 h-4 w-4" />
                            Get Started with Spotify
                        </Button>
                    </AnimatedElement>
                </AnimatedElement>
            </div>
        </Section>
    );
}

export default CTASection;
