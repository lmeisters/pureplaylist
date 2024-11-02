import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { Filter, Shield, Smartphone, X } from "lucide-react";

function FeaturesSection() {
    const features = [
        {
            title: "Custom Filtering",
            description:
                "Filter tracks by keywords, genres, and artists in seconds.",
            icon: <Filter className="h-6 w-6" />,
        },
        {
            title: "Clear Filters Option",
            description:
                "Easily clear all applied filters with a single click.",
            icon: <X className="h-6 w-6" />,
        },
        {
            title: "Responsive Design",
            description:
                "Built to provide an excellent user experience across desktop, tablet, and mobile devices.",
            icon: <Smartphone className="h-6 w-6" />,
        },
        {
            title: "Secure Spotify Integration",
            description:
                "Seamless, secure authentication with Spotify API, ensuring user privacy and data security.",
            icon: <Shield className="h-6 w-6" />,
        },
    ];

    return (
        <Section containerWidth="wide" className="py-24" variant="gray">
            <div className="text-center space-y-4">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Key Features of PurePlaylist
                </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {features.map((feature) => (
                    <Card
                        key={feature.title}
                        className="p-6 space-y-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-secondary/10"
                    >
                        <div className="p-2 w-fit rounded-lg bg-secondary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold text-xl">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                            {feature.description}
                        </p>
                    </Card>
                ))}
            </div>
        </Section>
    );
}

export default FeaturesSection;
