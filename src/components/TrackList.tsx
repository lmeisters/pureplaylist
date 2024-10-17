"use client";

import { usePlaylistTracksQuery } from "@/hooks/usePlaylistTracksQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Music,
    Calendar,
    Activity,
    Clock,
    ChevronUp,
    ChevronDown,
    Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { spotifyApi } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface TrackListProps {
    playlistId: string;
}

type SortField = "number" | "title" | "album" | "date" | "bpm" | "duration";
type SortOrder = "asc" | "desc";

const TrackList: React.FC<TrackListProps> = ({ playlistId }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = usePlaylistTracksQuery(playlistId);

    const [sortField, setSortField] = useState<SortField>("number");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [playlistDetails, setPlaylistDetails] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { ref, inView } = useInView();
    const { data: session } = useSession();
    const { toast } = useToast();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    // Reset sorting when playlistId changes
    useEffect(() => {
        setSortField("number");
        setSortOrder("asc");
    }, [playlistId]);

    useEffect(() => {
        if (data?.pages[0]?.playlistDetails) {
            setPlaylistDetails(data.pages[0].playlistDetails);
        }
    }, [data]);

    const tracks =
        data?.pages.flatMap((page, pageIndex) =>
            page.items.map((item, itemIndex) => ({
                ...item,
                originalIndex: pageIndex * 50 + itemIndex + 1, // Assuming 50 items per page
            }))
        ) || [];

    function formatDuration(ms: number): string {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    const sortedTracks = [...tracks].sort((a, b) => {
        let aValue, bValue;
        switch (sortField) {
            case "number":
                aValue = a.originalIndex;
                bValue = b.originalIndex;
                break;
            case "title":
                aValue = a.track.name.toLowerCase();
                bValue = b.track.name.toLowerCase();
                break;
            case "album":
                aValue = a.track.album.name.toLowerCase();
                bValue = b.track.album.name.toLowerCase();
                break;
            case "date":
                aValue = new Date(a.track.album.release_date).getTime();
                bValue = new Date(b.track.album.release_date).getTime();
                break;
            case "bpm":
                aValue = a.audioFeatures?.tempo || 0;
                bValue = b.audioFeatures?.tempo || 0;
                break;
            case "duration":
                aValue = a.track.duration_ms;
                bValue = b.track.duration_ms;
                break;
            default:
                return 0;
        }
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const toggleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const SortButton = ({
        field,
        children,
    }: {
        field: SortField;
        children: React.ReactNode;
    }) => (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 flex items-center gap-1"
            onClick={() => toggleSort(field)}
        >
            {children}
            {sortField === field &&
                (sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                ))}
        </Button>
    );

    const savePlaylist = async (createNew: boolean) => {
        if (!session?.accessToken) {
            toast({
                title: "Error",
                description: "You must be logged in to save playlists.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            const trackUris = sortedTracks.map((item) => item.track.uri);

            if (createNew) {
                if (!newPlaylistName) {
                    toast({
                        title: "Error",
                        description:
                            "Please enter a name for the new playlist.",
                        variant: "destructive",
                    });
                    setIsSaving(false);
                    return;
                }

                console.log("Creating new playlist...");
                const response = await fetch(
                    "https://api.spotify.com/v1/me/playlists",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: newPlaylistName,
                            description: "Created with PurePlaylist",
                            public: false,
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error?.message || "Failed to create playlist"
                    );
                }

                const data = await response.json();
                console.log("New playlist created:", data);

                const newPlaylistId = data.id;
                console.log("Adding tracks to new playlist...");
                const addTracksResponse = await fetch(
                    `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ uris: trackUris }),
                    }
                );

                if (!addTracksResponse.ok) {
                    const errorData = await addTracksResponse.json();
                    throw new Error(
                        errorData.error?.message ||
                            "Failed to add tracks to playlist"
                    );
                }

                console.log("Tracks added to new playlist");

                toast({
                    title: "Success",
                    description: `New playlist "${newPlaylistName}" created with the sorted tracks.`,
                });

                // Close the dialog and reset the new playlist name
                setIsDialogOpen(false);
                setNewPlaylistName("");
            } else {
                // Update existing playlist
                if (playlistDetails?.owner.id !== session?.user?.id) {
                    throw new Error(
                        "You don't have permission to modify this playlist."
                    );
                }
                await spotifyApi.put(
                    `/playlists/${playlistId}/tracks`,
                    {
                        uris: trackUris,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );

                toast({
                    title: "Success",
                    description: "Playlist updated with the new track order.",
                });
            }
        } catch (error: any) {
            console.error("Error saving playlist:", error);
            toast({
                title: "Error",
                description:
                    error.message ||
                    "Failed to save the playlist. Please try again.",
                variant: "destructive",
            });
        }
        setIsSaving(false);
    };

    if (isLoading) return <div className="p-4">Loading tracks...</div>;
    if (error) return <div className="p-4">Error loading tracks</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 font-semibold border-b flex justify-between items-center">
                <span>Playlist Tracks</span>
                <div className="space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                Save as New Playlist
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Playlist</DialogTitle>
                                <DialogDescription>
                                    Enter a name for your new playlist. This
                                    will create a new playlist with the current
                                    track order.
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                placeholder="Enter new playlist name"
                                value={newPlaylistName}
                                onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                }
                            />
                            <Button
                                onClick={() => savePlaylist(true)}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Create and Save"}
                            </Button>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => savePlaylist(false)}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Update Current Playlist"}
                    </Button>
                </div>
            </div>
            <div className="p-2 font-semibold border-b grid grid-cols-[auto,2fr,1fr,6rem,6rem,4rem] gap-4 items-center">
                <SortButton field="number">#</SortButton>
                <SortButton field="title">Title</SortButton>
                <SortButton field="album">Album</SortButton>
                <SortButton field="date">
                    <Calendar className="w-4 h-4" />
                </SortButton>
                <SortButton field="bpm">
                    <Activity className="w-4 h-4" />
                </SortButton>
                <SortButton field="duration">
                    <Clock className="w-4 h-4" />
                </SortButton>
            </div>
            <ScrollArea className="flex-grow">
                <div className="pb-2">
                    {sortedTracks.map((item: any) => (
                        <div key={item.track.id}>
                            <div className="grid grid-cols-[auto,2fr,1fr,6rem,6rem,4rem] gap-4 items-center p-2">
                                <span className="w-8 text-center text-muted-foreground">
                                    {item.originalIndex}
                                </span>
                                <div className="flex items-center space-x-4">
                                    {item.track.album.images[2]?.url ? (
                                        <img
                                            src={item.track.album.images[2].url}
                                            alt={item.track.name}
                                            className="w-10 h-10 rounded-md"
                                        />
                                    ) : (
                                        <Music className="w-10 h-10 text-muted-foreground" />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {item.track.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.track.artists
                                                .map(
                                                    (artist: any) => artist.name
                                                )
                                                .join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground truncate">
                                    {item.track.album.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(item.track.album.release_date)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {item.audioFeatures?.tempo.toFixed(0)} BPM
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {formatDuration(item.track.duration_ms)}
                                </span>
                            </div>
                            <Separator />
                        </div>
                    ))}
                    {hasNextPage && (
                        <div ref={ref} className="p-4 text-center">
                            {isFetchingNextPage
                                ? "Loading more..."
                                : "Load more"}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default TrackList;
