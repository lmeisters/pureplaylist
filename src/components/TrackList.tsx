"use client";

import React from "react";
import { usePlaylistTracksQuery } from "@/hooks/usePlaylistTracksQuery";
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

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Loader2 } from "lucide-react";

interface TrackListProps {
    playlistId: string;
    playlistName: string;
    onPlaylistUpdate: () => void;
}

type SortField = "number" | "title" | "album" | "date" | "bpm" | "duration";
type SortOrder = "asc" | "desc";

const TrackList: React.FC<TrackListProps> = ({
    playlistId,
    playlistName,
    onPlaylistUpdate,
}) => {
    const queryClient = useQueryClient();
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
        titleKeywords: [],
        genres: [],
        artists: [],
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        allTracks,
        filteredTracks,
        isLoadingMore,
        loadingProgress,
        audioFeatures,
        fetchAudioFeatures,
    } = usePlaylistTracksQuery(playlistId, filterCriteria);

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

    const { ref, inView } = useInView();
    const { data: session } = useSession();
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

    useEffect(() => {
        if (data?.pages[0]) {
            setPlaylistDetails(data.pages[0]);
        }
    }, [data]);

    const tracks = data?.pages.flatMap((page) => page.items) || [];

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
            // Filter out deleted tracks
            const trackUris = sortedAndFilteredTracks
                .filter((item) => !deletedTracks.has(item.track.uri))
                .map((item) => item.track.uri);

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
                            {
                                items: sortedAndFilteredTracks.filter(
                                    (item) => !deletedTracks.has(item.track.uri)
                                ),
                            },
                        ],
                    })
                );

                toast({
                    title: "Success",
                    description:
                        "Playlist updated with the new track order and deletions.",
                });
            }

            // Clear the deletedTracks set after successful save
            setDeletedTracks(new Set());

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

    const deleteSelectedTracks = () => {
        // Update local state only
        setDeletedTracks(new Set([...deletedTracks, ...selectedTracks]));
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
            genres: [],
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
        let tracksToSort =
            filteredTracks.length > 0 ? filteredTracks : allTracks;

        let sortedTracks = tracksToSort.filter(
            (track) => !deletedTracks.has(track.track.uri)
        );

        // Apply sorting
        sortedTracks.sort((a, b) => {
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
                    aValue = new Date(
                        a.track?.album?.release_date || 0
                    ).getTime();
                    bValue = new Date(
                        b.track?.album?.release_date || 0
                    ).getTime();
                    break;
                case "bpm":
                    aValue = audioFeatures[a.track.id]?.tempo || 0;
                    bValue = audioFeatures[b.track.id]?.tempo || 0;
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
                    item={item}
                    originalIndex={item.originalIndex}
                    isMultiSelectMode={isMultiSelectMode}
                    selectedTracks={selectedTracks}
                    toggleTrackSelection={toggleTrackSelection}
                    deleteTrack={(uri) =>
                        setDeletedTracks(new Set([...deletedTracks, uri]))
                    }
                    isFiltered={filteredTracks.some(
                        (ft) => ft.track.id === item.track.id
                    )}
                    isDeleted={deletedTracks.has(item.track.uri)}
                    audioFeatures={audioFeatures[item.track.id]}
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
                onClearFilters={clearFilters}
                deleteSelectedTracks={deleteSelectedTracks}
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
