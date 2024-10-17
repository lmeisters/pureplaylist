"use client";

import { usePlaylistTracksQuery } from "@/hooks/usePlaylistTracksQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Music } from "lucide-react";
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

    return (
        <div className="h-full">
            <div className="p-4 font-semibold">Playlist Tracks</div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
                {tracks.map((item: any) => (
                    <div key={item.track.id}>
                        <div className="flex items-center space-x-4 p-4">
                            {item.track.album.images[2]?.url ? (
                                <img
                                    src={item.track.album.images[2].url}
                                    alt={item.track.name}
                                    className="w-10 h-10 rounded"
                                />
                            ) : (
                                <Music className="w-10 h-10 text-muted-foreground" />
                            )}
                            <div>
                                <p className="font-medium">{item.track.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.track.artists
                                        .map((artist: any) => artist.name)
                                        .join(", ")}
                                </p>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))}
                {hasNextPage && (
                    <div ref={ref} className="p-4 text-center">
                        {isFetchingNextPage ? "Loading more..." : "Load more"}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default TrackList;
