import { Section } from "@/components/ui/section";

function AboutSection() {
    return (
        <Section>
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl mb-4">
                    About PurePlaylist
                </h1>
                <p className="text-lg mb-4">
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
