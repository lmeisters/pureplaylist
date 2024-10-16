"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Spotify Playlist Filter
                </h1>
                {session ? (
                    <button
                        onClick={() => signOut()}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => signIn("spotify")}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign In with Spotify
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
