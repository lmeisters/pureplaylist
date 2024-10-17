"use client";

import { useSession, SessionProvider } from "next-auth/react";
import PlaylistManager from "@/components/PlaylistManager";

function HomeContent() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="h-[calc(100vh-4rem)]">
                <PlaylistManager />
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome to PurePlaylist</h1>
            <p>Please sign in to get started.</p>
        </div>
    );
}

export default function Home() {
    return (
        <SessionProvider>
            <HomeContent />
        </SessionProvider>
    );
}
