"use client";

import { usePlaylistTracksQuery } from "@/hooks/usePlaylistTracksQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Music, Calendar, Activity, Clock } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface TrackListProps {
    playlistId: string;
}

const TrackList: React.FC<TrackListProps> = ({ playlistId }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = usePlaylistTracksQuery(playlistId);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if (isLoading) return <div className="p-4">Loading tracks...</div>;
    if (error) return <div className="p-4">Error loading tracks</div>;

    const tracks = data?.pages.flatMap((page) => page.items) || [];

    function formatDuration(ms: number): string {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 font-semibold border-b">Playlist Tracks</div>
            <div className="p-2 font-semibold border-b grid grid-cols-[auto,2fr,1fr,6rem,6rem,4rem] gap-4 items-center">
                <span className="w-8 text-center">#</span>
                <span>Title</span>
                <span>Album</span>
                <Calendar className="w-4 h-4 ml-2" />
                <Activity className="w-4 h-4 ml-2" />
                <Clock className="w-4 h-4 ml-2" />
            </div>
            <ScrollArea className="flex-grow">
                <div className="pb-2">
                    {tracks.map((item: any, index: number) => (
                        <div key={item.track.id}>
                            <div className="grid grid-cols-[auto,2fr,1fr,6rem,6rem,4rem] gap-4 items-center p-2">
                                <span className="w-8 text-center text-muted-foreground">
                                    {index + 1}
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
