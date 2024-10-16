"use client";

import { useState } from "react";
import { usePlaylistsQuery } from "@/hooks/usePlaylistQuery";

const PlaylistGrid = () => {
    const { data: playlists, isLoading, error } = usePlaylistsQuery();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );

    if (isLoading) return <div>Loading playlists...</div>;
    if (error) return <div>Error loading playlists</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists?.map((playlist: any) => (
                <div
                    key={playlist.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                        selectedPlaylist === playlist.id
                            ? "bg-green-100 border-green-500"
                            : "bg-white"
                    }`}
                    onClick={() => setSelectedPlaylist(playlist.id)}
                >
                    <img
                        src={playlist.images?.[0]?.url ?? "/placeholder.png"}
                        alt={playlist.name}
                        className="w-full h-40 object-cover mb-2 rounded"
                    />
                    <h3 className="font-bold text-gray-900">{playlist.name}</h3>
                    <p className="text-sm text-gray-500">
                        {playlist.tracks.total} tracks
                    </p>
                </div>
            ))}
        </div>
    );
};

export default PlaylistGrid;
