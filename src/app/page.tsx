"use client";

import { useSession, SessionProvider } from "next-auth/react";
import PlaylistGrid from "@/components/PlaylistGrid";

function HomeContent() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <h1>Welcome, {session.user?.name}!</h1>
                <p>
                    You are signed in and ready to use the Spotify Playlist
                    Filter.
                </p>
                <PlaylistGrid />
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
