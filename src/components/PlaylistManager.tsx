"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { usePlaylistsQuery } from "@/hooks/usePlaylistQuery";
import TrackList from "@/components/TrackList";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useToast } from "@/hooks/use-toast";

type SortOption = "default" | "nameAsc" | "nameDesc" | "sizeAsc" | "sizeDesc";

const PlaylistManager = () => {
    const { data: playlists, isLoading, error, refetch } = usePlaylistsQuery();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("default");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favoritePlaylistIds");
        if (storedFavorites) {
            setFavorites(new Set(JSON.parse(storedFavorites)));
        }
    }, []);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error Loading Playlists",
                description:
                    "There was a problem loading your playlists. Please try again.",
                variant: "destructive",
            });
        }
    }, [error, toast]);

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

        result.sort((a: any, b: any) => {
            if (favorites.has(a.id) && !favorites.has(b.id)) return -1;
            if (!favorites.has(a.id) && favorites.has(b.id)) return 1;

            switch (sortOption) {
                case "default":
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
        queryClient.invalidateQueries({ queryKey: ["playlists"] });
    };

    const handleRetry = () => {
        refetch();
    };

    if (isLoading)
        return (
            <div className="h-full flex items-center justify-center">
                Loading playlists...
            </div>
        );
    if (error)
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <p className="mb-4">Error loading playlists</p>
                <Button onClick={handleRetry}>Retry</Button>
            </div>
        );

    return (
        <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-80 h-64 md:h-full overflow-hidden border-b md:border-r flex flex-col">
                <div className="p-4 font-semibold border-b flex justify-between items-center">
                    <span>Playlists</span>
                </div>
                <div className="p-2 relative flex items-center space-x-2">
                    <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search playlists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
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
                    <kbd className="hidden md:inline-flex absolute right-20 top-1/2 transform -translate-y-1/2 pointer-events-none h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">Ctrl+K</span>
                    </kbd>
                </div>
                <ScrollArea className="flex-grow">
                    <div className="p-2 space-y-2 pb-16">
                        {filteredAndSortedPlaylists?.map((playlist: any) => (
                            <div
                                key={playlist.id}
                                className="rounded-lg overflow-hidden"
                            >
                                <div
                                    className={`flex items-center space-x-2 p-2 cursor-pointer 
                                    transform transition-all duration-200 ease-out
                                    border border-border/50 rounded-lg
                                    shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]
                                    hover:scale-[1.02] hover:-translate-y-1 
                                    ${
                                        selectedPlaylist === playlist.id
                                            ? "bg-accent shadow-md scale-[1.02] -translate-y-1"
                                            : "hover:bg-accent/10 bg-background"
                                    }`}
                                    onClick={() =>
                                        setSelectedPlaylist(playlist.id)
                                    }
                                >
                                    {playlist.images?.[0]?.url ? (
                                        <img
                                            src={playlist.images[0].url}
                                            alt={playlist.name}
                                            className="w-8 h-8 rounded-lg shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-muted shadow-sm flex items-center justify-center">
                                            <Music className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium truncate text-sm">
                                            {playlist.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {playlist.tracks.total} tracks
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto"
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
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="flex-1 h-full overflow-hidden">
                {selectedPlaylist && (
                    <TrackList
                        playlistId={selectedPlaylist}
                        playlistName={
                            playlists.find((p) => p.id === selectedPlaylist)
                                ?.name || "Unnamed Playlist"
                        }
                        onPlaylistUpdate={handlePlaylistUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default PlaylistManager;
