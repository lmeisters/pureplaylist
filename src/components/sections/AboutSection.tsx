import { Section } from "@/components/ui/section";
import { Badge } from "../ui/badge";

function AboutSection() {
    return (
        <Section variant="gray">
            <div className="flex flex-col items-center text-center">
                <div className="text-center space-y-4">
                    <Badge variant="secondary">About</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        About PurePlaylist
                    </h2>
                </div>
                <p className="text-lg mb-4 mt-6">
                    PurePlaylist is a web application that enables users to
                    filter their Spotify playlists by keywords, genres, and
                    artists. Built with modern technologies like React, Next.js,
                    and Tailwind CSS, it seamlessly integrates with the Spotify
                    API, providing a smooth and responsive user experience
                    across all devices.
                </p>
                <p className="text-lg">
                    This project was developed to give users better control over
                    their music collections and improve playlist management.
                </p>
            </div>
        </Section>
    );
}

export default AboutSection;
