import { Music, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface TrackItemProps {
    item: any;
    isMultiSelectMode: boolean;
    selectedTracks: Set<string>;
    toggleTrackSelection: (trackUri: string) => void;
    deleteTrack: (trackUri: string) => void;
    isFiltered: boolean;
    isDeleted: boolean;
}

export const TrackItem: React.FC<TrackItemProps> = ({
    item,
    isMultiSelectMode,
    selectedTracks,
    toggleTrackSelection,
    deleteTrack,
    isFiltered,
    isDeleted,
}) => {
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDuration = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div key={item.track.id}>
            <div
                className={`grid grid-cols-[auto,2fr,1fr,6rem,6rem,4rem,auto] gap-4 items-center p-2 ${
                    isFiltered ? "bg-yellow-100" : ""
                } ${isDeleted ? "opacity-50" : ""}`}
            >
                <span className="w-8 text-center text-muted-foreground">
                    {item.originalIndex}
                </span>
                <div className="flex items-center space-x-4">
                    {item.track.album?.images &&
                    item.track.album.images[2]?.url ? (
                        <img
                            src={item.track.album.images[2].url}
                            alt={item.track.name}
                            className="w-10 h-10 rounded-md"
                        />
                    ) : (
                        <Music className="w-10 h-10 text-muted-foreground" />
                    )}
                    <div>
                        <p className="font-medium">{item.track.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {item.track.artists && item.track.artists.length > 0
                                ? item.track.artists
                                      .map((artist: any) => artist.name)
                                      .join(", ")
                                : "Unknown Artist"}
                        </p>
                    </div>
                </div>
                <span className="text-sm text-muted-foreground truncate">
                    {item.track.album?.name || "Unknown Album"}
                </span>
                <span className="text-sm text-muted-foreground">
                    {formatDate(item.track.album?.release_date || "")}
                </span>
                <span className="text-sm text-muted-foreground">
                    {item.audioFeatures?.tempo?.toFixed(0) || "N/A"} BPM
                </span>
                <span className="text-sm text-muted-foreground">
                    {formatDuration(item.track.duration_ms)}
                </span>
                <div className="flex items-center space-x-2">
                    {isMultiSelectMode ? (
                        <Checkbox
                            checked={selectedTracks.has(item.track.uri)}
                            onCheckedChange={() =>
                                toggleTrackSelection(item.track.uri)
                            }
                        />
                    ) : (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will remove the track "
                                        {item.track.name}" from the playlist.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            deleteTrack(item.track.uri)
                                        }
                                    >
                                        Remove
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
            <Separator />
        </div>
    );
};
