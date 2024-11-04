"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

function LandingHeader() {
    const { status } = useSession();
    const [isSigningIn, setIsSigningIn] = useState(false);
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

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl mx-auto px-4">
            <div className="w-full bg-background/80 backdrop-blur-sm border rounded-lg flex justify-between items-center py-2 px-4">
                <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/icon.png"
                            alt="PurePlaylist"
                            width={24}
                            height={24}
                        />
                        <h1 className="text-xl font-semibold">PurePlaylist</h1>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center space-x-8 mr-8">
                    <Link
                        href="#about"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        About
                    </Link>
                    <Link
                        href="#features"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        Features
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        FAQ
                    </Link>
                </nav>
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleSignIn}
                    disabled={isSigningIn || status === "loading"}
                >
                    {isSigningIn ? "Signing In..." : "Sign In"}
                </Button>
            </div>
        </header>
    );
}

export default LandingHeader;
