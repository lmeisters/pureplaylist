import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { AnimatedElement } from "@/components/ui/animated-element";
import Image from "next/image";

function HowItWorksSection() {
    const steps = [
        {
            title: "Connect to Spotify",
            description: "Link your Spotify account to get started.",
            image: "/images/connect-spotify.webp",
        },
        {
            title: "Select Your Playlist",
            description: "Pick a playlist you'd like to refine.",
            image: "/images/select-playlist.webp",
        },
        {
            title: "Filter & Customize",
            description: "Apply filters to create your ideal mix.",
            image: "/images/filter-customize.webp",
        },
        {
            title: "Save & Enjoy",
            description: "Save your personalized playlist and start listening!",
            image: "/images/save-enjoy.webp",
        },
    ];

    return (
        <Section containerWidth="wide" variant="gray" id="how-it-works">
            <div>
                <AnimatedElement
                    index={0}
                    className="space-y-3 text-center"
                    threshold={0.4}
                >
                    <Badge variant="outline" className="bg-white">
                        HOW IT WORKS
                    </Badge>
                    <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
                        Simple Steps to Organize Your Music
                    </h2>
                </AnimatedElement>

                <div className="mt-16 relative">
                    <div className="hidden md:block absolute left-1/2 -top-8 h-[calc(100%+6rem)] w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent -translate-x-1/2" />

                    <div className="space-y-16">
                        {steps.map((step, index) => (
                            <AnimatedElement
                                key={step.title}
                                index={index + 1}
                                className="relative"
                                threshold={0.3}
                            >
                                <div className="absolute left-1/2 -top-16 h-16 w-px bg-gradient-to-b from-transparent via-gray-400 to-gray-400 -translate-x-1/2 md:hidden" />

                                <div
                                    className="absolute left-1/2 top-0 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-8 h-8 rounded-full 
                                    bg-gradient-to-b from-gray-50 to-gray-100 
                                    shadow-[inset_0_-1px_2px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.05)] 
                                    flex items-center justify-center z-10 
                                    border border-gray-200"
                                >
                                    <span className="text-base font-semibold text-gray-700">
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-16 md:pt-0">
                                    <div
                                        className={`px-4 md:px-12 ${
                                            index % 2 === 1 ? "md:order-2" : ""
                                        }`}
                                    >
                                        <h3 className="text-semibold text-2xl mb-1">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground text-md">
                                            {step.description}
                                        </p>
                                    </div>
                                    <div
                                        className={`px-4 md:px-12 ${
                                            index % 2 === 1 ? "md:order-1" : ""
                                        }`}
                                    >
                                        <div
                                            className={`aspect-video w-full overflow-hidden rounded-md border border-gray-200 ${
                                                index === 0
                                                    ? "bg-black"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                width={1920}
                                                height={1080}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AnimatedElement>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}

export default HowItWorksSection;
