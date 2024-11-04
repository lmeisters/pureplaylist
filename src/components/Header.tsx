"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function Header() {
    const { status } = useSession();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const router = useRouter();
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

    useEffect(() => {
        if (status === "authenticated") {
            router.refresh();
        }
    }, [status, router]);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl mx-auto px-4">
            <div className="w-full bg-background/80 backdrop-blur-sm border rounded-lg flex justify-between items-center py-2 px-4">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/icon.png"
                        alt="PurePlaylist"
                        width={24}
                        height={24}
                    />
                    <h1 className="text-xl font-semibold">PurePlaylist</h1>
                </div>
                {status === "authenticated" ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSignIn}
                        disabled={isSigningIn || status === "loading"}
                    >
                        {isSigningIn ? "Signing In..." : "Sign In"}
                    </Button>
                )}
            </div>
        </header>
    );
}

export default Header;
