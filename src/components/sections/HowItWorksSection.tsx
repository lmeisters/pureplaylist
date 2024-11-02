import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, LogIn, Filter, Save } from "lucide-react";

function HowItWorksSection() {
    const steps = [
        {
            title: "Sign In",
            description:
                "Connect your Spotify account securely with just one click",
            icon: <LogIn className="h-6 w-6" />,
        },
        {
            title: "Select & Filter",
            description:
                "Choose a playlist and apply filters by keywords, artists, or genres",
            icon: <Filter className="h-6 w-6" />,
        },
        {
            title: "Save Changes",
            description:
                "Update existing playlist or create a new filtered version",
            icon: <Save className="h-6 w-6" />,
        },
    ];

    return (
        <Section variant="gray">
            <div className="flex flex-col items-center text-center">
                <div className="text-center space-y-4">
                    <Badge variant="secondary">How It Works</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Simple Steps to Organize Your Music
                    </h2>
                </div>

                <div className="grid gap-6 mt-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <Card
                            key={step.title}
                            className="relative p-6 text-left"
                        >
                            <div className="space-y-4">
                                <div className="p-2 w-fit rounded-lg bg-secondary">
                                    {step.icon}
                                </div>
                                <h3 className="font-semibold text-xl">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </Section>
    );
}

export default HowItWorksSection;
