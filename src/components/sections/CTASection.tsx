import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { signIn } from "next-auth/react";
import { AnimatedElement } from "@/components/ui/animated-element";

function CTASection() {
    return (
        <Section containerWidth="wide" size="half" variant="gray">
            <AnimatedElement
                index={0}
                className="flex flex-col items-start text-left space-y-4 border-1 border-gray-600 rounded-2xl py-16 px-12 bg-white shadow-md"
                threshold={0.4}
            >
                <AnimatedElement
                    as="h2"
                    index={1}
                    className="text-2xl font-semibold tracking-tighter sm:text-3xl md:text-4xl"
                >
                    Ready to Organize Your Spotify Playlists?
                </AnimatedElement>

                <AnimatedElement
                    as="p"
                    index={2}
                    className="text-lg text-muted-foreground max-w-[36rem]"
                >
                    Join thousands of users who are already enjoying cleaner,
                    more organized music collections.
                </AnimatedElement>

                <AnimatedElement
                    index={3}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button size="default" onClick={() => signIn("spotify")}>
                        <Music className="mr-2 h-4 w-4" />
                        Get Started with Spotify
                    </Button>
                </AnimatedElement>
            </AnimatedElement>
        </Section>
    );
}

export default CTASection;
