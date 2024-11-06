"use client";

import { useState } from "react";
import { usePlaylistsQuery } from "@/hooks/usePlaylistQuery";
import TrackList from "@/components/features/tracks/TrackList";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
    tracks: { total: number };
}

const PlaylistGrid = () => {
    const { data: playlists, isLoading, error } = usePlaylistsQuery();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );

    if (isLoading) return <div>Loading playlists...</div>;
    if (error) return <div>Error loading playlists</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow overflow-auto pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {playlists?.map((playlist: Playlist, index: number) => (
                        <div
                            key={playlist.id}
                            className={cn(
                                "p-4 border rounded-lg cursor-pointer",
                                "hover:bg-accent/10 transition-colors duration-200",
                                selectedPlaylist === playlist.id
                                    ? "bg-accent shadow-md"
                                    : "bg-background"
                            )}
                            onClick={() => setSelectedPlaylist(playlist.id)}
                        >
                            <div className="aspect-square mb-2 overflow-hidden rounded-md">
                                <Image
                                    src={
                                        playlist.images?.[0]?.url ??
                                        "/placeholder.png"
                                    }
                                    alt={playlist.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                    priority={index === 0} // Add priority to the first image
                                />
                            </div>
                            <h3
                                className="font-bold text-foreground truncate"
                                title={playlist.name}
                            >
                                {playlist.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {playlist.tracks.total} tracks
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {selectedPlaylist && (
                <div className="flex-grow overflow-auto pb-32">
                    <TrackList
                        playlistId={selectedPlaylist}
                        playlistName={
                            playlists?.find(
                                (p: Playlist) => p.id === selectedPlaylist
                            )?.name || ""
                        }
                        onPlaylistUpdate={() => {}}
                    />
                </div>
            )}
        </div>
    );
};

export default PlaylistGrid;
