"use client";

import React, { useState, useEffect } from "react";
import { usePlaylistTracksQuery } from "@/hooks/usePlaylistTracksQuery";
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

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { SpotifyTrack, AudioFeatures } from "@/types/spotify";

export type SortField =
    | "number"
    | "title"
    | "album"
    | "date"
    | "bpm"
    | "duration";
export type SortOrder = "asc" | "desc";

interface TrackListProps {
    playlistId: string;
    playlistName: string;
    onPlaylistUpdate: () => void;
}

interface PlaylistDetails {
    owner: {
        id: string;
    };
}

// Extend the Session type to include the user id
interface ExtendedSession extends Session {
    user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

const TrackList: React.FC<TrackListProps> = ({
    playlistId,
    playlistName,
    onPlaylistUpdate,
}) => {
    const queryClient = useQueryClient();
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
        titleKeywords: [],
        albums: [],
        artists: [],
    });

    const {
        fetchNextPage,
        hasNextPage,
        isLoading,
        error,
        allTracks,
        filteredTracks,
        isLoadingMore,
        loadingProgress,
        audioFeatures,
        fetchAudioFeatures,
        playlistDetails,
        refetch,
    } = usePlaylistTracksQuery(playlistId, filterCriteria);

    // Add this state to store playlist details
    const [currentPlaylistDetails, setCurrentPlaylistDetails] =
        useState<PlaylistDetails | null>(null);

    // Update currentPlaylistDetails when playlistDetails changes
    useEffect(() => {
        if (playlistDetails) {
            setCurrentPlaylistDetails(playlistDetails);
        }
    }, [playlistDetails]);

    const [sortField, setSortField] = useState<SortField>("number");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedTracks, setSelectedTracks] = useState<Set<string>>(
        new Set()
    );

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const { inView } = useInView();
    const { data: session } = useSession() as { data: ExtendedSession | null };
    const { toast } = useToast();

    // New state to keep track of deleted tracks
    const [deletedTracks, setDeletedTracks] = useState<Set<string>>(new Set());

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
            // Refetch playlist details before saving
            await refetch();

            console.log("Current Playlist Details:", currentPlaylistDetails);
            console.log("Full session object:", session);

            if (!currentPlaylistDetails) {
                throw new Error(
                    "Playlist details are not available. Please try again."
                );
            }

            // For new playlist creation
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

                // Get track URIs excluding deleted tracks
                const trackUris = sortedAndFilteredTracks
                    .filter((item) => !deletedTracks.has(item.track.uri))
                    .map((item) => item.track.uri);

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

                // Add tracks in chunks of 100 (Spotify API limit)
                const chunkSize = 100;
                for (let i = 0; i < trackUris.length; i += chunkSize) {
                    const chunk = trackUris.slice(i, i + chunkSize);
                    const addTracksResponse = await fetch(
                        `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${session.accessToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ uris: chunk }),
                        }
                    );

                    if (!addTracksResponse.ok) {
                        const errorData = await addTracksResponse.json();
                        throw new Error(
                            errorData.error?.message ||
                                "Failed to add tracks to playlist"
                        );
                    }
                }

                console.log("Tracks added to new playlist");
                toast({
                    title: "Success",
                    description: `New playlist "${newPlaylistName}" created with the sorted tracks.`,
                });

                setIsDialogOpen(false);
                setNewPlaylistName("");
            } else {
                // Update existing playlist
                const trackUris = sortedAndFilteredTracks
                    .filter((item) => !deletedTracks.has(item.track.uri))
                    .map((item) => item.track.uri);

                try {
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
                        (oldData: unknown) => {
                            if (oldData && typeof oldData === "object") {
                                return {
                                    ...oldData,
                                    pages: [
                                        {
                                            items: sortedAndFilteredTracks.filter(
                                                (item) =>
                                                    !deletedTracks.has(
                                                        item.track.uri
                                                    )
                                            ),
                                        },
                                    ],
                                };
                            }
                            return oldData;
                        }
                    );

                    toast({
                        title: "Success",
                        description:
                            "Playlist updated with the new track order and deletions.",
                    });
                } catch (error: unknown) {
                    console.error("Spotify API Error:", error);
                    if (
                        error instanceof Error &&
                        "response" in error &&
                        typeof error.response === "object" &&
                        error.response &&
                        "status" in error.response &&
                        error.response.status === 403
                    ) {
                        throw new Error(
                            "You don't have permission to modify this playlist. Please check your Spotify account permissions."
                        );
                    } else {
                        throw error;
                    }
                }
            }

            setDeletedTracks(new Set());
            onPlaylistUpdate();
        } catch (error: unknown) {
            console.error("Error saving playlist:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to save the playlist. Please try again.",
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
            queryClient.setQueryData(
                ["playlistTracks", playlistId],
                (oldData: unknown) => {
                    if (
                        typeof oldData === "object" &&
                        oldData !== null &&
                        "pages" in oldData
                    ) {
                        return {
                            ...oldData,
                            pages: (oldData.pages as any[]).map(
                                (page: any) => ({
                                    ...page,
                                    items: page.items.filter(
                                        (item: SpotifyTrack) =>
                                            item.track.uri !== trackUri
                                    ),
                                })
                            ),
                        };
                    }
                    return oldData;
                }
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

    const deleteSelectedTracks = () => {
        // Update local state only
        setDeletedTracks((prevDeletedTracks) => {
            const newDeletedTracks = new Set(prevDeletedTracks);
            selectedTracks.forEach((track) => newDeletedTracks.add(track));
            return newDeletedTracks;
        });
        setSelectedTracks(new Set());

        toast({
            title: "Tracks Marked for Deletion",
            description: `${selectedTracks.size} track(s) will be removed when you save the playlist.`,
        });
    };

    const applyFilters = (criteria: FilterCriteria) => {
        setFilterCriteria(criteria);
    };

    const clearFilters = () => {
        setFilterCriteria({
            titleKeywords: [],
            albums: [],
            artists: [],
        });
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
        const tracksToSort =
            filteredTracks.length > 0 ? filteredTracks : allTracks;

        let sortedTracks = tracksToSort.filter(
            (track) => !deletedTracks.has(track.track.uri)
        );

        // Apply sorting
        sortedTracks.sort((a: SpotifyTrack, b: SpotifyTrack) => {
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
                    aValue =
                        (audioFeatures[a.track.id] as AudioFeatures)?.tempo ||
                        0;
                    bValue =
                        (audioFeatures[b.track.id] as AudioFeatures)?.tempo ||
                        0;
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

        // If there are filtered tracks, put them at the top
        if (filteredTracks.length > 0) {
            const nonFilteredTracks = allTracks.filter(
                (track) =>
                    !filteredTracks.some((ft) => ft.track.id === track.track.id)
            );
            sortedTracks = [...sortedTracks, ...nonFilteredTracks];
        }

        return sortedTracks;
    }, [
        allTracks,
        filteredTracks,
        sortField,
        sortOrder,
        deletedTracks,
        audioFeatures,
    ]);

    const toggleMultiSelectMode = () => {
        setIsMultiSelectMode(!isMultiSelectMode);
        setSelectedTracks(new Set()); // Clear selections when toggling mode
    };

    const fetchAudioFeaturesForVisibleTracks = (
        startIndex: number,
        stopIndex: number
    ) => {
        const visibleTracks = sortedAndFilteredTracks.slice(
            startIndex,
            stopIndex + 1
        );
        const tracksWithoutAudioFeatures = visibleTracks.filter(
            (track) => !audioFeatures[track.track.id]
        );
        if (tracksWithoutAudioFeatures.length > 0) {
            const trackIds = tracksWithoutAudioFeatures.map(
                (track) => track.track.id
            );
            fetchAudioFeatures(trackIds);
        }
    };

    const Row = ({
        index,
        style,
    }: {
        index: number;
        style: React.CSSProperties;
    }) => {
        const item = sortedAndFilteredTracks[index];
        return (
            <div style={style}>
                <TrackItem
                    key={`${item.track.id}-${item.originalIndex}`}
                    item={{
                        track: item.track,
                        originalIndex: item.originalIndex,
                    }}
                    originalIndex={item.originalIndex}
                    isMultiSelectMode={isMultiSelectMode}
                    selectedTracks={selectedTracks}
                    toggleTrackSelection={toggleTrackSelection}
                    deleteTrack={(uri) =>
                        setDeletedTracks((prevDeletedTracks) => {
                            const newDeletedTracks = new Set(prevDeletedTracks);
                            newDeletedTracks.add(uri);
                            return newDeletedTracks;
                        })
                    }
                    isFiltered={filteredTracks.some(
                        (ft) => ft.track.id === item.track.id
                    )}
                    isDeleted={deletedTracks.has(item.track.uri)}
                    audioFeatures={
                        audioFeatures[item.track.id] as AudioFeatures
                    }
                />
            </div>
        );
    };

    if (isLoading)
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Loading tracks...</p>
                </div>
            </div>
        );
    if (error)
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-red-500">Error loading tracks</p>
            </div>
        );

    return (
        <div className="h-full flex flex-col relative">
            <TrackListHeader
                isMultiSelectMode={isMultiSelectMode}
                toggleMultiSelectMode={toggleMultiSelectMode}
                selectedTracksCount={selectedTracks.size}
                setIsDialogOpen={setIsDialogOpen}
                savePlaylist={savePlaylist}
                isSaving={isSaving}
                filteredTracksCount={filteredTracks.length}
                onClearFilters={clearFilters}
                onOpenFilterModal={() => setIsFilterModalOpen(true)}
                deleteFilteredTracks={deleteFilteredTracks}
                playlistName={playlistName}
                onApplyFilters={applyFilters}
                deleteSelectedTracks={deleteSelectedTracks}
                playlistDetails={currentPlaylistDetails}
            />
            <FilterTab
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                initialFilters={filterCriteria}
            />
            <div className="p-2 font-semibold border-b grid grid-cols-[2rem,2fr,1fr,auto,auto,auto,auto] md:grid-cols-[2rem,2fr,1fr,6rem,6rem,4rem,2rem] gap-2 md:gap-4 items-center text-xs md:text-sm">
                <SortButton
                    field="number"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    className="justify-start pl-2"
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
                    className="hidden md:flex justify-center"
                >
                    Album
                </SortButton>
                <SortButton
                    field="date"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    icon="calendar"
                    className="hidden md:flex justify-center"
                />
                <SortButton
                    field="bpm"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    icon="activity"
                    className="hidden md:flex justify-center"
                />
                <SortButton
                    field="duration"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    icon="clock"
                    className="flex justify-center"
                />
                <div className="flex items-center justify-center">
                    <Checkbox
                        id="multi-select-mode"
                        checked={isMultiSelectMode}
                        onCheckedChange={(checked) =>
                            setIsMultiSelectMode(checked as boolean)
                        }
                    />
                </div>
            </div>
            <div className="flex-grow pb-12">
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            itemCount={sortedAndFilteredTracks.length}
                            itemSize={50}
                            width={width}
                            onItemsRendered={({
                                visibleStartIndex,
                                visibleStopIndex,
                            }) => {
                                fetchAudioFeaturesForVisibleTracks(
                                    visibleStartIndex,
                                    visibleStopIndex
                                );
                            }}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </div>
            <SavePlaylistDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                newPlaylistName={newPlaylistName}
                setNewPlaylistName={setNewPlaylistName}
                savePlaylist={savePlaylist}
                isSaving={isSaving}
            />
            {isLoadingMore && (
                <div
                    className={cn(
                        "fixed bottom-4 left-1/2 transform -translate-x-1/2",
                        "bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-md",
                        "transition-opacity duration-300",
                        "w-11/12 max-w-md", // Adjust width here
                        loadingProgress === 100 ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-xs whitespace-nowrap">
                            Loading all tracks
                        </span>
                        <Progress
                            value={loadingProgress}
                            className="flex-grow"
                        />
                        <span className="text-xs font-medium whitespace-nowrap">
                            {loadingProgress.toFixed(0)}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackList;
