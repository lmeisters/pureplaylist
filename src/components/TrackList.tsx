"use client";

import React from "react";
import { usePlaylistTracksQuery } from "@/hooks/usePlaylistTracksQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { spotifyApi } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { TrackListHeader } from "./TrackListHeader";
import { TrackItem } from "./TrackItem";
import { SavePlaylistDialog } from "./SavePlaylistDialog";
import { SortButton } from "./SortButton";
import { useQueryClient } from "@tanstack/react-query";
import { FilterTab, FilterCriteria } from "./FilterTab";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface TrackListProps {
    playlistId: string;
    onPlaylistUpdate: () => void;
}

type SortField = "number" | "title" | "album" | "date" | "bpm" | "duration";
type SortOrder = "asc" | "desc";

const TrackList: React.FC<TrackListProps> = ({
    playlistId,
    onPlaylistUpdate,
}) => {
    const queryClient = useQueryClient();
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
    const [trackToDelete, setTrackToDelete] = useState<string | null>(null);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedTracks, setSelectedTracks] = useState<Set<string>>(
        new Set()
    );

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
        titleKeywords: [],
        genres: [],
        artists: [],
    });
    const [filteredTracks, setFilteredTracks] = useState<any[]>([]);

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

    // function formatDuration(ms: number): string {
    //     const minutes = Math.floor(ms / 60000);
    //     const seconds = ((ms % 60000) / 1000).toFixed(0);
    //     return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
    // }

    // function formatDate(dateString: string): string {
    //     return new Date(dateString).toLocaleDateString();
    // }

    const sortedTracks = [...tracks].sort((a, b) => {
        let aValue, bValue;
        switch (sortField) {
            case "number":
                aValue = a.originalIndex;
                bValue = b.originalIndex;
                break;
            case "title":
                aValue = a.track?.name?.toLowerCase() || "";
                bValue = b.track?.name?.toLowerCase() || "";
                break;
            case "album":
                aValue = a.track?.album?.name?.toLowerCase() || "";
                bValue = b.track?.album?.name?.toLowerCase() || "";
                break;
            case "date":
                aValue = new Date(a.track?.album?.release_date || 0).getTime();
                bValue = new Date(b.track?.album?.release_date || 0).getTime();
                break;
            case "bpm":
                aValue = a.audioFeatures?.tempo || 0;
                bValue = b.audioFeatures?.tempo || 0;
                break;
            case "duration":
                aValue = a.track?.duration_ms || 0;
                bValue = b.track?.duration_ms || 0;
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

                // Update the local query cache
                queryClient.setQueryData(
                    ["playlistTracks", playlistId],
                    (oldData: any) => ({
                        ...oldData,
                        pages: [
                            { items: sortedTracks.map((track) => ({ track })) },
                        ],
                    })
                );

                toast({
                    title: "Success",
                    description: "Playlist updated with the new track order.",
                });
            }

            // Call onPlaylistUpdate after successful save
            onPlaylistUpdate();
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

    const deleteTrack = async (trackUri: string) => {
        if (!session?.accessToken) {
            toast({
                title: "Error",
                description: "You must be logged in to delete tracks.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tracks: [{ uri: trackUri }],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete track");
            }

            toast({
                title: "Success",
                description: "Track removed from the playlist.",
            });

            // Update the local state
            const updatedTracks = tracks.filter(
                (item) => item.track.uri !== trackUri
            );
            queryClient.setQueryData(
                ["playlistTracks", playlistId],
                (oldData: any) => ({
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.filter(
                            (item: any) => item.track.uri !== trackUri
                        ),
                    })),
                })
            );

            // Call onPlaylistUpdate after successful deletion
            onPlaylistUpdate();
        } catch (error) {
            console.error("Error deleting track:", error);
            toast({
                title: "Error",
                description: "Failed to remove the track. Please try again.",
                variant: "destructive",
            });
        }
        setTrackToDelete(null);
    };

    const toggleTrackSelection = (trackUri: string) => {
        setSelectedTracks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(trackUri)) {
                newSet.delete(trackUri);
            } else {
                newSet.add(trackUri);
            }
            return newSet;
        });
    };

    const deleteSelectedTracks = async () => {
        if (!session?.accessToken) {
            toast({
                title: "Error",
                description: "You must be logged in to delete tracks.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tracks: Array.from(selectedTracks).map((uri) => ({
                            uri,
                        })),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete tracks");
            }

            toast({
                title: "Success",
                description: `${selectedTracks.size} track(s) removed from the playlist.`,
            });

            // Clear selection and refetch tracks
            setSelectedTracks(new Set());
            fetchNextPage();
        } catch (error) {
            console.error("Error deleting tracks:", error);
            toast({
                title: "Error",
                description: "Failed to remove the tracks. Please try again.",
                variant: "destructive",
            });
        }
    };

    const applyFilters = (criteria: FilterCriteria) => {
        setFilterCriteria(criteria);
        const filtered = sortedTracks.filter((track) => {
            const title = track.track.name.toLowerCase();
            const artist = track.track.artists
                .map((a: any) => a.name.toLowerCase())
                .join(" ");
            const genre = track.track.album.genres
                ? track.track.album.genres.join(" ").toLowerCase()
                : "";

            // Check each filter independently
            if (criteria.titleKeywords.length > 0) {
                if (
                    criteria.titleKeywords.some((keyword) =>
                        title.includes(keyword.toLowerCase())
                    )
                ) {
                    return true;
                }
            }

            if (criteria.genres.length > 0) {
                if (
                    criteria.genres.some((g) => genre.includes(g.toLowerCase()))
                ) {
                    return true;
                }
            }

            if (criteria.artists.length > 0) {
                if (
                    criteria.artists.some((a) =>
                        artist.includes(a.toLowerCase())
                    )
                ) {
                    return true;
                }
            }

            // If no filters are applied, include all tracks
            return (
                criteria.titleKeywords.length === 0 &&
                criteria.genres.length === 0 &&
                criteria.artists.length === 0
            );
        });

        setFilteredTracks(filtered);
    };

    const clearFilters = () => {
        setFilterCriteria({
            titleKeywords: [],
            genres: [],
            artists: [],
        });
        setFilteredTracks([]);
        setSelectedTracks(new Set()); // Clear selected tracks
    };

    const deleteFilteredTracks = async () => {
        if (!session?.accessToken) {
            toast({
                title: "Error",
                description: "You must be logged in to delete tracks.",
                variant: "destructive",
            });
            return;
        }

        try {
            const trackUris = filteredTracks.map((track) => track.track.uri);
            await Promise.all(trackUris.map((uri) => deleteTrack(uri)));

            toast({
                title: "Success",
                description: `${filteredTracks.length} filtered track(s) removed from the playlist.`,
            });

            clearFilters();
            fetchNextPage(); // Refetch tracks after deletion
        } catch (error) {
            console.error("Error deleting filtered tracks:", error);
            toast({
                title: "Error",
                description:
                    "Failed to remove some or all filtered tracks. Please try again.",
                variant: "destructive",
            });
        }
    };

    const sortedAndFilteredTracks = React.useMemo(() => {
        // If there are no filtered tracks, return all sorted tracks
        if (filteredTracks.length === 0) {
            return sortedTracks;
        }

        // Create a Set of filtered track IDs for faster lookup
        const filteredTrackIds = new Set(
            filteredTracks.map((track) => track.track.id)
        );

        // Separate filtered and unfiltered tracks
        const filtered = sortedTracks.filter((track) =>
            filteredTrackIds.has(track.track.id)
        );
        const unfiltered = sortedTracks.filter(
            (track) => !filteredTrackIds.has(track.track.id)
        );

        // Return filtered tracks first, followed by unfiltered tracks
        return [...filtered, ...unfiltered];
    }, [sortedTracks, filteredTracks]);

    if (isLoading) return <div className="p-4">Loading tracks...</div>;
    if (error) return <div className="p-4">Error loading tracks</div>;

    return (
        <div className="h-full flex flex-col">
            <TrackListHeader
                isMultiSelectMode={isMultiSelectMode}
                setIsMultiSelectMode={setIsMultiSelectMode}
                selectedTracks={selectedTracks}
                deleteSelectedTracks={deleteSelectedTracks}
                setIsDialogOpen={setIsDialogOpen}
                savePlaylist={savePlaylist}
                isSaving={isSaving}
                filteredTracksCount={filteredTracks.length}
                onClearFilters={clearFilters}
                onOpenFilterModal={() => setIsFilterModalOpen(true)}
                deleteFilteredTracks={deleteFilteredTracks}
            />
            <FilterTab
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                initialFilters={filterCriteria}
            />
            <div className="p-2 font-semibold border-b grid grid-cols-[auto,auto,2fr,1fr,6rem,6rem,4rem] gap-4 items-center">
                <span></span>
                <SortButton
                    field="number"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                >
                    #
                </SortButton>
                <SortButton
                    field="title"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                >
                    Title
                </SortButton>
                <SortButton
                    field="album"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                >
                    Album
                </SortButton>
                <SortButton
                    field="date"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    icon="calendar"
                />
                <SortButton
                    field="bpm"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    icon="activity"
                />
                <SortButton
                    field="duration"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    icon="clock"
                />
            </div>
            <ScrollArea className="flex-grow">
                <div className="pb-2">
                    {sortedAndFilteredTracks.map((item: any, index: number) => (
                        <TrackItem
                            key={`${item.track.id}-${index}`}
                            item={item}
                            isMultiSelectMode={isMultiSelectMode}
                            selectedTracks={selectedTracks}
                            toggleTrackSelection={toggleTrackSelection}
                            deleteTrack={deleteTrack}
                            isFiltered={filteredTracks.some(
                                (ft) => ft.track.id === item.track.id
                            )}
                        />
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
            <SavePlaylistDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                newPlaylistName={newPlaylistName}
                setNewPlaylistName={setNewPlaylistName}
                savePlaylist={savePlaylist}
                isSaving={isSaving}
            />
        </div>
    );
};

export default TrackList;
