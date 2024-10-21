import { Music, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TrackItemProps {
    item: any;
    originalIndex: number;
    isMultiSelectMode: boolean;
    selectedTracks: Set<string>;
    toggleTrackSelection: (trackUri: string) => void;
    deleteTrack: (trackUri: string) => void;
    isFiltered: boolean;
    isDeleted: boolean;
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

    return (
        <div
            className={`grid grid-cols-[auto,2fr,1fr,auto,auto,auto,auto] md:grid-cols-[auto,2fr,1fr,6rem,6rem,4rem,auto] gap-2 md:gap-4 items-center p-2 hover:bg-accent/10 ${
                isFiltered ? "bg-yellow-50" : ""
            } ${isDeleted ? "opacity-50 line-through" : ""}`}
        >
            <div className="text-sm text-muted-foreground">{originalIndex}</div>
            <div className="flex items-center space-x-2 min-w-0">
                <img
                    src={item.track.album.images[2]?.url || "/placeholder.png"}
                    alt={item.track.album.name}
                    className="w-8 h-8 rounded"
                />
                <div className="truncate">
                    <p className="font-medium truncate">{item.track.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                        {item.track.artists.map((a: any) => a.name).join(", ")}
                    </p>
                </div>
            </div>
            <div className="truncate hidden md:block">
                {item.track.album.name}
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
                {formatDate(item.track.album.release_date)}
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
                {item.audioFeatures?.tempo?.toFixed(0) || "-"}
            </div>
            <div className="text-sm text-muted-foreground">
                {formatDuration(item.track.duration_ms)}
            </div>
            <div className="flex items-center justify-end">
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
            {/* ... existing DeleteConfirmDialog ... */}
        </div>
    );
};
