"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { usePlaylistsQuery } from "@/hooks/usePlaylistQuery";
import TrackList from "@/components/TrackList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Music, Filter, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

type SortOption = "default" | "nameAsc" | "nameDesc" | "sizeAsc" | "sizeDesc";

const PlaylistManager = () => {
    const { data: playlists, isLoading, error } = usePlaylistsQuery();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("default");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const queryClient = useQueryClient();

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favoritePlaylistIds");
        if (storedFavorites) {
            setFavorites(new Set(JSON.parse(storedFavorites)));
        }
    }, []);

    const toggleFavorite = (playlistId: string) => {
        setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            if (newFavorites.has(playlistId)) {
                newFavorites.delete(playlistId);
            } else {
                newFavorites.add(playlistId);
            }
            localStorage.setItem(
                "favoritePlaylistIds",
                JSON.stringify(Array.from(newFavorites))
            );
            return newFavorites;
        });
    };

    const filteredAndSortedPlaylists = useMemo(() => {
        let result =
            playlists?.filter((playlist: any) =>
                playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) || [];

        // Sort by favorite status first, then apply the selected sort option
        result.sort((a, b) => {
            if (favorites.has(a.id) && !favorites.has(b.id)) return -1;
            if (!favorites.has(a.id) && favorites.has(b.id)) return 1;

            switch (sortOption) {
                case "default":
                    // Assuming 'createdAt' is a Date object or timestamp
                    return (b.createdAt as any) - (a.createdAt as any);
                case "nameAsc":
                    return a.name.localeCompare(b.name);
                case "nameDesc":
                    return b.name.localeCompare(a.name);
                case "sizeAsc":
                    return a.tracks.total - b.tracks.total;
                case "sizeDesc":
                    return b.tracks.total - a.tracks.total;
                default:
                    return 0;
            }
        });

        return result;
    }, [playlists, searchTerm, sortOption, favorites]);

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

    const handlePlaylistUpdate = () => {
        // Refetch the playlists data
        queryClient.invalidateQueries(["playlists"]);
    };

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
                <div className="px-4 py-2 relative flex items-center space-x-2">
                    <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search playlists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setSortOption("default")}
                            >
                                Default Order
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("nameAsc")}
                            >
                                Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("nameDesc")}
                            >
                                Name (Z-A)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("sizeAsc")}
                            >
                                Size (Smallest first)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("sizeDesc")}
                            >
                                Size (Largest first)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <kbd className="absolute right-20 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">Ctrl+K</span>
                    </kbd>
                </div>
                <ScrollArea className="flex-grow">
                    <div className="pb-16">
                        {filteredAndSortedPlaylists?.map((playlist: any) => (
                            <div key={playlist.id}>
                                <div
                                    className={`flex items-center space-x-4 px-4 py-2 cursor-pointer ${
                                        selectedPlaylist === playlist.id
                                            ? "bg-accent rounded-md"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedPlaylist(playlist.id)
                                    }
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
                                    <div className="flex-grow">
                                        <p className="font-medium">
                                            {playlist.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {playlist.tracks.total} tracks
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(playlist.id);
                                        }}
                                    >
                                        <Star
                                            className={`h-4 w-4 ${
                                                favorites.has(playlist.id)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                    </Button>
                                </div>
                                <Separator />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="flex-1 h-full overflow-hidden">
                {selectedPlaylist ? (
                    <TrackList
                        playlistId={selectedPlaylist}
                        onPlaylistUpdate={handlePlaylistUpdate}
                    />
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
