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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

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

    const { ref, inView } = useInView();

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

    if (isLoading) return <div className="p-4">Loading tracks...</div>;
    if (error) return <div className="p-4">Error loading tracks</div>;

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

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 font-semibold border-b">Playlist Tracks</div>
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
