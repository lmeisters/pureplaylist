import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioFeatures } from "@/types/spotify";

interface TrackItemProps {
    item: {
        track: {
            id: string;
            uri: string;
            name: string;
            artists: Array<{ name: string }>;
            album: {
                name: string;
                images: Array<{ url: string }>;
                release_date: string;
            };
            duration_ms: number;
        };
        originalIndex: number;
    };
    originalIndex: number;
    isMultiSelectMode: boolean;
    selectedTracks: Set<string>;
    toggleTrackSelection: (trackUri: string) => void;
    deleteTrack: (trackUri: string) => void;
    isFiltered: boolean;
    isDeleted: boolean;
    audioFeatures: AudioFeatures | null;
}

export const TrackItem: React.FC<TrackItemProps> = ({
    item,
    originalIndex,
    isMultiSelectMode,
    selectedTracks,
    toggleTrackSelection,
    deleteTrack,
    isFiltered,
    isDeleted,
    audioFeatures,
}) => {
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDuration = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleDelete = () => {
        deleteTrack(item.track.uri);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div
                className={`grid grid-cols-[2rem,2fr,1fr,auto,auto,auto,auto] md:grid-cols-[2rem,2fr,1fr,6rem,6rem,4rem,2rem] gap-2 md:gap-4 items-center p-2 text-xs md:text-sm hover:bg-accent/50 relative ${
                    isFiltered ? "bg-yellow-50" : ""
                } ${isDeleted ? "opacity-50 line-through" : ""}`}
            >
                <div className="text-sm text-muted-foreground pl-2">
                    {originalIndex}
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                    <div className="relative w-10 h-10 flex-shrink-0">
                        {!imageLoaded && (
                            <Skeleton className="absolute inset-0 w-10 h-10 rounded-sm" />
                        )}
                        <Image
                            src={
                                item.track.album.images[0]?.url ||
                                "/placeholder-album.png"
                            }
                            alt={item.track.album.name}
                            width={40}
                            height={40}
                            className={`rounded-sm ${
                                imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-full">
                            {item.track.name}
                        </span>
                        <span className="text-muted-foreground truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-full">
                            {item.track.artists
                                .map((artist: { name: string }) => artist.name)
                                .join(", ")}
                        </span>
                    </div>
                </div>
                <div className="truncate hidden md:block">
                    {item.track.album.name}
                </div>
                <div className="text-sm text-muted-foreground hidden md:block text-right">
                    {formatDate(item.track.album.release_date)}
                </div>
                <div className="text-sm text-muted-foreground hidden md:block text-right">
                    {audioFeatures?.tempo
                        ? `${audioFeatures.tempo.toFixed(0)} BPM`
                        : "-"}
                </div>
                <div className="text-sm text-muted-foreground text-right">
                    {formatDuration(item.track.duration_ms)}
                </div>
                <div className="flex items-center justify-center">
                    {isMultiSelectMode ? (
                        <Checkbox
                            checked={selectedTracks.has(item.track.uri)}
                            onCheckedChange={() =>
                                toggleTrackSelection(item.track.uri)
                            }
                        />
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </div>
            <AlertDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove "{item.track.name}"
                            from the playlist?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
