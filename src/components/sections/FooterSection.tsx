import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

function FooterSection() {
    return (
        <Section variant="dark" size="half">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="font-semibold text-xl">PurePlaylist</h3>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} PurePlaylist. All rights
                        reserved.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a
                            href="https://github.com/yourusername/pureplaylist"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>
                </div>
            </div>
        </Section>
    );
}

export default FooterSection;
