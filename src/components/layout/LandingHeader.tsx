"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

function LandingHeader() {
    const { status } = useSession();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await signIn("spotify", { callbackUrl: "/" });
        } catch (error) {
            console.error("Sign in error:", error);
            toast({
                title: "Sign In Error",
                description:
                    "There was a problem signing in. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSigningIn(false);
        }
    };

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#how-it-works", label: "How It Works" },
        { href: "#faq", label: "FAQ" },
    ];

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    height: isOpen ? "auto" : "52px",
                }}
                transition={{
                    duration: 0.3,
                    opacity: { duration: 0.5 },
                }}
                className="w-full bg-background border rounded-lg overflow-hidden"
            >
                {/* Header Content */}
                <div className="flex justify-between items-center py-2 px-4">
                    <div className="flex items-center space-x-2">
                        <Link
                            href="#hero"
                            className="flex items-center space-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <Image
                                src="/icon.png"
                                alt="PurePlaylist"
                                width={24}
                                height={24}
                            />
                            <h1 className="text-xl font-semibold">
                                PurePlaylist
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Sign In Button */}
                    <div className="hidden md:block">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSignIn}
                            disabled={isSigningIn || status === "loading"}
                        >
                            {isSigningIn ? "Signing In..." : "Sign In"}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Mobile Navigation Menu */}
                <motion.div
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden"
                >
                    <div>
                        <nav className="flex flex-col py-4 px-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleSignIn}
                                disabled={isSigningIn || status === "loading"}
                                className="mt-4 w-full"
                            >
                                {isSigningIn ? "Signing In..." : "Sign In"}
                            </Button>
                        </nav>
                    </div>
                </motion.div>
            </motion.div>
        </header>
    );
}

export default LandingHeader;
