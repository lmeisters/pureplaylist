import { Section } from "@/components/ui/section";
import { Github } from "lucide-react";
import Link from "next/link";

function FooterSection() {
    function scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <Section
            noPaddingTop
            variant="footer"
            size="half"
            containerWidth="wide"
            className="rounded-t-3xl"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-2 sm:pb-4">
                {/* About Section */}
                <div className="col-span-1 sm:col-span-2">
                    <h3 className="font-semibold text-lg sm:text-xl mb-2">
                        PurePlaylist
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                        Empowering music lovers to create and share perfectly
                        curated playlists. Our mission is to make playlist
                        management simple and enjoyable for everyone.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="col-span-1">
                    <h4 className="font-semibold mb-3 sm:mb-4">Quick Links</h4>
                    <nav className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-3">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-secondary transition cursor-pointer"
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection("about")}
                            className="text-sm text-left text-muted-foreground hover:text-secondary transition cursor-pointer"
                        >
                            About
                        </button>
                        <button
                            onClick={() => scrollToSection("features")}
                            className="text-sm text-left text-muted-foreground hover:text-secondary transition cursor-pointer"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection("how-it-works")}
                            className="text-sm text-left text-muted-foreground hover:text-secondary transition cursor-pointer"
                        >
                            How It Works
                        </button>
                        <button
                            onClick={() => scrollToSection("faq")}
                            className="text-sm text-left text-muted-foreground hover:text-secondary transition cursor-pointer"
                        >
                            FAQ
                        </button>
                    </nav>
                </div>

                {/* Social & Credits */}
                <div className="col-span-1">
                    <h4 className="font-semibold mb-3 sm:mb-4">
                        Project Links
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                        <a
                            href="https://github.com/lmeisters/pureplaylist"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-secondary transition"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-border/40 pt-4 mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} PurePlaylist. All rights
                        reserved.
                    </p>
                    <p>
                        Created by{" "}
                        <a
                            href="https://github.com/lmeisters"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-secondary transition"
                        >
                            Linards M.
                        </a>
                    </p>
                </div>
            </div>
        </Section>
    );
}

export default FooterSection;
