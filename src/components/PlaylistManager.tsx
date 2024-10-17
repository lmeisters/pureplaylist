"use client";

import { useState } from "react";
import { usePlaylistsQuery } from "@/hooks/usePlaylistQuery";
import TrackList from "@/components/TrackList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Music, PlayCircle } from "lucide-react";

const PlaylistManager = () => {
    const { data: playlists, isLoading, error } = usePlaylistsQuery();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );

    if (isLoading) return <div>Loading playlists...</div>;
    if (error) return <div>Error loading playlists</div>;

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            <div className="w-1/3 border-r">
                <div className="p-4 font-semibold">Your Playlists</div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    {playlists?.map((playlist: any) => (
                        <div key={playlist.id}>
                            <div
                                className={`flex items-center space-x-4 p-4 cursor-pointer ${
                                    selectedPlaylist === playlist.id
                                        ? "bg-accent"
                                        : ""
                                }`}
                                onClick={() => setSelectedPlaylist(playlist.id)}
                            >
                                {playlist.images?.[0]?.url ? (
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="w-10 h-10 rounded"
                                    />
                                ) : (
                                    <Music className="w-10 h-10 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {playlist.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {playlist.tracks.total} tracks
                                    </p>
                                </div>
                            </div>
                            <Separator />
                        </div>
                    ))}
                </ScrollArea>
            </div>
            <div className="flex-1 overflow-hidden">
                {selectedPlaylist ? (
                    <TrackList playlistId={selectedPlaylist} />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Select a playlist to view tracks</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistManager;
