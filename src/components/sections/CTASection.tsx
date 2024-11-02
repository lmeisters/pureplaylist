import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { signIn } from "next-auth/react";

function CTASection() {
    return (
        <Section size="half" variant="gray">
            <div className="flex flex-col items-center text-center space-y-8 border-1 border-gray-600 rounded-xl py-12 px-24 bg-white">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-2xl">
                    Ready to Organize Your Spotify Playlists?
                </h2>
                <p className="text-xl text-muted-foreground max-w-[42rem]">
                    Join thousands of users who are already enjoying cleaner,
                    more organized music collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" onClick={() => signIn("spotify")}>
                        <Music className="mr-2 h-5 w-5" />
                        Get Started with Spotify
                    </Button>
                    <Button size="lg" variant="outline">
                        Learn More
                    </Button>
                </div>
            </div>
        </Section>
    );
}

export default CTASection;
