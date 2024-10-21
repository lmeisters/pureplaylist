"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function Header() {
    const { data: session, status } = useSession();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await signIn("spotify", { callbackUrl: "/" });
        } catch (error) {
            console.error("Sign in error:", error);
            toast({
                title: "Sign In Error",
                description:
                    "There was an problem signing in. Please try again.",
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
        <header className="bg-background border-b">
            <div className="w-full px-6 sm:px-8 flex justify-between items-center py-2">
                <h1 className="text-xl font-semibold">PurePlaylist</h1>
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
