"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { usePlaylistsQuery } from "@/hooks/usePlaylistQuery";
import TrackList from "@/components/TrackList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Music, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const PlaylistManager = () => {
    const { data: playlists, isLoading, error } = usePlaylistsQuery();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredPlaylists = useMemo(() => {
        return playlists?.filter((playlist: any) =>
            playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [playlists, searchTerm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "k") {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (isLoading)
        return (
            <div className="h-full flex items-center justify-center">
                Loading playlists...
            </div>
        );
    if (error)
        return (
            <div className="h-full flex items-center justify-center">
                Error loading playlists
            </div>
        );

    return (
        <div className="flex h-full">
            <div className="w-80 h-full overflow-hidden border-r flex flex-col">
                <div className="p-5 font-semibold border-b flex justify-between items-center">
                    <span>Playlists</span>
                </div>
                <div className="px-4 py-2 relative">
                    <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search playlists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <kbd className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">Ctrl+K</span>
                    </kbd>
                </div>
                <ScrollArea className="flex-grow">
                    {filteredPlaylists?.map((playlist: any) => (
                        <div key={playlist.id}>
                            <div
                                className={`flex items-center space-x-4 px-4 py-2 cursor-pointer ${
                                    selectedPlaylist === playlist.id
                                        ? "bg-accent rounded-md"
                                        : ""
                                }`}
                                onClick={() => setSelectedPlaylist(playlist.id)}
                            >
                                {playlist.images?.[0]?.url ? (
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="w-10 h-10 rounded-lg"
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
            <div className="flex-1 h-full overflow-hidden">
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
