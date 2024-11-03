import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import Image from "next/image";

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
                "Filter tracks by keywords, genres, or artists for a personalized playlist experience.",
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
        <Section containerWidth="wide" className="py-24" variant="gray">
            <div className="space-y-4">
                <Badge variant="outline">FEATURES</Badge>
                <h2 className="text-3xl tracking-tighter sm:text-4xl md:text-5xl">
                    Key Features of PurePlaylist
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 [&>*:nth-child(3)]:md:col-span-2 [&>*:nth-child(6)]:md:col-span-2 lg:[&>*:nth-child(3)]:col-span-1 lg:[&>*:nth-child(6)]:col-span-1">
                {features.map((feature) => (
                    <Card
                        key={feature.title}
                        className="p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:bg-secondary/10 hover:border-primary/20"
                    >
                        <h3 className="font-semibold text-xl">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                            {feature.description}
                        </p>
                        {feature.image && (
                            <div className="relative w-full aspect-video mt-4 rounded-lg overflow-hidden">
                                <Image
                                    src={feature.image.src}
                                    alt={feature.image.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </Section>
    );
}

export default FeaturesSection;
