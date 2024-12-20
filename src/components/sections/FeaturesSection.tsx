import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import Image from "next/image";
import { AnimatedElement } from "@/components/ui/animated-element";

interface Feature {
    title: string;
    description: string;
    image?: {
        src: string;
        alt: string;
    };
}

function FeaturesSection() {
    const features: Feature[] = [
        {
            title: "Quick Search & Favorites",
            description:
                "Easily search, organize, and mark playlists as favorites for fast access.",
            image: {
                src: "/features/search.webp",
                alt: "Quick search and favorites feature demonstration",
            },
        },
        {
            title: "Flexible Playlist Ordering",
            description:
                "Customize the order of playlists and tracks to suit your listening preferences.",
            image: {
                src: "/features/playlist-ordering.webp",
                alt: "Flexible playlist ordering feature demonstration",
            },
        },
        {
            title: "Custom Track Sorting",
            description:
                "Order tracks by title, album, release date, and more for a tailored playlist view.",
            image: {
                src: "/features/track-sorting.webp",
                alt: "Custom track sorting feature demonstration",
            },
        },
        {
            title: "Instant Track Filtering",
            description:
                "Filter tracks by keywords, albums, or artists for a personalized experience.",
            image: {
                src: "/features/track-filtering.webp",
                alt: "Instant track filtering feature demonstration",
            },
        },
        {
            title: "Bulk Track Deletion",
            description:
                "Remove multiple tracks at once to streamline your playlist in seconds.",
            image: {
                src: "/features/bulk-track-deletion.webp",
                alt: "Bulk track deletion feature demonstration",
            },
        },
        {
            title: "Playlist Update & Save",
            description:
                "Edit playlists or save as new to keep your music organized just the way you like.",
            image: {
                src: "/features/playlist-update-save.webp",
                alt: "Playlist update and save feature demonstration",
            },
        },
    ];

    return (
        <Section
            containerWidth="wide"
            className="py-24"
            variant="gray"
            id="features"
        >
            <AnimatedElement
                index={0}
                className="space-y-4 text-center"
                threshold={0.4}
            >
                <Badge variant="outline" className="bg-white">
                    FEATURES
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
                    Key Features of PurePlaylist
                </h2>
            </AnimatedElement>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 lg:[&>*:nth-child(3)]:col-span-1 lg:[&>*:nth-child(6)]:col-span-1">
                {features.map((feature, index) => (
                    <AnimatedElement
                        key={feature.title}
                        index={index + 1}
                        className="h-full"
                    >
                        <Card className="flex flex-col p-6 h-full transition-all hover:shadow-lg hover:bg-background">
                            <div className="flex-1 space-y-4">
                                <h3 className="font-semibold text-xl">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                            {feature.image && (
                                <div className="relative w-full aspect-video mt-4 rounded-lg overflow-hidden bg-secondary/10">
                                    <Image
                                        src={feature.image.src}
                                        alt={feature.image.alt}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                        </Card>
                    </AnimatedElement>
                ))}
            </div>
        </Section>
    );
}

export default FeaturesSection;
