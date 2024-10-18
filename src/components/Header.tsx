"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Header() {
    const { data: session } = useSession();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await signIn("spotify", { callbackUrl: "/" });
        } catch (error) {
            console.error("Sign in error:", error);
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <header className="bg-background border-b">
            <div className="w-full px-6 sm:px-8 flex justify-between items-center py-2">
                <h1 className="text-xl font-semibold">PurePlaylist</h1>
                {session ? (
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
                        disabled={isSigningIn}
                    >
                        {isSigningIn ? "Signing In..." : "Sign In"}
                    </Button>
                )}
            </div>
        </header>
    );
}

export default Header;
